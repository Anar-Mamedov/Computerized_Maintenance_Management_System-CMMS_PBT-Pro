import React, { useEffect, useState } from "react";
import { Button, Input, Modal, Typography, message } from "antd";
import AxiosInstance from "../../../../../../../../../api/http";
import { Controller, useForm, FormProvider } from "react-hook-form";

const { Text, Link } = Typography;
const { TextArea } = Input;

export default function OzelAlan13({ label, onModalClose }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  // message
  const [messageApi, contextHolder] = message.useMessage();
  // message end

  const methods = useForm({
    defaultValues: {
      ozelAlan: "",
      // Add other default values here
    },
  });
  const { setValue, reset, handleSubmit } = methods;

  const onSubmited = (data) => {
    const Body = {
      OZL_OZEL_ALAN_13: data.ozelAlan,
      OZL_FORM: "ISEMRI",
      // TB_OZEL_ALAN_ID: 1,
    };

    AxiosInstance.post("OzelAlanTopicGuncelle", Body)
      .then((response) => {
        console.log("Data sent successfully:", response);
        reset();
        onModalClose(); // Add this line to trigger the refresh in parent
        setIsModalOpen(false); // Sadece başarılı olursa modalı kapat
        if (response.status_code === 200 || response.status_code === 201) {
          message.success("Ekleme Başarılı.");
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
    setIsModalOpen((prev) => !prev);
    if (!isModalOpen) {
      reset();
    }
  };

  return (
    <FormProvider {...methods}>
      {contextHolder}
      <Button type="submit" onClick={handleModalToggle}>
        {label.OZL_OZEL_ALAN_13}
      </Button>
      <Modal
        title="Özel Alan İsmi Güncelle"
        open={isModalOpen}
        onOk={methods.handleSubmit(onSubmited)}
        onCancel={handleModalToggle}>
        <form onSubmit={methods.handleSubmit(onSubmited)}>
          <div>
            <Controller name="ozelAlan" control={methods.control} render={({ field }) => <Input {...field} />} />
          </div>
        </form>
      </Modal>
    </FormProvider>
  );
}
