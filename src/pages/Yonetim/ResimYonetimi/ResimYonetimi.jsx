import React, { useMemo, useState } from "react";
import {
  Table,
  Button,
  Input,
  Select,
  Tag,
  Space,
  Badge,
  Modal,
  Drawer,
  Checkbox,
  Dropdown,
  message,
  Card,
  Typography,
  Image,
  Segmented,
  Row,
  Col,
  Descriptions,
  Divider,
} from "antd";
import {
  SearchOutlined,
  AppstoreOutlined,
  BarsOutlined,
  DeleteOutlined,
  DownloadOutlined,
  EllipsisOutlined,
  FileTextOutlined,
  PictureOutlined,
  EnvironmentOutlined,
  UserOutlined,
  LinkOutlined,
  TagOutlined,
  PlusOutlined,
} from "@ant-design/icons";

const { Text, Title } = Typography;

// -------------------- Mock Data --------------------
const demoMedia = Array.from({ length: 8 }).map((_, i) => ({
  key: String(i + 1),
  id: String(i + 1),
  fileName: i % 3 === 0 ? `ekipman_saha_${i}.jpg` : `belge_no_10${i}.png`,
  thumb: `https://picsum.photos/id/${i + 20}/400/300`,
  product: "PBT PRO",
  module: "Bakım",
  entityLabel: i % 2 === 0 ? `WO-50${i}` : `EQ-20${i}`,
  shotType: i % 3 === 0 ? "Saha" : "Belge",
  status: i % 5 === 0 ? "Arşiv" : "Aktif",
  uploadedBy: "Nur A.",
  capturedAt: "2026-01-20",
  sizeKb: 450 + (i * 10),
  location: "Şantiye A",
  tags: ["hasar", "kontrol"],
}));

