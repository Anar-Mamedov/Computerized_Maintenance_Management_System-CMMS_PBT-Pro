import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Select } from "antd";
import { t } from "i18next";
import AxiosInstance from "../../api/http";

/**
 * Personel filtresi. Liste API'leri personeli ID dizisi olarak beklediği için
 * seçim `TB_PERSONEL_ID` üzerinden tutulur.
 */
export default function PersonelFilterSelectbox({ value, onChange }) {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const fetchPersoneller = async () => {
      setLoading(true);
      try {
        const response = await AxiosInstance.get("Personel");
        if (cancelled) return;

        setOptions(
          (response || [])
            .filter((item) => item?.TB_PERSONEL_ID !== undefined && item?.TB_PERSONEL_ID !== null)
            .map((item) => ({
              value: item.TB_PERSONEL_ID,
              label: [item.PRS_ISIM?.trim(), item.PRS_PERSONEL_KOD?.trim()].filter(Boolean).join(" - "),
            }))
        );
      } catch (error) {
        console.error("Personel listesi alınamadı:", error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchPersoneller();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <Select
      mode="multiple"
      style={{ width: "100%" }}
      placeholder={t("personel")}
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

PersonelFilterSelectbox.propTypes = {
  value: PropTypes.array,
  onChange: PropTypes.func.isRequired,
};
