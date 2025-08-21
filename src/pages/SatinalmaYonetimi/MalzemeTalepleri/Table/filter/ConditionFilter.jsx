import React, { useState, useEffect } from "react";
import { Popover, Button, Select } from "antd";

const { Option } = Select;

const ConditionFilter = ({ onSubmit }) => {
  const [visible, setVisible] = useState(false);
  const [options, setOptions] = useState([]);
  const [selectedKey, setSelectedKey] = useState(null);

  useEffect(() => {
    // Durum listesi
    const hardcodedOptions = [
      { key: -1, value: "Tüm Durumlar" },
      { key: 1, value: "Açık" },
      { key: 2, value: "Teklif" },
      { key: 3, value: "Sipariş" },
      { key: 4, value: "Karşılanıyor" },
      { key: 5, value: "Kapalı" },
      { key: 6, value: "İptal" },
      { key: 7, value: "Onay Bekliyor" },
      { key: 8, value: "Onaylandı" },
      { key: 9, value: "Onaylanmadı" },
    ];
    setOptions(hardcodedOptions);
  }, []);

  const handleSubmit = () => {
  const value = parseInt(selectedKey);

  if (isNaN(value)) {
    onSubmit({}); // Seçim yapılmadıysa filtreleme gönderme
  } else {
    onSubmit({ tabDurumID: value }); // Seçim ne olursa olsun gönder
  }

  setVisible(false);
};

  const handleCancelClick = () => {
  setSelectedKey(-1);
  onSubmit({ tabDurumID: -1 });
  setVisible(false);
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
          placeholder="Durum Seç..."
          value={selectedKey}
          onChange={setSelectedKey}
          allowClear
        >
          {options.map((option) => (
            <Option key={option.key} value={option.key}>
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
      placement="bottom"
    >
      <Button>
        Durum{" "}
        {selectedKey !== null && selectedKey !== -1 && (
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