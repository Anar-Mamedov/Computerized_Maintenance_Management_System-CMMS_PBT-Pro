import React, { useCallback, useEffect, useState } from "react";
import { Button, Modal, Input, Typography, Tabs, message } from "antd";
import AxiosInstance from "../../../../../../../../../api/http";
import { Controller, useForm, FormProvider } from "react-hook-form";
import dayjs from "dayjs";
import MainTabs from "./MainTabs/MainTabs";

export default function EditModal({ selectedRow, isModalVisible, onModalClose, onRefresh, secilenIsEmriID, kapali }) {
  const methods = useForm({
    defaultValues: {
      secilenID: "",
      isTanimi: "",
      tarih: null,
      aktifBelge: false,
      belgeTipi: null,
      belgeTipiID: "",
      sureliBelge: false,
      bitisTarih: null,
      hatirlat: false,
      hatirlatmaTarih: null,
      aciklama: "",
      etiketler: "",
      // Add other default values here
    },
  });

  const { setValue, reset, handleSubmit } = methods;

  useEffect(() => {
    if (isModalVisible && selectedRow) {
      setValue("secilenID", selectedRow.key);
      setValue("isTanimi", selectedRow.DSY_TANIM);
      setValue(
        "tarih",
        selectedRow.DSY_TARIH ? (dayjs(selectedRow.DSY_TARIH).isValid() ? dayjs(selectedRow.DSY_TARIH) : null) : null
      );
      setValue("aktifBelge", selectedRow.DSY_AKTIF);
      setValue("belgeTipi", selectedRow.DSY_DOSYA_TIP);
      setValue("belgeTipiID", selectedRow.DSY_DOSYA_TIP_ID);
      setValue("sureliBelge", selectedRow.DSY_SURELI);
      setValue(
        "bitisTarih",
        selectedRow.DSY_BITIS_TARIH
          ? dayjs(selectedRow.DSY_BITIS_TARIH).isValid()
            ? dayjs(selectedRow.DSY_BITIS_TARIH)
            : null
          : null
      );
      setValue("hatirlat", selectedRow.DSY_HATIRLAT);
      setValue(
        "hatirlatmaTarih",
        selectedRow.DSY_HATIRLAT_TARIH
          ? dayjs(selectedRow.DSY_HATIRLAT_TARIH).isValid()
            ? dayjs(selectedRow.DSY_HATIRLAT_TARIH)
            : null
          : null
      );
      setValue("aciklama", selectedRow.DSY_ACIKLAMA);
      setValue("etiketler", selectedRow.DYS_ETIKET);
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
      TB_DOSYA_ID: data.secilenID,
      DSY_TANIM: data.isTanimi,
      DSY_TARIH: formatDateWithDayjs(data.tarih),
      DSY_AKTIF: data.aktifBelge,
      DSY_DOSYA_TIP_ID: data.belgeTipiID,
      DSY_SURELI: data.sureliBelge,
      DSY_BITIS_TARIH: formatDateWithDayjs(data.bitisTarih),
      DSY_HATIRLAT: data.hatirlat,
      DSY_HATIRLAT_TARIH: formatDateWithDayjs(data.hatirlatmaTarih),
      DSY_ACIKLAMA: data.aciklama,
      DYS_ETIKET: data.etiketler,
    };

    AxiosInstance.post(`UpdateDosyaById`, Body)
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
        <Modal
          width="800px"
          centered
          destroyOnClose
          title="Belge Bilgilerini Güncelle"
          open={isModalVisible}
          onOk={methods.handleSubmit(onSubmited)}
          onCancel={onModalClose}
          okButtonProps={{ disabled: kapali }}>
          <form onSubmit={methods.handleSubmit(onSubmited)}>
            <MainTabs />
          </form>
        </Modal>
      </div>
    </FormProvider>
  );
}
