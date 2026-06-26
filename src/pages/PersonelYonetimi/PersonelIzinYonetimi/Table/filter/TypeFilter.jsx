import React, { useState, useEffect } from "react";
import { Select, Button, Dropdown, Menu } from "antd";
import AxiosInstance from "../../../../../api/http";

const { Option } = Select;

const TypeFilter = ({ onSubmit }) => {
  const [visible, setVisible] = useState(false);
  const [options, setOptions] = useState([]);
  
  // Seçilen ID'leri tutan state (Direkt array olarak tutuyoruz: [5098, 5099] gibi)
  const [selectedIds, setSelectedIds] = useState([]);

  // API'den veri çekme
  useEffect(() => {
    AxiosInstance.get("KodList?grup=35600")
      .then((response) => {
        // API yanıtını selectbox formatına çeviriyoruz
        const mappedOptions = response.map((item) => ({
          key: item.TB_KOD_ID,
          value: item.TB_KOD_ID,   // Value olarak ID tutuyoruz
          label: item.KOD_TANIM,   // Ekranda Tanım gösteriyoruz
        }));
        setOptions(mappedOptions);
      })
      .catch((error) => {
        console.log("API Error:", error);
      });
  }, []);

  // Select değiştiğinde çalışır (Antd Select multiple modunda direkt array döner)
  const handleChange = (values) => {
    setSelectedIds(values);
  };

  // Uygula butonuna basınca
  const handleSubmit = () => {
    // Seçilen ID arrayini (örn: [5098, 5518]) üst bileşene gönder
    onSubmit(selectedIds);
    setVisible(false);
  };

  // İptal butonuna basınca
  const handleCancelClick = () => {
    setSelectedIds([]); // Seçimleri temizle
    onSubmit([]);       // Boş array gönder
    setVisible(false);
  };

  const menu = (
    <Menu style={{ width: "300px" }}>
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
          mode="multiple"
          style={{ width: "100%" }}
          placeholder="Yakıt tipi ara..."
          value={selectedIds} // State'i buraya bağlıyoruz
          onChange={handleChange}
          allowClear
          showArrow={false}
          filterOption={(input, option) =>
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
        >
          {options.map((option) => (
            <Option key={option.key} value={option.value}>
              {option.label}
            </Option>
          ))}
        </Select>
      </div>
    </Menu>
  );

  return (
    <Dropdown
      overlay={menu}
      placement="bottomLeft"
      trigger={["click"]}
      open={visible} // 'visible' yerine 'open' (Antd sürümüne göre değişebilir, eskisi visible'dı)
      onOpenChange={(v) => setVisible(v)} // onVisibleChange yerine onOpenChange
    >
      <Button style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
        Yakıt Tipi
        <span
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
            fontSize: "10px",
          }}
        >
          {selectedIds.length}
        </span>
      </Button>
    </Dropdown>
  );
};

export default TypeFilter;