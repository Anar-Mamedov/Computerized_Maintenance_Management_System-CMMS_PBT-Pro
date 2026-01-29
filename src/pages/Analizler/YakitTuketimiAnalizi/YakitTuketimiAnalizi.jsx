import React, { useState } from "react";
import {
  Layout,
  Card,
  Button,
  Select,
  Input,
  DatePicker,
  Divider,
  Table,
  Tag,
  Typography,
  Row,
  Col,
  Space,
  Segmented,
  Tooltip
} from "antd";
import {
  DownloadOutlined,
  FileExcelOutlined,
  SearchOutlined,
  FilterOutlined,
  CaretDownOutlined
} from "@ant-design/icons";
import dayjs from "dayjs";

// --- Mock Data (Veriler) ----------------------------------------------------

const kpiItems = [
  {
    label: "Toplam Yakıt Miktarı",
    value: "27.220 L",
    subtitle: "Seçilen tarih aralığı",
    delta: "+8,4%",
    deltaType: "positive",
  },
  {
    label: "Toplam Yakıt Tutarı",
    value: "101.447,68 ₺",
    subtitle: "Ort. Fiyat: 37,29 ₺/L",
    delta: "+3,1%",
    deltaType: "positive",
  },
  {
    label: "Ortalama Tüketim",
    value: "320,29 L / 1000 km",
    subtitle: "Toplam km: 85.430",
    delta: "-4,2%",
    deltaType: "negative", // Tüketimde düşüş iyidir, yeşil gösterilebilir ama mantık birebir kalsın diye orijinali koruyoruz
  },
  {
    label: "Yakıt Kayıt Sayısı",
    value: "4.521",
    subtitle: "Otomatik: 3.800 · Manuel: 721",
    delta: "+1,9%",
    deltaType: "positive",
  },
];

const locationData = [
  { name: "KÖPRÜLÜ KAVŞAK", amount: 5245, total: 20000 },
  { name: "SULAMA KANALI", amount: 2358, total: 8600 },
  { name: "ÇEVRE YOLU", amount: 2812, total: 9300 },
  { name: "MERKEZ İDARİ", amount: 1073, total: 3850 },
  { name: "SAMSUN", amount: 110, total: 495 },
];

const vehicleTableData = [
  {
    key: "1",
    plate: "16 ABC 123",
    name: "Scania R560 Çekici",
    location: "SAMSUN",
    project: "LOJİSTİK",
    fuelAmount: 110,
    fuelCost: 4950,
    avgConsumption: "27,4 L/100 km",
    recordCount: 12,
  },
  {
    key: "2",
    plate: "34 KLM 842",
    name: "Ford Transit",
    location: "MERKEZ İDARİ",
    project: "SAHA DESTEK",
    fuelAmount: 200,
    fuelCost: 9108,
    avgConsumption: "9,6 L/100 km",
    recordCount: 18,
  },
  {
    key: "3",
    plate: "06 ZTR 007",
    name: "Mercedes Sprinter",
    location: "ÇEVRE YOLU PROJESİ",
    project: "ÇEVRE YOLU",
    fuelAmount: 600,
    fuelCost: 27600,
    avgConsumption: "12,1 L/100 km",
    recordCount: 31,
  },
  {
    key: "4",
    plate: "35 EGE 055",
    name: "Toyota Corolla",
    location: "SULAMA KANALI İNŞAATI",
    project: "SULAMA KANALI",
    fuelAmount: 410,
    fuelCost: 15200,
    avgConsumption: "7,2 L/100 km",
    recordCount: 23,
  },
];

const viewModes = [
  { value: "detailed", label: "Detaylı" },
  { value: "daily", label: "Günlük" },
  { value: "monthly", label: "Aylık" },
  { value: "yearly", label: "Yıllık" },
];

const chartTabs = [
  { key: "trend", label: "Genel Trend" },
  { key: "location", label: "Lokasyon Karşılaştırma" },
  { key: "vehicle", label: "Araç Karşılaştırma" },
  { key: "project", label: "Proje Bazlı" },
  { key: "anomaly", label: "Anomali / Aşım" },
];

const { Title, Text } = Typography;
const { Option } = Select;

// --- Helper Components ------------------------------------------------------

