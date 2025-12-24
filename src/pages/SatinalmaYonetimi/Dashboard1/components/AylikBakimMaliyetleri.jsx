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
  DatePicker,
  Tour,
} from "antd";
import AxiosInstance from "../../../../api/http.jsx";
import { MoreOutlined, PrinterOutlined } from "@ant-design/icons";
import { Controller, useFormContext } from "react-hook-form";
import dayjs from "dayjs";
import html2pdf from "html2pdf.js";

const { Text } = Typography;

function YillikHarcamaGrafigi(props = {}) {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isExpandedModalVisible, setIsExpandedModalVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [baslamaTarihi, setBaslamaTarihi] = useState();
  const [open, setOpen] = useState(false);
  const ref1 = useRef(null);
  const [visibleSeries, setVisibleSeries] = useState({
    ToplamTutar: true,
  });
  const { control, watch, setValue } = useFormContext();

  useEffect(() => {
    const yilSecimiValue = watch("yilSecimiYillikHarcama");
    if (!yilSecimiValue) {
      setBaslamaTarihi(dayjs().format("YYYY"));
    } else {
      setBaslamaTarihi(yilSecimiValue.format("YYYY"));
    }
  }, [watch("yilSecimiYillikHarcama")]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await AxiosInstance.get(
        `getYillikHarcama?year=${baslamaTarihi}`
      );

      // Veriyi formatla: String olan "44.530,00" değerini sayıya çevir
      const transformedData = response.data.map((item) => {
        // Virgül ve noktayı temizleyip float'a çeviriyoruz
        const numericValue = parseFloat(
          item.ToplamTutar.replace(/\./g, "").replace(",", ".")
        );
        return {
          AyAdi: item.AyAdi,
          ToplamTutar: numericValue,
          originalValue: item.ToplamTutar, // Tooltip'te orijinal string'i göstermek istersen
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
    if (baslamaTarihi) {
      fetchData();
    }
  }, [baslamaTarihi]);

  const downloadPDF = () => {
    const element = document.getElementById("yillik-harcama-grafigi");
    const opt = {
      margin: 10,
      filename: "yillik_harcama.pdf",
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
      ToplamTutar: "Toplam Harcama Tutarı",
    };

    return (
      <ul style={{ listStyle: "none", padding: 0, display: "flex", gap: "15px", justifyContent: "center", margin: 0 }}>
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
      <div style={{ cursor: "pointer" }} onClick={() => { setModalContent("Yıl Seç"); setIsModalVisible(true); }}>Yıl Seçimi</div>
      <div style={{ cursor: "pointer" }} onClick={() => setOpen(true)}>Bilgi</div>
    </div>
  );

  return (
    <div style={{ width: "100%", height: "100%", borderRadius: "5px", backgroundColor: "white", display: "flex", flexDirection: "column", gap: "10px", border: "1px solid #f0f0f0" }}>
      <div style={{ padding: "10px", display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <Text style={{ fontWeight: "500", fontSize: "17px" }}>
          Yıllık Harcama Grafiği {baslamaTarihi && ` (${baslamaTarihi})`}
        </Text>
        <Popover placement="bottom" content={content} trigger="click">
          <Button type="text" style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "0px 5px", height: "32px", zIndex: 3 }}>
            <MoreOutlined style={{ cursor: "pointer", fontWeight: "500", fontSize: "16px" }} />
          </Button>
        </Popover>
      </div>

      {isLoading ? <Spin /> : (
        <div style={{ flex: 1, padding: "10px", minHeight: "300px" }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="AyAdi" />
              <YAxis tickFormatter={(value) => value.toLocaleString('tr-TR')} />
              <Tooltip formatter={(value) => [value.toLocaleString('tr-TR') + " ₺", "Toplam Harcama"]} />
              <Legend content={<CustomLegend />} />
              <Bar
                dataKey="ToplamTutar"
                fill="#82ca9d"
                hide={!visibleSeries.ToplamTutar}
                name="Toplam Harcama"
              >
                <LabelList dataKey="ToplamTutar" position="top" formatter={(val) => val > 0 ? val.toLocaleString('tr-TR') : ""} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      <Tour open={open} onClose={() => setOpen(false)} steps={[{ title: "Bilgi", description: "Yıllık bazda yapılan toplam harcamaların aylık dağılımını gösterir.", target: () => ref1.current }]} />
      
      <Modal title="Yıl Seçimi" centered open={isModalVisible} onOk={() => setIsModalVisible(false)} onCancel={() => setIsModalVisible(false)} destroyOnClose>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div>Yıl Seç:</div>
          <Controller
            name="yilSecimiYillikHarcama"
            control={control}
            render={({ field }) => <DatePicker {...field} picker="year" style={{ width: "130px" }} />}
          />
        </div>
      </Modal>

      <Modal
        title={
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "98%" }}>
            <Text>Yıllık Harcama Grafiği ({baslamaTarihi})</Text>
            <PrinterOutlined style={{ cursor: "pointer", fontSize: "20px" }} onClick={downloadPDF} />
          </div>
        }
        centered
        open={isExpandedModalVisible}
        onCancel={() => setIsExpandedModalVisible(false)}
        width="90%"
        footer={null}
        destroyOnClose
      >
        <div id="yillik-harcama-grafigi" style={{ height: "calc(100vh - 200px)" }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="AyAdi" />
              <YAxis tickFormatter={(value) => value.toLocaleString('tr-TR')} />
              <Tooltip formatter={(value) => [value.toLocaleString('tr-TR') + " ₺", "Toplam Harcama"]} />
              <Legend content={<CustomLegend />} />
              <Bar dataKey="ToplamTutar" fill="#82ca9d" hide={!visibleSeries.ToplamTutar}>
                <LabelList dataKey="ToplamTutar" position="top" formatter={(val) => val > 0 ? val.toLocaleString('tr-TR') : ""} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Modal>
    </div>
  );
}

export default YillikHarcamaGrafigi;