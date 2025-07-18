import React, { useCallback, useEffect, useState } from "react";
import { Button, Modal, Table, Typography, Input } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import AxiosInstance from "../../../../../../../../../../api/http";
import dayjs from "dayjs";
import DepoTablo from "./DepoTablo";
import { Controller, useFormContext } from "react-hook-form";
import styled from "styled-components";

const { Text, Link } = Typography;
const { TextArea } = Input;

const StyledDivBottomLine = styled.div`
  @media (min-width: 600px) {
    align-items: center !important;
  }
  @media (max-width: 600px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

export default function MalzemeTablo({ workshopSelectedId, onSubmit }) {
  const {
    control,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useFormContext();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleDepoMinusClick = () => {
    setValue("depo", "");
    setValue("depoID", "");
  };

  const columns = [
    {
      title: "Malzeme Kodu",
      dataIndex: "code",
      key: "code",
      width: "150px",
      ellipsis: true,
    },
    {
      title: "Malzeme Tanımı",
      dataIndex: "subject",
      key: "subject",
      width: "150px",
      ellipsis: true,
    },
    {
      title: "Tip",
      dataIndex: "workdays",
      key: "workdays",
      width: "150px",
      ellipsis: true,
    },
    {
      title: "Birim",
      dataIndex: "description",
      key: "description",
      width: "150px",
      ellipsis: true,
    },

    {
      title: "Grup",
      dataIndex: "fifthcolumn",
      key: "fifthcolumn",
      width: "150px",
      ellipsis: true,
    },
    {
      title: "Lokasyon",
      dataIndex: "sixthcolumn",
      key: "sixthcolumn",
      width: "150px",
      ellipsis: true,
    },
    {
      title: "Atölye",
      dataIndex: "workshop",
      key: "workshop",
      width: "150px",
      ellipsis: true,
    },
    {
      title: "Marka",
      dataIndex: "brand",
      key: "brand",
      width: "150px",
      ellipsis: true,
    },
    {
      title: "Model",
      dataIndex: "model",
      key: "model",
      width: "150px",
      ellipsis: true,
    },
    {
      title: "Malzeme Sınıfı",
      dataIndex: " materialClass",
      key: "materialClass",
      width: "150px",
      ellipsis: true,
    },
    {
      title: "Barkod No",
      dataIndex: "barcodeNo",
      key: "barcodeNo",
      width: "150px",
      ellipsis: true,
    },
  ];

  const depoID = watch("depoID");

  const fetch = useCallback(() => {
    setLoading(true);
    AxiosInstance.get(`GetDepoStok?depoID=${depoID}&stoklu=true`)
      .then((response) => {
        const fetchedData = response.map((item) => ({
          ...item,
          key: item.TB_STOK_ID,
          code: item.STK_KOD,
          subject: item.STK_TANIM,
          workdays: item.STK_TIP,
          description: item.STK_BIRIM,
          descriptionID: item.STK_BIRIM_KOD_ID,
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
          STK_TIP_KOD_ID: item.STK_TIP_KOD_ID,
        }));
        setData(fetchedData);
      })
      .finally(() => setLoading(false));
  }, [depoID]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const handleModalToggle = () => {
    setIsModalVisible((prev) => !prev);
    if (!isModalVisible) {
      fetch();
      setSelectedRowKeys([]);
    }
  };

  const handleModalOk = () => {
    const selectedData = data.find((item) => item.key === selectedRowKeys[0]);
    if (selectedData) {
      onSubmit && onSubmit(selectedData);
    }
    setIsModalVisible(false);
  };

  useEffect(() => {
    setSelectedRowKeys(workshopSelectedId ? [workshopSelectedId] : []);
  }, [workshopSelectedId]);

  const onRowSelectChange = (selectedKeys) => {
    setSelectedRowKeys(selectedKeys.length ? [selectedKeys[0]] : []);
  };
  return (
    <div>
      <Button type="link" onClick={handleModalToggle}>
        <PlusOutlined /> Stoklu
      </Button>
      <Modal
        width={1200}
        centered
        title="Malzemeler"
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalToggle}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap", marginBottom: "10px" }}>
          <StyledDivBottomLine
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
              width: "100%",
              maxWidth: "360px",
            }}>
            <Text style={{ fontSize: "14px" }}>Depo:</Text>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "space-between",
                width: "300px",
              }}>
              <Controller
                name="depo"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="text" // Set the type to "text" for name input
                    style={{ width: "215px" }}
                    disabled
                  />
                )}
              />
              <Controller
                name="depoID"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="text" // Set the type to "text" for name input
                    style={{ display: "none" }}
                  />
                )}
              />
              <DepoTablo
                onSubmit={(selectedData) => {
                  setValue("depo", selectedData.DEP_TANIM);
                  setValue("depoID", selectedData.key);
                }}
              />
              <Button onClick={handleDepoMinusClick}> - </Button>
            </div>
          </StyledDivBottomLine>
        </div>
        <Table
          rowSelection={{
            type: "radio",
            selectedRowKeys,
            onChange: onRowSelectChange,
          }}
          pagination={{
            defaultPageSize: 10,
            showSizeChanger: false,
            // pageSizeOptions: ["10", "20", "50", "100"],
            position: ["bottomRight"],
          }}
          columns={columns}
          dataSource={data}
          loading={loading}
          scroll={{
            // x: "auto",
            y: "calc(100vh - 360px)",
          }}
        />
      </Modal>
    </div>
  );
}
