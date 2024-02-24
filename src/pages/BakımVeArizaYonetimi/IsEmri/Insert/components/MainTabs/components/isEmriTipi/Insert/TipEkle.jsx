import { PlusOutlined } from "@ant-design/icons";
import { Button, Input, Modal, Typography } from "antd";
import React, { useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import AxiosInstance from "../../../../../../../../../api/http";

const { Text, Link } = Typography;
const { TextArea } = Input;

export default function TipEkle({ workshopSelectedId, onSubmit, onRefresh, secilenPersonelID }) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const methods = useForm({
    defaultValues: {
      yenIseEmriTipiAdi: "",
      // Add other default values here
    },
  });

  const { setValue, reset, handleSubmit, control, watch } = methods;

  const name = watch("yenIseEmriTipiAdi");

  // Aşğaıdaki form elemanlarını eklemek üçün API ye gönderilme işlemi

  const onSubmited = (data) => {
    AxiosInstance.get(`AddIsEmriTipi?isEmriTipiKey=${name}`)
      .then((response) => {
        console.log("Data sent successfully:", response);
        reset();
        setIsModalVisible(false); // Sadece başarılı olursa modalı kapat
        onRefresh();
      })
      .catch((error) => {
        console.error("Error sending data:", error);
      });
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
        <Modal
          width="480px"
          centered
          title="İş Emri Tipi Ekle"
          open={isModalVisible}
          onOk={methods.handleSubmit(onSubmited)}
          onCancel={handleModalToggle}>
          <form onSubmit={methods.handleSubmit(onSubmited)}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <Text style={{ fontSize: "14px", fontWeight: "600" }}>İş Emri Tipi Adı:</Text>
              <Controller
                name="yenIseEmriTipiAdi"
                control={control}
                rules={{ required: "Alan Boş Bırakılamaz!" }}
                render={({ field, fieldState: { error } }) => (
                  <div style={{ display: "flex", flexDirection: "column", gap: "5px", width: "300px" }}>
                    <Input
                      {...field}
                      status={error ? "error" : ""}
                      type="text" // Set the type to "text" for name input
                    />
                    {error && <div style={{ color: "red" }}>{error.message}</div>}
                  </div>
                )}
              />
            </div>
          </form>
        </Modal>
      </div>
    </FormProvider>
  );
}
