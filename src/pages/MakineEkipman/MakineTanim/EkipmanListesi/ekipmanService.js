import AxiosInstance from "../../../../api/http";
import { EKIPMAN_FORMU_ID } from "./constants";

/**
 * @typedef {Object} EkipmanKpi
 * @property {number} ToplamEkipman
 * @property {number} AcikIsEmri
 * @property {number} AktifAriza
 * @property {number} GecikenBakim
 */

/**
 * @typedef {Object} EkipmanListesiYaniti
 * @property {boolean} has_error
 * @property {number} toplam_kayit
 * @property {number} toplam_sayfa
 * @property {EkipmanKpi} [kpi]
 * @property {Object[]} ekipman_listesi
 */

/** Dokumandaki basari kontrolu: has_error false ve (varsa) status_code 200/201. */
export const basariliMi = (response) => {
  if (!response || response.has_error === true) return false;
  return response.status_code === undefined || response.status_code === 200 || response.status_code === 201;
};

/** @returns {Promise<EkipmanListesiYaniti>} */
export const getEkipmanListesi = (govde) => AxiosInstance.post("GetEkipmanFullList", govde);

/** Ayni filtrelerle sayfalamasiz liste (Excel). */
export const getEkipmanExcelListesi = (govde) => AxiosInstance.post("GetEkipmanExcelList", govde);

export const toggleEkipmanAktif = (makineId) => AxiosInstance.post(`Ekipman/ToggleAktif?makineId=${makineId}`);

export const topluTipGuncelle = (makineIds, yeniTipKodId) => AxiosInstance.post("Ekipman/TopluTipGuncelle", { makineIds, yeniTipKodId });

/** Yalnizca durum degisecekse `isAktif` gonderilmez (dokuman notu). */
export const topluDurumGuncelle = ({ makineIds, durumKodId, isAktif }) =>
  AxiosInstance.post("Ekipman/TopluDurumGuncelle", {
    makineIds,
    durumKodId,
    ...(isAktif === 0 || isAktif === 1 ? { isAktif } : {}),
  });

export const topluSayacTanimla = (govde) => AxiosInstance.post("Ekipman/TopluSayacTanimla", govde);

export const getSigortaListesi = (makineId) => AxiosInstance.get("Ekipman/GetSigortaListesi", { params: { makineId } });

export const kaydetSigorta = (govde) => AxiosInstance.post("Ekipman/AddUpdateSigorta", govde);

export const silSigorta = (id) => AxiosInstance.delete("Ekipman/DeleteSigorta", { params: { id } });

/** Mevcut ekranin kullandigi silme ucu. */
export const silEkipman = (makineId) => AxiosInstance.post(`DeleteMakine?TB_MAKINE_ID=${makineId}`);

/* Filtre secenekleri */

export const getLokasyonlar = () => AxiosInstance.get("GetLokasyonList");

export const getKodListesi = (grup) => AxiosInstance.get(`KodList?grup=${grup}`);

export const getMarkalar = () => AxiosInstance.get("GetMakineMarks");

export const getModeller = (markaId) => AxiosInstance.get(`GetMakineModelByMarkaId?markaId=${markaId}`);

export const getAtolyeler = () => AxiosInstance.get("AtolyeList");

/** Ozel alan kolon basliklari ({ OZL_OZEL_ALAN_1: "...", ... }); eski tablo da bunu kullanir. */
export const getOzelAlanBasliklari = () => AxiosInstance.get("OzelAlan?form=MAKINE");

/** Ekipman formunun (FastReport PDF) baglantisi: `{ success, url }`. */
export const getEkipmanFormuBaglantisi = (makineId) =>
  AxiosInstance.get(`GetReportUrl?formId=${EKIPMAN_FORMU_ID}&idNo=${makineId}`).then((yanit) => yanit?.data || yanit || {});
