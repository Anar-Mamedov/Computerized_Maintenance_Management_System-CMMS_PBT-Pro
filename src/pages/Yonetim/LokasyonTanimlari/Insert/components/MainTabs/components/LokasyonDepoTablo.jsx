import React, { useCallback, useEffect, useState } from "react";
import { Button, Modal, Table } from "antd";
import AxiosInstance from "../../../../../../../api/http";

export default function LokasyonDepoTablo({ workshopSelectedId, onSubmit }) {
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
      ellipsis: true,
    },
    {
      title: "Depo Tanımı",
      dataIndex: "subject",
      key: "subject",
      width: 300,
      ellipsis: true,
    },
    {
      title: "Sorumlu Personel",
      dataIndex: "type",
      key: "type",
      width: 200,
      ellipsis: true,
    },
    {
      title: "Atölye",
      dataIndex: "startDate",
      key: "startDate",
      width: 200,
      ellipsis: true,
    },
    {
      title: "Lokasyon",
      dataIndex: "endDate",
      key: "endDate",
      width: 200,
      ellipsis: true,
    },
  ];

  const fetch = useCallback(() => {
    setLoading(true);
    AxiosInstance.get(`GetDepo?ID=24&DEP_MODUL_NO=1`)
      .then((response) => {
        const fetchedData = response.map((item) => ({
          key: item.TB_DEPO_ID,
          code: item.DEP_KOD,
          subject: item.DEP_TANIM,
          type: item.SORUMLU_PERSONEL,
          startDate: item.ATOLYE_TANIM,
          endDate: item.LOKASYON_TANIM,
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
      <Modal width={1200} centered title="Depo" open={isModalVisible} onOk={handleModalOk} onCancel={handleModalToggle}>
        <Table
          rowSelection={{
            type: "radio",
            selectedRowKeys,
            onChange: onRowSelectChange,
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
