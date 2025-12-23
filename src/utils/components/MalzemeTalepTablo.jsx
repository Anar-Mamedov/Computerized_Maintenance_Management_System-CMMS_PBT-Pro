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

export default function MalzemeTalepTablo({ workshopSelectedId, onSubmit, selectedRowID, materialCode: materialCodeProp }) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [searchTerm1, setSearchTerm1] = useState("");
  const [filteredData1, setFilteredData1] = useState([]);
  const materialCode = materialCodeProp || (data.length ? data[0].STK_KOD : "");
  const modalTitle = materialCode ? `Malzeme Talep Listesi - ${materialCode}` : "Malzeme Talep Listesi";

  const columns = [
    {
      title: "Talep No",
      dataIndex: "SFS_FIS_NO",
      key: "SFS_FIS_NO",
      width: 120,
      ellipsis: true,
    },
    {
      title: "Başlık",
      dataIndex: "SFS_BASLIK",
      key: "SFS_BASLIK",
      width: 120,
      ellipsis: true,
    },
    {
      title: "Talep Tarihi",
      dataIndex: "SFS_TALEP_TARIH",
      key: "SFS_TALEP_TARIH",
      width: 120,
      ellipsis: true,
    },
    {
      title: "Durum",
      dataIndex: "SFS_DURUM",
      key: "SFS_DURUM",
      width: 120,
      ellipsis: true,
    },
    {
      title: "Talep Miktarı",
      dataIndex: "SFD_MIKTAR",
      key: "SFD_MIKTAR",
      width: 120,
      ellipsis: true,
    },
    {
      title: "Satınalma Miktarı",
      dataIndex: "SFD_SATINALMA_MIKTARI",
      key: "SFD_SATINALMA_MIKTARI",
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
    {
      title: "Lokasyon",
      dataIndex: "SFS_LOKASYON",
      key: "SFS_LOKASYON",
      width: 120,
      ellipsis: true,
    },
    {
      title: "Proje",
      dataIndex: "SFS_PROFJE_TANIM",
      key: "SFS_PROFJE_TANIM",
      width: 120,
      ellipsis: true,
    },
    {
      title: "Talep Eden",
      dataIndex: "STK_TANIM",
      key: "STK_TANIM",
      width: 120,
      ellipsis: true,
    },
    {
      title: "Bölüm",
      dataIndex: "SFS_BOLUM",
      key: "SFS_BOLUM",
      width: 120,
      ellipsis: true,
    },
    {
      title: "Talep Nedeni",
      dataIndex: "SFS_TALEP_NEDEN",
      key: "SFS_TALEP_NEDEN",
      width: 120,
      ellipsis: true,
    },
    {
      title: "Teslim Yeri",
      dataIndex: "SFS_TESLIM_YERI",
      key: "SFS_TESLIM_YERI",
      width: 120,
      ellipsis: true,
    },
    {
      title: "Öncelik",
      dataIndex: "SFS_KOD_ONCELIK",
      key: "SFS_KOD_ONCELIK",
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
      <Modal width={1200} centered title={modalTitle} open={isModalVisible} onOk={handleModalOk} onCancel={handleModalToggle}>
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
