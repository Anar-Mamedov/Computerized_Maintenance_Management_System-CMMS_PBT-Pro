import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Button, Input, Modal, message } from "antd";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";
import { FormAlani, GuzergahBandi } from "./Bilgi";
import FullDatePicker from "../../../../utils/components/FullDatePicker";
import FullTimePicker from "../../../../utils/components/FullTimePicker";
import { hataMesaji, sevkiyataCikar } from "../transferService";
import { kirp, tarihSaatMetni } from "../yardimcilar";

const bosForm = () => ({ sevkiyatTarihi: dayjs(), sevkiyatSaati: dayjs(), tasiyici: "", plaka: "", sofor: "", not: "" });

/** "Sevkiyata Cikar": arac / plaka / sofor bilgileriyle onaylanmis fisi sevkiyata cikarir (Dispatch). */
export default function SevkiyatModali({ transfer, onKapat, onTamamlandi }) {
  const { t } = useTranslation();
  const form = useForm({ defaultValues: bosForm() });
  const { control, handleSubmit, reset } = form;
  const [kaydediliyor, setKaydediliyor] = useState(false);

  // Her acilista tarih/saat o ana kurulur.
  useEffect(() => {
    if (transfer) reset(bosForm());
  }, [transfer, reset]);

  const kaydet = handleSubmit(async (degerler) => {
    setKaydediliyor(true);
    try {
      await sevkiyataCikar({
        transferId: transfer.transferId,
        shipmentDateTime: tarihSaatMetni(degerler.sevkiyatTarihi, degerler.sevkiyatSaati),
        carrier: kirp(degerler.tasiyici),
        plateNumber: kirp(degerler.plaka),
        driverName: kirp(degerler.sofor),
        note: kirp(degerler.not),
      });
      message.success(t("ekipmanTransfer.mesaj.sevkiyataCikarildi", { no: transfer.transferNo }));
      onTamamlandi();
    } catch (hata) {
      console.error("Sevkiyata çıkarılamadı:", hata);
      message.error(hataMesaji(hata));
    } finally {
      setKaydediliyor(false);
    }
  });

  const metinAlani = (name) => <Controller name={name} control={control} render={({ field }) => <Input {...field} />} />;

  return (
    <Modal
      open={Boolean(transfer)}
      title={t("ekipmanTransfer.menu.sevkiyataCikar")}
      width={560}
      centered
      destroyOnClose
      maskClosable={!kaydediliyor}
      onCancel={onKapat}
      footer={
        <>
          <Button onClick={onKapat} disabled={kaydediliyor}>
            {t("vazgec")}
          </Button>
          <Button type="primary" loading={kaydediliyor} onClick={kaydet}>
            {t("ekipmanTransfer.menu.sevkiyataCikar")}
          </Button>
        </>
      }
    >
      <FormProvider {...form}>
        <div className="et-modal-govde">
          <GuzergahBandi transfer={transfer} />
          <div className="et-form-izgarasi">
            <FormAlani etiket={t("ekipmanTransfer.sevkiyatTarihi")} zorunlu className="et-tam-satir">
              <div className="et-tarih-saat">
                <div>
                  <FullDatePicker name1="sevkiyatTarihi" isRequired />
                </div>
                <div>
                  <FullTimePicker name1="sevkiyatSaati" isRequired />
                </div>
              </div>
            </FormAlani>
            <FormAlani etiket={t("ekipmanTransfer.tasiyici")}>{metinAlani("tasiyici")}</FormAlani>
            <FormAlani etiket={t("ekipmanTransfer.plaka")}>{metinAlani("plaka")}</FormAlani>
            <FormAlani etiket={t("ekipmanTransfer.sofor")}>{metinAlani("sofor")}</FormAlani>
            <FormAlani etiket={t("ekipmanTransfer.not")}>{metinAlani("not")}</FormAlani>
          </div>
        </div>
      </FormProvider>
    </Modal>
  );
}

SevkiyatModali.propTypes = {
  transfer: PropTypes.shape({
    transferId: PropTypes.number,
    transferNo: PropTypes.string,
    sourceLocationName: PropTypes.string,
    targetLocationName: PropTypes.string,
  }),
  onKapat: PropTypes.func.isRequired,
  onTamamlandi: PropTypes.func.isRequired,
};
