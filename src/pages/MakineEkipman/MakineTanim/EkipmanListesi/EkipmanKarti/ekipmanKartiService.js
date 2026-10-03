import AxiosInstance from "../../../../../api/http";

/*
 * Ekipman Sicil Karti'nin tum API cagrilari. Uc adlari ve govde alanlari backend swagger'i ile aynidir
 * (/swagger/docs/v1); entegrasyon dokumanindan farkli olanlar yanlarinda belirtilmistir.
 */

/** Liste uclari farkli sekillerde donebiliyor: dizi, `{ data: [] }` ya da `{ list: [] }`. */
export const listeyiAl = (yanit) => {
  if (Array.isArray(yanit)) return yanit;
  if (Array.isArray(yanit?.data)) return yanit.data;
  if (Array.isArray(yanit?.list)) return yanit.list;
  return [];
};

/** Tek kayit donen uclar: nesne, `{ data: {} }` ya da tek elemanli dizi. */
export const kaydiAl = (yanit) => {
  const veri = yanit?.data !== undefined ? yanit.data : yanit;
  if (Array.isArray(veri)) return veri[0] ?? null;
  return veri && typeof veri === "object" ? veri : null;
};

/** Hata durumunda backend'in mesaji varsa onu doner. */
export const hataMesaji = (hata, varsayilan) => hata?.response?.data?.message || hata?.response?.data?.Message || varsayilan;

/** Basarisiz yanitta (has_error / status_code) gosterilecek mesaj: 401'de yetki metni, yoksa backend mesaji. */
export const yanitHatasi = (yanit, t) => (yanit?.status_code === 401 ? t("ekipmanKarti.yetkiYok") : yanit?.message || t("ekipmanKarti.islemBasarisiz"));

/* ---------- Ekipman (makine) ---------- */

export const getMakine = (makineId) => AxiosInstance.get("GetMakineById", { params: { makineId } });

export const guncelleMakine = (govde) => AxiosInstance.post("UpdateMakine", govde);

/** Is emri tipleri; ariza tipi IMT_TIP_ARIZA ile isaretlidir (Ariza Bildir). Dokumandaki IsEmriAdd ucu backend'de yok;
 * is emri mevcut Is Emri Ekle cekmecesiyle (POST IsEmri?isWeb=true) acilir. */
export const getIsEmriTipleri = () => AxiosInstance.get("IsEmriTip");

/* ---------- Sayac okumasi (hizli giris ve sayac sekmesi; dokumanda: MakineSayacGuncellemeBilgi / SayacOkumaGuncelle) ---------- */

export const getMakineSayacGuncellemeBilgi = (makineId) => AxiosInstance.get("GetMakineSayacGuncelleBilgi", { params: { makineId } });

/** Govde: { MakineId, SayacId, LokasyonId, VardiyaId, Tarih, Saat, OkunanDeger, ArtisDeger, Aciklama } */
export const kaydetMakineSayac = (govde) => AxiosInstance.post("MakineSayacGuncelle", govde);

/* ---------- Alt ekipmanlar ---------- */

/** parentID: ust kayit (makine ya da ust ekipman) ID'si. */
export const getAltEkipmanlar = (parentId) => AxiosInstance.post("GetEkipmanVeritabaniListe", { parentID: parentId, ItemIndex: 3, DepoId: -1, Parametre: "" });

/** Yanit: { list: [], kayit_sayisi } */
export const getBostaEkipmanlar = ({ parametre = "", sayfa = 1, sayfaBoyutu = 10 }) =>
  AxiosInstance.get("GetEkipmanListBosta", { params: { parametre, pagingDeger: sayfa, pageSize: sayfaBoyutu } });

export const ekleAltEkipman = (makineId, ekipmanIdleri) => AxiosInstance.post("AddMakineEkipman", { EKP_MAKINE_ID: makineId, TB_EKIPMAN_ID: ekipmanIdleri });

/** Govde: { EkipmanID, UstEkipmanID, DepoID, IslemTipi: "STOK" | "HURDA", Aciklama } (dokumanda: EkipmanCikart). */
export const cikartAltEkipman = (govde) => AxiosInstance.post("ekipmancikart", govde);

/** Dokumanda: GetEkipmanDolasimTarihce */
export const getEkipmanDolasimTarihcesi = (ekipmanId) => AxiosInstance.get("GetEkipmanDolasimTarihcesi", { params: { ekipmanId } });

/** Dokumanda: GetEkipmanRevizyonTarihce */
export const getEkipmanRevizyonTarihcesi = (ekipmanId) => AxiosInstance.get("GetEkipmanRevizyonTarihcesi", { params: { ekipmanId } });

/** Govde: EkipmanRevizyonDto (EkipmanId, RevizyonNo, Tarih, Saat, Konu, ReferansNo, CalismaSuresi, Maliyet, DurumKodId, PersonelId, Aciklama...) */
export const ekleEkipmanRevizyon = (govde) => AxiosInstance.post("AddEkipmanRevizyon", govde);

/* ---------- Sayaclar ---------- */

export const getMakineSayaclari = (makineId) => AxiosInstance.get("GetMakineSayaclar", { params: { MakineID: makineId } });

export const getSayac = (sayacId) => AxiosInstance.get("GetSayac", { params: { SayacID: sayacId } });

/** Govde: SayacKaydetRequest (dokumanda: SayacAdd). MES_GUNCELLEME_SEKLI: 0 yok, 1 okunan deger, 2 artis deger. */
export const ekleSayac = (govde) => AxiosInstance.post("AddSayac", govde);

