import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Select } from "antd";
import { useTranslation } from "react-i18next";
import AxiosInstance from "../../../api/http";

export default function LokasyonFilterSelect({ value, onChange }) {
  const { t } = useTranslation();
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const fetchLokasyonlar = async () => {
      setLoading(true);
      try {
        const response = await AxiosInstance.get("GetLokasyonList");
        const list = Array.isArray(response) ? response : [];
        if (!cancelled) {
          setOptions(list.map((item) => ({ value: item.TB_LOKASYON_ID, label: item.LOK_TANIM })));
        }
      } catch (error) {
        console.error("Lokasyon listesi alınamadı:", error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchLokasyonlar();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <Select
      mode="multiple"
      allowClear
      showSearch
      loading={loading}
      value={value}
      onChange={onChange}
      options={options}
      placeholder={t("tumLokasyonlar")}
      maxTagCount="responsive"
      optionFilterProp="label"
      style={{ width: 232 }}
    />
  );
}

LokasyonFilterSelect.propTypes = {
  value: PropTypes.array,
  onChange: PropTypes.func.isRequired,
};
