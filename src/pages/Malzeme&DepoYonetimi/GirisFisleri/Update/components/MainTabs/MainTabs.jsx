import React, { useEffect, useState } from "react";
import { Drawer, Typography, Button, Input, Select, DatePicker, TimePicker, Row, Col, Checkbox, InputNumber, Radio, message } from "antd";
import { Controller, useFormContext } from "react-hook-form";
import styled from "styled-components";
import dayjs from "dayjs";
import { t } from "i18next";
import AxiosInstance from "../../../../../../api/http";
import FirmaSelectBox from "../../../../../../utils/components/FirmaTablo";
// import PlakaSelectBox from "../../../../../../../_root/components/PlakaSelectbox";
import MakineTablo from "../../../../../../utils/components/Machina/MakineTablo";
import KodIDSelectbox from "../../../../../../utils/components/KodIDSelectbox";
import DepoSelectBox from "../../../../../../utils/components/DepoSelectBox";
import LokasyonTablo from "../../../../../../utils/components/LokasyonTablo";
import DepoTablo from "../../../../../../utils/components/DepoTablo";
import ProjeTablo from "../../../../../../utils/components/ProjeTablo";
import SiparisTablo from "../../../../../../utils/components/SiparisTablo";
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
  const [initialFisNo, setInitialFisNo] = useState("");
  const [isFisNoModified, setIsFisNoModified] = useState(false);
  const [isLokasyonModalOpen, setIsLokasyonModalOpen] = useState(false);

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

  return (
    <div style={{ display: "flex", marginBottom: "20px", flexDirection: "row", gap: "10px", width: "100%" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px", width: "100%", maxWidth: "300px" }}>
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
            {t("fisNo")}
            <div style={{ color: "red" }}>*</div>
          </Text>
          <div
            style={{
              display: "flex",
              flexFlow: "column wrap",
              alignItems: "flex-start",
              width: "100%",
              maxWidth: "220px",
            }}
          >
            <Controller
              name="fisNo"
              control={control}
              rules={{ required: t("alanBosBirakilamaz") }}
              render={({ field }) => (
                <Input
                  {...field}
                  status={errors["fisNo"] ? "error" : ""}
                  style={{ flex: 1 }}
                  onFocus={(e) => {
                    setInitialFisNo(e.target.value);
                    setIsFisNoModified(false);
                  }}
                  onChange={(e) => {
                    field.onChange(e);
                    if (e.target.value !== initialFisNo) {
                      setIsFisNoModified(true);
                    }
                  }}
                  onBlur={(e) => {
                    field.onBlur(e);
                    if (isFisNoModified) {
                      validateFisNo(e.target.value);
                    }
                  }}
                />
              )}
            />
            {errors["fisNo"] && <div style={{ color: "red", marginTop: "5px" }}>{errors["fisNo"].message}</div>}
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
          <Text style={{ display: "flex", fontSize: "14px", flexDirection: "row" }}>{t("firma")}</Text>
          <div
            style={{
              display: "flex",
              flexFlow: "column wrap",
              alignItems: "flex-start",
              width: "100%",
              maxWidth: "220px",
            }}
          >
            <FirmaSelectBox name1="firma" isRequired={false} />
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
          <Text style={{ display: "flex", fontSize: "14px", flexDirection: "row" }}>{t("siparisNo")}</Text>
          <div
            style={{
              display: "flex",
              flexFlow: "column wrap",
              alignItems: "flex-start",
              width: "100%",
              maxWidth: "220px",
            }}
          >
            <SiparisTablo name1="siparisNo" isRequired={false} />
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
              {t("tarih")}
              <div style={{ color: "red" }}>*</div>
            </Text>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                width: "100%",
                maxWidth: "220px",
                justifyContent: "space-between",
              }}
            >
              <Controller
                name="tarih"
                control={control}
                rules={{ required: t("alanBosBirakilamaz") }}
                render={({ field }) => (
                  <DatePicker
                    {...field}
                    status={errors["tarih"] ? "error" : ""}
                    style={{ width: "100%", maxWidth: "130px" }}
                    format={localeDateFormat}
                    onChange={(date) => {
                      field.onChange(date);
                      setValue("tarih", date);
                    }}
                  />
                )}
              />
              <Controller
                name="saat"
                control={control}
                render={({ field }) => (
                  <TimePicker
                    {...field}
                    style={{ width: "100%", maxWidth: "85px" }}
                    format={localeTimeFormat}
                    onChange={(date) => {
                      field.onChange(date);
                      setValue("saat", date);
                    }}
                  />
                )}
              />
              {errors["tarih"] && <div style={{ color: "red", marginTop: "5px" }}>{errors["tarih"].message}</div>}
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
          <Text style={{ display: "flex", fontSize: "14px", flexDirection: "row" }}>{t("makine")}</Text>
          <div
            style={{
              display: "flex",
              flexFlow: "column wrap",
              alignItems: "flex-start",
              width: "100%",
              maxWidth: "220px",
            }}
          >
            <MakineTablo />
            {/* <PlakaSelectBox name1="plaka" isRequired={false} /> */}
          </div>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px", width: "100%", maxWidth: "300px" }}>
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
          <Text style={{ display: "flex", fontSize: "14px", flexDirection: "row" }}>{t("lokasyon")}</Text>
          <div
            style={{
              display: "flex",
              flexFlow: "column wrap",
              alignItems: "flex-start",
              width: "100%",
              maxWidth: "220px",
            }}
          >
            <LokasyonTablo
              lokasyonFieldName="lokasyon"
              lokasyonIdFieldName="lokasyonID"
              onSubmit={(selectedData) => {
                setValue("lokasyon", selectedData.LOK_TANIM);
                setValue("lokasyonID", selectedData.key);
                // Force trigger to ensure FisIcerigi component detects the change
                setTimeout(() => {
                  setValue("lokasyon", selectedData.LOK_TANIM, { shouldDirty: true });
                  setValue("lokasyonID", selectedData.key, { shouldDirty: true });
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
          <Text style={{ display: "flex", fontSize: "14px", flexDirection: "row" }}>{t("islemTipi")}</Text>
          <div
            style={{
              display: "flex",
              flexFlow: "column wrap",
              alignItems: "flex-start",
              width: "100%",
              maxWidth: "220px",
            }}
          >
            <KodIDSelectbox name1="islemTipi" kodID={13006} isRequired={false} />
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
            {t("girisDeposu")}
            <div style={{ color: "red" }}>*</div>
          </Text>
          <div
            style={{
              display: "flex",
              flexFlow: "column wrap",
              alignItems: "flex-start",
              width: "100%",
              maxWidth: "220px",
            }}
          >
            <DepoTablo name1="girisDeposu" isRequired={true} />
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
          <Text style={{ display: "flex", fontSize: "14px", flexDirection: "row" }}>{t("proje")}</Text>
          <div
            style={{
              display: "flex",
              flexFlow: "column wrap",
              alignItems: "flex-start",
              width: "100%",
              maxWidth: "220px",
            }}
          >
            <ProjeTablo name1="proje" isRequired={false} />
          </div>
        </div>
      </div>
    </div>
  );
}
