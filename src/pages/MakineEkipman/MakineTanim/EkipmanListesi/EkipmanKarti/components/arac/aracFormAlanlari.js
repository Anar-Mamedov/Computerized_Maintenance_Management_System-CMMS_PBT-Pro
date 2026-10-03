import { apiSaati, apiTarihi, formSaati, formTarihi, metinYaDaNull, sayiYaDaNull } from "../../yardimcilar";

/*
 * Arac sekmesi modallarinin form alanlari: API kaydi -> form degerleri ve form -> kaydet govdesi
 * (swagger AracSigortaItem, AracKazaItem, AracCezaItem). KodID alanlarinda gorunen alan etiketi,
 * `...ID` alani numerik ID'yi tutar. API'ye her zaman backend ID'leri gider.
 */

/** KodList gruplari (KodIDSelectbox). */
export const KOD_GRUPLARI = {
  ruhsatSahibi: 35014,
  aracCinsi: 35016,
  sigortaTipi: 35048,
  cezaTuru: 35028,
  kazaTuru: 35036,
  kazaSekli: 35037,
  asliKusur: 35038,
  taliKusur: 35039,
};

/** Kaza durumu backend'e metin olarak gider (KZA_DURUM). */
export const KAZA_DURUMU = { acik: "Açık", kapali: "Kapalı" };

/** Bilinen kaza durumlari dile gore yazilir; digerleri oldugu gibi gosterilir. */
export const kazaDurumEtiketi = (durum, t) => {
  if (durum === KAZA_DURUMU.acik) return t("ekipmanKarti.arac.durumAcik");
  if (durum === KAZA_DURUMU.kapali) return t("ekipmanKarti.arac.durumKapali");
  return durum;
};

const kimlik = (deger) => Number(deger) || 0;

/** Backend saati "HH:mm" bekler. */
const apiSaatDakika = (deger) => apiSaati(deger)?.slice(0, 5) ?? null;

/* ---------- Sigorta ---------- */

export const BOS_SIGORTA = {
  sigortaTipi: null,
  sigortaTipiID: null,
  sigortaFirma: null,
  sigortaFirmaID: null,
  acenta: null,
  policeNo: null,
  baslangicTarihi: null,
  bitisTarihi: null,
  tutar: null,
  aciklama: null,
};

export const sigortaFormDegerleri = (kayit) => ({
  sigortaTipi: metinYaDaNull(kayit.ASG_SIGORTA),
  sigortaTipiID: kayit.ASG_SIGORTA_KOD_ID ?? null,
  sigortaFirma: metinYaDaNull(kayit.ASG_FIRMA),
  sigortaFirmaID: kayit.ASG_FIRMA_ID ?? null,
  acenta: metinYaDaNull(kayit.ASG_ACENTA),
  policeNo: metinYaDaNull(kayit.ASG_POLICE_NO),
  baslangicTarihi: formTarihi(kayit.ASG_BASLANGIC_TARIH),
  bitisTarihi: formTarihi(kayit.ASG_TARIH),
  tutar: kayit.ASG_TUTAR ?? null,
  aciklama: metinYaDaNull(kayit.ASG_ACIKLAMA),
});

export const sigortaGovdesi = (veri, { kayitId, makineId, aracId }) => ({
  TB_ARAC_SIGORTA_ID: kimlik(kayitId),
  ASG_ARAC_ID: kimlik(aracId),
  ASG_MAKINE_ID: makineId,
  ASG_SIGORTA_KOD_ID: kimlik(veri.sigortaTipiID),
  ASG_FIRMA_ID: kimlik(veri.sigortaFirmaID),
  ASG_ACENTA: metinYaDaNull(veri.acenta),
  ASG_POLICE_NO: metinYaDaNull(veri.policeNo),
  ASG_BASLANGIC_TARIH: apiTarihi(veri.baslangicTarihi),
  ASG_TARIH: apiTarihi(veri.bitisTarihi),
  ASG_TUTAR: sayiYaDaNull(veri.tutar),
  ASG_ACIKLAMA: metinYaDaNull(veri.aciklama),
  ASG_AKTIF: true,
});

