import React, { useCallback, useEffect, useState } from "react";
import { Button, Modal, Table } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import AxiosInstance from "../../../../../../../../../api/http";

export default function CreateAracGerecTablo({ workshopSelectedId, onSubmit }) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const columns = [
    {
      title: "Kodu",
      dataIndex: "ARG_KOD",
      key: "ARG_KOD",
      width: "150px",
      ellipsis: true,
    },
    {
      title: "Tanım",
      dataIndex: "ARG_TANIM",
      key: "ARG_TANIM",
      width: "150px",
      ellipsis: true,
    },
    {
      title: "Tipi",
      dataIndex: "ARG_TIP_TANIM",
      key: "ARG_TIP_TANIM",
      width: "150px",
      ellipsis: true,
    },
    {
      title: "Bulunduğu Yer",
      dataIndex: "ARG_YER_TANIM",
      key: "ARG_YER_TANIM",
      width: "150px",
      ellipsis: true,
    },

    {
      title: "Departman",
      dataIndex: "ARG_SERI_NO",
      key: "ARG_SERI_NO",
      width: "150px",
      ellipsis: true,
    },
  ];

  const fetch = useCallback(() => {
    setLoading(true);
    AxiosInstance.get(`GetAracGerec`)
      .then((response) => {
        const fetchedData = response.ARAC_GEREC_LISTE.map((item) => ({
          ...item,
          key: item.TB_ARAC_GEREC_ID,
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
    const selectedData = data.filter((item) => selectedRowKeys.includes(item.key));
    if (selectedData.length > 0) {
      onSubmit && onSubmit(selectedData);
    }
    setIsModalVisible(false);
  };

  useEffect(() => {
    setSelectedRowKeys(workshopSelectedId ? [workshopSelectedId] : []);
  }, [workshopSelectedId]);

  const onRowSelectChange = (selectedKeys) => {
    setSelectedRowKeys(selectedKeys);
  };
  return (
    <div>
      <div style={{ display: "flex", width: "100%", justifyContent: "flex-end", marginBottom: "10px" }}>
        <Button type="link" onClick={handleModalToggle}>
          <PlusOutlined /> Yeni Kayıt
        </Button>
      </div>

      <Modal
        width={1200}
        centered
        title="Araç Gereç Listesi"
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalToggle}>
        <Table
          rowSelection={{
            type: "checkbox",
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
