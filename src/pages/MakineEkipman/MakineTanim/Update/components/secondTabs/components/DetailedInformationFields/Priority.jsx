import React, { useCallback, useEffect, useState } from "react";
import { Input, Button, Modal, Typography, Table } from "antd";
import AxiosInstance from "../../../../../../../../api/http";
import styled from "styled-components";
import { useFormContext, Controller } from "react-hook-form";

const { Text } = Typography;

const StyledTable = styled(Table)`
  .ant-pagination {
    margin-right: 0px !important;
    background-color: #f5f5f5;
    padding: 10px;
    border-radius: 5px;
  }
`;

export default function Priority() {
  const { control, setValue } = useFormContext();
  const [inputValue, setInputValue] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const columns = [
    {
      title: "Öncelik Kodu",
      dataIndex: "code",
      key: "code",
      render: (text) => (
        <div
          style={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}>
          {text}
        </div>
      ),
    },
    {
      title: "Tanım",
      dataIndex: "subject",
      key: "subject",
      render: (text) => (
        <div
          style={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}>
          {text}
        </div>
      ),
    },
    {
      title: "Varsayılan",
      dataIndex: "status",
      key: "status",
      render: (status) => <input type="checkbox" checked={status} disabled />,
    },
  ];

  const fetch = useCallback(() => {
    setLoading(true);
    AxiosInstance.get(`OncelikList`)
      .then((response) => {
        const fetchedData = response.map((item) => {
          return {
            key: item.TB_SERVIS_ONCELIK_ID,
            code: item.SOC_KOD,
            subject: item.SOC_TANIM,
            status: item.SOC_VARSAYILAN,
          };
        });
        setData(fetchedData);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const handlePlusClick = () => {
    setIsModalVisible(true);
    fetch();
  };

  const handleMinusClick = () => {
    setInputValue("");
    setSelectedRowKeys([]);
    setValue("prioritySelectedId", "");
    setValue("priority", "");
  };

  const handleModalOk = () => {
    const selectedData = data.find((item) => item.key === selectedRowKeys[0]);
    if (selectedData) {
      setInputValue(selectedData.code);
      setValue("priority", selectedData.code); // Set the value in React Hook Form
      setValue("prioritySelectedId", selectedData.key); // Set the value in React Hook Form
    }
    setIsModalVisible(false);
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
  };

  const rowSelection = {
    type: "checkbox",
    selectedRowKeys,
    onChange: (selectedKeys) => {
      setSelectedRowKeys([selectedKeys[selectedKeys.length - 1]]);
    },
  };

  useEffect(() => {
    setValue("priority", inputValue);
  }, [inputValue, setValue]);

  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
      <div style={{ display: "flex", alignItems: "center", width: "425px", justifyContent: "space-between" }}>
        <Text style={{ fontSize: "14px" }}>Öncelik:</Text>
        <div style={{ display: "flex", alignItems: "center", width: "300px", gap: "5px" }}>
          <Controller
            name="priority"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <Input
                {...field}
                // value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value);
                  field.onChange(e.target.value);
                }}
                disabled
              />
            )}
          />
          <Controller
            name="prioritySelectedId"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                type="text" // Set the type to "text" for name input
                style={{ display: "none" }}
              />
            )}
          />
          <Button onClick={handlePlusClick}> + </Button>
          <Button onClick={handleMinusClick}> - </Button>
          <Modal
            centered
            width="1200px"
            title="Servis Öncelik Tanımları"
            open={isModalVisible}
            onOk={handleModalOk}
            onCancel={handleModalCancel}>
            <StyledTable
              rowSelection={rowSelection}
              columns={columns}
              dataSource={data}
              loading={loading}
              scroll={{ x: "auto", y: "500px" }}
            />
          </Modal>
        </div>
      </div>
    </div>
  );
}
