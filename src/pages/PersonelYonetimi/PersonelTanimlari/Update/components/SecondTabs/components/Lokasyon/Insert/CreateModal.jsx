import React, { useCallback, useEffect, useState } from "react";
import { Button, Modal, Input, Typography, Tabs } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import AxiosInstance from "../../../../../../../../../api/http";
import { Controller, useForm, FormProvider } from "react-hook-form";
import MainTabs from "./MainTabs/MainTabs";
import dayjs from "dayjs";

export default function CreateModal({ workshopSelectedId, onSubmit, onRefresh, secilenPersonelID }) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const methods = useForm({
    defaultValues: {
      secilenID: "",
      lokasyonTanim: "",
      lokasyonID: "",
      ayrilmaNedeni: "",
      ayrilmaNedeniID: "",
      aciklama: "",
      // Add other default values here
    },
  });

  const { setValue, reset, handleSubmit } = methods;

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
      PSS_PERSONEL_ID: secilenPersonelID,
      PSS_SANTIYE_ID: data.lokasyonID,
      PSS_AYRILMA_NEDEN_KOD_ID: data.ayrilmaNedeniID,
      PSS_ACIKLAMA: data.aciklama,
      PSS_OLUSTURAN_ID: 24,
    };

    AxiosInstance.post("AddPersonelSantiye", Body)
      .then((response) => {
        console.log("Data sent successfully:", response);
        reset();
        setIsModalVisible(false); // Sadece başarılı olursa modalı kapat
        onRefresh();
      })
      .catch((error) => {
        console.error("Error sending data:", error);
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

  return (
    <FormProvider {...methods}>
      <div>
        <div style={{ display: "flex", width: "100%", justifyContent: "flex-end", marginBottom: "10px" }}>
          <Button type="link" onClick={handleModalToggle}>
            <PlusOutlined /> Yeni Kayıt
          </Button>
        </div>

        <Modal
          width="800px"
          title="Lokasyon Ekleme"
          open={isModalVisible}
          onOk={methods.handleSubmit(onSubmited)}
          onCancel={handleModalToggle}>
          <form onSubmit={methods.handleSubmit(onSubmited)}>
            <MainTabs />
          </form>
        </Modal>
      </div>
    </FormProvider>
  );
}
