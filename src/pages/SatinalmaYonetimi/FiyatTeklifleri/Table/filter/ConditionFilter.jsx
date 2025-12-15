import React, { useState, useEffect } from "react";
import { Popover, Button, Select } from "antd";

const { Option } = Select;

const ConditionFilter = ({ onSubmit }) => {
  const [visible, setVisible] = useState(false);
  const [options, setOptions] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState([]); // Array state

  useEffect(() => {
    // Durum listesi
    const hardcodedOptions = [
      { key: 1, value: "Açık" },
      { key: 2, value: "Karşılanıyor" },
      { key: 3, value: "Kapalı" },
      { key: 4, value: "İptal" },
      { key: 5, value: "Onay Bekliyor" },
      { key: 6, value: "Onaylandı" },
      { key: 7, value: "Onaylanmadı" },
    ];
    setOptions(hardcodedOptions);
  }, []);

  const handleSubmit = () => {
    // Array'i olduğu gibi gönderiyoruz: [1, 5]
    onSubmit({ durumId: selectedKeys }); 
    setVisible(false);
  };

  const handleCancelClick = () => {
    setSelectedKeys([]); // State'i boşalt
    onSubmit({ durumId: [] }); // Dışarıya boş array gönder
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
          mode="multiple" // ÇOKLU SEÇİM
          style={{ width: "100%" }}
          placeholder="Durum Seç..."
          value={selectedKeys}
          onChange={(values) => setSelectedKeys(values)}
          allowClear
          maxTagCount="responsive"
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
        Durum
        {selectedKeys && selectedKeys.length > 0 && (
          <div
            style={{
              marginLeft: "5px",
              background: "#006cb8",
              borderRadius: "50%",
              minWidth: "17px",
              height: "17px",
              padding: "0 4px",
              display: "inline-flex",
              justifyContent: "center",
              alignItems: "center",
              color: "white",
              fontSize: "12px",
            }}
          >
            {selectedKeys.length}
          </div>
        )}
      </Button>
    </Popover>
  );
};

export default ConditionFilter;