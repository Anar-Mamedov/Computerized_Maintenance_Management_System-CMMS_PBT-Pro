import React, { useState, createRef } from "react";
import { useFormContext, Controller } from "react-hook-form";
import { Select, Typography, Divider, Spin, Button, Input, message, Space } from "antd";
import AxiosInstance from "../../api/http";
import { PlusOutlined } from "@ant-design/icons";

const { Text, Link } = Typography;
const { Option } = Select;

export default function AtolyeSelectbox({ disabled = false, fieldRequirements = {}, fieldName = "aloyle", fieldIdName = "atolyeID", selectStyle = {} }) {
  const {
    control,
    setValue,
    formState: { errors },
  } = useFormContext();
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const inputRef = createRef();
  const [newOptionName, setNewOptionName] = useState("");
  const [selectKey, setSelectKey] = useState(0);

  // message
  const [messageApi, contextHolder] = message.useMessage();

  // message end

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await AxiosInstance.get(`AtolyeList`);
      if (response && response) {
        setOptions(response);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const onNameChange = (e) => {
    setNewOptionName(e.target.value);
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "10px", justifyContent: "space-between", ...selectStyle }}>
      {contextHolder}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "5px", flexDirection: "column", ...selectStyle }}>
        <Controller
          name={fieldName}
          control={control}
          rules={{ required: fieldRequirements?.[fieldName] ? "Alan Boş Bırakılamaz!" : false }}
          render={({ field }) => (
            <Select
              {...field}
              status={errors?.[fieldName] ? "error" : ""}
              disabled={disabled}
              key={selectKey}
              style={{ ...selectStyle }}
              showSearch
              allowClear
              placeholder="Seçim Yapınız"
              optionFilterProp="children"
              filterOption={(input, option) => (option.label ? option.label.toLowerCase().includes(input.toLowerCase()) : false)}
              onDropdownVisibleChange={(open) => {
                if (open) {
                  fetchData(); // Fetch data when the dropdown is opened
                }
              }}
              dropdownRender={(menu) => <Spin spinning={loading}>{menu}</Spin>}
              options={options
                .filter((item) => item?.TB_ATOLYE_ID !== undefined && item?.TB_ATOLYE_ID !== null)
                .map((item) => {
                  const name = item?.ATL_TANIM?.trim();
                  const code = item?.ATL_KOD?.trim();
                  const label = [code, name].filter(Boolean).join(" - ") || name || code || "";
                  return {
                    value: item.TB_ATOLYE_ID,
                    label,
                  };
                })}
              onChange={(value) => {
                // Seçilen değerin ID'sini NedeniID alanına set et
                // `null` veya `undefined` değerlerini ele al
                setValue(fieldName, value ?? null);
                setValue(fieldIdName, value ?? null);
                field.onChange(value ?? null);
              }}
              value={field.value ?? null} // Eğer `field.value` `undefined` ise, `null` kullanarak `Select` bileşenine geçir
            />
          )}
        />
        <Controller
          name={fieldIdName}
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              type="text" // Set the type to "text" for name input
              style={{ display: "none" }}
            />
          )}
        />
        {errors?.[fieldName] && <div style={{ color: "red", marginTop: "5px" }}>{errors[fieldName].message}</div>}
      </div>
    </div>
  );
}
