import React, { useCallback, useEffect, useState } from "react";
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

export default function MaterialCode({ materialCodeSelectedId, materialCodeCurrentValue, onSubmit }) {
  const { control, setValue } = useFormContext();
  const [inputValue, setInputValue] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const columns = [
    {
      title: "Malzeme Kodu",
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
      title: "Malzeme Tanımı",
      dataIndex: "subject",
      key: "subject",
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
      title: "Tip",
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
      title: "Birim",
      dataIndex: "description",
      key: "description",
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
      title: "Grup",
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
    {
      title: "Lokasyon",
      dataIndex: "sixthcolumn",
      key: "sixthcolumn",
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
      title: "Atölye",
      dataIndex: "workshop",
      key: "workshop",
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
      title: "Marka",
      dataIndex: "brand",
      key: "brand",
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
      title: "Model",
      dataIndex: "model",
      key: "model",
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
      title: "Malzeme Sınıfı",
      dataIndex: " materialClass",
      key: "materialClass",
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
      title: "Barkod No",
      dataIndex: "barcodeNo",
      key: "barcodeNo",
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
    AxiosInstance.get(`GetDepoStok?depoID=0&stoklu=false`)
      .then((response) => {
        const fetchedData = response.map((item) => {
          return {
            key: item.TB_STOK_ID,
            code: item.STK_KOD,
            subject: item.STK_TANIM,
            workdays: item.STK_TIP,
            description: item.STK_BIRIM,
            fifthcolumn: item.STK_GRUP,
            sixthcolumn: item.STK_LOKASYON,
            seventhcolumn: item.STK_ATOLYE,
            brand: item.STK_MARKA,
            model: item.STK_MODEL,
            materialClass: item.STK_MALZEME_SINIF,
            barcodeNo: item.STK_BARKOD_NO,
            stock: item.STK_STOKSUZ_MALZEME,
            unitPrice: item.STK_GIRIS_FIYAT_DEGERI,
            cost: item.STK_MALIYET,
            warehouseTable: item.STK_DEPO,
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
      setInputValue(selectedData.code);
      // setValue("materialCode", selectedData.key); // Set the value in React Hook Form
      onSubmit && onSubmit(selectedData);
    }
    setIsModalVisible(false);
  };

  useEffect(() => {
    setInputValue(materialCodeCurrentValue || "");
    setSelectedRowKeys(materialCodeSelectedId ? [materialCodeSelectedId] : []);
  }, [materialCodeCurrentValue, materialCodeSelectedId]);

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
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          width: "100%",
          justifyContent: "space-between",
        }}>
        <Text style={{ fontSize: "14px" }}>Malzeme Kodu</Text>
        <div style={{ display: "flex", alignItems: "center", width: "290px", gap: "5px" }}>
          <Controller
            name="materialCode"
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
            title="Malzeme Tanımları"
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