/* ---------- Kaza ---------- */

export const BOS_KAZA = {
  belgeNo: null,
  tarih: null,
  saat: null,
  kazaLokasyon: null,
  kazaLokasyonID: null,
  kazaTuru: null,
  kazaTuruID: null,
  kazaSekli: null,
  kazaSekliID: null,
  kazaSurucu: null,
  kazaSurucuID: null,
  aracKm: null,
  karsiPlaka: null,
  karsiSurucu: null,
  karsiSigorta: null,
  hasarNo: null,
  asliKusur: null,
  asliKusurID: null,
  taliKusur: null,
  taliKusurID: null,
  durum: KAZA_DURUMU.acik,
  geriOdeme: false,
  aciklama: null,
};

/** Lokasyon etiketi backend'de KZA_LOKSYON adiyla gelir. */
export const kazaFormDegerleri = (kayit) => ({
  belgeNo: metinYaDaNull(kayit.KZA_BELGE_NO),
  tarih: formTarihi(kayit.KZA_TARIH),
  saat: formSaati(kayit.KZA_SAAT),
  kazaLokasyon: metinYaDaNull(kayit.KZA_LOKSYON),
  kazaLokasyonID: kayit.KZA_LOKASYON_ID ?? null,
  kazaTuru: metinYaDaNull(kayit.KZA_KAZA_TURU),
  kazaTuruID: kayit.KZA_KAZA_TURU_KOD_ID ?? null,
  kazaSekli: metinYaDaNull(kayit.KZA_KAZA_SEKLI),
  kazaSekliID: kayit.KZA_KAZA_SEKLI_KOD_ID ?? null,
  kazaSurucu: metinYaDaNull(kayit.KZA_SURUCU),
  kazaSurucuID: kayit.KZA_SURUCU_ID ?? null,
  aracKm: kayit.KZA_ARAC_KM ?? null,
  karsiPlaka: metinYaDaNull(kayit.KZA_KARSI_PLAKA),
  karsiSurucu: metinYaDaNull(kayit.KZA_KARSI_SURUCU),
  karsiSigorta: metinYaDaNull(kayit.KZA_KARSI_SIGORTA),
  hasarNo: metinYaDaNull(kayit.KZA_HASAR_NO),
  asliKusur: metinYaDaNull(kayit.KZA_SURUCU_KUSUR_ASLI),
  asliKusurID: kayit.KZA_SURUCU_KUSUR_ASLI_KOD_ID ?? null,
  taliKusur: metinYaDaNull(kayit.KZA_SURUCU_KUSUR_TALI),
  taliKusurID: kayit.KZA_SURUCU_KUSUR_TALI_KOD_ID ?? null,
  durum: metinYaDaNull(kayit.KZA_DURUM),
  geriOdeme: Boolean(kayit.KZA_GERI_ODEME),
  aciklama: metinYaDaNull(kayit.KZA_ACIKLAMA),
});

export const kazaGovdesi = (veri, { kayitId, makineId, aracId }) => ({
  TB_ARAC_KAZA_ID: kimlik(kayitId),
  KZA_ARAC_ID: kimlik(aracId),
  KZA_MAKINE_ID: makineId,
  KZA_BELGE_NO: metinYaDaNull(veri.belgeNo),
  KZA_TARIH: apiTarihi(veri.tarih),
  KZA_SAAT: apiSaatDakika(veri.saat),
  KZA_LOKASYON_ID: kimlik(veri.kazaLokasyonID),
  KZA_KAZA_TURU_KOD_ID: kimlik(veri.kazaTuruID),
  KZA_KAZA_SEKLI_KOD_ID: kimlik(veri.kazaSekliID),
  KZA_DURUM: metinYaDaNull(veri.durum),
  KZA_GERI_ODEME: Boolean(veri.geriOdeme),
  KZA_SURUCU_ID: kimlik(veri.kazaSurucuID),
  KZA_ARAC_KM: sayiYaDaNull(veri.aracKm),
  KZA_KARSI_PLAKA: metinYaDaNull(veri.karsiPlaka),
  KZA_KARSI_SURUCU: metinYaDaNull(veri.karsiSurucu),
  KZA_KARSI_SIGORTA: metinYaDaNull(veri.karsiSigorta),
  KZA_SURUCU_KUSUR_ASLI_KOD_ID: kimlik(veri.asliKusurID),
  KZA_SURUCU_KUSUR_TALI_KOD_ID: kimlik(veri.taliKusurID),
  KZA_HASAR_NO: metinYaDaNull(veri.hasarNo),
  KZA_ACIKLAMA: metinYaDaNull(veri.aciklama),
});

