import React, { useState } from "react";
import { Select, Button, Dropdown, Menu } from "antd";
import AxiosInstance from "../../../../../api/http";

const { Option } = Select;

const PersonelFilter = ({ onSubmit }) => {
  const [visible, setVisible] = useState(false);
  const [options, setOptions] = React.useState([]);
  const [filters, setFilters] = useState({});

  const handleChange = (selectedIds) => {
    const selectedItemsCopy = {};

    selectedIds.forEach((id) => {
      const foundOption = options.find((opt) => opt.id === id);
      if (foundOption) {
        selectedItemsCopy[id] = foundOption.name;
      }
    });

    setFilters(selectedItemsCopy);
  };

  React.useEffect(() => {
    AxiosInstance.get("Personel")
      .then((response) => {
        if (Array.isArray(response)) {
          setOptions(
            response.map((item) => ({
              id: item.TB_PERSONEL_ID || item.ID, 
              name: item.PRS_ISIM || item.ADI_SOYADI || item.ADI, 
            }))
          );
        }
      })
      .catch((error) => {
        console.log("API Error (Personel):", error);
      });
  }, []);

  const handleSubmit = () => {
    const selectedIds = Object.keys(filters).map((id) => Number(id));
    onSubmit({ PersonelIds: selectedIds });
    
    setVisible(false);
  };

  const handleCancelClick = () => {
    setFilters({});
    setVisible(false);
    onSubmit({ PersonelIds: [] });
  };

  const menu = (
    <Menu style={{ width: "300px" }}>
      <div
        style={{ borderBottom: "1px solid #ccc", padding: "10px", display: "flex", justifyContent: "space-between" }}>
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
          value={Object.keys(filters).map((id) => Number(id))}
          onChange={handleChange}
          allowClear
          showArrow={false}
          optionFilterProp="children"
        >
          {options.map((option) => (
            <Option key={option.id} value={option.id}>
              {option.name}
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
      visible={visible}
      onVisibleChange={(v) => setVisible(v)}>
      <Button style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
        Personel
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
          }}>
          {Object.keys(filters).length}
        </span>
      </Button>
    </Dropdown>
  );
};

export default PersonelFilter;