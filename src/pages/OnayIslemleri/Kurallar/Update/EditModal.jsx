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
      sortedKeys: [], // Sıralı verileri burada tutuyoruz
    },
  });

  const { setValue, reset, handleSubmit, control, watch } = methods;

  useEffect(() => {
    if (isModalVisible && selectedRow) {
      setValue("rolTanim", selectedRow.ROL_TANIM);
    }
  }, [selectedRow, isModalVisible, setValue]);

  useEffect(() => {
    if (!isModalVisible) {
      reset();
    }
  }, [isModalVisible, reset]);

  const onSubmited = (data) => {
    const Body = {
      TB_ROL_ID: selectedRow.key,
      ROL_TANIM: data.rolTanim,
      ROL_DEGISTIRME_TAR: dayjs().format("YYYY-MM-DD"),
      sortedKeys: data.sortedKeys, // Sıralı verileri API'ye gönderiyoruz
    };

    AxiosInstance.post(`UpdateOnayRolTanim`, Body)
      .then((response) => {
        console.log("Data sent successfully:", response);

        if (response.status_code === 200 || response.status_code === 201) {
          message.success("Ekleme Başarılı.");
          reset();
          onModalClose();
          onRefresh();
        } else if (response.status_code === 401) {
          message.error("Bu işlemi yapmaya yetkiniz bulunmamaktadır.");
        } else {
          message.error("Ekleme Başarısız.");
        }
      })
      .catch((error) => {
        console.error("Error sending data:", error);
        message.error("Başarısız Olundu.");
      });
    console.log({ Body });
  };

  return (
    <FormProvider {...methods}>
      <div>
        <Modal width="1200px" title="Kural Güncelle" open={isModalVisible} onOk={methods.handleSubmit(onSubmited)} onCancel={onModalClose}>
          <form onSubmit={methods.handleSubmit(onSubmited)}>
            <MainTabs />
          </form>
        </Modal>
      </div>
    </FormProvider>
  );
}
