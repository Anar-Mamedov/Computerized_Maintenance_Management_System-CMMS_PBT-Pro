import React, { useEffect, useState } from "react";
import { Button, Modal, message } from "antd";
import { CheckOutlined } from "@ant-design/icons";
import { Controller, useForm, FormProvider } from "react-hook-form";
import AxiosInstance from "../../../../../../api/http";
import dayjs from "dayjs";
import AtolyeIsEmriCevir from "./AtolyeIsEmriCevir";

export default function AtolyeSubmit({ selectedRows, refreshTableData }) {
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [loading, setLoading] = useState(false); // Add loading state
  const methods = useForm({
    defaultValues: {
      atolyeTanim: "",
      atolyeID: "",
    },
  });
  const { setValue, reset, handleSubmit, watch } = methods;

  const formatDateWithDayjs = (dateString) => {
    const formattedDate = dayjs(dateString);
    return formattedDate.isValid() ? formattedDate.format("YYYY-MM-DD") : "";
  };

  const formatTimeWithDayjs = (timeObj) => {
    const formattedTime = dayjs(timeObj);
    return formattedTime.isValid() ? formattedTime.format("HH:mm:ss") : "";
  };

  const atolyeID = watch("atolyeID");

  useEffect(() => {
    const tbIsTalepId = selectedRows.map((row) => row.key).join(",");
    const isValidStatus = selectedRows.every((row) => [0, 1, 2].includes(row.IST_DURUM_ID));

    setIsButtonDisabled(!atolyeID || !tbIsTalepId || !isValidStatus);
  }, [atolyeID, selectedRows]);

  const onSubmited = (data) => {
    setLoading(true); // Set loading to true when form is submitted
    const atolyeIDValue = watch("atolyeID");

    const Body = selectedRows.map((row) => ({
      TALEP_ID: row.key,
      ATOLYE_ID: atolyeIDValue,
      ISM_WEB: true,
      TEKNISYEN_IDS: [],
    }));

    AxiosInstance.post(`IsTalepToIsEmri`, Body)
      .then((response) => {
        console.log("Data sent successfully:", response);
        reset();
        setTimeout(() => {
          refreshTableData();
        }, 1000);
        if (response.status_code === 200 || response.status_code === 201) {
          const aciklamaValues = response.isEmriNolari.map((item) => item.Aciklama).join(", ");
          message.success(aciklamaValues + " Numaralı İş Emirleri Oluşturulmuştur.");
        } else if (response.status_code === 401) {
          message.error("Bu işlemi yapmaya yetkiniz bulunmamaktadır.");
        } else {
          message.error("Ekleme Başarısız.");
        }
      })
      .catch((error) => {
        console.error("Error sending data:", error);
        if (navigator.onLine) {
          message.error("Hata Mesajı: " + error.message);
        } else {
          message.error("Internet Bağlantısı Mevcut Değil.");
        }
      })
      .finally(() => {
        setLoading(false); // Reset loading state after form submission is complete
      });

    console.log({ Body });
  };

  return (
    <FormProvider {...methods}>
      <div style={{ display: "flex", width: "100%", maxWidth: "315px" }}>
        <form style={{ width: "100%" }} onSubmit={methods.handleSubmit(onSubmited)}>
          <AtolyeIsEmriCevir selectedRows={selectedRows} />
        </form>
        <Button
          style={{
            padding: "0px 0px",
            width: "32px",
            height: "32px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          type="submit"
          onClick={methods.handleSubmit(onSubmited)}
          disabled={isButtonDisabled || loading} // Disable button if loading
          loading={loading} // Show loading spinner
        >
          <CheckOutlined
            style={{
              color: isButtonDisabled ? "grey" : "rgb(0, 211, 0)",
              fontSize: "18px",
            }}
          />
        </Button>
      </div>
    </FormProvider>
  );
}
