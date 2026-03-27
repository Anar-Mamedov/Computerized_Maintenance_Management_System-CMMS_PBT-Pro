import React, { useCallback, useEffect, useState, useMemo } from "react";
import { Table, Button, Modal, Checkbox, Input, Spin, Typography, Tag, Progress, message } from "antd";
import { HolderOutlined, SearchOutlined, MenuOutlined } from "@ant-design/icons";
import { DndContext, useSensor, useSensors, PointerSensor, KeyboardSensor } from "@dnd-kit/core";
import { sortableKeyboardCoordinates, arrayMove, useSortable, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Resizable } from "react-resizable";
import "./ResizeStyle.css";
import EditDrawer from "../Update/EditDrawer";
import ContextMenu from "../components/ContextMenu/ContextMenu";
import { useFormContext } from "react-hook-form";
import { SiMicrosoftexcel } from "react-icons/si";
import dayjs from "dayjs";

const { Text } = Typography;

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
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [drawer, setDrawer] = useState({ visible: false, data: null });
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);

  // --- FAKE DATA ---
  const initialData = [
    { key: 1, id: 1, code: "PRS 00008", name: "Murat Demir", department: "Mekanik Bakım", role: "Teknisyen", location: "Dalaman Havalimanı", project: "Ana Terminal", leaveType: "Evlilik İzni", start: "2026-03-17", end: "2026-03-24", days: 8, note: "Resmi evrak teslim edildi.", balance: 10, deputy: "Ahmet Kaya" },
    { key: 2, id: 2, code: "PRS 00006", name: "Emre Kaya", department: "Elektrik Bakım", role: "Usta", location: "Bursa Fabrika", project: "Hat 3 Revizyon", leaveType: "Yıllık İzin", start: "2026-03-10", end: "2026-03-14", days: 5, note: "Hat duruş planına göre planlandı.", balance: 7, deputy: "İsmail Çetin" },
    { key: 3, id: 3, code: "PRS 00009", name: "Didem Gençer", department: "İnsan Kaynakları", role: "Uzman", location: "Merkez Ofis", project: "Genel Yönetim", leaveType: "Hastalık İzni", start: "2026-03-05", end: "2026-03-07", days: 3, note: "Rapor sisteme yüklendi.", balance: 12, deputy: "-" },
  ];

  // Renk Map'lemesi (Ant Design Tag renklerine uyarlandı)
  const typeTagColors = {
    "Yıllık İzin": "blue",
    "Evlilik İzni": "magenta",
    "Hastalık İzni": "red",
    "Mazeret İzni": "orange",
  };

  // Kart verileri (2'li yapı)
  const cardItems = [
    { title: "Toplam İzinli Personel", value: initialData.length },
    { title: "Kalan Toplam İzin Bakiyesi", value: initialData.reduce((acc, curr) => acc + curr.balance, 0) + " Gün" },
  ];

  const initialColumns = [
    {
      title: "Personel Kodu",
      dataIndex: "code",
      key: "code",
      width: 120,
      visible: true,
      sorter: (a, b) => a.code.localeCompare(b.code),
    },
    {
      title: "Ad Soyad",
      dataIndex: "name",
      key: "name",
      width: 180,
      visible: true,
      render: (text, record) => <a onClick={() => setDrawer({ visible: true, data: record })}>{text}</a>,
    },
    {
      title: "İzin Tipi",
      dataIndex: "leaveType",
      key: "leaveType",
      width: 150,
      visible: true,
      render: (type) => <Tag color={typeTagColors[type] || "default"}>{type}</Tag>,
    },
    {
      title: "Başlangıç",
      dataIndex: "start",
      key: "start",
      width: 120,
      visible: true,
    },
    {
      title: "Süre (Gün)",
      dataIndex: "days",
      key: "days",
      width: 100,
      visible: true,
      render: (days) => <Text strong>{days} Gün</Text>,
    },
    {
      title: "Departman",
      dataIndex: "department",
      key: "department",
      width: 150,
      visible: true,
    },
    {
      title: "Yerine Bakan",
      dataIndex: "deputy",
      key: "deputy",
      width: 150,
      visible: true,
    }
  ];

  useEffect(() => {
    setLoading(true);
    setTimeout(() => setLoading(false), 500);
  }, []);

  const filteredData = useMemo(() => {
    const lowerSearch = searchTerm.toLowerCase();
    return initialData.filter(item => 
      item.name.toLowerCase().includes(lowerSearch) || 
      item.code.toLowerCase().includes(lowerSearch)
    );
  }, [searchTerm]);

  // Sütun Ayarları
  const [columns, setColumns] = useState(() => {
    const savedVisibility = localStorage.getItem("leaveTableVisibility");
    let visibility = savedVisibility ? JSON.parse(savedVisibility) : {};
    return initialColumns.map(col => ({
      ...col,
      visible: visibility[col.key] !== undefined ? visibility[col.key] : col.visible,
    }));
  });

  const toggleVisibility = (key, checked) => {
    setColumns(prev => prev.map(col => col.key === key ? { ...col, visible: checked } : col));
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = columns.findIndex(c => c.key === active.id);
      const newIndex = columns.findIndex(c => c.key === over.id);
      setColumns(prev => arrayMove(prev, oldIndex, newIndex));
    }
  };

  const handleResize = (key) => (_, { size }) => {
    setColumns(prev => prev.map(col => col.key === key ? { ...col, width: size.width } : col));
  };

  return (
    <>
      <Modal title="Sütunları Yönet" centered width={800} open={isModalVisible} onOk={() => setIsModalVisible(false)} onCancel={() => setIsModalVisible(false)}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div style={{ width: "46%", border: "1px solid #f0f0f0", borderRadius: "8px", padding: "10px" }}>
            <Text strong block style={{ marginBottom: "10px" }}>Göster / Gizle</Text>
            <div style={{ height: "400px", overflow: "auto" }}>
              {initialColumns.map(col => (
                <div key={col.key} style={{ display: "flex", gap: "10px", marginBottom: "5px" }}>
                  <Checkbox checked={columns.find(c => c.key === col.key)?.visible} onChange={(e) => toggleVisibility(col.key, e.target.checked)} />
                  {col.title}
                </div>
              ))}
            </div>
          </div>
          <div style={{ width: "46%", border: "1px solid #f0f0f0", borderRadius: "8px", padding: "10px" }}>
            <Text strong block style={{ marginBottom: "10px" }}>Sıralama</Text>
            <DndContext sensors={useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }))} onDragEnd={handleDragEnd}>
              <SortableContext items={columns.filter(c => c.visible).map(c => c.key)} strategy={verticalListSortingStrategy}>
                <div style={{ height: "400px", overflow: "auto" }}>
                  {columns.filter(c => c.visible).map((col, index) => (
                    <DraggableRow key={col.key} id={col.key} index={index} text={col.title} />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </div>
        </div>
      </Modal>

      {/* --- KARTLAR (2'li Yapı) --- */}
      <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
        {cardItems.map((item, index) => (
          <div
            key={index}
            style={{
              flex: "1",
              backgroundColor: "#fff",
              padding: "24px",
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
              display: "flex",
              alignItems: "center",
              gap: "20px",
              border: "1px solid #f0f0f0"
            }}
          >
            <div style={{ fontSize: "32px", backgroundColor: "#f0f7ff", padding: "12px", borderRadius: "10px" }}>{item.icon}</div>
            <div>
              <Text style={{ fontWeight: 500, fontSize: "14px", color: "#8c8c8c", display: "block" }}>{item.title}</Text>
              <Text style={{ fontWeight: 700, fontSize: "28px", color: "#1f1f1f" }}>{item.value}</Text>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px", gap: "10px" }}>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <Button icon={<MenuOutlined />} onClick={() => setIsModalVisible(true)} />
          <Input
            style={{ width: "300px" }}
            placeholder="Personel ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            prefix={<SearchOutlined style={{ color: "#0091ff" }} />}
          />
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <Button icon={<SiMicrosoftexcel />} style={{ color: "#217346" }}>Excel İndir</Button>
          <ContextMenu selectedRows={selectedRows} />
        </div>
      </div>

      <Spin spinning={loading}>
        <Table
          components={{ header: { cell: ResizableTitle } }}
          rowSelection={{
            type: "checkbox",
            selectedRowKeys,
            onChange: (keys, rows) => {
              setSelectedRowKeys(keys);
              setSelectedRows(rows);
            }
          }}
          columns={columns.filter(c => c.visible).map(col => ({
            ...col,
            onHeaderCell: (column) => ({ width: column.width, onResize: handleResize(column.key) }),
          }))}
          dataSource={filteredData}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: filteredData.length,
            showSizeChanger: true,
            onChange: (p, s) => { setCurrentPage(p); setPageSize(s); },
            showTotal: (total) => `Toplam ${total} kayıt`,
          }}
          scroll={{ y: "calc(100vh - 480px)" }}
        />
      </Spin>

      <EditDrawer 
        selectedRow={drawer.data} 
        onDrawerClose={() => setDrawer({ ...drawer, visible: false })} 
        drawerVisible={drawer.visible} 
      />
    </>
  );
};

export default MainTable;