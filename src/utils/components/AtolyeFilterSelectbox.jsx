import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Select } from "antd";
import { t } from "i18next";
import AxiosInstance from "../../api/http";

/**
 * Atölye filtresi. Liste API'leri atölyeyi ID dizisi olarak beklediği için
 * seçim `TB_ATOLYE_ID` üzerinden tutulur. Atölye listesi küçük olduğundan tek seferde çekilir.
 * `tekli` verilirse tek atölye seçilir; değer dizi yerine tek `TB_ATOLYE_ID` (ya da undefined) olur.
 */
export default function AtolyeFilterSelectbox({ value, onChange, tekli = false }) {
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
      mode={tekli ? undefined : "multiple"}
      style={{ width: "100%" }}
      placeholder={t("atolye")}
      value={tekli ? value : value || []}
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
  value: PropTypes.oneOfType([PropTypes.array, PropTypes.number]),
  onChange: PropTypes.func.isRequired,
  tekli: PropTypes.bool,
};
