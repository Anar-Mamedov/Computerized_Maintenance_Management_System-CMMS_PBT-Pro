import React, { useCallback, useEffect, useState } from "react";
import { Button, Modal, Table } from "antd";
import { useFormContext } from "react-hook-form";
import AxiosInstance from "../../../../../../../../api/http";
import dayjs from "dayjs";
import CreateModal from "./Insert/CreateModal";
import EditModal from "./Update/EditModal";

export default function PersonelListesiTablo() {
  const [loading, setLoading] = useState(false);
  const { control, watch, setValue } = useFormContext();
  const [data, setData] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const columns = [
    {
      title: "Personel Kodu",
      dataIndex: "code",
      key: "code",
      width: "150px",
      ellipsis: true,
    },
    {
      title: "Personel Adı",
      dataIndex: "subject",
      key: "subject",
      width: "150px",
      ellipsis: true,
    },
    {
      title: "Ünvan",
      dataIndex: "workdays",
      key: "workdays",
      width: "150px",
      ellipsis: true,
    },
    {
      title: "Personel Tipi",
      dataIndex: "description",
      key: "description",
      width: "150px",
      ellipsis: true,
    },

    {
      title: "Departman",
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
  ];

  const lokasyonId = watch("selectedLokasyonId");

  const fetch = useCallback(() => {
    setLoading(true);
    AxiosInstance.get(`Personel?lokasyonId=${lokasyonId}`)
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
          y: "calc(100vh - 520px)",
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
