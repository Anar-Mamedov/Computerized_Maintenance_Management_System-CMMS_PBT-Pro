import React from "react";
import { Spin, Typography, Row, Col, Card } from "antd";

const { Text, Title } = Typography;

// Ana ekrandan (widget14) beslenecek şekilde propları içeriye alıyoruz kanka
function IsEmriOzetPaneli({
  personelVerimliligiSaat,
  planlananBakimaUyumYuzde,
  enYuksekMaliyetliIsEmriAd,
  enYuksekMaliyetliTutar,
  enUzunSurenIsEmriAd,
  loading
}) {

  // Fotoğraftaki kart şablonu - Değerleri doğrudan proplardan besliyoruz
  const stats = [
    {
      title: "Ortalama Tamamlanma Süresi",
      value: "0 gün", // Burası ana dashboard datasında yoksa sabit kalabilir veya prop ekleyebilirsin kanka
      subText: "Toplam süre / iş emri",
    },
    {
      title: "Personel Verimliliği",
      value: `${personelVerimliligiSaat || 0} saat`,
      subText: "Çalışma süresi / personel",
    },
    {
      title: "Planlanan Bakıma Uyum",
      value: `%${planlananBakimaUyumYuzde || 0}`,
      subText: "Zamanında tamamlanan",
    },
    {
      title: "Geciken İş Emri Sayısı",
      value: 0, // Burası da ana dashboard datasında yoksa sabit veya prop eklenebilir
      subText: "Planlanan bitiş aşıldı",
      valueStyle: { color: "#cf1322" }
    },
    {
      title: "En Yüksek Maliyetli İş Emri",
      value: `₺${new Intl.NumberFormat('tr-TR').format(enYuksekMaliyetliTutar || 0)}`,
      subText: enYuksekMaliyetliIsEmriAd || "Mekanik revizyon",
    },
    {
      title: "En Uzun Süren İş Emri",
      value: "0 saat", // Ana dashboard verisine göre manipüle edebilirsin
      subText: enUzunSurenIsEmriAd || "Ana konveyör onarım",
    },
  ];

  return (
  <div style={{ padding: "50px", backgroundColor: "#f8f9fa", borderRadius: "8px", width: "100%" }}>
    <Title level={4} style={{ marginBottom: "20px", fontWeight: 600 }}>
      İş Emri Özet Paneli
    </Title>
    
    {loading ? (
      <div style={{ textAlign: "center", padding: "50px" }}><Spin size="large" /></div>
    ) : (
      // Ant'ın Row bileşeni yerine monitörün genişliğini %100 kullanan esnek flex container
      <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", width: "100%" }}>
        {stats.map((item, index) => (
          <div 
            key={index} 
            style={{ 
              flex: "1 1 150px", // EN KRİTİK YER: Kartlar monitöre göre büyür (1), küçülür (1) ve minimum 150px olur.
              minWidth: "140px"  // Ekran çok daralırsa birbirinin üzerine binmesin diye emniyet sibobu
            }}
          >
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
          </div>
        ))}
      </div>
    )}
  </div>
)
}

export default IsEmriOzetPaneli;