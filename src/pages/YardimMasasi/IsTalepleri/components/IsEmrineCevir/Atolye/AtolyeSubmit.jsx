import React, { useEffect, useState } from "react";
import { Button, Modal } from "antd";
import { CheckOutlined } from "@ant-design/icons";
import { Controller, useForm, FormProvider } from "react-hook-form";
import AxiosInstance from "../../../../../../api/http";
import dayjs from "dayjs";
import AtolyeIsEmriCevir from "./AtolyeIsEmriCevir";

export default function AtolyeSubmit({ selectedRows, refreshTableData }) {
  // Butonun disabled durumunu kontrol et
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const methods = useForm({
    defaultValues: {
      atolyeTanim: "",
      atolyeID: "",
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

  // atolyeID değerini izle
  const atolyeID = watch("atolyeID");

  // atolyeID veya selectedRows değiştiğinde butonun durumunu güncelle
  useEffect(() => {
    const tbIsTalepId = selectedRows.map((row) => row.key).join(",");
    // Seçilen tüm kayıtların IST_DURUM_ID değerlerinin 0, 1 veya 2 olup olmadığını kontrol et
    const isValidStatus = selectedRows.every((row) => [0, 1, 2].includes(row.IST_DURUM_ID));

    setIsButtonDisabled(!atolyeID || !tbIsTalepId || !isValidStatus);
  }, [atolyeID, selectedRows]);

  const onSubmited = (data) => {
    // watch ile izlenen atolyeID değerini al
    const atolyeIDValue = watch("atolyeID");

    const Body = selectedRows.map((row) => ({
      TALEP_ID: row.key, // Her bir satırın key değeri, TALEP_ID'ye eşitlenir.
      USER_ID: 24, // Sabit bir değer
      ATOLYE_ID: atolyeIDValue, // Yukarıda oluşturulan teknisyen ID'leri dizisi
    }));

    // Template literals kullanarak URL içerisinde dinamik değerleri kullan
    AxiosInstance.post(`IsTalepToIsEmri`, Body)
      .then((response) => {
        console.log("Data sent successfully:", response);
        reset(); // Formu sıfırla
        // API isteği başarılı olduktan sonra bir süre bekleyip tabloyu yenile
        setTimeout(() => {
          refreshTableData(); // Tablo verilerini yenile
        }, 1000); // 1000 milisaniye (1 saniye) bekler
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
          <AtolyeIsEmriCevir selectedRows={selectedRows} />
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
