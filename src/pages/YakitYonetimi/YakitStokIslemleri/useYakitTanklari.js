import { useCallback, useEffect, useState } from "react";
import { message } from "antd";
import { useTranslation } from "react-i18next";
import { hataMetni } from "../ortak/yakitApi";
import { getYakitList, getYakitTankList } from "./yakitStokIslemService";

/** Uc bazi ortamlarda listeyi dogrudan, bazilarinda `data` icinde donuyor. */
const listeyiAl = (yanit) => {
  if (Array.isArray(yanit)) return yanit;
  if (Array.isArray(yanit?.data)) return yanit.data;
  return Array.isArray(yanit?.data?.data) ? yanit.data.data : [];
};

/**
 * Fis formunun tank secenekleri (GetYakitTankList, yalnizca aktif tanklar) ve varsayilan birim fiyat icin yakit
 * kartlari (GetYakitList). Kayit, guncelleme ve silmeden sonra tank stoklari degistigi icin `yenile` cagrilir.
 */
export default function useYakitTanklari() {
  const { t } = useTranslation();
  const [tanklar, setTanklar] = useState([]);
  const [yakitKartlari, setYakitKartlari] = useState([]);
  const [yukleniyor, setYukleniyor] = useState(false);

  const yenile = useCallback(async () => {
    setYukleniyor(true);
    try {
      const [tankYaniti, yakitYaniti] = await Promise.all([getYakitTankList(), getYakitList()]);
      setTanklar(listeyiAl(tankYaniti));
      setYakitKartlari(listeyiAl(yakitYaniti));
    } catch (error) {
      message.error(hataMetni(error, t));
    } finally {
      setYukleniyor(false);
    }
  }, [t]);

  useEffect(() => {
    yenile();
  }, [yenile]);

  return { tanklar, yakitKartlari, yukleniyor, yenile };
}
