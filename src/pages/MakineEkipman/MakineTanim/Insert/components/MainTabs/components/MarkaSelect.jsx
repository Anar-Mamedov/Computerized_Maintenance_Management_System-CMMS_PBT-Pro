import React, { useState, createRef, useEffect } from "react";
import { useFormContext, Controller } from "react-hook-form";
import { Select, Typography, Spin, Input } from "antd";
import AxiosInstance from "../../../../../../../api/http";

const { Text, Link } = Typography;
const { Option } = Select;

export default function MarkaSelect() {
  const { control, setValue } = useFormContext();
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await AxiosInstance.get("GetMakineMarks");
      if (response && response.Makine_Marka_List) {
        setOptions(response.Makine_Marka_List);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{ display: "flex", alignItems: "center", gap: "10px", justifyContent: "space-between", width: "380px" }}>
      <Text style={{ fontSize: "14px" }}>Marka:</Text>
      <Controller
        name="MakineMarka"
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
              value: item.TB_MARKA_ID, // Use the ID as the value
              label: item.MRK_MARKA, // Display the name in the dropdown
            }))}
            onChange={(value) => {
              // Seçilen değerin ID'sini NedeniID alanına set et
              setValue("MakineMarkaID", value);
              field.onChange(value);
            }}
          />
        )}
      />
      <Controller
        name="MakineMarkaID"
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
