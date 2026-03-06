import React, { useMemo, useState } from "react";
import {
  Table,
  Input,
  Select,
  Space,
  Tag,
  Progress,
  Drawer,
  Dropdown,
  Tooltip,
  Card,
  Button,
  Statistic,
  Row,
  Col,
  Typography,
  Divider,
  Modal
} from "antd";
import {
  SearchOutlined, DownloadOutlined, MoreOutlined, PlusOutlined,
  CalendarOutlined, UserOutlined, EnvironmentOutlined, LinkOutlined,
  ToolOutlined, TeamOutlined, DeploymentUnitOutlined, NodeIndexOutlined
} from "@ant-design/icons";
import ProjeGuncelleme from "./ProjeTanimlariGuncelleme";

const { Text, Title } = Typography;

// ------------------------------------------------------------
// Mock Veri & Helpers
// ------------------------------------------------------------
const mockProjeler = [
  {
    key: "1",
    projeKodu: "PRJ0001",
    projeTanimi: "Havalimanı Proje İnşaatı",
    riskSkoru: "Risk - 78",
    projeDurumu: "Devam Ediyor",
    oncelik: "Kritik",
    projeTipi: "Altyapı",
    firma: "Orjin Yazılım",
    lokasyon: "Türkiye / Muğla",
    projeYoneticisi: "N. Kaya",
    baslamaTarihi: "2025-03-01",
    bitisTarihi: "2026-03-05",
    fizikselYuzde: 40,
    planlananYuzde: 48,
    paraBirimi: "EUR",
    butce: 3100000,
    harcama: 3015000,
    cpi: 1.01,
    kaynaklar: { makine: 46, personel: 210, taseron: 9, wbs: 98 },
    kurumsal: { masrafMerkezi: "MM-ALTY-001", bagliProje: "ANA-ALTY-2025" }
  },
  {
    key: "2",
    projeKodu: "PRJ0060",
    projeTanimi: "Kadıköy Çöp Toplama",
    riskSkoru: "İyi - 83",
    projeDurumu: "Devam Ediyor",
    oncelik: "Normal",
    projeTipi: "Kent Temizliği",
    firma: "Belediye İştiraki",
    lokasyon: "Türkiye / İstanbul",
    projeYoneticisi: "M. Yıldırım",
    baslamaTarihi: "2025-07-01",
    bitisTarihi: "2025-07-01",
    fizikselYuzde: 23,
    planlananYuzde: 25,
    paraBirimi: "TRY",
    butce: 0,
    harcama: 0,
    cpi: 1.00,
    kaynaklar: { makine: 12, personel: 65, taseron: 1, wbs: 12 },
    kurumsal: { masrafMerkezi: "MM-KENT-004", bagliProje: "-" }
  }
];

