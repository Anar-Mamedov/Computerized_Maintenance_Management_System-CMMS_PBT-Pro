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
  lokasyonID,
  makineID,
}) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  // message
  const [messageApi, contextHolder] = message.useMessage();
  // message end
  const methods = useForm({
    defaultValues: {
      aciklama: "",
      secilenID: "",
      makineTanimi: "",
      makineID: "",
      lokasyon: "",
      lokasyonID: "",
      proje: "",
      projeID: "",
      baslangicTarihi: "",
      baslangicSaati: "",
      bitisTarihi: "",
      bitisSaati: "",
      sure: "",
      DurusMaliyeti: "",
      toplamMaliyet: "",
      planliDurus: false,
      durusNedeni: null,
      durusNedeniID: "",
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
      TB_MAKINE_DURUS_ID: 0,
      MKD_MAKINE_ID: data.makineID,
      MKD_LOKASYON_ID: data.lokasyonID,
      MKD_PROJE_ID: data.projeID,
      MKD_NEDEN_KOD_ID: data.durusNedeniID,
      MKD_BASLAMA_TARIH: formatDateWithDayjs(data.baslangicTarihi),
      MKD_BASLAMA_SAAT: formatTimeWithDayjs(data.baslangicSaati),
      MKD_BITIS_TARIH: formatDateWithDayjs(data.bitisTarihi),
      MKD_BITIS_SAAT: formatTimeWithDayjs(data.bitisSaati),
      MKD_SURE: data.sure,
      MKD_SAAT_MALIYET: data.DurusMaliyeti,
      MKD_TOPLAM_MALIYET: data.toplamMaliyet,
      MKD_ACIKLAMA: data.aciklama,
      MKD_PLANLI: data.planliDurus,
    };

    AxiosInstance.post(`AddUpdateIsEmriDurus?isEmriId=${secilenIsEmriID}`, Body)
      .then((response) => {
        console.log("Data sent successfully:", response);

        if (response.status_code === 200 || response.status_code === 201) {
          message.success("Ekleme Başarılı.");
          reset();
          setIsModalVisible(false); // Sadece başarılı olursa modalı kapat
          onRefresh();
        } else if (response.status_code === 401) {
          message.error("Bu işlemi yapmaya yetkiniz bulunmamaktadır.");
        } else {
          message.error("Ekleme Başarısız.");
        }
      })
      .catch((error) => {
        // Handle errors here, e.g.:
        console.error("Error sending data:", error);
        message.error("Başarısız Olundu.");
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
    setValue("lokasyonID", lokasyonID);
    setValue("makineID", makineID);
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
          width="830px"
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
