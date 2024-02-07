import React, { useState } from "react";
import { Button, Modal } from "antd";
import Forms from "./components/Forms";
import { Controller, useForm, FormProvider } from "react-hook-form";
import AxiosInstance from "../../../../../../api/http";
import dayjs from "dayjs";

export default function Iptal({ selectedRows, refreshTableData }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const methods = useForm({
    defaultValues: {
      fisNo: "",
      iptalTarihi: "",
      iptalSaati: "",
      iptalNedeni: "",
      iptalNedeniID: "",
      aciklama: "",
      // Add other default values here
    },
  });
  const { setValue, reset, handleSubmit } = methods;

  const formatDateWithDayjs = (dateString) => {
    const formattedDate = dayjs(dateString);
    return formattedDate.isValid() ? formattedDate.format("YYYY-MM-DD") : "";
  };

  const formatTimeWithDayjs = (timeObj) => {
    const formattedTime = dayjs(timeObj);
    return formattedTime.isValid() ? formattedTime.format("HH:mm:ss") : "";
  };

  const onSubmited = (data) => {
    // Tablodan seçilen kayıtların key ve IST_KOD değerlerini birleştir
    const tbIsTalepId = selectedRows.map((row) => row.key).join(", ");
    const istTalepNo = selectedRows.map((row) => row.IST_KOD).join(", ");
    const Body = {
      TB_IS_TALEP_ID: tbIsTalepId,
      KLL_ID: 24,
      IST_TALEP_NO: istTalepNo,
      KLL_ADI: "Orjin",
      IST_IPTAL_NEDEN: data.iptalNedeniID,
      IST_IPTAL_TARIH: formatDateWithDayjs(data.iptalTarihi),
      IST_IPTAL_SAAT: formatTimeWithDayjs(data.iptalSaati),
    };

    AxiosInstance.post("IsTalepIptalEt", Body)
      .then((response) => {
        console.log("Data sent successfully:", response);
        reset();
        setIsModalOpen(false); // Sadece başarılı olursa modalı kapat
        refreshTableData();
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
        <Button style={{ paddingLeft: "0px" }} type="text" onClick={handleModalToggle}>
          İptal
        </Button>
        <Modal
          title="İş Talebi İptal"
          open={isModalOpen}
          onOk={methods.handleSubmit(onSubmited)}
          onCancel={handleModalToggle}>
          <form onSubmit={methods.handleSubmit(onSubmited)}>
            <Forms isModalOpen={isModalOpen} selectedRows={selectedRows} />
          </form>
        </Modal>
      </div>
    </FormProvider>
  );
}
