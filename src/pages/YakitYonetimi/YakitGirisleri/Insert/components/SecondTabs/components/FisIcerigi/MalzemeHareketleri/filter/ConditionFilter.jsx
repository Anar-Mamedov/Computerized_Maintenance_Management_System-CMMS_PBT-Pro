import React, { useState, useEffect } from "react";
import { Popover, Button, Select } from "antd";

const { Option } = Select;

const ConditionFilter = ({ onSubmit }) => {
  const [visible, setVisible] = useState(false);
  const [options, setOptions] = useState([]);
  const [selectedValue, setSelectedValue] = useState(null);

  useEffect(() => {
    // Backend'e gönderilecek değerler
    const hardcodedOptions = ["GIRIS", "CIKIS", "TRANSFER"];
    setOptions(hardcodedOptions);
  }, []);

  const handleSubmit = () => {
    if (!selectedValue) {
      onSubmit({ hareketTip: "" }); // boş gönder
    } else {
      onSubmit({ hareketTip: selectedValue }); // string olarak gönder
    }
    setVisible(false);
  };

  const handleCancelClick = () => {
    setSelectedValue(null);
    onSubmit({ hareketTip: "" });
    setVisible(false);
  };

  // Görüntüde Türkçe karakterli versiyonlar
  const displayMap = {
    GIRIS: "GİRİŞ",
    CIKIS: "ÇIKIŞ",
    TRANSFER: "TRANSFER",
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
        <Button onClick={handleCancelClick}>Temizle</Button>
        <Button type="primary" onClick={handleSubmit}>
          Uygula
        </Button>
      </div>
      <div style={{ padding: "10px" }}>
        <Select
          style={{ width: "100%" }}
          placeholder="Hareket Tipi Seç..."
          value={selectedValue}
          onChange={setSelectedValue}
          allowClear
        >
          {options.map((opt) => (
            <Option key={opt} value={opt}>
              {displayMap[opt] || opt}
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
      placement="bottom"
    >
      <Button>
        Hareket Tipi{" "}
        {selectedValue && (
          <div
            style={{
              marginLeft: "5px",
              background: "#006cb8",
              borderRadius: "50%",
              width: "17px",
              height: "17px",
              display: "inline-flex",
              justifyContent: "center",
              alignItems: "center",
              color: "white",
              fontSize: "12px",
            }}
          >
            1
          </div>
        )}
      </Button>
    </Popover>
  );
};

export default ConditionFilter;