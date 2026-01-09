import React, { useCallback, useEffect, useState, useMemo, useRef } from "react";
import { Table, Button, Modal, Checkbox, Input, Spin, Typography, Card, Tag, Space, Tooltip, Row, Col, DatePicker, InputNumber, Switch, Badge, Alert, Divider } from "antd";
import { HolderOutlined, SearchOutlined, MenuOutlined, FileExcelOutlined, SaveOutlined, PlusOutlined, CopyOutlined, CalendarOutlined, ShopOutlined, DollarOutlined, CheckCircleOutlined } from "@ant-design/icons";
import { DndContext, useSensor, useSensors, PointerSensor, KeyboardSensor } from "@dnd-kit/core";
import { sortableKeyboardCoordinates, arrayMove, useSortable, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Resizable } from "react-resizable";
import "./ResizeStyle.css"; 
import * as XLSX from "xlsx";
import dayjs from "dayjs";

const { Text, Title } = Typography;

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
  
  // Varsayılan Değerler State'i
  const [defaults, setDefaults] = useState({
      tarih: dayjs(),
      istasyon: "",
      birimFiyat: 0,
      fullDepo: true
  });

  // İstatistikler
  const stats = useMemo(() => {
      return {
          hazir: data.filter(x => x.durum === "Hazır").length,
          hatali: data.filter(x => x.durum === "Hatalı").length,
          kaydedildi: data.filter(x => x.durum === "Kaydedildi").length,
      }
  }, [data]);

  // --- BAŞLANGIÇ VERİLERİ (6 Boş Satır) ---
  useEffect(() => {
      setLoading(true);
      // 6 Adet boş taslak satırı oluşturuyoruz
      const initialRows = Array.from({ length: 6 }).map((_, index) => ({
          key: index + 1,
          plaka: "",
          tarih: null,
          litre: null,
          birimFiyat: null,
          fullDepo: true, // Varsayılan true
          istasyon: "",
          not: "",
          durum: "Taslak"
      }));
      setData(initialRows);
      setLoading(false);
  }, []);

  // --- Kolon Tanımları (Giriş Grid Yapısı) ---
  const initialColumns = [
    {
      title: "#",
      dataIndex: "key",
      key: "key",
      width: 50,
      visible: true,
      render: (text) => <span style={{color: '#999'}}>{text}</span>
    },
    {
      title: "Plaka",
      dataIndex: "plaka",
      key: "plaka",
      width: 120,
      visible: true,
      render: (text, record) => (
        <Input 
            placeholder="34..." 
            variant="borderless" 
            style={{backgroundColor: '#fff', border: '1px solid #d9d9d9'}} 
            value={text}
            onChange={(e) => handleCellChange(record.key, 'plaka', e.target.value)}
        />
      ),
    },
    {
      title: "Tarih/Saat",
      dataIndex: "tarih",
      key: "tarih",
      width: 160,
      visible: true,
      render: (val, record) => (
        <DatePicker 
            showTime 
            format="DD.MM.YYYY HH:mm" 
            placeholder="Seçiniz" 
            style={{width: '100%'}} 
            value={val}
            onChange={(date) => handleCellChange(record.key, 'tarih', date)}
        />
      ),
    },
    {
      title: "Litre",
      dataIndex: "litre",
      key: "litre",
      width: 100,
      visible: true,
      render: (val, record) => (
        <InputNumber 
            min={0} 
            placeholder="0.00" 
            style={{width: '100%'}} 
            value={val}
            onChange={(num) => handleCellChange(record.key, 'litre', num)}
        />
      ),
    },
    {
      title: "Birim Fiyat",
      dataIndex: "birimFiyat",
      key: "birimFiyat",
      width: 100,
      visible: true,
      render: (val, record) => (
        <InputNumber 
            min={0} 
            placeholder="0.00" 
            style={{width: '100%'}} 
            value={val}
            onChange={(num) => handleCellChange(record.key, 'birimFiyat', num)}
        />
      ),
    },
    {
        title: "Tutar",
        key: "tutar",
        width: 110,
        visible: true,
        render: (_, record) => {
            const tutar = (record.litre || 0) * (record.birimFiyat || 0);
            return <span style={{fontWeight: 600}}>{tutar > 0 ? tutar.toLocaleString('tr-TR', {minimumFractionDigits: 2}) + " ₺" : "-"}</span>
        }
    },
    {
      title: "Full Depo",
      dataIndex: "fullDepo",
      key: "fullDepo",
      width: 90,
      visible: true,
      render: (val, record) => (
          <div style={{textAlign: 'center'}}>
             <Checkbox 
                checked={val} 
                onChange={(e) => handleCellChange(record.key, 'fullDepo', e.target.checked)}
             />
             <div style={{fontSize: '10px', color: val ? 'green' : '#ccc'}}>{val ? 'Full' : 'Kısmi'}</div>
          </div>
      )
    },
    {
      title: "Not",
      dataIndex: "not",
      key: "not",
      width: 200,
      visible: true,
      render: (text, record) => (
        <div style={{display: 'flex', flexDirection: 'column'}}>
            <Input 
                placeholder="Açıklama..." 
                size="small" 
                value={text}
                onChange={(e) => handleCellChange(record.key, 'not', e.target.value)}
            />
            <span style={{fontSize: '10px', color: '#888', marginTop: 2}}>
                İstasyon: {defaults.istasyon || "—"}
            </span>
        </div>
      )
    },
    {
      title: "Durum",
      dataIndex: "durum",
      key: "durum",
      width: 100,
      visible: true,
      render: (text) => {
          let color = "default";
          if(text === "Hazır") color = "processing";
          if(text === "Hatalı") color = "error";
          if(text === "Kaydedildi") color = "success";
          return <Tag color={color}>{text}</Tag>
      }
    }
  ];

  // Hücre güncelleme fonksiyonu (Mock Logic)
  const handleCellChange = (key, field, value) => {
      const newData = data.map(item => {
          if (item.key === key) {
              const updatedItem = { ...item, [field]: value };
              // Basit bir validasyon simülasyonu: Plaka ve Litre varsa "Hazır"
              if (updatedItem.plaka && updatedItem.litre > 0) {
                  updatedItem.durum = "Hazır";
              } else {
                  updatedItem.durum = "Taslak";
              }
              return updatedItem;
          }
          return item;
      });
      setData(newData);
  };

  // --- Sütun Yönetimi (LocalStorage & State) ---
  const [columns, setColumns] = useState(() => {
    const savedOrder = localStorage.getItem("columnBulkOrder");
    const savedVisibility = localStorage.getItem("columnBulkVisibility");
    const savedWidths = localStorage.getItem("columnBulkWidths");

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
        localStorage.setItem("columnBulkOrder", JSON.stringify(columns.map((col) => col.key)));
        localStorage.setItem("columnBulkVisibility", JSON.stringify(columns.reduce((acc, col) => ({ ...acc, [col.key]: col.visible }), {})));
        localStorage.setItem("columnBulkWidths", JSON.stringify(columns.reduce((acc, col) => ({ ...acc, [col.key]: col.width }), {})));
    }
  }, [columns]);

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
    localStorage.removeItem("columnBulkOrder");
    localStorage.removeItem("columnBulkVisibility");
    localStorage.removeItem("columnBulkWidths");
    window.location.reload();
  };

  const handleDownloadXLSX = () => {
    const ws = XLSX.utils.json_to_sheet(data.map(d => ({
        Plaka: d.plaka,
        Tarih: d.tarih ? dayjs(d.tarih).format("DD.MM.YYYY HH:mm") : "",
        Litre: d.litre,
        Fiyat: d.birimFiyat,
        Tutar: (d.litre * d.birimFiyat),
        Durum: d.durum
    })));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "TopluGiris");
    XLSX.writeFile(wb, "toplu_giris.xlsx");
  };

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
    <div style={{ padding: "20px", background: "#f0f2f5", minHeight: "100vh" }}>
      
      {/* Sütun Modal */}
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

      {/* --- Üst Panel: İstatistikler & Varsayılanlar --- */}
      <Card bodyStyle={{padding: '12px 24px'}} style={{marginBottom: 15, borderRadius: 8}}>

        {/* Varsayılan Ayarlar (BÜYÜK VE ORTALI) */}
        <div style={{
            display: 'flex', 
            justifyContent: 'center', 
            gap: 40, // Elemanlar arası boşluk arttırıldı
            alignItems: 'center', 
            background: '#fafafa', 
            padding: '25px', // Padding arttırıldı
            borderRadius: 12, 
            border: '1px solid #e8e8e8'
        }}>
            
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5}}>
                <Text strong style={{fontSize: 14, color: '#595959'}}><CalendarOutlined /> Tarih/Saat</Text>
                <DatePicker 
                    showTime 
                    format="DD.MM HH:mm" 
                    size="large" // BÜYÜTÜLDÜ
                    allowClear={false}
                    value={defaults.tarih}
                    onChange={(d) => setDefaults({...defaults, tarih: d})}
                    style={{width: 200}} // GENİŞLETİLDİ
                />
            </div>

            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5}}>
                <Text strong style={{fontSize: 14, color: '#595959'}}><ShopOutlined /> İstasyon</Text>
                <Input 
                    placeholder="Örn: Shell" 
                    size="large" // BÜYÜTÜLDÜ
                    value={defaults.istasyon}
                    onChange={(e) => setDefaults({...defaults, istasyon: e.target.value})}
                    style={{width: 180}} // GENİŞLETİLDİ
                />
            </div>

             <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5}}>
                <Text strong style={{fontSize: 14, color: '#595959'}}><DollarOutlined /> Birim Fiyat</Text>
                <InputNumber 
                    size="large" // BÜYÜTÜLDÜ
                    min={0}
                    value={defaults.birimFiyat}
                    onChange={(v) => setDefaults({...defaults, birimFiyat: v})}
                    style={{width: 140}} // GENİŞLETİLDİ
                />
            </div>

            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5}}>
                <Text strong style={{fontSize: 14, color: '#595959'}}><CheckCircleOutlined /> Full Depo</Text>
                <div style={{height: 40, display: 'flex', alignItems: 'center'}}>
                    <Switch 
                        checkedChildren="EVET"
                        unCheckedChildren="HAYIR"
                        checked={defaults.fullDepo} 
                        onChange={(c) => setDefaults({...defaults, fullDepo: c})}
                    />
                </div>
            </div>
        </div>
        
        {/* Helper Text */}
        <div style={{marginTop: 15, fontSize: 13, color: '#888', textAlign: 'center'}}>
            <Space split="|">
                <span>Excel’den paste: <b>Plaka → Tarih/Saat → Litre → Birim Fiyat → Full Depo</b> (Tab/Enter)</span>
                <span>Enter: <b>Sonraki Hücre</b></span>
                <span>Ctrl+D: <b>Kopyala</b></span>
            </Space>
        </div>
      </Card>

      {/* --- Araç Çubuğu --- */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
        <Space>
           <Button type="dashed" icon={<PlusOutlined />}>Satır Ekle</Button>
           <Button icon={<CopyOutlined />}>Varsayılanları Uygula</Button>
        </Space>
        <Space>
           <Button icon={<MenuOutlined />} onClick={() => setIsModalVisible(true)}>Sütunlar</Button>
           <Button icon={<FileExcelOutlined style={{color: 'green'}}/>} onClick={handleDownloadXLSX}>Excel</Button>
           <Button type="primary" size="large" icon={<SaveOutlined />}>KAYDET</Button>
        </Space>
      </div>

      {/* --- Tablo --- */}
      <div style={{ background: "#fff", borderRadius: "8px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", overflow: 'hidden' }}>
        <Table
          components={components}
          columns={visibleColumns}
          dataSource={data}
          loading={loading}
          pagination={false}
          scroll={{ x: 1000, y: "calc(100vh - 500px)" }}
          size="small"
          bordered
        />
        <div style={{padding: 10, background: '#fff9e6', borderTop: '1px solid #ffe58f', fontSize: 12}}>
            <ul style={{margin: 0, paddingLeft: 20, color: '#fa8c16'}}>
                <li><b>Not:</b> KM sütunu kaldırıldı. (Bu ekran “fiş girişi” gibi hızlı litre bazlı kayıt içindir.)</li>
                <li>Kaydet: sadece <b>Hazır</b> ve <b>Uyarı</b> satırlarını kaydeder.</li>
                <li>Varsayılanlar değişince: sadece dokunulmamış alanlar otomatik güncellenir.</li>
            </ul>
        </div>
      </div>
    </div>
  );
};

export default MainTable;