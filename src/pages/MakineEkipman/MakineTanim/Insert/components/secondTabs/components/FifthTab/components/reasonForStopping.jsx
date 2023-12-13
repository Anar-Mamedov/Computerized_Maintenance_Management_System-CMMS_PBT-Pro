import React, { useState, createRef, useEffect } from "react";
import { useFormContext, Controller } from "react-hook-form";
import { Select, Typography, Divider, Spin, Button, Input, message, Space } from "antd";
import AxiosInstance from "../../../../../../../../../api/http";
import { PlusOutlined } from "@ant-design/icons";

const { Text, Link } = Typography;
const { Option } = Select;

export default function ReasonForStopping() {
  const { control } = useFormContext();
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const inputRef = createRef();
  const [name, setName] = useState("");
  const [selectKey, setSelectKey] = useState(0);

  // message
  const [messageApi, contextHolder] = message.useMessage();

  // message end

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await AxiosInstance.get("GetDurusNedenleri");
      if (response && response.durus_nedenleri) {
        setOptions(response.durus_nedenleri);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const onNameChange = (e) => {
    setName(e.target.value);
  };

  // add new status to selectbox

  const addItem = () => {
    if (name.trim() !== "") {
      // Check if the item already exists
      if (options.some((option) => option.KOD_TANIM === name)) {
        // Show a warning message to the user
        messageApi.open({
          type: "warning",
          content: "Bu durum zaten var!",
        });
        return; // Exit the function early
      }

      setLoading(true);
      // Send POST request to the API
      AxiosInstance.get(`AddIsEmriNedeni?isNedeni=${name}`)
        .then((response) => {
          if (response.success) {
            // Show success message
            messageApi.open({
              type: "success",
              content: response.success, // Using the success message from API response
            });
            // Update local items state
            setOptions((prevOptions) => [...prevOptions, { TB_KOD_ID: response.id, KOD_TANIM: name }]);
            // Assuming the API returns the ID of the newly added item as response.id
            setSelectKey((prevKey) => prevKey + 1);
            // Clear the input field
            setName("");
          } else {
            // If the API responds without an error but also without a success message
            messageApi.open({
              type: "error",
              content: response.error, // Using the error message from API response
            });
          }
        })
        .catch((error) => {
          console.error("Error adding item to API:", error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  // add new status to selectbox end

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "33px", justifyContent: "space-between", width: "100%" }}>
      {contextHolder}
      <Text style={{ fontSize: "14px", whiteSpace: "nowrap" }}>Duruş Nedeni:</Text>
      <Controller
        name="DurusNedeni"
        control={control}
        render={({ field }) => (
          <Select
            {...field}
            key={selectKey}
            style={{ width: "100%" }}
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
            dropdownRender={(menu) => (
              <Spin spinning={loading}>
                {menu}
                <Divider
                  style={{
                    margin: "8px 0",
                  }}
                />
                <Space
                  style={{
                    padding: "0 8px 4px",
                    width: "100%",
                  }}>
                  <Input placeholder="" ref={inputRef} value={name} onChange={onNameChange} />
                  <Button type="text" icon={<PlusOutlined />} onClick={addItem}>
                    Ekle
                  </Button>
                </Space>
              </Spin>
            )}
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
