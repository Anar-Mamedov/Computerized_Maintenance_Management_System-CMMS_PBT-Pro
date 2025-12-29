import React, { useState } from "react";
import { Row, Col, Card, Typography, Select, Button, Input, Space, Tag, Divider, Modal, Table } from "antd";
import { 
  ReloadOutlined, FilePdfOutlined, SearchOutlined, 
  InfoCircleOutlined, QuestionCircleOutlined 
} from "@ant-design/icons";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area, Legend, ComposedChart
} from "recharts";

const { Title, Text } = Typography;
const { Option } = Select;

// --- Mock Data (Görseldeki değerlere sadık kalınmıştır) ---
const aylikData = [
  { name: "Oca", arıza: 5, pm: 210, bm: 95, maliyet: 18000, bütçe: 25000, t1: 6, t2: 3, t3: 2, katki: 12, saat: 24 },
  { name: "Şub", arıza: 7, pm: 140, bm: 110, maliyet: 20000, bütçe: 25000, t1: 5, t2: 4, t3: 4, katki: 10, saat: 18 },
  { name: "Mar", arıza: 4, pm: 250, bm: 80, maliyet: 24000, bütçe: 25000, t1: 7, t2: 2, t3: 1, katki: 14, saat: 26 },
  { name: "Nis", arıza: 6, pm: 190, bm: 100, maliyet: 22000, bütçe: 25000, t1: 4, t2: 5, t3: 3, katki: 9, saat: 20 },
  { name: "May", arıza: 8, pm: 220, bm: 120, maliyet: 26000, bütçe: 25000, t1: 8, t2: 6, t3: 2, katki: 11, saat: 22 },
  { name: "Haz", arıza: 5, pm: 280, bm: 90, maliyet: 23000, bütçe: 25000, t1: 6, t2: 4, t3: 3, katki: 13, saat: 28 },
  { name: "Tem", arıza: 3, pm: 240, bm: 105, maliyet: 25000, bütçe: 25000, t1: 9, t2: 3, t3: 2, katki: 15, saat: 30 },
  { name: "Ağu", arıza: 7, pm: 260, bm: 115, maliyet: 40000, bütçe: 25000, t1: 5, t2: 5, t3: 4, katki: 8, saat: 16 },
  { name: "Eyl", arıza: 6, pm: 230, bm: 95, maliyet: 42000, bütçe: 25000, t1: 7, t2: 4, t3: 3, katki: 12, saat: 24 },
  { name: "Eki", arıza: 5, pm: 180, bm: 85, maliyet: 38000, bütçe: 25000, t1: 6, t2: 3, t3: 2, katki: 10, saat: 22 },
  { name: "Kas", arıza: 4, pm: 150, bm: 75, maliyet: 28000, bütçe: 25000, t1: 4, t2: 2, t3: 1, katki: 14, saat: 25 },
  { name: "Ara", arıza: 5, pm: 255, bm: 130, maliyet: 22000, bütçe: 25000, t1: 7, t2: 4, t3: 3, katki: 6, saat: 12 },
];

const arizaNedenleriData = [
  { neden: "Sensör Arızası", adet: 40 },
  { neden: "Hidrolik Kaçak", adet: 32 },
  { neden: "Kayış Kopması", adet: 28 },
  { neden: "Motor Aşınma/Isınma", adet: 22 },
  { neden: "Elektrik", adet: 18 },
  { neden: "Rulman Aşınması", adet: 15 },
];

const kpiSözlüğüColumns = [
  { title: 'KPI', dataIndex: 'kpi', key: 'kpi', width: '25%' },
  { title: 'Açıklama', dataIndex: 'aciklama', key: 'aciklama', width: '40%' },
  { title: 'Formül', dataIndex: 'formul', key: 'formul', width: '35%' },
];

