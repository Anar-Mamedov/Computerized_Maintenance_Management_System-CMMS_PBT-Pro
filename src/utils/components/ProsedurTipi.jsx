import React, { useState, createRef } from "react";
import { useFormContext, Controller } from "react-hook-form";
import { Select, Typography, Divider, Spin, Button, Input, message, Space } from "antd";
import AxiosInstance from "../../api/http";
import { PlusOutlined } from "@ant-design/icons";

const { Text, Link } = Typography;
const { Option } = Select;

export default function ProsedurTipi({ disabled = false, fieldRequirements = {}, fieldName = "prosedurTipi", fieldIdName = "prosedurTipiID", selectStyle = {} }) {
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
      const response = await AxiosInstance.get(`GetIsTipi`);
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

  // add new status to selectbox

  const addItem = () => {
    if (newOptionName.trim() !== "") {
      if (options.some((option) => option.KOD_TANIM === newOptionName)) {
        messageApi.open({
          type: "warning",
          content: "Bu durum zaten var!",
        });
        return;
      }

      setLoading(true);
      AxiosInstance.post(`AddIsTip?entity=${newOptionName}&isTanimId`)
        .then((response) => {
          if (response.status_code === 201) {
            // Assuming 'id' is directly in the response
            const newId = response.id; // Adjust this line based on your actual response structure

            messageApi.open({
              type: "success",
              content: "Ekleme Başarılı",
            });
            setOptions((prevOptions) => [...prevOptions, { TB_KOD_ID: newId, KOD_TANIM: newOptionName }]);
            setSelectKey((prevKey) => prevKey + 1);
            setNewOptionName("");
          } else {
            // Error handling
            messageApi.open({
              type: "error",
              content: "An error occurred", // Adjust the error message as needed
            });
          }
        })
        .catch((error) => {
          // Handle Axios errors
          console.error("Error adding item to API:", error);
          messageApi.open({
            type: "error",
            content: "An error occurred while adding the item.",
          });
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  // add new status to selectbox end
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
              dropdownRender={(menu) => (
                <Spin spinning={loading}>
                  {menu}
                  {/* <Divider
                    style={{
                      margin: "8px 0",
                    }}
                  />
                  <Space
                    style={{
                      padding: "0 8px 4px",
                    }}
                  >
                    <Input placeholder="" ref={inputRef} value={newOptionName} onChange={onNameChange} />
                    <Button type="text" icon={<PlusOutlined />} onClick={addItem}>
                      Ekle
                    </Button>
                  </Space> */}
                </Spin>
              )}
              options={options.map((item) => ({
                value: item.TB_KOD_ID, // Use the ID as the value
                label: item.KOD_TANIM, // Display the name in the dropdown
              }))}
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
