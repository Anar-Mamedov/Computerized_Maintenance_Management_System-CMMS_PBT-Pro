import React, { createRef, useCallback, useEffect, useState } from "react";
import { Input, Button, Modal, Typography, Table, Divider, Spin, Space, Select, message, Checkbox } from "antd";
import AxiosInstance from "../../../../../../api/http";
import styled from "styled-components";
import { PlusOutlined } from "@ant-design/icons";
import { Controller, useFormContext } from "react-hook-form";

const { Text, Link } = Typography;
const { TextArea } = Input;

const StyledTable = styled(Table)`
  .ant-pagination {
    /* Add your styles here */
    margin-right: 0px !important;
    background-color: #f5f5f5;
    padding: 10px;
    border-radius: 5px;
    /* ... other styles */
  }
`;

export default function Status() {
  const { control, watch, setValue } = useFormContext();
  const [inputValue, setInputValue] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isMakineDropdownOpen, setIsMakineDropdownOpen] = useState(false);
  const [items, setItems] = useState([]);
  const inputRef = createRef();
  const [name, setName] = useState("");
  const [selectedValue, setSelectedValue] = useState("");
  const [selectedLabel, setSelectedLabel] = useState("");
  const [isCheckboxChecked, setIsCheckboxChecked] = useState(false);

  // message
  const [messageApi, contextHolder] = message.useMessage();

  // message end

  const handlePlusClick = () => {
    setIsModalVisible(true);
    fetchItemsFromApi();
  };

  const handleModalOk = () => {
    setInputValue(selectedLabel);
    setIsModalVisible(false);
    setValue("statusID", selectedValue);
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
  };

  const onChange = (isChecked) => {
    setIsCheckboxChecked(isChecked);
    if (isChecked) {
      const selectedItem = items.find((item) => item.TB_KOD_ID === selectedValue);
      // Assuming that only one item can have KOD_ISM_DURUM_VARSAYILAN as true
      items.forEach((item) => (item.KOD_ISM_DURUM_VARSAYILAN = false));
      if (selectedItem) {
        selectedItem.KOD_ISM_DURUM_VARSAYILAN = true;
      }
    }
    // Note: Consider updating the server with the change in KOD_ISM_DURUM_VARSAYILAN status.
  };
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
      AxiosInstance.post(`AddIsEmriDurum?yeniDurum=${name}`)
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

  // add new status to selectbox end

  const fetchItemsFromApi = () => {
    setIsLoading(true);
    AxiosInstance.get("GetIsEmriDurum")
      .then((response) => {
        const isEmriData = response.isEmriDurumlari || [];
        setItems(isEmriData);

        const defaultItem = isEmriData.find((item) => item.KOD_ISM_DURUM_VARSAYILAN);
        if (defaultItem) {
          setSelectedValue(defaultItem.TB_KOD_ID);
          setSelectedLabel(defaultItem.KOD_TANIM);
          setIsCheckboxChecked(true);
          // Update the value in react-hook-form:
          setValue("status", defaultItem.TB_KOD_ID);
        } else {
          setSelectedValue("");
          setSelectedLabel("");
          setIsCheckboxChecked(false);
          // Clear the value in react-hook-form:
          setValue("status", "");
        }
      })
      .catch((error) => {
        console.error("Error fetching data from API:", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchItemsFromApi();
  }, []);

  useEffect(() => {
    const defaultItem = items.find((item) => item.KOD_ISM_DURUM_VARSAYILAN === true);
    if (defaultItem) {
      setInputValue(defaultItem.KOD_TANIM);
    }
  }, [items]);

  const handleCheckboxChange = (e) => {
    const isChecked = e.target.checked;

    // If no value is selected, avoid making the API call
    if (!selectedValue) {
      messageApi.open({
        type: "warning",
        content: "Please select a value first!",
      });
      return;
    }

    // Update local state for checkbox
    setIsCheckboxChecked(isChecked);

    // Construct the API endpoint with query parameters
    const endpoint = `IsEmriDurumVarsayilanYap?kodId=${selectedValue}&isVarsayilan=${isChecked}`;

    // Send the request to the API
    AxiosInstance.get(endpoint)
      .then((response) => {
        if (response.success) {
          messageApi.open({
            type: "success",
            content: response.success,
          });
        } else {
          throw new Error(response.error || "Unknown error");
        }
      })
      .catch((error) => {
        messageApi.open({
          type: "error",
          content: error.message || "Error updating data",
        });
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

  useEffect(() => {
    // Set the value of the field managed by TreeSelect when lastSelectedForTreeSelect changes
    setValue("statusInput", inputValue);
  }, [inputValue, setValue]);

  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
      {contextHolder}
      <div style={{ display: "flex", alignItems: "center", width: "425px", justifyContent: "space-between" }}>
        <Text style={{ fontSize: "14px" }}>Durum:</Text>
        <div style={{ display: "flex", alignItems: "center", width: "300px", gap: "5px" }}>
          <Controller name="statusInput" control={control} render={({ field }) => <Input {...field} disabled />} />
          <Controller
            name="statusID"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                type="text" // Set the type to "text" for name input
                style={{ display: "none" }}
              />
            )}
          />
          {/* <Input value={inputValue} onChange={(e) => setInputValue(e.target.value)} disabled /> */}
          <Button onClick={handlePlusClick}> + </Button>
          {/* <Button onClick={handleMinusClick}> - </Button> */}
          <Modal width="500px" title="Durum" open={isModalVisible} onOk={handleModalOk} onCancel={handleModalCancel}>
            <div style={{ display: "flex", gap: "10px", flexDirection: "column" }}>
              <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      value={selectedValue}
                      onChange={(value, option) => {
                        setSelectedValue(value);
                        setSelectedLabel(option.label); // Storing the selected label
                        field.onChange(value); // Passing the ID to the react hook form

                        // Set the checkbox status based on the selected option
                        setIsCheckboxChecked(option.kodIsmDurumVarsayilan);
                      }}
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
                        label: item.KOD_TANIM,
                        value: item.TB_KOD_ID,
                        kodIsmDurumVarsayilan: item.KOD_ISM_DURUM_VARSAYILAN,
                      }))}
                      open={isMakineDropdownOpen}
                      loading={isLoading} // Set the loading state
                    />
                  )}
                />
                <Checkbox checked={isCheckboxChecked} onChange={handleCheckboxChange}>
                  Varsayılan
                </Checkbox>
              </div>

              <TextArea rows={4} />
            </div>
          </Modal>
        </div>
      </div>
    </div>
  );
}
