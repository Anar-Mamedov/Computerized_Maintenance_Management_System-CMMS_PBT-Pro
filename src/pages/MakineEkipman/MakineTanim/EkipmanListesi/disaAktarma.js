import * as XLSX from "xlsx";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import { bakimDurumunuBul } from "./ekipmanMetinleri";

dayjs.extend(localizedFormat);

// Eski tablolardaki "İndir" ile ayni: Excel sutun genisligi = tablodaki kolon genisligi x 0.8 (piksel).
const GENISLIK_OLCEGI = 0.8;

/**
 * Bir tablo kolonunun Excel sutunlari. Tabloda tek hucrede birlesen bilgiler (kod + tanim, lokasyon + ana
 * lokasyon, bakim durumu + tarihi) ayri sutunlara acilir; diger kolonlar `alan` degerini yazar.
 */
const excelSutunlari = (kolon, t, dil) => {
  switch (kolon.tur) {
    case "ekipman":
      return [
        { baslik: t("ekipmanKodu"), alan: "MKN_KOD" },
        { baslik: t("ekipmanTanimi"), alan: "MKN_TANIM" },
      ];
    case "lokasyon":
      return [
        { baslik: kolon.baslik, alan: "MKN_LOKASYON" },
        { baslik: t("ekipmanListesi.anaLokasyon"), alan: "MKN_ANA_LOKASYON" },
      ];
    case "durum":
      return [{ baslik: kolon.baslik, alan: "MKN_DURUM", deger: (satir) => satir.MKN_DURUM || (satir.MKN_AKTIF === false ? t("pasif") : t("aktif")) }];
    case "bakim":
      return [
        {
          baslik: kolon.baslik,
          alan: "BAKIM_DURUM",
          deger: (satir) => {
            const bakim = bakimDurumunuBul(satir.BAKIM_DURUM);
            return bakim ? t(bakim.labelKey) : "";
          },
        },
        {
          baslik: t("ekipmanListesi.sonrakiBakim"),
          alan: "BAKIM_HEDEF_TARIH",
          deger: (satir) => (satir.BAKIM_HEDEF_TARIH ? dayjs(satir.BAKIM_HEDEF_TARIH).locale(dil).format("L") : ""),
        },
      ];
    case "evetHayir":
      return [{ baslik: kolon.baslik, alan: kolon.alan, deger: (satir) => (satir[kolon.alan] ? t("evet") : t("hayir")) }];
    default:
      return [{ baslik: kolon.baslik, alan: kolon.alan }];
  }
};

/**
 * Listeyi eski tablolardaki "İndir" gibi indirir: tabloda gorunen kolonlar, tablodaki sirasi ve basligiyla
 * "Sheet1" sayfasina yazilir, dosya tarayicida indirilir.
 */
export function exceleAktar(kayitlar, gorunurKolonlar, t, dil) {
  // Ayni alan iki kolondan gelirse (or. Lokasyon kolonundaki ana lokasyon + Ana Lokasyon kolonu) bir kez yazilir.
  const kullanilanAlanlar = new Set();
  const sutunlar = gorunurKolonlar
    .flatMap((kolon) => excelSutunlari(kolon, t, dil).map((sutun) => ({ ...sutun, genislik: kolon.genislik })))
    .filter((sutun) => {
      if (kullanilanAlanlar.has(sutun.alan)) return false;
      kullanilanAlanlar.add(sutun.alan);
      return true;
    });

  const satirlar = kayitlar.map((kayit) => sutunlar.map((sutun) => (sutun.deger ? sutun.deger(kayit) : kayit[sutun.alan]) ?? ""));
  const worksheet = XLSX.utils.aoa_to_sheet([sutunlar.map((sutun) => sutun.baslik), ...satirlar]);
  worksheet["!cols"] = sutunlar.map((sutun) => ({ wpx: sutun.genislik ? sutun.genislik * GENISLIK_OLCEGI : 100 }));

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `${t("ekipmanListesi.baslik")}.xlsx`);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  // Indirme baslayana kadar adres gecerli kalsin.
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