/** Govde: SayacKaydetRequest (dokumanda: SayacUpdate). */
export const guncelleSayac = (govde) => AxiosInstance.post("UpdateSayac", govde);

export const silSayac = (sayacId) => AxiosInstance.post("DeleteSayac", null, { params: { SayacId: sayacId } });

/** Govde: { SayacId, Tarih, Saat, Aciklama, VardiyaId } */
export const sifirlaSayac = (govde) => AxiosInstance.post("SayacSifirla", govde);

export const varsayilanYapSayac = (sayacId) => AxiosInstance.post("SayacVarsayilanYap", null, { params: { sayacId } });

/** Dokumanda: GetSayacOkumaList (baslangicTarih / bitisTarih). Tarihler YYYY-MM-DD. */
export const getSayacHareketleri = ({ sayacId, basTarih, bitTarih }) => AxiosInstance.get("GetSayacHareketleri", { params: { sayacId, basTarih, bitTarih } });

/* ---------- Periyodik bakimlar ---------- */

/** Yanit: { list: [], count } */
export const getMakinePeriyodikBakimlari = (makineId) => AxiosInstance.get("GetMakinePeriyodikBakimListesi", { params: { makineId } });

/** Makineye henuz eklenmemis bakimlar. Yanit: { list: [], kayit_sayisi } */
export const getEklenebilirBakimlar = ({ makineId, sayfa = 1, sayfaBoyutu = 10, parametre = "" }) =>
  AxiosInstance.get("PeriyodikBakimListSelectable", { params: { makineID: makineId, page: sayfa, pageSize: sayfaBoyutu, parametre } });

/** Bakim tanimindaki izleme sekli (tarih / sayac bazli). Yanit: [ { PBK_TARIH_BAZLI_IZLE, PBK_SAYAC_BAZLI_IZLE, ... } ] */
export const getBakimTanimi = (bakimId) => AxiosInstance.get("PeriyodikBakimDetayByBakim", { params: { BakimId: bakimId } });

/** tipId: 0 tarih + sayac, 1 sayac, 2 tarih (mevcut ekleme ekraniyla ayni). */
export const ekleMakineBakimi = (govde, tipId) => AxiosInstance.post("PBakimMakineAdd", govde, { params: { tipID: tipId } });

export const getMakineBakimDetayi = (pbakimMakineId) => AxiosInstance.get("GetPBakimMakineDetay", { params: { pbakimMakineId } });

export const guncelleMakineBakimi = (govde) => AxiosInstance.post("PBakimMakineUpdate", govde);

export const silMakineBakimi = (pbakimMakineId) => AxiosInstance.post("PBakimMakineDelete", null, { params: { TB_PERIYODIK_BAKIM_MAKINE_ID: pbakimMakineId } });

/** Govde: tekil kayit ya da dizi { PBM_MAKINE_ID, PBM_PERIYODIK_BAKIM_ID, PBM_HEDEF_TARIH, PBI_IPTAL_NEDEN_KOD_ID, PBI_ACIKLAMA } */
export const ileriTariheBakimPlanla = (govde) => AxiosInstance.post("PBakimMakineIleriTarihePlanla", govde);

export const iptalEtMakineBakimi = (govde) => AxiosInstance.post("PBakimMakineIptal", govde);

export const olusturBakimIsEmri = (govde) => AxiosInstance.post("IsEmriOlustur", govde);

export const getPeriyodikBakimTarihcesi = ({ makineId, pbakimId }) => AxiosInstance.get("GetPeriyodikBakimTarihcesi", { params: { makineId, pbakimId } });

/* ---------- Arac ---------- */

/** Arac kaydi yoksa backend ilk kaydi acar ve TB_ARAC_ID'yi doner. */
export const getAracRuhsati = (makineId) => AxiosInstance.get("GetAracRuhsatByMakineId", { params: { makineId } });

export const kaydetAracRuhsati = (govde) => AxiosInstance.post("SaveAracRuhsat", govde);

export const getAracSigortalari = (makineId) => AxiosInstance.get("GetAracSigortaList", { params: { makineId } });
export const getAracSigortasi = (id) => AxiosInstance.get("GetAracSigortaById", { params: { id } });
export const ekleAracSigortasi = (govde) => AxiosInstance.post("AddAracSigorta", govde);
export const guncelleAracSigortasi = (govde) => AxiosInstance.post("UpdateAracSigorta", govde);
export const silAracSigortasi = (id) => AxiosInstance.post("DeleteAracSigorta", null, { params: { id } });

export const getAracKazalari = (makineId) => AxiosInstance.get("GetAracKazaList", { params: { makineId } });
export const getAracKazasi = (id) => AxiosInstance.get("GetAracKazaById", { params: { id } });
export const ekleAracKazasi = (govde) => AxiosInstance.post("AddAracKaza", govde);
export const guncelleAracKazasi = (govde) => AxiosInstance.post("UpdateAracKaza", govde);
export const silAracKazasi = (id) => AxiosInstance.post("DeleteAracKaza", null, { params: { id } });

export const getAracCezalari = (makineId) => AxiosInstance.get("GetAracCezaList", { params: { makineId } });
export const getAracCezasi = (id) => AxiosInstance.get("GetAracCezaById", { params: { id } });
export const ekleAracCezasi = (govde) => AxiosInstance.post("AddAracCeza", govde);
export const guncelleAracCezasi = (govde) => AxiosInstance.post("UpdateAracCeza", govde);
export const silAracCezasi = (id) => AxiosInstance.post("DeleteAracCeza", null, { params: { id } });
