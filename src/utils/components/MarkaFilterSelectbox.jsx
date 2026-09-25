import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Select } from "antd";
import { t } from "i18next";
import AxiosInstance from "../../api/http";

/**
 * Marka filtresi. Liste API'leri markayı ID dizisi olarak beklediği için
 * seçim `TB_MARKA_ID` üzerinden tutulur. Marka listesi tek seferde çekilir.
 */
export default function MarkaFilterSelectbox({ value, onChange }) {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const fetchMarkalar = async () => {
      setLoading(true);
      try {
        const response = await AxiosInstance.get("GetMakineMarks");
        if (cancelled) return;

        setOptions(
          (response?.Makine_Marka_List || [])
            .filter((item) => item?.TB_MARKA_ID !== undefined && item?.TB_MARKA_ID !== null)
            .map((item) => ({ value: item.TB_MARKA_ID, label: item.MRK_MARKA }))
        );
      } catch (error) {
        console.error("Marka listesi alınamadı:", error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchMarkalar();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <Select
      mode="multiple"
      style={{ width: "100%" }}
      placeholder={t("marka")}
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

MarkaFilterSelectbox.propTypes = {
  value: PropTypes.array,
  onChange: PropTypes.func.isRequired,
};
