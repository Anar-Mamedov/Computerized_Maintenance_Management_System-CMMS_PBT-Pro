import { apiTarihi, formTarihi, metinYaDaNull, sayiYaDaNull } from "../../yardimcilar";
import { bayrak } from "./sayacYardimcilari";

export const OZEL_ALAN_NUMARALARI = Array.from({ length: 10 }, (_, index) => index + 1);

/** Guncelleme sekli: 0 yok, 1 okunan deger, 2 artis deger. Tanimsizsa okunan deger. */
const guncellemeSekli = (deger) => {
  const sayi = sayiYaDaNull(deger);
  return [0, 1, 2].includes(sayi) ? sayi : 1;
};

export const SAYAC_FORM_VARSAYILANLARI = {
  sayacTanim: "",
  sayacTipi: null,
  sayacTipiID: null,
  sayacBirimi: null,
  sayacBirimiID: null,
  sayacDegeri: null,
  sayacAktif: true,
  sayacVarsayilan: false,
  sanalSayac: false,
  baslangicTarihi: null,
  baslangicDegeri: null,
  artisDegeri: null,
  guncellemeSekli: 1,
  ...Object.fromEntries(OZEL_ALAN_NUMARALARI.map((no) => [`ozelAlan${no}`, ""])),
  aciklama: "",
};

/** GetSayac kaydi -> form (eski Edit.jsx eslemesi). Etiket `sayacTipi`/`sayacBirimi`, ID `...ID` alanina yazilir. */
export const sayacFormDegerleri = (kayit) => ({
  sayacTanim: kayit.MES_TANIM ?? "",
  sayacTipi: kayit.MES_SAYAC_TIP ?? kayit.MES_TIP ?? null,
  sayacTipiID: kayit.MES_TIP_KOD_ID ?? null,
  sayacBirimi: kayit.MES_SAYAC_BIRIM ?? kayit.MES_BIRIM ?? null,
  sayacBirimiID: kayit.MES_BIRIM_KOD_ID ?? null,
  sayacDegeri: kayit.MES_GUNCEL_DEGER ?? null,
  sayacAktif: bayrak(kayit.MES_AKTIF),
  sayacVarsayilan: bayrak(kayit.MES_VARSAYILAN),
  sanalSayac: bayrak(kayit.MES_SANAL_SAYAC),
  baslangicTarihi: formTarihi(kayit.MES_SANAL_SAYAC_BASLANGIC_TARIH ?? kayit.MES_BASLANGIC_TARIH),
  baslangicDegeri: kayit.MES_BASLANGIC_DEGER ?? null,
  artisDegeri: kayit.MES_SANAL_SAYAC_ARTIS ?? kayit.MES_TAHMINI_ARTIS_DEGER ?? null,
  guncellemeSekli: guncellemeSekli(kayit.MES_GUNCELLEME_SEKLI),
  ...Object.fromEntries(OZEL_ALAN_NUMARALARI.map((no) => [`ozelAlan${no}`, kayit[`MES_OZEL_ALAN_${no}`] ?? ""])),
  aciklama: kayit.MES_ACIKLAMA ?? "",
});

/**
 * Form -> SayacKaydetRequest (AddSayac / UpdateSayac).
 * Duzenlemede guncel deger formdan degil yuklenen kayittan gider; deger "Sayac Guncelleme" ile degisir.
 */
export const sayacKaydetGovdesi = (veri, { makineId, sayacId, kayit }) => {
  const sanal = Boolean(veri.sanalSayac);
  const artisDegeri = sayiYaDaNull(veri.artisDegeri) ?? 0;

  return {
    TB_SAYAC_ID: sayacId || 0,
    MES_TANIM: metinYaDaNull(veri.sayacTanim) ?? "",
    MES_REF_ID: makineId,
    MES_REF_GRUP: "MAKINE",
    MES_MAKINE_ID: makineId,
    MES_TIP_KOD_ID: Number(veri.sayacTipiID) || 0,
    MES_BIRIM_KOD_ID: Number(veri.sayacBirimiID) || 0,
    MES_AKTIF: Boolean(veri.sayacAktif),
    MES_VARSAYILAN: Boolean(veri.sayacVarsayilan),
    MES_GUNCEL_DEGER: sayiYaDaNull(sayacId ? kayit?.MES_GUNCEL_DEGER : veri.sayacDegeri) ?? 0,
    MES_GUNCELLEME_SEKLI: guncellemeSekli(veri.guncellemeSekli),
    MES_SANAL_SAYAC: sanal,
    MES_BASLANGIC_DEGER: sayiYaDaNull(veri.baslangicDegeri) ?? 0,
    MES_SANAL_SAYAC_BASLANGIC_TARIH: sanal ? apiTarihi(veri.baslangicTarihi) : null,
    MES_SANAL_SAYAC_ARTIS: sanal ? artisDegeri : 0,
    MES_TAHMINI_ARTIS_DEGER: artisDegeri,
    MES_ACIKLAMA: metinYaDaNull(veri.aciklama),
    ...Object.fromEntries(OZEL_ALAN_NUMARALARI.map((no) => [`MES_OZEL_ALAN_${no}`, metinYaDaNull(veri[`ozelAlan${no}`])])),
  };
};
