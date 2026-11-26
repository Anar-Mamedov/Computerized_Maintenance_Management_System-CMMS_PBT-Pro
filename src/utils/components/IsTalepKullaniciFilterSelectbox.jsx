import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Select } from "antd";
import AxiosInstance from "../../api/http";

/**
 * İş talebi kullanıcısı filtresi (ör. iş talebinin ilgili kişisi / iş takip edeni).
 * Liste API'leri kişiyi ID dizisi olarak beklediği için seçim `TB_IS_TALEBI_KULLANICI_ID` üzerinden tutulur.
 */
export default function IsTalepKullaniciFilterSelectbox({ value, onChange, placeholder }) {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const fetchKullanicilar = async () => {
      setLoading(true);
      try {
        const response = await AxiosInstance.get("GetIsTalepKullaniciList");
        if (cancelled) return;

        setOptions(
          (Array.isArray(response) ? response : [])
            .filter((item) => item?.TB_IS_TALEBI_KULLANICI_ID !== undefined && item?.TB_IS_TALEBI_KULLANICI_ID !== null)
            .map((item) => ({
              value: item.TB_IS_TALEBI_KULLANICI_ID,
              label: [item.ISK_ISIM?.trim(), item.ISK_KOD?.trim()].filter(Boolean).join(" - "),
            }))
        );
      } catch (error) {
        console.error("İş talebi kullanıcı listesi alınamadı:", error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchKullanicilar();

    return () => {
      cancelled = true;
    };
  }, []);

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

IsTalepKullaniciFilterSelectbox.propTypes = {
  value: PropTypes.array,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
};
