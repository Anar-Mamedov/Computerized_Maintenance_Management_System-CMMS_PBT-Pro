import React, { useCallback, useState, useEffect } from "react";
import { Drawer, Table, Typography, Tag, Progress, Row, Col, Divider, Spin } from "antd";
import AxiosInstance from "../../../../../../api/http";
import { EnvironmentOutlined, InfoCircleOutlined, CloseOutlined } from "@ant-design/icons";

const { Text, Title } = Typography;

export default function DepoDetayDrawer({ selectedRows, isExternalOpen, onExternalClose }) {
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);

  // API'den veri çekme fonksiyonu
  const fetchData = useCallback(async () => {
    if (!selectedRows || selectedRows.length === 0) return;
    
    setLoading(true);
    const targetId = selectedRows[0]?.TB_DEPO_ID || selectedRows[0]?.key;
    try {
      const response = await AxiosInstance.get(`GetYakitTankDashboardBy?id=${targetId}`);
      // API cevabı direkt dönüyorsa response, bir data key'i içindeyse response.data
      setData(response || {}); 
    } catch (err) {
      console.error("API Error:", err);
      setData({}); 
    } finally {
      setLoading(false);
    }
  }, [selectedRows]);

  // Güncelleme ekranındaki "Detay" butonuna basıldığında (isExternalOpen değiştiğinde) tetiklenir
  useEffect(() => {
    if (isExternalOpen) {
      fetchData();
      setIsDrawerVisible(true);
    }
  }, [isExternalOpen, fetchData]);

  // Drawer kapatma yönetimi
  const handleClose = () => {
    setIsDrawerVisible(false);
    if (onExternalClose) onExternalClose();
  };

  // ContextMenu üzerinden tıklandığında açma fonksiyonu
  const handleDrawerToggle = () => {
    if (!isDrawerVisible) fetchData();
    setIsDrawerVisible(!isDrawerVisible);
  };

  const colorMapper = (status) => {
    switch (status) {
      case "success": return "success";
      case "warning": return "warning";
      case "danger": return "error";
      default: return "default";
    }
  };

  const columns = [
    { title: "Zaman", dataIndex: "Zaman", key: "Zaman", render: (t) => <Text type="secondary">{t || "-"}</Text> },
    {
      title: "Tip",
      dataIndex: "Tip",
      key: "Tip",
      render: (text, record) => (
        <Tag color={colorMapper(record.TipClass)} style={{ borderRadius: "10px", minWidth: "60px", textAlign: 'center' }}>
          {text || "İşlem"}
        </Tag>
      ),
    },
    { title: "Miktar", dataIndex: "Miktar", key: "Miktar", render: (t) => <Text strong>{t || "0 L"}</Text> },
    { title: "Açıklama", dataIndex: "Aciklama", key: "Aciklama" },
  ];

  return (
    <>
      {/* Eğer isExternalOpen tanımsızsa (ContextMenu kullanımı), tetikleyici butonu göster.
        Güncelleme ekranında isExternalOpen true/false geleceği için bu kısım render olmaz.
      */}
      {isExternalOpen === undefined && (
        <div 
          onClick={handleDrawerToggle} 
          className="menu-item-hover"
          style={{ 
            cursor: 'pointer', 
            padding: '8px 12px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}
        >
          <InfoCircleOutlined style={{ fontSize: '18px', color: '#535c68' }} />
            <div>
              <div style={{ fontWeight: '500', fontSize: '14px' }}>Depo Detayı</div>
              <div style={{ fontSize: '12px', color: '#8c8c8c' }}>Stok ve Trend</div>
            </div>
        </div>
      )}

      <Drawer
        title="Depo Detay Analizi"
        placement="right"
        width={450}
        onClose={handleClose}
        open={isDrawerVisible}
        extra={<CloseOutlined onClick={handleClose} style={{ cursor: 'pointer' }} />}
        closable={false}
        zIndex={1500} // EditDrawer'ın (1000) her zaman üzerinde olması için
      >
        <Spin spinning={loading}>
          <div style={{ paddingBottom: '20px' }}>
            {/* Üst Bilgi Alanı */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <Text type="secondary" style={{ fontSize: "11px" }}>{data?.DEP_KOD || "..."}</Text>
                <Title level={4} style={{ margin: '2px 0 0 0', fontSize: '18px' }}>{data?.DEP_TANIM || "Bilinmeyen Depo"}</Title>
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  <EnvironmentOutlined /> {data?.LOKASYON_VE_TIP || "-"}
                </Text>
              </div>
              <Tag color={colorMapper(data?.DURUM_CLASS)} style={{ borderRadius: "12px", padding: '0 10px' }}>
                ● {data?.DURUM_TEXT || "Bilinmiyor"}
              </Tag>
            </div>

            {/* Mevcut Stok Kartı */}
            <div style={{ marginTop: "20px", padding: "16px", background: "#f8f9fa", borderRadius: "12px", border: '1px solid #f0f0f0' }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                <div>
                  <Text type="secondary" style={{ fontSize: '12px' }}>Mevcut Stok</Text>
                  <div style={{ fontSize: "22px", fontWeight: "bold", color: data?.MEVCUT_STOK === 0 ? '#faad14' : '#262626' }}>
                     {(data?.MEVCUT_STOK || 0).toLocaleString()} L
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <Text type="secondary" style={{ fontSize: '12px' }}>Kapasite</Text>
                  <div style={{ fontSize: "16px" }}>{(data?.KAPASITE || 0).toLocaleString()} L</div>
                </div>
              </div>
              <Progress 
                  percent={data?.DOLULUK_ORANI || 0} 
                  strokeColor={data?.DURUM_CLASS === 'danger' ? '#ff4d4f' : '#2ecc71'} 
                  showInfo={false} 
                  strokeWidth={12}
                  trailColor="#e6e6e6" 
              />
              <div style={{ textAlign: "right", marginTop: "4px" }}>
                <Text strong style={{ color: '#595959' }}>%{data?.DOLULUK_ORANI || 0} Doluluk</Text>
              </div>
            </div>

            {/* Giriş-Çıkış Özet */}
            <Row gutter={12} style={{ marginTop: "16px" }}>
              <Col span={12}>
                <div style={{ border: "1px solid #f0f0f0", padding: "10px", borderRadius: "8px", textAlign: 'center' }}>
                  <Text type="secondary" style={{ fontSize: "11px", display: 'block' }}>Bugün Giriş</Text>
                  <Text strong style={{ color: "#52c41a", fontSize: "15px" }}>+{(data?.BUGUN_GIRIS || 0).toLocaleString()} L</Text>
                </div>
              </Col>
              <Col span={12}>
                <div style={{ border: "1px solid #f0f0f0", padding: "10px", borderRadius: "8px", textAlign: 'center' }}>
                  <Text type="secondary" style={{ fontSize: "11px", display: 'block' }}>Bugün Çıkış</Text>
                  <Text strong style={{ color: "#faad14", fontSize: "15px" }}>-{(data?.BUGUN_CIKIS || 0).toLocaleString()} L</Text>
                </div>
              </Col>
            </Row>

            {/* Günlük Trend Alanı */}
            <Divider orientation="left" style={{ fontSize: "12px", color: "#8c8c8c", margin: '30px 0 15px 0' }}>Son 7 Günlük Trend</Divider>
            <div style={{ padding: '0 4px' }}>
              {(data?.GunlukTrend || []).map((item, index) => (
                <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px', gap: '10px' }}>
                  <Text style={{ width: '35px', fontSize: '12px', fontWeight: '500' }}>{item.GunAdi}</Text>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                      <Progress 
                        percent={data?.KAPASITE > 0 ? (item.GirisMiktari / data.KAPASITE) * 100 : 0} 
                        size="small" strokeColor="#52c41a" showInfo={false} trailColor="#f5f5f5"
                      />
                      <Progress 
                        percent={data?.KAPASITE > 0 ? (item.CikisMiktari / data.KAPASITE) * 100 : 0} 
                        size="small" strokeColor="#faad14" showInfo={false} trailColor="#f5f5f5"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Tablo Alanı */}
            <Divider orientation="left" style={{ fontSize: "12px", color: "#8c8c8c", margin: '30px 0 15px 0' }}>Son Hareket Kayıtları</Divider>
            <Table 
              columns={columns} 
              dataSource={data?.SonHareketler || []} 
              pagination={false} 
              size="small" 
              rowKey={(record, idx) => idx}
              style={{ border: '1px solid #f0f0f0', borderRadius: '8px', overflow: 'hidden' }}
            />
          </div>
        </Spin>
      </Drawer>
    </>
  );
}