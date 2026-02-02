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
} from "antd";
import {
  SearchOutlined,
  DownloadOutlined,
  MoreOutlined,
  PlusOutlined,
  ProjectOutlined,
  DashboardOutlined,
  DollarOutlined,
  InfoCircleOutlined,
  CheckCircleOutlined,
  CalendarOutlined
} from "@ant-design/icons";

const { Text, Title } = Typography;

// ------------------------------------------------------------
// Mock Veri & Helpers
// ------------------------------------------------------------
const mockProjeler = [
  {
    key: "1",
    id: "PRJ-0001",
    projeKodu: "PRJ0001",
    projeTanimi: "Havalimanı Proje İnşaatı",
    projeTipi: "Altyapı",
    firma: "Orjin Yazılım",
    lokasyon: "Muğla, TR",
    projeYoneticisi: "N. Kaya",
    projeDurumu: "Devam Ediyor",
    oncelik: "Kritik",
    baslamaTarihi: "2025-03-01",
    bitisTarihi: "2026-03-05",
    paraBirimi: "EUR",
    butce: 3100000,
    harcama: 3015000,
    cpi: 1.01,
    tamamlanmaYuzde: 40,
    planlananYuzde: 48,
  },
  {
    key: "2",
    id: "PRJ-0002",
    projeKodu: "PRJ0060",
    projeTanimi: "Kadıköy Çöp Toplama",
    projeTipi: "Kent Temizliği",
    firma: "Belediye İştiraki",
    lokasyon: "İstanbul, TR",
    projeYoneticisi: "M. Yıldırım",
    projeDurumu: "Devam Ediyor",
    oncelik: "Normal",
    baslamaTarihi: "2025-07-01",
    bitisTarihi: "2025-12-31",
    paraBirimi: "TRY",
    butce: 1250000,
    harcama: 1100000,
    cpi: 1.12,
    tamamlanmaYuzde: 23,
    planlananYuzde: 25,
  }
];

