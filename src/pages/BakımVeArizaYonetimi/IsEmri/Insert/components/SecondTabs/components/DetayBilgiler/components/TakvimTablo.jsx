import React, { useCallback, useEffect, useState } from "react";
import { Button, Modal, Table } from "antd";
import AxiosInstance from "../../../../../../../../../api/http";

export default function TakvimTablo({ workshopSelectedId, onSubmit }) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const columns = [
    {
      title: "Yıl",
      dataIndex: "TKV_YIL",
      key: "TKV_YIL",
      width: 100,
      ellipsis: true,
    },
    {
      title: "Takvim Tanım",
      dataIndex: "TKV_TANIM",
      key: "TKV_TANIM",
      width: 300,
      ellipsis: true,
    },
    {
      title: "Çalışma Günleri",
      dataIndex: "TKV_HAFTA_CALISMA_GUN",
      key: "TKV_HAFTA_CALISMA_GUN",
      width: 100,
      ellipsis: true,
    },
    {
      title: "Açıklama",
      dataIndex: "TKV_ACIKLAMA",
      key: "TKV_ACIKLAMA",
      width: 200,
      ellipsis: true,
    },
  ];

  const fetch = useCallback(() => {
    setLoading(true);
    AxiosInstance.get(`GetTakvimList`)
      .then((response) => {
        const fetchedData = response.Takvim_Liste.map((item) => ({
          ...item,
          key: item.TB_TAKVIM_ID,
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
        title="Takvim Tanımları"
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalToggle}>
        <Table
          rowSelection={{
            type: "radio",
            selectedRowKeys,
            onChange: onRowSelectChange,
          }}
          columns={columns}
          dataSource={data}
          loading={loading}
        />
      </Modal>
    </div>
  );
}
