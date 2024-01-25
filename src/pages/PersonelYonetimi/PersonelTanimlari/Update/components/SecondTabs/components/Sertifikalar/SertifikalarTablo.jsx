import React, { useCallback, useEffect, useState } from "react";
import { Button, Modal, Table } from "antd";
import { useFormContext } from "react-hook-form";
import AxiosInstance from "../../../../../../../../api/http";
import dayjs from "dayjs";
import CreateModal from "./Insert/CreateModal";
import EditModal from "./Update/EditModal";

export default function SertifikalarTablo() {
  const [loading, setLoading] = useState(false);
  const { control, watch, setValue } = useFormContext();
  const [data, setData] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const columns = [
    {
      title: "Sertifika Tipi",
      dataIndex: "ISK_SIRANO",
      key: "ISK_SIRANO",
      width: 120,
      ellipsis: true,
    },
    {
      title: "Belge No",
      dataIndex: "ISK_TANIM",
      key: "ISK_TANIM",
      width: 200,
      ellipsis: true,
    },
    {
      title: "Verılış Tarihi",
      dataIndex: "ISK_ACIKLAMA",
      key: "ISK_ACIKLAMA",
      width: 200,
      ellipsis: true,
    },
    {
      title: "Bitiş Tarihi",
      dataIndex: "ISK_ACIKLAMA",
      key: "ISK_ACIKLAMA",
      width: 200,
      ellipsis: true,
    },
    {
      title: "Açıklama",
      dataIndex: "ISK_ACIKLAMA",
      key: "ISK_ACIKLAMA",
      width: 200,
      ellipsis: true,
    },
  ];

  const secilenBakimID = watch("secilenBakimID");

  const fetch = useCallback(() => {
    setLoading(true);
    AxiosInstance.get(`IsTanimKontrolList?isTanimID=${secilenBakimID}`)
      .then((response) => {
        const fetchedData = response.map((item) => ({
          key: item.TB_IS_TANIM_KONROLLIST_ID,
          ISK_SIRANO: item.ISK_SIRANO,
          ISK_TANIM: item.ISK_TANIM,
          ISK_ACIKLAMA: item.ISK_ACIKLAMA,
        }));
        setData(fetchedData);
      })
      .catch((error) => {
        // Hata işleme
        console.error("API isteği sırasında hata oluştu:", error);
      })
      .finally(() => setLoading(false));
  }, [secilenBakimID]); // secilenBakimID değiştiğinde fetch fonksiyonunu güncelle

  useEffect(() => {
    if (secilenBakimID) {
      // secilenBakimID'nin varlığını ve geçerliliğini kontrol edin
      fetch(); // fetch fonksiyonunu çağırın
    }
  }, [secilenBakimID, fetch]); // secilenBakimID veya fetch fonksiyonu değiştiğinde useEffect'i tetikle

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
      <CreateModal onRefresh={refreshTable} secilenBakimID={secilenBakimID} />
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
