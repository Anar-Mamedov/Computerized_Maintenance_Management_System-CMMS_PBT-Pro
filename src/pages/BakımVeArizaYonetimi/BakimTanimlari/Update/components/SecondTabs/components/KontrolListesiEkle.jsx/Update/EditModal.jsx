import React, { useCallback, useEffect, useState } from "react";
import { Button, Modal, Input, Typography, Tabs } from "antd";
import AxiosInstance from "../../../../../../../../../api/http";
import { Controller, useForm, FormProvider } from "react-hook-form";
import dayjs from "dayjs";
import MainTabs from "./MainTabs/MainTabs";

export default function EditModal({ selectedRow, isModalVisible, onModalClose, onRefresh }) {
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
      MRK_MARKA: data.siraNo,
      MRK_TANIM: data.isTanimi,
      MKR_ACIKLAMA: data.aciklama,
    };

    AxiosInstance.post("AddMakineMarkaTest", Body)
      .then((response) => {
        console.log("Data sent successfully:", response.data);
        reset();
      })
      .catch((error) => {
        console.error("Error sending data:", error);
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
      setValue("isTanimi", selectedRow.code);
      setValue("vardiyaBaslangicSaati", dayjs(`1970-01-01T${selectedRow.VAR_BASLAMA_SAATI}`));
      setValue("vardiyaBitisSaati", dayjs(`1970-01-01T${selectedRow.VAR_BITIS_SAATI}`));
      setValue("vardiyaTipi", selectedRow.VAR_VARDIYA_TIPI);
      setValue("vardiyaTipiID", selectedRow.VAR_VARDIYA_TIPI_KOD_ID);
      setValue("lokasyonTanim", selectedRow.VAR_LOKASYON);
      setValue("lokasyonID", selectedRow.VAR_LOKASYON_ID);
      setValue("vardiyaProjeTanim", selectedRow.VAR_PROJE);
      setValue("vardiyaProjeID", selectedRow.VAR_PROJE_ID);
      setValue("varsayilanVardiya", selectedRow.VAR_VARSAYILAN);
      setValue("gosterimRengi", selectedRow.VAR_RENK);
      setValue("vardiyaAciklama", selectedRow.VAR_ACIKLAMA);
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
          width="1200px"
          title="Kontrol Listesi Ekle"
          open={isModalVisible}
          onOk={handleModalOk}
          onCancel={onModalClose}>
          <MainTabs />
        </Modal>
      </div>
    </FormProvider>
  );
}
