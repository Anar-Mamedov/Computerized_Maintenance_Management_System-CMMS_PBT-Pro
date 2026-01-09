import React, { useCallback, useEffect, useState, useMemo, useRef } from "react";
import { Table, Button, Modal, Checkbox, Input, Spin, Typography, Card, Tag, Space, Tooltip, Dropdown, Menu } from "antd";
import { HolderOutlined, SearchOutlined, MenuOutlined, EditOutlined, DeleteOutlined, MoreOutlined, FileExcelOutlined } from "@ant-design/icons";
import { DndContext, useSensor, useSensors, PointerSensor, KeyboardSensor } from "@dnd-kit/core";
import { sortableKeyboardCoordinates, arrayMove, useSortable, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Resizable } from "react-resizable";
import "./ResizeStyle.css"; // Bu dosyanın projenizde olduğunu varsayıyorum
import * as XLSX from "xlsx";
import dayjs from "dayjs";

const { Text } = Typography;

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
        onChange={(e) => onVisibilityChange(text, e.target.checked)} // visible toggle için basit bir logic
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
  
  // İstatistik Kartları için State
  const [cardsData, setCardsData] = useState({
    TOPLAM_TUKETIM: 0,
    TOPLAM_TUTAR: 0,
    ORT_TUKETIM: 0,
    TOPLAM_ISLEM: 0,
  });

  // --- STATİK VERİ TANIMLAMASI ---
  const dummyData = [
    {
      key: 1,
      plaka: "34 HUU 670",
      aracTipi: "Binek Araç",
      tarih: "10.12.2025",
      saat: "09:32",
      yakitTipi: "Kurşunsuz",
      miktar: 47.38,
      tutar: 2579.37,
      kmBasina: 0.00,
      ortTuketim: 8.2,
      kaynak: "OPET API",
      fullDepo: "Full",
      surucu: "Mevlüt Acar",
      lokasyon: "İstanbul / Ümraniye",
    },
    {
      key: 2,
      plaka: "34 HSG 699",
      aracTipi: "Binek Araç",
      tarih: "10.12.2025",
      saat: "11:05",
      yakitTipi: "Kurşunsuz",
      miktar: 43.21,
      tutar: 2350.19,
      kmBasina: 0.00,
      ortTuketim: 7.9,
      kaynak: "Manuel",
      fullDepo: "Kısmi",
      surucu: "Ahmet Yılmaz",
      lokasyon: "İstanbul / Ataşehir",
    },
    {
      key: 3,
      plaka: "34 HRH 692",
      aracTipi: "Binek Araç",
      tarih: "10.12.2025",
      saat: "14:18",
      yakitTipi: "Dizel",
      miktar: 66.93,
      tutar: 3689.18,
      kmBasina: 0.00,
      ortTuketim: 9.1,
      kaynak: "OPET API",
      fullDepo: "Full",
      surucu: "Murat Demir",
      lokasyon: "İstanbul / Maltepe",
    },
  ];

  // --- Kolon Tanımları (Senin istediğin yapı) ---
  const initialColumns = [
    {
      title: "Plaka",
      dataIndex: "plaka",
      key: "plaka",
      width: 150,
      visible: true,
      render: (text, record) => (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ fontWeight: 600, color: "#1890ff" }}>{text}</span>
          <span style={{ fontSize: "11px", color: "#8c8c8c" }}>{record.aracTipi}</span>
        </div>
      ),
    },
    {
      title: "Tarih",
      dataIndex: "tarih",
      key: "tarih",
      width: 140,
      visible: true,
      render: (text, record) => (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span>{text}</span>
          <span style={{ fontSize: "11px", color: "#8c8c8c" }}>{record.saat}</span>
        </div>
      ),
      sorter: (a, b) => dayjs(`${a.tarih} ${a.saat}`).unix() - dayjs(`${b.tarih} ${b.saat}`).unix(),
    },
    {
      title: "Yakıt Tipi",
      dataIndex: "yakitTipi",
      key: "yakitTipi",
      width: 120,
      visible: true,
      render: (text) => (
        <Tag color={text === "Dizel" ? "gold" : "green"}>{text}</Tag>
      ),
    },
    {
      title: "Miktar (L)",
      dataIndex: "miktar",
      key: "miktar",
      width: 120,
      visible: true,
      render: (val) => <span style={{ fontWeight: 500 }}>{val.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} L</span>,
      sorter: (a, b) => a.miktar - b.miktar,
    },
    {
      title: "Tutar (₺)",
      dataIndex: "tutar",
      key: "tutar",
      width: 130,
      visible: true,
      render: (val) => <span style={{ fontWeight: 600, color: "#333" }}>{val.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺</span>,
      sorter: (a, b) => a.tutar - b.tutar,
    },
    {
      title: "km Başına",
      dataIndex: "kmBasina",
      key: "kmBasina",
      width: 110,
      visible: true,
      render: (val) => <span>{val.toFixed(2)}</span>,
    },
    {
      title: "Ort. Tük. (L/100km)",
      dataIndex: "ortTuketim",
      key: "ortTuketim",
      width: 160,
      visible: true,
      render: (val) => (
        <div style={{ width: "100%", display: "flex", alignItems: "center", gap: "5px" }}>
            <span>{val}</span>
            <div style={{ height: "4px", flex: 1, backgroundColor: "#e8e8e8", borderRadius: "2px", overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${Math.min(val * 8, 100)}%`, backgroundColor: val > 9 ? "#ff4d4f" : "#52c41a" }} />
            </div>
        </div>
      ),
    },
    {
      title: "Kaynak",
      dataIndex: "kaynak",
      key: "kaynak",
      width: 120,
      visible: true,
      render: (text) => (
        <Tag color={text === "OPET API" ? "blue" : "default"}>{text}</Tag>
      ),
    },
    {
      title: "Full Depo",
      dataIndex: "fullDepo",
      key: "fullDepo",
      width: 100,
      visible: true,
      render: (text) => (
          text === "Full" 
            ? <Tag color="#87d068">Full</Tag> 
            : <Tag color="#f50">Kısmi</Tag>
      )
    },
    {
      title: "Sürücü",
      dataIndex: "surucu",
      key: "surucu",
      width: 150,
      visible: true,
    },
    {
      title: "Lokasyon",
      dataIndex: "lokasyon",
      key: "lokasyon",
      width: 200,
      visible: true,
    }
  ];

  // --- Verileri Yükle (Simüle Edilmiş) ---
  useEffect(() => {
    setLoading(true);
    // API isteği yerine dummyData'yı set ediyoruz.
    // Gerçekçi görünmesi için ufak bir timeout ekleyebiliriz.
    setTimeout(() => {
        let filteredData = dummyData;

        // Arama filtresi
        if (searchTerm) {
            filteredData = dummyData.filter(item => 
                item.plaka.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.surucu.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.lokasyon.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        setData(filteredData);
        
        // Kart verilerini hesapla
        const toplamTuketim = filteredData.reduce((acc, curr) => acc + curr.miktar, 0);
        const toplamTutar = filteredData.reduce((acc, curr) => acc + curr.tutar, 0);
        const ortTuketim = filteredData.reduce((acc, curr) => acc + curr.ortTuketim, 0) / (filteredData.length || 1);

        setCardsData({
            TOPLAM_TUKETIM: toplamTuketim.toLocaleString('tr-TR', { maximumFractionDigits: 2 }) + " L",
            TOPLAM_TUTAR: toplamTutar.toLocaleString('tr-TR', { maximumFractionDigits: 2 }) + " ₺",
            ORT_TUKETIM: ortTuketim.toFixed(1) + " L/100km",
            TOPLAM_ISLEM: filteredData.length
        });

        setLoading(false);
    }, 500);
  }, [searchTerm]); // searchTerm değişince yeniden filtrele

  // --- İstatistik Kartları (Yeni Veriye Göre) ---
  const cardItems = useMemo(() => {
    return [
      { title: "Toplam Yakıt (Litre)", value: cardsData.TOPLAM_TUKETIM, color: "#e6f7ff", iconColor: "#1890ff" },
      { title: "Toplam Tutar (₺)", value: cardsData.TOPLAM_TUTAR, color: "#f6ffed", iconColor: "#52c41a" },
      { title: "Anormal Tüketim", value: cardsData.ORT_TUKETIM, color: "#fff7e6", iconColor: "#fa8c16" },
      { title: "Km Başına Maliyet ₺ / km", value: cardsData.TOPLAM_ISLEM, color: "#fff0f6", iconColor: "#eb2f96" },
    ];
  }, [cardsData]);


  // --- Sütun Yönetimi (LocalStorage & State) ---
  const [columns, setColumns] = useState(() => {
    const savedOrder = localStorage.getItem("columnFuelOrder");
    const savedVisibility = localStorage.getItem("columnFuelVisibility");
    const savedWidths = localStorage.getItem("columnFuelWidths");

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
        localStorage.setItem("columnFuelOrder", JSON.stringify(columns.map((col) => col.key)));
        localStorage.setItem("columnFuelVisibility", JSON.stringify(columns.reduce((acc, col) => ({ ...acc, [col.key]: col.visible }), {})));
        localStorage.setItem("columnFuelWidths", JSON.stringify(columns.reduce((acc, col) => ({ ...acc, [col.key]: col.width }), {})));
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
    localStorage.removeItem("columnFuelOrder");
    localStorage.removeItem("columnFuelVisibility");
    localStorage.removeItem("columnFuelWidths");
    window.location.reload();
  };

  // Excel İndirme
  const handleDownloadXLSX = () => {
    const xlsxData = data.map((item) => ({
      "Plaka": item.plaka,
      "Tarih": `${item.tarih} ${item.saat}`,
      "Yakıt Tipi": item.yakitTipi,
      "Miktar (L)": item.miktar,
      "Tutar (TL)": item.tutar,
      "Kaynak": item.kaynak,
      "Sürücü": item.surucu,
      "Lokasyon": item.lokasyon
    }));

    const worksheet = XLSX.utils.json_to_sheet(xlsxData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Yakıt Listesi");
    XLSX.writeFile(workbook, `Yakit_Verileri_${dayjs().format("DD_MM_YYYY")}.xlsx`);
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

      {/* İstatistik Kartları */}
      <div style={{ display: "flex", gap: "15px", marginBottom: "20px", flexWrap: "wrap" }}>
        {cardItems.map((item, index) => (
          <Card key={index} style={{ flex: 1, minWidth: "200px", borderRadius: "10px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }} bodyStyle={{ padding: "15px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                <div>
                    <Text type="secondary" style={{ fontSize: "13px" }}>{item.title}</Text>
                    <div style={{ fontSize: "24px", fontWeight: "700", color: "#333", marginTop: "5px" }}>{item.value}</div>
                </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Araç Çubuğu (Arama & Butonlar) */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px", background: "#fff", padding: "10px", borderRadius: "8px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <Button icon={<MenuOutlined />} onClick={() => setIsModalVisible(true)} />
          <Input 
            placeholder="Plaka, Sürücü veya Lokasyon ara..." 
            prefix={<SearchOutlined style={{ color: "#bfbfbf" }} />} 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: 300 }}
          />
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
            <Button icon={<FileExcelOutlined style={{ color: "green" }} />} onClick={handleDownloadXLSX}>Excel İndir</Button>
            <Button type="primary">Yeni Kayıt</Button>
        </div>
      </div>

      {/* Tablo */}
      <div style={{ background: "#fff", padding: "0px", borderRadius: "8px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
        <Table
          components={components}
          columns={visibleColumns}
          dataSource={data}
          loading={loading}
          pagination={{ defaultPageSize: 10, showSizeChanger: true, showTotal: (total) => `Toplam ${total} kayıt` }}
          scroll={{ x: 1200, y: "calc(100vh - 350px)" }}
          size="middle"
          rowSelection={{
            selectedRowKeys,
            onChange: setSelectedRowKeys,
          }}
        />
      </div>
    </div>
  );
};

export default MainTable;