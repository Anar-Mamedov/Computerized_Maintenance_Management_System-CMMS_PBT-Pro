import { donemAraligi } from "../../../utils/donemSecimi";

/**
 * Iki ekranin ortak filtre formu (dokuman 1.1 "Tek Ortak Filtre Objesi"). Sure varsayilani "Bu Ay"dir.
 * `lokasyonTanim` yalnizca LokasyonTablo'nun gosterdigi metindir, istege gitmez.
 */
export const ortakFiltreVarsayilanlari = () => {
  const [baslangicTarihi, bitisTarihi] = donemAraligi("buAy");
  return {
    donem: "buAy",
    baslangicTarihi,
    bitisTarihi,
    lokasyonTanim: "",
    lokasyonIds: [],
    yakitTipIds: [],
  };
};

const gun = (tarih) => (tarih ? tarih.format("YYYY-MM-DD") : null);

/**
 * Form degerlerinden `YakitOrtakFiltre` govdesi. `YakitStokIds` dokumanda opsiyoneldir; ekranlarda yakit karti
 * secimi olmadigi icin bos gider.
 */
export const ortakFiltreGovdesi = ({ baslangicTarihi, bitisTarihi, lokasyonIds, yakitTipIds }) => ({
  BaslangicTarihi: gun(baslangicTarihi),
  BitisTarihi: gun(bitisTarihi),
  LokasyonIds: Array.isArray(lokasyonIds) ? lokasyonIds : [],
  YakitTipIds: Array.isArray(yakitTipIds) ? yakitTipIds : [],
  YakitStokIds: [],
});

/** TB_STOK.STK_TIP_KOD_ID kod grubu (Motorin, Benzin, LPG, AdBlue...); Yakit Depolari ekranindaki filtreyle ayni. */
export const YAKIT_TIPI_KOD_GRUBU = 35600;
