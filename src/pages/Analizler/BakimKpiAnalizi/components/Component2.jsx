import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Spin, Card, Typography } from "antd";
import AxiosInstance from "../../../../api/http.jsx";
import { useFormContext } from "react-hook-form";
import dayjs from "dayjs";

const { Text } = Typography;

function EnSikArizaNedenleri() {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState([]);
  const { watch } = useFormContext();

  // Formdan verileri anlık izle
  const lokasyonIds = watch("locationIds");
  const makineIds = watch("makineIds");
  const makineTipIds = watch("makineTipIds");
  const baslangicTarihi = watch("baslangicTarihi");
  const bitisTarihi = watch("bitisTarihi");

  // API Body Hazırlığı (İstenen JSON Formatına Uygun)
  const body = {
    // Tarih varsa formatla, yoksa son 1 yılı al
    StartDate: baslangicTarihi 
      ? dayjs(baslangicTarihi).format("YYYY-MM-DD") 
      : dayjs().subtract(1, "year").format("YYYY-MM-DD"),
    
    EndDate: bitisTarihi 
      ? dayjs(bitisTarihi).format("YYYY-MM-DD") 
      : dayjs().format("YYYY-MM-DD"),

    // ID alanları dizi (array) olmalı. Seçim yoksa boş dizi [] (Tümü anlamına gelir)
    MakineIds: Array.isArray(makineIds) ? makineIds : (makineIds ? [makineIds] : []),
    LokasyonIds: Array.isArray(lokasyonIds) ? lokasyonIds : (lokasyonIds ? [lokasyonIds] : []),
    MakineTipIds: Array.isArray(makineTipIds) ? makineTipIds : (makineTipIds ? [makineTipIds] : []),
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await AxiosInstance.post("GetTopArizaNedenleriChart", body);
        if (response.Data) {
            setData(response.Data);
        }
      } catch (error) {
        console.error("Data fetch error:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
    // Dependency array: Bu değerler değiştiğinde grafik güncellenir
  }, [lokasyonIds, makineIds, makineTipIds, baslangicTarihi, bitisTarihi]);

  return (
    <div style={{ width: "100%", height: "100%", padding: "5px" }}>
      <Card
        style={{ 
          borderRadius: "16px", 
          height: "100%", 
          border: "1px solid #f0f0f0", 
          display: "flex", 
          flexDirection: "column", 
          overflow: "hidden" 
        }}
        bodyStyle={{ 
          flex: 1, 
          display: "flex", 
          flexDirection: "column", 
          padding: "15px", 
          height: "100%", 
          overflow: "hidden" 
        }}
        title={<Text strong>En Sık Arıza Nedenleri</Text>}
      >
        {isLoading ? (
          <Spin style={{ margin: "auto" }} />
        ) : (
          <div style={{ flex: 1, width: "100%", minHeight: 0 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={data}
                margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" hide />
                {/* Y Eksenindeki metinlerin sığması için width değerini korudum */}
                <YAxis 
                  dataKey="Neden" 
                  type="category" 
                  width={110} 
                  tick={{ fontSize: 11 }} 
                  interval={0} 
                  tickLine={false} 
                  axisLine={false} 
                />
                <Tooltip cursor={{ fill: 'transparent' }} />
                <Bar 
                  dataKey="Sayi" 
                  name="Adet" 
                  fill="#52c41a" 
                  radius={[0, 4, 4, 0]} 
                  barSize={20} 
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </Card>
    </div>
  );
}

export default EnSikArizaNedenleri;