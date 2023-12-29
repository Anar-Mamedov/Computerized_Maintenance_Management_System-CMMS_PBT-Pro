import React, { useState, createRef, useEffect } from "react";
import { useFormContext, Controller } from "react-hook-form";
import { Select, Typography, Spin, Input } from "antd";
import AxiosInstance from "../../../../../../../api/http";

const { Text, Link } = Typography;
const { Option } = Select;

export default function ModelSelect() {
  const { control, setValue, watch } = useFormContext();
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  const selectedMarkaID = watch("MakineMarkaID");

  const fetchData = async () => {
    if (!selectedMarkaID) return; // Eğer marka ID yoksa, istek yapma
    setLoading(true);
    try {
      // Template literals kullanarak URL'i düzgün bir şekilde oluştur
      const response = await AxiosInstance.get(`GetMakineModelByMarkaId?markaId=${selectedMarkaID}`);
      if (response && response.Makine_Model_List) {
        setOptions(response.Makine_Model_List);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    setValue("MakineModel", null); // Marka değiştiğinde modeli sıfırla
    setValue("MakineModelID", null); // Marka değiştiğinde model ID'sini sıfırla
  }, [selectedMarkaID]); // selectedMarkaID değiştiğinde fetchData fonksiyonunu çalıştır

  return (
    <div
      style={{ display: "flex", alignItems: "center", gap: "10px", justifyContent: "space-between", width: "380px" }}>
      <Text style={{ fontSize: "14px" }}>Model:</Text>
      <Controller
        name="MakineModel"
        control={control}
        render={({ field }) => (
          <Select
            {...field}
            style={{ width: "250px" }}
            showSearch
            allowClear
            placeholder="Seçim Yapınız"
            optionFilterProp="children"
            filterOption={(input, option) =>
              option.label ? option.label.toLowerCase().includes(input.toLowerCase()) : false
            }
            onDropdownVisibleChange={(open) => {
              if (open) {
                fetchData(); // Fetch data when the dropdown is opened
              }
            }}
            dropdownRender={(menu) => <Spin spinning={loading}>{menu}</Spin>}
            options={options.map((item) => ({
              value: item.TB_MODEL_ID, // Use the ID as the value
              label: item.MDL_MODEL, // Display the name in the dropdown
            }))}
            onChange={(value) => {
              // Seçilen değerin ID'sini NedeniID alanına set et
              setValue("MakineModelID", value);
              field.onChange(value);
            }}
          />
        )}
      />
      <Controller
        name="MakineModelID"
        control={control}
        render={({ field }) => (
          <Input
            {...field}
            type="text" // Set the type to "text" for name input
            style={{ display: "none" }}
          />
        )}
      />
    </div>
  );
}