const kpiSözlüğüData = [
  { key: '1', kpi: 'Planlı Bakım Uyum Oranı (PMC %)', aciklama: 'Zamanında tamamlanan planlı bakım oranı', formul: '(Zamanında Tamamlanan PM / Toplam Planlı PM) x 100' },
  { key: '2', kpi: 'Arıza Sıklığı (BF)', aciklama: 'Belirli dönemde oluşan arıza sıklığı', formul: 'Arıza Sayısı / Dönem (gün/hafta/ay)' },
  { key: '3', kpi: 'MTTR (Ortalama Onarım Süresi)', aciklama: 'Bir arızanın tespit edilip giderilmesi için geçen ortalama süre', formul: 'Toplam Onarım Süresi / Onarım Sayısı' },
  { key: '4', kpi: 'MTBF (Arızalar Arası Ortalama Süre)', aciklama: 'İki arıza arasındaki ortalama çalışma süresi', formul: 'Toplam Çalışma Süresi / Toplam Arıza Sayısı' },
  { key: '5', kpi: 'Birim Üretim Başına Bakım Maliyeti', aciklama: 'Üretilen birim başına bakım maliyeti', formul: 'Toplam Bakım Maliyeti / Toplam Üretim' },
  { key: '6', kpi: 'Planlı Bakım Oranı (PMR %)', aciklama: 'Planlı bakımın toplam bakıma oranı', formul: 'Planlı Bakım Saatleri / Toplam Bakım Saatleri x 100' },
  { key: '7', kpi: 'Program Uyum Oranı (SC %)', aciklama: 'Takvime uygun tamamlanan bakım oranı', formul: 'Zamanında Tamamlanan Bakım / Toplam Bakım x 100' },
  { key: '8', kpi: 'Bakım Geri Kalanı (Backlog %)', aciklama: 'Mevcut iş yükü oranı', formul: 'Bekleyen Bakım Saatleri / Toplam Mevcut Saat x 100' },
  { key: '9', kpi: 'Düzeltici Bakım Oranı (CR %)', aciklama: 'Plansız (düzeltici) bakım oranı', formul: 'Düzeltici Bakım Saatleri / Toplam Bakım Saatleri x 100' },
  { key: '10', kpi: 'Yedek Parça Uygunluğu (SPA %)', aciklama: 'Yedek parça bulunabilirliği', formul: 'Parça Bulunan Süre / Toplam İhtiyaç Süresi x 100' },
];

const mttrTrend = [
  { name: "May", v: 3.8 }, { name: "Haz", v: 3.2 }, { name: "Tem", v: 2.8 }, { name: "Ağu", v: 3.6 }
];

const durusKatki = [
  { name: "Diğer", value: 400, color: "#f1c40f" },
  { name: "Eksik Parça", value: 300, color: "#2ecc71" },
  { name: "Elektrik Kesintisi", value: 300, color: "#008450" },
  { name: "Makine Arızası", value: 200, color: "#27ae60" },
  { name: "Personel Eksikliği", value: 100, color: "#16a085" },
  { name: "Planlı PM", value: 150, color: "#3498db" },
];

const cardStyle = { borderRadius: "16px", height: "100%", border: "1px solid #f0f0f0" };

