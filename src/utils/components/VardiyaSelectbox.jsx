import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Select } from "antd";
import { Controller, useFormContext } from "react-hook-form";
import { t } from "i18next";
import AxiosInstance from "../../api/http";

/**
 * Vardiya secimi (react-hook-form). Secilen vardiyanin ID'si `name1` alanina yazilir.
 * Vardiya listesi kucuk oldugu icin acilista bir kez cekilir (GetVardiyaList).
 */
export default function VardiyaSelectbox({ name1, isRequired = false, disabled = false, placeholder = "" }) {
  const {
    control,
    formState: { errors },
  } = useFormContext();
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const fetchVardiyalar = async () => {
      setLoading(true);
      try {
        const response = await AxiosInstance.get("GetVardiyaList", { params: { kelime: "" } });
        if (cancelled) return;

        const list = Array.isArray(response) ? response : Array.isArray(response?.data) ? response.data : [];
        setOptions(
          list.filter((item) => item?.TB_VARDIYA_ID !== undefined && item?.TB_VARDIYA_ID !== null).map((item) => ({ value: item.TB_VARDIYA_ID, label: item.VardiyaTanimi }))
        );
      } catch (error) {
        console.error("Vardiya listesi alınamadı:", error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchVardiyalar();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      <Controller
        name={name1}
        control={control}
        rules={{ required: isRequired ? t("alanBosBirakilamaz") : false }}
        render={({ field }) => (
          <Select
            {...field}
            value={field.value ?? undefined}
            style={{ width: "100%" }}
            status={errors[name1] ? "error" : ""}
            options={options}
            loading={loading}
            disabled={disabled}
            placeholder={placeholder}
            optionFilterProp="label"
            showSearch
            allowClear
            onChange={(value) => field.onChange(value ?? null)}
          />
        )}
      />
      {errors[name1] && <div style={{ color: "red", marginTop: "5px" }}>{errors[name1].message}</div>}
    </>
  );
}

VardiyaSelectbox.propTypes = {
  name1: PropTypes.string.isRequired,
  isRequired: PropTypes.bool,
  disabled: PropTypes.bool,
  placeholder: PropTypes.string,
};
