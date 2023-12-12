import { PlusOutlined } from "@ant-design/icons";
import { Button, Col, Divider, Input, Select, Space, Spin, Typography, message } from "antd";
import React, { createRef, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import AxiosInstance from "../../../../../../api/http";

const { Text } = Typography;

const { Option } = Select;

export default function MachineStatus() {
  const [isLoading, setIsLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [name, setName] = useState("");
  const inputRef = createRef();
  const [isMakineDropdownOpen, setIsMakineDropdownOpen] = useState(false);

  const { control, watch } = useFormContext();

  // message
  const [messageApi, contextHolder] = message.useMessage();

  // message end

  //selectbox
  const onChangeSelect = (value) => {};
  const onSearch = (value) => {};
  const [options, setOptions] = useState([]);
  //selectbox end

  // add new status to selectbox

  const addItem = () => {
    if (name.trim() !== "") {
      // Check if the item already exists
      if (items.includes(name)) {
        // Show a warning message to the user
        messageApi.open({
          type: "warning",
          content: "Bu durum zaten var!",
        });
        return; // Exit the function early
      }

      setIsLoading(true);
      // Send POST request to the API
      AxiosInstance.post(`AddMakineDurum?yeniDurum=${name}`)
        .then((response) => {
          if (response.success) {
            // Show success message
            messageApi.open({
              type: "success",
              content: response.success, // Using the success message from API response
            });
            // Update local items state
            setItems([...items, name]);
            // Clear the input field
            setName("");
            // Clear the input field in the dropdown
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
          setIsLoading(false);
        });
    }
  };

  // add new status to selectbox end

  const fetchItemsFromApi = () => {
    setIsLoading(true);
    AxiosInstance.get("GetMakineDurum")
      .then((response) => {
        const data = response.MAKINE_DURUM || [];
        setItems(data); // Store the entire array without any modifications
      })
      .catch((error) => {
        console.error("Error fetching data from API:", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const onNameChange = (e) => {
    setName(e.target.value);
  };

  const handleDropdownVisibleChange = (open) => {
    if (open) {
      // Fetch data from the API only when the dropdown is opened and the items are empty
      fetchItemsFromApi();
    }
    setIsMakineDropdownOpen(open);
  };
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <Col style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "415px" }}>
        {contextHolder}
        <Text style={{ fontSize: "14px" }}>Makine Durumu:</Text>
        <Controller
          name="machine_status"
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              showSearch
              allowClear
              style={{
                width: 300,
              }}
              placeholder=""
              onDropdownVisibleChange={handleDropdownVisibleChange}
              dropdownRender={(menu) => (
                <Spin spinning={isLoading}>
                  <>
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
                  </>
                </Spin>
              )}
              options={items.map((item) => ({
                label: item.KOD_TANIM, // Display this in the dropdown
                value: item.TB_KOD_ID, // This will be the value sent to React Hook Form
              }))}
              open={isMakineDropdownOpen}
              loading={isLoading}
            />
          )}
        />
      </Col>
      <Col style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "350px" }}>
        <Text style={{ fontSize: "14px" }}>Sayaç Değeri:</Text>
        <Controller
          name="counter_value"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              type="number" // Set the type to "text" for name input
              style={{ width: "200px" }}
              placeholder="Değer Gir"
            />
          )}
        />
      </Col>
    </div>
  );
}
