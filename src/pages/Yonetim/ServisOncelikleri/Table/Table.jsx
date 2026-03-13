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

  const initialData = [
    { key: 1, id: 1, kod: "DUSUK", tanim: "Düşük Öncelik", aktif: true, varsayilan: false, bayrak: "🟡", cozum: "3 Gün", gecikme: "30 dk", kritik: "60 dk", guncelleme: "07.03.2026 12:51" },
    { key: 2, id: 2, kod: "NORMAL", tanim: "Normal Öncelik", aktif: true, varsayilan: true, bayrak: "🔵", cozum: "1 Gün 10 Saat 30 Dakika", gecikme: "17 dk", kritik: "45 dk", guncelleme: "07.03.2026 12:59" },
    { key: 3, id: 3, kod: "YUKSEK", tanim: "Yüksek Öncelik", aktif: true, varsayilan: false, bayrak: "🔴", cozum: "4 Saat", gecikme: "10 dk", kritik: "20 dk", guncelleme: "07.03.2026 13:02" },
  ];

  const initialColumns = [
    {
      title: "Bayrak",
      dataIndex: "bayrak",
      key: "bayrak",
      width: 80,
      visible: true,
      align: "center",
      render: (text) => <span style={{ fontSize: "18px" }}>{text}</span>
    },
    {
  title: "Kod",
  dataIndex: "kod",
  key: "kod",
  width: 120,
  visible: true,
  sorter: (a, b) => a.kod.localeCompare(b.kod),
  render: (text, record) => (
    <span 
      style={{ 
        fontWeight: 600, 
        color: "#0ea5e9", 
        cursor: "pointer",
        textUnderlineOffset: "4px"
      }}
      onClick={(e) => {
        e.stopPropagation(); // Satır tıklamasını (eğer varsa) engeller
        setDrawer({ visible: true, data: record });
      }}
    >
      {text}
    </span>
  )
},
    { 
      title: "Tanım", 
      dataIndex: "tanim", 
      key: "tanim", 
      width: 200, 
      visible: true, 
      sorter: (a, b) => a.tanim.localeCompare(b.tanim)
    },
    {
      title: "Aktif",
      dataIndex: "aktif",
      key: "aktif",
      width: 80,
      visible: true,
      align: "center",
      render: (aktif) => (
        <Tag color={aktif ? "success" : "error"} style={{ borderRadius: "10px" }}>
          {aktif ? "Aktif" : "Pasif"}
        </Tag>
      )
    },
    {
      title: "Varsayılan",
      dataIndex: "varsayilan",
      key: "varsayilan",
      width: 100,
      visible: true,
      align: "center",
      render: (val) => val ? <Tag color="gold">★ Varsayılan</Tag> : "—"
    },
    { 
      title: "Çözüm Süresi", 
      dataIndex: "cozum", 
      key: "cozum", 
      width: 180, 
      visible: true,
      render: (text) => <Tag color="blue">{text}</Tag>
    },
    { 
      title: "Gecikme", 
      dataIndex: "gecikme", 
      key: "gecikme", 
      width: 100, 
      visible: true 
    },
    { 
      title: "Kritik", 
      dataIndex: "kritik", 
      key: "kritik", 
      width: 100, 
      visible: true 
    },
  ];

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
      normalizeString(item.kod).includes(normalizeString(searchTerm))
    );
  }, [searchTerm, data]);

  const [columns, setColumns] = useState(() => {
    const savedOrder = localStorage.getItem("columnOrderServisOncelik");
    const savedVisibility = localStorage.getItem("columnVisibilityServisOncelik");
    const savedWidths = localStorage.getItem("columnWidthsServisOncelik");

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
    localStorage.setItem("columnOrderServisOncelik", JSON.stringify(columns.map((col) => col.key)));
    localStorage.setItem("columnVisibilityServisOncelik", JSON.stringify(columns.reduce((acc, col) => ({ ...acc, [col.key]: col.visible }), {})));
    localStorage.setItem("columnWidthsServisOncelik", JSON.stringify(columns.reduce((acc, col) => ({ ...acc, [col.key]: col.width }), {})));
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
    localStorage.removeItem("columnOrderServisOncelik");
    localStorage.removeItem("columnVisibilityServisOncelik");
    localStorage.removeItem("columnWidthsServisOncelik");
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
            placeholder="Kod veya tanım ara..."
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
            className: record.varsayilan ? 'bg-amber-50' : ''
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