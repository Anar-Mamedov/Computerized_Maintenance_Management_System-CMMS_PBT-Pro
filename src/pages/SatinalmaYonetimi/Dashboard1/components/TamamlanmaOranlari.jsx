import React, { useState, useEffect, useRef } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LabelList,
  ResponsiveContainer,
} from "recharts";
import {
  Button,
  Popover,
  Spin,
  Typography,
  Modal,
  Tour,
} from "antd";
import AxiosInstance from "../../../../api/http.jsx";
import { MoreOutlined, PrinterOutlined } from "@ant-design/icons";
import html2pdf from "html2pdf.js";

const { Text } = Typography;

function MalzemeTipSiparisGrafigi(props = {}) {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isExpandedModalVisible, setIsExpandedModalVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const ref1 = useRef(null);
  
  const [visibleSeries, setVisibleSeries] = useState({
    SiparisAdedi: true,
    ToplamTutar: true,
  });

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await AxiosInstance.get("getMalzemeSiparis");

      // Veriyi formatla: String tutarı sayıya çevir
      const transformedData = response.data.map((item) => {
        const numericValue = parseFloat(
          item.ToplamTutar.replace(/\./g, "").replace(",", ".")
        );
        return {
          name: item.MalzemeTipAdi,
          SiparisAdedi: item.SiparisAdedi,
          ToplamTutar: numericValue,
        };
      });

      setData(transformedData);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const downloadPDF = () => {
    const element = document.getElementById("malzeme-siparis-grafigi");
    const opt = {
      margin: 10,
      filename: "malzeme_siparis_raporu.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "mm", format: "a4", orientation: "landscape" },
    };
    html2pdf().set(opt).from(element).save();
  };

  const handleLegendClick = (dataKey) => {
    setVisibleSeries((prev) => ({
      ...prev,
      [dataKey]: !prev[dataKey],
    }));
  };

  const CustomLegend = ({ payload }) => {
    const customNames = {
      SiparisAdedi: "Sipariş Adedi",
      ToplamTutar: "Toplam Tutar (₺)",
    };

    return (
      <ul style={{ listStyle: "none", padding: 0, display: "flex", gap: "15px", justifyContent: "center", margin: 0, flexWrap: "wrap" }}>
        {payload.map((entry, index) => (
          <li
            key={`item-${index}`}
            style={{ cursor: "pointer", color: visibleSeries[entry.dataKey] ? entry.color : "gray" }}
            onClick={() => handleLegendClick(entry.dataKey)}
          >
            <span style={{ display: "inline-block", width: "10px", height: "10px", backgroundColor: visibleSeries[entry.dataKey] ? entry.color : "gray", marginRight: "5px" }}></span>
            {customNames[entry.dataKey] || entry.value}
          </li>
        ))}
      </ul>
    );
  };

  const content = (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      <div style={{ cursor: "pointer" }} onClick={() => setIsExpandedModalVisible(true)}>Büyüt</div>
      <div style={{ cursor: "pointer" }} onClick={() => fetchData()}>Yenile</div>
      <div style={{ cursor: "pointer" }} onClick={() => setOpen(true)}>Bilgi</div>
    </div>
  );

  return (
    <div style={{ width: "100%", height: "100%", borderRadius: "5px", backgroundColor: "white", display: "flex", flexDirection: "column", gap: "10px", border: "1px solid #f0f0f0" }}>
      <div style={{ padding: "10px", display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <Text style={{ fontWeight: "500", fontSize: "17px" }}>Malzeme Tiplerine Göre Sipariş Dağılımı</Text>
        <Popover placement="bottom" content={content} trigger="click">
          <Button type="text" icon={<MoreOutlined />} />
        </Popover>
      </div>

      {isLoading ? <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}><Spin /></div> : (
        <div style={{ flex: 1, padding: "10px", minHeight: "350px" }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" interval={0} height={80} tick={{ fontSize: 11 }} />
              <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
              <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" tickFormatter={(val) => val.toLocaleString('tr-TR')} />
              <Tooltip formatter={(value, name) => [value.toLocaleString('tr-TR'), name === "ToplamTutar" ? "Toplam Tutar (₺)" : "Sipariş Adedi"]} />
              <Legend content={<CustomLegend />} />
              <Bar yAxisId="left" dataKey="SiparisAdedi" fill="#8884d8" hide={!visibleSeries.SiparisAdedi} name="Sipariş Adedi" />
              <Bar yAxisId="right" dataKey="ToplamTutar" fill="#82ca9d" hide={!visibleSeries.ToplamTutar} name="Toplam Tutar">
                <LabelList dataKey="ToplamTutar" position="top" formatter={(val) => val > 5000 ? val.toLocaleString('tr-TR') : ""} style={{ fontSize: '10px' }} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      <Tour open={open} onClose={() => setOpen(false)} steps={[{ title: "Malzeme Sipariş Analizi", description: "Farklı malzeme tiplerinin sipariş adetlerini ve maliyet yüklerini karşılaştırmalı olarak gösterir.", target: () => ref1.current }]} />

      <Modal
        title={
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "98%" }}>
            <Text>Malzeme Tiplerine Göre Sipariş Analizi</Text>
            <PrinterOutlined style={{ cursor: "pointer", fontSize: "20px" }} onClick={downloadPDF} />
          </div>
        }
        centered
        open={isExpandedModalVisible}
        onCancel={() => setIsExpandedModalVisible(false)}
        width="95%"
        footer={null}
        destroyOnClose
      >
        <div id="malzeme-siparis-grafigi" style={{ height: "calc(100vh - 250px)" }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 100 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" interval={0} tick={{ fontSize: 12 }} />
              <YAxis yAxisId="left" stroke="#8884d8" label={{ value: 'Adet', angle: -90, position: 'insideLeft' }} />
              <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" label={{ value: 'Tutar (₺)', angle: 90, position: 'insideRight' }} tickFormatter={(val) => val.toLocaleString('tr-TR')} />
              <Tooltip formatter={(val) => val.toLocaleString('tr-TR')} />
              <Legend content={<CustomLegend />} />
              <Bar yAxisId="left" dataKey="SiparisAdedi" fill="#8884d8" />
              <Bar yAxisId="right" dataKey="ToplamTutar" fill="#82ca9d">
                <LabelList dataKey="ToplamTutar" position="top" formatter={(val) => val.toLocaleString('tr-TR')} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Modal>
    </div>
  );
}

export default MalzemeTipSiparisGrafigi;