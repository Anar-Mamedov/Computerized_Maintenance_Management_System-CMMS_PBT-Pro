import React from "react";
import PropTypes from "prop-types";
import { Button, Modal, Spin } from "antd";
import { useTranslation } from "react-i18next";
import { BilgiAlani } from "./Bilgi";
import { TransferDurumRozeti } from "./Rozetler";
import EkipmanTablosu from "./EkipmanTablosu";
import useTransferDetayi from "../useTransferDetayi";

/** Fisin baslik bilgileri, (varsa) sevkiyat bilgileri ve ekipman satirlari; salt okunur. */
export default function TransferFisiModali({ transferId, onKapat }) {
  const { t } = useTranslation();
  const { detay, yukleniyor } = useTransferDetayi(transferId, Boolean(transferId));
  const sevkiyatVar = Boolean(detay?.shipmentDateTimeFormatted || detay?.carrier || detay?.plateNumber || detay?.driverName);

  return (
    <Modal
      open={Boolean(transferId)}
      title={t("ekipmanTransfer.menu.transferFisi")}
      width={860}
      centered
      destroyOnClose
      onCancel={onKapat}
      footer={<Button onClick={onKapat}>{t("ekipmanTransfer.kapat")}</Button>}
    >
      <Spin spinning={yukleniyor}>
        <div className="et-modal-govde">
          <div className="et-bilgi-kutusu et-izgara-4">
            <BilgiAlani etiket={t("ekipmanTransfer.transferNo")}>{detay?.transferNo}</BilgiAlani>
            <BilgiAlani etiket={t("ekipmanTransfer.durumBasligi")}>{detay && <TransferDurumRozeti statusKey={detay.statusKey} statusText={detay.statusText} />}</BilgiAlani>
            <BilgiAlani etiket={t("ekipmanTransfer.planlananTarih")}>{detay?.plannedDateFormatted}</BilgiAlani>
            <BilgiAlani etiket={t("ekipmanTransfer.transferNedeni")}>{detay?.transferReason}</BilgiAlani>
            <BilgiAlani etiket={t("ekipmanTransfer.kaynakSantiye")}>{detay?.sourceLocationName}</BilgiAlani>
            <BilgiAlani etiket={t("ekipmanTransfer.hedefSantiye")}>{detay?.targetLocationName}</BilgiAlani>
            <BilgiAlani etiket={t("ekipmanTransfer.talepEden")}>{detay?.requestedByName}</BilgiAlani>
            <BilgiAlani etiket={t("ekipmanTransfer.onaylayan")}>{detay?.approvedByName}</BilgiAlani>
          </div>

          {sevkiyatVar && (
            <>
              <h4 className="et-bolum-basligi">{t("ekipmanTransfer.sevkiyatBilgileri")}</h4>
              <div className="et-bilgi-kutusu et-izgara-5">
                <BilgiAlani etiket={t("ekipmanTransfer.sevkiyatTarihi")}>{detay.shipmentDateTimeFormatted}</BilgiAlani>
                <BilgiAlani etiket={t("ekipmanTransfer.tasiyici")}>{detay.carrier}</BilgiAlani>
                <BilgiAlani etiket={t("ekipmanTransfer.plaka")}>{detay.plateNumber}</BilgiAlani>
                <BilgiAlani etiket={t("ekipmanTransfer.sofor")}>{detay.driverName}</BilgiAlani>
                <BilgiAlani etiket={t("ekipmanTransfer.sevkiyatNotu")}>{detay.shipmentNote}</BilgiAlani>
              </div>
            </>
          )}

          <h4 className="et-bolum-basligi">{t("ekipmanTransfer.ekipmanlarSayili", { sayi: detay?.equipments.length ?? 0 })}</h4>
          <EkipmanTablosu satirlar={detay?.equipments ?? []} teslimKolonu scrollY={320} />
        </div>
      </Spin>
    </Modal>
  );
}

TransferFisiModali.propTypes = {
  transferId: PropTypes.number,
  onKapat: PropTypes.func.isRequired,
};
