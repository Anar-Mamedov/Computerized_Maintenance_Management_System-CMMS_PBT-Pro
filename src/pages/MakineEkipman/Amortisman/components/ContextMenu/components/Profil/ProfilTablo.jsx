import React, { useState, useEffect, useCallback } from "react";
import { Card, Tag, Typography, Button, Spin, Empty } from "antd";
import AxiosInstance from "../../../../../../../api/http";
import Profil from "./components/Profil"; // Import yolunun doğruluğundan emin ol kanka

const { Title, Text, Paragraph } = Typography;

const ProfilTablo = () => {
  const [loading, setLoading] = useState(false);
  const [profiles, setProfiles] = useState([]);
  
  // MODAL KONTROLÜ İÇİN STATE'LER
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const fetchProfiles = useCallback(() => {
    setLoading(true);
    AxiosInstance.get(`GetAmortismanProfilList`)
      .then((res) => {
        if (res && res.has_error === false && Array.isArray(res.data)) {
          setProfiles(res.data);
        } else {
          setProfiles([]);
        }
      })
      .catch((error) => {
        console.error("API Hatası:", error);
        setProfiles([]);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchProfiles();
  }, [fetchProfiles]);

  // GÜNCELLE BUTONUNA TIKLANDIĞINDA
  const handleEdit = (item) => {
    setSelectedItem(item); // Tıklanan kartın verisini (ve ID'sini) state'e atıyoruz
    setIsModalOpen(true);  // Modalı açıyoruz
  };

  // MODAL KAPANDIĞINDA
  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}><Spin size="large" /></div>;

  if (!profiles || profiles.length === 0) {
    return <Empty description="Profil bulunamadı" />;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {profiles.map((item) => (
        <Card
          key={item.TB_AP_ID}
          size="small"
          style={{
            borderRadius: "12px",
            border: "1px solid #f0f0f0",
            boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
          }}
          styles={{ body: { padding: "16px" } }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <Text type="secondary" style={{ fontSize: "11px", fontWeight: 600 }}>
                {item.Kod}
              </Text>
              <Title level={5} style={{ margin: "4px 0", display: "flex", alignItems: "center", gap: "8px" }}>
                {item.Ad}
                {item.Varsayilan && (
                  <Tag color="blue" style={{ borderRadius: "4px", fontSize: "10px", margin: 0 }}>
                    Varsayılan
                  </Tag>
                )}
              </Title>
            </div>
            <Button 
              type="link" 
              size="small" 
              style={{ color: "#8c8c8c", fontWeight: 600 }}
              onClick={() => handleEdit(item)} 
            >
              Güncelle
            </Button>
          </div>

          <div style={{ margin: "10px 0" }}>
            <Tag style={{ borderRadius: "10px", backgroundColor: "#f5f5f5", border: "none", color: "#595959" }}>
              {item.AmacText}
            </Tag>
            <Tag style={{ borderRadius: "10px", backgroundColor: "#f5f5f5", border: "none", color: "#595959" }}>
              {item.YontemText}
            </Tag>
          </div>

          <Paragraph type="secondary" style={{ fontSize: "13px", margin: 0, lineHeight: "1.5", color: "#666" }}>
            {item.Aciklama}
          </Paragraph>
        </Card>
      ))}

      {/* PROFİL MODALI */}
      {/* updateData prop'una selectedItem'ı gönderiyoruz, Profil içindeki useEffect ID'yi yakalayıp detayı çekecek */}
      <Profil
        open={isModalOpen}
        onClose={handleModalClose}
        updateData={selectedItem} 
        onRefresh={fetchProfiles} 
      />
    </div>
  );
};

export default ProfilTablo;