import React, { useState } from "react";
import {
  Table, Input, Select, Button, Tag, Progress, Drawer, Space, Card,
  Statistic, Row, Col, InputNumber, Typography, message, Divider, Checkbox, DatePicker
} from "antd";
import {
  SearchOutlined, DownloadOutlined, FolderFilled, FileTextOutlined,
  RightOutlined, CloseOutlined, HistoryOutlined
} from "@ant-design/icons";

const { Text, Title } = Typography;

// ================== VİDEO VE GÖRSEL VERİLERİ (BİREBİR) ==================
const INITIAL_WBS = [
  {
    key: "1",
    code: "1",
    name: "MOBİLİZASYON",
    risk: "Risk",
    unit: "ls",
    planned: 1,
    actual: 0.6,
    count: "4 kayıt",
    children: [
      { key: "1.1", code: "1.1", name: "Şantiye Kurulumu", risk: "", unit: "ls", planned: 1, actual: 0.8, count: "1 kayıt" },
      { key: "1.2", code: "1.2", name: "Geçici Tesisler", risk: "", unit: "ls", planned: 1, actual: 0.4, count: "1 kayıt" },
      { key: "1.3", code: "1.3", name: "Personel Mobilizasyonu", risk: "", unit: "ls", planned: 1, actual: 0.5, count: "1 kayıt" },
      { key: "1.4", code: "1.4", name: "Makine Sevkiyatı", risk: "", unit: "ls", planned: 1, actual: 0.7, count: "1 kayıt" },
    ]
  },
  { key: "2", code: "2", name: "HAFRİYAT", risk: "Risk", unit: "m3", planned: 10000, actual: 6500, count: "4 kayıt" },
  { key: "3", code: "3", name: "TEMEL VE BETONARME", risk: "Gecikmiş", unit: "m3", planned: 8000, actual: 3200, count: "3 kayıt" },
];

