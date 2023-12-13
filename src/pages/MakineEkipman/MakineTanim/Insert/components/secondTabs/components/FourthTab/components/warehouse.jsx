import React, { useCallback, useState } from "react";
import { Input, Button, Modal, Typography, Table } from "antd";
import AxiosInstance from "../../../../../../../../../api/http";
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
  &.custom-table .ant-table-thead > tr > th {
    height: 10px; // Adjust this value to your desired height
    line-height: 10px; // Adjust this value to vertically center the text
  }
`;

export default function Warehouse() {
  const { control, setValue } = useFormContext();
  const [inputValue, setInputValue] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const columns = [
    {
      title: "Depo Kodu",
      dataIndex: "code",
      key: "code",
      width: 200,
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
      title: "Depo Tanımı",
      dataIndex: "subject",
      key: "subject",
      width: 300,
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
      title: "Sorumlu Personel",
      dataIndex: "type",
      key: "type",
      width: 200,
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
      title: "Atölye",
      dataIndex: "startDate",
      key: "startDate",
      width: 200,
      render: (text) => {
        if (text === "01-01-0001") {
          return null; // or return ""; to return an empty string
        }
        return (
          <div
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}>
            {text}
          </div>
        );
      },
    },
    {
      title: "Lokasyon",
      dataIndex: "endDate",
      key: "endDate",
      width: 200,
      render: (text) => {
        if (text === "01-01-0001") {
          return null; // or return ""; to return an empty string
        }
        return (
          <div
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}>
            {text}
          </div>
        );
      },
    },
  ];

  const fetch = useCallback(() => {
    setLoading(true);
    AxiosInstance.get(`GetDepo?ID=24&DEP_MODUL_NO=1`)
      .then((response) => {
        const fetchedData = response.map((item) => {
          return {
            key: item.TB_DEPO_ID,
            code: item.DEP_KOD,
            subject: item.DEP_TANIM,
            type: item.SORUMLU_PERSONEL,
            startDate: item.ATOLYE_TANIM,
            endDate: item.LOKASYON_TANIM,
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
      setValue("warehouse", selectedData.key); // Set the value in React Hook Form
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

  // tabloyu sağa sola kaydıra bilme özelliği eklemek için
  const totalTableWidth = columns.reduce((acc, column) => acc + (parseInt(column.width, 10) || 0), 0);
  // tabloyu sağa sola kaydıra bilme özelliği eklemek için son

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        marginBottom: "10px",
      }}>
      <div style={{ display: "flex", alignItems: "center", width: "350px", justifyContent: "space-between" }}>
        <Text style={{ fontSize: "14px" }}>Depo:</Text>
        <div style={{ display: "flex", alignItems: "center", width: "300px", gap: "5px" }}>
          <Controller
            name="warehouse"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <Input
                {...field}
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value);
                  field.onChange(e.target.value);
                }}
                disabled
              />
            )}
          />
          <Button onClick={handlePlusClick}> + </Button>
          <Button onClick={handleMinusClick}> - </Button>
          <Modal
            centered
            width="1200px"
            title="Depo Tanımları"
            open={isModalVisible}
            onOk={handleModalOk}
            onCancel={handleModalCancel}>
            <StyledTable
              className="custom-table"
              rowSelection={rowSelection}
              columns={columns}
              dataSource={data}
              loading={loading}
              scroll={{ x: totalTableWidth, y: "500px" }}
            />
          </Modal>
        </div>
      </div>
    </div>
  );
}
