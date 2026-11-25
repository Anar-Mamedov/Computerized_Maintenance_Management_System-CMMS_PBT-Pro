import dayjs from "dayjs";

/** AddYakitIslemi / UpdateYakitStokIslem `IslemTipi` degerleri; liste satirindaki `GC` karsiliklari. */
export const ISLEM_TIPLERI = ["GIRIS", "CIKIS", "TRANSFER"];

/** Giris / cikis nedeni (TB_STOK_FIS.SFS_ISLEM_TIP_KOD_ID) kod grubu; malzeme fislerindeki "Islem Tipi" ile ayni. */
export const ISLEM_NEDENI_KOD_GRUBU = 13006;

const sayiyaCevir = (deger) => (deger === null || deger === undefined || deger === "" ? null : Number(deger));

/** Yeni fis formu. */
export const bosFisFormu = (islemTipi) => ({
  islemTipi,
  tarih: dayjs(),
  saat: dayjs(),
  kaynakDepoId: null,
  hedefDepoId: null,
  miktar: null,
  cariTanim: "",
  cariId: null,
  islemNedeni: null,
  islemNedeniID: null,
  birimFiyat: null,
  belgeNo: "",
  aciklama: "",
  makineId: null,
});

/**
 * GetYakitStokIslemById yanitindan form. Kod alani KodIDSelectbox kuraliyla doldurulur: gorunen alana ad,
 * gizli ...ID alanina TB_KOD_ID.
 */
export const detaydanFisFormu = (detay) => {
  const tarihSaat = dayjs(detay.TarihSaat || detay.Tarih);
  return {
    islemTipi: detay.IslemTipi,
    tarih: tarihSaat,
    saat: tarihSaat,
    kaynakDepoId: detay.KaynakDepoId ?? null,
    hedefDepoId: detay.HedefDepoId ?? null,
    miktar: detay.Miktar ?? null,
    cariTanim: detay.CariTanim || "",
    cariId: detay.CariId ?? null,
    islemNedeni: detay.IslemNedeni || null,
    islemNedeniID: detay.IslemTipKodId ?? null,
    birimFiyat: detay.BirimFiyat ?? null,
    belgeNo: detay.BelgeNo || "",
    aciklama: detay.Aciklama || "",
    // Formda makine alani yok; mevcut fisin makine bagi guncellemede korunur.
    makineId: detay.MakineId ?? null,
  };
};

/**
 * Formdan AddYakitIslemi govdesi (dokuman 4.3). KDV alanlari olmadigi icin AraToplam / GenelToplam gonderilmez;
 * backend `Miktar * BirimFiyat` hesaplar. Transfer'de fiyat / cari / neden gonderilmez.
 */
export const fisGovdesi = (form) => {
  const tarihSaat = form.tarih.hour(form.saat.hour()).minute(form.saat.minute()).second(0);
  const ortak = {
    IslemTipi: form.islemTipi,
    TarihSaat: tarihSaat.format("YYYY-MM-DDTHH:mm:ss"),
    Miktar: Number(form.miktar),
    Aciklama: form.aciklama || "",
    ...(form.makineId ? { MakineId: form.makineId } : {}),
  };

  if (form.islemTipi === "TRANSFER") {
    return { ...ortak, KaynakDepoId: form.kaynakDepoId, HedefDepoId: form.hedefDepoId };
  }

  const fiyatBilgileri = {
    CariId: sayiyaCevir(form.cariId),
    IslemTipKodId: sayiyaCevir(form.islemNedeniID),
    BirimFiyat: sayiyaCevir(form.birimFiyat) ?? 0,
    BelgeNo: form.belgeNo || "",
  };
  return form.islemTipi === "GIRIS" ? { ...ortak, HedefDepoId: form.hedefDepoId, ...fiyatBilgileri } : { ...ortak, KaynakDepoId: form.kaynakDepoId, ...fiyatBilgileri };
};

const tankBul = (tanklar, id) => tanklar.find((tank) => tank.TB_DEPO_ID === id) ?? null;

/**
 * Tankin bu fis icin kullanilabilir stogu ve kalan kapasitesi. Duzenlemede backend fisi once geri alip yeniden
 * isledigi icin orijinal fisin miktari ilgili tanka geri eklenir.
 */
export const tankDurumu = (tanklar, id, orijinal) => {
  const tank = tankBul(tanklar, id);
  if (!tank) return null;
  const mevcut = Number(tank.MEVCUT_MIKTAR) || 0;
  const kapasite = Number(tank.KAPASITE) || 0;
  const orijinalMiktar = Number(orijinal?.Miktar) || 0;
  const orijinaldenCikti = orijinal && orijinal.IslemTipi !== "GIRIS" && orijinal.KaynakDepoId === id;
  const orijinaleGirdi = orijinal && orijinal.IslemTipi !== "CIKIS" && orijinal.HedefDepoId === id;
  const kullanilabilir = mevcut + (orijinaldenCikti ? orijinalMiktar : 0);
  const kalanKapasite = kapasite - mevcut + (orijinaleGirdi ? orijinalMiktar : 0);
  return { tank, mevcut, kapasite, kullanilabilir, kalanKapasite };
};

/** Transfer'de hedef olabilecek tanklar: kaynaktan farkli, ayni yakit karti (DEP_STOK_ID) ve yakit turu. */
export const transferHedefleri = (tanklar, kaynakDepoId) => {
  const kaynak = tankBul(tanklar, kaynakDepoId);
  if (!kaynak) return [];
  return tanklar.filter((tank) => tank.TB_DEPO_ID !== kaynak.TB_DEPO_ID && tank.DEP_STOK_ID === kaynak.DEP_STOK_ID && tank.YAKIT_TURU_ID === kaynak.YAKIT_TURU_ID);
};

/**
 * Kaydet dugmesini engelleyen durum (dokuman 4.3 kontrolleri): cikista ve transferde miktar kaynak tankin
 * stogunu, transferde ayrica hedef tankin kalan kapasitesini asamaz. Engel yoksa null.
 */
export const kayitEngeli = (form, tanklar, orijinal) => {
  const miktar = Number(form.miktar) || 0;
  if (miktar <= 0 || form.islemTipi === "GIRIS") return null;

  const kaynak = tankDurumu(tanklar, form.kaynakDepoId, orijinal);
  if (kaynak && miktar > kaynak.kullanilabilir) return { anahtar: "yakitStokIslemleri.fis.yetersizStok", deger: kaynak.kullanilabilir };
  if (form.islemTipi !== "TRANSFER") return null;

  if (form.kaynakDepoId && form.kaynakDepoId === form.hedefDepoId) return { anahtar: "yakitStokIslemleri.fis.ayniTank" };
  const hedef = tankDurumu(tanklar, form.hedefDepoId, orijinal);
  if (hedef && miktar > hedef.kalanKapasite) return { anahtar: "yakitStokIslemleri.fis.yetersizKapasite", deger: hedef.kalanKapasite };
  return null;
};

/** Secilen tankin yakit kartindan varsayilan birim fiyat (giriste GIRIS_FIYAT, cikista CIKIS_FIYAT). */
export const varsayilanBirimFiyat = (tanklar, yakitKartlari, depoId, islemTipi) => {
  const tank = tankBul(tanklar, depoId);
  const kart = tank ? yakitKartlari.find((item) => item.TB_STOK_ID === tank.DEP_STOK_ID) : null;
  if (!kart) return null;
  const fiyat = islemTipi === "GIRIS" ? kart.GIRIS_FIYAT : kart.CIKIS_FIYAT;
  return fiyat === null || fiyat === undefined ? null : Number(fiyat);
};
