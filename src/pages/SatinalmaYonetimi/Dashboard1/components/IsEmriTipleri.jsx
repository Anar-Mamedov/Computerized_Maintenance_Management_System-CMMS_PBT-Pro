import React, { useEffect, useRef, useState } from "react";
import {
  PieChart,
  Pie,
  Sector,
  ResponsiveContainer,
  Cell,
  Legend,
} from "recharts";
import AxiosInstance from "../../../../api/http.jsx";
import { Spin, Typography, Tooltip, Popover, Button, Modal, Tour } from "antd";
import chroma from "chroma-js";
import styled from "styled-components";
import { MoreOutlined, PrinterOutlined } from "@ant-design/icons";
import html2pdf from "html2pdf.js";

const { Text } = Typography;

const generateColors = (dataLength) => {
  const colors = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#bd2400", "#131842"];
  return chroma.scale(colors).mode("lch").colors(dataLength);
};

const StyledResponsiveContainer = styled(ResponsiveContainer)`
  &:focus { outline: none !important; }
  .recharts-wrapper path:focus { outline: none; }
`;

function MalzemeTalepDurumlari(props) {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [colors, setColors] = useState([]);
  const [visibleSeries, setVisibleSeries] = useState({});
  const [isExpandedModalVisible, setIsExpandedModalVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const ref1 = useRef(null);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await AxiosInstance.get(`getMalzemeTalepleriDurumlari`);
      // API'den gelen veriyi Recharts formatına dönüştür
      const transformedData = (response.data || response).map((item) => ({
        name: item.Durum,
        value: Number(item.Adet),
      }));
      
      setData(transformedData);
      setColors(generateColors(transformedData.length));

      const initialVisibleSeries = transformedData.reduce((acc, item) => {
        acc[item.name] = item.name !== "Kapanmış Talepler";
        return acc;
      }, {});
      setVisibleSeries(initialVisibleSeries);
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
    const element = document.getElementById("malzeme-talep-durum-pdf");
    const opt = {
      margin: 10,
      filename: "malzeme_talep_durumlari.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "mm", format: "a4", orientation: "landscape" },
    };
    html2pdf().set(opt).from(element).save();
  };

  const renderActiveShape = (props) => {
    const RADIAN = Math.PI / 180;
    const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 30) * cos;
    const my = cy + (outerRadius + 30) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;
    const textAnchor = cos >= 0 ? "start" : "end";

    return (
      <g>
        <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill} style={{ fontSize: outerRadius * 0.12, fontWeight: 'bold' }}>
          {payload.name.length > 15 ? `${payload.name.slice(0, 12)}...` : payload.name}
        </text>
        <Sector cx={cx} cy={cy} innerRadius={innerRadius} outerRadius={outerRadius} startAngle={startAngle} endAngle={endAngle} fill={fill} />
        <Sector cx={cx} cy={cy} startAngle={startAngle} endAngle={endAngle} innerRadius={outerRadius + 6} outerRadius={outerRadius + 10} fill={fill} />
        <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
        <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
        <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333" fontSize={12}>{`Adet: ${value}`}</text>
        <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999" fontSize={11}>
          {`( ${(percent * 100).toFixed(2)}%)`}
        </text>
      </g>
    );
  };

  const handleLegendClick = (name) => {
    setVisibleSeries((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const CustomLegend = ({ payload }) => {
    const handleToggleAll = () => {
      const allVisible = Object.values(visibleSeries).every((v) => v);
      const newVisibility = Object.keys(visibleSeries).reduce((acc, key) => {
        acc[key] = !allVisible;
        return acc;
      }, {});
      setVisibleSeries(newVisibility);
    };

    return (
      <ul style={{ listStyle: "none", padding: 0, display: "flex", flexWrap: "wrap", gap: "10px", justifyContent: "center", margin: 0, fontSize: '12px' }}>
        <li style={{ cursor: "pointer", color: Object.values(visibleSeries).every((v) => v) ? "black" : "gray" }} onClick={handleToggleAll}>Tümü</li>
        {payload.map((entry, index) => (
          <li key={`item-${index}`} style={{ cursor: "pointer", color: visibleSeries[entry.value] ? colors[index % colors.length] : "gray" }} onClick={() => handleLegendClick(entry.value)}>
            <span style={{ display: "inline-block", width: "8px", height: "8px", backgroundColor: visibleSeries[entry.value] ? colors[index % colors.length] : "gray", marginRight: "5px", borderRadius: '50%' }}></span>
            {entry.value}
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
        <Text strong style={{ fontSize: "16px" }}>Malzeme Talep Durumları</Text>
        <Popover placement="bottom" content={content} trigger="click">
          <Button type="text" icon={<MoreOutlined />} />
        </Popover>
      </div>

      {isLoading ? <Spin style={{ margin: 'auto' }} /> : (
        <div style={{ flex: 1, minHeight: 0 }}>
          <StyledResponsiveContainer ref={ref1} width="100%" height="100%">
            <PieChart>
              <Pie
                activeIndex={activeIndex}
                activeShape={renderActiveShape}
                data={data.filter(entry => visibleSeries[entry.name])}
                cx="50%" cy="50%"
                innerRadius="55%" outerRadius="75%"
                dataKey="value"
                onMouseEnter={(_, index) => setActiveIndex(index)}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Legend content={<CustomLegend />} />
            </PieChart>
          </StyledResponsiveContainer>
        </div>
      )}

      <Tour open={open} onClose={() => setOpen(false)} steps={[{
        title: "Malzeme Talep Durumları",
        description: "Malzeme taleplerinin sistemdeki güncel durum dağılımını gösterir. Hangi aşamada kaç adet talep olduğunu analiz edebilirsiniz.",
        target: () => ref1.current
      }]} />

      <Modal
        title={
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "95%" }}>
            <span>Malzeme Talep Durumları Analizi</span>
            <PrinterOutlined style={{ cursor: "pointer" }} onClick={downloadPDF} />
          </div>
        }
        centered
        open={isExpandedModalVisible}
        onCancel={() => setIsExpandedModalVisible(false)}
        width="80%"
        footer={null}
        destroyOnClose
      >
        <div id="malzeme-talep-durum-pdf" style={{ height: "60vh" }}>
          <StyledResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                activeIndex={activeIndex}
                activeShape={renderActiveShape}
                data={data.filter(entry => visibleSeries[entry.name])}
                cx="50%" cy="50%"
                innerRadius="50%" outerRadius="70%"
                dataKey="value"
                onMouseEnter={(_, index) => setActiveIndex(index)}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Legend content={<CustomLegend />} />
            </PieChart>
          </StyledResponsiveContainer>
        </div>
      </Modal>
    </div>
  );
}

export default MalzemeTalepDurumlari;