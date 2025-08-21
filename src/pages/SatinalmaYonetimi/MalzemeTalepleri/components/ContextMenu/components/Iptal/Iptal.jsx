import React, { useState } from "react";
import { Button, Modal, message } from "antd";
import Forms from "./components/Forms";
import { useForm, FormProvider } from "react-hook-form";
import AxiosInstance from "../../../../../../../api/http";

export default function Iptal({ selectedRows, refreshTableData, iptalDisabled }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const methods = useForm({
    defaultValues: {
      NedenKodId: 0,
      Aciklama: "",
    },
  });
  const { reset } = methods;

  const buttonStyle = iptalDisabled ? { display: "none" } : {};

  const onSubmited = (data) => {
    // Seçili satırlar için Body dizisi
    const Body = selectedRows.map((row) => ({
      FisId: row.key,          // row.key ile FisId atanıyor
      NedenKodId: data.NedenKodId || 0,
      Aciklama: data.Aciklama || "",
    }));

    AxiosInstance.post("MalzemeTalepIptal", Body)
      .then((response) => {
        reset();
        setIsModalOpen(false);
        refreshTableData();

        if (response.status_code === 200 || response.status_code === 201) {
          message.success("İptal işlemi başarılı.");
        } else if (response.status_code === 401) {
          message.error("Bu işlemi yapmaya yetkiniz bulunmamaktadır.");
        } else {
          message.error("İptal işlemi başarısız.");
        }
      })
      .catch((error) => {
        console.error("Error sending data:", error);
        if (navigator.onLine) {
          message.error("Hata Mesajı: " + error.message);
        } else {
          message.error("Internet Bağlantısı Mevcut Değil.");
        }
      });

    console.log({ Body });
  };

  const handleModalToggle = () => {
    setIsModalOpen((prev) => !prev);
    if (!isModalOpen) reset();
  };

  return (
    <FormProvider {...methods}>
      <div style={buttonStyle}>
        <Button type="text" onClick={handleModalToggle}>
          İptal Et
        </Button>
        <Modal
          title="Malzeme Talebi İptal"
          open={isModalOpen}
          onOk={methods.handleSubmit(onSubmited)}
          onCancel={handleModalToggle}
        >
          <form onSubmit={methods.handleSubmit(onSubmited)}>
            <Forms isModalOpen={isModalOpen} selectedRows={selectedRows} />
          </form>
        </Modal>
      </div>
    </FormProvider>
  );
}