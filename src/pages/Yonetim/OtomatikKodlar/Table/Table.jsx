import React, { useCallback, useEffect, useState, useMemo } from "react";
import {
  Table,
  Button,
  Modal,
  Checkbox,
  Input,
  Spin,
  Typography,
  Tag,
  message,
} from "antd";
import {
  HolderOutlined,
  SearchOutlined,
  MenuOutlined,
} from "@ant-design/icons";
import {
  DndContext,
  useSensor,
  useSensors,
  PointerSensor,
  KeyboardSensor,
} from "@dnd-kit/core";
import {
  sortableKeyboardCoordinates,
  arrayMove,
  useSortable,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Resizable } from "react-resizable";
import "./ResizeStyle.css";
import EditDrawer from "../Update/EditDrawer";
import ContextMenu from "../components/ContextMenu/ContextMenu";
import { useFormContext } from "react-hook-form";

const { Text } = Typography;

// Sütunların boyutlarını ayarlamak için kullanılan component
const ResizableTitle = (props) => {
  const { onResize, width, ...restProps } = props;
  const handleStyle = {
    position: "absolute",
    bottom: 0,
    right: "-5px",
    width: "20%",
    height: "100%",
    zIndex: 2,
    cursor: "col-resize",
  };

  if (!width) return <th {...restProps} />;
  return (
    <Resizable
      width={width}
      height={0}
      handle={<span className="react-resizable-handle" style={handleStyle} onClick={(e) => e.stopPropagation()} />}
      onResize={onResize}
      draggableOpts={{ enableUserSelectHack: false }}
    >
      <th {...restProps} />
    </Resizable>
  );
};

// Sütunların sürüklenebilir olmasını sağlayan component
const DraggableRow = ({ id, text, index, ...restProps }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const styleWithTransform = {
    ...restProps.style,
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    backgroundColor: isDragging ? "#f0f0f0" : "",
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "4px 8px",
    borderBottom: "1px solid #f0f0f0",
  };

  return (
    <div ref={setNodeRef} style={styleWithTransform} {...restProps} {...attributes}>
      <div {...listeners} style={{ cursor: "grab", flexGrow: 1, display: "flex", alignItems: "center" }}>
        <HolderOutlined style={{ marginRight: 8 }} />
        {text}
      </div>
    </div>
  );
};

