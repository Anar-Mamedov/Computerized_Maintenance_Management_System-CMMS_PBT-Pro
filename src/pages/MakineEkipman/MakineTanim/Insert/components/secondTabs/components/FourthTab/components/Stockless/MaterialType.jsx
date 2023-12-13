import React, { useState, createRef, useEffect } from "react";
import { useFormContext, Controller } from "react-hook-form";
import { Select, Typography, Divider, Spin, Button, Input, message, Space } from "antd";
import AxiosInstance from "../../../../../../../../../../api/http";
import { PlusOutlined } from "@ant-design/icons";

const { Text, Link } = Typography;
const { Option } = Select;

export default function MaterialType() {
  const { control, setValue } = useFormContext();
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
      const response = await AxiosInstance.get("GetMalzemeTip");
      if (response && response.malzeme_tip_list) {
        setOptions(response.malzeme_tip_list);
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
      AxiosInstance.get(`AddMalzemeTip?malzemeTip=${name}`)
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

  const handleSelectChange = (value) => {
    // Set the value as usual
    setValue("materialType", value);
    // Find the label from the options state
    const selectedOption = options.find((option) => option.TB_KOD_ID === value);
    const label = selectedOption ? selectedOption.KOD_TANIM : "";
    setValue("materialTypeLabel", label);
  };

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        gap: "10px",
        justifyContent: "space-between",
        maxWidth: "490px",
      }}>
      {contextHolder}
      <Text style={{ fontSize: "14px" }}>Material Tipi:</Text>
      <Controller
        name="materialType"
        control={control}
        render={({ field }) => (
          <Select
            {...field}
            key={selectKey}
            style={{ width: "290px" }}
            showSearch
            allowClear
            placeholder=""
            optionFilterProp="children"
            onChange={handleSelectChange}
            onDropdownVisibleChange={(open) => {
              if (open) fetchData();
            }}
            dropdownRender={(menu) => (
              <Spin spinning={loading}>
                {menu}
                <Divider style={{ margin: "8px 0" }} />
                <Space style={{ padding: "0 8px 4px" }}>
                  <Input placeholder="" ref={inputRef} value={name} onChange={onNameChange} />
                  <Button type="text" icon={<PlusOutlined />} onClick={addItem}>
                    Ekle
                  </Button>
                </Space>
              </Spin>
            )}
            options={options.map((item) => ({
              value: item.TB_KOD_ID,
              label: item.KOD_TANIM,
            }))}
          />
        )}
      />
    </div>
  );
}
