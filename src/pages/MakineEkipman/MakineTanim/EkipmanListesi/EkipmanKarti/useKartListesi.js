import { useCallback, useEffect, useRef, useState } from "react";
import { message } from "antd";
import { useTranslation } from "react-i18next";

/**
 * Kart sekmelerinin listelerini ceker. `makineId` degisince yuklenir, `yenile` ile tekrar cekilir.
 * Yalnizca en son istegin yaniti ekrana yazilir (yanit yarisi, bkz. knowledge-base).
 * getir(makineId) ve hazirla(yanit) bilesen disinda tanimli (sabit) fonksiyonlar olmalidir.
 */
export default function useKartListesi(getir, makineId, hazirla) {
  const { t } = useTranslation();
  const [kayitlar, setKayitlar] = useState([]);
  const [yukleniyor, setYukleniyor] = useState(false);
  const istekSirasiRef = useRef(0);

  const yenile = useCallback(async () => {
    istekSirasiRef.current += 1;
    const istekSirasi = istekSirasiRef.current;
    const guncelMi = () => istekSirasi === istekSirasiRef.current;

    if (!makineId) {
      setKayitlar([]);
      setYukleniyor(false);
      return;
    }

    setYukleniyor(true);
    try {
      const yanit = await getir(makineId);
      if (!guncelMi()) return;
      setKayitlar(hazirla(yanit));
    } catch (hata) {
      if (!guncelMi()) return;
      console.error("Ekipman karti listesi alinamadi:", hata);
      setKayitlar([]);
      message.error(t("ekipmanKarti.listeAlinamadi"));
    } finally {
      if (guncelMi()) setYukleniyor(false);
    }
  }, [getir, makineId, hazirla, t]);

  useEffect(() => {
    yenile();
  }, [yenile]);

  return { kayitlar, yukleniyor, yenile };
}
