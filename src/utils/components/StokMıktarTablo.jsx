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

export default function StokMıktarTablo({ workshopSelectedId, onSubmit, selectedRowID }) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [searchTerm1, setSearchTerm1] = useState("");
  const [filteredData1, setFilteredData1] = useState([]);

  const columns = [
    {
      title: "Depo Tanımı",
      dataIndex: "DEP_TANIM",
      key: "DEP_TANIM",
      width: 120,
      ellipsis: true,
    },
    {
      title: "Üretici Kodu",
      dataIndex: "STK_URETICI_KOD",
      key: "STK_URETICI_KOD",
      width: 120,
      ellipsis: true,
    },
    {
      title: "Giren Miktar",
      dataIndex: "DES_GIREN_MIKTAR",
      key: "DES_GIREN_MIKTAR",
      width: 120,
      ellipsis: true,
    },
    {
      title: "Çıkan Miktar",
      dataIndex: "DPS_CIKAN_MIKTAR",
      key: "DPS_CIKAN_MIKTAR",
      width: 120,
      ellipsis: true,
    },
    {
      title: "Stok Miktar",
      dataIndex: "DPS_MIKTAR",
      key: "DPS_MIKTAR",
      width: 120,
      ellipsis: true,
    },
    {
      title: "Birim",
      dataIndex: "STK_BIRIM",
      key: "STK_BIRIM",
      width: 120,
      ellipsis: true,
    },
  ];

  const fetch = useCallback(() => {
    setLoading(true);
    AxiosInstance.get(`GetStokMiktar?STOK_ID=${selectedRowID}`)
      .then((response) => {
        const fetchedData = response.map((item) => ({
          ...item,
          key: item.TB_STOK_MIKTAR_ID,
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
      <Modal width={1200} centered title="Malzeme Depo Dağılımı" open={isModalVisible} onOk={handleModalOk} onCancel={handleModalToggle}>
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
