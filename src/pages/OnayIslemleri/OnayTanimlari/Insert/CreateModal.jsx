import React, { useCallback, useEffect, useState } from "react";
import { Button, Modal, Input, Typography, Tabs, message, Spin } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import AxiosInstance from "../../../../api/http";
import { Controller, useForm, FormProvider } from "react-hook-form";
import MainTabs from "./MainTabs/MainTabs.jsx";
import dayjs from "dayjs";

const { Text, Link } = Typography;
const { TextArea } = Input;

export default function CreateModal({ workshopSelectedId, onSubmit, onRefresh, secilenIsEmriID }) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const methods = useForm({
    defaultValues: {
      rolTanim: "",
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
      ONY_TANIM: data.rolTanim,
      ONY_OLUSTURMA_TAR: dayjs().format("YYYY-MM-DD"),
    };

    AxiosInstance.post(`AddOnayTanim`, Body)
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
    }
  };

  // Aşğaıdaki form elemanlarını eklemek üçün API ye gönderilme işlemi sonu

  return (
    <FormProvider {...methods}>
      <div>
        <div style={{ display: "flex", width: "100%", justifyContent: "flex-end", marginBottom: "10px" }}>
          <Button type="link" onClick={handleModalToggle}>
            <PlusOutlined /> Yeni Kayıt
          </Button>
        </div>

        <Modal width="500px" title="Yeni Onay Ekle" open={isModalVisible} onOk={methods.handleSubmit(onSubmited)} onCancel={handleModalToggle}>
          {loading ? (
            <Spin spinning={loading} size="large" style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
              {/* İçerik yüklenirken gösterilecek alan */}
            </Spin>
          ) : (
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
                <Text style={{ fontSize: "14px", fontWeight: "600" }}>Onay Tanımı:</Text>
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
            </form>
          )}
        </Modal>
      </div>
    </FormProvider>
  );
}
