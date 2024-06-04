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
}) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const methods = useForm({
    defaultValues: {
      secilenID: "",
      personelTanim: "",
      personelID: "",
      calismaSuresi: "",
      saatUcreti: "",
      maliyet: "",
      fazlaMesai: false,
      mesaiSuresi: "",
      mesaiUcreti: "",
      masrafMerkezi: "",
      masrafMerkeziID: "",
      vardiya: null,
      vardiyaID: "",
      aciklama: "",
      personelBaslamaSaati: "",
      personelBaslamaZamani: "",
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
      TB_ISEMRI_KAYNAK_ID: 0,
      IDK_REF_ID: data.personelID,
      IDK_SURE: data.calismaSuresi,
      IDK_SAAT_UCRETI: data.saatUcreti,
      IDK_MALIYET: data.maliyet,
      IDK_FAZLA_MESAI_VAR: data.fazlaMesai,
      IDK_FAZLA_MESAI_SURE: data.mesaiSuresi,
      IDK_FAZLA_MESAI_SAAT_UCRETI: data.mesaiUcreti,
      IDK_MASRAF_MERKEZI_ID: data.masrafMerkeziID,
      IDK_VARDIYA: data.vardiyaID,
      IDK_ACIKLAMA: data.aciklama,
      IDK_TARIH: formatDateWithDayjs(data.personelBaslamaZamani),
      IDK_SAAT: formatTimeWithDayjs(data.personelBaslamaSaati),
    };

    AxiosInstance.post(
      `AddUpdateIsEmriPersonel?isEmriId=${secilenIsEmriID}`,
      Body
    )
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
          <Button type="link" onClick={handleModalToggle}>
            <PlusOutlined /> Yeni Kayıt
          </Button>
        </div>

        <Modal
          width="985px"
          title="Personel Ekle"
          destroyOnClose
          centered
          open={isModalVisible}
          onOk={methods.handleSubmit(onSubmited)}
          onCancel={handleModalToggle}
        >
          <form onSubmit={methods.handleSubmit(onSubmited)}>
            <MainTabs />
          </form>
        </Modal>
      </div>
    </FormProvider>
  );
}
