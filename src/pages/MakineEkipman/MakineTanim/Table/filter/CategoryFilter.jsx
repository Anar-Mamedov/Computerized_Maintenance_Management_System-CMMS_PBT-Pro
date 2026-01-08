import React, { useState } from "react";
import { Select, Button, Dropdown, Menu } from "antd";
import AxiosInstance from "../../../../../api/http";

const { Option } = Select;

const CategoryFilter = ({ onSubmit }) => {
  const [visible, setVisible] = useState(false);
  const [options, setOptions] = React.useState([]);
  const [filters, setFilters] = useState([]);

  const handleChange = (value) => {
    setFilters(value);
  };

  React.useEffect(() => {
    AxiosInstance.get("KodList?grup=32502")
      .then((response) => {
        const options = response.map((option) => ({
          key: option.TB_KOD_ID,
          value: option.TB_KOD_ID,
          label: option.KOD_TANIM,
        }));
        setOptions(options);
      })
      .catch((error) => {
        console.log("API Error:", error);
      });
  }, []);

  const handleSubmit = () => {
    onSubmit(filters);
    setVisible(false);
  };

  const handleCancelClick = () => {
    setFilters([]);
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
        Kategori
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

export default CategoryFilter;
