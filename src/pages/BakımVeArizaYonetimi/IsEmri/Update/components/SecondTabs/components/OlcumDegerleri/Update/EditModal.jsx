import React, { useCallback, useEffect, useState } from "react";
import { Button, Modal, Input, Typography, Tabs, message } from "antd";
import AxiosInstance from "../../../../../../../../../api/http";
import { Controller, useForm, FormProvider } from "react-hook-form";
import dayjs from "dayjs";
import MainTabs from "./MainTabs/MainTabs";

export default function EditModal({ selectedRow, isModalVisible, onModalClose, onRefresh, secilenIsEmriID }) {
  const methods = useForm({
    defaultValues: {
      birim: null,
      birimID: "",
      tarih: "",
      saat: "",
      siraNo: "",
      secilenID: "",
      tanim: "",
      olcumDegeri: 0,
      fark: 0,
      ondalikSayi: 0,
      hedefDeger: 0,
      limit: 0,
      minDeger: 0,
      maxDeger: 0,
      durum: "",
      // Add other default values here
    },
  });

  const { setValue, reset, handleSubmit } = methods;

  useEffect(() => {
    if (isModalVisible && selectedRow) {
      setValue("secilenID", selectedRow.key);
      setValue("siraNo", selectedRow.IDO_SIRANO);
      setValue(
        "tarih",
        selectedRow.IDO_TARIH ? (dayjs(selectedRow.IDO_TARIH).isValid() ? dayjs(selectedRow.IDO_TARIH) : null) : null
      );
      setValue(
        "saat",
        selectedRow.IDO_SAAT
          ? dayjs(selectedRow.IDO_SAAT, "HH:mm:ss").isValid()
            ? dayjs(selectedRow.IDO_SAAT, "HH:mm:ss")
            : null
          : null
      );
      setValue("tanim", selectedRow.IDO_TANIM);
      setValue("birim", selectedRow.IDO_BIRIM);
      setValue("birimID", selectedRow.IDO_BIRIM_KOD_ID);
      setValue("olcumDegeri", selectedRow.IDO_OLCUM_DEGER);
      setValue("fark", selectedRow.IDO_FARK);
      setValue("ondalikSayi", selectedRow.IDO_FORMAT);
      setValue("hedefDeger", selectedRow.IDO_HEDEF_DEGER);
      setValue("limit", selectedRow.IDO_MIN_MAX_DEGER);
      setValue("minDeger", selectedRow.IDO_MIN_DEGER);
      setValue("maxDeger", selectedRow.IDO_MAX_DEGER);
      setValue("durum", selectedRow.IDO_DURUM);
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
      TB_ISEMRI_OLCUM_ID: data.secilenID,
      IDO_TARIH: formatDateWithDayjs(data.tarih),
      IDO_SAAT: formatTimeWithDayjs(data.saat),
      IDO_SIRANO: data.siraNo,
      IDO_TANIM: data.tanim,
      IDO_FORMAT: data.ondalikSayi,
      IDO_HEDEF_DEGER: data.hedefDeger,
      IDO_MIN_MAX_DEGER: data.limit,
      IDO_MIN_DEGER: data.minDeger,
      IDO_MAX_DEGER: data.maxDeger,
      IDO_BIRIM_KOD_ID: data.birimID,
      IDO_OLCUM_DEGER: data.olcumDegeri,
      IDO_FARK: data.fark,
      IDO_DURUM: data.durum,
    };

    AxiosInstance.post(`AddUpdateIsEmriOlcumDegeri?isEmriId=${secilenIsEmriID}`, Body)
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
          title="Ölçüm Parametrelerini Güncelle"
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
