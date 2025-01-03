import React, { useState, useEffect } from "react";
import { Select, Spin } from "antd";
import AxiosInstance from "../../../../../../../api/http";
import { useFormContext } from "react-hook-form";

const { Option } = Select;

const LocationFilter = ({ onLocationChange }) => {
  const [options, setOptions] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [loading, setLoading] = useState(false);

  const { setValue } = useFormContext();

  useEffect(() => {
    setLoading(true);
    AxiosInstance.get("GetLokasyonList")
      .then((response) => {
        const newOptions = response.map((item) => ({
          key: item.TB_LOKASYON_ID.toString(), // ID
          value: item.LOK_TANIM, // Gösterilecek metin
        }));
        setOptions(newOptions);
        setLoading(false);
      })
      .catch((error) => {
        console.log("API Error:", error);
        setLoading(false);
      });
  }, []);

  const handleChange = (selectedKeys) => {
    // Direkt ID üzerinden gelen selectedKeys değerlerini sakla
    setSelectedIds(selectedKeys);

    // String'e çevirme ve üst bileşene gönderme
    const locationString = selectedKeys.join(",");
    setValue("locationIds", locationString);

    // Üst bileşene bildir
    if (onLocationChange) {
      onLocationChange(locationString);
    }
  };

  return (
    <Select
      mode="multiple"
      style={{ width: "250px" }}
      placeholder="Lokasyon Seçin"
      value={selectedIds} // Seçili ID'ler
      onChange={handleChange} // ID array’i güncelleyen fonksiyon
      allowClear
      showSearch // Arama barını aktif eder
      optionFilterProp="children" // Aramayı children (görünen label) üzerinden yapsın
      notFoundContent={
        loading ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "40px",
            }}
          >
            <Spin size="small" />
          </div>
        ) : null
      }
    >
      {options.map((option) => (
        <Option key={option.key} value={option.key}>
          {option.value}
        </Option>
      ))}
    </Select>
  );
};

export default LocationFilter;
