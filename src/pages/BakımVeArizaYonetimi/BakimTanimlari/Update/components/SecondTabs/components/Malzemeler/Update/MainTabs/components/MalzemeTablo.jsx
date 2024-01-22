import React, { useCallback, useEffect, useState } from "react";
import { Button, Modal, Table } from "antd";
import AxiosInstance from "../../../../../../../../../../../api/http";
import dayjs from "dayjs";

export default function MalzemeTablo({ workshopSelectedId, onSubmit }) {
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

  const fetch = useCallback(() => {
    setLoading(true);
    AxiosInstance.get(`GetDepoStok?depoID=0&stoklu=false`)
      .then((response) => {
        const fetchedData = response.map((item) => ({
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
  }, []);

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
      <Button onClick={handleModalToggle}> + </Button>
      <Modal
        width={1200}
        centered
        title="Malzemeler"
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalToggle}>
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
