import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Select } from "antd";
import { t } from "i18next";
import AxiosInstance from "../../api/http";

/**
 * Atölye filtresi. Liste API'leri atölyeyi ID dizisi olarak beklediği için
 * seçim `TB_ATOLYE_ID` üzerinden tutulur. Atölye listesi küçük olduğundan tek seferde çekilir.
 */
export default function AtolyeFilterSelectbox({ value, onChange }) {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const fetchAtolyeler = async () => {
      setLoading(true);
      try {
        const response = await AxiosInstance.get("AtolyeList");
        if (cancelled) return;

        setOptions(
          (response || [])
            .filter((item) => item?.TB_ATOLYE_ID !== undefined && item?.TB_ATOLYE_ID !== null)
            .map((item) => ({ value: item.TB_ATOLYE_ID, label: item.ATL_TANIM }))
        );
      } catch (error) {
        console.error("Atölye listesi alınamadı:", error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchAtolyeler();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <Select
      mode="multiple"
      style={{ width: "100%" }}
      placeholder={t("atolye")}
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

AtolyeFilterSelectbox.propTypes = {
  value: PropTypes.array,
  onChange: PropTypes.func.isRequired,
};
