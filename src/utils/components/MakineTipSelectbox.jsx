import React, { useCallback, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Select, Spin, message } from "antd";
import { useTranslation } from "react-i18next";
import AxiosInstance from "../../api/http";

const MAKINE_TIP_KOD_GRUP = 32501;

export default function MakineTipSelectbox({
  fieldName = "MakineTipIds",
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
      const response = await AxiosInstance.get(`KodList?grup=${MAKINE_TIP_KOD_GRUP}`);
      setOptions(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error("Error fetching machine type list:", error);
      message.error(t("hataOlustu", { defaultValue: "Error" }));
    } finally {
      setLoading(false);
    }
  }, [t]);

  const placeholderText = placeholder || t("makineTipi", { defaultValue: "Makine Tipi" });

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
            .filter((item) => item?.TB_KOD_ID !== undefined && item?.TB_KOD_ID !== null)
            .map((item) => ({
              value: item.TB_KOD_ID,
              label: item.KOD_TANIM,
            }))}
          value={field.value ?? []}
          onChange={(value) => {
            field.onChange(value ?? []);
          }}
        />
      )}
    />
  );
}
