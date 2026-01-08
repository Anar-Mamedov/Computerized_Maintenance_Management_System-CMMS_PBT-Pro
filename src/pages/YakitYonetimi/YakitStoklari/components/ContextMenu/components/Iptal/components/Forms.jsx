import React, { useEffect, useState } from "react";
import { Button, Modal, Input, Typography, Tabs, DatePicker, TimePicker } from "antd";
import { Controller, useFormContext } from "react-hook-form";
import styled from "styled-components";
import IptalNedeni from "./IptalNedeni";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import KodIDSelectbox from "../../../../../../../../utils/components/KodIDSelectbox";

dayjs.extend(customParseFormat);

const { TextArea } = Input;
const { Text, Link } = Typography;

const StyledInput = styled(Input)`
  @media (min-width: 600px) {
    max-width: 300px;
  }
  @media (max-width: 600px) {
    max-width: 300px;
  }
`;

const StyledDiv = styled.div`
  @media (min-width: 600px) {
    width: 100%;
    max-width: 300px;
  }
  @media (max-width: 600px) {
    width: 100%;
    max-width: 300px;
  }
`;

const StyledDivBottomLine = styled.div`
  @media (min-width: 600px) {
    align-items: center !important;
  }
  @media (max-width: 600px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const StyledDivMedia = styled.div`
  .anar {
    @media (min-width: 600px) {
      max-width: 300px;
      width: 100%;
    }
    @media (max-width: 600px) {
      flex-direction: column;
      align-items: flex-start;
    }
  }
`;

export default function Forms({ isModalOpen, selectedRows, iptalDisabled }) {
  const [localeDateFormat, setLocaleDateFormat] = useState("DD/MM/YYYY"); // Varsayılan format
  const [localeTimeFormat, setLocaleTimeFormat] = useState("HH:mm"); // Default time format
  const { control, watch, setValue } = useFormContext();

  const fisNo = selectedRows?.length === 1 ? selectedRows[0].SSP_SIPARIS_KODU : "";

  // Sil düğmesini gizlemek için koşullu stil
  const buttonStyle = iptalDisabled ? { display: "none" } : {};

  // sistemin o anki tarih ve saatini almak için

  useEffect(() => {
    if (isModalOpen) {
      const currentDate = dayjs(); // Şu anki tarih için dayjs nesnesi
      const currentTime = dayjs(); // Şu anki saat için dayjs nesnesi

      // Tarih ve saat alanlarını güncelle
      setValue("iptalTarihi", currentDate);
      setValue("iptalSaati", currentTime);

      // Tablodan seçilen kayıtların IST_KOD değerlerini birleştir
      const istKodlar = selectedRows.map((row) => row.IST_KOD).join(", ");
      setValue("fisNo", istKodlar); // "fisNo" alanını güncelle
    }
  }, [isModalOpen, setValue, selectedRows]);

  // sistemin o anki tarih ve saatini almak sonu

  // tarih formatlamasını kullanıcının yerel tarih formatına göre ayarlayın

  useEffect(() => {
    // Format the date based on the user's locale
    const dateFormatter = new Intl.DateTimeFormat(navigator.language);
    const sampleDate = new Date(2021, 10, 21);
    const formattedSampleDate = dateFormatter.format(sampleDate);
    setLocaleDateFormat(formattedSampleDate.replace("2021", "YYYY").replace("21", "DD").replace("11", "MM"));

    // Format the time based on the user's locale
    const timeFormatter = new Intl.DateTimeFormat(navigator.language, { hour: "numeric", minute: "numeric" });
    const sampleTime = new Date(2021, 10, 21, 13, 45); // Use a sample time, e.g., 13:45
    const formattedSampleTime = timeFormatter.format(sampleTime);

    // Check if the formatted time contains AM/PM, which implies a 12-hour format
    const is12HourFormat = /AM|PM/.test(formattedSampleTime);
    setLocaleTimeFormat(is12HourFormat ? "hh:mm A" : "HH:mm");
  }, []);

  // tarih formatlamasını kullanıcının yerel tarih formatına göre ayarlayın sonu

  return (
  <div style={buttonStyle}>
    {/* Fiş No */}
    <div style={{ marginBottom: "10px", display: "flex", alignItems: "center", gap: "10px" }}>
      <Controller
        name="fisNo"
        control={control}
        render={({ field }) => (
          <Text {...field} style={{ fontSize: "14px", fontWeight: "600" }}>
            Sipariş No: {fisNo || "-"}
          </Text>
        )}
      />
    </div>

    {/* İptal Nedeni */}
    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
      <Text style={{ minWidth: "100px", fontSize: "14px" }}>İptal Nedeni:</Text>
      <KodIDSelectbox style={{ width: "150px" }} name1="nedenKodId" kodID={13113} isRequired={false} />
    </div>

    {/* Açıklama */}
    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
      <Text style={{ minWidth: "100px", fontSize: "14px" }}>Açıklama:</Text>
      <Controller
        name="aciklama"
        control={control}
        render={({ field }) => (
          <input
            {...field}
            style={{
              width: "300px",
              padding: "4px 8px",
              fontSize: "14px",
              border: "1px solid #d9d9d9",
              borderRadius: "4px",
            }}
            placeholder="Açıklama giriniz"
          />
        )}
      />
    </div>
  </div>
);
}
