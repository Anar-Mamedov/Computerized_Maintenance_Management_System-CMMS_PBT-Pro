import AxiosInstance from "../../../api/http";
import { yakitIstegi } from "../ortak/yakitApi";

/**
 * Yakit Stok Islemleri uclari (dokuman 4. bolum). Hepsi `has_error` kontrolunden gecer; hata durumunda
 * backend'in `status` mesajiyla YakitApiHatasi firlatir.
 */

/**
 * Liste + 4 KPI (yalnizca TB_STOK_FIS giris / cikis / transfer fisleri).
 * @param {import("../ortak/yakitTipleri").YakitStokIslemFiltre} govde
 * @returns {Promise<import("../ortak/yakitTipleri").ApiResponse<import("../ortak/yakitTipleri").YakitStokIslemListeResponse>>}
 */
export const getYakitStokIslemListesi = (govde) => yakitIstegi(AxiosInstance.post("GetYakitStokIslemListesi", govde));

/**
 * Fis detayi (duzenleme modalini doldurur).
 * @param {number} id TB_STOK_FIS_ID
 * @returns {Promise<import("../ortak/yakitTipleri").ApiResponse<import("../ortak/yakitTipleri").YakitStokIslemDetay>>}
 */
export const getYakitStokIslemById = (id) => yakitIstegi(AxiosInstance.get(`GetYakitStokIslemById?id=${id}`));

/**
 * Yeni giris / cikis / transfer fisi (Depo/Tank ekranindan tasinan uc).
 * @param {import("../ortak/yakitTipleri").YakitFisKayitRequest} govde
 */
export const addYakitIslemi = (govde) => yakitIstegi(AxiosInstance.post("AddYakitIslemi", govde));

/**
 * Mevcut fisi gunceller; IslemTipi degistirilemez.
 * @param {import("../ortak/yakitTipleri").YakitStokIslemGuncelleRequest} govde
 */
export const updateYakitStokIslem = (govde) => yakitIstegi(AxiosInstance.post("UpdateYakitStokIslem", govde));

/**
 * Tekli ya da coklu silme.
 * @param {import("../ortak/yakitTipleri").YakitStokIslemSilRequest["Ids"]} ids
 */
export const deleteYakitStokIslem = (ids) => yakitIstegi(AxiosInstance.post("DeleteYakitStokIslem", { Ids: ids }));

/** Aktif tanklar (mevcut stok, kapasite, yakit tipi ve DEP_STOK_ID ile). */
export const getYakitTankList = () => yakitIstegi(AxiosInstance.post("GetYakitTankList", { Durum: 1 }));

/** Aktif yakit kartlari; formda varsayilan birim fiyat (GIRIS_FIYAT / CIKIS_FIYAT) icin. */
export const getYakitList = () => yakitIstegi(AxiosInstance.get("GetYakitList?aktif=true"));
