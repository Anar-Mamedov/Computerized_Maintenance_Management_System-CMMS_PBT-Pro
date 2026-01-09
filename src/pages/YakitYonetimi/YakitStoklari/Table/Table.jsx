import React, { useCallback, useEffect, useState, useMemo, useRef } from "react";
import { Table, Button, Modal, Checkbox, Input, Spin, Typography, Tag, Progress, message, Card } from "antd";
import { HolderOutlined, SearchOutlined, MenuOutlined, CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { DndContext, useSensor, useSensors, PointerSensor, KeyboardSensor } from "@dnd-kit/core";
import { sortableKeyboardCoordinates, arrayMove, useSortable, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Resizable } from "react-resizable";
import "./ResizeStyle.css"; // Projenizdeki stil dosyası
import * as XLSX from "xlsx";
import { SiMicrosoftexcel } from "react-icons/si";

const { Text } = Typography;

// --- Helper Functions (Text Extraction) ---
import { isValidElement } from "react";
function extractTextFromElement(element) {
  let text = "";
  if (typeof element === "string") {
    text = element;
  } else if (Array.isArray(element)) {
    text = element.map((child) => extractTextFromElement(child)).join("");
  } else if (isValidElement(element)) {
    text = extractTextFromElement(element.props.children);
  } else if (element !== null && element !== undefined) {
    text = element.toString();
  }
  return text;
}

// --- Resizable Components ---
const ResizableTitle = (props) => {
  const { onResize, width, ...restProps } = props;
  if (!width) return <th {...restProps} />;
  return (
    <Resizable
      width={width}
      height={0}
      handle={
        <span
          className="react-resizable-handle"
          onClick={(e) => e.stopPropagation()}
          style={{ position: "absolute", bottom: 0, right: "-5px", width: "10px", height: "100%", zIndex: 10, cursor: "col-resize" }}
        />
      }
      onResize={onResize}
      draggableOpts={{ enableUserSelectHack: false }}
    >
      <th {...restProps} />
    </Resizable>
  );
};

const DraggableRow = ({ id, text, index, visible, onVisibilityChange, ...restProps }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const styleWithTransform = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    backgroundColor: isDragging ? "#f0f0f0" : "",
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "8px",
    borderBottom: "1px solid #eee"
  };

  return (
    <div ref={setNodeRef} style={styleWithTransform} {...restProps} {...attributes}>
      <div {...listeners} style={{ cursor: "grab", flexGrow: 1, display: "flex", alignItems: "center" }}>
        <HolderOutlined style={{ marginRight: 8 }} />
        {text}
      </div>
      <Checkbox
        checked={visible}
        onChange={(e) => onVisibilityChange(id, e.target.checked)}
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
};

// --- Main Component ---
const MainTable = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [data, setData] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [columns, setColumns] = useState([]);
  const [xlsxLoading, setXlsxLoading] = useState(false);

  // --- STATİK VERİLER (Dummy Data) ---
  const dummyData = [
    {
      key: 1,
      depoAdi: "Merkez Depo",
      depoKod: "D-001",
      lokasyon: "Ankara",
      yakitTuru: "Dizel",
      mevcut: 42000,
      kapasite: 60000,
      doluluk: 70,
      sonHareket: "2 saat önce",
      durum: "Normal",
    },
    {
      key: 2,
      depoAdi: "Şantiye A",
      depoKod: "D-002",
      lokasyon: "Konya",
      yakitTuru: "Dizel",
      mevcut: 6200,
      kapasite: 20000,
      doluluk: 31,
      sonHareket: "4 saat önce",
      durum: "Düşük",
    },
    {
      key: 3,
      depoAdi: "Şantiye B",
      depoKod: "D-003",
      lokasyon: "İzmir",
      yakitTuru: "Benzin",
      mevcut: 1200,
      kapasite: 10000,
      doluluk: 12,
      sonHareket: "1 gün önce",
      durum: "Kritik",
    },
    {
      key: 4,
      depoAdi: "Şantiye C",
      depoKod: "D-004",
      lokasyon: "Adana",
      yakitTuru: "Dizel",
      mevcut: 19800,
      kapasite: 25000,
      doluluk: 79,
      sonHareket: "35 dk önce",
      durum: "Normal",
    },
  ];

  // --- KART VERİLERİ ---
  const cardItems = [
    { title: "Toplam Depo", value: "4", subTitle: "Tanımlı depo" },
    { title: "Toplam Yakıt", value: "69.200 L", subTitle: "Mevcut stok" },
    { title: "Kritik Depolar", value: "1", subTitle: "Kritik seviyede" },
    { title: "Bugün Giriş / Çıkış", value: "9.600 / 9.200 L", subTitle: "Günlük toplam" },
  ];

  // --- KOLON TANIMLARI ---
  const initialColumns = [
    {
      title: "Depo",
      dataIndex: "depoAdi",
      key: "depoAdi",
      width: 200,
      visible: true,
      render: (text, record) => (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontWeight: 600, color: '#1890ff' }}>{text}</span>
            <span style={{ fontSize: '11px', color: '#888' }}>{record.depoKod}</span>
        </div>
      ),
      sorter: (a, b) => a.depoAdi.localeCompare(b.depoAdi),
    },
    {
      title: "Lokasyon",
      dataIndex: "lokasyon",
      key: "lokasyon",
      width: 150,
      visible: true,
      sorter: (a, b) => a.lokasyon.localeCompare(b.lokasyon),
    },
    {
      title: "Yakıt Türü",
      dataIndex: "yakitTuru",
      key: "yakitTuru",
      width: 120,
      visible: true,
      render: (text) => (
        <Tag color={text === "Dizel" ? "gold" : "green"}>{text}</Tag>
      )
    },
    {
      title: "Mevcut / Kapasite",
      dataIndex: "mevcut",
      key: "mevcut",
      width: 180,
      visible: true,
      render: (_, record) => (
        <div>
            <span style={{ fontWeight: 'bold' }}>{record.mevcut.toLocaleString()} L</span>
            <span style={{ color: '#999', fontSize: '12px' }}> / {record.kapasite.toLocaleString()} L</span>
        </div>
      ),
      sorter: (a, b) => a.mevcut - b.mevcut,
    },
    {
      title: "Doluluk",
      dataIndex: "doluluk",
      key: "doluluk",
      width: 180,
      visible: true,
      render: (percent, record) => {
        let status = "normal";
        let strokeColor = "#1890ff";
        if(record.durum === "Kritik") strokeColor = "#ff4d4f";
        else if (record.durum === "Düşük") strokeColor = "#faad14";
        else strokeColor = "#52c41a";

        return <Progress percent={percent} strokeColor={strokeColor} size="small" />;
      },
      sorter: (a, b) => a.doluluk - b.doluluk,
    },
    {
      title: "Son Hareket",
      dataIndex: "sonHareket",
      key: "sonHareket",
      width: 140,
      visible: true,
    },
    {
      title: "Durum",
      dataIndex: "durum",
      key: "durum",
      width: 120,
      visible: true,
      render: (text) => {
        let color = "default";
        if(text === "Normal") color = "success";
        if(text === "Düşük") color = "warning";
        if(text === "Kritik") color = "error";
        return <Tag color={color}>{text}</Tag>
      }
    }
  ];

  // --- LOCAL STORAGE & COLUMN STATE MANIPULATION ---
  useEffect(() => {
    // LocalStorage'dan ayarları çek, yoksa initialColumns kullan
    // Not: Key ismini değiştirdim 'columnDepoOrder' çakışma olmasın diye
    const savedOrder = localStorage.getItem("columnDepoOrder");
    const savedVisibility = localStorage.getItem("columnDepoVisibility");
    const savedWidths = localStorage.getItem("columnDepoWidths");

    let order = savedOrder ? JSON.parse(savedOrder) : [];
    let visibility = savedVisibility ? JSON.parse(savedVisibility) : {};
    let widths = savedWidths ? JSON.parse(savedWidths) : {};

    const merged = initialColumns.map(col => {
       const isVisible = visibility[col.key] !== undefined ? visibility[col.key] : col.visible;
       const width = widths[col.key] !== undefined ? widths[col.key] : col.width;
       return { ...col, visible: isVisible, width };
    });

    // Eğer saved order varsa ona göre sırala
    if (order.length > 0) {
        merged.sort((a, b) => {
            const indexA = order.indexOf(a.key);
            const indexB = order.indexOf(b.key);
            return (indexA === -1 ? 999 : indexA) - (indexB === -1 ? 999 : indexB);
        });
    }

    setColumns(merged);
  }, []);

  // Columns değiştikçe kaydet
  useEffect(() => {
    if(columns.length > 0) {
        localStorage.setItem("columnDepoOrder", JSON.stringify(columns.map(c => c.key)));
        localStorage.setItem("columnDepoVisibility", JSON.stringify(columns.reduce((acc, c) => ({...acc, [c.key]: c.visible}), {})));
        localStorage.setItem("columnDepoWidths", JSON.stringify(columns.reduce((acc, c) => ({...acc, [c.key]: c.width}), {})));
    }
  }, [columns]);

  // --- DATA FETCHING (SIMULATION) ---
  useEffect(() => {
    setLoading(true);
    // API isteği yerine setTimeout ile simüle ediyoruz
    setTimeout(() => {
        if (searchTerm) {
            const lowerSearch = searchTerm.toLowerCase();
            const filtered = dummyData.filter(item => 
                item.depoAdi.toLowerCase().includes(lowerSearch) || 
                item.lokasyon.toLowerCase().includes(lowerSearch) ||
                item.yakitTuru.toLowerCase().includes(lowerSearch)
            );
            setData(filtered);
        } else {
            setData(dummyData);
        }
        setLoading(false);
    }, 300); // 300ms gecikme
  }, [searchTerm]);

  // --- HANDLERS ---
  const handleResize = (key) => (_, { size }) => {
    setColumns((prev) => prev.map((col) => (col.key === key ? { ...col, width: size.width } : col)));
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = columns.findIndex((col) => col.key === active.id);
      const newIndex = columns.findIndex((col) => col.key === over.id);
      setColumns((items) => arrayMove(items, oldIndex, newIndex));
    }
  };

  const toggleVisibility = (key, checked) => {
    const newColumns = columns.map(col => col.key === key ? { ...col, visible: checked } : col);
    setColumns(newColumns);
  };

  const resetColumns = () => {
    localStorage.removeItem("columnDepoOrder");
    localStorage.removeItem("columnDepoVisibility");
    localStorage.removeItem("columnDepoWidths");
    window.location.reload();
  };

  const handleDownloadXLSX = () => {
    setXlsxLoading(true);
    const dataToExport = data.map(item => ({
        "Depo Adı": item.depoAdi,
        "Kod": item.depoKod,
        "Lokasyon": item.lokasyon,
        "Yakıt Türü": item.yakitTuru,
        "Mevcut (L)": item.mevcut,
        "Kapasite (L)": item.kapasite,
        "Doluluk (%)": item.doluluk,
        "Son Hareket": item.sonHareket,
        "Durum": item.durum
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Depo Stokları");
    XLSX.writeFile(workbook, "Depo_Stok_Durumu.xlsx");
    setXlsxLoading(false);
  };

  // --- TABLE COMPONENTS ---
  const tableComponents = {
    header: { cell: ResizableTitle },
  };

  const visibleColumns = columns.filter(col => col.visible).map(col => ({
      ...col,
      onHeaderCell: (column) => ({
        width: column.width,
        onResize: handleResize(column.key),
      }),
  }));

  const onRowClick = (record) => {
     // Detay drawer açma işlemi burada yapılabilir
     console.log("Satıra tıklandı:", record);
  };

  return (
    <>
      {/* --- SÜTUN YÖNETİM MODALI --- */}
      <Modal title="Sütunları Yönet" centered width={800} open={isModalVisible} onOk={() => setIsModalVisible(false)} onCancel={() => setIsModalVisible(false)}>
        <div style={{ textAlign: "center", marginBottom: 15 }}><Button onClick={resetColumns}>Varsayılana Dön</Button></div>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 20 }}>
          <div style={{ width: "48%", border: "1px solid #eee", padding: 10, borderRadius: 8 }}>
            <h4 style={{ borderBottom: "1px solid #eee", paddingBottom: 5 }}>Göster / Gizle</h4>
            <div style={{ height: 300, overflowY: "auto" }}>
                {columns.map(col => (
                    <div key={col.key} style={{ padding: "5px 0" }}>
                        <Checkbox checked={col.visible} onChange={(e) => toggleVisibility(col.key, e.target.checked)}>
                            {col.title}
                        </Checkbox>
                    </div>
                ))}
            </div>
          </div>
          <div style={{ width: "48%", border: "1px solid #eee", padding: 10, borderRadius: 8 }}>
            <h4 style={{ borderBottom: "1px solid #eee", paddingBottom: 5 }}>Sıralama (Sürükle Bırak)</h4>
            <DndContext sensors={useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }))} onDragEnd={handleDragEnd}>
                 <SortableContext items={columns.map(c => c.key)} strategy={verticalListSortingStrategy}>
                    <div style={{ height: 300, overflowY: "auto" }}>
                        {columns.filter(c => c.visible).map((col, index) => (
                            <DraggableRow key={col.key} id={col.key} text={col.title} index={index} visible={col.visible} onVisibilityChange={toggleVisibility} />
                        ))}
                    </div>
                 </SortableContext>
            </DndContext>
          </div>
        </div>
      </Modal>

      {/* --- KARTLAR --- */}
      <div style={{ display: "flex", gap: "15px", marginBottom: "20px", flexWrap: "wrap" }}>
        {cardItems.map((item, index) => (
             <div key={index} style={{ flex: 1, minWidth: "200px", background: "#fff", padding: "15px", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.05)" }}>
                 <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                        <Text type="secondary" style={{ fontSize: "12px" }}>{item.title}</Text>
                        <div style={{ fontSize: "24px", fontWeight: "bold", margin: "5px 0" }}>{item.value}</div>
                        <Text type="secondary" style={{ fontSize: "12px" }}>{item.subTitle}</Text>
                    </div>
                    <div style={{ fontSize: "24px", background: "#f0f5ff", padding: "10px", borderRadius: "50%" }}>{item.icon}</div>
                 </div>
             </div>
        ))}
      </div>

      {/* --- FİLTRELER VE BUTONLAR --- */}
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", marginBottom: "20px", gap: "10px" }}>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <Button icon={<MenuOutlined />} onClick={() => setIsModalVisible(true)} />
          <Input 
            placeholder="Depo, Lokasyon veya Yakıt ara..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
            prefix={<SearchOutlined style={{ color: "#1890ff" }} />} 
            style={{ width: 300 }} 
          />
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
             <Button icon={<SiMicrosoftexcel />} onClick={handleDownloadXLSX} loading={xlsxLoading}>İndir</Button>
             <Button type="primary">Yeni Depo Ekle</Button>
        </div>
      </div>

      {/* --- TABLO --- */}
      <div style={{ background: "#fff", padding: "0", borderRadius: "8px" }}>
          <Spin spinning={loading}>
            <Table
                components={tableComponents}
                columns={visibleColumns}
                dataSource={data}
                rowSelection={{
                    selectedRowKeys,
                    onChange: setSelectedRowKeys
                }}
                onRow={(record) => ({
                    onClick: () => onRowClick(record),
                })}
                pagination={{ pageSize: 10, showSizeChanger: true }}
                scroll={{ y: "calc(100vh - 400px)" }}
            />
          </Spin>
      </div>
    </>
  );
};

export default MainTable;