import React, { useCallback, useEffect, useState } from "react";
import { Button, Modal, Table, Input } from "antd";
import { CheckOutlined, CloseOutlined, SearchOutlined } from "@ant-design/icons";
import AxiosInstance from "../../../../../../../../api/http";

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

export default function AtolyeTablo({ workshopSelectedId, onSubmit }) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [searchTerm1, setSearchTerm1] = useState("");
  const [filteredData1, setFilteredData1] = useState([]);

  const columns = [
    {
      title: "Bakım Kod",
      dataIndex: "IST_KOD",
      key: "IST_KOD",
      width: 150,
      ellipsis: true,
      render: (text) => <>{text}</>,
    },
    {
      title: "Bakım Tanım",
      dataIndex: "IST_TANIM",
      key: "IST_TANIM",
      width: 200,
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
    },
    {
      title: "Aktif",
      dataIndex: "IST_AKTIF",
      key: "IST_AKTIF",
      width: 100,
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
      align: "center",
      render: (text) => <div style={{ textAlign: "center" }}>{text ? <CheckOutlined style={{ color: "green" }} /> : <CloseOutlined style={{ color: "red" }} />}</div>,
    },

    {
      title: "Bakım Tip",
      dataIndex: "IST_TIP",
      key: "IST_TIP",
      width: 250,
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
    },
    {
      title: "Bakım Grup",
      dataIndex: "IST_GRUP",
      key: "IST_GRUP",
      width: 200,
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
    },
    {
      title: "Atölye",
      dataIndex: "IST_ATOLYE",
      key: "IST_ATOLYE",
      width: 200,
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
    },
    {
      title: "Lokasyon",
      dataIndex: "IST_LOKASYON",
      key: "IST_LOKASYON",
      width: 200,
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
      render: (text) => <div style={{ textAlign: "right" }}>{text}</div>,
    },
    {
      title: "Öncelik",
      dataIndex: "IST_ONCELIK",
      key: "IST_ONCELIK",
      width: 150,
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
    },
    {
      title: "Talimat",
      dataIndex: "IST_TALIMAT",
      key: "IST_TALIMAT",
      width: 150,
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
    },
    {
      title: "İş Süresi (dk.)",
      dataIndex: "IST_CALISMA_SURE",
      key: "IST_CALISMA_SURE",
      width: 150,
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
      render: (text) => <div style={{ textAlign: "right" }}>{text}</div>,
    },
    {
      title: "Duruş Süresi (dk.)",
      dataIndex: "IST_DURUS_SURE",
      key: "IST_DURUS_SURE",
      width: 170,
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
      render: (text) => <div style={{ textAlign: "right" }}>{text}</div>,
    },
    {
      title: "Personel Sayısı (kişi)",
      dataIndex: "IST_PERSONEL_SAYI",
      key: "IST_PERSONEL_SAYI",
      width: 170,
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
      render: (text) => <div style={{ textAlign: "right" }}>{text}</div>,
    },
    {
      title: "Özel Alan 1",
      dataIndex: "IST_OZEL_ALAN_1",
      key: "IST_OZEL_ALAN_1",
      width: 150,
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
    },
    {
      title: "Özel Alan 2",
      dataIndex: "IST_OZEL_ALAN_2",
      key: "IST_OZEL_ALAN_2",
      width: 150,
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
    },
    {
      title: "Özel Alan 3",
      dataIndex: "IST_OZEL_ALAN_3",
      key: "IST_OZEL_ALAN_3",
      width: 150,
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
    },
    {
      title: "Özel Alan 4",
      dataIndex: "IST_OZEL_ALAN_4",
      key: "IST_OZEL_ALAN_4",
      width: 150,
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
    },
    {
      title: "Özel Alan 5",
      dataIndex: "IST_OZEL_ALAN_5",
      key: "IST_OZEL_ALAN_5",
      width: 150,
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
    },
    {
      title: "Özel Alan 6",
      dataIndex: "IST_OZEL_ALAN_6",
      key: "IST_OZEL_ALAN_6",
      width: 150,
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
    },
    {
      title: "Özel Alan 7",
      dataIndex: "IST_OZEL_ALAN_7",
      key: "IST_OZEL_ALAN_7",
      width: 150,
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
    },
    {
      title: "Özel Alan 8",
      dataIndex: "IST_OZEL_ALAN_8",
      key: "IST_OZEL_ALAN_8",
      width: 150,
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
    },
    {
      title: "Özel Alan 9",
      dataIndex: "IST_OZEL_ALAN_9",
      key: "IST_OZEL_ALAN_9",
      width: 150,
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
    },
    {
      title: "Özel Alan 10",
      dataIndex: "IST_OZEL_ALAN_10",
      key: "IST_OZEL_ALAN_10",
      width: 150,
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
    },
    // Other columns...
  ];

  const fetch = useCallback(() => {
    setLoading(true);
    AxiosInstance.get(`BakimGetir`)
      .then((response) => {
        const fetchedData = response.map((item) => ({
          ...item,
          key: item.TB_IS_TANIM_ID,
          code: item.IST_KOD,
          subject: item.IST_TANIM,
        }));
        setData(fetchedData);
      })
      .finally(() => setLoading(false));
  }, []);

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
      <Modal width={1200} centered title="Bakım Tanımları" open={isModalVisible} onOk={handleModalOk} onCancel={handleModalToggle}>
        <Input placeholder="Arama..." value={searchTerm1} onChange={handleSearch1} style={{ width: "300px", marginBottom: "15px" }} />
        <Table
          rowSelection={{
            type: "radio",
            selectedRowKeys,
            onChange: onRowSelectChange,
          }}
          scroll={{ y: "calc(100vh - 380px)" }}
          columns={columns}
          dataSource={filteredData1.length > 0 || searchTerm1 ? filteredData1 : data}
          loading={loading}
        />
      </Modal>
    </div>
  );
}
