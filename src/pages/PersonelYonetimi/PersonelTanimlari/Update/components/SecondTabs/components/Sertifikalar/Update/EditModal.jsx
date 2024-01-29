import React, { useCallback, useEffect, useState } from "react";
import { Button, Modal, Input, Typography, Tabs } from "antd";
import AxiosInstance from "../../../../../../../../../api/http";
import { Controller, useForm, FormProvider } from "react-hook-form";
import dayjs from "dayjs";
import MainTabs from "./MainTabs/MainTabs";

export default function EditModal({ selectedRow, isModalVisible, onModalClose, onRefresh }) {
  const methods = useForm({
    defaultValues: {
      belgeNo: "",
      secilenID: "",
      sertifikaTipi: null,
      sertifikaTipiID: "",
      verilisTarihi: "",
      bitisTarihi: "",
      aciklama: "",
      // Add other default values here
    },
  });

  const { setValue, reset, handleSubmit } = methods;

  useEffect(() => {
    if (isModalVisible && selectedRow) {
      setValue("secilenID", selectedRow.key);
      setValue("belgeNo", selectedRow.PSE_BELGE_NO);
      setValue("sertifikaTipi", selectedRow.PSE_SERTIFIKA_TIP);
      setValue("sertifikaTipiID", selectedRow.PSE_SERTIFIKA_TIP_KOD_ID);
      setValue("verilisTarihi", dayjs(selectedRow.PSE_VERILIS_TARIH));
      setValue("bitisTarihi", dayjs(selectedRow.PSE_BITIS_TARIH));
      setValue("aciklama", selectedRow.PSE_ACIKLAMA);
    }
  }, [selectedRow, isModalVisible, setValue]);

  useEffect(() => {
    if (!isModalVisible) {
      reset();
    }
  }, [isModalVisible, reset]);

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
      TB_PERSONEL_SERTIFIKA_ID: data.secilenID,
      PSE_BELGE_NO: data.belgeNo,
      PSE_SERTIFIKA_TIP_KOD_ID: data.sertifikaTipiID,
      PSE_VERILIS_TARIH: formatDateWithDayjs(data.verilisTarihi),
      PSE_BITIS_TARIH: formatDateWithDayjs(data.bitisTarihi),
      PSE_ACIKLAMA: data.aciklama,
      PSE_OLUSTURAN_ID: 24,
    };

    AxiosInstance.post("UpdatePersonelSertifika", Body)
      .then((response) => {
        console.log("Data sent successfully:", response);
        reset();
        onModalClose(); // Modal'ı kapat
        onRefresh(); // Tabloyu yenile
      })
      .catch((error) => {
        console.error("Error sending data:", error);
      });

    console.log({ Body });
  };

  // Aşğaıdaki form elemanlarını eklemek üçün API ye gönderilme işlemi sonu

  return (
    <FormProvider {...methods}>
      <div>
        <Modal
          width="800px"
          title="Sertifika Güncelle"
          open={isModalVisible}
          onOk={methods.handleSubmit(onSubmited)}
          onCancel={onModalClose}>
          <form onSubmit={methods.handleSubmit(onSubmited)}>
            <MainTabs />
          </form>
        </Modal>
      </div>
    </FormProvider>
  );
}
