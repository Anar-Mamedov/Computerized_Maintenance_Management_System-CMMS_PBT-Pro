import React, { useCallback, useEffect, useState } from "react";
import { Input, Button, Modal, Typography, Table } from "antd";
import AxiosInstance from "../../../../../../../api/http";
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

export default function CalendarTable() {
  const { control, setValue } = useFormContext();
  const [inputValue, setInputValue] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const columns = [
    {
      title: "Yıl",
      dataIndex: "code",
      key: "code",
      width: 100,
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
      title: "Takvim Tanım",
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
      title: "Çalışma Günleri",
      dataIndex: "workdays",
      key: "workdays",
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
      title: "Açıklama",
      dataIndex: "description",
      key: "description",
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
  ];

  const fetch = useCallback(() => {
    setLoading(true);
    AxiosInstance.get(`GetTakvimList`)
      .then((response) => {
        const fetchedData = response.Takvim_Liste.map((item) => {
          return {
            key: item.TB_TAKVIM_ID,
            code: item.TKV_YIL,
            subject: item.TKV_TANIM,
            workdays: item.TKV_HAFTA_CALISMA_GUN,
            description: item.TKV_ACIKLAMA,
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
  };

  const handleModalOk = () => {
    const selectedData = data.find((item) => item.key === selectedRowKeys[0]);
    if (selectedData) {
      setInputValue(selectedData.subject);
      setValue("calendarTable", selectedData.subject); // Set the value in React Hook Form
      setValue("calendarTableSelectedId", selectedData.key); // Set the value in React Hook Form
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
    setValue("calendarTable", inputValue);
  }, [inputValue, setValue]);

  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
      <div style={{ display: "flex", alignItems: "center", width: "425px", justifyContent: "space-between" }}>
        <Text style={{ fontSize: "14px" }}>Takvim:</Text>
        <div style={{ display: "flex", alignItems: "center", width: "300px", gap: "5px" }}>
          <Controller
            name="calendarTable"
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
            name="calendarTableSelectedId"
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
            title="Takvim Tanımları"
            visible={isModalVisible}
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
