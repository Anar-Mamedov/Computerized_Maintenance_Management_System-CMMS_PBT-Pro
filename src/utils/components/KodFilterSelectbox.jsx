import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Select } from "antd";
import AxiosInstance from "../../api/http";

/**
 * Kod listesi tabanlı filtre seçici (arıza nedeni, duruş nedeni vb.).
 * Liste API'leri bu alanları ID dizisi olarak beklediği için seçim `TB_KOD_ID` üzerinden tutulur.
 */
export default function KodFilterSelectbox({ kodGrubu, placeholder, value, onChange }) {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const fetchKodlar = async () => {
      setLoading(true);
      try {
        const response = await AxiosInstance.get(`KodList?grup=${kodGrubu}`);
        if (cancelled) return;

        setOptions(
          (response || [])
            .filter((item) => item?.TB_KOD_ID !== undefined && item?.TB_KOD_ID !== null)
            .map((item) => ({ value: item.TB_KOD_ID, label: item.KOD_TANIM }))
        );
      } catch (error) {
        console.error(`Kod listesi alınamadı (grup ${kodGrubu}):`, error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchKodlar();

    return () => {
      cancelled = true;
    };
  }, [kodGrubu]);

  return (
    <Select
      mode="multiple"
      style={{ width: "100%" }}
      placeholder={placeholder}
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

KodFilterSelectbox.propTypes = {
  kodGrubu: PropTypes.number.isRequired,
  placeholder: PropTypes.string,
  value: PropTypes.array,
  onChange: PropTypes.func.isRequired,
};