export default function AntDWBSProgress() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedNode, setSelectedNode] = useState(null);

  const columns = [
    {
      title: "WBS",
      key: "wbs_icon",
      width: 120,
      render: (_, r) => (
        <Space size="small">
          <Checkbox onClick={(e) => e.stopPropagation()} />
          {/* Klasör ikonu sadece çocukları olanda mavi */}
          <FolderFilled style={{ color: r.children ? '#1890ff' : '#bfbfbf', fontSize: 16 }} />
          <Tag color="blue" style={{ borderRadius: 10, fontSize: 10, margin: 0, padding: '0 8px' }}>{r.count}</Tag>
        </Space>
      )
    },
    {
      title: "İş Kalemi",
      key: "name",
      render: (_, r) => (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <Text strong style={{ color: '#003a8c', fontSize: 13 }}>{r.code} - {r.name}</Text>
          {r.risk && <Text type="danger" style={{ fontSize: 10, fontWeight: 'bold' }}>{r.risk}</Text>}
        </div>
      ),
    },
    { title: "Birim", dataIndex: "unit", key: "unit", width: 70 },
    { title: "Planlanan", dataIndex: "planned", key: "planned", align: "right", render: v => v.toLocaleString('tr-TR') },
    { title: "Gerçekleşen", dataIndex: "actual", key: "actual", align: "right", render: v => v.toLocaleString('tr-TR') },
    {
      title: "İlerleme",
      key: "progress",
      width: 400,
      render: (_, r) => {
        const pct = Math.round((r.actual / r.planned) * 100) || 0;
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Progress 
              percent={pct} 
              showInfo={false} 
              strokeColor="#adc6ff" 
              trailColor="#f0f2f5" 
              strokeWidth={10} 
              style={{ flex: 1 }} 
            />
            <Text strong style={{ minWidth: 45, textAlign: 'right' }}>{pct.toFixed(1)}%</Text>
            <Text type="secondary" style={{ fontSize: 11, minWidth: 50 }}>{r.count}</Text>
          </div>
        );
      },
    },
  ];

  return (
    <div style={{ padding: "16px 24px", background: "#f0f2f5", height: "100vh", overflow: "hidden", display: 'flex', flexDirection: 'column' }}>
      <div style={{ maxWidth: 1920, margin: "0 auto", width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
        
        {/* Üst Başlık ve Proje Bilgisi */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
          <div>
            <Text type="secondary" style={{ fontSize: 12 }}>Aktif Proje</Text>
            <Title level={4} style={{ margin: 0, fontWeight: 700 }}>Bursa Lojistik Merkez İnşaat Projesi</Title>
            <Text type="secondary" style={{ fontSize: 13 }}>
              Proje Kodu: <Text strong>PRJ-2026-001</Text> • Musteri: ACME Logistics A.Ş.
            </Text>
            <div style={{ color: '#8c8c8c', fontSize: 12, marginTop: 4 }}>2026-01-01 - 2026-12-31</div>
          </div>
          <Select defaultValue="1" style={{ width: 300 }} options={[{ value: '1', label: 'Bursa Lojistik Merkez İnşaat Projesi' }]} />
        </div>

        {/* KPI KARTLARI (image_1f5de7.png Renkleri) */}
        <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
          {[
            { t: "Fiziksel Ilerleme", v: 33.8, s: "%", c: "#52c41a", b: "#b7eb8f" },
            { t: "Planlanan Ilerleme", v: 70, s: "%", c: "#1890ff", b: "#adc6ff" },
            { t: "Sapma", v: -8.2, s: "%", c: "#ff4d4f", b: "#ffa39e" },
            { t: "Leaf Is Kalemi", v: 27, s: "", c: "#faad14", b: "#ffe58f" }
          ].map((item, i) => (
            <Col span={6} key={i}>
              <Card bordered={false} bodyStyle={{ padding: '16px 20px' }} style={{ border: `1px solid ${item.b}`, borderLeft: `6px solid ${item.c}`, borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                <Statistic title={<Text type="secondary" style={{ fontSize: 12 }}>{item.t.toUpperCase()}</Text>} value={item.v} suffix={item.s} valueStyle={{ fontWeight: 800, color: item.t === "Sapma" ? item.c : '#1f1f1f' }} />
              </Card>
            </Col>
          ))}
        </Row>

        {/* TABLO VE FİLTRE ALANI */}
        <Card bodyStyle={{ padding: 0 }} style={{ borderRadius: 12, overflow: 'hidden', flex: 1, display: 'flex', flexDirection: 'column', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
          <div style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', background: '#fff', borderBottom: '1px solid #f0f0f0' }}>
            <Input placeholder="WBS / Is kalemi ara..." prefix={<SearchOutlined />} style={{ width: 350, borderRadius: 8 }} />
            <Button type="primary" icon={<DownloadOutlined />} style={{ background: '#001529', border: 'none', height: 36 }}>Excel Export</Button>
          </div>
          <Table 
            columns={columns} 
            dataSource={INITIAL_WBS} 
            pagination={false}
            onRow={(record) => ({
              onClick: () => {
                if (!record.children) {
                  setSelectedNode(record);
                  setDrawerOpen(true);
                }
              },
            })}
            expandable={{
              expandIcon: ({ expanded, onExpand, record }) =>
                record.children ? (
                  <RightOutlined 
                    style={{ fontSize: 10, cursor: 'pointer', transition: '0.2s', transform: expanded ? 'rotate(90deg)' : 'none', marginRight: 8 }} 
                    onClick={e => onExpand(record, e)} 
                  />
                ) : null
            }}
            scroll={{ y: 'calc(100vh - 440px)' }}
            className="wbs-table"
          />
        </Card>
      </div>

      {/* VİDEODAKİ ALT DRAWER (İlerleme Girişi) */}
      <Drawer
        placement="bottom"
        height="55%"
        onClose={() => setDrawerOpen(false)}
        open={drawerOpen}
        bodyStyle={{ padding: 0 }}
        closeIcon={null}
        maskStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.45)' }}
      >
        <div style={{ padding: '32px 48px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 32 }}>
            <div>
              <Title level={4} style={{ margin: 0, color: '#001529' }}>{selectedNode?.code} - {selectedNode?.name}</Title>
              <Text type="secondary" style={{ fontSize: 14 }}>Bursa Lojistik Merkez İnşaat Projesi • PRJ-2026-001</Text>
            </div>
            <Button type="text" icon={<CloseOutlined style={{ fontSize: 20 }} />} onClick={() => setDrawerOpen(false)} />
          </div>

          <Row gutter={64}>
            {/* Sol Panel: Mevcut Durum */}
            <Col span={10}>
              <div style={{ marginBottom: 24 }}>
                <Text type="secondary" style={{ display: 'block', marginBottom: 4 }}>PLANLANAN</Text>
                <Title level={3} style={{ margin: 0 }}>{selectedNode?.planned} <small style={{ fontSize: 14, fontWeight: 400 }}>{selectedNode?.unit}</small></Title>
              </div>
              
              <div style={{ marginBottom: 32 }}>
                <Text type="secondary" style={{ display: 'block', marginBottom: 4 }}>GERÇEKLEŞEN</Text>
                <Title level={3} style={{ margin: 0, color: '#52c41a' }}>{selectedNode?.actual} <small style={{ fontSize: 14, fontWeight: 400, color: '#8c8c8c' }}>{selectedNode?.unit}</small></Title>
              </div>
              
              <Divider style={{ margin: '24px 0' }} />
              
              <div>
  <Text strong style={{ display: 'block', marginBottom: 12, fontSize: 15 }}>
    İlerleme Oranı
  </Text> {/* <-- Buranın kapandığından emin ol */}
  
  <Progress 
    percent={selectedNode ? Math.round((selectedNode.actual / selectedNode.planned) * 100) : 0} 
    strokeWidth={16} 
    strokeColor="#adc6ff"
    status="active"
  />
</div>
            </Col>

            {/* Sağ Panel: Giriş Formu */}
            <Col span={14} style={{ borderLeft: '1px solid #f0f0f0', paddingLeft: 48 }}>
              <Title level={5} style={{ marginBottom: 24 }}>Günlük / Haftalık Ilerleme Girisi</Title>
              <Row gutter={16}>
                <Col span={12}>
                  <Text type="secondary" style={{ display: 'block', marginBottom: 8 }}>Artış Miktarı ({selectedNode?.unit})</Text>
                  <InputNumber 
                    style={{ width: '100%' }} 
                    size="large" 
                    placeholder="0.00" 
                    min={0}
                    addonAfter={selectedNode?.unit}
                  />
                </Col>
                <Col span={12}>
                  <Text type="secondary" style={{ display: 'block', marginBottom: 8 }}>Tarih</Text>
                  <DatePicker style={{ width: '100%' }} size="large" defaultValue={null} />
                </Col>
                <Col span={24} style={{ marginTop: 16 }}>
                  <Text type="secondary" style={{ display: 'block', marginBottom: 8 }}>Not / Açıklama</Text>
                  <Input.TextArea rows={2} placeholder="İşle ilgili notunuzu giriniz..." />
                </Col>
              </Row>
              <Button type="primary" size="large" block style={{ marginTop: 24, background: '#001529', height: 48, fontWeight: 600 }}>
                ILERLEMEYI KAYDET
              </Button>
            </Col>
          </Row>

          <div style={{ marginTop: 40 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <HistoryOutlined style={{ color: '#1890ff' }} />
              <Text strong style={{ fontSize: 16 }}>Giriş Geçmişi</Text>
            </div>
            <Table 
              size="middle"
              dataSource={[{ key: '1', date: '02.02.2026 16:06', amount: '0.2', unit: selectedNode?.unit, note: 'Saha mobilizasyonu tamamlandı.' }]}
              columns={[
                { title: 'Tarih', dataIndex: 'date', width: 200 },
                { title: 'Miktar', key: 'amount', width: 150, render: (_, r) => <Text strong>{r.amount} {r.unit}</Text> },
                { title: 'Not', dataIndex: 'note' },
                { title: 'İşlem', width: 100, align: 'right', render: () => <Button type="link">Düzenle</Button> }
              ]}
              pagination={false}
              bordered
              style={{ borderRadius: 8, overflow: 'hidden' }}
            />
          </div>
        </div>
      </Drawer>
    </div>
  );
}