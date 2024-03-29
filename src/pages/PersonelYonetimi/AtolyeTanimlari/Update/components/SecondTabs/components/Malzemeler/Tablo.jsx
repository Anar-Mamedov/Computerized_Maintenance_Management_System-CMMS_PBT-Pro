import React, { useCallback, useEffect, useState } from "react";
import { Button, Modal, Table } from "antd";
import { useFormContext } from "react-hook-form";
import AxiosInstance from "../../../../../../../../api/http";
import dayjs from "dayjs";
import CreateModal from "./Insert/CreateModal";
import EditModal from "./Update/EditModal";

export default function Tablo() {
  const [loading, setLoading] = useState(false);
  const { control, watch, setValue } = useFormContext();
  const [data, setData] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

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

  const onRowSelectChange = (selectedKeys) => {
    setSelectedRowKeys(selectedKeys.length ? [selectedKeys[0]] : []);
  };

  const onRowClick = (record) => {
    setSelectedRow(record);
    setIsModalVisible(true);
  };

  const refreshTable = useCallback(() => {
    fetch(); // fetch fonksiyonu tabloyu yeniler
  }, [fetch]);

  return (
    <div>
      <CreateModal onRefresh={refreshTable} />
      <Table
        rowSelection={{
          type: "radio",
          selectedRowKeys,
          onChange: onRowSelectChange,
        }}
        onRow={(record) => ({
          onClick: () => onRowClick(record),
        })}
        columns={columns}
        dataSource={data}
        loading={loading}
        scroll={{
          // x: "auto",
          y: "calc(100vh - 360px)",
        }}
      />
      {isModalVisible && (
        <EditModal
          selectedRow={selectedRow}
          isModalVisible={isModalVisible}
          onModalClose={() => {
            setIsModalVisible(false);
            setSelectedRow(null);
          }}
          onRefresh={refreshTable}
        />
      )}
    </div>
  );
}
