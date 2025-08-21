import React, { useCallback, useEffect, useState } from "react";
import { Button, Modal, Input, Typography, Tabs, message } from "antd";
import AxiosInstance from "../../../../../../../../../api/http";
import { Controller, useForm, FormProvider } from "react-hook-form";
import dayjs from "dayjs";
import MainTabs from "./MainTabs/MainTabs";

export default function EditModal({ selectedRow, isModalVisible, onModalClose, onRefresh }) {
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

  useEffect(() => {
    if (isModalVisible && selectedRow) {
      setValue("secilenID", selectedRow.key);
      setValue("lokasyonTanim", selectedRow.SANTIYE);
      setValue("lokasyonID", selectedRow.PSS_SANTIYE_ID);
      setValue("ayrilmaNedeni", selectedRow.PSS_AYRILMA_NEDEN);
      setValue("ayrilmaNedeniID", selectedRow.PSS_AYRILMA_NEDEN_KOD_ID);
      setValue("aciklama", selectedRow.PSS_ACIKLAMA);
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
      TB_PERSONEL_SANTIYE_ID: data.secilenID,
      PSS_SANTIYE_ID: data.lokasyonID,
      PSS_AYRILMA_NEDEN_KOD_ID: data.ayrilmaNedeniID,
      PSS_ACIKLAMA: data.aciklama,
    };

    AxiosInstance.post("UpdatePersonelSantiye", Body)
      .then((response) => {
        console.log("Data sent successfully:", response);
        reset();
        onModalClose(); // Modal'ı kapat
        onRefresh(); // Tabloyu yenile
        if (response.status_code === 200 || response.status_code === 201) {
          message.success("Ekleme Başarılı.");
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

  // Aşğaıdaki form elemanlarını eklemek üçün API ye gönderilme işlemi sonu

  return (
    <FormProvider {...methods}>
      <div>
        <Modal
          width="800px"
          title="Lokasyon Güncelleme"
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
