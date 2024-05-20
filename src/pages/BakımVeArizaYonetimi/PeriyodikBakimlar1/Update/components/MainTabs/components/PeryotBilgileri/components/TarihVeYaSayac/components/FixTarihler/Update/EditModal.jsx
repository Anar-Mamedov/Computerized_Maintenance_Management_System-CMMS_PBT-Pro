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
}) {
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
      TB_IS_TANIM_KONROLLIST_ID: data.secilenID,
      ISK_SIRANO: data.siraNo,
      ISK_TANIM: data.isTanimi,
      ISK_ACIKLAMA: data.aciklama,
    };

    AxiosInstance.post("UpdateIsTanimKontrolList", Body)
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
      setValue("siraNo", selectedRow.ISK_SIRANO);
      setValue("isTanimi", selectedRow.ISK_TANIM);
      setValue("aciklama", selectedRow.ISK_ACIKLAMA);
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
          width="800px"
          title="Kontrol Listesi Güncelle"
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
