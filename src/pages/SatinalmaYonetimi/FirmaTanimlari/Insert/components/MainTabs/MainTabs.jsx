import React from "react";
import {
  Drawer,
  Typography,
  Button,
  Input,
  Select,
  DatePicker,
  TimePicker,
  Row,
  Col,
  Checkbox,
  ColorPicker,
} from "antd";
import { Controller, useFormContext } from "react-hook-form";
import PersonelTipi from "./components/PersonelTipi";
import KodIDSelectbox from "../../../../../../utils/components/KodIDSelectbox";
import styled from "styled-components";
import LokasyonTablo from "./components/LokasyonTablo";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import Departman from "./components/Departman";
import Gorevi from "./components/Gorevi";
import TaseronTablo from "./components/TaseronTablo";
import AtolyeTablo from "./components/AtolyeTablo";
import IdariAmiriTablo from "./components/IdariAmiriTablo";
import MasrafMerkeziTablo from "./components/MasrafMerkeziTablo";

const { Text, Link } = Typography;
const { TextArea } = Input;

dayjs.extend(customParseFormat);

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
    align-items: center;
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

export default function MainTabs() {
  const { control, watch, setValue } = useFormContext();

  const otonomBakimValue = watch("otonomBakim");

  const handleMinusClick = () => {
    setValue("lokasyonMasrafMerkeziTanim", "");
    setValue("lokasyonMasrafMerkeziID", "");
  };

  const handleTaseronMinusClick = () => {
    setValue("taseronTanim", "");
    setValue("taseronID", "");
  };

  const handlePersonelHesabiMinusClick = () => {
    setValue("personelHesabiTanim", "");
    setValue("personelHesabiID", "");
  };

  const handleAtolyeMinusClick = () => {
    setValue("atolyeTanim", "");
    setValue("atolyeID", "");
  };

  const handleIdariAmiriMinusClick = () => {
    setValue("idariAmiriTanim", "");
    setValue("idariAmiriID", "");
  };

  const handleMasrafMerkeziMinusClick = () => {
    setValue("masrafMerkeziTanim", "");
    setValue("masrafMerkeziID", "");
  };

  const handleLokasyonMinusClick = () => {
    setValue("lokasyonTanim", "");
    setValue("lokasyonID", "");
  };

  return (
  <div
    style={{
      display: "flex",
      flexWrap: "wrap",
      marginBottom: "15px",
      gap: "20px",
    }}
  >
    {/* Sol Kolon */}
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        width: "100%",
        maxWidth: "450px",
      }}
    >
      {/* CAR_KOD */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "10px" }}>
        <Text style={{ fontSize: "14px", fontWeight: "600" }}>Firma Kodu:</Text>
        <Controller
          name="carKod"
          control={control}
          rules={{ required: "Alan Boş Bırakılamaz!" }}
          render={({ field, fieldState: { error } }) => (
            <div style={{ display: "flex", flexDirection: "column", gap: "5px", maxWidth: "300px", width: "100%" }}>
              <Input {...field} status={error ? "error" : ""} />
              {error && <div style={{ color: "red" }}>{error.message}</div>}
            </div>
          )}
        />
      </div>

      {/* CAR_TANIM */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "10px" }}>
        <Text style={{ fontSize: "14px", fontWeight: "600" }}>Firma Tanımı:</Text>
        <Controller
          name="carTanim"
          control={control}
          rules={{ required: "Alan Boş Bırakılamaz!" }}
          render={({ field, fieldState: { error } }) => (
            <div style={{ display: "flex", flexDirection: "column", gap: "5px", maxWidth: "300px", width: "100%" }}>
              <Input {...field} status={error ? "error" : ""} />
              {error && <div style={{ color: "red" }}>{error.message}</div>}
            </div>
          )}
        />
      </div>

      {/* CAR_ADRES */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "10px" }}>
        <Text style={{ fontSize: "14px", fontWeight: "600" }}>Adres:</Text>
        <Controller
          name="carAdres"
          control={control}
          render={({ field }) => <Input {...field} style={{ maxWidth: "300px", width: "100%" }} />}
        />
      </div>

      {/* CAR_SEHIR */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "10px" }}>
        <Text style={{ fontSize: "14px", fontWeight: "600" }}>Şehir:</Text>
        <Controller
          name="carSehir"
          control={control}
          render={({ field }) => <Input {...field} style={{ maxWidth: "300px", width: "100%" }} />}
        />
      </div>

      {/* CAR_ILCE */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "10px" }}>
        <Text style={{ fontSize: "14px", fontWeight: "600" }}>İlçe:</Text>
        <Controller
          name="carIlce"
          control={control}
          render={({ field }) => <Input {...field} style={{ maxWidth: "300px", width: "100%" }} />}
        />
      </div>

      {/* CAR_TEL1 */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "10px" }}>
        <Text style={{ fontSize: "14px", fontWeight: "600" }}>Telefon:</Text>
        <Controller
          name="carTel1"
          control={control}
          render={({ field }) => <Input {...field} style={{ maxWidth: "300px", width: "100%" }} />}
        />
      </div>

      {/* CAR_EMAIL */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "10px" }}>
        <Text style={{ fontSize: "14px", fontWeight: "600" }}>Email:</Text>
        <Controller
          name="carEmail"
          control={control}
          render={({ field }) => <Input {...field} style={{ maxWidth: "300px", width: "100%" }} />}
        />
      </div>
    </div>

    {/* Sağ Kolon - Boolean alanlar */}
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        width: "100%",
        maxWidth: "450px",
      }}
    >
      {[
        { label: "Tedarikçi", name: "carTedarikci" },
        { label: "Müşteri", name: "carMusteri" },
        { label: "Nakliyeci", name: "carNakliyeci" },
        { label: "Servis", name: "carServis" },
        { label: "Şube", name: "carSube" },
        { label: "Diğer", name: "carDiger" },
      ].map((item) => (
        <Controller
          key={item.name}
          name={item.name}
          control={control}
          render={({ field }) => (
            <Checkbox
              checked={field.value}
              onChange={(e) => field.onChange(e.target.checked)}
            >
              {item.label}
            </Checkbox>
          )}
        />
      ))}
    </div>
  </div>
);
}
