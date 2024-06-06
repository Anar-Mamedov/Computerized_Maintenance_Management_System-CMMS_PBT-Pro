import React, { useCallback, useEffect, useState } from "react";
import { Button, Modal, Input, Typography, Tabs, message } from "antd";
import AxiosInstance from "../../../../../../api/http";
import { Controller, useForm, FormProvider } from "react-hook-form";
import dayjs from "dayjs";
import AcilisNedeni from "./IsEmriAcma/AcilisNedeni.jsx";
import DurumSelect from "./IsEmriAcma/DurumSelect.jsx";

const { Text, Link } = Typography;

export default function IsEmriSilme({
  selectedRows,
  refreshTableData,
  disabled,
  hidePopover,
}) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const methods = useForm({
    defaultValues: {
      acilisNedeniID: "",
      acilisNedeni: null,
      personelTanim: "",
      isEmriDurum1ID: "",
      isEmriDurum1: null,
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

  // Modalı açma ve kapama işlevi
  const handleModalToggle = () => {
    setIsModalVisible((prev) => !prev);
    if (!isModalVisible) {
      reset();
    }
  };

  // Aşğaıdaki form elemanlarını eklemek üçün API ye gönderilme işlemi

  const onSubmited = (data) => {
    // If selectedRows contains only one row
    const row = selectedRows[0];

    const Body = {
      TB_ISEMRI_ID: row.key,
      DURUM_KOD_ID: data.isEmriDurum1ID,
      NEDEN_KOD_ID: data.acilisNedeniID,
    };

    AxiosInstance.post(`IsEmriOpen`, Body)
      .then((response) => {
        console.log("Data sent successfully:", response);

        if (response.status_code === 200 || response.status_code === 201) {
          message.success("Ekleme Başarılı.");
          reset();
          setIsModalVisible(false); // Sadece başarılı olursa modalı kapat
          refreshTableData();
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
        <Button
          type="submit"
          style={{ paddingLeft: "0px" }}
          onClick={handleModalToggle}
        >
          İş Emrini Aç
        </Button>

        <Modal
          width="500px"
          title="Seçili İş Emrini Aç"
          destroyOnClose
          centered
          open={isModalVisible}
          onOk={methods.handleSubmit(onSubmited)}
          onCancel={handleModalToggle}
        >
          <form onSubmit={methods.handleSubmit(onSubmited)}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "10px",
                justifyContent: "space-between",
              }}
            >
              <Text style={{ fontSize: "14px" }}>Açılış Nedeni:</Text>
              <AcilisNedeni />
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "10px",
                justifyContent: "space-between",
              }}
            >
              <Text style={{ fontSize: "14px" }}>Yeni Durum:</Text>
              <DurumSelect />
            </div>
          </form>
        </Modal>
      </div>
    </FormProvider>
  );
}
