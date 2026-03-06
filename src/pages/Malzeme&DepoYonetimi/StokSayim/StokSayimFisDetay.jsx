import React, { useMemo, useState } from "react";
import { 
  Modal, 
  Table, 
  Tag, 
  Button, 
  Input, 
  Space, 
  Typography, 
  Descriptions, 
  Divider, 
  Row, 
  Col,
  Card
} from "antd";
import {
  SearchOutlined,
  PrinterOutlined,
  DownloadOutlined,
  CheckCircleOutlined,
  MinusCircleOutlined,
  PlusCircleOutlined,
  FileTextOutlined,
  EnvironmentOutlined,
  UserOutlined,
  CalendarOutlined
} from "@ant-design/icons";

const { Text, Title } = Typography;

const demoRows = [
    { id: 1, key: 1, code: "MZ-00125", name: "Hidrolik Yağ 20L", unit: "Adet", systemQty: 120, countedQty: 118, unitCost: 920, location: "Merkez Depo" },
    { id: 2, key: 2, code: "MZ-00456", name: "Yağ Filtresi", unit: "Adet", systemQty: 80, countedQty: 80, unitCost: 165, location: "Merkez Depo" },
    { id: 3, key: 3, code: "MZ-00987", name: "Civata M12", unit: "Adet", systemQty: 1000, countedQty: 1020, unitCost: 2.75, location: "Atölye Depo" },
  ];

export default function StokSayimFisDetay({ visible, onClose, receiptData }) {
  const [searchText, setSearchText] = useState("");

  const columns = [
    { title: "Malzeme", dataIndex: "code", key: "code", render: (t, r) => (
      <Space direction="vertical" size={0}>
        <Text strong>{t}</Text>
      </Space>
    )},
    { title: "Adı", dataIndex: "code", key: "code", render: (t, r) => (
      <Space direction="vertical" size={0}>
        <Text style={{ fontSize: 12 }}>{r.name}</Text>
      </Space>
    )},
    { title: "Birim", dataIndex: "unit", key: "unit", align: "right" },
    { title: "Sistem", dataIndex: "systemQty", key: "systemQty", align: "right" },
    { 
      title: "Sayılan", 
      dataIndex: "countedQty", 
      key: "countedQty", 
      align: "right",
      render: (val) => <Text strong underline style={{ cursor: 'pointer' }}>{val}</Text>
    },
    { 
      title: "Fark", 
      key: "diff", 
      align: "right",
      render: (_, r) => {
        const diff = r.countedQty - r.systemQty;
        return <Text type={diff < 0 ? "danger" : diff > 0 ? "primary" : ""}>{diff > 0 ? `+${diff}` : diff}</Text>
      }
    },
    { 
      title: "Durum", 
      key: "status",
      render: (_, r) => {
        const diff = r.countedQty - r.systemQty;
        if (diff === 0) return <Tag color="success" icon={<CheckCircleOutlined />}>Uyumlu</Tag>;
        if (diff < 0) return <Tag color="error" icon={<MinusCircleOutlined />}>Eksik</Tag>;
        return <Tag color="processing" icon={<PlusCircleOutlined />}>Fazla</Tag>;
      }
    },
    { title: "Birim Maliyet", dataIndex: "unitCost", key: "unitCost", align: "right", render: (v) => `₺${v.toLocaleString('tr-TR')}` },
    { 
      title: "Fark Tutarı", 
      key: "diffTotal", 
      align: "right", 
      render: (_, r) => {
        const diff = r.countedQty - r.systemQty;
        const total = diff * r.unitCost;
        return (
          <Text strong type={total < 0 ? "danger" : total > 0 ? "success" : ""}>
            {total > 0 ? `+₺${total.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}` : `₺${total.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}`}
          </Text>
        );
      } 
    },
    { title: "Lokasyon", dataIndex: "location", key: "location" },
  ];

  return (
    <Modal
      title={
        <Space>
          <FileTextOutlined style={{ color: '#1890ff' }} />
          <span>Stok Sayım Fişi Detayı - {receiptData?.countNo}</span>
        </Space>
      }
      open={visible}
      onCancel={onClose}
      width={1100}
      centered
      footer={[
        <Button key="print" icon={<PrinterOutlined />} onClick={() => window.print()}>Yazdır</Button>,
        <Button key="csv" icon={<DownloadOutlined />}>CSV Aktar</Button>,
        <Button key="close" type="primary" onClick={onClose}>Kapat</Button>
      ]}
    >
      <div className="sayim-detay-wrapper">
        <Card size="small" style={{ marginBottom: 16, background: '#fafafa' }}>
          <Descriptions size="small" column={3}>
            <Descriptions.Item label={<Space><EnvironmentOutlined /> Depo</Space>}><b>{receiptData?.warehouse || 'Belirtilmemiş'}</b></Descriptions.Item>
            <Descriptions.Item label={<Space><CalendarOutlined /> Başlangıç</Space>}>{receiptData?.startedAt}</Descriptions.Item>
            <Descriptions.Item label={<Space><UserOutlined /> Açan</Space>}>{receiptData?.createdBy}</Descriptions.Item>
            <Descriptions.Item label="Tür"><b>{receiptData?.kind}</b></Descriptions.Item>
            <Descriptions.Item label="Durum">
                <Tag color={receiptData?.state === 'open' ? 'processing' : 'error'}>
                    {receiptData?.state === 'open' ? 'Açık' : 'Kapalı'}
                </Tag>
            </Descriptions.Item>
          </Descriptions>
        </Card>

        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
          <Input 
            placeholder="Malzeme kodu veya adıyla filtrele..." 
            prefix={<SearchOutlined />} 
            style={{ width: 300 }}
            onChange={e => setSearchText(e.target.value)}
          />
          <Space>
             <Tag color="default">Toplam Kalem: {demoRows.length}</Tag>
             <Text type="secondary">Fark Tutarı: <Text strong>₺2.450,00</Text></Text>
          </Space>
        </div>

        <Table 
          columns={columns} 
          dataSource={demoRows} 
          size="small" 
          pagination={false} 
          scroll={{ y: 400 }}
        />

        <Divider orientation="left" style={{ fontSize: 12 }}>Onay & İmza</Divider>
        <Row gutter={16}>
          {['Sayımı Yapan', 'Kontrol Eden', 'Onaylayan'].map(label => (
            <Col span={8} key={label}>
              <div style={{ padding: 12, border: '1px dashed #d9d9d9', borderRadius: 8, textAlign: 'center' }}>
                <Text type="secondary" style={{ fontSize: 11 }}>{label}</Text>
                <div style={{ height: 40 }}></div>
                <Divider style={{ margin: '4px 0' }} />
                <Text size="small">İmza</Text>
              </div>
            </Col>
          ))}
        </Row>
      </div>
    </Modal>
  );
}