export default function BakimKPIPanosu() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <div style={{ height: "85vh", overflowY: "auto", background: "#f8fafc", paddingBottom: 40 }}>
      
      {/* --- GREEN HEADER --- */}
      <div style={{ background: "#008450", padding: "20px 32px", color: "#fff" }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: 11 }}>PBT PRO Web • Bakım KPI Dashboard</Text>
            <Title level={3} style={{ color: "#fff", margin: "4px 0" }}>Bakım KPI Panosu</Title>
            <Text style={{ color: "rgba(255,255,255,0.8)", fontSize: 12 }}>Planlı/Plansız Bakım • Duruş • Maliyet • Arıza Trendleri</Text>
          </Col>
          <Col>
            <Space size="middle">
              <Button icon={<ReloadOutlined />} style={{ borderRadius: 8 }}>Yenile</Button>
              <Button type="primary" danger icon={<FilePdfOutlined />} style={{ borderRadius: 8, background: "#1a1a1a", borderColor: "#1a1a1a" }}>Excel / PDF</Button>
            </Space>
          </Col>
        </Row>
      </div>

      {/* --- FILTER BAR --- */}
      <div style={{ background: "#fff", padding: "16px 32px", borderBottom: "1px solid #e2e8f0", marginBottom: 20 }}>
        <Row gutter={16}>
          <Col flex="auto">
            <Input prefix={<SearchOutlined />} placeholder="Ekipman / Hat / Lokasyon / İş Emri No ara..." style={{ borderRadius: 8 }} />
          </Col>
          <Col span={4}>
            <Select defaultValue="ist" style={{ width: '100%' }}>
              <Option value="ist">İstanbul</Option>
              <Option value="tek">Tekirdağ</Option>
              <Option value="bur">Bursa</Option>
            </Select>
          </Col>
          <Col span={3}>
            <Select defaultValue="tum" style={{ width: '100%' }}>
              <Option value="tum">Tüm Hatlar</Option>
              <Option value="h1">Hat 1</Option>
              <Option value="h2">Hat 2</Option>
              <Option value="h3">Hat 3</Option>
            </Select>
          </Col>
          <Col span={3}>
            <Select defaultValue="2025" style={{ width: '100%' }}>
              <Option value="2025">2025</Option>
              <Option value="2024">2024</Option>
              <Option value="son12">Son 12 Ay</Option>
            </Select>
          </Col>
        </Row>
        <div style={{ marginTop: 12 }}>
          <Space split={<Divider type="vertical" />}>
            <Tag icon={<InfoCircleOutlined />} color="default">KPI Seti: Standart Bakım</Tag>
            <Text type="secondary" style={{ fontSize: 12 }}>Veri: <b>PBT PRO (İş Emirleri + Duruş + Maliyet)</b></Text>
            <Button type="link" size="small" icon={<QuestionCircleOutlined />} onClick={() => setIsModalOpen(true)}>
              KPI Sözlüğü
            </Button>
            <Text type="secondary" style={{ fontSize: 12 }}>Güncelleme: Otomatik / Saatlik</Text>
          </Space>
        </div>
      </div>

      {/* --- DASHBOARD CONTENT --- */}
      <div style={{ padding: "0 32px" }}>
        
        {/* ROW 1: MTTR & MTBF */}
        <Row gutter={[20, 20]} style={{ marginBottom: 20 }}>
          <Col span={12}>
            <Card style={cardStyle} title={<div><Text strong>MTTR</Text><br/><Text type="secondary" style={{fontSize:10}}>Ortalama Onarım Süresi • Formül: Toplam Onarım Süresi / Onarım Sayısı</Text></div>} extra={<Button size="small">Formül</Button>}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                  <Title level={2} style={{ margin: 0 }}>3.20 <small style={{fontSize:14}}>Saat</small></Title>
                  <Text type="success" style={{fontSize:11}}>+%1.3% Önceki Döneme Göre</Text>
                </div>
                <Text type="secondary" style={{fontSize:11}}>Dönem: 2025</Text>
              </div>
              <div style={{ height: 160, marginTop: 16 }}>
                <ResponsiveContainer><LineChart data={mttrTrend}><CartesianGrid strokeDasharray="3 3" vertical={false}/><XAxis dataKey="name"/><YAxis/><Tooltip/><Line type="monotone" dataKey="v" stroke="#27ae60" dot={{r:4}} strokeWidth={2} name="MTTR"/></LineChart></ResponsiveContainer>
              </div>
            </Card>
          </Col>
          <Col span={12}>
            <Card style={cardStyle} title={<div><Text strong>MTBF</Text><br/><Text type="secondary" style={{fontSize:10}}>Arızalar Arası Ortalama Süre • Formül: Toplam Çalışma Süresi / Toplam Arıza Sayısı</Text></div>} extra={<Button size="small">Formül</Button>}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                  <Title level={2} style={{ margin: 0 }}>260 <small style={{fontSize:14}}>Saat</small></Title>
                  <Text type="danger" style={{fontSize:11}}>+13.7% Önceki Döneme Göre</Text>
                </div>
                <Text type="secondary" style={{fontSize:11}}>Filtre: İstanbul</Text>
              </div>
              <div style={{ height: 160, marginTop: 16 }}>
                <ResponsiveContainer><BarChart data={[{n:'Fabrika 1', v:260}, {n:'Atölye A', v:255}]}><CartesianGrid strokeDasharray="3 3" vertical={false}/><XAxis dataKey="n"/><YAxis/><Tooltip/><Bar dataKey="v" fill="#1fb6ff" barSize={80} name="MTBF"/></BarChart></ResponsiveContainer>
              </div>
            </Card>
          </Col>
        </Row>

        {/* ROW 2: Arıza Katkısı, Bakım Maliyeti, Tamamlanan/Planlanan */}
        <Row gutter={[20, 20]} style={{ marginBottom: 20 }}>
          <Col span={8}>
            <Card title="Arıza Katkısı" style={cardStyle}>
              <div style={{ height: 220 }}>
                <ResponsiveContainer><ComposedChart data={aylikData}><CartesianGrid strokeDasharray="3 3" vertical={false}/><XAxis dataKey="name" fontSize={10}/><YAxis yAxisId="left" fontSize={10}/><YAxis yAxisId="right" orientation="right" fontSize={10}/><Tooltip/><Legend verticalAlign="bottom" iconType="rect"/><Bar yAxisId="left" dataKey="saat" fill="#27ae60" name="Arıza Saati"/><Line yAxisId="right" type="monotone" dataKey="katki" stroke="#16a085" name="Katkı (%)"/></ComposedChart></ResponsiveContainer>
              </div>
            </Card>
          </Col>
          <Col span={8}>
            <Card title="Bakım Maliyeti" style={cardStyle}>
              <div style={{ height: 220 }}>
                <ResponsiveContainer><BarChart data={aylikData}><CartesianGrid strokeDasharray="3 3" vertical={false}/><XAxis dataKey="name" fontSize={10}/><YAxis fontSize={10}/><Tooltip/><Legend verticalAlign="bottom"/><Bar dataKey="maliyet" fill="#1fb6ff" name="Bakım Maliyeti"/><Line type="monotone" dataKey="bütçe" stroke="#bdc3c7" strokeDasharray="5 5" name="Bütçe"/></BarChart></ResponsiveContainer>
              </div>
            </Card>
          </Col>
          <Col span={8}>
            <Card title="Tamamlanan / Planlanan Bakım" style={cardStyle}>
              <div style={{ display: 'flex', height: 220, alignItems: 'center' }}>
                <ResponsiveContainer width="60%" height="100%">
                  <PieChart><Pie data={[{v:883}]} innerRadius={55} outerRadius={80} dataKey="v"><Cell fill="#27ae60"/></Pie></PieChart>
                </ResponsiveContainer>
                <div style={{ width: '40%' }}>
                  <div style={{ background: '#eafaf1', padding: 8, borderRadius: 8, marginBottom: 8 }}>
                    <Text type="secondary" style={{fontSize:10}}>Tamamlanan</Text><br/><Text strong>883</Text><br/><Text type="secondary" style={{fontSize:9}}>Tamamlanan bakım sayısı</Text>
                  </div>
                  <div style={{ background: '#f8fafc', padding: 8, borderRadius: 8, marginBottom: 8 }}>
                    <Text type="secondary" style={{fontSize:10}}>Planlanan</Text><br/><Text strong>126</Text><br/><Text type="secondary" style={{fontSize:9}}>Planlanan bakım sayısı</Text>
                  </div>
                  <div style={{ background: '#fff1f0', padding: 8, borderRadius: 8 }}>
                    <Text type="secondary" style={{fontSize:10}}>Geciken</Text><br/><Text strong color="red">49</Text><br/><Text type="secondary" style={{fontSize:9}}>Geciken bakım</Text>
                  </div>
                </div>
              </div>
            </Card>
          </Col>
        </Row>

        {/* ROW 3: PM/BM, En Sık Arıza, Duruş Nedenleri */}
        <Row gutter={[20, 20]} style={{ marginBottom: 20 }}>
          <Col span={8}>
            <Card title="PM / BM Adam-Saat Trend" style={cardStyle}>
              <div style={{ height: 250 }}>
                <ResponsiveContainer><BarChart data={aylikData}><CartesianGrid strokeDasharray="3 3" vertical={false}/><XAxis dataKey="name" fontSize={10}/><YAxis fontSize={10}/><Tooltip/><Legend verticalAlign="bottom"/><Bar dataKey="bm" fill="#1fb6ff" name="Arıza Bakımı (saat)"/><Bar dataKey="pm" fill="#2ecc71" name="Planlı Bakım (saat)"/></BarChart></ResponsiveContainer>
              </div>
            </Card>
          </Col>
          <Col span={8}>
            <Card 
  title="En Sık Arıza Nedenleri" 
  style={cardStyle} 
  extra={<InfoCircleOutlined />}
