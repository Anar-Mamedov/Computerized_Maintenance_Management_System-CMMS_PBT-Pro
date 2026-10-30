import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import useKolonAyarlari from "../../../../utils/components/KolonAyarlari/useKolonAyarlari";
import { getOzelAlanBasliklari } from "./ekipmanService";
import { DEPOLAMA_ANAHTARLARI, KOLONLAR } from "./constants";

/**
 * Ekipman Listesi kolonlari. Sira, gorunurluk ve genislik global `useKolonAyarlari` ile tarayicida saklanir; burada
 * yalnizca ekrana ozel kisim vardir: ozel alan basliklari API'den gelir ve eski tablodan gelen (varsayilan gizli)
 * kolonlar, veri alanlari API yanitinda gorulduyse sunulur; boylece yeni listenin dondurmedigi alanlar icin hep bos
 * kalan kolon cikmaz.
 */
export default function useEkipmanKolonlari(satirlar) {
  const { t } = useTranslation();
  const [ozelAlanBasliklari, setOzelAlanBasliklari] = useState({});
  const [gelenAlanlar, setGelenAlanlar] = useState(() => new Set());

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

  const tanimlar = useMemo(() => {
    const basligi = (tanim) => {
      if (tanim.baslik) return tanim.baslik;
      if (tanim.ozelAlanNo) return ozelAlanBasliklari[`OZL_OZEL_ALAN_${tanim.ozelAlanNo}`] || t("ekipmanListesi.kolon.ozelAlan", { no: tanim.ozelAlanNo });
      return t(tanim.labelKey);
    };
    return KOLONLAR.map((tanim) => ({ ...tanim, baslik: basligi(tanim) }));
  }, [ozelAlanBasliklari, t]);

  const ayarlar = useKolonAyarlari(tanimlar, DEPOLAMA_ANAHTARLARI.kolonlar);

  // Kullanicinin actigi kolon, veri gelmeden once de yerinde durur (yuklenirken kaymaz).
  const kolonlar = useMemo(() => ayarlar.kolonlar.filter((kolon) => !kolon.varsayilanGizli || kolon.gorunur || gelenAlanlar.has(kolon.alan)), [ayarlar.kolonlar, gelenAlanlar]);

  return { ...ayarlar, kolonlar };
}
