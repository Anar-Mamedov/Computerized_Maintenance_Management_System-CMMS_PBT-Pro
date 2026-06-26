import React, { useEffect, useState } from "react";
import { Select } from "antd";
import { t } from "i18next";
import PropTypes from "prop-types";
import AxiosInstance from "../../../../../../api/http";

// Periyodik bakımların çoklu seçimi için kullanılan filtre bileşeni.
// PeriyodikBakimList endpoint'inden beslenir, seçilen ID'leri (array) onChange ile döner.
export default function PeriyodikBakimSelect({ value, onChange, style, placeholder }) {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    AxiosInstance.get("PeriyodikBakimList")
      .then((response) => {
        if (!active) {
          return;
        }
        const list = Array.isArray(response) ? response : [];
        setOptions(
          list.map((item) => ({
            value: item.TB_PERIYODIK_BAKIM_ID,
            label: `${item.PBK_KOD || ""}${item.PBK_TANIM ? ` - ${item.PBK_TANIM}` : ""}`.trim() || `#${item.TB_PERIYODIK_BAKIM_ID}`,
          }))
        );
      })
      .catch((error) => {
        console.error("Periyodik bakım listesi alınamadı:", error);
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <Select
      mode="multiple"
      allowClear
      loading={loading}
      value={value}
      onChange={onChange}
      maxTagCount="responsive"
      placeholder={placeholder || t("periyodikBakim", { defaultValue: "Periyodik Bakım" })}
      style={style}
      optionFilterProp="label"
      options={options}
      filterOption={(input, option) => (option?.label || "").toLowerCase().includes(input.toLowerCase())}
    />
  );
}

PeriyodikBakimSelect.propTypes = {
  value: PropTypes.array,
  onChange: PropTypes.func,
  style: PropTypes.object,
  placeholder: PropTypes.string,
};
