import React, { useState, createRef, useEffect } from "react";
import { useFormContext, Controller } from "react-hook-form";
import { Select, Typography, Divider, Spin, Button, Input, message, Space } from "antd";
import AxiosInstance from "../../../../../../../../../api/http";
import { PlusOutlined } from "@ant-design/icons";

const { Text, Link } = Typography;
const { Option } = Select;

export default function KiraSuresi() {
  const { control, setValue, watch } = useFormContext();
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const inputRef = createRef();
  const [name, setName] = useState("");
  const [selectKey, setSelectKey] = useState(0);

  // message
  const [messageApi, contextHolder] = message.useMessage();

  // message end

  const makineKiralik = watch("makineKiralik");

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await AxiosInstance.get("KodList?grup=32001");
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
    setName(e.target.value);
  };

  // add new status to selectbox

  const addItem = () => {
    if (name.trim() !== "") {
      if (options.some((option) => option.KOD_TANIM === name)) {
        messageApi.open({
          type: "warning",
          content: "Bu durum zaten var!",
        });
        return;
      }

      setLoading(true);
      AxiosInstance.post(`AddKodList?entity=${name}&grup=32001`)
        .then((response) => {
          if (response.status_code === 201) {
            // Assuming 'id' is directly in the response
            const newId = response.id; // Adjust this line based on your actual response structure

            messageApi.open({
              type: "success",
              content: "Ekleme Başarılı",
            });
            setOptions((prevOptions) => [...prevOptions, { TB_KOD_ID: newId, KOD_TANIM: name }]);
            setSelectKey((prevKey) => prevKey + 1);
            setName("");
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
    <div style={{ display: "flex", alignItems: "center", gap: "10px", justifyContent: "space-between", width: "100%" }}>
      {contextHolder}
      <Text style={{ fontSize: "14px" }}>Kira Süresi:</Text>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
        <Controller
          name="MakineKiraSuresi"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              disabled={!makineKiralik}
              type="number" // Set the type to "text" for name input
              style={{ width: "90px" }}
            />
          )}
        />
        <Controller
          name="MakineKiraSuresiBirim"
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              disabled={!makineKiralik}
              style={{ width: "205px" }}
              showSearch
              allowClear
              placeholder="Seçim Yapınız"
              optionFilterProp="children"
              filterOption={(input, option) => (option?.label ?? "").includes(input)}
              filterSort={(optionA, optionB) =>
                (optionA?.label ?? "").toLowerCase().localeCompare((optionB?.label ?? "").toLowerCase())
              }
              options={[
                {
                  value: "1",
                  label: "Yıl",
                },
                {
                  value: "2",
                  label: "Ay",
                },
                {
                  value: "3",
                  label: "Hafta",
                },
                {
                  value: "4",
                  label: "Gün",
                },
                {
                  value: "5",
                  label: "Saat",
                },
                {
                  value: "6",
                  label: "Km",
                },
                {
                  value: "7",
                  label: "Adet",
                },
              ]}
              onChange={(value, label) => {
                // Seçilen değerin ID'sini NedeniID alanına set et
                setValue("MakineKiraSuresiBirimID", value);
                field.onChange(label);
              }}
            />
          )}
        />
        <Controller
          name="MakineKiraSuresiBirimID"
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
    </div>
  );
}
