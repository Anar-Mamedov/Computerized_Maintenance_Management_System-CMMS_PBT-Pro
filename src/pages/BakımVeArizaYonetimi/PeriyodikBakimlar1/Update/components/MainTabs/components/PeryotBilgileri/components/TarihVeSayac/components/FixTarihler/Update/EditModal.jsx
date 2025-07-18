import React, { useCallback, useEffect, useState } from "react";
import { Button, Modal, Input, Typography, Tabs, message } from "antd";
import AxiosInstance from "../../../../../../../../../../../../../api/http";
import { Controller, useForm, FormProvider } from "react-hook-form";
import dayjs from "dayjs";
import MainTabs from "./MainTabs/MainTabs";

export default function EditModal({
  selectedRow,
  isModalVisible,
  onModalClose,
  onRefresh,
  secilenBakimID,
}) {
  const methods = useForm({
    defaultValues: {
      gun: "",
      secilenID: "",
      ay: "",
      // Add other default values here
    },
  });

  const { setValue, reset, handleSubmit } = methods;

  // Aşğaıdaki form elemanlarını eklemek üçün API ye gönderilme işlemi

  const onSubmited = (data) => {
    const Body = {
      PBF_PERIYODIK_BAKIM_ID: secilenBakimID,
      PBF_FIX_GUN: data.gun,
      PBF_FIX_AY: data.ay,
      TB_PERIYODIK_BAKIM_FIX_DEGER_ID: data.secilenID,
    };

    AxiosInstance.post("PeriyodikBakimFixTarihKaydetGuncelle", Body)
      .then((response) => {
        console.log("Data sent successfully:", response.data);

        if (response.status_code === 200 || response.status_code === 201) {
          message.success("Ekleme Başarılı.");
          reset();
          onModalClose(); // Modal'ı kapat
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

  const handleModalOk = () => {
    handleSubmit(onSubmited)();
    onModalClose();
    onRefresh();
  };

  // Aşğaıdaki form elemanlarını eklemek üçün API ye gönderilme işlemi sonu

  useEffect(() => {
    if (isModalVisible && selectedRow) {
      // console.log("selectedRow", selectedRow);
      // startTransition(() => {
      // Object.keys(selectedRow).forEach((key) => {
      //   console.log(key, selectedRow[key]);
      //   setValue(key, selectedRow[key]);
      setValue("secilenID", selectedRow.key);
      setValue("gun", selectedRow.PBF_FIX_GUN);
      setValue("ay", selectedRow.PBF_FIX_AY.toString());
      // add more fields as needed

      // });
      // });
    }
  }, [selectedRow, isModalVisible, setValue]);

  useEffect(() => {
    if (!isModalVisible) {
      reset();
    }
  }, [isModalVisible, reset]);

  return (
    <FormProvider {...methods}>
      <div>
        <Modal
          title="Fix Tarih Güncelleme"
          open={isModalVisible}
          onOk={handleModalOk}
          onCancel={onModalClose}
        >
          <MainTabs />
        </Modal>
      </div>
    </FormProvider>
  );
}
