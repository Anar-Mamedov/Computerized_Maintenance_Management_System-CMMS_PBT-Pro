import React, { useCallback, useEffect, useState } from "react";
import { Button, Modal, Input, Typography, Tabs, message } from "antd";
import AxiosInstance from "../../../../api/http";
import { Controller, useForm, FormProvider } from "react-hook-form";
import dayjs from "dayjs";
import MainTabs from "./MainTabs/MainTabs.jsx";

const { Text, Link } = Typography;
const { TextArea } = Input;

export default function EditModal({ selectedRow, isModalVisible, onModalClose, onRefresh }) {
  const [header, setHeader] = useState("");
  const methods = useForm({
    defaultValues: {
      rolTanim: "",
      rolID: "",
      onayTanim: "",
      onayID: "",
      lokasyonTanim: "",
      lokasyonID: "",
      // Add other default values here
    },
  });

  const { setValue, reset, handleSubmit, control } = methods;

  useEffect(() => {
    if (isModalVisible && selectedRow) {
      setValue("rolTanim", selectedRow.ROL_TANIM);
      setValue("rolID", selectedRow.ONYK_ROL_ID);
      setValue("onayTanim", selectedRow.ONY_TANIM);
      setValue("onayID", selectedRow.ONYK_ID);
      setValue("lokasyonTanim", selectedRow.LOK_TANIM);
      setValue("lokasyonID", selectedRow.ONYK_LOKASYON_ID);
      setHeader(selectedRow.KLL_TANIM);
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
      TB_ONAY_KUL_ID: selectedRow.key,
      ONYK_ROL_ID: data.rolID,
      ONYK_ID: data.onayID,
      ONYK_KUL_ID: selectedRow.ONYK_KUL_ID,
      ONYK_LOKASYON_ID: data.lokasyonID,
    };

    AxiosInstance.post(`UpdateOnayKullanici`, Body)
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
        <Modal width="500px" title={`${header} - Onaylayıcı Tanımlama`} open={isModalVisible} onOk={methods.handleSubmit(onSubmited)} onCancel={onModalClose}>
          <form onSubmit={methods.handleSubmit(onSubmited)}>
            <MainTabs />
          </form>
        </Modal>
      </div>
    </FormProvider>
  );
}