export default function AntDProjectList() {
  const [searchText, setSearchText] = useState("");
  const [selectedProject, setSelectedProject] = useState(null);
  const [drawerVisible, setDrawerVisible] = useState(false);

  const money = (val, cur) => `${val.toLocaleString("tr-TR")} ${cur}`;

  const columns = [
    {
      title: "Proje Tanımı",
      key: "project",
      fixed: "left",
      width: 280,
      render: (_, r) => (
        <Space direction="vertical" size={0}>
          <Text strong className="text-blue-600 cursor-pointer" onClick={() => { setSelectedProject(r); setDrawerVisible(true); }}>
            {r.projeTanimi}
          </Text>
          <Text type="secondary" style={{ fontSize: 11 }}>{r.projeKodu} · {r.projeTipi}</Text>
        </Space>
      ),
    },
    {
      title: "Durum",
      dataIndex: "projeDurumu",
      key: "status",
      width: 130,
      render: (st) => <Tag color={st === "Devam Ediyor" ? "processing" : "default"}>{st}</Tag>,
    },
    {
      title: "Tarihler",
      key: "dates",
      width: 180,
      render: (_, r) => (
        <Space direction="vertical" size={0}>
          <Text style={{ fontSize: 12 }}><CalendarOutlined /> {r.baslamaTarihi}</Text>
          <Text type="secondary" style={{ fontSize: 12 }}><CheckCircleOutlined /> {r.bitisTarihi}</Text>
        </Space>
      ),
    },
    {
      title: "İlerleme (Fiziksel / Plan)",
      key: "progress",
      width: 220,
      render: (_, r) => (
        <div style={{ width: 180 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <Text size="small" type="secondary">Fiziksel: {r.tamamlanmaYuzde}%</Text>
            <Text size="small" strong>{r.planlananYuzde}%</Text>
          </div>
          <Progress 
            percent={r.tamamlanmaYuzde} 
            success={{ percent: r.planlananYuzde }} 
            size="small" 
            showInfo={false}
          />
        </div>
      ),
    },
    {
      title: "Mali Durum",
      key: "financial",
      width: 200,
      render: (_, r) => {
        const diff = r.harcama - r.butce;
        return (
          <Space direction="vertical" size={0}>
            <Text style={{ fontSize: 12 }}>Harcama: {money(r.harcama, r.paraBirimi)}</Text>
            <Text type={diff > 0 ? "danger" : "success"} style={{ fontSize: 11 }}>
              Sapma: {diff > 0 ? "+" : ""}{money(diff, r.paraBirimi)}
            </Text>
          </Space>
        );
      },
    },
    {
      title: "CPI",
      dataIndex: "cpi",
      key: "cpi",
      width: 80,
      render: (v) => <Tag color={v >= 1 ? "green" : "red"}>{v.toFixed(2)}</Tag>
    },
    {
      title: "İşlem",
      key: "action",
      fixed: "right",
      width: 80,
      align: "center",
      render: (_, r) => (
        <Dropdown menu={{ items: [{ key: '1', label: 'Düzenle' }, { key: '2', label: 'Rapor Al' }] }}>
          <Button type="text" icon={<MoreOutlined />} />
        </Dropdown>
      ),
    },
  ];

  return (
    <div style={{ padding: 24, background: "#f5f7f9", minHeight: "100vh" }}>
      <div style={{ maxWidth: 1400, margin: "0 auto" }}>
        
        {/* Header Alanı */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
          <div>
            <Title level={3} style={{ margin: 0 }}>Proje Tanımları</Title>
            <Text type="secondary">Kurumsal proje portföyü ve performans takibi</Text>
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
              <Statistic title="Aktif Projeler" value={12} prefix={<ProjectOutlined />} />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card bordered={false} style={{ borderLeft: '4px solid #722ed1' }}>
              <Statistic title="Toplam Portföy Değeri" value={42.5} suffix="M ₺" prefix={<DollarOutlined />} />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card bordered={false} style={{ borderLeft: '4px solid #52c41a' }}>
              <Statistic title="Ortalama Performans" value={88} suffix="%" prefix={<DashboardOutlined />} />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card bordered={false} style={{ borderLeft: '4px solid #f5222d' }}>
              <Statistic title="Kritik Riskli" value={2} prefix={<InfoCircleOutlined />} />
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
        <Card bodyStyle={{ padding: 0 }} style={{ borderRadius: 12, overflow: 'hidden' }}>
          <Table 
            columns={columns} 
            dataSource={mockProjeler} 
            pagination={{ pageSize: 10 }}
            scroll={{ x: 1300, y: 'calc(100vh - 420px)' }}
            sticky
            size="middle"
          />
        </Card>
      </div>

      {/* Hızlı Bakış Drawer */}
      <Drawer
        title="Proje Özet Bilgileri"
        width={450}
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        extra={
          <Button type="primary" onClick={() => message.info("Detay sayfasına gidiliyor...")}>Tam Detay</Button>
        }
      >
        {selectedProject && (
          <Space direction="vertical" style={{ width: '100%' }} size="large">
            <Card size="small" title="Genel Durum" headStyle={{ background: '#fafafa' }}>
              <Row align="middle" justify="space-between">
                <Col><Statistic title="İlerleme" value={selectedProject.tamamlanmaYuzde} suffix="%" /></Col>
                <Col><Statistic title="Sağlık Skoru" value={92} valueStyle={{ color: '#3f8600' }} /></Col>
              </Row>
              <Progress percent={selectedProject.tamamlanmaYuzde} status="active" />
            </Card>

            <div style={{ padding: '0 12px' }}>
              <Divider orientation="left" style={{ fontSize: 12 }}>Proje Künyesi</Divider>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <Text type="secondary" size="small">Proje Kodu</Text>
                  <div><Text strong>{selectedProject.projeKodu}</Text></div>
                </div>
                <div>
                  <Text type="secondary" size="small">Yönetici</Text>
                  <div><Text strong>{selectedProject.projeYoneticisi}</Text></div>
                </div>
                <div>
                  <Text type="secondary" size="small">Başlangıç</Text>
                  <div><Text>{selectedProject.baslamaTarihi}</Text></div>
                </div>
                <div>
                  <Text type="secondary" size="small">Bitiş</Text>
                  <div><Text>{selectedProject.bitisTarihi}</Text></div>
                </div>
              </div>
            </div>

            <Card size="small" title="Bütçe Analizi" headStyle={{ background: '#fafafa' }}>
              <Statistic 
                title="Güncel Harcama" 
                value={selectedProject.harcama} 
                suffix={selectedProject.paraBirimi}
                valueStyle={{ color: selectedProject.harcama > selectedProject.butce ? '#cf1322' : '#3f8600' }}
              />
              <Text type="secondary" style={{ fontSize: 12 }}>Planlanan: {money(selectedProject.butce, selectedProject.paraBirimi)}</Text>
            </Card>

            <Button type="dashed" block icon={<MoreOutlined />}>WBS ve İş Kalemlerini Görüntüle</Button>
          </Space>
        )}
      </Drawer>
    </div>
  );
}