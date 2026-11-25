import AxiosInstance from "../../../api/http";
import { yakitIstegi } from "../ortak/yakitApi";

/**
 * Yakit Analizleri uclari (dokuman 3. bolum, YakitAnalizController). Tarihler bos giderse backend icinde
 * bulunulan ayin 1'i ile bugunu alir. Hata durumunda backend'in `status` mesajiyla YakitApiHatasi firlatir.
 */

/**
 * Tek cagrida tum dashboard kartlari, grafikler, tank durumu, en fazla tuketenler ve uyarilar.
 * @param {import("../ortak/yakitTipleri").YakitOrtakFiltre} filtre
 * @returns {Promise<import("../ortak/yakitTipleri").ApiResponse<import("../ortak/yakitTipleri").YakitAnalizDashboardResponse>>}
 */
export const getYakitAnalizDashboard = (filtre) => yakitIstegi(AxiosInstance.post("GetYakitAnalizDashboard", filtre));

/**
 * "Tip analizi" modali.
 * @param {import("../ortak/yakitTipleri").YakitOrtakFiltre} filtre
 */
export const getYakitMakineTipiAnaliz = (filtre) => yakitIstegi(AxiosInstance.post("GetYakitMakineTipiAnaliz", filtre));

/**
 * "Karsilastir" modali; SortBy / SortDir ile sunucuda siralanir.
 * @param {import("../ortak/yakitTipleri").YakitLokasyonKarsilastirmaFiltre} filtre
 */
export const getYakitLokasyonKarsilastirma = (filtre) => yakitIstegi(AxiosInstance.post("GetYakitLokasyonKarsilastirma", filtre));

/**
 * Detayli tablo (filo / lokasyon / performans / personel gorunumleri).
 * @param {import("../ortak/yakitTipleri").YakitDetayliTabloFiltre} filtre
 */
export const getYakitDetayliTablo = (filtre) => yakitIstegi(AxiosInstance.post("GetYakitDetayliTablo", filtre));
