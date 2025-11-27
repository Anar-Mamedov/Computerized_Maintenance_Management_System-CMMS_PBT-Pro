import React, { useCallback, useState } from "react";
import { Modal, Table } from "antd";
import AxiosInstance from "../../../../../../api/http";
import { HistoryOutlined } from "@ant-design/icons"; // Tarihçe için saat ikonu

export default function TarihceTablo({ selectedRows }) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  // ... (Columns aynen kalacak)
  const columns = [
    { title: "İşlem", dataIndex: "islem", key: "islem", width: 350 },
    { title: "İşlem Yapan", dataIndex: "islemYapanAdi", key: "islemYapanAdi", width: 200 },
    // ...
  ];

  const fetch = useCallback(() => {
    setLoading(true);
    const selectedKey = selectedRows.map((item) => item.key).join(",");
    AxiosInstance.get(`GetMalzemeSatinalmaTarihceDetayli?fisId=${selectedKey}`)
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
          <HistoryOutlined style={{ color: '#535c68', fontSize: '18px', marginTop: '4px' }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontWeight: '500', color: '#262626', fontSize: '14px', lineHeight: '1.2' }}>
            Tarihçe
          </span>
          <span style={{ fontSize: '12px', color: '#8c8c8c', marginTop: '4px', lineHeight: '1.4' }}>
            Talep üzerindeki tüm işlem geçmişini göster.
          </span>
        </div>
      </div>

      <Modal
        width={1000}
        centered
        title={`Malzeme Talebi Tarihçesi (${selectedRows[0]?.SFS_FIS_NO || ""})`}
        open={isModalVisible}
        onCancel={handleModalToggle}
        footer={null}
      >
        <Table columns={columns} dataSource={data} loading={loading} scroll={{ y: "calc(100vh - 360px)" }} />
      </Modal>
    </div>
  );
}