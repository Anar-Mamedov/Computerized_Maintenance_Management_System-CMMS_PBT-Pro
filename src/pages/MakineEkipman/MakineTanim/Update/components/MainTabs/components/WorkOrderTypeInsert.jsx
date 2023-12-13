import React, { useState } from "react";
import { Input, Button, Modal, Typography, Select, Tabs, Checkbox, ColorPicker, message } from "antd";
import { useForm, Controller, FormProvider, useFormContext } from "react-hook-form";
import { PlusOutlined } from "@ant-design/icons";
import AxiosInstance from "../../../../../../../api/http";

const { Text, Link } = Typography;

export default function WorkOrderTypeInsert() {
  const methods = useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();

  const onSubmit = (data) => {
    console.log(data);
  };

  const addItem = () => {
    if (name.trim() !== "") {
      if (items.includes(name)) {
        messageApi.open({
          type: "warning",
          content: "Bu durum zaten var!",
        });
        return;
      }

      setIsLoading(true);

      AxiosInstance.get(`AddIsEmriTipi?isEmriTipiKey=${name}`)
        .then((response) => {
          console.log("Response from adding item:", response);
          if (response.success) {
            messageApi.open({
              type: "success",
              content: response.success,
            });
            setItems([...items, name]);
            setName("");
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
          setIsLoading(false);
        });
    }
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    addItem();
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <div>
          <Button type="primary" onClick={showModal} style={{ display: "flex", alignItems: "center" }}>
            <PlusOutlined />
            Ekle
          </Button>
          <Modal title="İş Emri Tipi Ekle" open={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", margin: "20px 0 20px 0" }}>
              <Text>İş Emri Tipi Adı</Text>
              <Controller
                name="inputValue"
                control={methods.control}
                defaultValue={name}
                render={({ field }) => (
                  <Input
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      setName(e.target.value);
                    }}
                    style={{ width: "350px" }}
                  />
                )}
              />
            </div>
          </Modal>
        </div>
      </form>
    </FormProvider>
  );
}
