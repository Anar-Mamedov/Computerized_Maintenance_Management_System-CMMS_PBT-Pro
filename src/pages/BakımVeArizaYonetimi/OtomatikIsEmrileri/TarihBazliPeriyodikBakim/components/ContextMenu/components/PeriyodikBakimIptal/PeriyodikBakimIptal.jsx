import React, { useEffect, useState } from "react";
import { Button, Modal, message, Typography } from "antd";
import Forms from "./components/Forms";
import { Controller, useForm, FormProvider } from "react-hook-form";
import AxiosInstance from "../../../../../../../../api/http";
import dayjs from "dayjs";

const { Text, Link } = Typography;

export default function Iptal({ selectedRows, refreshTableData, kapatDisabled }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const methods = useForm({
    defaultValues: {
      iptalNedeniiID: null,
      iptalNedenii: null,
      aciklama: "",
      // Add other default values here
    },
  });
  const { setValue, reset, handleSubmit } = methods;

  useEffect(() => {
    if (isModalOpen && selectedRows) {
      const item = selectedRows[0];
      setValue("hedefTarihi", item.PlanlamaTarih ? (dayjs(item.PlanlamaTarih).isValid() ? dayjs(item.PlanlamaTarih) : null) : null);
    }
  }, [selectedRows, isModalOpen, setValue]);

  // Sil düğmesini gizlemek için koşullu stil
  const buttonStyle = kapatDisabled ? { display: "none" } : {};

  const formatDateWithDayjs = (dateString) => {
    const formattedDate = dayjs(dateString);
    return formattedDate.isValid() ? formattedDate.format("YYYY-MM-DD") : "";
  };

  const formatTimeWithDayjs = (timeObj) => {
    const formattedTime = dayjs(timeObj);
    return formattedTime.isValid() ? formattedTime.format("HH:mm:ss") : "";
  };

  const onSubmited = (data) => {
    // Seçili satırlar için Body dizisini oluştur
    const Body = selectedRows.map((row) => ({
      PBM_MAKINE_ID: row.MakineID,
      PBM_PERIYODIK_BAKIM_ID: row.BakimID,
      // PBM_HEDEF_TARIH: data.hedefTarihi ? dayjs(data.hedefTarihi).format("YYYY-MM-DD") : null,
      PBM_HEDEF_TARIH: row.PlanlamaTarih,
      PBI_IPTAL_NEDEN_KOD_ID: Number(data.iptalNedeniiID),
      PBI_ACIKLAMA: data.aciklama,
    }));

    AxiosInstance.post("PBakimMakineIptal", Body)
      .then((response) => {
        console.log("Data sent successfully:", response);
        reset();
        setIsModalOpen(false); // Sadece başarılı olursa modalı kapat
        refreshTableData();
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
        if (navigator.onLine) {
          // İnternet bağlantısı var
          message.error("Hata Mesajı: " + error.message);
        } else {
          // İnternet bağlantısı yok
          message.error("Internet Bağlantısı Mevcut Değil.");
        }
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
      <div style={buttonStyle}>
        <Text style={{ cursor: "pointer", color: "#ff4d4f" }} type="text" onClick={handleModalToggle}>
          İptal
        </Text>
        <Modal title="İptal" open={isModalOpen} onOk={methods.handleSubmit(onSubmited)} onCancel={handleModalToggle}>
          <form onSubmit={methods.handleSubmit(onSubmited)}>
            <Forms isModalOpen={isModalOpen} selectedRows={selectedRows} />
          </form>
        </Modal>
      </div>
    </FormProvider>
  );
}