/* ---------- Ceza ---------- */

export const BOS_CEZA = {
  belgeNo: null,
  tarih: null,
  saat: null,
  cezaLokasyon: null,
  cezaLokasyonID: null,
  cezaTuru: null,
  cezaTuruID: null,
  cezaMaddesi: null,
  cezaMaddesiID: null,
  tutar: null,
  gecikmeTutari: null,
  cezaPuani: null,
  cezaSurucu: null,
  cezaSurucuID: null,
  aracKm: null,
  odendi: false,
  odemeTarihi: null,
  aciklama: null,
};

export const cezaFormDegerleri = (kayit) => ({
  belgeNo: metinYaDaNull(kayit.CZA_BELGE_NO),
  tarih: formTarihi(kayit.CZA_TARIH),
  saat: formSaati(kayit.CZA_SAAT),
  cezaLokasyon: metinYaDaNull(kayit.CZA_LOKASYON),
  cezaLokasyonID: kayit.CZA_LOKASYON_ID ?? null,
  cezaTuru: metinYaDaNull(kayit.CZA_TUR),
  cezaTuruID: kayit.CZA_TUR_KOD_ID ?? null,
  cezaMaddesi: metinYaDaNull(kayit.CZA_MADDE),
  cezaMaddesiID: kayit.CZA_MADDE_ID ?? null,
  tutar: kayit.CZA_TUTAR ?? null,
  gecikmeTutari: kayit.CZA_GECIKME_TUTAR ?? null,
  cezaPuani: kayit.CZA_PUAN ?? null,
  cezaSurucu: metinYaDaNull(kayit.CZA_SURUCU),
  cezaSurucuID: kayit.CZA_SURUCU_ID ?? null,
  aracKm: kayit.CZA_ARAC_KM ?? null,
  odendi: Boolean(kayit.CZA_ODEME),
  odemeTarihi: formTarihi(kayit.CZA_ODEME_TARIH),
  aciklama: metinYaDaNull(kayit.CZA_ACIKLAMA),
});

/** Odeme tarihi yalnizca "Odendi" isaretliyken gonderilir. */
export const cezaGovdesi = (veri, { kayitId, makineId, aracId }) => ({
  TB_ARAC_CEZA_ID: kimlik(kayitId),
  CZA_ARAC_ID: kimlik(aracId),
  CZA_MAKINE_ID: makineId,
  CZA_BELGE_NO: metinYaDaNull(veri.belgeNo),
  CZA_TARIH: apiTarihi(veri.tarih),
  CZA_SAAT: apiSaatDakika(veri.saat),
  CZA_LOKASYON_ID: kimlik(veri.cezaLokasyonID),
  CZA_TUTAR: sayiYaDaNull(veri.tutar),
  CZA_GECIKME_TUTAR: sayiYaDaNull(veri.gecikmeTutari),
  CZA_ODEME: Boolean(veri.odendi),
  CZA_ODEME_TARIH: veri.odendi ? apiTarihi(veri.odemeTarihi) : null,
  CZA_SURUCU_ID: kimlik(veri.cezaSurucuID),
  CZA_TUR_KOD_ID: kimlik(veri.cezaTuruID),
  CZA_MADDE_ID: kimlik(veri.cezaMaddesiID),
  CZA_PUAN: sayiYaDaNull(veri.cezaPuani),
  CZA_ARAC_KM: sayiYaDaNull(veri.aracKm),
  CZA_ACIKLAMA: metinYaDaNull(veri.aciklama),
});
