import React, { useState, useEffect } from "react";
import { Popover, Button, Select } from "antd";
import AxiosInstance from "../../../../../api/http";

const { Option } = Select;

const ProfileFilter = ({ onSubmit, selectedProfilId }) => {
  const [visible, setVisible] = useState(false);
  const [options, setOptions] = useState([]);
  const [tempFilter, setTempFilter] = useState(null);

  // Üstten (MainTable'dan) varsayılan profil geldiğinde senkronize et
  useEffect(() => {
    if (selectedProfilId) {
      setTempFilter(selectedProfilId);
    }
  }, [selectedProfilId]);

  // Profil listesini API'den çek
  useEffect(() => {
    AxiosInstance.get("GetAmortismanProfilList")
      .then((response) => {
        const responseData = response.data || response;
        if (Array.isArray(responseData)) {
          const mappedOptions = responseData.map((item) => ({
            key: item.TB_AP_ID,
            value: item.Ad,
          }));
          setOptions(mappedOptions);
        }
      })
      .catch((err) => console.error("Profil listesi hatası:", err));
  }, []);

  const handleSubmit = () => {
    onSubmit(tempFilter); // Seçilen ID'yi yukarı fırlat
    setVisible(false);
  };

  const handleCancelClick = () => {
    setTempFilter(null);
    onSubmit(null); // Filtreyi sıfırla
    setVisible(false);
  };

  const handleChange = (value) => {
    setTempFilter(value);
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
          placeholder="Profil Seç..."
          value={tempFilter}
          onChange={handleChange}
          allowClear
          showSearch
          optionFilterProp="children"
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
        Profil
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

export default ProfileFilter;