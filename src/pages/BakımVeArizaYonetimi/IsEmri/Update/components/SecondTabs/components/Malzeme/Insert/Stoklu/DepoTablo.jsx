import React, { useCallback, useEffect, useState } from "react";
import { Button, Modal, Table } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import AxiosInstance from "../../../../../../../../../../api/http";
import dayjs from "dayjs";

export default function DepoTablo({ workshopSelectedId, onSubmit }) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const columns = [
    {
      title: "Depo Kodu",
      dataIndex: "DEP_KOD",
      key: "DEP_KOD",
      width: "150px",
      ellipsis: true,
    },
    {
      title: "Depo Tanımı",
      dataIndex: "DEP_TANIM",
      key: "DEP_TANIM",
      width: "150px",
      ellipsis: true,
    },
    {
      title: "Sorumlu Personel",
      dataIndex: "SORUMLU_PERSONEL",
      key: "SORUMLU_PERSONEL",
      width: "150px",
      ellipsis: true,
    },
    {
      title: "Atölye Tanım",
      dataIndex: "ATOLYE_TANIM",
      key: "ATOLYE_TANIM",
      width: "150px",
      ellipsis: true,
    },

    {
      title: "Lokasyon Tanım",
      dataIndex: "LOKASYON_TANIM",
      key: "LOKASYON_TANIM",
      width: "150px",
      ellipsis: true,
    },
  ];

  const fetch = useCallback(() => {
    setLoading(true);
    AxiosInstance.get(`GetDepo?DEP_MODUL_NO=1`)
      .then((response) => {
        const fetchedData = response.map((item) => ({
          ...item,
          key: item.TB_DEPO_ID,
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
        title="Depolar"
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
