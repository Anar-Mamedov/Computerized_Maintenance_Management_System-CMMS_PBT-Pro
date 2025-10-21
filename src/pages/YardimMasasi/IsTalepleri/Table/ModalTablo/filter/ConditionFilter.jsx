import React, { useState, useRef } from "react";
import { Popover, Button, Select } from "antd";

const { Option } = Select;

const STATUS_OPTIONS = [
  { key: 0, value: "Açık" },
  { key: 1, value: "Bekliyor" },
  { key: 2, value: "Planlandı" },
  { key: 3, value: "Devam Ediyor" },
  { key: 4, value: "Kapandı" },
  { key: 5, value: "İptal Edildi" },
  { key: 6, value: "Onay Bekliyor" },
  { key: 7, value: "Onaylandı" },
  { key: 8, value: "Onaylanmadı" },
];

const DEFAULT_STATUS_KEYS = ["3"];

const normalizeStatusKeys = (keys) => {
  if (!Array.isArray(keys) || keys.length === 0) {
    return DEFAULT_STATUS_KEYS;
  }
  return keys.map((key) => key.toString());
};

const buildFilterMapFromKeys = (keys) => {
  const normalized = normalizeStatusKeys(keys);
  const result = {};

  normalized.forEach((key) => {
    const option = STATUS_OPTIONS.find((opt) => opt.key.toString() === key);
    if (option) {
      result[option.key] = option.value;
    }
  });

  if (Object.keys(result).length === 0) {
    const fallback = {};
    normalizeStatusKeys(DEFAULT_STATUS_KEYS).forEach((key) => {
      const option = STATUS_OPTIONS.find((opt) => opt.key.toString() === key);
      if (option) {
        fallback[option.key] = option.value;
      }
    });
    return fallback;
  }

  return result;
};

const buildSubmitPayloadFromFilters = (filterMap) =>
  Object.keys(filterMap).reduce((acc, key, index) => {
    acc[`key${index}`] = key.toString();
    return acc;
  }, {});

const ConditionFilter = ({ onSubmit, defaultStatusKeys = DEFAULT_STATUS_KEYS }) => {
  const [visible, setVisible] = useState(false);
  const onSubmitRef = useRef(onSubmit);
  const defaultFilters = React.useMemo(() => buildFilterMapFromKeys(defaultStatusKeys), [defaultStatusKeys]);
  const [filters, setFilters] = useState(() => ({ ...defaultFilters }));

  React.useEffect(() => {
    onSubmitRef.current = onSubmit;
  }, [onSubmit]);

  React.useEffect(() => {
    setFilters((state) => {
      if (JSON.stringify(state) === JSON.stringify(defaultFilters)) {
        return state;
      }
      return { ...defaultFilters };
    });
    onSubmitRef.current(buildSubmitPayloadFromFilters(defaultFilters));
  }, [defaultFilters]);

  const handleChange = (value) => {
    const selectedItemsCopy = { ...filters };
    STATUS_OPTIONS.forEach((option) => {
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
    onSubmitRef.current(buildSubmitPayloadFromFilters(filters));

    // Dropdown'ı gizle
    setVisible(false);
  };

  const handleCancelClick = () => {
    setFilters({});
    setVisible(false);
    onSubmitRef.current("");
  };

  const content = (
    <div style={{ width: "300px" }}>
      <div
        style={{
          borderBottom: "1px solid #ccc",
          padding: "10px",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Button onClick={handleCancelClick}>İptal</Button>
        <Button type="primary" onClick={handleSubmit}>
          Uygula
        </Button>
      </div>
      <div style={{ padding: "10px" }}>
        <Select mode="multiple" style={{ width: "100%" }} placeholder="Ara..." value={Object.values(filters)} onChange={handleChange} allowClear>
          {STATUS_OPTIONS.map((option) => (
            <Option key={option.key} value={option.value}>
              {option.value}
            </Option>
          ))}
        </Select>
      </div>
    </div>
  );

  return (
    <Popover
      content={content}
      trigger="click"
      open={visible}
      onOpenChange={setVisible}
      placement="bottom" // Popover'ın açılacağı yön
    >
      <Button
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        Durum
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
};

export default ConditionFilter;
