import React, { useEffect, useState } from "react";
import { Button, Modal, message } from "antd";
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
    const isValidStatus = selectedRows.every((row) =>
      [0, 1, 2].includes(row.IST_DURUM_ID)
    );

    setIsButtonDisabled(!personelID || !tbIsTalepId || !isValidStatus);
  }, [personelID, selectedRows]);

  const onSubmited = (data) => {
    // Tablodan seçilen kayıtların key değerlerini birleştir
    const tbIsTalepId = selectedRows.map((row) => row.key).join(","); // Eğer birden fazla ID varsa aralarına virgül koyarak birleştir

    const teknisyenIds = watch("personelID")
      .split(",")
      .map((id) => parseInt(id.trim()));

    const Body = selectedRows.map((row) => ({
      TALEP_ID: row.key, // Her bir satırın key değeri, TALEP_ID'ye eşitlenir.
      TEKNISYEN_IDS: teknisyenIds, // Yukarıda oluşturulan teknisyen ID'leri dizisi
      ISM_WEB: true,
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
        if (response.status_code === 200 || response.status_code === 201) {
          const aciklamaValues = response.isEmriNolari
            .map((item) => item.Aciklama)
            .join(", ");
          message.success(
            aciklamaValues + " Numaralı İş Emirleri Oluşturulmuştur."
          );
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

  return (
    <FormProvider {...methods}>
      <div style={{ display: "flex", width: "100%", maxWidth: "335px" }}>
        <form
          style={{ width: "100%" }}
          onSubmit={methods.handleSubmit(onSubmited)}
        >
          <TeknisyenIsEmriCevir selectedRows={selectedRows} />
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
