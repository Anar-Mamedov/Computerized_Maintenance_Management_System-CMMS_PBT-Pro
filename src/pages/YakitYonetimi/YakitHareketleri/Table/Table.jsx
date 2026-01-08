import React, { useCallback, useEffect, useState, useMemo, useRef } from "react";
import { Table, Button, Modal, Checkbox, Input, Spin, Typography, Card, Tag, Space, Tooltip, Select, Divider } from "antd";
import { HolderOutlined, SearchOutlined, MenuOutlined, EditOutlined, DeleteOutlined, FilterOutlined, FileExcelOutlined, ArrowRightOutlined } from "@ant-design/icons";
import { DndContext, useSensor, useSensors, PointerSensor, KeyboardSensor } from "@dnd-kit/core";
import { sortableKeyboardCoordinates, arrayMove, useSortable, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Resizable } from "react-resizable";
import "./ResizeStyle.css"; 
import * as XLSX from "xlsx";
import dayjs from "dayjs";

const { Text } = Typography;
const { Option } = Select;

// --- Yardımcı Fonksiyonlar ---
const ResizableTitle = (props) => {
  const { onResize, width, ...restProps } = props;

  if (!width) {
    return <th {...restProps} />;
  }

  return (
    <Resizable
      width={width}
      height={0}
      handle={
        <span
          className="react-resizable-handle"
          onClick={(e) => e.stopPropagation()}
          style={{
            position: "absolute",
            bottom: 0,
            right: "-5px",
            width: "10px",
            height: "100%",
            zIndex: 10,
            cursor: "col-resize",
          }}
        />
      }
      onResize={onResize}
      draggableOpts={{ enableUserSelectHack: false }}
    >
      <th {...restProps} />
    </Resizable>
  );
};

