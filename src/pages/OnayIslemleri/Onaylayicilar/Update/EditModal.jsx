import React, { useCallback, useEffect, useState } from "react";
import { Button, Modal, Input, Typography, Tabs, message } from "antd";
import AxiosInstance from "../../../../api/http";
import { Controller, useForm, FormProvider } from "react-hook-form";
import dayjs from "dayjs";
import MainTabs from "./MainTabs/MainTabs.jsx";
import Table from "./Table/Table.jsx";

const { Text, Link } = Typography;
const { TextArea } = Input;

export default function EditModal({ selectedRow, isModalVisible, onModalClose, onRefresh }) {
  const [header, setHeader] = useState(null);
  const methods = useForm({
    defaultValues: {
      rolTanim: "",
      // Add other default values here
    },
  });

  const { setValue, reset, handleSubmit, control } = methods;

  useEffect(() => {
    if (isModalVisible && selectedRow) {
      setValue("rolTanim", selectedRow.ONY_TANIM);
      setHeader(selectedRow.ONY_TANIM);
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
      TB_ONAY_ID: selectedRow.key,
      ONY_TANIM: data.rolTanim,
      ONY_DEGISTIRME_TAR: dayjs().format("YYYY-MM-DD"),
    };

    AxiosInstance.post(`UpdateOnayTanim`, Body)
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
        <Modal width="900px" title={`${header} - Onaylayıcı Listesi`} open={isModalVisible} onOk={methods.handleSubmit(onSubmited)} onCancel={onModalClose}>
          <form onSubmit={methods.handleSubmit(onSubmited)}>
            {/*<MainTabs />*/}
            <Table SecilenID={selectedRow.key} />
          </form>
        </Modal>
      </div>
    </FormProvider>
  );
}
