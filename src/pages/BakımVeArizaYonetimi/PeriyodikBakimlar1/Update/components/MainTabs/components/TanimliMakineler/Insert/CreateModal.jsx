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
}) {
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

  const handleModalOk = () => {
    handleSubmit(onSubmited)();
    setIsModalVisible(false);
    onRefresh();
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
          <Button
            style={{ display: "none" }}
            type="link"
            onClick={handleModalToggle}
          >
            <PlusOutlined /> Yeni Kayıt
          </Button>
        </div>

        <Modal
          width="500px"
          title="Peryodik Bakım Bilgileri Ekle"
          open={visible}
          onCancel={onCancel}
          onOk={handleModalOk}
        >
          {/*<MainTabs />*/}
          <PeryotBakimBilgileriEkle />
        </Modal>
      </div>
    </FormProvider>
  );
}
