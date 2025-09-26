import React, { useState } from "react";
import { Button, Modal, message } from "antd";
import Forms from "./components/Forms";
import { useForm, FormProvider } from "react-hook-form";
import AxiosInstance from "../../../../../../../api/http";

export default function Iptal({ selectedRows, refreshTableData, iptalDisabled }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const methods = useForm({
    defaultValues: {
      nedenKodId: null,
      aciklama: "",
    },
  });
  const { reset } = methods;

  const buttonStyle = iptalDisabled ? { display: "none" } : {};

  const onSubmited = (data) => {
    if (!selectedRows || selectedRows.length === 0) {
    message.warning("Lütfen önce bir satır seçin.");
    return;
    }
    const Body = {
      siparisId: selectedRows[0].key,
      islem: "kapat",
      nedenKodId: data.nedenKodId,
      aciklama: data.aciklama || "",
    };

    AxiosInstance.post("SatinalmaSiparisDurum", Body)
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
        <Button style={{ display: "flex", padding: "0px 0px", alignItems: "center", justifyContent: "flex-start" }}
          onClick={handleModalToggle}
          type="text">
            Kapat
        </Button>
        <Modal
          title="Satınalma Siparişi Kapat"
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