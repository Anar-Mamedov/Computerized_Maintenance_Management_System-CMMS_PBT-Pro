import React, { useEffect, useState } from "react";
import { Button, Modal } from "antd";
import { CheckOutlined } from "@ant-design/icons";
import { Controller, useForm, FormProvider } from "react-hook-form";
import AxiosInstance from "../../../../../../api/http";
import dayjs from "dayjs";
import TeknisyenIsEmriCevir from "./TeknisyenIsEmriCevir";

export default function TeknisyenSubmit({ selectedRows, refreshTableData }) {
  // Butonun disabled durumunu kontrol et
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const methods = useForm({
    defaultValues: {
      personelTanim: "",
      personelID: "",
      // Add other default values here
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

  // personelID değerini izle
  const personelID = watch("personelID");

  // personelID veya selectedRows değiştiğinde butonun durumunu güncelle
  useEffect(() => {
    const tbIsTalepId = selectedRows.map((row) => row.key).join(",");
    setIsButtonDisabled(!personelID || !tbIsTalepId);
  }, [personelID, selectedRows]);

  const onSubmited = (data) => {
    // Tablodan seçilen kayıtların key değerlerini birleştir
    const tbIsTalepId = selectedRows.map((row) => row.key).join(","); // Eğer birden fazla ID varsa aralarına virgül koyarak birleştir

    const Body = [data.personelID];

    // Template literals kullanarak URL içerisinde dinamik değerleri kullan
    AxiosInstance.post(`IsTalepToIsEmri?talepID=${tbIsTalepId}&userId=24&atolyeId=0`, Body)
      .then((response) => {
        console.log("Data sent successfully:", response);
        reset(); // Formu sıfırla
        refreshTableData(); // Tablo verilerini yenile
      })
      .catch((error) => {
        console.error("Error sending data:", error);
      });

    console.log({ Body });
  };

  return (
    <FormProvider {...methods}>
      <div style={{ display: "flex", width: "100%", maxWidth: "430px" }}>
        <form style={{ width: "100%" }} onSubmit={methods.handleSubmit(onSubmited)}>
          <TeknisyenIsEmriCevir selectedRows={selectedRows} />
        </form>
        <Button
          style={{ paddingLeft: "0px" }}
          type="submit"
          onClick={methods.handleSubmit(onSubmited)}
          disabled={isButtonDisabled} // Butonun disabled durumunu ayarla
        >
          <CheckOutlined
            style={{
              color: isButtonDisabled ? "grey" : "rgb(0, 211, 0)", // Buton disabled ise rengi gri yap
              fontSize: "18px",
            }}
          />
        </Button>
      </div>
    </FormProvider>
  );
}
