import React, { useCallback, useEffect, useState } from "react";
import { Button, Modal, Input, Typography, Tabs, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import AxiosInstance from "../../../../../../../../../api/http";
import { Controller, useForm, FormProvider } from "react-hook-form";
import MainTabs from "./MainTabs/MainTabs";

export default function CreateModal({ workshopSelectedId, onSubmit, onRefresh, secilenBakimID }) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const methods = useForm({
    defaultValues: {
      secilenID: "",
      olcumSiraNo: "",
      olcumTanim: "",
      birim: null,
      birimID: "",
      ondalikSayi: "",
      hedefDeger: "",
      olcumLimit: "",
      minimumDeger: "",
      maximumDeger: "",
      // Add other default values here
    },
  });

  const { setValue, reset, handleSubmit } = methods;

  // Aşğaıdaki form elemanlarını eklemek üçün API ye gönderilme işlemi

  const onSubmited = (data) => {
    const Body = {
      IOC_IS_TANIM_ID: secilenBakimID,
      IOC_SIRA_NO: data.olcumSiraNo,
      IOC_TANIM: data.olcumTanim,
      // IOC_BIRIM: data.birim,
      IOC_BIRIM_KOD_ID: data.birimID,
      IOC_FORMAT: data.ondalikSayi,
      IOC_HEDEF_DEGER: data.hedefDeger,
      IOC_MIN_MAX_DEGER: data.olcumLimit,
      IOC_MIN_DEGER: data.minimumDeger,
      IOC_MAX_DEGER: data.maximumDeger,
    };

    AxiosInstance.post("AddIsTanimOlcum", Body)
      .then((response) => {
        console.log("Data sent successfully:", response.data);

        if (response.status_code === 200 || response.status_code === 201) {
          message.success("Ekleme Başarılı.");
          reset();
          onRefresh(); // Tabloyu yenile
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

  const handleModalOk = () => {
    handleSubmit(onSubmited)();
    setIsModalVisible(false);
    onRefresh();
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

        <Modal width="800px" title="Ölçüm Ekle" open={isModalVisible} onOk={handleModalOk} onCancel={handleModalToggle}>
          <MainTabs />
        </Modal>
      </div>
    </FormProvider>
  );
}
