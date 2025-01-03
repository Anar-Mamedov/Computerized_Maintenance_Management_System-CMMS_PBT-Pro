import React, { useState, useEffect } from "react";
import { Select, Spin } from "antd";
import AxiosInstance from "../../../../../../../api/http";
import { useFormContext } from "react-hook-form";

const { Option } = Select;

const AtolyeSelect = ({ onAtolyeChange }) => {
  const [options, setOptions] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [loading, setLoading] = useState(false);

  const { setValue } = useFormContext();

  useEffect(() => {
    setLoading(true);
    AxiosInstance.get("AtolyeList")
      .then((response) => {
        const newOptions = response.map((item) => ({
          key: item.TB_ATOLYE_ID.toString(), // ID
          value: item.ATL_TANIM, // Gösterilecek metin
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
    const atolyeString = selectedKeys.join(",");
    setValue("atolyeIds", atolyeString);

    // Üst bileşene bildir
    if (onAtolyeChange) {
      onAtolyeChange(atolyeString);
    }
  };

  return (
    <Select
      mode="multiple"
      style={{ width: "250px" }}
      placeholder="Atölye Seçin"
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

export default AtolyeSelect;
