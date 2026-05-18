import React, { useState, useEffect } from "react";
import { Spin, Typography, Row, Col, Card } from "antd";
import AxiosInstance from "../../../../api/http.jsx";
import { useFormContext } from "react-hook-form";
import dayjs from "dayjs";

const { Text, Title } = Typography;

function IsEmriOzetPaneli() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { watch } = useFormContext();

  const lokasyonId = watch("locationIds");
  const atolyeId = watch("atolyeIds");
  const makineId = watch("makineIds");
  const baslangicTarihi = watch("baslangicTarihi");
  const bitisTarihi = watch("bitisTarihi");

  const fetchData = async () => {
    setIsLoading(true);
    const body = {
      LokasyonId: lokasyonId || "",
      AtolyeId: atolyeId || "",
      MakineId: makineId || "",
      BaslangicTarih: baslangicTarihi ? dayjs(baslangicTarihi).format("YYYY-MM-DD") : "",
      BitisTarih: bitisTarihi ? dayjs(bitisTarihi).format("YYYY-MM-DD") : "",
    };

    try {
      // API endpoint'ini kendi backend yapına göre güncellemelisin
      const response = await AxiosInstance.post(`GetIsEmriOzetStats`, body);
      setData(response);
    } catch (error) {
      console.error("Veri çekme hatası:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [lokasyonId, atolyeId, makineId, baslangicTarihi, bitisTarihi]);

  // Fotoğraftaki her bir kartın şablonu
  const stats = [
    {
      title: "Ortalama Tamamlanma Süresi",
      value: `${data?.OrtalamaTamamlanmaSuresi || 0} gün`,
      subText: "Toplam süre / iş emri",
    },
    {
      title: "Personel Verimliliği",
      value: `${data?.PersonelVerimliligi || 0} saat`,
      subText: "Çalışma süresi / personel",
    },
    {
      title: "Planlanan Bakıma Uyum",
      value: `%${data?.BakimUyum || 0}`,
      subText: "Zamanında tamamlanan",
    },
    {
      title: "Geciken İş Emri Sayısı",
      value: data?.GecikenIsEmri || 0,
      subText: "Planlanan bitiş aşıldı",
      valueStyle: { color: "#cf1322" } // Gecikme olduğu için kırmızı tonu
    },
    {
      title: "En Yüksek Maliyetli İş Emri",
      value: `₺${new Intl.NumberFormat('tr-TR').format(data?.EnYuksekMaliyet || 0)}`,
      subText: data?.EnYuksekMaliyetAciklama || "Mekanik revizyon",
    },
    {
      title: "En Uzun Süren İş Emri",
      value: `${data?.EnUzunSure || 0} saat`,
      subText: data?.EnUzunSureAciklama || "Ana konveyör onarım",
    },
  ];

  return (
    <div style={{ padding: "20px", backgroundColor: "#f8f9fa", borderRadius: "8px" }}>
      <Title level={4} style={{ marginBottom: "20px", fontWeight: 600 }}>
        İş Emri Özet Paneli
      </Title>
      
      {isLoading ? (
        <div style={{ textAlign: "center", padding: "50px" }}><Spin size="large" /></div>
      ) : (
        <Row gutter={[16, 16]}>
          {stats.map((item, index) => (
            <Col key={index} xs={24} sm={12} md={8} lg={4}>
              <Card
                bordered={true}
                style={{
                  borderRadius: "12px",
                  height: "100%",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.05)"
                }}
                bodyStyle={{ padding: "16px" }}
              >
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <Text type="secondary" style={{ fontSize: "12px", fontWeight: "500" }}>
                    {item.title}
                  </Text>
                  <Text style={{ fontSize: "20px", fontWeight: "700", ...item.valueStyle }}>
                    {item.value}
                  </Text>
                  <Text type="secondary" style={{ fontSize: "11px" }}>
                    {item.subText}
                  </Text>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
}

export default IsEmriOzetPaneli;