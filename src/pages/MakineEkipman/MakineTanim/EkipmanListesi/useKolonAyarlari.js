import { useCallback, useEffect, useMemo, useState } from "react";
import { arrayMove } from "@dnd-kit/sortable";
import { useTranslation } from "react-i18next";
import { getOzelAlanBasliklari } from "./ekipmanService";
import { DEPOLAMA_ANAHTARLARI, KOLONLAR } from "./constants";
import { tercihOku, tercihYaz } from "./tercihler";

const KOLON_TANIMLARI = Object.fromEntries(KOLONLAR.map((kolon) => [kolon.key, kolon]));

const varsayilanDurum = () => KOLONLAR.map((kolon) => ({ key: kolon.key, gorunur: !kolon.varsayilanGizli, genislik: kolon.genislik }));

/** Kayitli tercih okunur; sonradan eklenen kolonlar sona eklenir, artik olmayanlar atilir. */
const kayitliDurumuOku = () => {
  const kayitli = tercihOku(DEPOLAMA_ANAHTARLARI.kolonlar, null);
  if (!Array.isArray(kayitli)) return varsayilanDurum();

  const bilinenler = kayitli
    .filter((kolon) => KOLON_TANIMLARI[kolon?.key])
    .map((kolon) => ({
      key: kolon.key,
      gorunur: Boolean(kolon.gorunur),
      genislik: Number(kolon.genislik) > 0 ? Number(kolon.genislik) : KOLON_TANIMLARI[kolon.key].genislik,
    }));
  const eksikler = varsayilanDurum().filter((varsayilan) => !bilinenler.some((kolon) => kolon.key === varsayilan.key));

  return [...bilinenler, ...eksikler];
};

/**
 * Kolonlarin sirasi, gorunurlugu ve genisligi; eski tablodaki gibi tarayicida saklanir.
 * Eski tablodan gelen (varsayilan gizli) kolonlar, veri alanlari API yanitinda gorulduyse sunulur;
 * boylece yeni listenin dondurmedigi alanlar icin hep bos kalan kolon cikmaz.
 */
export default function useKolonAyarlari(satirlar) {
  const { t } = useTranslation();
  const [durum, setDurum] = useState(kayitliDurumuOku);
  const [ozelAlanBasliklari, setOzelAlanBasliklari] = useState({});
  const [gelenAlanlar, setGelenAlanlar] = useState(() => new Set());

  useEffect(() => {
    tercihYaz(DEPOLAMA_ANAHTARLARI.kolonlar, durum);
  }, [durum]);

  useEffect(() => {
    let iptal = false;
    getOzelAlanBasliklari()
      .then((yanit) => {
        if (!iptal && yanit && typeof yanit === "object") setOzelAlanBasliklari(yanit);
      })
      .catch((error) => console.error("Özel alan başlıkları alınamadı:", error));

    return () => {
      iptal = true;
    };
  }, []);

  // Bir kez gorulen alan kalir; bos sonuc donen bir sayfada kolonlar kaybolmaz.
  useEffect(() => {
    if (!satirlar.length) return;
    setGelenAlanlar((onceki) => {
      const yeniAlanlar = Object.keys(satirlar[0]).filter((alan) => !onceki.has(alan));
      return yeniAlanlar.length ? new Set([...onceki, ...yeniAlanlar]) : onceki;
    });
  }, [satirlar]);

  const kolonlar = useMemo(() => {
    const basligi = (tanim) => {
      if (tanim.baslik) return tanim.baslik;
      if (tanim.ozelAlanNo) return ozelAlanBasliklari[`OZL_OZEL_ALAN_${tanim.ozelAlanNo}`] || t("ekipmanListesi.kolon.ozelAlan", { no: tanim.ozelAlanNo });
      return t(tanim.labelKey);
    };

    // Kullanicinin actigi kolon, veri gelmeden once de yerinde durur (yuklenirken kaymaz).
    return durum
      .map((kolon) => ({ ...KOLON_TANIMLARI[kolon.key], ...kolon }))
      .filter((kolon) => !kolon.varsayilanGizli || kolon.gorunur || gelenAlanlar.has(kolon.alan))
      .map((kolon) => ({ ...kolon, baslik: basligi(kolon) }));
  }, [durum, gelenAlanlar, ozelAlanBasliklari, t]);

  const gorunurKolonlar = useMemo(() => kolonlar.filter((kolon) => kolon.gorunur), [kolonlar]);

  const gorunurlukDegistir = useCallback((key, gorunur) => {
    setDurum((onceki) => onceki.map((kolon) => (kolon.key === key ? { ...kolon, gorunur } : kolon)));
  }, []);

  const siraDegistir = useCallback((kaynakKey, hedefKey) => {
    setDurum((onceki) => {
      const kaynak = onceki.findIndex((kolon) => kolon.key === kaynakKey);
      const hedef = onceki.findIndex((kolon) => kolon.key === hedefKey);
      return kaynak === -1 || hedef === -1 ? onceki : arrayMove(onceki, kaynak, hedef);
    });
  }, []);

  const genislikDegistir = useCallback((key, genislik) => {
    setDurum((onceki) => onceki.map((kolon) => (kolon.key === key ? { ...kolon, genislik } : kolon)));
  }, []);

  const sifirla = useCallback(() => setDurum(varsayilanDurum()), []);

  return { kolonlar, gorunurKolonlar, gorunurlukDegistir, siraDegistir, genislikDegistir, sifirla };
}
