import React, { useState, useEffect, useCallback, memo } from "react";
import { DatePicker, Button } from "antd";
import { useForm, FormProvider, Controller } from "react-hook-form";
import Lokasyon from "./Lokasyon";
import AtolyeSelect from "./AtolyeSelect";
import dayjs from "dayjs";
import "dayjs/locale/tr";
import locale from "antd/es/date-picker/locale/tr_TR";

dayjs.locale("tr");

// Wrap the main function in React.memo to prevent unnecessary re-renders
const Filters = memo(function Filters({ filtersLabel, onSubmit }) {
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
    // Don't update values if filtersLabel is empty
    if (!filtersLabel || Object.keys(filtersLabel).length === 0) return;

    console.log("Filters.jsx - Setting form values from filtersLabel:", filtersLabel);

    setValue("lokasyon", filtersLabel.LokasyonName);
    setValue("lokasyonID", filtersLabel.LokasyonID);
    setValue("atolye", filtersLabel.AtolyeName);
    setValue("atolyeID", filtersLabel.AtolyeID);
    setValue("startDate", filtersLabel.BaslamaTarih ? dayjs(filtersLabel.BaslamaTarih) : null);
    setValue("endDate", filtersLabel.BitisTarih ? dayjs(filtersLabel.BitisTarih) : null);
  }, [filtersLabel, setValue]);

  const lokasyonID = watch("lokasyonID");
  const atolyeID = watch("atolyeID");
  const startDate = watch("startDate");
  const endDate = watch("endDate");

  // Memoize the filter values update to prevent unnecessary rerenders
  useEffect(() => {
    const newFilterValues = { ...filterValues };
    let hasChanges = false;

    if (lokasyonID) {
      const newLokasyonID = Array.isArray(lokasyonID) ? lokasyonID.join(",") : lokasyonID;
      if (newFilterValues.LokasyonID !== newLokasyonID) {
        newFilterValues.LokasyonID = newLokasyonID;
        hasChanges = true;
      }
    }

    if (atolyeID) {
      const newAtolyeID = Array.isArray(atolyeID) ? atolyeID.join(",") : atolyeID;
      if (newFilterValues.AtolyeID !== newAtolyeID) {
        newFilterValues.AtolyeID = newAtolyeID;
        hasChanges = true;
      }
    }

    if (startDate) {
      const newStartDate = startDate ? dayjs(startDate).format("YYYY-MM-DD") : null;
      if (newFilterValues.BaslamaTarih !== newStartDate) {
        newFilterValues.BaslamaTarih = newStartDate;
        hasChanges = true;
      }
    }

    if (endDate) {
      const newEndDate = endDate ? dayjs(endDate).format("YYYY-MM-DD") : null;
      if (newFilterValues.BitisTarih !== newEndDate) {
        newFilterValues.BitisTarih = newEndDate;
        hasChanges = true;
      }
    }

    if (hasChanges) {
      setFilterValues(newFilterValues);
    }
  }, [lokasyonID, atolyeID, startDate, endDate]);

  // Memoize the handleSubmit function
  const handleSubmit = useCallback(() => {
    const formValues = {
      ...filterValues,
      // Form'dan seçilen metin değerlerini de ekliyoruz
      LokasyonName: methods.getValues("lokasyon"),
      AtolyeName: methods.getValues("atolye"),
    };

    console.log("Filters.jsx - Submitting form values:", formValues);
    console.log("Filters.jsx - Current filterValues state:", filterValues);
    console.log("Filters.jsx - Form values:", {
      lokasyon: methods.getValues("lokasyon"),
      lokasyonID: methods.getValues("lokasyonID"),
      atolye: methods.getValues("atolye"),
      atolyeID: methods.getValues("atolyeID"),
      startDate: methods.getValues("startDate"),
      endDate: methods.getValues("endDate"),
    });

    onSubmit?.(formValues);
  }, [filterValues, methods, onSubmit]);

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
                field.onChange(date);
                setFilterValues((prev) => ({
                  ...prev,
                  BaslamaTarih: date ? dayjs(date).format("YYYY-MM-DD") : null,
                }));
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
                field.onChange(date);
                setFilterValues((prev) => ({
                  ...prev,
                  BitisTarih: date ? dayjs(date).format("YYYY-MM-DD") : null,
                }));
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
});

export default Filters;
