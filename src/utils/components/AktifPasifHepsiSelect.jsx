import React from "react";
import { Select } from "antd";
import { t } from "i18next";

export default function AktifPasifHepsiSelect({ value = 1, onChange, style, ...rest }) {
  const options = [
    { value: 1, label: t("aktif") },
    { value: 0, label: t("pasif") },
    { value: -1, label: t("hepsi") },
  ];

  return <Select value={value} onChange={onChange} options={options} style={{ width: 160, ...style }} {...rest} />;
}