const MainTable = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { setValue } = useFormContext();
  const [data, setData] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [drawer, setDrawer] = useState({ visible: false, data: null });
  const [selectedRows, setSelectedRows] = useState([]);

  // --- FAKE DATA TANIMI ---
  const initialData = [
    { key: 1, tanim: 'Makine Kodları', onEk: 'MKN', siraNo: 339, basamak: 5, durum: 'Aktif', aciklama: 'Makine kartları için otomatik kod üretimi', otomatikKod: true, kilitli: false },
    { key: 2, tanim: 'Firma Kodları', onEk: 'FRM', siraNo: 54, basamak: 5, durum: 'Aktif', aciklama: 'Firma ve tedarikçi kayıtları', otomatikKod: true, kilitli: false },
    { key: 3, tanim: 'Bakım Kodları', onEk: 'HCESBKM', siraNo: 79, basamak: 5, durum: 'Aktif', aciklama: 'Bakım tanımları ve kayıtları', otomatikKod: true, kilitli: false },
    { key: 4, tanim: 'Arıza Kodları', onEk: 'HCESARZ', siraNo: 116, basamak: 5, durum: 'Aktif', aciklama: 'Arıza kayıtları için sıralama', otomatikKod: true, kilitli: false },
    { key: 5, tanim: 'Periyodik Bakım Kodları', onEk: 'HCESPBK', siraNo: 67, basamak: 5, durum: 'Aktif', aciklama: 'Periyodik bakım kartları', otomatikKod: true, kilitli: false },
    { key: 6, tanim: 'Personel Kodları', onEk: 'HCESPRS', siraNo: 75, basamak: 5, durum: 'Aktif', aciklama: 'Personel kart numaralandırması', otomatikKod: true, kilitli: false },
    { key: 7, tanim: 'Malzeme Kodları', onEk: 'STK', siraNo: 112, basamak: 5, durum: 'Aktif', aciklama: 'Stok ve malzeme kartları', otomatikKod: true, kilitli: false },
    { key: 8, tanim: 'Malzeme Giriş Fişleri', onEk: 'SFG', siraNo: 520, basamak: 5, durum: 'Aktif', aciklama: 'Malzeme giriş hareketleri', otomatikKod: true, kilitli: false },
    { key: 9, tanim: 'Malzeme Çıkış Fişleri', onEk: 'SFC', siraNo: 112, basamak: 5, durum: 'Aktif', aciklama: 'Malzeme çıkış hareketleri', otomatikKod: true, kilitli: false },
    { key: 10, tanim: 'Malzeme Transfer Fişleri', onEk: 'SFT', siraNo: 66, basamak: 5, durum: 'Aktif', aciklama: 'Depolar arası transferler', otomatikKod: true, kilitli: false },
    { key: 11, tanim: 'Malzeme Talep Fişleri', onEk: 'SFP', siraNo: 837, basamak: 5, durum: 'Aktif', aciklama: 'Talep süreçlerinde kullanılan fişler', otomatikKod: true, kilitli: false },
    { key: 12, tanim: 'İş Emirleri', onEk: 'HCESISM', siraNo: 1354, basamak: 5, durum: 'Aktif', aciklama: 'İş emri numaralandırma yapısı', otomatikKod: true, kilitli: false },
    { key: 13, tanim: 'Depo Kodları', onEk: 'HCESDEP', siraNo: 109, basamak: 5, durum: 'Aktif', aciklama: 'Depo ve lokasyon kartları', otomatikKod: true, kilitli: false },
    { key: 14, tanim: 'Atölye Kodları', onEk: 'ATL', siraNo: 34, basamak: 5, durum: 'Pasif', aciklama: 'Atölye tanımları için ayrı seri', otomatikKod: false, kilitli: false },
    { key: 15, tanim: 'Proje Kodları', onEk: 'PRJ', siraNo: 109, basamak: 5, durum: 'Aktif', aciklama: 'Proje kart ve iş akışları', otomatikKod: true, kilitli: false },
    { key: 16, tanim: 'Yakıt Giriş Fişleri', onEk: 'YFG', siraNo: 152, basamak: 5, durum: 'Aktif', aciklama: 'Yakıt giriş işlemleri', otomatikKod: true, kilitli: false },
    { key: 17, tanim: 'Yakıt Çıkış Fişleri', onEk: 'YFC', siraNo: 52, basamak: 5, durum: 'Aktif', aciklama: 'Yakıt çıkış işlemleri', otomatikKod: true, kilitli: false },
    { key: 18, tanim: 'Satınalma Teklif', onEk: 'SAT', siraNo: 0, basamak: 5, durum: 'Taslak', aciklama: 'Teklif süreçleri için yeni seri', otomatikKod: true, kilitli: false },
    { key: 19, tanim: 'Satınalma Siparişi', onEk: 'STN', siraNo: 0, basamak: 5, durum: 'Taslak', aciklama: 'Sipariş numaralandırması henüz başlamadı', otomatikKod: true, kilitli: false }
  ];

  const initialColumns = [
    {
      title: "⚡",
      dataIndex: "durum",
      key: "aktif",
      width: 60,
      visible: true,
      align: "center",
      render: (text, record) => (
        <Checkbox 
          checked={text === "Aktif"} 
          onChange={(e) => {
            const newData = [...data];
            const index = newData.findIndex(item => item.key === record.key);
            newData[index].durum = e.target.checked ? "Aktif" : "Pasif";
            setData(newData);
          }} 
        />
      ),
    },
    {
      title: "🔒",
      dataIndex: "kilitli",
      key: "kilit",
      width: 60,
      visible: true,
      align: "center",
      render: (checked, record) => (
        <Checkbox 
          checked={checked} 
          onChange={(e) => {
            const newData = [...data];
            const index = newData.findIndex(item => item.key === record.key);
            newData[index].kilitli = e.target.checked;
            setData(newData);
          }} 
        />
      ),
    },
    { 
      title: "Tanım", 
      dataIndex: "tanim", 
      key: "tanim", 
      width: 250, 
      visible: true, 
      sorter: (a, b) => a.tanim.localeCompare(b.tanim),
      render: (text, record) => (
        <div>
          <div style={{ fontWeight: 500, color: "#1e293b" }}>{text}</div>
          <div style={{ fontSize: "12px", color: "#64748b" }}>{record.aciklama}</div>
        </div>
      )
    },
    { 
      title: "Ön Ek", 
      dataIndex: "onEk", 
      key: "onEk", 
      width: 120, 
      visible: true,
      render: (text) => <Tag color="blue">{text}</Tag>
    },
    { 
      title: "Sıra No", 
      dataIndex: "siraNo", 
      key: "siraNo", 
      width: 100, 
      visible: true, 
      sorter: (a, b) => a.siraNo - b.siraNo 
    },
    { 
      title: "Basamak", 
      dataIndex: "basamak", 
      key: "basamak", 
      width: 100, 
      visible: true 
    },
    { 
      title: "İşlem", 
      key: "islem", 
      width: 100, 
      visible: true, 
      align: "right",
      render: (_, record) => (
        <Button 
          size="small" 
          onClick={(e) => {
            e.stopPropagation();
            setDrawer({ visible: true, data: record });
          }}
        >
          Düzenle
        </Button>
      ) 
    },
  ];

  // Veriyi yükleme
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setData(initialData);
      setLoading(false);
    }, 500);
  }, []);

  const normalizeString = (str) => {
    if (!str) return "";
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
      .replace(/ğ/g, "g").replace(/ü/g, "u").replace(/ş/g, "s").replace(/ı/g, "i").replace(/ö/g, "o").replace(/ç/g, "c");
  };

  const filteredDataMemo = useMemo(() => {
    return data.filter((item) =>
      normalizeString(item.tanim).includes(normalizeString(searchTerm)) ||
      normalizeString(item.onEk).includes(normalizeString(searchTerm)) ||
      normalizeString(item.aciklama).includes(normalizeString(searchTerm))
    );
  }, [searchTerm, data]);

  // Sütun Ayarları (Local Storage)
  const [columns, setColumns] = useState(() => {
    const savedOrder = localStorage.getItem("columnOrderOtomatikKodlar");
    const savedVisibility = localStorage.getItem("columnVisibilityOtomatikKodlar");
    const savedWidths = localStorage.getItem("columnWidthsOtomatikKodlar");

    let order = savedOrder ? JSON.parse(savedOrder) : initialColumns.map(c => c.key);
    let visibility = savedVisibility ? JSON.parse(savedVisibility) : {};
    let widths = savedWidths ? JSON.parse(savedWidths) : {};

    initialColumns.forEach((col) => {
      if (!order.includes(col.key)) order.push(col.key);
      if (visibility[col.key] === undefined) visibility[col.key] = col.visible;
      if (widths[col.key] === undefined) widths[col.key] = col.width;
    });

    return order.map((key) => {
      const column = initialColumns.find((col) => col.key === key);
      return { ...column, visible: visibility[key], width: widths[key] };
    }).filter(Boolean);
  });

  useEffect(() => {
    localStorage.setItem("columnOrderOtomatikKodlar", JSON.stringify(columns.map((col) => col.key)));
    localStorage.setItem("columnVisibilityOtomatikKodlar", JSON.stringify(columns.reduce((acc, col) => ({ ...acc, [col.key]: col.visible }), {})));
    localStorage.setItem("columnWidthsOtomatikKodlar", JSON.stringify(columns.reduce((acc, col) => ({ ...acc, [col.key]: col.width }), {})));
  }, [columns]);

  const handleResize = (key) => (_, { size }) => {
    setColumns((prev) => prev.map((col) => col.key === key ? { ...col, width: size.width } : col));
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = columns.findIndex((c) => c.key === active.id);
      const newIndex = columns.findIndex((c) => c.key === over.id);
      setColumns((prev) => arrayMove(prev, oldIndex, newIndex));
    }
  };

  const toggleVisibility = (key, checked) => {
    setColumns(prev => prev.map(col => col.key === key ? { ...col, visible: checked } : col));
  };

  const resetColumns = () => {
    localStorage.removeItem("columnOrderOtomatikKodlar");
    localStorage.removeItem("columnVisibilityOtomatikKodlar");
    localStorage.removeItem("columnWidthsOtomatikKodlar");
    window.location.reload();
  };

  const onSelectChange = (keys) => {
    setSelectedRowKeys(keys);
    const selected = data.filter(item => keys.includes(item.key));
    setSelectedRows(selected);
    setValue("selectedId", keys[0] || null);
  };

  const refreshTableData = useCallback(() => {
    setSelectedRowKeys([]);
    setSelectedRows([]);
    setLoading(true);
    setTimeout(() => setLoading(false), 300);
  }, []);

  return (
    <>
      <Modal
        title="Sütunları Yönet"
        centered
        width={800}
        open={isModalVisible}
        onOk={() => setIsModalVisible(false)}
        onCancel={() => setIsModalVisible(false)}
      >
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <Button onClick={resetColumns}>Sütunları Sıfırla</Button>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div style={{ width: "46%", border: "1px solid #f0f0f0", borderRadius: 8, padding: 10 }}>
            <Text strong block style={{ marginBottom: 10 }}>Göster / Gizle</Text>
            <div style={{ height: 400, overflow: "auto" }}>
              {initialColumns.map((col) => (
                <div key={col.key} style={{ marginBottom: 5 }}>
                  <Checkbox
                    checked={columns.find(c => c.key === col.key)?.visible}
                    onChange={(e) => toggleVisibility(col.key, e.target.checked)}
                  >
                    {col.title}
                  </Checkbox>
                </div>
              ))}
            </div>
          </div>
          <div style={{ width: "46%", border: "1px solid #f0f0f0", borderRadius: 8, padding: 10 }}>
            <Text strong block style={{ marginBottom: 10 }}>Sıralama</Text>
            <DndContext sensors={useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }))} onDragEnd={handleDragEnd}>
              <SortableContext items={columns.filter(c => c.visible).map(c => c.key)} strategy={verticalListSortingStrategy}>
                <div style={{ height: 400, overflow: "auto" }}>
                  {columns.filter(c => c.visible).map((col, index) => (
                    <DraggableRow key={col.key} id={col.key} index={index} text={col.title} />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </div>
        </div>
      </Modal>

      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20, padding: "0 5px" }}>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <Button icon={<MenuOutlined />} onClick={() => setIsModalVisible(true)} />
          <Input
            placeholder="Tanım, ön ek veya açıklama ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            prefix={<SearchOutlined style={{ color: "#1890ff" }} />}
            style={{ width: 300 }}
          />
        </div>
        <ContextMenu selectedRows={selectedRows} refreshTableData={refreshTableData} />
      </div>

      <Spin spinning={loading}>
        <Table
          components={{ header: { cell: ResizableTitle } }}
          rowSelection={{ type: "checkbox", selectedRowKeys, onChange: onSelectChange }}
          columns={columns.filter(c => c.visible).map(col => ({
            ...col,
            onHeaderCell: (column) => ({ width: column.width, onResize: handleResize(column.key) }),
          }))}
          dataSource={filteredDataMemo}
          onRow={(record) => ({
            onClick: () => setDrawer({ visible: true, data: record }),
            className: record.tanim === 'İş Emirleri' ? 'bg-amber-50' : ''
          })}
          scroll={{ y: "calc(100vh - 370px)" }}
          pagination={{
            defaultPageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Toplam ${total} kayıt`,
          }}
        />
      </Spin>

      <EditDrawer
        selectedRow={drawer.data}
        onDrawerClose={() => setDrawer({ ...drawer, visible: false })}
        drawerVisible={drawer.visible}
        onRefresh={refreshTableData}
      />
    </>
  );
};

export default MainTable;