export default function AntDMediaGallery() {
  const [data, setData] = useState(demoMedia);
  const [viewMode, setViewMode] = useState("Grid"); // Grid | List
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [activeItem, setActiveItem] = useState(null);
  const [drawerVisible, setDrawerVisible] = useState(false);

  // Toplu İşlemler Menüsü
  const bulkMenu = {
    items: [
      { key: 'download', label: 'ZIP Olarak İndir', icon: <DownloadOutlined /> },
      { key: 'tag', label: 'Etiketle', icon: <TagOutlined /> },
      { key: 'delete', label: 'Sil', icon: <DeleteOutlined />, danger: true },
    ],
    onClick: ({ key }) => {
      if (selectedRowKeys.length === 0) return message.warning("Önce seçim yapmalısın.");
      message.info(`${selectedRowKeys.length} öğe için ${key} işlemi seçildi.`);
    }
  };

  const filteredData = data.filter(item => 
    item.fileName.toLowerCase().includes(searchText.toLowerCase()) ||
    item.entityLabel.toLowerCase().includes(searchText.toLowerCase())
  );

  // Liste Görünümü Kolonları
  const columns = [
    {
      title: 'Dosya',
      dataIndex: 'fileName',
      key: 'fileName',
      render: (text, record) => (
        <Space>
          {record.shotType === "Saha" ? <PictureOutlined /> : <FileTextOutlined />}
          <Text strong className="text-blue-600 cursor-pointer" onClick={() => { setActiveItem(record); setDrawerVisible(true); }}>
            {text}
          </Text>
        </Space>
      )
    },
    { title: 'Modül / Kayıt', key: 'ref', render: (_, r) => <Text size="small">{r.module} · {r.entityLabel}</Text> },
    { title: 'Tip', dataIndex: 'shotType', key: 'shotType', render: (t) => <Tag>{t}</Tag> },
    { title: 'Tarih', dataIndex: 'capturedAt', key: 'capturedAt' },
    { title: 'Boyut', dataIndex: 'sizeKb', key: 'sizeKb', align: 'right', render: (v) => `${v} KB` },
  ];

  return (
    <div style={{ 
      padding: "min(24px, 2vw)", 
      background: "#f0f2f5", 
      minHeight: "100vh" 
    }}>
      {/* Container: Geniş ekranlarda çok yayılmasın diye max-width ekledik */}
      <div style={{ maxWidth: 1920, margin: "0 auto", width: '100%' }}>
        
        {/* Üst Kontrol Paneli - Responsive Yapı */}
        <Card 
          bordered={false} 
          style={{ borderRadius: 16, marginBottom: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
          bodyStyle={{ padding: '16px 24px' }}
        >
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            flexWrap: 'wrap', 
            gap: 16 
          }}>
            <Space size="middle" wrap>
              <Input
                placeholder="Medya veya kayıt ara..."
                prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
                style={{ width: 'clamp(200px, 25vw, 350px)', borderRadius: 8 }}
                onChange={e => setSearchText(e.target.value)}
              />
              <Segmented
                options={[
                  { label: 'Grid', value: 'Grid', icon: <AppstoreOutlined /> },
                  { label: 'Liste', value: 'List', icon: <BarsOutlined /> },
                ]}
                value={viewMode}
                onChange={setViewMode}
              />
            </Space>

            <Space wrap>
              {selectedRowKeys.length > 0 && (
                <Badge count={selectedRowKeys.length} overflowCount={999} style={{ backgroundColor: '#108ee9' }}>
                   <Text type="secondary" style={{ marginRight: 8 }}>Seçili</Text>
                </Badge>
              )}
              <Dropdown menu={bulkMenu}>
                <Button disabled={selectedRowKeys.length === 0} icon={<EllipsisOutlined />}>Toplu İşlemler</Button>
              </Dropdown>
              <Button type="primary" icon={<PictureOutlined />} size="large" style={{ borderRadius: 8 }}>
                Yeni Yükle
              </Button>
            </Space>
          </div>
        </Card>

        {/* İçerik Alanı - Dinamik Grid */}
        <div style={{ 
          height: 'calc(100vh - 200px)', // Ekran yüksekliğine göre içerik alanı
          overflowY: 'auto', 
          paddingRight: 4,
          paddingBottom: 20
        }}>
          {viewMode === "Grid" ? (
            <Row gutter={[16, 16]}>
              {filteredData.map(item => (
                <Col 
                  xs={24}   // Mobilde 1 kart
                  sm={12}   // Tablette 2 kart
                  md={8}    // Küçük monitörde 3 kart
                  lg={6}    // Standart monitörde 4 kart
                  xl={4}    // Büyük (27") monitörde 6 kart
                  xxl={3}   // UltraWide monitörde 8 kart
                  key={item.id}
                >
                  <Card
                    hoverable
                    bodyStyle={{ padding: 12 }}
                    style={{ borderRadius: 12, overflow: 'hidden', height: '100%' }}
                    cover={
                      <div style={{ position: 'relative', overflow: 'hidden', height: 180 }}>
                        <Image
                          alt={item.fileName}
                          preview={false} // Kart üzerinden tıklayınca detay açılsın diye
                          src={item.thumb}
                          height="100%"
                          width="100%"
                          style={{ objectFit: 'cover' }}
                        />
                        <div style={{ position: 'absolute', top: 8, left: 8 }}>
                          <Checkbox 
                            checked={selectedRowKeys.includes(item.key)}
                            onChange={(e) => {
                              const nextKeys = e.target.checked 
                                ? [...selectedRowKeys, item.key]
                                : selectedRowKeys.filter(k => k !== item.key);
                              setSelectedRowKeys(nextKeys);
                            }}
                          />
                        </div>
                        <Tag color="rgba(0,0,0,0.6)" style={{ position: 'absolute', bottom: 8, right: 4, margin: 0 }}>
                          {item.shotType}
                        </Tag>
                      </div>
                    }
                    onClick={() => { setActiveItem(item); setDrawerVisible(true); }}
                  >
                    <Text strong ellipsis style={{ display: 'block' }}>{item.fileName}</Text>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                      <Text type="secondary" style={{ fontSize: 11 }}>{item.entityLabel}</Text>
                      <Text type="secondary" style={{ fontSize: 11 }}>{item.capturedAt}</Text>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          ) : (
            <Card bodyStyle={{ padding: 0 }} style={{ borderRadius: 16, overflow: 'hidden' }}>
              <Table
                rowSelection={{ selectedRowKeys, onChange: setSelectedRowKeys }}
                columns={columns}
                dataSource={filteredData}
                pagination={{ pageSize: 20, showSizeChanger: true }}
                size="middle"
                scroll={{ x: 'max-content', y: 'calc(100vh - 380px)' }}
                sticky
              />
            </Card>
          )}
        </div>
      </div>

      {/* Detay Drawer */}
      <Drawer
        title="Medya Detayları"
        width={500}
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        extra={
          <Space>
            <Button icon={<DownloadOutlined />} />
            <Button danger icon={<DeleteOutlined />} />
          </Space>
        }
      >
        {activeItem && (
          <Space direction="vertical" style={{ width: '100%' }} size="large">
            <Image
              src={activeItem.thumb}
              width="100%"
              style={{ borderRadius: 12, maxHeight: 300, objectFit: 'contain', background: '#000' }}
            />
            
            <Descriptions title="Dosya Bilgileri" bordered column={1} size="small">
              <Descriptions.Item label="Dosya Adı">
                {activeItem.fileName}
              </Descriptions.Item>
              <Descriptions.Item label="Ürün / Modül">
                {activeItem.product} · {activeItem.module}
              </Descriptions.Item>
              <Descriptions.Item label="Bağlı Kayıt">
                <Space>
                  <LinkOutlined /> 
                  <Text strong>{activeItem.entityLabel}</Text>
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="Lokasyon">
                <Space>
                  <EnvironmentOutlined /> 
                  {activeItem.location}
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="Yükleyen">
                <Space>
                  <UserOutlined /> 
                  {activeItem.uploadedBy} ({activeItem.capturedAt})
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="Durum">
                <Badge status={activeItem.status === "Aktif" ? "success" : "default"} text={activeItem.status} />
              </Descriptions.Item>
            </Descriptions>

            <Divider orientation="left">Etiketler</Divider>
            <Space wrap>
              {activeItem.tags.map(tag => (
                <Tag icon={<TagOutlined />} key={tag}>
                  {tag}
                </Tag>
              ))}
              <Button type="dashed" size="small" icon={<PlusOutlined />}>
                Ekle
              </Button>
            </Space>
          </Space>
        )}
      </Drawer>
    </div>
  );
}