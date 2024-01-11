import React, { useCallback, useEffect, useState } from "react";
import { Button, Modal, Table } from "antd";
import AxiosInstance from "../../../../../../../api/http";
import { useFormContext } from "react-hook-form";
import dayjs from "dayjs";

export default function ProjeTablo({ workshopSelectedId, onSubmit }) {
  const { control, watch, setValue } = useFormContext();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const columns = [
    {
      title: "Proje Kodu",
      dataIndex: "code",
      key: "code",
      width: 200,
      ellipsis: true,
    },
    {
      title: "Proje Tanımı",
      dataIndex: "subject",
      key: "subject",
      width: 300,
      ellipsis: true,
    },
    {
      title: "Proje Tipi",
      dataIndex: "type",
      key: "type",
      width: 200,
      ellipsis: true,
    },
    {
      title: "Başlama Tarihi",
      dataIndex: "startDate",
      key: "startDate",
      width: 200,
      ellipsis: true,
    },
    {
      title: "Bitiş Tarihi",
      dataIndex: "endDate",
      key: "endDate",
      width: 200,
      ellipsis: true,
    },
  ];

  const lokasyonId = watch("selectedLokasyonId");

  const fetch = useCallback(() => {
    setLoading(true);
    AxiosInstance.get(`GetProjeList?lokasyonId=${lokasyonId}`)
      .then((response) => {
        const fetchedData = response.Proje_Liste.map((item) => ({
          key: item.TB_PROJE_ID,
          code: item.PRJ_KOD,
          subject: item.PRJ_TANIM,
          type: item.PRJ_TIP,
          startDate: dayjs(item.PRJ_BASLAMA_TARIH).format("DD-MM-YYYY"),
          endDate: dayjs(item.PRJ_BITIS_TARIH).format("DD-MM-YYYY"),
        }));
        setData(fetchedData);
      })
      .finally(() => setLoading(false));
  }, [lokasyonId]);

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
    </div>
  );
}
