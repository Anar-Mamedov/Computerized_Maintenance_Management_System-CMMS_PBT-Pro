import React, { useCallback, useEffect, useState } from "react";
import { Modal, Table, Typography } from "antd";
import { useFormContext } from "react-hook-form";
import AxiosInstance from "../../../../../../api/http";
import { FileTextOutlined } from "@ant-design/icons";

const { Text } = Typography;

// 1. Propslara onTalepClick ve onSiparisClick ekledik
export default function SatinalmaTablo({ 
  workshopSelectedId, 
  onSubmit, 
  selectedRows, 
  tableMode = false,
  onTalepClick,   // Talep No tıklandığında çalışacak fonksiyon
  onSiparisClick  // Sipariş No tıklandığında çalışacak fonksiyon
}) {
  const { control } = useFormContext();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const formatDate = (date) => { if (!date) return ""; return new Date(date).toLocaleDateString(); };
  
  // 2. Columns tanımını güncelledik
  const columns = [
     { 
       title: "Talep No", 
       dataIndex: "TALEP_NO", 
       key: "TALEP_NO", 
       width: 150, 
       ellipsis: true,
       render: (text, record) => {
         // Eğer tableMode açıksa link yap, değilse normal yazı
         if (tableMode) {
           return (
             <a onClick={() => onTalepClick?.(record)} style={{ color: "#1890ff", textDecoration: "underline" }}>
               {text}
             </a>
           );
         }
         return <Text>{text}</Text>;
       }
     },
     { 
       title: "Sipariş No", 
       dataIndex: "SSP_SIPARIS_KODU", 
       key: "SSP_SIPARIS_KODU", 
       width: 150,
       render: (text, record) => {
         // Eğer tableMode açıksa link yap, değilse normal yazı
         if (tableMode) {
           return (
             <a onClick={() => onSiparisClick?.(record)} style={{ color: "#1890ff", textDecoration: "underline" }}>
               {text}
             </a>
           );
         }
         return <Text>{text}</Text>;
       }
     },
     { title: "Firma", dataIndex: "SSP_FIRMA", key: "SSP_FIRMA", width: 200 }
  ];

  const fetchData = useCallback(async () => {
    if (!selectedRows || selectedRows.length === 0) return;
    setLoading(true);
    try {
      const rows = Array.isArray(selectedRows) ? selectedRows : [selectedRows];
      const selectedKey = rows.map(item => item.key || item.TB_SATINALMA_SIPARIS_ID || item.id).join(",");

      if(!selectedKey) { setLoading(false); return; }

      const response = await AxiosInstance.get(`GetSatinalmaSiparisListBy?fisId=${selectedKey}`);
      const siparisListesi = response.siparis_listesi || [];
      const formattedData = siparisListesi.map(item => ({
        key: item.TB_SATINALMA_SIPARIS_ID,
        ...item
      }));
      setData(formattedData);
    } catch (err) {
      console.error("API Hatası:", err);
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [selectedRows]);

  useEffect(() => {
    if (isModalVisible || tableMode) {
      fetchData();
    }
  }, [isModalVisible, tableMode, fetchData]);

  const handleModalToggle = () => setIsModalVisible(prev => !prev);
  const handleModalOk = () => setIsModalVisible(false);

  if (tableMode) {
      return (
        <Table
          columns={columns}
          dataSource={data}
          loading={loading}
          pagination={false}
          scroll={{ y: "calc(100vh - 360px)" }}
          size="small"
          bordered
        />
      );
  }

  // --- ESKİ YAPI (Div ve Modal) ---
  return (
    <div>
      <div
        onClick={handleModalToggle}
        className="menu-item-hover"
        style={{
            display: 'flex', alignItems: 'flex-start', gap: '12px', cursor: 'pointer',
            padding: '10px 12px', transition: 'background-color 0.3s', width: '100%'
        }}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
      >
        <div><FileTextOutlined style={{ color: '#535c68', fontSize: '18px', marginTop: '4px' }} /></div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontWeight: '500', color: '#262626', fontSize: '14px', lineHeight: '1.2' }}>Satınalma Siparişleri</span>
          <span style={{ fontSize: '12px', color: '#8c8c8c', marginTop: '4px', lineHeight: '1.4' }}>Bu talebe bağlı siparişleri görüntüle.</span>
        </div>
      </div>

      <Modal
        width={1000}
        centered
        title={`Satınalma Siparişleri (${selectedRows?.[0]?.SFS_FIS_NO || ""})`}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalToggle}
        footer={null}
      >
        <Table
          columns={columns}
          dataSource={data}
          loading={loading}
          scroll={{ y: "calc(100vh - 360px)" }}
        />
      </Modal>
    </div>
  );
}