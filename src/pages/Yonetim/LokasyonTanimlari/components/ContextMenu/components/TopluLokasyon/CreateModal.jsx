import React, { useCallback, useEffect, useState } from "react";
import { Button, Modal, Input, Typography, Tabs, message, Spin } from "antd";
import AxiosInstance from "../../../../../../.././api/http";
import { Controller, useForm, FormProvider } from "react-hook-form";
import MainTabs from "./MainTabs/MainTabs.jsx";
import dayjs from "dayjs";

const { Text, Link } = Typography;
const { TextArea } = Input;

export default function CreateModal({ workshopSelectedId, onSubmit, onRefresh, secilenIsEmriID, selectedRows }) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const methods = useForm({
    defaultValues: {
      lokasyonTanim: "",
      lokasyonID: "",
      // Add other default values here
    },
  });

  const { setValue, reset, handleSubmit, watch, control } = methods;

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
      NEW_LOK_ID: data.lokasyonID,
      UPDATE_LOK_IDS: selectedRows,
    };

    AxiosInstance.post(`UpdateLokasyonToplu`, Body)
      .then((response) => {
        console.log("Data sent successfully:", response);

        if (response.status_code === 200 || response.status_code === 201) {
          message.success("Ekleme Başarılı.");
          reset();
          setIsModalVisible(false); // Sadece başarılı olursa modalı kapat
          onRefresh();
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

  const handleModalToggle = () => {
    setIsModalVisible((prev) => !prev);
    if (!isModalVisible) {
      reset();
      // Set the current date when the component mounts
      setValue("tarih", dayjs());
      setValue("saat", dayjs());
    }
  };

  // Aşğaıdaki form elemanlarını eklemek üçün API ye gönderilme işlemi sonu

  return (
    <FormProvider {...methods}>
      <div>
        <div style={{ display: "flex", width: "100%", justifyContent: "flex-end" }}>
          <Button style={{ paddingLeft: "0px" }} type="submit" onClick={handleModalToggle}>
            Toplu Lokasyon Düzenle
          </Button>
        </div>

        <Modal width="500px" title="Toplu Lokasyon Değişimi" open={isModalVisible} onOk={methods.handleSubmit(onSubmited)} onCancel={handleModalToggle}>
          {loading ? (
            <Spin spinning={loading} size="large" style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
              {/* İçerik yüklenirken gösterilecek alan */}
            </Spin>
          ) : (
            <form onSubmit={methods.handleSubmit(onSubmited)}>
              <MainTabs />
            </form>
          )}
        </Modal>
      </div>
    </FormProvider>
  );
}