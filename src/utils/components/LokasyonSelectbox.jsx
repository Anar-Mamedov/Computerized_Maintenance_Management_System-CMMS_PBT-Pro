import React, { useCallback, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Select, Spin, message } from "antd";
import { useTranslation } from "react-i18next";
import AxiosInstance from "../../api/http";

export default function LokasyonSelectbox({
  fieldName = "LokasyonIds",
  disabled = false,
  isRequired = false,
  placeholder,
  selectStyle = {},
  mode = "multiple",
}) {
  const { t } = useTranslation();
  const {
    control,
    formState: { errors },
  } = useFormContext();
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await AxiosInstance.get("GetLokasyonList");
      const list = Array.isArray(response?.data) ? response.data : response;
      setOptions(Array.isArray(list) ? list : []);
    } catch (error) {
      console.error("Error fetching location list:", error);
      message.error(t("hataOlustu", { defaultValue: "Error" }));
    } finally {
      setLoading(false);
    }
  }, [t]);

  const placeholderText = placeholder || t("lokasyonlar", { defaultValue: "Lokasyon" });

  return (
    <Controller
      name={fieldName}
      control={control}
      rules={{ required: isRequired ? t("alanBosBirakilamaz", { defaultValue: "Required" }) : false }}
      render={({ field }) => (
        <Select
          {...field}
          mode={mode}
          allowClear
          showSearch
          disabled={disabled}
          status={errors?.[fieldName] ? "error" : ""}
          placeholder={placeholderText}
          style={{ minWidth: 180, ...selectStyle }}
          optionFilterProp="label"
          filterOption={(input, option) => (option?.label ? option.label.toLowerCase().includes(input.toLowerCase()) : false)}
          onDropdownVisibleChange={(open) => {
            if (open) {
              fetchData();
            }
          }}
          dropdownRender={(menu) => <Spin spinning={loading}>{menu}</Spin>}
          options={options
            .filter((item) => item?.TB_LOKASYON_ID !== undefined && item?.TB_LOKASYON_ID !== null)
            .map((item) => {
              const name = item?.LOK_TANIM?.trim();
              const code = item?.LOK_KOD?.trim();
              const label = [code, name].filter(Boolean).join(" - ") || name || code || "";
              return {
                value: item.TB_LOKASYON_ID,
                label,
              };
            })}
          value={field.value ?? []}
          onChange={(value) => {
            field.onChange(value ?? []);
          }}
        />
      )}
    />
  );
}
