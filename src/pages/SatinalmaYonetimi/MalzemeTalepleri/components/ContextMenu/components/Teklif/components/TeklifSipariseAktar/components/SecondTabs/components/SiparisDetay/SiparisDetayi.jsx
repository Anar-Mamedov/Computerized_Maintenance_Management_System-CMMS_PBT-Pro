import React, { useEffect, useState } from "react";
import { Drawer, Typography, Button, Input, Select, DatePicker, TimePicker, Row, Col, Checkbox, InputNumber, Radio, message } from "antd";
import { Controller, useFormContext } from "react-hook-form";
import styled from "styled-components";
import dayjs from "dayjs";
import { t } from "i18next";
import AxiosInstance from "../../../../../../../../../../../../../api/http";
// import PlakaSelectBox from "../../../../../../../_root/components/PlakaSelectbox";
import KodIDSelectbox from "../../../../../../../../../../../../../utils/components/KodIDSelectbox";
import MasrafMerkezi from "../../../../../../../../../../../../../utils/components/MasrafMerkeziTablo";
import AtolyeTablo from "../../../../../../../../../../../../../utils/components/AtolyeTablo";
import DepoTablo from "../../../../../../../../../../../../../utils/components/DepoTablo";
import { PlusOutlined } from "@ant-design/icons";

const { Text, Link } = Typography;
const { TextArea } = Input;

const StyledInput = styled(Input)`
  @media (min-width: 600px) {
    max-width: 720px;
  }
  @media (max-width: 600px) {
    max-width: 300px;
  }
`;

const StyledDiv = styled.div`
  @media (min-width: 600px) {
    width: 100%;
    max-width: 720px;
  }
  @media (max-width: 600px) {
    width: 100%;
    max-width: 300px;
  }
`;

const StyledDivBottomLine = styled.div`
  @media (min-width: 600px) {
    alignitems: "center";
  }
  @media (max-width: 600px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const StyledDivMedia = styled.div`
  .anar {
    @media (min-width: 600px) {
      max-width: 720px;
      width: 100%;
    }
    @media (max-width: 600px) {
      flex-direction: column;
      align-items: flex-start;
    }
  }
