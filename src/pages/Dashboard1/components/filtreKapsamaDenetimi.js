import { FIELD_ALIASES, HEDEFE_OZEL_ALAN_ADLARI, buildTargetUrl } from "./navigation";
import { readDashboardFilterParams } from "../../../utils/dashboardFilterParams";

/**
 * Geliştirme modunda çalışan kapsama denetimi.
 *
 * Dashboard API'lerinin döndürdüğü her `FilterParams` alanının, tıklanınca açılan
 * ekranın gerçekten attığı isteğe ulaşıp ulaşmadığını kontrol eder. Amaç, backend
 * yeni bir filtre alanı eklediğinde (ör. `stoktaYok`) bunun sessizce düşmesini engellemek.
 *
 * Yalnızca `import.meta.env.DEV` altında çağrılır; üretimde hiçbir şey yapmaz.
 */

// Hedef ekranların kodunun liste isteğine GERÇEKTEN taşıdığı alanlar.
// "*" = filtre nesnesinin tamamı gövdeye gidiyor.
const EKRANIN_TASIDIGI_ALANLAR = {
  "is-emri": "*",
  "is-talebi": "*",
  makine: "*",
  "periyodik-bakim": "*",
  // Stok listesi GET; ekran query'ye yalnızca bu alanları yazıyor.
  stok: ["isAktif", "kritik", "stoktaYok"],
  // Sağ panel açılıyor, liste API'si yok.
  hatirlatici: [],
  "bakim-takvimi": [],
};

/**
 * Ad eşleşmeleri navigation.js'teki tablolardan türetilir; denetimin ayrı bir kopyası olsaydı
 * ikisi zamanla ayrışır ve denetim sahte uyarı üretirdi (bir kez öyle oldu).
 * Buradaki ekler yalnızca ekran bazlı yeniden adlandırmalar (dashboardFilterParams.js).
 */
const EKRAN_BAZLI_ADLAR = {
  atolyeler: ["atolye"],
  onaydurumlari: ["onayDurumlari"],
  customfilters: ["customfilter"],
  startdate: ["customfilters", "customfilter"],
  enddate: ["customfilters", "customfilter"],
  ay: ["customfilters", "customfilter"],
  periyot: ["customfilters", "customfilter"],
};

const olasiAdlar = (alan, hedef) => {
  const kucuk = String(alan).toLowerCase();
  const hedefeOzel = HEDEFE_OZEL_ALAN_ADLARI[hedef] || {};

  return [
    alan,
    ...(hedefeOzel[kucuk] ? [hedefeOzel[kucuk]] : []),
    ...(FIELD_ALIASES[kucuk] ? [FIELD_ALIASES[kucuk]] : []),
    ...(EKRAN_BAZLI_ADLAR[kucuk] || []),
  ];
};

/** Bir FilterParams alanı hedef ekranın isteğine ulaşıyor mu? */
function alanUlasiyorMu(alan, deger, cozulen, hedef) {
  const tasinanlar = EKRANIN_TASIDIGI_ALANLAR[hedef];
  if (!tasinanlar) return { ulasti: false, sebep: "hedef ekran tanımlı değil" };

  // Liste API'si olmayan hedefler (hatırlatıcı paneli, bakım takvimi) filtre alamaz.
  // Bu bir eksik değil, hedefin doğası; hata olarak değil bilgi olarak raporlanır.
  if (Array.isArray(tasinanlar) && tasinanlar.length === 0) {
    return { ulasti: false, bilgi: true, sebep: "hedefin liste API'si yok — filtre uygulanacak yer yok" };
  }

  const adaylar = olasiAdlar(alan, hedef);

  // isClose / isAktif gövde yerine query parametresi olarak gidiyor.
  if (adaylar.includes("isClose") && cozulen.isClose !== null) return { ulasti: true };
  if (adaylar.includes("isAktif") && cozulen.isAktif !== null) return { ulasti: true };

  const bulunanAd = adaylar.find((ad) => cozulen.filters[ad] !== undefined);
  if (!bulunanAd) {
    return { ulasti: false, sebep: "URL'den okunamadı", beklenen: JSON.stringify(deger) };
  }

  if (Array.isArray(tasinanlar) && !tasinanlar.includes(bulunanAd)) {
    return { ulasti: false, sebep: `ekran bu alanı isteğe yazmıyor (taşıdıkları: ${tasinanlar.join(", ")})` };
  }

  return { ulasti: true };
}

