import React, { useEffect, useMemo, useRef, useState } from "react";
import PropTypes from "prop-types";
import { Select } from "antd";
import { useTranslation } from "react-i18next";
import AxiosInstance from "../../../api/http";
import useDebounce from "../../../hooks/useDebounce";

export default function EkipmanFilterSelect({ value, onChange }) {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const debouncedSearchTerm = useDebounce(searchTerm, 400);
  // Seçili ekipmanların etiketleri arama sonuçları değişse de kaybolmamalı.
  const selectedLabelsRef = useRef({});

  useEffect(() => {
    let cancelled = false;

    const fetchEkipmanlar = async () => {
      setLoading(true);
      try {
        const response = await AxiosInstance.post(`GetMakineFullList?pagingDeger=1&pageSize=50&lokasyonId=0&parametre=${encodeURIComponent(debouncedSearchTerm)}`, {});
        const list = response?.makine_listesi || [];
        if (!cancelled) {
          setOptions(
            list.map((item) => ({
              value: item.TB_MAKINE_ID,
              label: [item.MKN_TANIM, item.MKN_KOD].filter(Boolean).join(" - "),
            }))
          );
        }
      } catch (error) {
        console.error("Ekipman listesi alınamadı:", error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchEkipmanlar();

    return () => {
      cancelled = true;
    };
  }, [debouncedSearchTerm]);

  options.forEach((option) => {
    selectedLabelsRef.current[option.value] = option.label;
  });

  const mergedOptions = useMemo(() => {
    const missingSelected = (value || [])
      .filter((id) => !options.some((option) => option.value === id))
      .map((id) => ({ value: id, label: selectedLabelsRef.current[id] || String(id) }));

    return [...missingSelected, ...options];
  }, [options, value]);

  return (
    <Select
      mode="multiple"
      allowClear
      showSearch
      loading={loading}
      value={value}
      onChange={onChange}
      onSearch={setSearchTerm}
      filterOption={false}
      options={mergedOptions}
      placeholder={t("ekipmanKodAdVeyaTip")}
      maxTagCount="responsive"
      style={{ width: 258 }}
    />
  );
}

EkipmanFilterSelect.propTypes = {
  value: PropTypes.array,
  onChange: PropTypes.func.isRequired,
};
