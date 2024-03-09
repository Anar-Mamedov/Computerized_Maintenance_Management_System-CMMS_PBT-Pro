import React, { useCallback, useEffect, useState } from "react";
import { Button, Modal, Input, Typography, Tabs, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import AxiosInstance from "../../../../../../../../../api/http";
import { Controller, useForm, FormProvider } from "react-hook-form";
import MainTabs from "./MainTabs/MainTabs";
import dayjs from "dayjs";

export default function CreateModal({
  workshopSelectedId,
  onSubmit,
  onRefresh,
  secilenIsEmriID,
  makineTanim,
  lokasyon,
}) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  // message
  const [messageApi, contextHolder] = message.useMessage();
  // message end
  const methods = useForm({
    defaultValues: {
      secilenID: "",
      makineTanimi: "",
      lokasyon: "",
      isTanimi: "",
      yapildi: false,
      atolyeTanim: "",
      atolyeID: "",
      personelTanim: "",
      personelID: "",
      baslangicTarihi: "",
      baslangicSaati: "",
      vardiya: null,
      vardiyaID: "",
      bitisTarihi: "",
      bitisSaati: "",
      sure: "",
      aciklama: "",
      // Add other default values here
    },
  });

  const { setValue, reset, handleSubmit, watch } = methods;

  const formatDateWithDayjs = (dateString) => {
    const formattedDate = dayjs(dateString);
    return formattedDate.isValid() ? formattedDate.format("YYYY-MM-DD") : "";
  };

  const formatTimeWithDayjs = (timeObj) => {
    const formattedTime = dayjs(timeObj);
    return formattedTime.isValid() ? formattedTime.format("HH:mm:ss") : "";
  };

  // Aşğaıdaki form elemanlarını eklemek üçün API ye gönderilme işlemi

  const onSubmited = (data) => {
    const Body = {
      TB_ISEMRI_KONTROLLIST_ID: 0,
      DKN_SIRANO: data.siraNo,
      DKN_YAPILDI: data.yapildi,
      DKN_TANIM: data.isTanimi,
      DKN_OLUSTURAN_ID: 24,
      // DKN_MALIYET: data.maliyet, // Maliyet diye bir alan yok frontda
      DKN_YAPILDI_PERSONEL_ID: data.personelID,
      DKN_YAPILDI_ATOLYE_ID: data.atolyeID,
      DKN_YAPILDI_SURE: data.sure,
      DKN_ACIKLAMA: data.aciklama,
      DKN_YAPILDI_KOD_ID: -1,
      DKN_REF_ID: -1,
      DKN_YAPILDI_TARIH: formatDateWithDayjs(data.baslangicTarihi),
      DKN_YAPILDI_SAAT: formatTimeWithDayjs(data.baslangicSaati),
      DKN_BITIS_TARIH: formatDateWithDayjs(data.bitisTarihi),
      DKN_BITIS_SAAT: formatTimeWithDayjs(data.bitisSaati),
      DKN_YAPILDI_MESAI_KOD_ID: data.vardiyaID,
    };

    AxiosInstance.post(`AddUpdateIsEmriKontrolList?isEmriId=${secilenIsEmriID}`, Body)
      .then((response) => {
        console.log("Data sent successfully:", response);
        reset();
        setIsModalVisible(false); // Sadece başarılı olursa modalı kapat
        onRefresh();
        if (response.status_code === 201) {
          messageApi.open({
            type: "success",
            content: "Ekleme Başarılı",
          });
        } else {
          // Error handling
          messageApi.open({
            type: "error",
            content: "An error occurred", // Adjust the error message as needed
          });
        }
      })
      .catch((error) => {
        console.error("Error sending data:", error);
        messageApi.open({
          type: "error",
          content: "An error occurred while adding the item.",
        });
      });

    console.log({ Body });
  };

  const handleModalToggle = () => {
    setIsModalVisible((prev) => !prev);
    if (!isModalVisible) {
      reset();
    }
  };

  // Aşğaıdaki form elemanlarını eklemek üçün API ye gönderilme işlemi sonu

  useEffect(() => {
    setValue("makineTanimi", makineTanim);
    setValue("lokasyon", lokasyon);
  });

  return (
    <FormProvider {...methods}>
      {contextHolder}
      <div>
        <div style={{ display: "flex", width: "100%", justifyContent: "flex-end", marginBottom: "10px" }}>
          <Button type="link" onClick={handleModalToggle}>
            <PlusOutlined /> Yeni Kayıt
          </Button>
        </div>

        <Modal
          width="800px"
          title="Duruş Bilgisi"
          open={isModalVisible}
          onOk={methods.handleSubmit(onSubmited)}
          onCancel={handleModalToggle}>
          <form onSubmit={methods.handleSubmit(onSubmited)}>
            <MainTabs lokasyon={lokasyon} makineTanim={makineTanim} />
          </form>
        </Modal>
      </div>
    </FormProvider>
  );
}
