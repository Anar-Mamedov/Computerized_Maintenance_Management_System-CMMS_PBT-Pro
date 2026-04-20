import React, { useState, useEffect } from "react";
import { Select, Button, Popover } from "antd";
import AxiosInstance from "../../../../../api/http";

const { Option } = Select;

const LocationFilter = ({ onSubmit }) => {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const [selectedValues, setSelectedValues] = useState([]);

  const handleChange = (values) => {
    setSelectedValues(values);
  };

  useEffect(() => {
    if (open && options.length === 0) {
      AxiosInstance.get("GetLokasyonList")
        .then((response) => {
          const mapped = (response || []).map((item) => ({
            key: item.TB_LOKASYON_ID,
            value: item.TB_LOKASYON_ID,
            label: item.LOK_TANIM,
          }));
          setOptions(mapped);
        })
        .catch((error) => {
          console.log("API Error:", error);
        });
    }
  }, [open, options.length]);

  const handleSubmit = () => {
    onSubmit([...selectedValues]);
    setOpen(false);
  };

  const handleCancelClick = () => {
    setSelectedValues([]);
    setOpen(false);
    onSubmit([]);
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
        <Select
          mode="multiple"
          style={{ width: "100%" }}
          placeholder="Ara..."
          value={selectedValues}
          onChange={handleChange}
          allowClear
          optionFilterProp="label"
          showSearch
        >
          {options.map((option) => (
            <Option key={option.key} value={option.value} label={option.label}>
              {option.label}
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
      open={open}
      onOpenChange={setOpen}
      placement="bottom"
    >
      <Button
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        Lokasyon
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
          {selectedValues.length}
        </div>
      </Button>
    </Popover>
  );
};

export default LocationFilter;
