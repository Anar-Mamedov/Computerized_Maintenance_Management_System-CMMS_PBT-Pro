import React, { useCallback, useEffect, useState } from "react";
import { Button, Modal, Input, Typography, Tabs, message } from "antd";
import AxiosInstance from "../../../../api/http";
import { Controller, useForm, FormProvider } from "react-hook-form";
import dayjs from "dayjs";
import MainTabs from "./MainTabs/MainTabs.jsx";

const { Text, Link } = Typography;
const { TextArea } = Input;

export default function EditModal({ selectedRow, isModalVisible, onModalClose, onRefresh }) {
  const methods = useForm({
    defaultValues: {
      rolTanim: "",
      aciklama: "",
      // Add other default values here
    },
  });

  const { setValue, reset, handleSubmit, control } = methods;

  useEffect(() => {
    if (isModalVisible && selectedRow) {
      setValue("rolTanim", selectedRow.ROL_TANIM);
      setValue("aciklama", selectedRow.ROL_ACIKLAMA);
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
      TB_ROL_ID: selectedRow.key,
      ROL_TANIM: data.rolTanim,
      ROL_ACIKLAMA: data.aciklama,
      ROL_DEGISTIRME_TAR: dayjs().format("YYYY-MM-DD"),
    };

    AxiosInstance.post(`UpdateOnayRolTanim`, Body)
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
        <Modal width="500px" title="Rol Tanımı Güncelle" open={isModalVisible} onOk={methods.handleSubmit(onSubmited)} onCancel={onModalClose}>
          <form onSubmit={methods.handleSubmit(onSubmited)}>
            {/*<MainTabs />*/}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
                maxWidth: "450px",
                gap: "10px",
                rowGap: "0px",
                marginBottom: "10px",
              }}
            >
              <Text style={{ fontSize: "14px", fontWeight: "600" }}>Rol Tanımı:</Text>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  maxWidth: "300px",
                  minWidth: "300px",
                  gap: "10px",
                  width: "100%",
                }}
              >
                <Controller
                  name="rolTanim"
                  control={control}
                  rules={{ required: "Alan Boş Bırakılamaz!" }}
                  render={({ field, fieldState: { error } }) => (
                    <div style={{ display: "flex", flexDirection: "column", gap: "5px", width: "100%" }}>
                      <Input {...field} status={error ? "error" : ""} style={{ flex: 1 }} />
                      {error && <div style={{ color: "red" }}>{error.message}</div>}
                    </div>
                  )}
                />
              </div>
            </div>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "start",
                justifyContent: "space-between",
                width: "100%",
                maxWidth: "450px",
                gap: "10px",
                rowGap: "0px",
                marginBottom: "10px",
              }}
            >
              <Text style={{ fontSize: "14px" }}>Açıklama:</Text>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  maxWidth: "300px",
                  minWidth: "300px",
                  gap: "10px",
                  width: "100%",
                }}
              >
                <Controller
                  name="aciklama"
                  control={control}
                  render={({ field }) => (
                    <div style={{ display: "flex", flexDirection: "column", gap: "5px", width: "100%" }}>
                      <TextArea {...field} rows={4} style={{ flex: 1 }} />
                    </div>
                  )}
                />
              </div>
            </div>
          </form>
        </Modal>
      </div>
    </FormProvider>
  );
}
