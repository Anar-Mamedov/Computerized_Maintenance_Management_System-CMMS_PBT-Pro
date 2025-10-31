import React, { useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip as ReTooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Modal, Button } from "antd";
import { ExpandOutlined } from "@ant-design/icons";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#A28BFF",
  "#FF6B8A",
  "#FFB6C1",
  "#7B68EE",
  "#20B2AA",
];

const TalepDurumDagilimi = ({ talepDurumlari = [] }) => {
  const [open, setOpen] = useState(false);

  // Toplam adet sayısı
  const total = talepDurumlari.reduce((sum, item) => sum + (item.Adet || 0), 0);

  // İşlem yapılmadan direkt veriyi kullanıyoruz
  const processedData = talepDurumlari;

  return (
    <>
      {/* Küçük kart versiyonu */}
      <div style={{ width: "100%", height: 280, position: "relative" }}>
        <Button
          type="text"
          icon={<ExpandOutlined />}
          onClick={() => setOpen(true)}
          style={{ position: "absolute", top: 0, right: 0, zIndex: 10 }}
        />
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <ReTooltip formatter={(value, name) => [`${value} Adet`, name]} />
            <Legend verticalAlign="bottom" height={36} />
            <Pie
              data={processedData}
              dataKey="Adet"
              nameKey="Durum"
              cx="50%"
              cy="50%"
              outerRadius={100}
              innerRadius={20}
              labelLine={false}
              label={({ name, percent }) =>
                `${name} ${(percent * 100).toFixed(1)}%`
              }
            >
              {processedData.map((entry, idx) => (
                <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Modal içindeki büyük versiyon */}
      <Modal
  title="Malzeme Talepleri Durum Dağılımı (Detaylı Görünüm)"
  open={open}
  onCancel={() => setOpen(false)}
  footer={null}
  width={800}
>
  <div style={{ width: "100%", height: 500 }}>
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <ReTooltip formatter={(value, name) => [`${value} Adet`, name]} />
        {/* Legend altta olacak şekilde ayarlandı */}
        <Legend verticalAlign="bottom" align="center" layout="horizontal" height={36} />
        <Pie
          data={processedData}
          dataKey="Adet"
          nameKey="Durum"
          cx="50%"
          cy="50%"
          outerRadius={150}
          innerRadius={30}
          labelLine={true}
          label={({ name, percent }) =>
            `${name} ${(percent * 100).toFixed(1)}%`
          }
        >
          {processedData.map((entry, idx) => (
            <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  </div>
</Modal>
    </>
  );
};

export default TalepDurumDagilimi;