`;

export default function MainTabs({ modalOpen }) {
  const {
    control,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();
  const [localeDateFormat, setLocaleDateFormat] = useState("DD/MM/YYYY"); // Varsayılan format
  const [localeTimeFormat, setLocaleTimeFormat] = useState("HH:mm"); // Default time format
  const [selectboxTitle, setSelectboxTitle] = useState("Yetkili Servis");
  const [initialTalepNo, setInitialTalepNo] = useState("");
  const [isTalepNoModified, setIsTalepNoModified] = useState(false);
  const [isLokasyonModalOpen, setIsLokasyonModalOpen] = useState(false);
  const [isMasrafMerkeziModalOpen, setIsMasrafMerkeziModalOpen] = useState(false);
  const [isAtolyeModalOpen, setIsAtolyeModalOpen] = useState(false);
  const [initialBaslik, setInitialBaslik] = useState("");
  const [isBaslikModified, setIsBaslikModified] = useState(false);

  const handleMinusClick = () => {
    setValue("servisKodu", "");
    setValue("servisKoduID", "");
    setValue("servisTanimi", "");
    setValue("servisTipi", "");
    setValue("servisTipiID", "");
  };

  const handleHasarNoMinusClick = () => {
    setValue("hasarNo", "");
    setValue("hasarNoID", "");
  };
  const handleIslemiYapan1MinusClick = () => {
    setValue("islemiYapan1", "");
    setValue("islemiYapan1ID", "");
  };

  // duzenlenmeTarihi ve duzenlenmeSaati alanlarının boş ve ye sistem tarih ve saatinden büyük olup olmadığını kontrol etmek için bir fonksiyon

  const validateDateTime = (value) => {
    const date = watch("duzenlenmeTarihi");
    const time = watch("duzenlenmeSaati");
    if (!date || !time) {
      return "Alan Boş Bırakılamaz!";
    }
    const currentTime = dayjs();
    const inputDateTime = dayjs(`${dayjs(date).format("YYYY-MM-DD")} ${dayjs(time).format("HH:mm")}`);
    if (inputDateTime.isAfter(currentTime)) {
      return "Düzenlenme tarihi ve saati mevcut tarih ve saatten büyük olamaz";
    }
    return true;
  };

  // duzenlenmeTarihi ve duzenlenmeSaati alanlarının boş ve ye sistem tarih ve saatinden büyük olup olmadığını kontrol etmek için bir fonksiyon sonu

  // sistemin o anki tarih ve saatini almak için

  useEffect(() => {
    if (modalOpen) {
      const currentDate = dayjs(); // Şu anki tarih için dayjs nesnesi
      const currentTime = dayjs(); // Şu anki saat için dayjs nesnesi

      // Tarih ve saat alanlarını güncelle
      setTimeout(() => {
        setValue("duzenlenmeTarihi", currentDate);
        setValue("duzenlenmeSaati", currentTime);
      }, 50);
    }
  }, [modalOpen, setValue]);

  // sistemin o anki tarih ve saatini almak sonu

  // tarihleri kullanıcının local ayarlarına bakarak formatlayıp ekrana o şekilde yazdırmak için

  // Intl.DateTimeFormat kullanarak tarih formatlama
  const formatDate = (date) => {
    if (!date) return "";

    // Örnek bir tarih formatla ve ay formatını belirle
    const sampleDate = new Date(2021, 0, 21); // Ocak ayı için örnek bir tarih
    const sampleFormatted = new Intl.DateTimeFormat(navigator.language).format(sampleDate);

    let monthFormat;
    if (sampleFormatted.includes("January")) {
      monthFormat = "long"; // Tam ad ("January")
    } else if (sampleFormatted.includes("Jan")) {
      monthFormat = "short"; // Üç harfli kısaltma ("Jan")
    } else {
      monthFormat = "2-digit"; // Sayısal gösterim ("01")
    }

    // Kullanıcı için tarihi formatla
    const formatter = new Intl.DateTimeFormat(navigator.language, {
      year: "numeric",
      month: monthFormat,
      day: "2-digit",
    });
    return formatter.format(new Date(date));
  };

  const formatTime = (time) => {
    if (!time || time.trim() === "") return ""; // `trim` metodu ile baştaki ve sondaki boşlukları temizle

    try {
      // Saati ve dakikayı parçalara ayır, boşlukları temizle
      const [hours, minutes] = time
        .trim()
        .split(":")
        .map((part) => part.trim());

      // Saat ve dakika değerlerinin geçerliliğini kontrol et
      const hoursInt = parseInt(hours, 10);
      const minutesInt = parseInt(minutes, 10);
      if (isNaN(hoursInt) || isNaN(minutesInt) || hoursInt < 0 || hoursInt > 23 || minutesInt < 0 || minutesInt > 59) {
        throw new Error("Invalid time format");
      }

      // Geçerli tarih ile birlikte bir Date nesnesi oluştur ve sadece saat ve dakika bilgilerini ayarla
      const date = new Date();
      date.setHours(hoursInt, minutesInt, 0);

      // Kullanıcının lokal ayarlarına uygun olarak saat ve dakikayı formatla
      // `hour12` seçeneğini belirtmeyerek Intl.DateTimeFormat'ın kullanıcının yerel ayarlarına göre otomatik seçim yapmasına izin ver
      const formatter = new Intl.DateTimeFormat(navigator.language, {
        hour: "numeric",
        minute: "2-digit",
        // hour12 seçeneği burada belirtilmiyor; böylece otomatik olarak kullanıcının sistem ayarlarına göre belirleniyor
      });

      // Formatlanmış saati döndür
      return formatter.format(date);
    } catch (error) {
      console.error("Error formatting time:", error);
      return ""; // Hata durumunda boş bir string döndür
    }
  };

  // tarihleri kullanıcının local ayarlarına bakarak formatlayıp ekrana o şekilde yazdırmak için sonu

  // tarih formatlamasını kullanıcının yerel tarih formatına göre ayarlayın

  useEffect(() => {
  // Format the date based on the user's locale
  const dateFormatter = new Intl.DateTimeFormat(navigator.language);
  const sampleDate = new Date(2021, 10, 21);
  const formattedSampleDate = dateFormatter.format(sampleDate);
  setLocaleDateFormat(
    formattedSampleDate.replace("2021", "YYYY").replace("21", "DD").replace("11", "MM")
  );

  // Format the time based on the user's locale
  const timeFormatter = new Intl.DateTimeFormat(navigator.language, {
    hour: "numeric",
    minute: "numeric",
  });
  const sampleTime = new Date(2021, 10, 21, 13, 45);
  const formattedSampleTime = timeFormatter.format(sampleTime);
  const is12HourFormat = /AM|PM/.test(formattedSampleTime);
  setLocaleTimeFormat(is12HourFormat ? "hh:mm A" : "HH:mm");

  // ✅ Form alanlarına başlangıç değerini set et
  setValue("talepTarihi", dayjs());
  setValue("saat", dayjs());
}, []);

  // tarih formatlamasını kullanıcının yerel tarih formatına göre ayarlayın sonu

  // Add validation function for fisNo
  const validateFisNo = async (value) => {
    if (!value) return;
    try {
      const response = await AxiosInstance.post("TableCodeItem/IsCodeItemExist", {
        tableName: "Fis",
        code: value,
      });

      if (response.data.status === true) {
        message.error("Fiş numarası benzersiz değildir!");
        setValue("fisNo", "");
      }
    } catch (error) {
      console.error("Error checking fisNo uniqueness:", error);
      message.error("Fiş numarası kontrolü sırasında hata oluştu!");
    }
  };

  const handleYeniLokasyonPlusClick = () => {
    setIsLokasyonModalOpen(true);
  };
  const handleYeniLokasyonMinusClick = () => {
    setValue("lokasyon", null);
    setValue("lokasyonID", null);
  };

  const handleYeniMasrafMerkeziPlusClick = () => {
    setIsMasrafMerkeziModalOpen(true);
  };
  const handleYeniMasrafMerkeziMinusClick = () => {
    setValue("masrafMerkeziTanim", null);
    setValue("masrafMerkeziID", null);
  };

  return (
    <div style={{ display: "flex", marginBottom: "20px", flexDirection: "row", gap: "10px", width: "100%" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px", width: "100%", maxWidth: "350px" }}>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            maxWidth: "400px",
            gap: "10px",
            flexDirection: "row",
          }}
        >
          <Text style={{ display: "flex", fontSize: "14px", flexDirection: "row" }}>{t("atolye")}</Text>
          <div
            style={{
              display: "flex",
              flexFlow: "column wrap",
              alignItems: "flex-start",
              width: "100%",
              maxWidth: "240px",
            }}
          >
            <AtolyeTablo
              atolyeFieldName="atolyeName"
              atolyeIdFieldName="atolyeId"
              onSubmit={(selectedData) => {
                setValue("atolyeName", selectedData.ATL_TANIM);
                setValue("atolyeId", selectedData.key);
                // Force trigger to ensure FisIcerigi component detects the change
                setTimeout(() => {
                  setValue("atolyeName", selectedData.ATL_TANIM, { shouldDirty: true });
                  setValue("atolyeId", selectedData.key, { shouldDirty: true });
                }, 100);
              }}
              isModalVisible={isAtolyeModalOpen}
              setIsModalVisible={setIsAtolyeModalOpen}
            />
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            maxWidth: "400px",
            gap: "10px",
            flexDirection: "row",
          }}
        >
          <Text style={{ display: "flex", fontSize: "14px", flexDirection: "row" }}>{t("masrafMerkezi")}</Text>
          <div
            style={{
              display: "flex",
              flexFlow: "column wrap",
              alignItems: "flex-start",
              width: "100%",
              maxWidth: "240px",
            }}
          >
            <MasrafMerkezi
              masrafMerkeziFieldName="masrafMerkeziName"
              masrafMerkeziIdFieldName="masrafMerkeziID"
              onSubmit={(selectedData) => {
                setValue("masrafMerkeziName", selectedData.MAM_TANIM);
                setValue("masrafMerkeziID", selectedData.key);
                // Force trigger to ensure FisIcerigi component detects the change
                setTimeout(() => {
                setValue("masrafMerkeziName", selectedData.MAM_TANIM, { shouldDirty: true });
                setValue("masrafMerkeziID", selectedData.key, { shouldDirty: true });
               }, 100);
              }}
              isModalVisible={isLokasyonModalOpen}
              setIsModalVisible={setIsLokasyonModalOpen}
            />
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            maxWidth: "400px",
            gap: "10px",
            flexDirection: "row",
          }}
        >
          <Text style={{ display: "flex", fontSize: "14px", flexDirection: "row" }}>{t("Depo")}</Text>
          <div
            style={{
              display: "flex",
              flexFlow: "column wrap",
              alignItems: "flex-start",
              width: "100%",
              maxWidth: "240px",
            }}
          >
            <DepoTablo name1="depo" isRequired={false} />
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            maxWidth: "400px",
            gap: "10px",
            flexDirection: "row",
          }}
        >
          <Text style={{ display: "flex", fontSize: "14px", flexDirection: "row" }}>
            {t("Sözleşme")}
          </Text>
          <div
            style={{
              display: "flex",
              flexFlow: "column wrap",
              alignItems: "flex-start",
              width: "100%",
              maxWidth: "240px",
            }}
          >
            <Controller
              name="sozlesme"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  status={errors["sozlesme"] ? "error" : ""}
                  style={{ flex: 1 }}
                />
              )}
            />
            {errors["sozlesmeId"] && <div style={{ color: "red", marginTop: "5px" }}>{errors["sozlesmeId"].message}</div>}
          </div>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px", width: "100%", maxWidth: "300px" }}>
        <div style={{ display: "flex", flexDirection: "row", gap: "10px" }}>
          <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            maxWidth: "400px",
            gap: "10px",
            flexDirection: "row",
          }}
        >
          <Text style={{ display: "flex", fontSize: "14px", flexDirection: "row" }}>
            {t("Referans No")}
          </Text>
          <div
            style={{
              display: "flex",
              flexFlow: "column wrap",
              alignItems: "flex-start",
              width: "100%",
              maxWidth: "200px",
            }}
          >
            <Controller
              name="referansNo"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  status={errors["referans"] ? "error" : ""}
                  style={{ flex: 1 }}
                />
              )}
            />
            {errors["referans"] && <div style={{ color: "red", marginTop: "5px" }}>{errors["referans"].message}</div>}
          </div>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            maxWidth: "400px",
            gap: "10px",
            flexDirection: "row",
          }}
        >
          <Text style={{ display: "flex", fontSize: "14px", flexDirection: "row" }}>{t("Ödeme Şekli")} </Text>
          <div
            style={{
              display: "flex",
              flexFlow: "column wrap",
              alignItems: "flex-start",
              width: "100%",
              maxWidth: "200px",
            }}
          >
            <KodIDSelectbox name1="odemeSekliKodId" kodID={33021} isRequired={false} />
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            maxWidth: "400px",
            gap: "10px",
            flexDirection: "row",
          }}
        >
          <Text style={{ display: "flex", fontSize: "14px", flexDirection: "row" }}>
            {t("Nakliye Kodu")}
          </Text>
          <div
            style={{
              display: "flex",
              flexFlow: "column wrap",
              alignItems: "flex-start",
              width: "100%",
              maxWidth: "200px",
            }}
          >
            <Controller
              name="nakliyeKodu"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  status={errors["nakliyeKodu"] ? "error" : ""}
                  style={{ flex: 1 }}
                />
              )}
            />
            {errors["nakliyeKodu"] && <div style={{ color: "red", marginTop: "5px" }}>{errors["nakliyeKodu"].message}</div>}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            maxWidth: "400px",
            gap: "10px",
            flexDirection: "row",
          }}
        >
          <Text style={{ display: "flex", fontSize: "14px", flexDirection: "row" }}>
            {t("Evrak No")}
          </Text>
          <div
            style={{
              display: "flex",
              flexFlow: "column wrap",
              alignItems: "flex-start",
              width: "100%",
              maxWidth: "200px",
            }}
          >
            <Controller
              name="evrakNo"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  status={errors["evrakNo"] ? "error" : ""}
                  style={{ flex: 1 }}
                />
              )}
            />
            {errors["evrakNo"] && <div style={{ color: "red", marginTop: "5px" }}>{errors["evrakNo"].message}</div>}
          </div>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px", width: "100%", maxWidth: "350px" }}>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            maxWidth: "400px",
            gap: "10px",
            flexDirection: "row",
          }}
        >
          <Text style={{ display: "flex", fontSize: "14px", flexDirection: "row" }}>
            {t("Adres 1")}
          </Text>
          <div
            style={{
              display: "flex",
              flexFlow: "column wrap",
              alignItems: "flex-start",
              width: "100%",
              maxWidth: "240px",
            }}
          >
            <Controller
              name="adres1"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  status={errors["adres1"] ? "error" : ""}
                  style={{ flex: 1 }}
                />
              )}
            />
            {errors["adres1"] && <div style={{ color: "red", marginTop: "5px" }}>{errors["adres1"].message}</div>}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            maxWidth: "400px",
            gap: "10px",
            flexDirection: "row",
          }}
        >
          <Text style={{ display: "flex", fontSize: "14px", flexDirection: "row" }}>
            {t("Adres 2")}
          </Text>
          <div
            style={{
              display: "flex",
              flexFlow: "column wrap",
              alignItems: "flex-start",
              width: "100%",
              maxWidth: "240px",
            }}
          >
            <Controller
              name="adres2"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  status={errors["adres2"] ? "error" : ""}
                  style={{ flex: 1 }}
                />
              )}
            />
            {errors["adres2"] && <div style={{ color: "red", marginTop: "5px" }}>{errors["adres2"].message}</div>}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            maxWidth: "400px",
            gap: "10px",
            flexDirection: "row",
          }}
        >
          <Text style={{ display: "flex", fontSize: "14px", flexDirection: "row" }}>
            {t("Posta Kodu")}
          </Text>
          <div
            style={{
              display: "flex",
              flexFlow: "column wrap",
              alignItems: "flex-start",
              width: "100%",
              maxWidth: "240px",
            }}
          >
            <Controller
              name="postaKodu"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  status={errors["postaKodu"] ? "error" : ""}
                  style={{ flex: 1 }}
                />
              )}
            />
            {errors["postaKodu"] && <div style={{ color: "red", marginTop: "5px" }}>{errors["postaKodu"].message}</div>}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            maxWidth: "400px",
            gap: "10px",
            flexDirection: "row",
          }}
        >
          <Text style={{ display: "flex", fontSize: "14px", flexDirection: "row" }}>
            {t("Şehir")}
          </Text>
          <div
            style={{
              display: "flex",
              flexFlow: "column wrap",
              alignItems: "flex-start",
              width: "100%",
              maxWidth: "240px",
            }}
          >
            <Controller
              name="sehir"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  status={errors["sehir"] ? "error" : ""}
                  style={{ flex: 1 }}
                />
              )}
            />
            {errors["sehir"] && <div style={{ color: "red", marginTop: "5px" }}>{errors["sehir"].message}</div>}
          </div>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px", width: "100%", maxWidth: "200px" }}>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            maxWidth: "400px",
            gap: "10px",
            flexDirection: "row",
          }}
        >
          <Text style={{ display: "flex", fontSize: "14px", flexDirection: "row" }}>
            {t("Ülke")}
          </Text>
          <div
            style={{
              display: "flex",
              flexFlow: "column wrap",
              alignItems: "flex-start",
              width: "100%",
              maxWidth: "150px",
            }}
          >
            <Controller
              name="ulke"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  status={errors["ulke"] ? "error" : ""}
                  style={{ flex: 1 }}
                />
              )}
            />
            {errors["ulke"] && <div style={{ color: "red", marginTop: "5px" }}>{errors["ulke"].message}</div>}
          </div>
        </div>
    </div>
    </div>
  );
}