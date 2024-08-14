import React, { useCallback, useEffect, useState } from "react";
import { Button, Modal, Input, Typography, Tabs, message } from "antd";
import AxiosInstance from "../../../../../../../../../api/http";
import { Controller, useForm, FormProvider } from "react-hook-form";
import dayjs from "dayjs";
import MainTabs from "./MainTabs/MainTabs";

export default function EditModal({ selectedRow, isModalVisible, onModalClose, onRefresh, secilenIsEmriID }) {
  const methods = useForm({
    defaultValues: {
      siraNo: "",
      secilenID: "",
      isTanimi: "",
      yapildi: false,
      atolyeTanim: "",
      atolyeID: "",
      personelTanim: "",
      personelID: "",
      baslangicTarihi: "",
      baslangicSaati: "",
      vardiya: "",
      vardiyaID: "",
      bitisTarihi: "",
      bitisSaati: "",
      sure: "",
      aciklama: "",
      // Add other default values here
    },
  });

  const { setValue, reset, handleSubmit } = methods;

  useEffect(() => {
    if (isModalVisible && selectedRow) {
      setValue("secilenID", selectedRow.key);
      setValue("siraNo", selectedRow.DKN_SIRANO);
      setValue("isTanimi", selectedRow.DKN_TANIM);
      setValue("yapildi", selectedRow.DKN_YAPILDI);
      setValue("atolyeTanim", selectedRow.DKN_ATOLYE_TANIM);
      setValue("atolyeID", selectedRow.DKN_YAPILDI_ATOLYE_ID);
      setValue("personelTanim", selectedRow.DKN_PERSONEL_ISIM);
      setValue("personelID", selectedRow.DKN_YAPILDI_PERSONEL_ID);
      setValue("baslangicTarihi", selectedRow.DKN_YAPILDI_TARIH ? (dayjs(selectedRow.DKN_YAPILDI_TARIH).isValid() ? dayjs(selectedRow.DKN_YAPILDI_TARIH) : null) : null);
      setValue(
        "baslangicSaati",
        selectedRow.DKN_YAPILDI_SAAT ? (dayjs(selectedRow.DKN_YAPILDI_SAAT, "HH:mm:ss").isValid() ? dayjs(selectedRow.DKN_YAPILDI_SAAT, "HH:mm:ss") : null) : null
      );

      setValue("vardiya", selectedRow.DKN_VARDIYA_TANIM);
      setValue("vardiyaID", selectedRow.DKN_YAPILDI_MESAI_KOD_ID);
      setValue("bitisTarihi", selectedRow.DKN_BITIS_TARIH ? (dayjs(selectedRow.DKN_BITIS_TARIH).isValid() ? dayjs(selectedRow.DKN_BITIS_TARIH) : null) : null);
      setValue("bitisSaati", selectedRow.DKN_BITIS_SAAT ? (dayjs(selectedRow.DKN_BITIS_SAAT, "HH:mm:ss").isValid() ? dayjs(selectedRow.DKN_BITIS_SAAT, "HH:mm:ss") : null) : null);
      setValue("sure", selectedRow.DKN_YAPILDI_SURE);
      setValue("aciklama", selectedRow.DKN_ACIKLAMA);
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
      TB_ISEMRI_KONTROLLIST_ID: data.secilenID,
      DKN_SIRANO: data.siraNo,
      DKN_YAPILDI: data.yapildi,
      DKN_TANIM: data.isTanimi,
      // DKN_MALIYET: data.maliyet, // Maliyet diye bir alan yok frontda
      DKN_YAPILDI_PERSONEL_ID: data.personelID,
      DKN_YAPILDI_ATOLYE_ID: data.atolyeID,
      DKN_YAPILDI_SURE: data.sure,
      DKN_ACIKLAMA: data.aciklama,
      DKN_YAPILDI_KOD_ID: -1,
      DKN_REF_ID: -1,
      DKN_YAPILDI_TARIH: formatDateWithDayjs(data.baslangicTarihi),
      DKN_YAPILDI_SAAT: formatTimeWithDayjs(data.baslangicSaati),
      DKN_BITIS_TARIH: formatDateWithDayjs(data.bitisTarihi),
      DKN_BITIS_SAAT: formatTimeWithDayjs(data.bitisSaati),
      DKN_YAPILDI_MESAI_KOD_ID: data.vardiyaID,
    };

    AxiosInstance.post(`AddUpdateIsEmriKontrolList?isEmriId=${secilenIsEmriID}`, Body)
      .then((response) => {
        console.log("Data sent successfully:", response);

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

  // Aşğaıdaki form elemanlarını eklemek üçün API ye gönderilme işlemi sonu

  return (
    <FormProvider {...methods}>
      <div>
        <Modal width="800px" title="Kontrol Listesi Güncelle" open={isModalVisible} onOk={methods.handleSubmit(onSubmited)} onCancel={onModalClose}>
          <form onSubmit={methods.handleSubmit(onSubmited)}>
            <MainTabs />
          </form>
        </Modal>
      </div>
    </FormProvider>
  );
}
