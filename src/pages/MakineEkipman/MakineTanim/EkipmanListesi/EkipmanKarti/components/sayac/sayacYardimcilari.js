/** KodIDSelectbox kod gruplari. */
export const SAYAC_TIPI_KOD_GRUBU = 32702;
export const SAYAC_BIRIMI_KOD_GRUBU = 32701;

/** API'de evet/hayir alanlari true/false ya da 1/0 gelebilir. */
export const bayrak = (deger) => deger === true || deger === 1 || deger === "1";

/** Liste kaydindan modallarin kullandigi sayac ozeti. */
export const sayacOzeti = (kayit) => ({
  sayacId: kayit.TB_SAYAC_ID,
  tanim: kayit.MES_TANIM,
  guncelDeger: kayit.MES_GUNCEL_DEGER,
  birim: kayit.MES_SAYAC_BIRIM ?? kayit.MES_BIRIM,
  guncellemeSekli: kayit.MES_GUNCELLEME_SEKLI,
});
