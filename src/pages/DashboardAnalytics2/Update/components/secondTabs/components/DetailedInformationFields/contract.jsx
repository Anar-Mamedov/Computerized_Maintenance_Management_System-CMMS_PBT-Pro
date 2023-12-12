import React, { useCallback, useEffect, useState } from "react";
import { Input, Button, Modal, Typography, Table } from "antd";
import AxiosInstance from "../../../../../../../api/http";
import styled from "styled-components";
import { useFormContext, Controller } from "react-hook-form";
import dayjs from "dayjs";

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
    line-height: 2px; // Adjust this value to vertically center the text
  }
`;

export default function Contract() {
  const { control, setValue, watch } = useFormContext();
  const [inputValue, setInputValue] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const companyID = watch("company");

  const columns = [
    {
      title: "Sözleşme No",
      dataIndex: "code",
      key: "code",
      width: "150px",
      render: (text) => (
        <div
          style={{
            lineHeight: "20px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}>
          {text}
        </div>
      ),
    },
    {
      title: "Sözleşme Tanım",
      dataIndex: "subject",
      key: "subject",
      width: "350px",

      render: (text) => (
        <div
          style={{
            lineHeight: "20px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}>
          {text}
        </div>
      ),
    },
    {
      title: "Başlama Tarihi",
      dataIndex: "workdays",
      key: "workdays",
      width: "150px",
      render: (text) => (
        <div
          style={{
            lineHeight: "20px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}>
          {text}
        </div>
      ),
    },
    {
      title: "Kalan Gün",
      dataIndex: "description",
      key: "description",
      width: "150px",

      render: (text) => (
        <div
          style={{
            lineHeight: "20px",
            lineHeight: "20px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}>
          {text}
        </div>
      ),
    },
    {
      title: "Bitiş Tarihi",
      dataIndex: "fifthcolumn",
      key: "fifthcolumn",
      width: "150px",
      render: (text) => (
        <div
          style={{
            lineHeight: "20px",
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
    // Use companyID if it exists, otherwise default to 0
    const companyIdForRequest = companyID || 0;
    AxiosInstance.get(`GetSozlesmeler?firmaId=${companyIdForRequest}`)
      .then((response) => {
        const fetchedData = response.Sozlesme_Liste.map((item) => {
          return {
            key: item.TB_CARI_SOZLESME_ID,
            code: item.CAS_SOZLESME_NO,
            subject: item.CAS_TANIM,
            workdays: dayjs(item.CAS_BASLANGIC_TARIH).format("DD-MM-YYYY"),
            description: item.CAS_KALAN_GUN,
            fifthcolumn: dayjs(item.CAS_BITIS_TARIH).format("DD-MM-YYYY"),
          };
        });
        setData(fetchedData);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [companyID]);

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
      setValue("contract", selectedData.subject); // Set the value in React Hook Form
      setValue("contractId", selectedData.key); // Set the value in React Hook Form
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

  useEffect(() => {
    setValue("contract", inputValue);
  }, [inputValue, setValue]);

  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
      <div style={{ display: "flex", alignItems: "center", width: "500px", justifyContent: "space-between" }}>
        <Text style={{ fontSize: "14px" }}>Sözleşme:</Text>
        <div style={{ display: "flex", alignItems: "center", width: "350px", gap: "5px" }}>
          <Controller
            name="contract"
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
            name="contractId"
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
            title="Sözleşmeler"
            visible={isModalVisible}
            onOk={handleModalOk}
            onCancel={handleModalCancel}>
            <StyledTable
              className="custom-table"
              rowSelection={rowSelection}
              columns={columns}
              dataSource={data}
              loading={loading}
              scroll={{
                x: totalTableWidth,
                y: "500px",
              }}
            />
          </Modal>
        </div>
      </div>
    </div>
  );
}
