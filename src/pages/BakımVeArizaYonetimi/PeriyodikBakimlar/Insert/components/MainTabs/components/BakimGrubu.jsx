import { useState, createRef } from "react";
import { useFormContext, Controller } from "react-hook-form";
import { Select, Typography, Divider, Spin, Button, Input, message, Space } from "antd";
import AxiosInstance from "../../../../../../../api/http";
import { PlusOutlined } from "@ant-design/icons";
import styled from "styled-components";

const { Text } = Typography;

const StyledSelect = styled(Select)`
  @media (min-width: 600px) {
    width: 300px;
  }
  @media (max-width: 600px) {
    width: 300px;
  }
`;

const StyledDiv = styled.div`
  @media (min-width: 600px) {
    align-items: center;
  }
  @media (max-width: 600px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

export default function BakimGrubu() {
  const { control, setValue } = useFormContext();
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const inputRef = createRef();
  const [name, setName] = useState("");
  const [selectKey, setSelectKey] = useState(0);
  const [messageApi, contextHolder] = message.useMessage();

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await AxiosInstance.get("KodList?grup=32760");
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
      AxiosInstance.post(`AddKodList?entity=${name}&grup=32760`)
        .then((response) => {
          if (response.status_code === 201) {
            const newId = response.id;

            messageApi.open({
              type: "success",
              content: "Ekleme Başarılı",
            });
            setOptions((prevOptions) => [...prevOptions, { TB_KOD_ID: newId, KOD_TANIM: name }]);
            setSelectKey((prevKey) => prevKey + 1);
            setName("");
          } else {
            messageApi.open({
              type: "error",
              content: "An error occurred", 
            });
          }
        })
        .catch((error) => {
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

  return (
    <StyledDiv
      style={{
        display: "flex",
        gap: "10px",
        justifyContent: "space-between",
        width: "100%",
        flexWrap: "wrap",
        rowGap: "0px",
      }}>
      {contextHolder}
      <Text style={{ fontSize: "14px", minWidth: "40px" }}>Bakım Grubu:</Text>
      <Controller
        name="bakimGrubu"
        control={control}
        render={({ field }) => (
          <StyledSelect
            {...field}
            key={selectKey}
            showSearch
            allowClear
            placeholder="Seçim Yapınız"
            optionFilterProp="children"
            filterOption={(input, option) =>
              option.label ? option.label.toLowerCase().includes(input.toLowerCase()) : false
            }
            onDropdownVisibleChange={(open) => {
              if (open) {
                fetchData();
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
              value: item.TB_KOD_ID,
              label: item.KOD_TANIM,
            }))}
            onChange={(value) => {
              setValue("bakimGrubuID", value);
              field.onChange(value);
            }}
          />
        )}
      />
      <Controller
        name="bakimGrubuID"
        control={control}
        render={({ field }) => (
          <Input
            {...field}
            type="text"
            style={{ display: "none" }}
          />
        )}
      />
    </StyledDiv>
  );
}
