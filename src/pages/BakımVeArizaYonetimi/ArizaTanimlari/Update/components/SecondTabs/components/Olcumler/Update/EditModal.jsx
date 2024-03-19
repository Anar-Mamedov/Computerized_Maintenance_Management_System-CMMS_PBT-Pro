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
      TB_IS_TANIM_OLCUM_PARAMETRE_ID: data.secilenID,
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

    AxiosInstance.post("UpdateIsTanimOlcum", Body)
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
      setValue("olcumSiraNo", selectedRow.IOC_SIRA_NO);
      setValue("olcumTanim", selectedRow.IOC_TANIM);
      setValue("birim", selectedRow.IOC_BIRIM);
      setValue("birimID", selectedRow.IOC_BIRIM_KOD_ID);
      setValue("ondalikSayi", selectedRow.IOC_FORMAT);
      setValue("hedefDeger", selectedRow.IOC_HEDEF_DEGER);
      setValue("olcumLimit", selectedRow.IOC_MIN_MAX_DEGER);
      setValue("minimumDeger", selectedRow.IOC_MIN_DEGER);
      setValue("maximumDeger", selectedRow.IOC_MAX_DEGER);
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
        <Modal width="800px" title="Ölçüm Güncelle" open={isModalVisible} onOk={handleModalOk} onCancel={onModalClose}>
          <MainTabs />
        </Modal>
      </div>
    </FormProvider>
  );
}
