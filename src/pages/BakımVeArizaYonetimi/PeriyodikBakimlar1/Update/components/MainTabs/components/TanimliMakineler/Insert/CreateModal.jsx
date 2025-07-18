import React, { useCallback, useEffect, useState } from "react";
import { Button, Modal, Input, Typography, Tabs, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import AxiosInstance from "../../../../../../../../../api/http";
import { Controller, useForm, FormProvider } from "react-hook-form";
import MainTabs from "./MainTabs/MainTabs";
import PeryotBakimBilgileriEkle from "./MainTabs/PeryotBakimBilgileriEkle.jsx";
import dayjs from "dayjs";

export default function CreateModal({
  workshopSelectedId,
  onSubmit,
  onRefresh,
  secilenBakimID,
  visible,
  onCancel,
  data,
  activeTab,
  tarihSayacBakim,
  currentModalIndex,
  totalModals,
  selectedBakimID,
  periyotBilgiDurum,
}) {
  const [tabIndex, setTabIndex] = useState(0);

  useEffect(() => {
    if (periyotBilgiDurum === 1) {
      setTabIndex(2);
    } else if (periyotBilgiDurum === 2) {
      setTabIndex(1);
    } else if (periyotBilgiDurum === 3) {
      setTabIndex(0);
    }
  }, [periyotBilgiDurum]);

  const methods = useForm({
    defaultValues: {
      makineKodu: null,
      makineID: null,
      makineTanimi: null,
      makineLokasyon: null,
      makineTipi: null,
      sonUygulamaTarihi: null,
      hedefTarih: null,
      harırlatmaGunOnce: null,
      sayac: null,
      sonUygulamaSayac: null,
      hedefSayac: null,
      harırlatmaSayiOnce: null,
      hatırlatmaDinamikOnce: null,
      // Add other default values here
    },
  });

  const { setValue, reset, handleSubmit, watch } = methods;

  useEffect(() => {
    if (visible && data) {
      setValue("makineID", data.TB_MAKINE_ID);
      setValue("makineKodu", data.MKN_KOD);
      setValue("makineTanimi", data.MKN_TANIM);
      setValue("makineLokasyon", data.MKN_LOKASYON);
      setValue("makineTipi", data.MKN_TIP);
    }
  }, [data, visible, setValue]);

  // Aşğaıdaki form elemanlarını eklemek üçün API ye gönderilme işlemi

  const formatDateWithDayjs = (dateString) => {
    const formattedDate = dayjs(dateString);
    return formattedDate.isValid() ? formattedDate.format("YYYY-MM-DD") : "";
  };

  const formatTimeWithDayjs = (timeObj) => {
    const formattedTime = dayjs(timeObj);
    return formattedTime.isValid() ? formattedTime.format("HH:mm:ss") : "";
  };

  const onSubmited = async (data) => {
    const Body = {
      PBM_PERIYODIK_BAKIM_ID: selectedBakimID,
      PBM_MAKINE_ID: data.makineID,
      PBM_SAYAC_ID: -1, // sayac var sayaç ID yoksa -1
      PBM_SON_UYGULAMA_TARIH: formatDateWithDayjs(data.sonUygulamaTarihi),
      PBM_SON_UYGULAMA_SAYAC: data.sonUygulamaSayac,
      PBM_HATIRLAT_TARIH: data.harırlatmaGunOnce,
      PBM_HATIRLAT_SAYAC: data.harırlatmaSayiOnce,
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
      // Handle errors here, e.g.:
      console.error("Error sending data:", error);
      message.error("Başarısız Olundu.");
    }
    console.log({ Body });
  };

  const handleModalOk = () => {
    handleSubmit(onSubmited)();
  };

  // Aşğaıdaki form elemanlarını eklemek üçün API ye gönderilme işlemi sonu

  return (
    <FormProvider {...methods}>
      <div>
        <div
          style={{
            display: "flex",
            width: "100%",
            justifyContent: "flex-end",
            marginBottom: "10px",
          }}
        >
          <Button style={{ display: "none" }} type="link">
            <PlusOutlined /> Yeni Kayıt
          </Button>
        </div>

        <Modal width="500px" title={`Periyodik Bakım Bilgileri Ekle ${currentModalIndex}/${totalModals}`} open={visible} onCancel={onCancel} onOk={handleModalOk}>
          {/*<MainTabs />*/}
          <PeryotBakimBilgileriEkle tarihSayacBakim={tarihSayacBakim} activeTab={activeTab} periyotBilgiDurum={periyotBilgiDurum} />
        </Modal>
      </div>
    </FormProvider>
  );
}
