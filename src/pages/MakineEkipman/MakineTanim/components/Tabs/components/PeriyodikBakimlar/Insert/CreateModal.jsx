import React, { useEffect, useState } from "react";
import { Modal, message, Spin } from "antd";
import { useForm, FormProvider } from "react-hook-form";
import dayjs from "dayjs";
import AxiosInstance from "../../../../../../../../api/http";
import PeriyodikBakimBilgileriForm from "./PeriyodikBakimBilgileriForm";

export default function CreateModal({ makineId, visible, onCancel, data, onRefresh, currentModalIndex, totalModals }) {
  const [tabIndex, setTabIndex] = useState(0);
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

  const { reset, handleSubmit } = methods;

  useEffect(() => {
    if (!visible || !data) return;

    setLoadingDetail(true);
    AxiosInstance.get(`PeriyodikBakimDetayByBakim?BakimId=${data.TB_PERIYODIK_BAKIM_ID}`)
      .then((response) => {
        const item = response[0];
        if (!item) return;

        if (item.PBK_TARIH_BAZLI_IZLE === true && item.PBK_SAYAC_BAZLI_IZLE === true) {
          setPeriyotBilgiDurum(3);
          setTabIndex(0);
        } else if (item.PBK_TARIH_BAZLI_IZLE === true && !item.PBK_SAYAC_BAZLI_IZLE) {
          setPeriyotBilgiDurum(1);
          setTabIndex(2);
        } else if (!item.PBK_TARIH_BAZLI_IZLE && item.PBK_SAYAC_BAZLI_IZLE) {
          setPeriyotBilgiDurum(2);
          setTabIndex(1);
        }
      })
      .catch((error) => {
        console.error("Bakım detayı yüklenemedi:", error);
      })
      .finally(() => {
        setLoadingDetail(false);
      });
  }, [visible, data]);

  useEffect(() => {
    if (!visible) {
      reset();
      setPeriyotBilgiDurum(null);
      setTabIndex(0);
    }
  }, [visible, reset]);

  const formatDateWithDayjs = (dateString) => {
    const formattedDate = dayjs(dateString);
    return formattedDate.isValid() ? formattedDate.format("YYYY-MM-DD") : "";
  };

  const onSubmited = async (formData) => {
    const Body = {
      PBM_PERIYODIK_BAKIM_ID: data.TB_PERIYODIK_BAKIM_ID,
      PBM_MAKINE_ID: makineId,
      PBM_SAYAC_ID: -1,
      PBM_SON_UYGULAMA_TARIH: formatDateWithDayjs(formData.sonUygulamaTarihi),
      PBM_SON_UYGULAMA_SAYAC: formData.sonUygulamaSayac,
      PBM_HATIRLAT_TARIH: formData.harırlatmaGunOnce,
      PBM_HATIRLAT_SAYAC: formData.harırlatmaSayiOnce,
    };

    try {
      const response = await AxiosInstance.post(`PBakimMakineAdd?tipID=${tabIndex}`, Body);
      if (response.status_code === 200 || response.status_code === 201) {
        message.success("Ekleme Başarılı.");
        onCancel();
        onRefresh();
        reset();
      } else if (response.status_code === 401) {
        message.error("Bu işlemi yapmaya yetkiniz bulunmamaktadır.");
      } else {
        message.error("Ekleme Başarısız.");
      }
    } catch (error) {
      console.error("Error sending data:", error);
      message.error("Başarısız Olundu.");
    }
  };

  const handleModalOk = () => {
    handleSubmit(onSubmited)();
  };

  return (
    <FormProvider {...methods}>
      <Modal width="500px" title={`Periyodik Bakım Ekle ${currentModalIndex}/${totalModals}`} open={visible} onCancel={onCancel} onOk={handleModalOk}>
        <Spin spinning={loadingDetail}>
          <PeriyodikBakimBilgileriForm bakimData={data} periyotBilgiDurum={periyotBilgiDurum} />
        </Spin>
      </Modal>
    </FormProvider>
  );
}
