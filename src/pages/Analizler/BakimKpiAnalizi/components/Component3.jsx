import React, { useState, useEffect } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Spin, Card, Typography } from "antd";
import AxiosInstance from "../../../../api/http.jsx";
import { useFormContext } from "react-hook-form";
import dayjs from "dayjs";

const { Text } = Typography;

// Görseldeki renk paleti (Sarı, Açık Yeşil, Koyu Yeşil, Mavi, Turkuaz vb.)
const COLORS = ["#FADB14", "#52C41A", "#135200", "#1890FF", "#13C2C2", "#FAAD14"];

// Özel Etiket Bileşeni (Çizgi ve Renkli Yazı)
const renderCustomizedLabel = (props) => {
  const { cx, cy, midAngle, innerRadius, outerRadius, percent, index, name, fill } = props;
  const RADIAN = Math.PI / 180;
  // Etiketin merkeze uzaklığı
  const radius = outerRadius + 25; 
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  
  // Metni sağa veya sola hizala
  const textAnchor = x > cx ? 'start' : 'end';

  return (
    <text 
      x={x} 
      y={y} 
      fill={fill} // Metin rengi dilim rengiyle aynı olsun
      textAnchor={textAnchor} 
      dominantBaseline="central"
      fontSize={11}
      fontWeight="500"
    >
      {`${name} %${(percent * 100).toFixed(0)}`}
    </text>
  );
};

function DurusNedenleriKatki() {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState([]);
  const { watch } = useFormContext();

  const lokasyonIds = watch("locationIds");
  const makineIds = watch("makineIds");
  const makineTipIds = watch("makineTipIds");
  const baslangicTarihi = watch("baslangicTarihi");
  const bitisTarihi = watch("bitisTarihi");

  const body = {
    StartDate: baslangicTarihi 
      ? dayjs(baslangicTarihi).format("YYYY-MM-DD") 
      : dayjs().subtract(1, "year").format("YYYY-MM-DD"),
    EndDate: bitisTarihi 
      ? dayjs(bitisTarihi).format("YYYY-MM-DD") 
      : dayjs().format("YYYY-MM-DD"),
    MakineIds: Array.isArray(makineIds) ? makineIds : (makineIds ? [makineIds] : []),
    LokasyonIds: Array.isArray(lokasyonIds) ? lokasyonIds : (lokasyonIds ? [lokasyonIds] : []),
    MakineTipIds: Array.isArray(makineTipIds) ? makineTipIds : (makineTipIds ? [makineTipIds] : []),
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await AxiosInstance.post("GetDurusNedenleriPieChart", body);
        if (response.Data) setData(response.Data);
      } catch (error) {
        console.error("Data fetch error:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [lokasyonIds, makineIds, makineTipIds, baslangicTarihi, bitisTarihi]);

  return (
    <div style={{ width: "100%", height: "100%", padding: "5px" }}>
      <Card
        style={{ borderRadius: "16px", height: "100%", border: "1px solid #f0f0f0", display: "flex", flexDirection: "column", overflow: "hidden" }}
        bodyStyle={{ flex: 1, display: "flex", flexDirection: "column", padding: "15px", height: "100%", overflow: "hidden" }}
        title={<Text strong>Duruş Nedenleri Katkı (%)</Text>}
      >
        {isLoading ? (
          <Spin style={{ margin: "auto" }} />
        ) : (
          <div style={{ flex: 1, width: "100%", minHeight: 0 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="45%" // Grafiği biraz yukarı alıp lejanta yer açıyoruz
                  innerRadius={40}
                  outerRadius={90} // Etiketler sığsın diye radius küçültüldü
                  paddingAngle={2}
                  dataKey="ToplamSure"
                  nameKey="Neden"
                  label={renderCustomizedLabel} // Özel etiket fonksiyonu
                  labelLine={{ stroke: '#d9d9d9', strokeWidth: 1 }} // Gri ince çizgi
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} dk`, "Süre"]} />
                <Legend 
                  layout="horizontal" 
                  verticalAlign="bottom" 
                  align="center" 
                  iconType="circle"
                  wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </Card>
    </div>
  );
}

export default DurusNedenleriKatki;