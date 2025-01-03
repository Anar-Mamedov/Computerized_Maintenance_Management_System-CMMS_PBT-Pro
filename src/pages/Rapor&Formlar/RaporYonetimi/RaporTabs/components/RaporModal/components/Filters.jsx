import React, { useState } from "react";
import { DatePicker, Button } from "antd";
import { Controller, useFormContext } from "react-hook-form";
import Lokasyon from "./Lokasyon";
import AtolyeSelect from "./AtolyeSelect";
import dayjs from "dayjs";
import "dayjs/locale/tr";
import locale from "antd/es/date-picker/locale/tr_TR";

dayjs.locale("tr");

function Filters({ onSubmit }) {
  const [filterValues, setFilterValues] = useState({
    LokasyonID: "",
    AtolyeID: "",
    BaslamaTarih: null,
    BitisTarih: null,
  });

  const handleLocationChange = (locationString) => {
    setFilterValues((prev) => ({
      ...prev,
      LokasyonID: locationString,
    }));
  };

  const handleAtolyeChange = (atolyeString) => {
    setFilterValues((prev) => ({
      ...prev,
      AtolyeID: atolyeString,
    }));
  };

  const handleStartDateChange = (date) => {
    setFilterValues((prev) => ({
      ...prev,
      BaslamaTarih: date ? dayjs(date).format("YYYY-MM-DD") : null,
    }));
  };

  const handleEndDateChange = (date) => {
    setFilterValues((prev) => ({
      ...prev,
      BitisTarih: date ? dayjs(date).format("YYYY-MM-DD") : null,
    }));
  };

  const handleSubmit = () => {
    onSubmit?.(filterValues);
  };

  return (
    <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
      <Lokasyon onLocationChange={handleLocationChange} />
      <AtolyeSelect onAtolyeChange={handleAtolyeChange} />
      <DatePicker placeholder="Başlangıç Tarihi" onChange={handleStartDateChange} format="DD.MM.YYYY" locale={locale} />
      <DatePicker placeholder="Bitiş Tarihi" onChange={handleEndDateChange} format="DD.MM.YYYY" locale={locale} />
      <Button type="primary" onClick={handleSubmit}>
        Sorgula
      </Button>
    </div>
  );
}

export default Filters;
