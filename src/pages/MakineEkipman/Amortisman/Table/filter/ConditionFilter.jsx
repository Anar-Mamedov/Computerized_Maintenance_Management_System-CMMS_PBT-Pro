import React, { useState, useEffect } from "react";
import { Popover, Button, Select } from "antd";

const { Option } = Select;

const ConditionFilter = ({ onSubmit }) => {
  const [visible, setVisible] = useState(false);
  const [options, setOptions] = useState([]);
  // Kanka burayı tekil değer tutacak şekilde (null) başlattım
  const [selectedKey, setSelectedKey] = useState(null); 

  useEffect(() => {
    // Dokümandaki DurumId'lere göre statik liste
    const hardcodedOptions = [
      { key: 1, value: "Ekonomik ömür içi" },
      { key: 2, value: "Ekonomik ömür sonu / salvage" },
      { key: 3, value: "Ekonomik ömür sonrası lineer düşüş" },
      { key: 4, value: "Scrap seviyesinde" },
      { key: 0, value: "Belirsiz / Hatalı Veri" },
    ];
    setOptions(hardcodedOptions);
  }, []);

  const handleSubmit = () => {
    // Tekil ID olarak Filters.jsx'e gönderiyoruz
    // Eğer seçim yoksa null gider
    onSubmit(selectedKey); 
    setVisible(false);
  };

  const handleCancelClick = () => {
    setSelectedKey(null); // Seçimi temizle
    onSubmit(null); // Filtreyi sıfırla
    setVisible(false);
  };

  // Select değişince direkt değeri atıyoruz
  const handleChange = (value) => {
    setSelectedKey(value);
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
          onChange={handleChange}
          allowClear
          maxTagCount="responsive" // Çok fazla seçilirse +3 gibi gösterir input içinde
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
          <div
            style={{
              marginLeft: "5px",
              width: "5px",
              height: "17px",
              display: "inline-flex",
              justifyContent: "center",
              alignItems: "center",
              color: "white",
              fontSize: "12px",
            }}
          >
          </div>
      </Button>
    </Popover>
  );
};

export default ConditionFilter;