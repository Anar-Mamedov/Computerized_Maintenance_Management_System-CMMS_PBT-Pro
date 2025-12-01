import React, { useCallback, useEffect, useState } from "react";
import { Modal, Table, Typography, Tag } from "antd";
import AxiosInstance from "../../../../../../api/http";
import dayjs from "dayjs";
import { FileProtectOutlined } from "@ant-design/icons"; // İkon eklendi

const { Text } = Typography;

export default function OnayTarihceTablo({ selectedRows }) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  // ... (formatDate, formatDateTime ve columns kodları aynen kalacak)
  // Not: columns içindeki render fonksiyonlarını korudum
  const formatDateTime = (value) => { if (!value) return ""; return dayjs(value).format("DD.MM.YYYY HH:mm"); };

  const columns = [
    {
      title: "Sıra No",
      dataIndex: "siraNo",
      key: "siraNo",
      width: 80,
      align: "center",
    },
    {
      title: "Kullanıcı",
      dataIndex: "kullanici",
      key: "kullanici",
      width: 150,
    },
    {
      title: "İşlem",
      dataIndex: "islem",
      key: "islem",
      width: 120,
      align: "center",
      render: (text) => {
        let color = "geekblue";
        if (text === "Onaylandı") color = "green";
        if (text === "Reddedildi" || text === "İptal") color = "red";
        return (
          <Tag color={color} style={{ width: "100%", textAlign: "center" }}>
            {text}
          </Tag>
        );
      },
    },
    {
      title: "Gönderim Zamanı",
      dataIndex: "gonderimZamani",
      key: "gonderimZamani",
      width: 160,
      render: formatDateTime,
    },
    {
      title: "İşlem Zamanı",
      dataIndex: "islemZamani",
      key: "islemZamani",
      width: 160,
      render: formatDateTime,
    },
    {
      title: "Bekleme Süresi",
      dataIndex: "fark",
      key: "fark",
      width: 130,
    },
    {
      title: "Açıklama",
      dataIndex: "redAciklama",
      key: "redAciklama",
      width: 200,
      ellipsis: true, // Uzun açıklamalar taşmasın diye
    },
  ];

  const fetch = useCallback(() => {
    setLoading(true);
    const selectedKey = selectedRows.map((item) => item.key).join(",");
    AxiosInstance.get(`GetOnayTarihceBy?tabloId=${selectedKey}`)
      .then((response) => {
        const fetchedData = response.data.map((item) => ({ key: item.tarihceId, ...item }));
        setData(fetchedData);
      })
      .finally(() => setLoading(false));
  }, [selectedRows]);

  const handleModalToggle = () => {
    setIsModalVisible((prev) => !prev);
    if (!isModalVisible) fetch();
  };

  return (
    <div>
      <div
        onClick={handleModalToggle}
        className="menu-item-hover"
        style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px',
            cursor: 'pointer',
            padding: '10px 12px',
            transition: 'background-color 0.3s',
            width: '100%'
        }}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
      >
        <div>
          <FileProtectOutlined style={{ color: '#535c68', fontSize: '18px', marginTop: '4px' }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontWeight: '500', color: '#262626', fontSize: '14px', lineHeight: '1.2' }}>
            Onay Tarihçesi
          </span>
          <span style={{ fontSize: '12px', color: '#8c8c8c', marginTop: '4px', lineHeight: '1.4' }}>
            Kim, ne zaman onayladı / geri aldı?
          </span>
        </div>
      </div>

      <Modal
        width={1000}
        centered
        title={`Malzeme Talebi Onay Tarihçesi (${selectedRows[0]?.SFS_FIS_NO || ""})`}
        open={isModalVisible}
        onCancel={handleModalToggle}
        footer={null}
      >
        <Table columns={columns} dataSource={data} loading={loading} scroll={{ y: "calc(100vh - 360px)" }} />
      </Modal>
    </div>
  );
}