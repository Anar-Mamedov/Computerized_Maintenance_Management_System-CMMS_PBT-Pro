import React, { useState } from "react";
import { Popover, Button, Select } from "antd";

const { Option } = Select;

const ConditionFilter = ({ onSubmit }) => {
  const [visible, setVisible] = useState(false);
  const [selectedValue, setSelectedValue] = useState("TUMU");

  const options = [
    { key: "TUMU", value: "TÜMÜ" },
    { key: "GIRIS", value: "GİRİŞ" },
    { key: "CIKIS", value: "ÇIKIŞ" },
    { key: "SARF", value: "SARF" },
    { key: "TRANSFER", value: "TRANSFER" },
  ];

  const handleSubmit = () => {
    // Body'deki SekmeTipi string olduğu için direkt string gönderiyoruz
    onSubmit(selectedValue); 
    setVisible(false);
  };

  const handleCancelClick = () => {
    setSelectedValue("TUMU");
    onSubmit("TUMU");
    setVisible(false);
  };

  const content = (
    <div style={{ width: "250px" }}>
      <div style={{ borderBottom: "1px solid #f0f0f0", padding: "10px", display: "flex", justifyContent: "space-between" }}>
        <Button onClick={handleCancelClick}>Temizle</Button>
        <Button type="primary" onClick={handleSubmit}>Uygula</Button>
      </div>
      <div style={{ padding: "10px" }}>
        <Select
          style={{ width: "100%" }}
          value={selectedValue}
          onChange={(val) => setSelectedValue(val || "TUMU")}
        >
          {options.map((opt) => (
            <Option key={opt.key} value={opt.key}>{opt.value}</Option>
          ))}
        </Select>
      </div>
    </div>
  );

  return (
    <Popover content={content} trigger="click" open={visible} onOpenChange={setVisible} placement="bottom">
      <Button>
        İşlem Tipi
      </Button>
    </Popover>
  );
};

export default ConditionFilter;