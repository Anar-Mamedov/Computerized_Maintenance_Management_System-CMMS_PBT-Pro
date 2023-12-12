import React, { useState, createRef, useEffect, useRef } from "react";
import { useFormContext, Controller } from "react-hook-form";
import { Select, Typography, Divider, Spin, Button, Input, message, Space } from "antd";
import AxiosInstance from "../../../../../../../../../api/http";
import { PlusOutlined } from "@ant-design/icons";

const { Text, Link } = Typography;
const { Option } = Select;

export default function MaterialBrand() {
  const { control, setValue } = useFormContext();
  const [options, setOptions] = useState([]);
  const [optionsNew, setOptionsNew] = useState([]); // New state for the second select box
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [modelName, setModelName] = useState(""); // New state for the second input
  const [selectKey, setSelectKey] = useState(0);
  // Separate input references if needed
  const inputRef = useRef();
  const modelInputRef = useRef(); // New reference for the second input

  // message
  const [messageApi, contextHolder] = message.useMessage();

  // message end

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await AxiosInstance.get("GetMalzemeMarka");
      if (response && response.malzeme_marka_list) {
        setOptions(response.malzeme_marka_list);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data for the second select box
  const fetchDataNew = async () => {
    setLoading(true);
    try {
      // Adjust this API endpoint for the new select box
      const response = await AxiosInstance.get("GetMalzemeModel");
      if (response && response.malzeme_model_list) {
        setOptionsNew(response.malzeme_model_list); // Adjust this key according to your API response
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
      AxiosInstance.get(`AddMalzemeMarka?malzemeMarka=${name}`)
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

  const addModel = () => {
    if (modelName.trim() !== "") {
      if (optionsNew.some((option) => option.KOD_TANIM === modelName)) {
        messageApi.open({
          type: "warning",
          content: "Bu durum zaten var!",
        });
        return;
      }

      setLoading(true);
      AxiosInstance.get(`AddMalzemeModel?malzemeModel=${modelName}`)
        .then((response) => {
          if (response.success) {
            messageApi.open({
              type: "success",
              content: response.success,
            });
            setOptionsNew((prevOptions) => [...prevOptions, { TB_KOD_ID: response.id, KOD_TANIM: modelName }]);
            setSelectKey((prevKey) => prevKey + 1);
            setModelName(""); // Reset modelName instead of name
          } else {
            messageApi.open({
              type: "error",
              content: response.error,
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
    setValue("MaterialBrand", value);
    // Find the label from the options state
    const selectedOption = options.find((option) => option.TB_KOD_ID === value);
    const label = selectedOption ? selectedOption.KOD_TANIM : "";
    setValue("MaterialBrandLabel", label);
  };

  const handleSelectModel = (value) => {
    // Set the value as usual
    setValue("MaterialModel", value);
    // Find the label from the optionsNew state
    const selectedOption = optionsNew.find((option) => option.TB_KOD_ID === value);
    const label = selectedOption ? selectedOption.KOD_TANIM : "";
    setValue("MaterialModelLabel", label);
  };

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        gap: "10px",
        justifyContent: "space-between",
        width: "100%",
      }}>
      {contextHolder}
      <Text style={{ fontSize: "14px" }}>Material Marka:</Text>
      <div style={{ display: "flex", gap: "10px" }}>
        <Controller
          name="MaterialBrand"
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              key={selectKey}
              style={{ width: "250px" }}
              showSearch
              allowClear
              placeholder=""
              optionFilterProp="children"
              onChange={handleSelectChange}
              onDropdownVisibleChange={(open) => {
                if (open) {
                  fetchData(); // Fetch data when the dropdown is opened
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

        <Controller
          name="MaterialModel"
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              key={selectKey}
              style={{ width: "250px" }}
              showSearch
              allowClear
              placeholder=""
              optionFilterProp="children"
              onChange={handleSelectModel}
              onDropdownVisibleChange={(open) => {
                if (open) {
                  fetchDataNew();
                }
              }}
              dropdownRender={(menu) => (
                <Spin spinning={loading}>
                  {menu}
                  <Divider style={{ margin: "8px 0" }} />
                  <Space style={{ padding: "0 8px 4px" }}>
                    <Input
                      placeholder=""
                      ref={modelInputRef}
                      value={modelName}
                      onChange={(e) => setModelName(e.target.value)}
                    />
                    <Button type="text" icon={<PlusOutlined />} onClick={addModel}>
                      Ekle
                    </Button>
                  </Space>
                </Spin>
              )}
              options={optionsNew.map((item) => ({
                // Use optionsNew for the second select box
                value: item.TB_KOD_ID,
                label: item.KOD_TANIM,
              }))}
            />
          )}
        />
      </div>
    </div>
  );
}