/** Response içindeki TargetPage + FilterParams taşıyan tüm düğümleri toplar. */
function tiklanabilirOgeleriTopla(dugum, yol = "", toplanan = []) {
  if (!dugum || typeof dugum !== "object") return toplanan;

  if (Array.isArray(dugum)) {
    dugum.forEach((oge, index) => tiklanabilirOgeleriTopla(oge, `${yol}[${index}]`, toplanan));
    return toplanan;
  }

  const hedefAnahtarlari = Object.keys(dugum).filter((anahtar) => anahtar.startsWith("TargetPage"));

  hedefAnahtarlari.forEach((hedefAnahtari) => {
    // TargetPage -> FilterParams, TargetPageIsEmri -> FilterParamsIsEmri gibi eşleşir.
    const sonek = hedefAnahtari.replace("TargetPage", "");
    const filtreAnahtari = `FilterParams${sonek}`;
    const filtreler = dugum[filtreAnahtari] ?? (sonek ? undefined : dugum.FilterParams);

    toplanan.push({
      yol: yol || "(kök)",
      etiket: dugum.Label || dugum.Key || dugum.MakineTipi || dugum.EkipmanEtiketi || dugum.Personel || yol || "(kök)",
      hedef: dugum[hedefAnahtari],
      filtreAnahtari,
      filtreler: filtreler || {},
    });
  });

  Object.entries(dugum).forEach(([anahtar, deger]) => {
    if (deger && typeof deger === "object") tiklanabilirOgeleriTopla(deger, yol ? `${yol}.${anahtar}` : anahtar, toplanan);
  });

  return toplanan;
}

/**
 * Bir dashboard API yanıtını denetler ve taşınmayan filtre alanlarını konsola yazar.
 * `globalFilters` dashboard üst barının o anki filtreleri.
 */
export function widgetFiltreKapsamasiniDenetle(endpoint, response, globalFilters) {
  const ogeler = tiklanabilirOgeleriTopla(response);
  if (!ogeler.length) return [];

  const bulgular = [];
  const bilgiler = [];

  ogeler.forEach((oge) => {
    const alanlar = Object.keys(oge.filtreler || {});
    if (!alanlar.length) return;

    // Denetim yalnızca gözlem yapar: buildTargetUrl yan etkisizdir.
    // navigateToTarget çağrılsaydı "hatirlatici" hedefi her veri yenilemesinde
    // hatırlatıcı panelini açardı.
    let url = null;
    try {
      url = buildTargetUrl(oge.hedef, oge.filtreler, globalFilters);
    } catch (error) {
      bulgular.push({ ...oge, alan: "(tümü)", sebep: `URL üretilemedi: ${error?.message}` });
      return;
    }

    const cozulen = url === null ? { filters: {}, isClose: null, isAktif: null } : readDashboardFilterParams(url.includes("?") ? url.split("?")[1] : "");

    alanlar.forEach((alan) => {
      // null/undefined deger "kisit yok" anlamina gelir (or. Toplam satirinda isClose: null).
      const deger = oge.filtreler[alan];
      if (deger === null || deger === undefined) return;

      const sonuc = alanUlasiyorMu(alan, deger, cozulen, oge.hedef);
      if (sonuc.ulasti) return;

      (sonuc.bilgi ? bilgiler : bulgular).push({
        endpoint,
        etiket: oge.etiket,
        hedef: oge.hedef,
        alan,
        deger: JSON.stringify(deger),
        sebep: sonuc.sebep,
      });
    });
  });

  if (bulgular.length) {
    console.group(`%c[Filtre kapsama] ${endpoint}: ${bulgular.length} alan hedefe ulaşmıyor`, "color:#b42318;font-weight:600");
    console.table(bulgular, ["etiket", "hedef", "alan", "deger", "sebep"]);
    console.groupEnd();
  } else {
    console.info(`%c[Filtre kapsama] ${endpoint}: tüm FilterParams alanları hedefe ulaşıyor`, "color:#0f6e5c");
  }

  if (bilgiler.length) {
    console.info(`%c[Filtre kapsama] ${endpoint}: ${bilgiler.map((x) => `${x.etiket} → ${x.alan}`).join(", ")} (hedefin liste API'si yok)`, "color:#9a5b00");
  }

  return bulgular;
}
