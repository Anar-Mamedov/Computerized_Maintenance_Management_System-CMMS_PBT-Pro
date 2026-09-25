import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Select } from "antd";
import { t } from "i18next";
import AxiosInstance from "../../api/http";

/**
 * Model filtresi. Liste API'leri modeli ID dizisi olarak beklediği için
 * seçim `TB_MODEL_ID` üzerinden tutulur. `markaId=0` tüm markaların modellerini döndürür.
 */
export default function ModelFilterSelectbox({ value, onChange }) {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const fetchModeller = async () => {
      setLoading(true);
      try {
        const response = await AxiosInstance.get("GetMakineModelByMarkaId?markaId=0");
        if (cancelled) return;

        setOptions(
          (response?.Makine_Model_List || [])
            .filter((item) => item?.TB_MODEL_ID !== undefined && item?.TB_MODEL_ID !== null)
            .map((item) => ({ value: item.TB_MODEL_ID, label: item.MDL_MODEL }))
        );
      } catch (error) {
        console.error("Model listesi alınamadı:", error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchModeller();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <Select
      mode="multiple"
      style={{ width: "100%" }}
      placeholder={t("model")}
      value={value || []}
      onChange={onChange}
      options={options}
      loading={loading}
      optionFilterProp="label"
      allowClear
      showSearch
      maxTagCount="responsive"
    />
  );
}

ModelFilterSelectbox.propTypes = {
  value: PropTypes.array,
  onChange: PropTypes.func.isRequired,
};
