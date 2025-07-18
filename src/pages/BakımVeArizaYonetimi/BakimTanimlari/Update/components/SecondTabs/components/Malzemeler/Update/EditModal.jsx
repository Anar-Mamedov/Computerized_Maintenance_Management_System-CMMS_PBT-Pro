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
      malzemeKoduTanim: "",
      malzemeKoduID: "",
      malzemeTanimi: "",
      malzemeTipi: null,
      malzemeTipiID: "",
      mazemeMiktari: "",
      miktarBirim: null,
      miktarBirimID: "",
      mazemeFiyati: "",
      mazemeMaliyeti: "",
      // Add other default values here
    },
  });

  const { setValue, reset, handleSubmit } = methods;

  // Aşğaıdaki form elemanlarını eklemek üçün API ye gönderilme işlemi

  const onSubmited = (data) => {
    const Body = {
      TB_IS_TANIM_MLZ_ID: data.secilenID,
      // ISM_STOK_KOD: data.malzemeKoduTanim,
      ISM_STOK_ID: data.malzemeKoduID,
      ISM_STOK_TANIM: data.malzemeTanimi,
      // ISM_STOK_TIP: data.malzemeTipi,
      ISM_STOK_TIP_KOD_ID: data.malzemeTipiID,
      ISM_MIKTAR: data.mazemeMiktari,
      // ISM_BIRIM: data.miktarBirim,
      ISM_BIRIM_KOD_ID: data.miktarBirimID,
      ISM_BIRIM_FIYAT: data.mazemeFiyati,
      ISM_TUTAR: data.mazemeMaliyeti,
    };

    AxiosInstance.post("UpdateIsTanimMalzeme", Body)
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
      setValue("malzemeKoduTanim", selectedRow.ISM_STOK_KOD);
      setValue("malzemeKoduID", selectedRow.ISM_STOK_ID);
      setValue("malzemeTanimi", selectedRow.ISM_STOK_TANIM);
      setValue("malzemeTipi", selectedRow.ISM_STOK_TIP);
      setValue("malzemeTipiID", selectedRow.ISM_STOK_TIP_KOD_ID);
      setValue("mazemeMiktari", selectedRow.ISM_MIKTAR);
      setValue("miktarBirim", selectedRow.ISM_BIRIM);
      setValue("miktarBirimID", selectedRow.ISM_BIRIM_KOD_ID);
      setValue("mazemeFiyati", selectedRow.ISM_BIRIM_FIYAT);
      setValue("mazemeMaliyeti", selectedRow.ISM_TUTAR);
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
          title="Malzeme Güncelle"
          open={isModalVisible}
          onOk={handleModalOk}
          onCancel={onModalClose}>
          <MainTabs />
        </Modal>
      </div>
    </FormProvider>
  );
}
