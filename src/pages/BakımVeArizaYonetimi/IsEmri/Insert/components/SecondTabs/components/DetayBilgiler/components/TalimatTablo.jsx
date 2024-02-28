import React, { useCallback, useEffect, useState } from "react";
import { Button, Modal, Table } from "antd";
import AxiosInstance from "../../../../../../../../../api/http";
import dayjs from "dayjs";

export default function TalimatTablo({ workshopSelectedId, onSubmit }) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const columns = [
    {
      title: "Talimat Kodu",
      dataIndex: "code",
      key: "code",
      width: "150px",
      ellipsis: true,
    },
    {
      title: "Talımat Tanım",
      dataIndex: "subject",
      key: "subject",
      width: "350px",
      ellipsis: true,
    },
    {
      title: "Talimat Tipi",
      dataIndex: "workdays",
      key: "workdays",
      width: "150px",
      ellipsis: true,
    },
    {
      title: "Sorumlu",
      dataIndex: "fifthcolumn",
      key: "fifthcolumn",
      width: "150px",
      ellipsis: true,
    },
  ];

  const fetch = useCallback(() => {
    setLoading(true);
    AxiosInstance.get(`GetTalimatList`)
      .then((response) => {
        const fetchedData = response.Talimat_Liste.map((item) => ({
          key: item.TB_TALIMAT_ID,
          code: item.TLM_KOD,
          subject: item.TLM_TANIM,
          workdays: item.TLM_TIP,
          description: item.TLM_ACIKLAMA, // ?
          fifthcolumn: item.TLM_SORUMLU, // ?
          sixthcolumn: dayjs(item.TLM_YURURLUK_TARIH).format("DD-MM-YYYY"),
          seventhcolumn: item.TLM_REFERANS,
          eighthcolumn: item.TLM_DAGITIM,
          ninthcolumn: dayjs(item.TLM_REV_TARIH).format("DD-MM-YYYY"),
          tenthcolumn: item.TLM_REV_NO,
          eleventhcolumn: item.TLM_REV_NEDEN,
          twelfthcolumn: item.TLM_REVIZE_EDEN, // ?
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
        centered
        width="1200px"
        title="Talimat"
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
