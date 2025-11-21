import React, { useState } from "react";
import Filters from "./filter/Filters";
import { Button, Modal, Table, Spin, message, Tag } from "antd";
import AxiosInstance from "../../../../../../../../../../../../../../api/http";
import dayjs from "dayjs";

const MainTable = ({ selectedRowId }) => {
  const [filters, setFilters] = useState({
    basTarih: null,
    bitTarih: null,
    depoId: null,
    hareketTip: "",
  });
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const columns = [
  {
    title: "G/C",
    dataIndex: "gc",
    key: "gc",
    width: 60,
    render: (value) => {
      if (value === "G") {
        return <Tag color="green">+</Tag>;
      }
      if (value === "C" || value === "T") {
        return <Tag color="red">-</Tag>;
      }
      return value; // başka değer gelirse olduğu gibi göster
    },
  },
  {
    title: "Makine Kodu",
    dataIndex: "makineKodu",
    key: "makineKodu",
    width: 150,
  },
  {
    title: "Makine Tanımı",
    dataIndex: "makineTanim",
    key: "makineTanim",
    width: 200,  // 200px genişlik
    ellipsis: { showTitle: true },
  },
  {
    title: "Tarih",
    dataIndex: "tarih",
    key: "tarih",
    width: 120,
    render: (text) => text ? new Date(text).toLocaleDateString("tr-TR") : "",
  },
  {
    title: "Fiş No",
    dataIndex: "fisNo",
    key: "fisNo",
    width: 120,
  },
  {
    title: "Hareket Tipi",
    dataIndex: "hareketTipi",
    key: "hareketTipi",
    width: 120,
  },
  {
    title: "Depo",
    dataIndex: "depo",
    key: "depo",
    width: 200,
  },
  {
    title: "Firma",
    dataIndex: "firma",
    key: "firma",
    width: 150,
    render: (text) => text || "-", // firma null ise '-' göster
  },
  {
    title: "Miktar",
    dataIndex: "miktar",
    key: "miktar",
    width: 100,
    align: "right",
  },
  {
    title: "Birim",
    dataIndex: "birim",
    key: "birim",
    width: 80,
  },
  {
    title: "Birim Fiyat",
    dataIndex: "birimFiyat",
    key: "birimFiyat",
    width: 120,
    align: "right",
    render: (text) => text ? text.toFixed(2) : "0.00",
  },
  {
    title: "Toplam",
    dataIndex: "toplam",
    key: "toplam",
    width: 120,
    align: "right",
    render: (text) => text ? text.toFixed(2) : "0.00",
  },
  {
    title: "İş Emri No",
    dataIndex: "isEmriNo",
    key: "isEmriNo",
    width: 150,
    render: (text) => text || "-",
  },
  {
    title: "Açıklama",
    dataIndex: "aciklama",
    key: "aciklama",
    width: 200,
    render: (text) => text || "-",
  },
  {
    title: "Firma Kodu",
    dataIndex: "firmaKodu",
    key: "firmaKodu",
    width: 150,
    render: (text) => text || "-",
  },
];

  // Filters'dan gelen değişiklikleri yakala
  const handleFiltersChange = (_, newFilters) => {
    // Buradaki _ parametresi 'filters' stringi, ihtiyaca göre kullanabilirsin
    setFilters(newFilters);
  };

  const handleSearch = async () => {
  if (!selectedRowId) {
    message.warning("Lütfen önce bir stok seçiniz.");
    return;
  }

  const basTarih = filters.basTarih ? dayjs(filters.basTarih).format("YYYY-MM-DD") : undefined;
  const bitTarih = filters.bitTarih ? dayjs(filters.bitTarih).format("YYYY-MM-DD") : undefined;

  const requestBody = {
    stokId: selectedRowId,
    ...(basTarih ? { basTarih } : {}),
    ...(bitTarih ? { bitTarih } : {}),
    ...(filters.depoId ? { depoId: filters.depoId } : {}),
    ...(filters.hareketTip ? { hareketTip: filters.hareketTip } : {}),
  };

  setLoading(true);
  try {
  const response = await AxiosInstance.post("GetMalzemeHareketListesi", requestBody);
  setData(Array.isArray(response?.data) ? response.data : []);
} catch {
  message.error("Veriler alınamadı.");
} finally {
    setLoading(false);
  }
};

  return (
    <>
      <Button onClick={() => setIsModalVisible(true)}>Malzeme Depo Durumları</Button>
      <Modal
        title="Malzeme Hareketleri"
        centered
        width={900}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <div style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap", marginBottom: 16 }}>
          <Filters onChange={handleFiltersChange} />
          <Button type="primary" onClick={handleSearch}>Sorgula</Button>
        </div>
        <Spin spinning={loading}>
          <Table
            columns={columns}
            dataSource={data}
            rowKey={(record, index) => `${record.makineKodu}-${index}`}
            pagination={{
              defaultPageSize: 10,
              showSizeChanger: true,
              pageSizeOptions: ["10", "20", "50", "100"],
              position: ["bottomRight"],
              showTotal: (total) => `Toplam ${total}`,
              showQuickJumper: true,
            }}
            scroll={{ y: "calc(100vh - 370px)" }}
          />
        </Spin>
      </Modal>
    </>
  );
};

export default MainTable;