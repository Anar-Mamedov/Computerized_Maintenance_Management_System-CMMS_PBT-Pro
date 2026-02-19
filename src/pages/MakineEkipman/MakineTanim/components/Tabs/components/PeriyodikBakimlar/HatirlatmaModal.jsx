import React, { useEffect, useState } from "react";
import { Modal, Spin } from "antd";
import { useForm, FormProvider } from "react-hook-form";
import dayjs from "dayjs";
import { t } from "i18next";
import AxiosInstance from "../../../../../../../api/http";
import PeriyodikBakimBilgileriForm from "./Insert/PeriyodikBakimBilgileriForm";

export default function HatirlatmaModal({ visible, onCancel, data }) {
  const [periyotBilgiDurum, setPeriyotBilgiDurum] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  const methods = useForm({
    defaultValues: {
      sonUygulamaTarihi: null,
      hedefTarih: null,
      harırlatmaGunOnce: null,
      sayac: null,
      sonUygulamaSayac: null,
      hedefSayac: null,
      harırlatmaSayiOnce: null,
      hatırlatmaDinamikOnce: null,
    },
  });

  const { reset } = methods;

  useEffect(() => {
    if (!visible || !data) return;

    const toDate = (val) => {
      const d = dayjs(val);
      return d.isValid() ? d : null;
    };

    reset({
      sonUygulamaTarihi: toDate(data.SON_UYGULAMA_TARIH),
      hedefTarih: toDate(data.HEDEF_TARIH),
      harırlatmaGunOnce: data.PBM_HATIRLAT_TARIH ?? null,
      sayac: null,
      sonUygulamaSayac: null,
      hedefSayac: null,
      harırlatmaSayiOnce: data.PBM_HATIRLAT_SAYAC ?? null,
      hatırlatmaDinamikOnce: null,
    });

    setLoadingDetail(true);
    AxiosInstance.get(`PeriyodikBakimDetayByBakim?BakimId=${data.TB_PERIYODIK_BAKIM_ID}`)
      .then((response) => {
        const item = response[0];
        if (!item) return;

        if (item.PBK_TARIH_BAZLI_IZLE === true && item.PBK_SAYAC_BAZLI_IZLE === true) {
          setPeriyotBilgiDurum(3);
        } else if (item.PBK_TARIH_BAZLI_IZLE === true) {
          setPeriyotBilgiDurum(1);
        } else if (item.PBK_SAYAC_BAZLI_IZLE === true) {
          setPeriyotBilgiDurum(2);
        }
      })
      .catch((error) => {
        console.error("Bakım detayı yüklenemedi:", error);
      })
      .finally(() => {
        setLoadingDetail(false);
      });
  }, [visible, data, reset]);

  useEffect(() => {
    if (!visible) {
      reset();
      setPeriyotBilgiDurum(null);
    }
  }, [visible, reset]);

  return (
    <FormProvider {...methods}>
      <Modal
        width="500px"
        centered
        title={t("periyodikBakim", { defaultValue: "Periyodik Bakım" })}
        open={visible}
        onCancel={onCancel}
        onOk={onCancel}
      >
        <Spin spinning={loadingDetail}>
          <PeriyodikBakimBilgileriForm bakimData={data} periyotBilgiDurum={periyotBilgiDurum} viewOnly />
        </Spin>
      </Modal>
    </FormProvider>
  );
}
