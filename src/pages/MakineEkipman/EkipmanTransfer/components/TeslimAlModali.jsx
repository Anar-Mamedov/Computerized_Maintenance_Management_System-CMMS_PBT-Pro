import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Button, Input, Modal, Spin, message } from "antd";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";
import { FormAlani, GuzergahBandi } from "./Bilgi";
import EkipmanTablosu from "./EkipmanTablosu";
import FullDatePicker from "../../../../utils/components/FullDatePicker";
import FullTimePicker from "../../../../utils/components/FullTimePicker";
import useTransferDetayi from "../useTransferDetayi";
import { hataMesaji, teslimAl } from "../transferService";
import { TESLIM_EDILDI } from "../sabitler";
import { formatNumberWithSeparators } from "../../../../utils/numberLocale";
import { kirp, tarihSaatMetni } from "../yardimcilar";

const bosForm = () => ({ teslimTarihi: dayjs(), teslimSaati: dayjs(), teslimAlan: "", not: "" });
const teslimEdildiMi = (satir) => satir.deliveryStatusKey === TESLIM_EDILDI;

/**
 * "Teslim Al": secilen bekleyen ekipmanlar teslim alinir (Receive). Daha once teslim alinanlar isaretli ve kilitli gorunur;
 * tamami teslim alininca fis Tamamlandi, kalan varsa Kismi Teslim olur (backend).
 */
export default function TeslimAlModali({ transfer, onKapat, onTamamlandi }) {
  const { t, i18n } = useTranslation();
  const { detay, yukleniyor } = useTransferDetayi(transfer?.transferId, Boolean(transfer));
  const form = useForm({ defaultValues: bosForm() });
  const { control, handleSubmit, reset } = form;
  // Yalnizca bu pencerede secilen (bekleyen) ekipmanlarin backend ID'leri.
  const [secilenIdler, setSecilenIdler] = useState([]);
  const [kaydediliyor, setKaydediliyor] = useState(false);

  useEffect(() => {
    if (!transfer) return;
    reset(bosForm());
    setSecilenIdler([]);
  }, [transfer, reset]);

  const satirlar = detay?.equipments ?? [];
  const bekleyenIdler = satirlar.filter((satir) => !teslimEdildiMi(satir)).map((satir) => satir.equipmentId);
  const isaretliSayisi = satirlar.length - bekleyenIdler.length + secilenIdler.length;
  const sayi = (deger) => formatNumberWithSeparators(deger, i18n.language);

  const rowSelection = {
    selectedRowKeys: satirlar.filter((satir) => teslimEdildiMi(satir) || secilenIdler.includes(satir.equipmentId)).map((satir) => satir.clientKey),
    getCheckboxProps: (satir) => ({ disabled: teslimEdildiMi(satir) }),
    onChange: (_anahtarlar, secilenSatirlar) => setSecilenIdler(secilenSatirlar.filter((satir) => !teslimEdildiMi(satir)).map((satir) => satir.equipmentId)),
  };

  const kaydet = handleSubmit(async (degerler) => {
    setKaydediliyor(true);
    try {
      await teslimAl({
        transferId: transfer.transferId,
        deliveryDateTime: tarihSaatMetni(degerler.teslimTarihi, degerler.teslimSaati),
        receivedBy: kirp(degerler.teslimAlan),
        note: kirp(degerler.not),
        equipmentIds: secilenIdler,
      });
      message.success(t("ekipmanTransfer.mesaj.teslimAlindi", { sayi: sayi(secilenIdler.length) }));
      onTamamlandi();
    } catch (hata) {
      console.error("Teslim alınamadı:", hata);
      message.error(hataMesaji(hata));
    } finally {
      setKaydediliyor(false);
    }
  });

  return (
    <Modal
      open={Boolean(transfer)}
      title={t("ekipmanTransfer.menu.teslimAl")}
      width={820}
      centered
      destroyOnClose
      maskClosable={!kaydediliyor}
      onCancel={onKapat}
      footer={
        <>
          <Button onClick={onKapat} disabled={kaydediliyor}>
            {t("vazgec")}
          </Button>
          <Button type="primary" loading={kaydediliyor} disabled={secilenIdler.length === 0} onClick={kaydet}>
            {t("ekipmanTransfer.menu.teslimAl")}
          </Button>
        </>
      }
    >
      <FormProvider {...form}>
        <Spin spinning={yukleniyor}>
          <div className="et-modal-govde">
            <GuzergahBandi transfer={transfer}>
              <span className="et-soluk">{t("ekipmanTransfer.seciliSayac", { secili: sayi(isaretliSayisi), toplam: sayi(satirlar.length) })}</span>
            </GuzergahBandi>

            <div className="et-form-izgarasi et-form-izgarasi--3">
              <FormAlani etiket={t("ekipmanTransfer.teslimTarihi")} zorunlu>
                <div className="et-tarih-saat">
                  <div>
                    <FullDatePicker name1="teslimTarihi" isRequired />
                  </div>
                  <div>
                    <FullTimePicker name1="teslimSaati" isRequired />
                  </div>
                </div>
              </FormAlani>
              <FormAlani etiket={t("ekipmanTransfer.teslimAlan")}>
                <Controller name="teslimAlan" control={control} render={({ field }) => <Input {...field} />} />
              </FormAlani>
              <FormAlani etiket={t("ekipmanTransfer.not")}>
                <Controller name="not" control={control} render={({ field }) => <Input {...field} />} />
              </FormAlani>
            </div>

            <div className="et-bolum-satiri">
              <h4 className="et-bolum-basligi">{t("ekipmanTransfer.ekipmanlar")}</h4>
              <div className="et-dugme-grubu">
                <Button size="small" disabled={bekleyenIdler.length === 0} onClick={() => setSecilenIdler(bekleyenIdler)}>
                  {t("ekipmanTransfer.hepsiniSec")}
                </Button>
                <Button size="small" disabled={secilenIdler.length === 0} onClick={() => setSecilenIdler([])}>
                  {t("ekipmanTransfer.hicbiriniSecme")}
                </Button>
              </div>
            </div>
            <EkipmanTablosu satirlar={satirlar} teslimKolonu rowSelection={rowSelection} scrollY={300} />
          </div>
        </Spin>
      </FormProvider>
    </Modal>
  );
}

TeslimAlModali.propTypes = {
  transfer: PropTypes.shape({
    transferId: PropTypes.number,
    transferNo: PropTypes.string,
    sourceLocationName: PropTypes.string,
    targetLocationName: PropTypes.string,
  }),
  onKapat: PropTypes.func.isRequired,
  onTamamlandi: PropTypes.func.isRequired,
};
