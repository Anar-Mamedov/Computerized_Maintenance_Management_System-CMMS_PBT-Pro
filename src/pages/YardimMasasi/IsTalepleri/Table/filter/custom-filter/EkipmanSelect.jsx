import React, { useEffect, useMemo, useRef, useState } from "react";
import PropTypes from "prop-types";
import { Select } from "antd";
import { t } from "i18next";
import AxiosInstance from "../../../../../../api/http";
import useDebounce from "../../../../../../hooks/useDebounce";

/**
 * Ekipman seçimi. Dashboard'daki ekipman filtresiyle aynı davranış:
 * arama sunucu tarafında yapılır ve seçim `TB_MAKINE_ID` üzerinden ID bazlı tutulur.
 */
export default function EkipmanSelect({ value, onChange }) {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 400);
  // Seçili ekipmanların etiketleri, arama sonuçları değişse de kaybolmamalı.
  const selectedLabelsRef = useRef({});

  useEffect(() => {
    let cancelled = false;

    const fetchEkipmanlar = async () => {
      setLoading(true);
      try {
        const response = await AxiosInstance.post(
          `GetMakineFullList?pagingDeger=1&pageSize=50&lokasyonId=0&parametre=${encodeURIComponent(debouncedSearchTerm)}`,
          {}
        );
        if (cancelled) return;

        setOptions(
          (response?.makine_listesi || []).map((item) => ({
            value: item.TB_MAKINE_ID,
            label: [item.MKN_TANIM, item.MKN_KOD].filter(Boolean).join(" - "),
          }))
        );
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
    const eksikSecililer = (value || [])
      .filter((id) => !options.some((option) => option.value === id))
      .map((id) => ({ value: id, label: selectedLabelsRef.current[id] || String(id) }));

    return [...eksikSecililer, ...options];
  }, [options, value]);

  return (
    <Select
      mode="multiple"
      style={{ width: "100%" }}
      placeholder={t("ekipmanKodAdVeyaTip")}
      value={value || []}
      onChange={onChange}
      onSearch={setSearchTerm}
      options={mergedOptions}
      loading={loading}
      filterOption={false}
      allowClear
      showSearch
      maxTagCount="responsive"
    />
  );
}

EkipmanSelect.propTypes = {
  value: PropTypes.array,
  onChange: PropTypes.func.isRequired,
};