export default function AntDProjectList() {
  const [searchText, setSearchText] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeProject, setActiveProject] = useState(null);

  const money = (val, cur) => `${val.toLocaleString("tr-TR")} ${cur}`;

  const columns = [
    {
      title: "Proje",
      key: "proje",
      fixed: "left",
      width: 350,
      render: (_, r) => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {/* Üst Satır: Proje Adı ve Sağda Risk Skoru */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Text 
              strong 
              style={{ color: '#111827', cursor: 'pointer', fontSize: '14px', lineHeight: '1.2' }}
              onClick={() => {
                setActiveProject(r);
                setIsModalOpen(true);
              }}
            >
              {r.projeTanimi}
            </Text>
            <Tag color={r.riskSkoru.includes("Risk") ? "orange" : "green"} bordered={false} style={{ fontSize: '11px', margin: 0 }}>
              {r.riskSkoru}
            </Tag>
          </div>

          {/* Orta Satır: Proje Kodu */}
          <Text type="secondary" style={{ fontSize: '12px' }}>{r.projeKodu}</Text>

          {/* Alt Satır: Etiketler (Durum - Öncelik - Tip) */}
          <Space wrap size={[4, 0]} style={{ marginTop: '2px' }}>
            <Tag color="blue" style={{ fontSize: '11px' }}>{r.projeDurumu}</Tag>
            <Tag color="volcano" style={{ fontSize: '11px' }}>{r.oncelik}</Tag>
            <Tag style={{ fontSize: '11px' }}>{r.projeTipi}</Tag>
          </Space>

          {/* En Alt: Firma ve Lokasyon */}
          <Text type="secondary" style={{ fontSize: '11px', marginTop: '2px' }}>
            {r.firma} • {r.lokasyon}
          </Text>
        </div>
      ),
    },
    {
      title: "Proje Yöneticisi",
      dataIndex: "projeYoneticisi",
      key: "pm",
      width: 150,
      render: (text) => (
        <Space>
          <UserOutlined style={{ color: '#bfbfbf' }} />
          <Text style={{ fontSize: '13px' }}>{text}</Text>
        </Space>
      )
    },
    {
      title: "Tarih",
      key: "dates",
      width: 200,
      render: (_, r) => (
        <div style={{ fontSize: '12px' }}>
          <div><Text type="secondary">Başlangıç:</Text> {r.baslamaTarihi}</div>
          <div><Text type="secondary">Bitiş:</Text> {r.bitisTarihi}</div>
        </div>
      ),
    },
    {
      title: "Tamamlanma",
      key: "progress",
      width: 200,
      render: (_, r) => {
        const diff = r.fizikselYuzde - r.planlananYuzde;
        return (
          <div style={{ width: '100%', paddingRight: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <Text type="secondary" style={{ fontSize: '11px' }}>Fiziksel</Text>
              <Text strong style={{ fontSize: '11px', color: diff < 0 ? '#ff4d4f' : '#52c41a' }}>
                {diff === 0 ? "Planla aynı" : `${diff > 0 ? "+" : ""}${diff}%`}
              </Text>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Progress 
                percent={r.fizikselYuzde} 
                strokeColor={r.fizikselYuzde < r.planlananYuzde ? '#1890ff' : '#52c41a'}
                showInfo={false}
                size={[100, 8]}
              />
              <Text strong style={{ fontSize: '13px' }}>{r.fizikselYuzde}%</Text>
            </div>
            <Text type="secondary" style={{ fontSize: '11px' }}>Planlanan: <Text strong style={{ fontSize: '11px' }}>{r.planlananYuzde}%</Text></Text>
          </div>
        );
      },
    },
    {
      title: "Bütçe",
      key: "financial",
      width: 220,
      render: (_, r) => {
        const sapma = r.harcama - r.butce;
        return (
          <div style={{ fontSize: '12px', lineHeight: '1.6' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Text type="secondary">Bütçe</Text>
              <Text strong>{money(r.butce, r.paraBirimi)}</Text>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Text type="secondary">Harcama</Text>
              <Text>{money(r.harcama, r.paraBirimi)}</Text>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Text type="secondary">Sapma</Text>
              <Text strong style={{ color: sapma > 0 ? '#ff4d4f' : '#52c41a' }}>
                {sapma > 0 ? "+" : ""}{money(sapma, r.paraBirimi)}
              </Text>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #f0f0f0', marginTop: '4px' }}>
              <Text type="secondary">CPI</Text>
              <Text strong style={{ color: r.cpi >= 1 ? '#52c41a' : '#ff4d4f' }}>{r.cpi.toFixed(2)}</Text>
            </div>
          </div>
        );
      },
    },
    {
      title: "Kaynaklar",
      key: "resources",
      width: 150,
      render: (_, r) => (
        <Space direction="vertical" size={2}>
          <Text style={{ fontSize: 12 }}><ToolOutlined /> Makine: <b>{r.kaynaklar.makine}</b></Text>
          <Text style={{ fontSize: 12 }}><TeamOutlined /> Personel: <b>{r.kaynaklar.personel}</b></Text>
          <Text style={{ fontSize: 12 }}><DeploymentUnitOutlined /> Taşeron: <b>{r.kaynaklar.taseron}</b></Text>
          <Text style={{ fontSize: 12 }}><NodeIndexOutlined /> WBS: <b>{r.kaynaklar.wbs}</b></Text>
        </Space>
      )
    },
    {
      title: "Kurumsal",
      key: "corporate",
      width: 220,
      render: (_, r) => (
        <Space direction="vertical" size={2}>
          <div><Text type="secondary" style={{ fontSize: 11 }}>Masraf Merkezi</Text><br/><Text strong>{r.kurumsal.masrafMerkezi}</Text></div>
          <div><Text type="secondary" style={{ fontSize: 11 }}>Bağlı Proje</Text><br/><Text>{r.kurumsal.bagliProje}</Text></div>
        </Space>
      )
    }
  ];

  return (
    <div style={{ 
      padding: "16px 20px", 
      background: "#f0f2f5", 
      height: "100vh", // Sayfayı ekran yüksekliğine sabitledik
      overflow: "hidden", // Dışarıdan taşmayı engelledik
      display: "flex",
      flexDirection: "column"
    }}>
      {/* Ana kapsayıcı dev ekranlarda aşırı yayılmasın diye limitledik */}
      <div style={{ maxWidth: 1920, margin: "0 auto", width: '100%' }}>
        
        {/* Header Alanı */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 15 }}>
          <div>
            <Title level={3} style={{ margin: 0 }}>Proje Tanımları</Title>
          </div>
          <Space>
            <Button icon={<DownloadOutlined />}>Excel'e Aktar</Button>
            <Button type="primary" icon={<PlusOutlined />} size="large">Yeni Proje</Button>
          </Space>
        </div>

        {/* KPI Kartları */}
        
        <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
          <Col xs={24} sm={12} lg={6}>
            <Card bordered={false} style={{ borderLeft: '4px solid #1890ff' }}>
              <Statistic title="Aktif Projeler" value={12} />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card bordered={false} style={{ borderLeft: '4px solid #722ed1' }}>
              <Statistic title="Toplam Portföy Değeri" value={5.2} suffix="M ₺" />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card bordered={false} style={{ borderLeft: '4px solid #f5222d' }}>
              <Statistic title="Toplam Harcama" value={3.4} suffix="M ₺" />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card bordered={false} style={{ borderLeft: '4px solid #52c41a' }}>
              <Statistic title="Ortalama Tamamlanma" value={29} suffix="%" />
            </Card>
          </Col>
        </Row>

        {/* Filtre Barı */}
        <Card bordered={false} style={{ marginBottom: 16, borderRadius: 12 }}>
          <Row gutter={16}>
            <Col flex="auto">
              <Input 
                placeholder="Proje adı, kodu veya yönetici ara..." 
                prefix={<SearchOutlined />} 
                onChange={e => setSearchText(e.target.value)}
                allowClear
              />
            </Col>
            <Col span={4}>
              <Select placeholder="Durum" style={{ width: '100%' }} allowClear>
                <Select.Option value="devam">Devam Ediyor</Select.Option>
                <Select.Option value="plan">Planlandı</Select.Option>
              </Select>
            </Col>
            <Col span={4}>
              <Select placeholder="Proje Tipi" style={{ width: '100%' }} allowClear>
                <Select.Option value="altyapi">Altyapı</Select.Option>
                <Select.Option value="bina">Üstyapı</Select.Option>
              </Select>
            </Col>
            <Col>
              <Button type="primary">Uygula</Button>
            </Col>
          </Row>
        </Card>

        {/* Tablo Alanı */}
        <Card 
          bodyStyle={{ padding: 0, height: "100%" }} 
          style={{ 
            borderRadius: 12, 
            overflow: 'hidden', 
            flex: "auto", // Kalan tüm boşluğu doldurur
            display: "flex", 
            flexDirection: "column" 
          }}
        >
          <Table 
            columns={columns} 
            dataSource={mockProjeler} 
            pagination={{ 
              pageSize: 10, 
              size: "small",
              showSizeChanger: true,
              style: { margin: "12px 16px" }
            }}
            // Kanka boydan taşmayı önleyen sihirli değnek burası:
            scroll={{ 
              x: 1600, 
              y: 'calc(100vh - 550px)' // Ekrana göre dinamik yükseklik
            }}
            sticky
            size="middle"
            bordered
          />
        </Card>
      </div>

      <Modal
        title={null} // Kendi header'ını kullandığı için null yaptık
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        width="95%" // Ekranın %95'ini kaplasın (Dinamik olması için)
        style={{ top: 20 }}
        footer={null} // Kendi butonlarını kullandığı için null yaptık
        destroyOnClose // Kapandığında formu sıfırlasın
        bodyStyle={{ padding: 0, height: '90vh', overflow: 'hidden' }}
      >
        <ProjeGuncelleme 
            projectData={activeProject} 
            onClose={() => setIsModalOpen(false)} 
        />
      </Modal>
    </div>
  );
}