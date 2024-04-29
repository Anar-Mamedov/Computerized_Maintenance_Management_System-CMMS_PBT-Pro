import React, { useCallback, useEffect, useState } from "react";
import { Button, Modal, Input, Typography, Tabs, message } from "antd";
import AxiosInstance from "../../../../../../../../../api/http";
import { Controller, useForm, FormProvider } from "react-hook-form";
import dayjs from "dayjs";
import MainTabs from "./MainTabs/MainTabs";

export default function EditModal({ selectedRow, isModalVisible, onModalClose, onRefresh, secilenIsEmriID }) {
  const methods = useForm({
    defaultValues: {
      aciklama: "",
      secilenID: "",
      makineTanimi: "",
      makineID: "",
      lokasyon: "",
      lokasyonID: "",
      proje: "",
      projeID: "",
      baslangicTarihi: "",
      baslangicSaati: "",
      bitisTarihi: "",
      bitisSaati: "",
      sure: "",
      DurusMaliyeti: "",
      toplamMaliyet: "",
      planliDurus: false,
      durusNedeni: null,
      durusNedeniID: "",
      // Add other default values here
    },
  });

  const { setValue, reset, handleSubmit } = methods;

  useEffect(() => {
    if (isModalVisible && selectedRow) {
      setValue("secilenID", selectedRow.key);
      setValue("makineTanimi", selectedRow.MKD_MAKINE?.MKN_TANIM ?? "");
      setValue("makineID", selectedRow.MKD_MAKINE_ID);
      setValue("lokasyon", selectedRow.MKD_LOKASYON?.LOK_TANIM ?? "");
      setValue("lokasyonID", selectedRow.MKD_LOKASYON_ID);
      setValue("proje", selectedRow.MKD_PROJE?.PRJ_TANIM ?? "");
      setValue("projeID", selectedRow.MKD_PROJE?.TB_PROJE_ID ?? "");
      setValue("durusNedeni", selectedRow.MKD_NEDEN);
      setValue("durusNedeniID", selectedRow.MKD_NEDEN_KOD_ID);
      setValue(
        "baslangicTarihi",
        selectedRow.MKD_BASLAMA_TARIH
          ? dayjs(selectedRow.MKD_BASLAMA_TARIH).isValid()
            ? dayjs(selectedRow.MKD_BASLAMA_TARIH)
            : null
          : null
      );
      setValue(
        "baslangicSaati",
        selectedRow.MKD_BASLAMA_SAAT
          ? dayjs(selectedRow.MKD_BASLAMA_SAAT, "HH:mm:ss").isValid()
            ? dayjs(selectedRow.MKD_BASLAMA_SAAT, "HH:mm:ss")
            : null
          : null
      );
      setValue(
        "bitisTarihi",
        selectedRow.MKD_BITIS_TARIH
          ? dayjs(selectedRow.MKD_BITIS_TARIH).isValid()
            ? dayjs(selectedRow.MKD_BITIS_TARIH)
            : null
          : null
      );
      setValue(
        "bitisSaati",
        selectedRow.MKD_BITIS_SAAT
          ? dayjs(selectedRow.MKD_BITIS_SAAT, "HH:mm:ss").isValid()
            ? dayjs(selectedRow.MKD_BITIS_SAAT, "HH:mm:ss")
            : null
          : null
      );
      setValue("sure", selectedRow.MKD_SURE);
      setValue("DurusMaliyeti", selectedRow.MKD_SAAT_MALIYET);
      setValue("toplamMaliyet", selectedRow.MKD_TOPLAM_MALIYET);
      setValue("aciklama", selectedRow.MKD_ACIKLAMA);
      setValue("planliDurus", selectedRow.MKD_PLANLI);
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
      TB_MAKINE_DURUS_ID: data.secilenID,
      MKD_MAKINE_ID: data.makineID,
      MKD_LOKASYON_ID: data.lokasyonID,
      MKD_PROJE_ID: data.projeID,
      MKD_NEDEN_KOD_ID: data.durusNedeniID,
      MKD_BASLAMA_TARIH: formatDateWithDayjs(data.baslangicTarihi),
      MKD_BASLAMA_SAAT: formatTimeWithDayjs(data.baslangicSaati),
      MKD_BITIS_TARIH: formatDateWithDayjs(data.bitisTarihi),
      MKD_BITIS_SAAT: formatTimeWithDayjs(data.bitisSaati),
      MKD_SURE: data.sure,
      MKD_SAAT_MALIYET: data.DurusMaliyeti,
      MKD_TOPLAM_MALIYET: data.toplamMaliyet,
      MKD_ACIKLAMA: data.aciklama,
      MKD_PLANLI: data.planliDurus,
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
        <Modal
          width="830px"
          title="Duruş Nedeni Güncelle"
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