const DraggableRow = ({ id, text, index, moveRow, className, style, visible, onVisibilityChange, ...restProps }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const styleWithTransform = {
    ...style,
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    backgroundColor: isDragging ? "#f0f0f0" : "",
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "8px",
    borderBottom: "1px solid #f0f0f0",
  };

  return (
    <div ref={setNodeRef} style={styleWithTransform} {...restProps} {...attributes}>
      <div {...listeners} style={{ cursor: "grab", flexGrow: 1, display: "flex", alignItems: "center" }}>
        <HolderOutlined style={{ marginRight: 8, color: "#999" }} />
        {text}
      </div>
      <Checkbox
        checked={visible}
        onChange={(e) => onVisibilityChange(text, e.target.checked)}
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
};

// --- Ana Bileşen ---
const MainTable = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  
  // --- STATİK VERİ TANIMLAMASI (Hareket Listesi) ---
  const movementData = [
    {
      key: 1,
      tarih: "2025-12-30 08:41",
      kod: "M-24006",
      tip: "Transfer",
      yakit: "Motorin",
      depo: "Mobil Tanker",
      hedef: "Güney Depo",
      lokasyon: "İzmir Şantiye",
      miktar: 950,
      birimFiyat: null,
      tutar: null,
      refTip: "Transfer",
      refNo: "TR-2025/145"
    },
    {
      key: 2,
      tarih: "2025-12-30 08:41",
      kod: "M-24005",
      tip: "Çıkış",
      yakit: "Motorin",
      depo: "Merkez Depo",
      hedef: null,
      lokasyon: "Bursa Şantiye",
      miktar: 180,
      birimFiyat: null,
      tutar: null,
      refTip: "Dolum",
      refNo: "DL-2025/5528"
    },
    {
      key: 3,
      tarih: "2025-12-29 16:02",
      kod: "M-24004",
      tip: "Sarf",
      yakit: "AdBlue",
      depo: "Merkez Depo",
      hedef: null,
      lokasyon: "Bursa Şantiye",
      miktar: 80,
      birimFiyat: null,
      tutar: 0.00,
      refTip: "Sarf",
      refNo: "SR-2025/302"
    },
    {
      key: 4,
      tarih: "2025-12-29 14:20",
      kod: "M-24003",
      tip: "Çıkış",
      yakit: "Motorin",
      depo: "Kuzey Depo",
      hedef: null,
      lokasyon: "Bursa Şantiye",
      miktar: 260,
      birimFiyat: null,
      tutar: null,
      refTip: "Dolum",
      refNo: "DL-2025/5519"
    },
  ];

  // --- Kolon Tanımları (Yeni yapı) ---
  const initialColumns = [
    {
      title: "Tarih/Saat",
      dataIndex: "tarih",
      key: "tarih",
      width: 160,
      visible: true,
      render: (text, record) => (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ fontWeight: 600 }}>{text}</span>
          <span style={{ fontSize: "11px", color: "#8c8c8c" }}>{record.kod}</span>
        </div>
      ),
      sorter: (a, b) => dayjs(a.tarih).unix() - dayjs(b.tarih).unix(),
    },
    {
      title: "Tip",
      dataIndex: "tip",
      key: "tip",
      width: 100,
      visible: true,
      render: (text) => {
        let color = "default";
        if (text === "Giriş") color = "green";
        if (text === "Çıkış") color = "red";
        if (text === "Transfer") color = "blue";
        if (text === "Sarf") color = "orange";
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: "Yakıt",
      dataIndex: "yakit",
      key: "yakit",
      width: 100,
      visible: true,
    },
    {
      title: "Depo",
      dataIndex: "depo",
      key: "depo",
      width: 140,
      visible: true,
      render: (text) => <span style={{fontWeight: 500}}>{text}</span>
    },
    {
      title: "Hedef",
      dataIndex: "hedef",
      key: "hedef",
      width: 140,
      visible: true,
      render: (text) => text ? <span><ArrowRightOutlined style={{fontSize: 10, color: '#999', marginRight: 5}}/>{text}</span> : <span style={{color: '#ccc'}}>—</span>
    },
    {
      title: "Lokasyon",
      dataIndex: "lokasyon",
      key: "lokasyon",
      width: 150,
      visible: true,
    },
    {
      title: "Miktar",
      dataIndex: "miktar",
      key: "miktar",
      width: 110,
      visible: true,
      render: (val) => <span style={{ fontWeight: 600 }}>{val.toLocaleString('tr-TR')} L</span>,
      sorter: (a, b) => a.miktar - b.miktar,
    },
    {
      title: "Birim",
      dataIndex: "birimFiyat",
      key: "birimFiyat",
      width: 100,
      visible: true,
      render: (val) => val ? <span>${val.toFixed(2)}</span> : <span style={{color: '#ccc'}}>—</span>
    },
    {
      title: "Tutar",
      dataIndex: "tutar",
      key: "tutar",
      width: 120,
      visible: true,
      render: (val) => val !== null ? <span style={{ fontWeight: 600 }}>${val.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</span> : <span style={{color: '#ccc'}}>—</span>,
      sorter: (a, b) => (a.tutar || 0) - (b.tutar || 0),
    },
    {
      title: "Referans",
      dataIndex: "refNo",
      key: "refNo",
      width: 150,
      visible: true,
      render: (text, record) => (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ fontSize: "12px", fontWeight: 500 }}>{record.refTip}</span>
          <span style={{ fontSize: "11px", color: "#1890ff" }}>{text}</span>
        </div>
      ),
    }
  ];

  // --- Verileri Yükle (Simüle Edilmiş) ---
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
        let filteredData = movementData;

        // Arama filtresi
        if (searchTerm) {
            const lowerTerm = searchTerm.toLowerCase();
            filteredData = movementData.filter(item => 
                item.kod.toLowerCase().includes(lowerTerm) ||
                item.depo.toLowerCase().includes(lowerTerm) ||
                item.refNo.toLowerCase().includes(lowerTerm) ||
                (item.hedef && item.hedef.toLowerCase().includes(lowerTerm))
            );
        }
        setData(filteredData);
        setLoading(false);
    }, 500);
  }, [searchTerm]);

  // --- İstatistik Kartları (ÖZET) ---
  const cardItems = useMemo(() => {
    return [
      { title: "Toplam Giriş", value: "12.000 L", subTitle: "Tutar: $13.440,00", color: "#f6ffed", icon: <ArrowRightOutlined rotate={45} style={{color: '#52c41a'}}/> },
      { title: "Toplam Çıkış", value: "440 L", subTitle: "Seçili filtre", color: "#fff1f0", icon: <ArrowRightOutlined rotate={-45} style={{color: '#f5222d'}}/> },
      { title: "Transfer", value: "5.450 L", subTitle: "Seçili filtre", color: "#e6f7ff", icon: <ArrowRightOutlined style={{color: '#1890ff'}}/> },
      { title: "Sarf", value: "80 L", subTitle: "Tutar: $0,00", color: "#fff7e6", icon: <FilterOutlined style={{color: '#fa8c16'}}/> },
    ];
  }, []);


  // --- Sütun Yönetimi (LocalStorage & State) ---
  const [columns, setColumns] = useState(() => {
    // Key ismini değiştirdim, eski yakıt listesi ayarları ile çakışmasın
    const savedOrder = localStorage.getItem("columnMovementOrder");
    const savedVisibility = localStorage.getItem("columnMovementVisibility");
    const savedWidths = localStorage.getItem("columnMovementWidths");

    let order = savedOrder ? JSON.parse(savedOrder) : [];
    let visibility = savedVisibility ? JSON.parse(savedVisibility) : {};
    let widths = savedWidths ? JSON.parse(savedWidths) : {};

    initialColumns.forEach((col) => {
      if (!order.includes(col.key)) order.push(col.key);
      if (visibility[col.key] === undefined) visibility[col.key] = col.visible;
      if (widths[col.key] === undefined) widths[col.key] = col.width;
    });

    return order.map((key) => {
      const column = initialColumns.find((col) => col.key === key);
      return column ? { ...column, visible: visibility[key], width: widths[key] } : null;
    }).filter(Boolean);
  });

  useEffect(() => {
    if (columns.length > 0) {
        localStorage.setItem("columnMovementOrder", JSON.stringify(columns.map((col) => col.key)));
        localStorage.setItem("columnMovementVisibility", JSON.stringify(columns.reduce((acc, col) => ({ ...acc, [col.key]: col.visible }), {})));
        localStorage.setItem("columnMovementWidths", JSON.stringify(columns.reduce((acc, col) => ({ ...acc, [col.key]: col.width }), {})));
    }
  }, [columns]);

  // Sütun Drag & Drop
  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = columns.findIndex((col) => col.key === active.id);
      const newIndex = columns.findIndex((col) => col.key === over.id);
      setColumns((items) => arrayMove(items, oldIndex, newIndex));
    }
  };

  const handleResize = (key) => (_, { size }) => {
    setColumns((prev) => prev.map((col) => (col.key === key ? { ...col, width: size.width } : col)));
  };

  const toggleVisibility = (key, checked) => {
    const newColumns = [...columns];
    const index = newColumns.findIndex((col) => col.key === key);
    if (index !== -1) {
      newColumns[index].visible = checked;
      setColumns(newColumns);
    }
  };

  const resetColumns = () => {
    localStorage.removeItem("columnMovementOrder");
    localStorage.removeItem("columnMovementVisibility");
    localStorage.removeItem("columnMovementWidths");
    window.location.reload();
  };

  // Excel İndirme
  const handleDownloadXLSX = () => {
    const xlsxData = data.map((item) => ({
      "Tarih": item.tarih,
      "Hareket Kodu": item.kod,
      "Tip": item.tip,
      "Yakıt": item.yakit,
      "Depo": item.depo,
      "Hedef Depo": item.hedef || "-",
      "Lokasyon": item.lokasyon,
      "Miktar": item.miktar,
      "Tutar": item.tutar || 0,
      "Referans": item.refNo
    }));

    const worksheet = XLSX.utils.json_to_sheet(xlsxData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Hareket Listesi");
    XLSX.writeFile(workbook, `Yakit_Hareketleri_${dayjs().format("DD_MM_YYYY")}.xlsx`);
  };

  // Ant Design Table Bileşenleri
  const components = {
    header: { cell: ResizableTitle },
  };

  const visibleColumns = columns.filter((col) => col.visible).map((col) => ({
    ...col,
    onHeaderCell: (column) => ({
      width: column.width,
      onResize: handleResize(column.key),
    }),
  }));

  return (
    <div style={{ padding: "20px", background: "#f5f5f5", minHeight: "100vh" }}>
      {/* Sütun Yönetim Modalı */}
      <Modal 
        title="Sütun Yönetimi" 
        open={isModalVisible} 
        onOk={() => setIsModalVisible(false)} 
        onCancel={() => setIsModalVisible(false)}
        footer={[<Button key="reset" onClick={resetColumns}>Sıfırla</Button>, <Button key="ok" type="primary" onClick={() => setIsModalVisible(false)}>Tamam</Button>]}
      >
        <div style={{ display: "flex", gap: 20 }}>
            <div style={{ flex: 1, border: "1px solid #eee", padding: 10, borderRadius: 5 }}>
                <h4>Göster / Gizle</h4>
                {columns.map(col => (
                    <div key={col.key} style={{ marginBottom: 5 }}>
                        <Checkbox checked={col.visible} onChange={(e) => toggleVisibility(col.key, e.target.checked)}>
                            {col.title}
                        </Checkbox>
                    </div>
                ))}
            </div>
            <div style={{ flex: 1, border: "1px solid #eee", padding: 10, borderRadius: 5 }}>
                <h4>Sıralama (Sürükle)</h4>
                <DndContext sensors={useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }))} onDragEnd={handleDragEnd}>
                    <SortableContext items={columns.map(c => c.key)} strategy={verticalListSortingStrategy}>
                        {columns.filter(c => c.visible).map((col, index) => (
                            <DraggableRow key={col.key} id={col.key} text={col.title} visible={col.visible} onVisibilityChange={toggleVisibility} />
                        ))}
                    </SortableContext>
                </DndContext>
            </div>
        </div>
      </Modal>

      {/* Üst Filtre Alanı */}
      <div style={{ background: "#fff", padding: "15px", borderRadius: "8px", marginBottom: "15px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
            <Input 
                placeholder="Ara: evrak no, depo, makine/araç kodu, açıklama…" 
                prefix={<SearchOutlined style={{ color: "#bfbfbf" }} />} 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ width: 350 }}
                allowClear
            />
            <Select placeholder="Tüm Depolar" style={{ width: 150 }} allowClear>
                <Option value="merkez">Merkez Depo</Option>
                <Option value="kuzey">Kuzey Depo</Option>
            </Select>
            <Select placeholder="Tüm Lokasyonlar" style={{ width: 150 }} allowClear>
                <Option value="bursa">Bursa Şantiye</Option>
                <Option value="izmir">İzmir Şantiye</Option>
            </Select>
            <Select placeholder="Tüm Yakıtlar" style={{ width: 140 }} allowClear>
                <Option value="motorin">Motorin</Option>
                <Option value="adblue">AdBlue</Option>
            </Select>
            <Button icon={<FilterOutlined />}>Tarih Aralığı</Button>
        </div>
      </div>

      {/* İstatistik Kartları */}
      <div style={{ display: "flex", gap: "15px", marginBottom: "20px", flexWrap: "wrap" }}>
        {cardItems.map((item, index) => (
          <Card key={index} style={{ flex: 1, minWidth: "200px", borderRadius: "10px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)", background: item.color }} bodyStyle={{ padding: "15px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                <div>
                    <Text type="secondary" style={{ fontSize: "12px", fontWeight: 600 }}>{item.title}</Text>
                    <div style={{ fontSize: "22px", fontWeight: "700", color: "#333", marginTop: "2px" }}>{item.value}</div>
                    <Text type="secondary" style={{ fontSize: "11px" }}>{item.subTitle}</Text>
                </div>
                <div style={{fontSize: '20px', opacity: 0.8}}>{item.icon}</div>
            </div>
          </Card>
        ))}
      </div>

      {/* Sekmeler ve Araç Çubuğu */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
        <div style={{ display: "flex", gap: "5px" }}>
            <Button type="primary" shape="round">Tümü</Button>
            <Button shape="round">Giriş</Button>
            <Button shape="round">Çıkış</Button>
            <Button shape="round">Transfer</Button>
            <Button shape="round">Sarf</Button>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
            <Button icon={<MenuOutlined />} onClick={() => setIsModalVisible(true)}>Sütunlar</Button>
            <Button icon={<FileExcelOutlined style={{ color: "green" }} />} onClick={handleDownloadXLSX}>Excel</Button>
        </div>
      </div>

      {/* Tablo */}
      <div style={{ background: "#fff", padding: "0px", borderRadius: "8px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
        <Table
          components={components}
          columns={visibleColumns}
          dataSource={data}
          loading={loading}
          pagination={{ defaultPageSize: 10, showSizeChanger: true, showTotal: (total) => `${total} kayıt` }}
          scroll={{ x: 1200, y: "calc(100vh - 420px)" }}
          size="middle"
          rowSelection={{
            selectedRowKeys,
            onChange: setSelectedRowKeys,
          }}
          footer={() => <span style={{fontSize: '12px', color: '#666'}}><b>Not:</b> Transfer hareketleri hem kaynak depoda çıkış, hedef depoda giriş stok etkisi doğurur.</span>}
        />
      </div>
    </div>
  );
};

export default MainTable;