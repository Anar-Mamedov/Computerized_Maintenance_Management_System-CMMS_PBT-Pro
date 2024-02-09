import React, { useEffect, useState } from "react";
import { Button, Modal } from "antd";
import { Controller, useForm, FormProvider } from "react-hook-form";
import AxiosInstance from "../../../../../../../api/http";
import dayjs from "dayjs";
import Sekmeler from "./Sekmeler/Sekmeler";

export default function Parametreler() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const methods = useForm({
    defaultValues: {
      fisNo: "",
      iptalTarihi: "",
      iptalSaati: "",
      iptalNeden: "",
      // Add other default values here
    },
  });
  const { setValue, reset, handleSubmit } = methods;

  useEffect(() => {
    const handleDataFetchAndUpdate = async () => {
      if (isModalOpen) {
        try {
          const response = await AxiosInstance.get(`IsTalepParametre`);
          const data = response;
          const item = data[0]; // Veri dizisinin ilk elemanını al

          // Form alanlarını set et
          setValue("secilenTalepID", item.TB_IS_TALEP_ID);
          setValue("talepKodu", item.IST_KOD);
          setValue("talepteBulunan", item.IST_TALEP_EDEN_ADI);
          setValue("talepteBulunanID", item.IST_TALEP_EDEN_ID);
          setValue("secilenTalepID", item.TB_IS_TALEP_ID);
          setValue("lokasyonTanim", item.IST_BILDIREN_LOKASYON);
          setValue("lokasyonID", item.IST_BILDIREN_LOKASYON_ID);
          setValue("departman", item.IST_DEPARTMAN); // bu alan adi api'de yok
          setValue("departmanID", item.IST_DEPARTMAN_ID);
          setValue("irtibatTelefonu", item.IST_IRTIBAT_TELEFON);
          setValue("email", item.IST_MAIL_ADRES);
        } catch (error) {
          console.error("Veri çekilirken hata oluştu:", error);
        }
      }
    };

    handleDataFetchAndUpdate();
  }, [isModalOpen, setValue, methods.reset]);

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
    const Body = {
      TB_IS_TALEP_ID: data.fisNo,
      KLL_ID: 24, // Sabit bir değerse bu şekilde kalabilir, dinamikse değiştirilmelidir
      KLL_ADI: "Orjin", // Bu değer sabitse bu şekilde, dinamikse değiştirilmelidir
      IST_IPTAL_NEDEN: data.iptalNeden,
      IST_IPTAL_TARIH: formatDateWithDayjs(data.iptalTarihi),
      IST_IPTAL_SAAT: formatTimeWithDayjs(data.iptalSaati),
    };

    AxiosInstance.post("UpdateIsTalepParametre", Body)
      .then((response) => {
        console.log("Data sent successfully:", response);
        reset();
        setIsModalOpen(false); // Sadece başarılı olursa modalı kapat
      })
      .catch((error) => {
        console.error("Error sending data:", error);
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
      <div>
        <Button
          style={{ display: "flex", padding: "0px 0px", alignItems: "center", justifyContent: "flex-start" }}
          type="submit"
          onClick={handleModalToggle}>
          Parametreler
        </Button>
        <Modal
          title="Parametreler"
          open={isModalOpen}
          onOk={methods.handleSubmit(onSubmited)}
          onCancel={handleModalToggle}>
          <form onSubmit={methods.handleSubmit(onSubmited)}>
            <Sekmeler isModalOpen={isModalOpen} />
          </form>
        </Modal>
      </div>
    </FormProvider>
  );
}
