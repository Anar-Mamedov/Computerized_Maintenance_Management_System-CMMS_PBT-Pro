import React, { useEffect, useState } from "react";
import { Drawer, Typography, Button, Input, Select, DatePicker, TimePicker, Row, Col, Checkbox, InputNumber, Radio, ColorPicker, Switch } from "antd";
import { Controller, useFormContext } from "react-hook-form";
import styled from "styled-components";
import FreeTextInput from "../../../../../../utils/components/FreeTextInput";
import KodIDSelectbox from "../../../../../../utils/components/KodIDSelectbox";
import LokasyonTablo from "../../../../../../utils/components/LokasyonTablo";
import AtolyeTablo from "../../../../../../utils/components/AtolyeTablo";
import SinifiTablo from "../../../../../../utils/components/SinifiTablo";
import dayjs from "dayjs";

import { t } from "i18next";

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
    getValues,
    formState: { errors },
  } = useFormContext();
  const [localeDateFormat, setLocaleDateFormat] = useState("DD/MM/YYYY"); // Varsayılan format
  const [localeTimeFormat, setLocaleTimeFormat] = useState("HH:mm"); // Default time format
  const [isimValue, setIsimValue] = useState("");
  const [soyisimValue, setSoyisimValue] = useState("");

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
    setLocaleDateFormat(formattedSampleDate.replace("2021", "YYYY").replace("21", "DD").replace("11", "MM"));

    // Format the time based on the user's locale
    const timeFormatter = new Intl.DateTimeFormat(navigator.language, {
      hour: "numeric",
      minute: "numeric",
    });
    const sampleTime = new Date(2021, 10, 21, 13, 45); // Use a sample time, e.g., 13:45
    const formattedSampleTime = timeFormatter.format(sampleTime);

    // Check if the formatted time contains AM/PM, which implies a 12-hour format
    const is12HourFormat = /AM|PM/.test(formattedSampleTime);
    setLocaleTimeFormat(is12HourFormat ? "hh:mm A" : "HH:mm");
  }, []);

  // tarih formatlamasını kullanıcının yerel tarih formatına göre ayarlayın sonu

  const updateParaf = (isim, soyisim) => {
    const paraf = `${isim?.[0] || ""}${soyisim?.[0] || ""}`;
    setValue("paraf", paraf);
  };

  // console.log(watch("color")?.toHexString?.());

  return (
    <div style={{ display: "flex", marginBottom: "15px", flexDirection: "row", gap: "20px", width: "100%" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px", width: "100%", maxWidth: "400px" }}>
        <div
          style={{
            display: "flex",
            flexFlow: "column wrap",
            alignItems: "center",
            width: "100%",
            maxWidth: "400px",
            justifyContent: "space-between",
            gap: "8px",
            flexDirection: "row",
          }}
        >
          <Text style={{ fontSize: "14px", color: "#000000a4", display: "flex" }}>
            {t("kod")}
            <div style={{ color: "red" }}>*</div>
          </Text>
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              width: "100%",
              maxWidth: "300px",
              flexDirection: "column",
            }}
          >
            <FreeTextInput name1="malzemeKod" isRequired={true} />
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexFlow: "column wrap",
            alignItems: "center",
            width: "100%",
            maxWidth: "400px",
            justifyContent: "space-between",
            gap: "8px",
            flexDirection: "row",
          }}
        >
          <Text style={{ fontSize: "14px", color: "#000000a4", display: "flex" }}>
            {t("tanim")}
            <div style={{ color: "red" }}>*</div>
          </Text>
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              width: "100%",
              maxWidth: "300px",
              flexDirection: "column",
            }}
          >
            <FreeTextInput name1="tanim" isRequired={true} />
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexFlow: "column wrap",
            alignItems: "center",
            width: "100%",
            maxWidth: "400px",
            justifyContent: "space-between",
            gap: "8px",
            flexDirection: "row",
          }}
        >
          <Text style={{ fontSize: "14px", color: "#000000a4", display: "flex" }}>
            {t("tip")}
            <div style={{ color: "red" }}>*</div>
          </Text>
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              width: "100%",
              maxWidth: "300px",
              flexDirection: "column",
            }}
          >
            <KodIDSelectbox name1="tip" isRequired={true} kodID="13005" />
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexFlow: "column wrap",
            alignItems: "center",
            width: "100%",
            maxWidth: "400px",
            justifyContent: "space-between",
            gap: "8px",
            flexDirection: "row",
          }}
        >
          <Text style={{ fontSize: "14px", color: "#000000a4", display: "flex" }}>
            {t("birim")}
            <div style={{ color: "red" }}>*</div>
          </Text>
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              width: "100%",
              maxWidth: "300px",
              flexDirection: "column",
            }}
          >
            <KodIDSelectbox name1="birim" isRequired={true} kodID="32001" />
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexFlow: "column wrap",
            alignItems: "center",
            width: "100%",
            maxWidth: "400px",
            justifyContent: "space-between",
            gap: "8px",
            flexDirection: "row",
          }}
        >
          <Text style={{ fontSize: "14px", color: "#000000a4", display: "flex" }}>{t("grup")}</Text>
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              width: "100%",
              maxWidth: "300px",
              flexDirection: "column",
            }}
          >
            <KodIDSelectbox name1="grup" isRequired={false} kodID="13004" />
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexFlow: "column wrap",
            alignItems: "center",
            width: "100%",
            maxWidth: "400px",
            justifyContent: "space-between",
            gap: "8px",
            flexDirection: "row",
          }}
        >
          <Text style={{ fontSize: "14px", color: "#000000a4", display: "flex" }}>{t("lokasyon")}</Text>
          <div
            className="anar"
            style={{
              display: "flex",
              alignItems: "flex-start",
              width: "100%",
              maxWidth: "300px",
              flexDirection: "column",
            }}
          >
            <LokasyonTablo />
          </div>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "10px", width: "100%", maxWidth: "400px" }}>
        <div
          style={{
            display: "flex",
            flexFlow: "column wrap",
            alignItems: "center",
            width: "100%",
            maxWidth: "400px",
            justifyContent: "space-between",
            gap: "8px",
            flexDirection: "row",
          }}
        >
          <Text style={{ fontSize: "14px", color: "#000000a4", display: "flex" }}>{t("ureticiKodu")}</Text>
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              width: "100%",
              maxWidth: "300px",
              flexDirection: "column",
            }}
          >
            <FreeTextInput name1="ureticiKodu" isRequired={false} />
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexFlow: "column wrap",
            alignItems: "center",
            width: "100%",
            maxWidth: "400px",
            justifyContent: "space-between",
            gap: "8px",
            flexDirection: "row",
          }}
        >
          <Text style={{ fontSize: "14px", color: "#000000a4", display: "flex" }}>{t("sinifi")}</Text>
          <div
            className="anar"
            style={{
              display: "flex",
              alignItems: "flex-start",
              width: "100%",
              maxWidth: "300px",
              flexDirection: "column",
            }}
          >
            <SinifiTablo />
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexFlow: "column wrap",
            alignItems: "center",
            width: "100%",
            maxWidth: "400px",
            justifyContent: "space-between",
            gap: "8px",
            flexDirection: "row",
          }}
        >
          <Text style={{ fontSize: "14px", color: "#000000a4", display: "flex" }}>{t("marka")}</Text>
          <div
            className="anar"
            style={{
              display: "flex",
              alignItems: "flex-start",
              width: "100%",
              maxWidth: "300px",
              flexDirection: "column",
            }}
          >
            <KodIDSelectbox name1="marka" isRequired={false} kodID="13002" />
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexFlow: "column wrap",
            alignItems: "center",
            width: "100%",
            maxWidth: "400px",
            justifyContent: "space-between",
            gap: "8px",
            flexDirection: "row",
          }}
        >
          <Text style={{ fontSize: "14px", color: "#000000a4", display: "flex" }}>{t("model")}</Text>
          <div
            className="anar"
            style={{
              display: "flex",
              alignItems: "flex-start",
              width: "100%",
              maxWidth: "300px",
              flexDirection: "column",
            }}
          >
            <KodIDSelectbox name1="model" isRequired={false} kodID="13003" />
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexFlow: "column wrap",
            alignItems: "center",
            width: "100%",
            maxWidth: "400px",
            justifyContent: "space-between",
            gap: "8px",
            flexDirection: "row",
          }}
        >
          <Text style={{ fontSize: "14px", color: "#000000a4", display: "flex" }}>{t("altolye")}</Text>
          <div
            className="anar"
            style={{
              display: "flex",
              alignItems: "flex-start",
              width: "100%",
              maxWidth: "300px",
              flexDirection: "column",
            }}
          >
            <AtolyeTablo />
          </div>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "10px", width: "100%", maxWidth: "200px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Text style={{ fontSize: "14px", color: "#000000a4" }}>{t("aktif")}</Text>
          <Controller name="aktif" control={control} render={({ field }) => <Switch {...field} />} />
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Text style={{ fontSize: "14px", color: "#000000a4" }}>{t("yedekParca")}</Text>
          <Controller name="yedekParca" control={control} render={({ field }) => <Switch {...field} />} />
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Text style={{ fontSize: "14px", color: "#000000a4" }}>{t("sarfMalzeme")}</Text>
          <Controller name="sarfMalzeme" control={control} render={({ field }) => <Switch {...field} />} />
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Text style={{ fontSize: "14px", color: "#000000a4" }}>{t("stoksuzMalzeme")}</Text>
          <Controller name="stoksuzMalzeme" control={control} render={({ field }) => <Switch {...field} />} />
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Text style={{ fontSize: "14px", color: "#000000a4" }}>{t("kritikMalzeme")}</Text>
          <Controller name="kritikMalzeme" control={control} render={({ field }) => <Switch {...field} />} />
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Text style={{ fontSize: "14px", color: "#000000a4" }}>{t("yag")}</Text>
          <Controller name="yag" control={control} render={({ field }) => <Switch {...field} />} />
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Text style={{ fontSize: "14px", color: "#000000a4" }}>{t("filtre")}</Text>
          <Controller name="filtre" control={control} render={({ field }) => <Switch {...field} />} />
        </div>
      </div>
    </div>
  );
}
