import React, { useState } from "react";
import { Select } from "antd";
import { t } from "i18next";

const StatusFilter = ({ onSubmit }) => {
  const [selectedValue, setSelectedValue] = useState(-1);

  const options = [
    { value: -1, label: t("tumu") },
    { value: 1, label: t("aktif") },
    { value: 0, label: t("pasif") },
  ];

  const handleChange = (value) => {
    setSelectedValue(value);
    onSubmit(value);
  };

  return (
    <Select style={{ width: "120px" }} value={selectedValue} onChange={handleChange} options={options} />
  );
};

export default StatusFilter;
