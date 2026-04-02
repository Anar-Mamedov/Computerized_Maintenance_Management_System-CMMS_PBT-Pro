import React, { useState } from "react";
import { Select, Button, Dropdown, Menu } from "antd";
import AxiosInstance from "../../../../../api/http";

const { Option } = Select;

const LocationFilter = ({ onSubmit }) => {
  const [visible, setVisible] = useState(false);

  // useeffect ile api den veri data cekip options a atayacagiz
  const [options, setOptions] = React.useState([]);
  const [filters, setFilters] = useState([]);

  const handleChange = (value) => {
    setFilters(value);
  };

  React.useEffect(() => {
    AxiosInstance.get("GetLokasyonList")
      .then((response) => {
        const options = response.map((option) => ({ key: option.TB_LOKASYON_ID, value: option.TB_LOKASYON_ID, label: option.LOK_TANIM }));
        setOptions(options);
      })
      .catch((error) => {
        console.log("API Error:", error);
      });
  }, []);

  const handleSubmit = () => {
    // Seçilen öğeleri başka bir bileşene iletmek için prop olarak gelen işlevi çağırın
    onSubmit(filters);

    // Dropdown'ı gizle
    setVisible(false);
  };

  const handleCancelClick = () => {
    // Seçimleri iptal etmek için seçilen öğeleri sıfırlayın
    setFilters([]);
    // Dropdown'ı gizle
    setVisible(false);
    onSubmit("");
  };

  const menu = (
    <Menu style={{ width: "300px" }}>
      <div style={{ borderBottom: "1px solid #ccc", padding: "10px", display: "flex", justifyContent: "space-between" }}>
        <Button onClick={handleCancelClick}>İptal</Button>
        <Button type="primary" onClick={handleSubmit}>
          Uygula
        </Button>
      </div>
      <div style={{ padding: "10px" }}>
        <Select mode="multiple" style={{ width: "100%" }} placeholder="Ara..." value={filters} onChange={handleChange} allowClear showArrow={false} optionFilterProp="children">
          {/* Seçenekleri elle ekleyin */}
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
    <Dropdown overlay={menu} placement="bottomLeft" trigger={["click"]} visible={visible} onVisibleChange={(v) => setVisible(v)}>
      <Button style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
        Lokasyon
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
          }}
        >
          {filters.length}{" "}
        </span>
      </Button>
    </Dropdown>
  );
};

export default LocationFilter;
