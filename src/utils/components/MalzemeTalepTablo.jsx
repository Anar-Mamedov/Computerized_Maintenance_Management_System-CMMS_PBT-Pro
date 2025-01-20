import React, { useCallback, useEffect, useState } from "react";
import { Button, Modal, Table, Input } from "antd";
import AxiosInstance from "../../api/http";

// Türkçe karakterleri İngilizce karşılıkları ile değiştiren fonksiyon
const normalizeText = (text) => {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ğ/g, "g")
    .replace(/Ğ/g, "G")
    .replace(/ü/g, "u")
    .replace(/Ü/g, "U")
    .replace(/ş/g, "s")
    .replace(/Ş/g, "S")
    .replace(/ı/g, "i")
    .replace(/İ/g, "I")
    .replace(/ö/g, "o")
    .replace(/Ö/g, "O")
    .replace(/ç/g, "c")
    .replace(/Ç/g, "C");
};

export default function MalzemeTalepTablo({ workshopSelectedId, onSubmit, selectedRowID }) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [searchTerm1, setSearchTerm1] = useState("");
  const [filteredData1, setFilteredData1] = useState([]);

  const columns = [
    {
      title: "Talep No",
      dataIndex: "talepNo",
      key: "talepNo",
      width: 120,
      ellipsis: true,
    },
    {
      title: "Başlık",
      dataIndex: "baslik",
      key: "baslik",
      width: 120,
      ellipsis: true,
    },
    {
      title: "Talep Tarihi",
      dataIndex: "talepTarihi",
      key: "talepTarihi",
      width: 120,
      ellipsis: true,
    },
    {
      title: "Durum",
      dataIndex: "durum",
      key: "durum",
      width: 120,
      ellipsis: true,
    },
    {
      title: "Talep Miktarı",
      dataIndex: "talepMiktari",
      key: "talepMiktari",
      width: 120,
      ellipsis: true,
    },
    {
      title: "Sabrına Miktarı",
      dataIndex: "sabrinaMiktari",
      key: "sabrinaMiktari",
      width: 120,
      ellipsis: true,
    },
    {
      title: "Birim",
      dataIndex: "birim",
      key: "birim",
      width: 120,
      ellipsis: true,
    },
    {
      title: "Lokasyon",
      dataIndex: "lokasyon",
      key: "lokasyon",
      width: 120,
      ellipsis: true,
    },
    {
      title: "Proje",
      dataIndex: "proje",
      key: "proje",
      width: 120,
      ellipsis: true,
    },
    {
      title: "Talep Eden",
      dataIndex: "talepEden",
      key: "talepEden",
      width: 120,
      ellipsis: true,
    },
    {
      title: "Bölüm",
      dataIndex: "bolum",
      key: "bolum",
      width: 120,
      ellipsis: true,
    },
    {
      title: "Talep Nedeni",
      dataIndex: "talepNedeni",
      key: "talepNedeni",
      width: 120,
      ellipsis: true,
    },
    {
      title: "Teslim Yeri",
      dataIndex: "teslimYeri",
      key: "teslimYeri",
      width: 120,
      ellipsis: true,
    },
    {
      title: "Öncelik",
      dataIndex: "oncelik",
      key: "oncelik",
      width: 120,
      ellipsis: true,
    },
  ];

  const fetch = useCallback(() => {
    setLoading(true);
    AxiosInstance.get(`GetTalepMiktar?STOK_ID=${selectedRowID}`)
      .then((response) => {
        const fetchedData = response.map((item) => ({
          ...item,
          key: item.TB_TALIP_ID,
        }));
        setData(fetchedData);
      })
      .finally(() => setLoading(false));
  }, [selectedRowID]);

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

  // Arama işlevselliği için handleSearch fonksiyonları
  const handleSearch1 = (e) => {
    const value = e.target.value;
    setSearchTerm1(value);
    const normalizedSearchTerm = normalizeText(value);
    if (value) {
      const filtered = data.filter((item) =>
        Object.keys(item).some((key) => item[key] && normalizeText(item[key].toString()).toLowerCase().includes(normalizedSearchTerm.toLowerCase()))
      );
      setFilteredData1(filtered);
    } else {
      setFilteredData1(data);
    }
  };
  return (
    <div>
      <Button onClick={handleModalToggle}> + </Button>
      <Modal width={1200} centered title="Malzeme Talep Listesi" open={isModalVisible} onOk={handleModalOk} onCancel={handleModalToggle}>
        <Input placeholder="Arama..." value={searchTerm1} onChange={handleSearch1} style={{ width: "300px", marginBottom: "15px" }} />
        <Table
          rowSelection={{
            type: "radio",
            selectedRowKeys,
            onChange: onRowSelectChange,
          }}
          columns={columns}
          dataSource={filteredData1.length > 0 || searchTerm1 ? filteredData1 : data}
          loading={loading}
          scroll={{ y: "calc(100vh - 330px)" }}
        />
      </Modal>
    </div>
  );
}
