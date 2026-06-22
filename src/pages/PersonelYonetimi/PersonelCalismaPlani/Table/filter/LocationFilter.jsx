import React, { useState } from "react";
import { Select, Button, Dropdown, Menu } from "antd";
import AxiosInstance from "../../../../../api/http";

const { Option } = Select;

const LocationFilter = ({ onSubmit }) => {
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
    AxiosInstance.get("getLokasyonlar")
      .then((response) => {
        if (Array.isArray(response)) {
          setOptions(
            response.map((item, index) => {
              return {
                id: item.TB_LOKASYON_ID || item.ID || index, 
                name: item.LKS_TANIM || item.LOKASYON_TANIMI || item, 
              };
            })
          );
        }
      })
      .catch((error) => {
        console.log("API Error:", error);
      });
  }, []);

  const handleSubmit = () => {
    const selectedIds = Object.keys(filters).map((id) => (isNaN(id) ? id : Number(id)));
    onSubmit({ LokasyonIds: selectedIds });

    setVisible(false);
  };

  const handleCancelClick = () => {
    setFilters({});
    setVisible(false);
    onSubmit({ LokasyonIds: [] });
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
          value={Object.keys(filters).map((id) => (isNaN(id) ? id : Number(id)))}
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
          }}>
          {Object.keys(filters).length}
        </span>
      </Button>
    </Dropdown>
  );
};

export default LocationFilter;