>
  <div style={{ height: 250 }}>
    <ResponsiveContainer width="100%" height="100%">
      <BarChart 
        data={arizaNedenleriData} 
        margin={{ top: 10, right: 10, left: -20, bottom: 7 }} // Alt boşluğu isimler için artırdık
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis 
          dataKey="neden" 
          fontSize={11} 
          interval={0} // Tüm isimleri göster
          angle={-45}  // Yazıları 45 derece eğerek sığdırdık
          textAnchor="end"
          height={80}  // Yazıların kesilmemesi için eksen alanını büyüttük
        />
        <YAxis fontSize={11} />
        <Tooltip cursor={{fill: 'rgba(0,0,0,0.05)'}} />
        <Bar 
          dataKey="adet" 
          fill="#27ae60" 
          radius={[4, 4, 0, 0]} 
          name="Arıza Adedi"
          barSize={30}
        />
      </BarChart>
    </ResponsiveContainer>
  </div>
</Card>
          </Col>
          <Col span={8}>
            <Card 
  title="Duruş Nedenleri Katkı (%)" 
  style={{ ...cardStyle, overflow: 'hidden' }}
>
  <div style={{ height: 210, width: '100%' }}>
    <ResponsiveContainer>
      <PieChart>
        <Pie
          data={durusKatki}
          innerRadius={60} // Biraz daha genişleterek ferahlattık
          outerRadius={85}
          dataKey="value"
          labelLine={true} // Çizgileri geri getirdik ki okumak kolaylaşsın
          // Kısaltmayı kaldırdık, fontu netleştirdik
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          paddingAngle={2}
        >
          {durusKatki.map((e, i) => (
            <Cell key={`cell-${i}`} fill={e.color} stroke="#fff" strokeWidth={1} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  </div>
  
  {/* Alt Lejant Alanı - Daha okunaklı ve düzenli */}
  <div style={{ 
    marginTop: 10, 
    padding: '0 10px',
    display: 'flex', 
    justifyContent: 'center' 
  }}>
    <Space wrap size={[16, 8]} style={{ justifyContent: 'center' }}>
      {durusKatki.map((e) => (
        <div key={e.name} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{ 
            width: 10, 
            height: 10, 
            borderRadius: '50%', 
            backgroundColor: e.color 
          }} />
          <Text style={{ fontSize: 12, color: '#595959' }}>{e.name}</Text>
        </div>
      ))}
    </Space>
  </div>
</Card>
          </Col>
        </Row>

        {/* ROW 4: Arıza Durumu, Arıza Süresi, Plan/Tamam Periyot */}
        <Row gutter={[20, 20]}>
          <Col span={8}>
            <Card title="Arıza Durumu (Aylık Trend)" style={cardStyle}>
              <div style={{ height: 220 }}>
                <ResponsiveContainer><BarChart data={aylikData}><CartesianGrid strokeDasharray="3 3" vertical={false}/><XAxis dataKey="name" fontSize={10}/><YAxis fontSize={10}/><Tooltip/><Bar dataKey="arıza" fill="#1fb6ff" name="Arıza Adedi"/></BarChart></ResponsiveContainer>
              </div>
            </Card>
          </Col>
          <Col span={8}>
            <Card title="Arıza Süresi Dağılımı" style={cardStyle}>
              <div style={{ height: 220 }}>
                <ResponsiveContainer><LineChart data={aylikData}><CartesianGrid strokeDasharray="3 3" vertical={false}/><XAxis dataKey="name" fontSize={10}/><YAxis fontSize={10}/><Tooltip/><Legend verticalAlign="bottom" iconType="circle"/><Line type="monotone" dataKey="t2" stroke="#27ae60" name="1-2 saat"/><Line type="monotone" dataKey="t1" stroke="#1fb6ff" name="< 1 saat"/><Line type="monotone" dataKey="t3" stroke="#f39c12" name="> 2 saat"/></LineChart></ResponsiveContainer>
              </div>
            </Card>
          </Col>
          <Col span={8}>
            <Card title="Planlanan / Tamamlanan (Periyot)" style={cardStyle}>
              <div style={{ height: 220 }}>
                <ResponsiveContainer><BarChart data={[{n:'Aylık',p:80,t:78},{n:'Haftalık',p:65,t:60},{n:'Üç Aylık',p:35,t:30},{n:'Yıllık',p:60,t:55},{n:'Günlük',p:60,t:25}]}><CartesianGrid strokeDasharray="3 3" vertical={false}/><XAxis dataKey="n" fontSize={10}/><YAxis fontSize={10}/><Tooltip/><Legend verticalAlign="bottom"/><Bar dataKey="p" fill="#27ae60" name="Planlanan"/><Bar dataKey="t" fill="#1fb6ff" name="Tamamlanan"/></BarChart></ResponsiveContainer>
              </div>
            </Card>
          </Col>
        </Row>

      </div>
      <Modal
        title={<Title level={4}>KPI Sözlüğü & Hesaplama Metotları</Title>}
        open={isModalOpen}
        onOk={() => setIsModalOpen(false)}
        onCancel={() => setIsModalOpen(false)}
        width={1000}
        footer={[<Button key="close" type="primary" onClick={() => setIsModalOpen(false)}>Anladım</Button>]}
      >
        <Table 
          columns={kpiSözlüğüColumns} 
          dataSource={kpiSözlüğüData} 
          pagination={false} 
          bordered 
          size="middle"
        />
      </Modal>
    </div>
  );
}