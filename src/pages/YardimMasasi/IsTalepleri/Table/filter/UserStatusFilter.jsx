import React, { useState, useEffect } from "react";
import { Popover, Button, Select } from "antd";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

const { Option } = Select;

// Kullanıcı onay durum filtresi
// Icerik: { "0": "bekliyor", "1": "onaylandi", "2": "reddedildi" }
export default function UserStatusFilter({ onSubmit }) {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);
  const [options, setOptions] = useState([]);
  const [filters, setFilters] = useState({});

  useEffect(() => {
    const hardcodedOptions = [
      { key: 0, value: t("bekliyor") },
      { key: 1, value: t("onaylandi") },
      { key: 2, value: t("reddedildi") },
    ];
    setOptions(hardcodedOptions);
  }, []);

  const handleChange = (value) => {
    const selectedItemsCopy = { ...filters };
    options.forEach((option) => {
      const isSelected = selectedItemsCopy[option.key] !== undefined;
      if (isSelected && !value.includes(option.value)) {
        delete selectedItemsCopy[option.key];
      } else if (!isSelected && value.includes(option.value)) {
        selectedItemsCopy[option.key] = option.value;
      }
    });
    setFilters(selectedItemsCopy);
  };

  const handleSubmit = () => {
    // Secilen durumlarin key degerlerini gonder
    const selectedKeysObj = {};
    Object.keys(filters).forEach((key, index) => {
      selectedKeysObj[`key${index}`] = key;
    });
    onSubmit(selectedKeysObj);
    setVisible(false);
  };

  const handleCancelClick = () => {
    setFilters({});
    setVisible(false);
    onSubmit("");
  };

  const content = (
    <div style={{ width: "300px" }}>
      <div style={{ borderBottom: "1px solid #ccc", padding: "10px", display: "flex", justifyContent: "space-between" }}>
        <Button onClick={handleCancelClick}>İptal</Button>
        <Button type="primary" onClick={handleSubmit}>
          Uygula
        </Button>
      </div>
      <div style={{ padding: "10px" }}>
        <Select mode="multiple" style={{ width: "100%" }} placeholder="Ara..." value={Object.values(filters)} onChange={handleChange} allowClear>
          {options.map((option) => (
            <Option key={option.key} value={option.value}>
              {option.value}
            </Option>
          ))}
        </Select>
      </div>
    </div>
  );

  return (
    <Popover content={content} trigger="click" open={visible} onOpenChange={setVisible} placement="bottom">
      <Button style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
        {t("kullaniciOnayi")}
        <div
          style={{
            marginLeft: "5px",
            background: "#006cb8",
            borderRadius: "50%",
            width: "17px",
            height: "17px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "white",
          }}
        >
          {Object.keys(filters).length}
        </div>
      </Button>
    </Popover>
  );
}

UserStatusFilter.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};
