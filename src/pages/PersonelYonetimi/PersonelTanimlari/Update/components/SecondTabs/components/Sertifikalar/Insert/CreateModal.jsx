import React, { useCallback, useEffect, useState } from "react";
import { Button, Modal, Input, Typography, Tabs } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import AxiosInstance from "../../../../../../../../../api/http";
import { Controller, useForm, FormProvider } from "react-hook-form";
import MainTabs from "./MainTabs/MainTabs";

export default function CreateModal({ workshopSelectedId, onSubmit, onRefresh, secilenBakimID }) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const methods = useForm({
    defaultValues: {
      siraNo: "",
      secilenID: "",
      isTanimi: "",
      aciklama: "",
      // Add other default values here
    },
  });

  const { setValue, reset, handleSubmit } = methods;

  // Aşğaıdaki form elemanlarını eklemek üçün API ye gönderilme işlemi

  const onSubmited = (data) => {
    const Body = {
      ISK_IS_TANIM_ID: secilenBakimID,
      ISK_SIRANO: data.siraNo,
      ISK_TANIM: data.isTanimi,
      ISK_ACIKLAMA: data.aciklama,
    };

    AxiosInstance.post("AddIsTanimKontrolList", Body)
      .then((response) => {
        console.log("Data sent successfully:", response.data);
        reset();
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

        <Modal
          width="800px"
          title="Sertifika Tanımı"
          open={isModalVisible}
          onOk={handleModalOk}
          onCancel={handleModalToggle}>
          <MainTabs />
        </Modal>
      </div>
    </FormProvider>
  );
}