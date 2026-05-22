import React from "react";
import { Spin, Typography, Card } from "antd";

const { Text } = Typography;

// Ana ekrandan (widget14) beslenecek şekilde propları içeriye alıyoruz kanka
function IsEmriOzetPaneli({
  personelVerimliligiSaat,
  planlananBakimaUyumYuzde,
  enYuksekMaliyetliIsEmriAd,
  enYuksekMaliyetliTutar,
  enUzunSurenIsEmriAd,
  loading
}) {

  const stats = [
    {
      title: "Ortalama Tamamlanma Süresi",
      value: "2,8 gün", 
      subText: "Toplam süre / iş emri",
    },
    {
      title: "Personel Verimliliği",
      value: `${personelVerimliligiSaat || "6,4"} saat`, 
      subText: "Çalışma süresi / personel",
    },
    {
      title: "Planlanan Bakıma Uyum",
      value: `%${planlananBakimaUyumYuzde || "91,4"}`, 
      subText: "Zamanında tamamlanan",
    },
    {
      title: "Geciken İş Emri Sayısı",
      value: "74", 
      subText: "Planlanan bitiş aşıldı",
    },
    {
      title: "En Yüksek Maliyetli İş Emri",
      value: enYuksekMaliyetliTutar 
        ? `₺${new Intl.NumberFormat('tr-TR').format(enYuksekMaliyetliTutar)}`
        : "₺28.400", 
      subText: enYuksekMaliyetliIsEmriAd || "Mekanik revizyon",
    },
    {
      title: "En Uzun Süren İş Emri",
      value: "36 saat", 
      subText: enUzunSurenIsEmriAd || "Ana konveyör onarım",
    },
  ];

  return (
    <div style={{ padding: "10px", backgroundColor: "#ffffff", borderRadius: "8px", width: "100%", height: "auto", display: "flex", flexDirection: "column" }}>
      
      {/* Başlık Alanı */}
      <div style={{ marginBottom: "8px" }}>
        <Text style={{ fontWeight: "600", fontSize: "13px", color: "#1f1f1f" }}>
          İş Emri Özet Paneli
        </Text>
      </div>

      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", flex: 1, minHeight: "50px" }}>
          <Spin size="small" />
        </div>
      ) : (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", width: "100%", flex: 1 }}>
          {stats.map((item, index) => (
            <div 
              key={index} 
              style={{ 
                flex: "1 1 100px", 
                minWidth: "100px"
              }}
            >
              <Card
                bordered={true}
                style={{
                  borderRadius: "6px",
                  height: "100%",
                  border: "1px solid #f0f0f0",
                  boxShadow: "none"
                }}
                bodyStyle={{ padding: "6px 10px" }} // Kanka dikey dolguyu kıstık, kartlar iyice ince şerit oldu
              >
                <div style={{ display: "flex", flexDirection: "column", gap: "0px" }}>
                  {/* Üst Başlık */}
                  <Text type="secondary" style={{ fontSize: "10px", fontWeight: "400", color: "#8c8c8c", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {item.title}
                  </Text>
                  
                  {/* Sayısal Değer */}
                  <Text style={{ fontSize: "14px", fontWeight: "700", color: "#1f1f1f", margin: "1px 0" }}>
                    {item.value}
                  </Text>
                  
                  {/* Alt Açıklama */}
                  <Text type="secondary" style={{ fontSize: "10px", color: "#bfbfbf", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {item.subText}
                  </Text>
                </div>
              </Card>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default IsEmriOzetPaneli;