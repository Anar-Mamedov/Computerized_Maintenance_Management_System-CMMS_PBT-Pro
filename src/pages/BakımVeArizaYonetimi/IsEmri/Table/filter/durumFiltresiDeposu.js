// Is emri listesinde son uygulanan Durum filtresi (TB_KOD_ID dizisi) tarayicida saklanir, liste yeniden acilinca o secimle gelir.

const DEPO_ANAHTARI = "isEmriDurumFiltresi";

/** Kayitli durum ID'lerini okur; kayit yoksa ya da bozuksa bos dizi doner. */
export const kayitliDurumlariOku = () => {
  try {
    const kayit = JSON.parse(localStorage.getItem(DEPO_ANAHTARI));
    return Array.isArray(kayit) ? kayit : [];
  } catch {
    return [];
  }
};

/** Uygulanan durum ID'lerini saklar; bos dizi kaydi temizler. */
export const durumlariKaydet = (durumlar) => {
  try {
    if (durumlar.length > 0) {
      localStorage.setItem(DEPO_ANAHTARI, JSON.stringify(durumlar));
    } else {
      localStorage.removeItem(DEPO_ANAHTARI);
    }
  } catch (error) {
    console.error("Durum filtresi kaydedilemedi:", error);
  }
};
