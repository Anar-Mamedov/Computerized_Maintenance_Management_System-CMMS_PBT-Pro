import React, { useEffect, useMemo, useState, useCallback } from "react";
import { Modal, Typography, Spin, Table } from "antd";
import AxiosInstance from "../../../../api/http.jsx";

const { Text } = Typography;

function Component5() {
  const [reportData, setReportData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalContent, setModalContent] = useState(null);
  const [kritikModalVisible, setKritikModalVisible] = useState(false);
  const [kritikModalLoading, setKritikModalLoading] = useState(false);
  const [kritikModalData, setKritikModalData] = useState([]);
  const [kritikModalSummary, setKritikModalSummary] = useState(null);
  const [editDrawerVisible, setEditDrawerVisible] = useState(false);
  const [selectedKritikRow, setSelectedKritikRow] = useState(null);
  const [kritikPagination, setKritikPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  // Renk skalası: Raporlar için döngüsel olarak kullanılacak
  const colors = ["#0000FF", "#800080", "#008000", "#FF0000", "#FFA500", "#FF1493", "#00CED1", "#2F4F4F", "#8B4513"];

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await AxiosInstance.get("getOzetRapor");
        // API'den gelen data array'ini set ediyoruz
        setReportData(response?.data || []);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const showModal = (title, content) => {
    setModalTitle(title);
    setModalContent(content);
    setIsModalVisible(true);
  };

  const handleKritikModalClose = () => {
    setKritikModalVisible(false);
    setEditDrawerVisible(false);
  };

  const fetchKritikStoklar = async () => {
    setKritikModalLoading(true);
    try {
      const response = await AxiosInstance.get("GetKritikStoklar");
      setKritikModalData(response?.data || []);
      setKritikModalSummary(response?.ozet || null);
    } catch (error) {
      console.error("Failed fetch critical stocks:", error);
    } finally {
      setKritikModalLoading(false);
    }
  };

  const handleEditDrawerOpen = useCallback((record) => {
    if (!record) return;
    setSelectedKritikRow({ key: record?.TB_STOK_ID ?? record?.STK_KOD, ...record });
    setEditDrawerVisible(true);
  }, []);

  const kritikColumns = useMemo(() => [
    {
      title: "Stok Tanım",
      dataIndex: "STK_TANIM",
      key: "STK_TANIM",
      render: (text, record) => (
        <Text style={{ color: "#1677ff", cursor: "pointer" }} onClick={() => handleEditDrawerOpen(record)}>{text}</Text>
      ),
    },
    { title: "Tip", dataIndex: "STK_TIP", key: "STK_TIP" },
    { title: "Birim", dataIndex: "STK_BIRIM", key: "STK_BIRIM" },
    { title: "Mevcut Miktar", dataIndex: "STK_MIKTAR", key: "STK_MIKTAR" },
    { title: "Kritik Miktar", dataIndex: "STK_KRITIK_STOK_MIKTAR", key: "STK_KRITIK_STOK_MIKTAR" },
    { title: "Durum", dataIndex: "STK_DURUM", key: "STK_DURUM" },
  ], [handleEditDrawerOpen]);

  return (
    <div style={{ width: "100%", height: "100%", borderRadius: "5px", backgroundColor: "white", display: "flex", flexDirection: "column", gap: "10px", border: "1px solid #f0f0f0" }}>
      <div style={{ padding: "10px" }}>
        <Text style={{ fontWeight: "500", fontSize: "17px" }}>Özet Durum</Text>
      </div>
      
      {isLoading ? (
        <div style={{ padding: "20px", textAlign: "center" }}><Spin /></div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "7px", overflow: "auto", height: "100vh" }}>
          {reportData.map((item, index) => {
            const color = colors[index % colors.length];
            
            return (
              <div
                key={index}
                // Eğer özel modal açılması gereken bir rapor adı varsa buraya şart eklenebilir
                onClick={() => {
                   if(item.RaporAdi.includes("Kritik")) {
                       setKritikModalVisible(true);
                       fetchKritikStoklar();
                   }
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  padding: "8px 10px",
                  borderBottom: "1px solid #f0f0f0",
                  cursor: "default",
                }}
              >
                <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "10px", flex: 1, minWidth: 0 }}>
                  <div style={{ width: "10px", height: "10px", backgroundColor: color, borderRadius: "50%", flexShrink: 0 }}></div>
                  <Text ellipsis={{ tooltip: item.RaporAdi }} style={{ fontSize: "13px" }}> {item.RaporAdi} </Text>
                </div>

                <div style={{
                  borderRadius: "10px",
                  backgroundColor: `${color}1A`, // %10 opacity (Hex 1A)
                  padding: "2px 10px",
                  marginLeft: "10px",
                  border: `1px solid ${color}33`, // %20 opacity
                  flexShrink: 0
                }}>
                  <Text style={{ color: color, fontWeight: "600", fontSize: "12px", whiteSpace: "nowrap" }}>
                    {item.RaporDegeri}
                  </Text>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Mevcut Modallar */}
      <Modal width="90%" centered destroyOnClose title={modalTitle} open={isModalVisible} onCancel={() => setIsModalVisible(false)} footer={null}>
        {modalContent}
      </Modal>

      <Modal width={1400} destroyOnClose centered title="Kritik Stoklar" open={kritikModalVisible} onCancel={handleKritikModalClose} footer={null} zIndex={900}>
        <Table columns={kritikColumns} dataSource={kritikModalData} loading={kritikModalLoading} rowKey="TB_STOK_ID" />
      </Modal>
    </div>
  );
}

export default Component5;