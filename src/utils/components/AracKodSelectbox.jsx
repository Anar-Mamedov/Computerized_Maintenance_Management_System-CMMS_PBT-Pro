import React, { useState } from "react";
import PropTypes from "prop-types";
import { Select, Spin } from "antd";
import { Controller, useFormContext } from "react-hook-form";
import { t } from "i18next";
import AxiosInstance from "../../api/http";

// Yanittaki kayitlar farkli alan adlariyla gelebiliyor (kod listesi ya da tablo kaydi).
const kayitId = (item) => item?.TB_KOD_ID ?? item?.ID ?? item?.Id ?? item?.id ?? item?.value;
const kayitEtiketi = (item) => item?.KOD_TANIM ?? item?.TANIM ?? item?.Tanim ?? item?.tanim ?? item?.label ?? item?.text;

/**
 * Arac kod listeleri (GetAracKodListesi?tip=...): SEHIR, ILCE (parentId = il ID), CEZA_MADDE vb.
 * KodIDSelectbox ile ayni desen: gorunen alan `name1`, secilen ID `${name1}ID` alanina yazilir.
 * Liste acilir kutu acildiginda cekilir; `parentId` gereken tiplerde ust secim yoksa kutu pasiftir.
 */
export default function AracKodSelectbox({ name1, tip, parentId, parentRequired = false, isRequired = false, disabled = false, placeholder = "", onChange }) {
  const {
    control,
    setValue,
    formState: { errors },
  } = useFormContext();
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const ustSecimYok = parentRequired && !parentId;

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await AxiosInstance.get("GetAracKodListesi", { params: { tip, ...(parentId ? { parentId } : {}) } });
      const list = Array.isArray(response) ? response : Array.isArray(response?.data) ? response.data : [];
      setOptions(list.filter((item) => kayitId(item) !== undefined && kayitId(item) !== null).map((item) => ({ value: kayitId(item), label: kayitEtiketi(item) })));
    } catch (error) {
      console.error("Araç kod listesi alınamadı:", error);
    } finally {
      setLoading(false);
    }
  };

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
            disabled={disabled || ustSecimYok}
            placeholder={placeholder}
            optionFilterProp="label"
            showSearch
            allowClear
            loading={loading}
            notFoundContent={loading ? <Spin size="small" /> : undefined}
            onDropdownVisibleChange={(open) => {
              if (open) fetchData();
            }}
            onChange={(value, option) => {
              setValue(`${name1}ID`, value ?? null);
              field.onChange(value ?? null);
              onChange?.(value ?? null, option);
            }}
          />
        )}
      />
      {errors[name1] && <div style={{ color: "red", marginTop: "5px" }}>{errors[name1].message}</div>}
      <Controller name={`${name1}ID`} control={control} render={() => null} />
    </>
  );
}

AracKodSelectbox.propTypes = {
  name1: PropTypes.string.isRequired,
  tip: PropTypes.string.isRequired,
  parentId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  parentRequired: PropTypes.bool,
  isRequired: PropTypes.bool,
  disabled: PropTypes.bool,
  placeholder: PropTypes.string,
  onChange: PropTypes.func,
};
