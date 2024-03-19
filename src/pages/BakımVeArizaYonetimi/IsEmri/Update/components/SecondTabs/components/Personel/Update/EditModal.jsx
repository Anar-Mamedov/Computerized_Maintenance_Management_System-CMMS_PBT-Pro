import React, { useCallback, useEffect, useState } from "react";
import { Button, Modal, Input, Typography, Tabs, message } from "antd";
import AxiosInstance from "../../../../../../../../../api/http";
import { Controller, useForm, FormProvider } from "react-hook-form";
import dayjs from "dayjs";
import MainTabs from "./MainTabs/MainTabs";

export default function EditModal({ selectedRow, isModalVisible, onModalClose, onRefresh, secilenIsEmriID }) {
  const methods = useForm({
    defaultValues: {
      secilenID: "",
      personelTanim: "",
      personelID: "",
      calismaSuresi: "",
      saatUcreti: "",
      maliyet: "",
      fazlaMesai: false,
      mesaiSuresi: "",
      mesaiUcreti: "",
      masrafMerkezi: "",
      masrafMerkeziID: "",
      vardiya: null,
      vardiyaID: "",
      aciklama: "",
      // Add other default values here
    },
  });

  const { setValue, reset, handleSubmit } = methods;

  useEffect(() => {
    if (isModalVisible && selectedRow) {
      setValue("secilenID", selectedRow.key);
      setValue("personelTanim", selectedRow.IDK_ISIM);
      setValue("personelID", selectedRow.IDK_PERSONEL_ID);
      setValue("calismaSuresi", selectedRow.IDK_SURE);
      setValue("saatUcreti", selectedRow.IDK_SAAT_UCRETI);
      setValue("maliyet", selectedRow.IDK_MALIYET);
      setValue("fazlaMesai", selectedRow.IDK_FAZLA_MESAI_VAR);
      setValue("mesaiSuresi", selectedRow.IDK_FAZLA_MESAI_SURE);
      setValue("mesaiUcreti", selectedRow.IDK_FAZLA_MESAI_SAAT_UCRETI);
      setValue("masrafMerkezi", selectedRow.IDK_MASRAF_MERKEZI);
      setValue("masrafMerkeziID", selectedRow.IDK_MASRAF_MERKEZI_ID);
      setValue("vardiya", selectedRow.IDK_VARDIYA_TANIM);
      setValue("vardiyaID", selectedRow.IDK_VARDIYA);
      setValue("aciklama", selectedRow.IDK_ACIKLAMA);
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
      TB_ISEMRI_KAYNAK_ID: data.secilenID,
      IDK_REF_ID: data.personelID,
      IDK_SURE: data.calismaSuresi,
      IDK_SAAT_UCRETI: data.saatUcreti,
      IDK_MALIYET: data.maliyet,
      IDK_FAZLA_MESAI_VAR: data.fazlaMesai,
      IDK_FAZLA_MESAI_SURE: data.mesaiSuresi,
      IDK_FAZLA_MESAI_SAAT_UCRETI: data.mesaiUcreti,
      IDK_MASRAF_MERKEZI_ID: data.masrafMerkeziID,
      IDK_VARDIYA: data.vardiyaID,
      IDK_ACIKLAMA: data.aciklama,
    };

    AxiosInstance.post(`AddUpdateIsEmriPersonel?isEmriId=${secilenIsEmriID}`, Body)
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
          width="985px"
          title="Personel Güncelle"
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
