import React, { useState, createRef, useEffect } from "react";
import { useFormContext, Controller } from "react-hook-form";
import { Select, Typography, Divider, Spin, Button, Input, message, Space } from "antd";
import AxiosInstance from "../../../../../../../../../api/http";
import { PlusOutlined } from "@ant-design/icons";

const { Text, Link } = Typography;
const { Option } = Select;

export default function Unit() {
  const { control } = useFormContext();
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectKey, setSelectKey] = useState(0);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await AxiosInstance.get("GetBirimler");
      if (response && response.birimler) {
        setOptions(response.birimler);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
      <Text style={{ fontSize: "14px", whiteSpace: "nowrap" }}>Birim:</Text>
      <Controller
        name="olcumUnit"
        control={control}
        render={({ field }) => (
          <Select
            {...field}
            key={selectKey}
            style={{ width: "380px" }}
            showSearch
            allowClear
            placeholder="Seçiniz"
            optionFilterProp="children"
            onDropdownVisibleChange={(open) => {
              if (open) {
                fetchData(); // Fetch data when the dropdown is opened
              }
            }}
            onChange={(value, option) => {
              if (option) {
                // If there is an option selected, update the form context with the selected option's label
                field.onChange(option.label);
              } else {
                // If the selection is cleared, update the form context with undefined or an empty string
                field.onChange(undefined);
              }
            }}
            dropdownRender={(menu) => <Spin spinning={loading}>{menu}</Spin>}
            options={options.map((item) => ({
              value: item.TB_KOD_ID, // Use the ID as the value
              label: item.KOD_TANIM, // Display the name in the dropdown
            }))}
          />
        )}
      />
    </div>
  );
}
