import React, { useState } from "react";
import { Popover, Button, Select } from "antd";

const { Option } = Select;

const ConditionFilter = ({ onSubmit, hatirlaticiGrupId, hatirlaticiSiraId, baslangicDurumIds }) => {
  const [visible, setVisible] = useState(false);
  const [options, setOptions] = React.useState([]);
  // Durum kodlarinin etiketleri; asagidaki hardcodedOptions ile ayni kaynak.
  const DURUM_ETIKETLERI = {
    0: "Açık",
    1: "Bekliyor",
    2: "Planlandı",
    3: "Devam Ediyor",
    4: "Kapandı",
    5: "İptal Edildi",
    6: "Onay Bekliyor",
    7: "Onaylandı",
    8: "Onaylanmadı",
  };

  const [filters, setFilters] = useState(() => {
    // Dashboard'dan gelindiyse o durumlar kutuda onceden secili gorunur.
    if (Array.isArray(baslangicDurumIds) && baslangicDurumIds.length) {
      return baslangicDurumIds.reduce((acc, id) => (DURUM_ETIKETLERI[id] ? { ...acc, [id]: DURUM_ETIKETLERI[id] } : acc), {});
    }
    if (Number(hatirlaticiGrupId) === 2 && Number(hatirlaticiSiraId) === 1) {
      return { 1: "Bekliyor" };
    }
    return {};
  });

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

  React.useEffect(() => {
    // Sabit verileri kullanarak options state'ini ayarlama
    const hardcodedOptions = [
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
    setOptions(hardcodedOptions);
  }, []);

  const handleSubmit = () => {
    // Seçilen durumların key değerlerini bir obje olarak oluştur
    let selectedKeysObj = {};
    Object.keys(filters).forEach((key, index) => {
      selectedKeysObj[`key${index}`] = key;
    });

    // Bu objeyi onSubmit fonksiyonuna gönder
    onSubmit(selectedKeysObj);

    // Dropdown'ı gizle
    setVisible(false);
  };

  const handleCancelClick = () => {
    setFilters([]);
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
    <Popover
      content={content}
      trigger="click"
      open={visible}
      onOpenChange={setVisible}
      placement="bottom" // Popover'ın açılacağı yön
    >
      <Button style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
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
