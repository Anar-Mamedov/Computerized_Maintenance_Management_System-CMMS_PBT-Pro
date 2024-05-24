import React, { useCallback, useEffect, useState } from "react";
import { Button, Modal, Table } from "antd";
import { useFormContext } from "react-hook-form";
import AxiosInstance from "../../../../../../../../api/http";
import dayjs from "dayjs";
import CreateModal from "./Insert/CreateModal";
import EditModal from "./Update/EditModal";

export default function TanimliMakinelerTablo() {
  const [loading, setLoading] = useState(false);
  const { control, watch, setValue } = useFormContext();
  const [data, setData] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const columns = [
    {
      title: "Makine Kodu",
      dataIndex: "MKN_KOD",
      key: "MKN_KOD",
      width: 150,
      ellipsis: true,
    },
    {
      title: "Makine Tanımı",
      dataIndex: "MKN_TANIM",
      key: "MKN_TANIM",
      width: 200,
      ellipsis: true,
    },
    {
      title: "Son Uygulama Tarihi",
      dataIndex: "PBM_SON_UYGULAMA_TARIH",
      key: "PBM_SON_UYGULAMA_TARIH",
      width: 200,
      ellipsis: true,
    },
    {
      title: "Hedef Tarih",
      dataIndex: "PBM_HEDEF_TARIH",
      key: "PBM_HEDEF_TARIH",
      width: 200,
      ellipsis: true,
    },
    {
      title: "Kalan Süre",
      dataIndex: "PBM_KALAN_SURE",
      key: "PBM_KALAN_SURE",
      width: 200,
      ellipsis: true,
    },
    {
      title: "Kalan Süre %",
      dataIndex: "PBM_KALAN_SURE_ORAN",
      key: "PBM_KALAN_SURE_ORAN",
      width: 200,
      ellipsis: true,
    },
    {
      title: "Sayaç",
      dataIndex: "eksik",
      key: "eksik",
      width: 200,
      ellipsis: true,
    },
    {
      title: "Güncel Sayaç Değeri",
      dataIndex: "MES_GUNCEL_DEGER",
      key: "MES_GUNCEL_DEGER",
      width: 200,
      ellipsis: true,
    },
    {
      title: "Son Uygulanan",
      dataIndex: "PBM_SON_UYGULAMA_SAYAC",
      key: "PBM_SON_UYGULAMA_SAYAC",
      width: 200,
      ellipsis: true,
    },
    {
      title: "Hedef Sayaç",
      dataIndex: "PBM_HEDEF_SAYAC",
      key: "PBM_HEDEF_SAYAC",
      width: 200,
      ellipsis: true,
    },
    {
      title: "Kalan Sayaç",
      dataIndex: "PBM_KALAN_SAYAC",
      key: "PBM_KALAN_SAYAC",
      width: 200,
      ellipsis: true,
    },
    {
      title: "Kalan Sayaç %",
      dataIndex: "PBM_KALAN_SAYAC_ORAN",
      key: "PBM_KALAN_SAYAC_ORAN",
      width: 200,
      ellipsis: true,
    },

    {
      title: "Makine Tipi",
      dataIndex: "MKN_TIP",
      key: "MKN_TIP",
      width: 200,
      ellipsis: true,
    },
    {
      title: "Lokasyon",
      dataIndex: "PBM_LOKASYON",
      key: "PBM_LOKASYON",
      width: 200,
      ellipsis: true,
    },
    {
      title: "Makine Durumu",
      dataIndex: "MKN_DURUM",
      key: "MKN_DURUM",
      width: 200,
      ellipsis: true,
    },
    {
      title: "Makine Kategori",
      dataIndex: "eksik",
      key: "eksik",
      width: 200,
      ellipsis: true,
    },
    {
      title: "Makine Marka",
      dataIndex: "MKN_MARKA",
      key: "MKN_MARKA",
      width: 200,
      ellipsis: true,
    },
    {
      title: "Makine Model",
      dataIndex: "MKN_MODEL",
      key: "MKN_MODEL",
      width: 200,
      ellipsis: true,
    },
    {
      title: "Hartırlatma Süresi",
      dataIndex: "PBM_HATIRLAT_SURE",
      key: "PBM_HATIRLAT_SURE",
      width: 200,
      ellipsis: true,
    },
  ];

  const secilenBakimID = watch("secilenBakimID");

  const fetch = useCallback(() => {
    setLoading(true);
    AxiosInstance.get(`PeriyodikBakimGetMakineList?BakimID=${secilenBakimID}`)
      .then((response) => {
        const fetchedData = response.map((item) => ({
          ...item,
          key: item.TB_PERIYODIK_BAKIM_MAKINE_ID,
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
