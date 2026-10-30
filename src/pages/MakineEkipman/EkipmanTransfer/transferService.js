import { t } from "i18next";
import AxiosInstance from "../../../api/http";
import { camelCaseYap } from "../EkipmanVeritabani/AltEkipmanListesi/yardimcilar";

/**
 * Ekipman Transferi uclari (EQUIPMENT_TRANSFER_FRONTEND_GUIDE.md).
 *
 * @typedef {Object} TransferIzinleri
 * @property {boolean} canViewSlip
 * @property {boolean} canViewHistory
 * @property {boolean} canEdit
 * @property {boolean} canDelete
 * @property {boolean} canSubmitForApproval
 * @property {boolean} canApprove
 * @property {boolean} canDispatch
 * @property {boolean} canReceive
 *
 * @typedef {Object} TransferKpi
 * @property {number} totalTransfers
 * @property {number} draft
 * @property {number} pendingApproval
 * @property {number} approved
 * @property {number} inTransit
 * @property {number} partiallyDelivered
 * @property {number} completed
 */

/** Yanit `hasError` tasimiyorsa basarili sayilir; HTTP hatasi catch'e duser. */
export const basariliMi = (yanit) => Boolean(yanit) && yanit.hasError !== true;

/** Backend mesajini (yanit govdesi ya da HTTP hata govdesi) kullaniciya gosterilecek metne cevirir. */
export const hataMesaji = (hataVeyaYanit) => hataVeyaYanit?.response?.data?.message || hataVeyaYanit?.message || t("hataOlustu");

/**
 * Canli API alanlari PascalCase donuyor (data.TransferNo, Equipments, AllowedActions.CanEdit...); ekran camelCase okudugu
 * icin yanit burada bir kez cevrilir. Basarisiz yanit hataya cevrilir; boylece cagiran tek bir catch ile ilgilenir.
 */
const yanitiDenetle = (hamYanit) => {
  const yanit = camelCaseYap(hamYanit);
  if (!basariliMi(yanit)) throw yanit;
  return yanit;
};

export const getTransferListesi = (govde) => AxiosInstance.post("EquipmentTransfer/GetList", govde).then(yanitiDenetle);

export const getTransfer = (transferId) => AxiosInstance.get("EquipmentTransfer/GetById", { params: { id: transferId } }).then(yanitiDenetle);

export const getTransferTarihcesi = (transferId) => AxiosInstance.get("EquipmentTransfer/GetHistory", { params: { id: transferId } }).then(yanitiDenetle);

export const getUygunEkipmanlar = ({ sourceLocationId, search, status }) =>
  AxiosInstance.get("EquipmentTransfer/GetAvailableEquipments", { params: { sourceLocationId, search, status } }).then(yanitiDenetle);

export const getSiradakiTransferNo = () => AxiosInstance.get("EquipmentTransfer/GetNextTransferNo").then(yanitiDenetle);

/** Yeni kayitta `Create`, taslak duzenlenirken `Update` cagrilir; ikisi de taslak (0) olarak kaydeder. */
export const kaydetTransfer = (govde) => AxiosInstance.post(govde.transferId ? "EquipmentTransfer/Update" : "EquipmentTransfer/Create", govde).then(yanitiDenetle);

export const silTransfer = (transferId) => AxiosInstance.post("EquipmentTransfer/Delete", { transferId }).then(yanitiDenetle);

export const onayaGonder = (transferId) => AxiosInstance.post("EquipmentTransfer/SubmitForApproval", { transferId }).then(yanitiDenetle);

export const onaylaTransfer = (transferId) => AxiosInstance.post("EquipmentTransfer/Approve", { transferId }).then(yanitiDenetle);

export const sevkiyataCikar = (govde) => AxiosInstance.post("EquipmentTransfer/Dispatch", govde).then(yanitiDenetle);

export const teslimAl = (govde) => AxiosInstance.post("EquipmentTransfer/Receive", govde).then(yanitiDenetle);
