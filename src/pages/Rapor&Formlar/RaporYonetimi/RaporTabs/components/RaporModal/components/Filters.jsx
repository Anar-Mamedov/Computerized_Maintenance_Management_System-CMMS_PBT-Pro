import React, { useState, useEffect } from "react";
import { DatePicker, Button } from "antd";
import { useForm, FormProvider, Controller } from "react-hook-form";
import Lokasyon from "./Lokasyon";
import AtolyeSelect from "./AtolyeSelect";
import dayjs from "dayjs";
import "dayjs/locale/tr";
import locale from "antd/es/date-picker/locale/tr_TR";

dayjs.locale("tr");

function Filters({ filtersLabel, onSubmit }) {
  const [lokasyonID1, setLokasyonID1] = useState("");
  const [filterValues, setFilterValues] = useState({
    LokasyonID: "",
    AtolyeID: "",
    BaslamaTarih: null,
    BitisTarih: null,
  });

  const methods = useForm({
    defaultValues: {
      Lokasyon: "",
      LokasyonID: "",
      Atolye: "",
      AtolyeID: "",
      BaslamaTarih: null,
      BitisTarih: null,
      // ... Tüm default değerleriniz
    },
  });

  const { setValue, reset, watch, control } = methods;

  useEffect(() => {
    setValue("lokasyon", filtersLabel.LokasyonName);
    setValue("lokasyonID", filtersLabel.LokasyonID);
    setValue("atolye", filtersLabel.AtolyeName);
    setValue("atolyeID", filtersLabel.AtolyeID);
    setValue("startDate", filtersLabel.BaslamaTarih ? dayjs(filtersLabel.BaslamaTarih) : null);
    setValue("endDate", filtersLabel.BitisTarih ? dayjs(filtersLabel.BitisTarih) : null);
  }, [filtersLabel]);

  const lokasyonID = watch("lokasyonID");
  const atolyeID = watch("atolyeID");
  const startDate = watch("startDate");
  const endDate = watch("endDate");

  useEffect(() => {
    if (lokasyonID) {
      setFilterValues((prev) => ({
        ...prev,
        LokasyonID: Array.isArray(lokasyonID) ? lokasyonID.join(",") : lokasyonID,
      }));
    }
    if (atolyeID) {
      setFilterValues((prev) => ({
        ...prev,
        AtolyeID: Array.isArray(atolyeID) ? atolyeID.join(",") : atolyeID,
      }));
    }
    if (startDate) {
      setFilterValues((prev) => ({
        ...prev,
        BaslamaTarih: startDate ? dayjs(startDate).format("YYYY-MM-DD") : null,
      }));
    }
    if (endDate) {
      setFilterValues((prev) => ({
        ...prev,
        BitisTarih: endDate ? dayjs(endDate).format("YYYY-MM-DD") : null,
      }));
    }
  }, [lokasyonID, atolyeID, startDate, endDate]);

  const handleSubmit = () => {
    onSubmit?.(filterValues);
  };

  return (
    <FormProvider {...methods}>
      <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
        <Lokasyon filtersLabel={filtersLabel} />
        <AtolyeSelect filtersLabel={filtersLabel} />
        <Controller
          name="startDate"
          control={control}
          render={({ field }) => (
            <DatePicker
              {...field}
              value={field.value ? dayjs(field.value) : null}
              filtersLabel={filtersLabel}
              placeholder="Başlangıç Tarihi"
              onChange={(date) => {
                field.onChange(date ? dayjs(date) : null);
              }}
              format="DD.MM.YYYY"
              locale={locale}
            />
          )}
        />
        <Controller
          name="endDate"
          control={control}
          render={({ field }) => (
            <DatePicker
              {...field}
              value={field.value ? dayjs(field.value) : null}
              filtersLabel={filtersLabel}
              placeholder="Bitiş Tarihi"
              onChange={(date) => {
                field.onChange(date ? dayjs(date) : null);
              }}
              format="DD.MM.YYYY"
              locale={locale}
            />
          )}
        />
        <Button type="primary" onClick={handleSubmit}>
          Sorgula
        </Button>
      </div>
    </FormProvider>
  );
}

export default Filters;