// AntD stiline uygun özel "Chip" (FilterChip ve QuickViewChip yerine)
const CustomChip = ({ label, count, active, onClick }) => {
  const baseStyle = {
    borderRadius: "20px",
    padding: "2px 12px",
    fontSize: "11px",
    fontWeight: 500,
    cursor: "pointer",
    border: "1px solid",
    transition: "all 0.2s",
    display: "flex",
    alignItems: "center",
    gap: "6px",
  };

  const activeStyle = {
    ...baseStyle,
    backgroundColor: "#0f172a", // Slate-900
    color: "#fff",
    borderColor: "#0f172a",
  };

  const inactiveStyle = {
    ...baseStyle,
    backgroundColor: active ? "#0f172a" : "#fff",
    color: active ? "#fff" : "#334155", // Slate-700
    borderColor: "#e2e8f0", // Slate-200
  };

  return (
    <div style={active ? activeStyle : inactiveStyle} onClick={onClick}>
      {label}
      {count !== undefined && (
        <span
          style={{
            backgroundColor: active ? "rgba(255,255,255,0.2)" : "#f1f5f9",
            borderRadius: "50%",
            padding: "0 6px",
            fontSize: "10px",
            height: "18px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {count}
        </span>
      )}
    </div>
  );
};

// --- Page Component ---------------------------------------------------------

export default function FuelAnalyticsPage() {
  const [viewMode, setViewMode] = useState("detailed");
  const [chartTab, setChartTab] = useState("trend");
  const [metric, setMetric] = useState("amount");
  const [mainTab, setMainTab] = useState("grid");

  // View Mode Labels helper
  const getViewModeLabel = () => viewModes.find(v => v.value === viewMode)?.label;
  const getMetricLabel = () => {
    if (metric === "amount") return "Yakıt miktarı";
    if (metric === "total") return "Yakıt tutarı";
    return "Ortalama tüketim";
  };

  // --- Table Columns Definitions ---

  // 1. Detailed Table Columns
  const detailedColumns = [
    {
      title: "Plaka",
      dataIndex: "plate",
      key: "plate",
      render: (text) => <Text strong style={{ color: "#0f172a" }}>{text}</Text>,
    },
    {
      title: "Araç Tanımı",
      dataIndex: "name",
      key: "name",
      render: (text) => <Text style={{ color: "#334155" }}>{text}</Text>,
    },
    {
      title: "Lokasyon",
      dataIndex: "location",
      key: "location",
      render: (text) => <Text style={{ color: "#475569" }}>{text}</Text>,
    },
    {
      title: "Proje",
      dataIndex: "project",
      key: "project",
      render: (text) => <Text style={{ color: "#475569" }}>{text}</Text>,
    },
    {
      title: "Yakıt Miktarı (L)",
      dataIndex: "fuelAmount",
      key: "fuelAmount",
      align: "right",
      render: (val) => <Text style={{ color: "#334155" }}>{val.toLocaleString("tr-TR")}</Text>,
    },
    {
      title: "Yakıt Tutarı (₺)",
      dataIndex: "fuelCost",
      key: "fuelCost",
      align: "right",
      render: (val) => <Text style={{ color: "#334155" }}>{val.toLocaleString("tr-TR")} ₺</Text>,
    },
    {
      title: "Ort. Tüketim",
      dataIndex: "avgConsumption",
      key: "avgConsumption",
      align: "right",
      render: (text) => <Text style={{ color: "#334155" }}>{text}</Text>,
    },
    {
      title: "Kayıt Sayısı",
      dataIndex: "recordCount",
      key: "recordCount",
      align: "right",
      render: (val) => <Text style={{ color: "#334155" }}>{val}</Text>,
    },
  ];

  // 2. Daily/Monthly/Yearly Columns Generator (Mock)
  const generatePeriodColumns = (periodType) => {
    const cols = [
      {
        title: "Lokasyon",
        dataIndex: "name",
        key: "name",
        fixed: 'left',
        render: (text) => <Text strong style={{ color: "#0f172a" }}>{text}</Text>,
      }
    ];

    let items = [];
    if (periodType === 'daily') items = Array.from({ length: 31 }, (_, i) => i + 1);
    else if (periodType === 'monthly') items = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];
    else if (periodType === 'yearly') items = [2025, 2024, 2023, 2022, 2021, 2020, 2019];

    items.forEach(item => {
      cols.push({
        title: item,
        dataIndex: "amount", // Mock data uses same amount for demo
        key: item,
        align: "right",
        render: () => <Text style={{ color: "#475569" }}>0,00</Text>, // Mock zeros
      });
    });
    
    // Add real data to the last/first column for demo purposes based on row data
    if(periodType === 'monthly') {
        cols[cols.length-1].render = (_, record) => <Text style={{ color: "#475569" }}>{record.amount.toLocaleString('tr-TR')}</Text>; // Dec
    } else if (periodType === 'yearly') {
        cols[1].render = (_, record) => <Text style={{ color: "#475569" }}>{record.amount.toLocaleString('tr-TR')}</Text>; // 2025
    }

    return cols;
  };

  // --- Render Table Logic ---
  const renderTable = () => {
    let columns = [];
    let dataSource = [];
    let titleLeft = "";
    let titleRight = "";

    if (viewMode === "detailed") {
      columns = detailedColumns;
      dataSource = vehicleTableData;
      titleLeft = (
        <Space size={8} wrap>
          <Text strong style={{ color: "#334155", fontSize: "12px" }}>Detaylı Tablo</Text>
          <Divider type="vertical" />
          <Text strong style={{ color: "#334155", fontSize: "12px" }}>Gruplama Türü</Text>
          <Select defaultValue="vehicle" size="small" style={{ width: 140 }} bordered={false} className="bg-slate-100 rounded">
            <Option value="none">Yok</Option>
            <Option value="location">Lokasyon</Option>
            <Option value="project">Proje</Option>
            <Option value="vehicle">Araç</Option>
            <Option value="driver">Sürücü</Option>
          </Select>
          <Divider type="vertical" />
          <Text strong style={{ color: "#334155", fontSize: "12px" }}>Hazır Görünümler</Text>
          <Space size={4}>
            <CustomChip label="Filo Özeti" active />
            <CustomChip label="Şantiye Bazlı" />
            <CustomChip label="Araç Performansı" />
            <CustomChip label="Sürücü Bazlı" />
          </Space>
        </Space>
      );
      titleRight = (
        <Space size={8}>
          <Text type="secondary" style={{ fontSize: "11px" }}>Toplam: {vehicleTableData.length} satır</Text>
          <Divider type="vertical" />
          <Button type="text" size="small" style={{ fontSize: "11px", color: "#64748b" }}>Kolon Seçimi</Button>
        </Space>
      );
    } else {
      // Daily, Monthly, Yearly shares similar structure with locationData
      dataSource = locationData.map((d, i) => ({ ...d, key: i }));
      columns = generatePeriodColumns(viewMode);
      
      let titleText = "";
      let subText = "";
      
      if (viewMode === 'daily') { titleText = "Günlük Yakıt Özeti"; subText = "Seçili ay: Aralık 2025"; }
      if (viewMode === 'monthly') { titleText = "Aylık Yakıt Özeti"; subText = "Veri görünümü: Ocak–Aralık · 5 lokasyon"; }
      if (viewMode === 'yearly') { titleText = "Yıllık Yakıt Özeti"; subText = "2019–2025 arası yıllık toplamlar"; }

      titleLeft = (
        <Space>
           <Text strong style={{ color: "#334155", fontSize: "12px" }}>{titleText}</Text>
           <Text type="secondary" style={{ fontSize: "11px" }}>{subText}</Text>
        </Space>
      );
    }

    return (
      <Card
        bordered={true}
        bodyStyle={{ padding: 0 }}
        style={{ borderRadius: "12px", boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)" }}
      >
        <div style={{ padding: "12px 16px", borderBottom: "1px solid #f0f0f0", display: "flex", justifyContent: "space-between", flexWrap: 'wrap', gap: 8 }}>
          {titleLeft}
          {titleRight}
        </div>
        
        <Table
          columns={columns}
          dataSource={dataSource}
          pagination={false}
          size="small"
          scroll={{ x: 'max-content', y: 300 }}
          rowClassName={(record, index) => index % 2 === 0 ? "bg-white" : "bg-slate-50"}
        />
        
        <div style={{ padding: "8px 16px", background: "#f8fafc", borderTop: "1px solid #f0f0f0", fontSize: "11px", color: "#64748b", display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
           <span>
             {viewMode === 'detailed' 
               ? `Gösterilen: 1–${vehicleTableData.length} / ${vehicleTableData.length} araç · Toplam yakıt: 1.320 L · Toplam tutar: 56.858 ₺`
               : `Toplam lokasyon: ${locationData.length} · Toplam yakıt: 27.220 L`
             }
           </span>
           {viewMode === 'detailed' && (
             <Space size={4}>
               <Button size="small" type="text" disabled>Önceki</Button>
               <Button size="small" style={{ background: '#fff', borderColor: '#e2e8f0', color: '#0f172a', fontWeight: 600 }}>1</Button>
               <Button size="small" type="text" disabled>Sonraki</Button>
             </Space>
           )}
        </div>
      </Card>
    );
  };

  return (
    <Layout style={{ minHeight: "100vh", background: "#f8fafc" }}>
      {/* --- Header --- */}
      <div style={{ background: "#fff", borderBottom: "1px solid #f0f0f0", padding: "12px 24px" }}>
        <Row gutter={[16, 12]} align="middle" justify="space-between">
          <Col>
            <Title level={4} style={{ margin: 0, color: "#0f172a", fontSize: "18px" }}>Yakıt Analizleri</Title>
            <Text type="secondary" style={{ fontSize: "12px" }}>
              Filo, şantiye ve araç bazında ayrıntılı yakıt tüketim analizi
            </Text>
          </Col>
          <Col>
            <Space wrap>
              {/* Date Range Mimic */}
              <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #d9d9d9', borderRadius: '8px', padding: '2px 8px' }}>
                 <Text strong style={{ fontSize: '11px', color: '#475569', marginRight: 8 }}>Tarih Aralığı</Text>
                 <DatePicker defaultValue={dayjs("2025-12-01")} suffixIcon={null} bordered={false} size="small" style={{ width: 100, fontSize: '11px' }} />
                 <Text style={{ fontSize: '10px', color: '#cbd5e1' }}>→</Text>
                 <DatePicker defaultValue={dayjs("2025-12-31")} suffixIcon={null} bordered={false} size="small" style={{ width: 100, fontSize: '11px' }} />
              </div>

              <Select value={metric} onChange={setMetric} style={{ width: 160 }} size="middle">
                <Option value="amount">Yakıt Miktarı</Option>
                <Option value="total">Yakıt Tutarı</Option>
                <Option value="avg">Ortalama Tüketim</Option>
              </Select>

              <Button
                type="primary"
                icon={<FileExcelOutlined />}
                style={{ background: "#f59e0b", borderColor: "#f59e0b", color: "#0f172a", fontWeight: 600, borderRadius: "8px" }}
              >
                Excel Çıktı
              </Button>
            </Space>
          </Col>
        </Row>

        {/* Filters Row */}
        <div style={{ marginTop: "12px", paddingTop: "12px", borderTop: "1px dashed #e2e8f0", display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <Space size={12} wrap>
            <Input
              placeholder="Arama yap..."
              prefix={<SearchOutlined style={{ color: "#94a3b8" }} />}
              style={{ width: 260, borderRadius: "8px", background: "#f8fafc" }}
            />
            <CustomChip label="Lokasyon" count={0} />
            <CustomChip label="Araç Tipi" count={0} />
            <Button icon={<FilterOutlined />} size="small" style={{ borderRadius: "8px", fontSize: "11px" }}>Filtreler</Button>
          </Space>

          <Space size={8}>
            <Segmented
              options={viewModes}
              value={viewMode}
              onChange={setViewMode}
              size="small"
              style={{ fontSize: "11px", fontWeight: 500 }}
            />
            <Tooltip title="İndir">
              <Button icon={<DownloadOutlined />} shape="circle" size="small" />
            </Tooltip>
          </Space>
        </div>
      </div>

      {/* --- Main Content --- */}
      <Layout.Content style={{ padding: "16px 24px", overflow: "auto" }}>
        
        {/* KPI Cards */}
        <Row gutter={[12, 12]}>
          {kpiItems.map((item, index) => (
            <Col xs={24} sm={12} lg={6} key={index}>
              <Card
                bordered={false}
                style={{
                  borderRadius: "12px",
                  boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
                  background: "rgba(255, 255, 255, 0.9)",
                }}
                bodyStyle={{ padding: "16px" }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <Text type="secondary" style={{ fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                      {item.label}
                    </Text>
                    <div style={{ marginTop: "4px" }}>
                      <Title level={4} style={{ margin: 0, fontSize: "20px", color: "#0f172a" }}>
                        {item.value}
                      </Title>
                    </div>
                  </div>
                  {item.delta && (
                    <Tag
                      color={item.deltaType === "positive" ? "success" : "default"}
                      style={{
                        margin: 0,
                        borderRadius: "12px",
                        fontWeight: 600,
                        fontSize: "10px",
                        background: item.deltaType === "positive" ? "#ecfdf5" : "#f1f5f9",
                        color: item.deltaType === "positive" ? "#047857" : "#475569",
                        border: "none",
                      }}
                    >
                      {item.delta}
                    </Tag>
                  )}
                </div>
                <Text type="secondary" style={{ fontSize: "11px", marginTop: "4px", display: "block" }}>
                  {item.subtitle}
                </Text>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Tab Toggle (Grid vs Charts) */}
        <div style={{ marginTop: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ background: "#f1f5f9", borderRadius: "20px", padding: "4px" }}>
            <Space size={0}>
              <Button
                type={mainTab === "grid" ? "default" : "text"}
                size="small"
                onClick={() => setMainTab("grid")}
                style={{
                  borderRadius: "16px",
                  fontSize: "11px",
                  fontWeight: 500,
                  boxShadow: mainTab === "grid" ? "0 1px 2px rgba(0,0,0,0.1)" : "none",
                  background: mainTab === "grid" ? "#fff" : "transparent"
                }}
              >
                Tablo
              </Button>
              <Button
                type={mainTab === "charts" ? "default" : "text"}
                size="small"
                onClick={() => setMainTab("charts")}
                style={{
                  borderRadius: "16px",
                  fontSize: "11px",
                  fontWeight: 500,
                  boxShadow: mainTab === "charts" ? "0 1px 2px rgba(0,0,0,0.1)" : "none",
                  background: mainTab === "charts" ? "#fff" : "transparent"
                }}
              >
                Grafikler
              </Button>
            </Space>
          </div>
          <Text type="secondary" style={{ fontSize: "10px" }}>
            {mainTab === "grid" ? "Tablo görünümü aktif" : "Grafik görünümü aktif"}
          </Text>
        </div>

        {/* Content Body */}
        <div style={{ marginTop: "16px" }}>
          {mainTab === "grid" && renderTable()}

          {mainTab === "charts" && (
            <Card
              bordered={false}
              style={{ borderRadius: "12px", boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)", background: "rgba(255, 255, 255, 0.9)" }}
              bodyStyle={{ padding: "16px" }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <div>
                  <Text type="secondary" style={{ fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                    Grafikler
                  </Text>
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <Text strong style={{ color: "#0f172a", fontSize: "14px" }}>
                      {chartTabs.find(t => t.key === chartTab)?.label}
                    </Text>
                    <Text type="secondary" style={{ fontSize: "10px" }}>
                      Görünüm: {getViewModeLabel()} · Hesaplama: {getMetricLabel()}
                    </Text>
                  </div>
                </div>
                <div style={{ background: "#f1f5f9", borderRadius: "20px", padding: "2px" }}>
                  <Space size={0}>
                    {chartTabs.map(tab => (
                      <Button
                        key={tab.key}
                        type={chartTab === tab.key ? "default" : "text"}
                        size="small"
                        onClick={() => setChartTab(tab.key)}
                        style={{
                          borderRadius: "16px",
                          fontSize: "10px",
                          height: "24px",
                          fontWeight: 500,
                          boxShadow: chartTab === tab.key ? "0 1px 2px rgba(0,0,0,0.1)" : "none",
                          background: chartTab === tab.key ? "#fff" : "transparent"
                        }}
                      >
                        {tab.label}
                      </Button>
                    ))}
                  </Space>
                </div>
              </div>

              {/* Mock Bar Chart Area */}
              <div style={{
                height: "250px",
                border: "1px dashed #e2e8f0",
                borderRadius: "12px",
                background: "rgba(248, 250, 252, 0.6)",
                padding: "16px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between"
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', height: '100%', gap: '12px' }}>
                  {locationData.map((loc) => {
                    const heightPercent = Math.min(100, (loc.amount / 6000) * 100);
                    return (
                      <div key={loc.name} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', height: '100%', flex: 1 }}>
                        <div style={{ width: '100%', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', flex: 1 }}>
                          <div
                            style={{
                              width: '24px',
                              borderTopLeftRadius: '4px',
                              borderTopRightRadius: '4px',
                              backgroundColor: '#3b82f6', // blue-500
                              height: `${heightPercent}%`,
                              transition: 'height 0.3s'
                            }}
                          />
                        </div>
                        <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                          <Text style={{ fontSize: '10px', fontWeight: 500, color: '#475569', textAlign: 'center' }}>{loc.name}</Text>
                          <Text type="secondary" style={{ fontSize: '10px' }}>{loc.amount.toLocaleString("tr-TR")} L</Text>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px' }}>
                   <Text type="secondary" style={{ fontSize: '10px' }}>Y ekseni: {getMetricLabel()} · {getViewModeLabel()} görünüm</Text>
                   <Text type="secondary" style={{ fontSize: '10px' }}>Demo grafik verisi aktif</Text>
                </div>
              </div>
            </Card>
          )}
        </div>
      </Layout.Content>
    </Layout>
  );
}