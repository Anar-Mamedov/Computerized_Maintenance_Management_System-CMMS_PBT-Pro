import React, { useCallback, useEffect, useState } from "react";
import { Button, Modal, Table } from "antd";
import AxiosInstance from "../../../../../../../api/http";

export default function LokasyonPersonelTablo({ workshopSelectedId, onSubmit }) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const columns = [
    {
      title: "Personel Kodu",
      dataIndex: "code",
      key: "code",
      width: "150px",
    },
    {
      title: "Personel Adı",
      dataIndex: "subject",
      key: "subject",
      width: "150px",
    },
    {
      title: "Ünvan",
      dataIndex: "workdays",
      key: "workdays",
      width: "150px",
    },
    {
      title: "Personel Tipi",
      dataIndex: "description",
      key: "description",
      width: "150px",
    },

    {
      title: "Departman",
      dataIndex: "fifthcolumn",
      key: "fifthcolumn",
      width: "150px",
    },
    {
      title: "Lokasyon",
      dataIndex: "sixthcolumn",
      key: "sixthcolumn",
      width: "150px",
    },
  ];

  const fetch = useCallback(() => {
    setLoading(true);
    AxiosInstance.get(`Personel`)
      .then((response) => {
        const fetchedData = response.map((item) => ({
          key: item.TB_PERSONEL_ID,
          code: item.PRS_PERSONEL_KOD,
          subject: item.PRS_ISIM,
          workdays: item.PRS_UNVAN,
          description: item.PRS_TIP,
          fifthcolumn: item.PRS_DEPARTMAN,
          sixthcolumn: item.PRS_LOKASYON,
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
        title="Personel"
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
