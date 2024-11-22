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
      title: "Malzeme Kodu",
      dataIndex: "ISM_STOK_KOD",
      key: "ISM_STOK_KOD",
      width: 200,
      ellipsis: true,
      align: "center",
      render: (text) => <div style={{ textAlign: "left" }}>{text}</div>,
    },
    {
      title: "Malzeme Tanımı",
      dataIndex: "ISM_STOK_TANIM",
      key: "ISM_STOK_TANIM",
      width: 200,
      ellipsis: true,
      align: "center",
      render: (text) => <div style={{ textAlign: "left" }}>{text}</div>,
    },
    {
      title: "Miktar",
      dataIndex: "ISM_MIKTAR",
      key: "ISM_MIKTAR",
      width: 200,
      ellipsis: true,
      align: "center",
      render: (text) => <div style={{ textAlign: "right" }}>{text}</div>,
    },
    {
      title: "Birim",
      dataIndex: "ISM_BIRIM",
      key: "ISM_BIRIM",
      width: 200,
      ellipsis: true,
      align: "center",
      render: (text) => <div style={{ textAlign: "left" }}>{text}</div>,
    },
    {
      title: "Birim Fiyat",
      dataIndex: "ISM_BIRIM_FIYAT",
      key: "ISM_BIRIM_FIYAT",
      width: 200,
      ellipsis: true,
      align: "center",
      render: (text) => <div style={{ textAlign: "right" }}>{text}</div>,
    },
    {
      title: "Maliyet",
      dataIndex: "ISM_TUTAR",
      key: "ISM_TUTAR",
      width: 200,
      ellipsis: true,
      align: "center",
      render: (text) => <div style={{ textAlign: "right" }}>{text}</div>,
    },
    {
      title: "Açıklama",
      dataIndex: "ISM_ACIKLAMA",
      key: "ISM_ACIKLAMA",
      width: 200,
      ellipsis: true,
      align: "center",
      render: (text) => <div style={{ textAlign: "left" }}>{text}</div>,
    },
  ];

  const secilenBakimID = watch("secilenBakimID");

  const fetch = useCallback(() => {
    setLoading(true);
    AxiosInstance.get(`GetIsTanimMazleme?isTanimID=${secilenBakimID}`)
      .then((response) => {
        const fetchedData = response.map((item) => ({
          ...item,
          key: item.TB_IS_TANIM_MLZ_ID,
        }));
        setData(fetchedData);
      })
      .finally(() => setLoading(false));
  }, [secilenBakimID]);

  useEffect(() => {
    if (secilenBakimID) {
      // secilenBakimID'nin varlığını ve geçerliliğini kontrol edin
      fetch(); // fetch fonksiyonunu çağırın
    }
  }, [secilenBakimID, fetch]); // secilenBakimID veya fetch fonksiyonu değiştiğinde useEffect'i tetikle

  const onRowSelectChange = (selectedKeys) => {
    setSelectedRowKeys(selectedKeys);
  };

  // Seçilen satır objelerini içeren bir dizi oluşturun
  const selectedRows = data.filter((row) => selectedRowKeys.includes(row.key));

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
          type: "checkbox",
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
