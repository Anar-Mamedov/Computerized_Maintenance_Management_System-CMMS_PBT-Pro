/**
 * Yakit Analizleri ve Yakit Stok Islemleri uclarinin ortak hata kurali (dokuman 1. Genel Kurallar):
 * `has_error === true` ise kullaniciya `status` mesaji gosterilir. HTTP 400 gibi hatalarda da
 * govde ayni bicimde geldigi icin mesaj oradan okunur.
 */
export class YakitApiHatasi extends Error {}

/** Istegi bekler; `has_error` donerse ya da istek hata verirse `status` mesajiyla YakitApiHatasi firlatir. */
export async function yakitIstegi(istek) {
  let yanit;
  try {
    yanit = await istek;
  } catch (error) {
    throw new YakitApiHatasi(error?.response?.data?.status || error?.response?.data?.message || "");
  }
  if (yanit?.has_error === true) throw new YakitApiHatasi(yanit.status || "");
  return yanit;
}

/** Toast'ta gosterilecek metin: backend mesaji, yoksa genel hata metni. */
export const hataMetni = (error, t) => (error instanceof YakitApiHatasi && error.message ? error.message : t("hataOlustu"));
