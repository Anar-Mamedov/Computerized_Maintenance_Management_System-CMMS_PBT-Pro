import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Checkbox, Typography } from "antd";
import { HolderOutlined } from "@ant-design/icons";
import { DndContext, useSensor, useSensors, PointerSensor, KeyboardSensor } from "@dnd-kit/core";
import { sortableKeyboardCoordinates, arrayMove, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Resizable } from "react-resizable";
import "../../../../ResizeStyle.css";

const { Text } = Typography;

// Sütunların boyutlarını ayarlamak için kullanılan component

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
          onClick={(e) => {
            e.stopPropagation();
          }}
        />
      }
      onResize={onResize}
      draggableOpts={{
        enableUserSelectHack: false,
      }}>
      <th {...restProps} />
    </Resizable>
  );
};
// Sütunların boyutlarını ayarlamak için kullanılan component sonu

// Sütunların sürüklenebilir olmasını sağlayan component

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
  };

  return (
    <div ref={setNodeRef} style={styleWithTransform} {...restProps} {...attributes}>
      {/* <Checkbox
        checked={visible}
        onChange={(e) => onVisibilityChange(index, e.target.checked)}
        style={{ marginLeft: "auto" }}
      /> */}
      <div {...listeners} style={{ cursor: "grab", flexGrow: 1, display: "flex", alignItems: "center" }}>
        <HolderOutlined style={{ marginRight: 8 }} />
        {text}
      </div>
    </div>
  );
};

// Sütunların sürüklenebilir olmasını sağlayan component sonu

const MainTable = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const initialColumns = [
    { title: "Name", dataIndex: "name", key: "name", visible: true, width: 150 },
    { title: "Age", dataIndex: "age", key: "age", visible: true, width: 100 },
    { title: "Address", dataIndex: "address", key: "address", visible: false, width: 200 },
    { title: "Anar", dataIndex: "anar", key: "anar", visible: true, width: 200 },
    { title: "Ebubekir", dataIndex: "ebubekir", key: "ebubekir", visible: true, width: 200 },
    { title: "Alborz", dataIndex: "alborz", key: "alborz", visible: true, width: 200 },
    { title: "Berke", dataIndex: "berke", key: "berke", visible: true, width: 200 },
    { title: "Ali", dataIndex: "ali", key: "ali", visible: true, width: 200 },
    { title: "Erhan", dataIndex: "erhan", key: "erhan", visible: true, width: 200 },
    { title: "Almaz", dataIndex: "almaz", key: "almaz", visible: true, width: 200 },
    { title: "Sevda", dataIndex: "sevda", key: "sevda", visible: true, width: 200 },
  ];

  // filtrelenmiş sütunları local storage'dan alıp state'e atıyoruz
  const [columns, setColumns] = useState(() => {
    const savedOrder = localStorage.getItem("columnOrder");
    const savedVisibility = localStorage.getItem("columnVisibility");
    const savedWidths = localStorage.getItem("columnWidths");

    let order = savedOrder ? JSON.parse(savedOrder) : [];
    let visibility = savedVisibility ? JSON.parse(savedVisibility) : {};
    let widths = savedWidths ? JSON.parse(savedWidths) : {};

    initialColumns.forEach((col) => {
      if (!order.includes(col.key)) {
        order.push(col.key);
      }
      if (visibility[col.key] === undefined) {
        visibility[col.key] = col.visible;
      }
      if (widths[col.key] === undefined) {
        widths[col.key] = col.width;
      }
    });

    localStorage.setItem("columnOrder", JSON.stringify(order));
    localStorage.setItem("columnVisibility", JSON.stringify(visibility));
    localStorage.setItem("columnWidths", JSON.stringify(widths));

    return order.map((key) => {
      const column = initialColumns.find((col) => col.key === key);
      return { ...column, visible: visibility[key], width: widths[key] };
    });
  });
  // filtrelenmiş sütunları local storage'dan alıp state'e atıyoruz sonu

  // sütunları local storage'a kaydediyoruz
  useEffect(() => {
    localStorage.setItem("columnOrder", JSON.stringify(columns.map((col) => col.key)));
    localStorage.setItem(
      "columnVisibility",
      JSON.stringify(columns.reduce((acc, col) => ({ ...acc, [col.key]: col.visible }), {}))
    );
    localStorage.setItem(
      "columnWidths",
      JSON.stringify(columns.reduce((acc, col) => ({ ...acc, [col.key]: col.width }), {}))
    );
  }, [columns]);
  // sütunları local storage'a kaydediyoruz sonu

  // sütunların boyutlarını ayarlamak için kullanılan fonksiyon
  const handleResize =
    (key) =>
    (_, { size }) => {
      setColumns((prev) => prev.map((col) => (col.key === key ? { ...col, width: size.width } : col)));
    };

  const components = {
    header: {
      cell: ResizableTitle,
    },
  };

  const mergedColumns = columns.map((col) => ({
    ...col,
    onHeaderCell: (column) => ({
      width: column.width,
      onResize: handleResize(column.key),
    }),
  }));

  // fitrelenmiş sütunları birleştiriyoruz ve sadece görünür olanları alıyoruz ve tabloya gönderiyoruz

  const filteredColumns = mergedColumns.filter((col) => col.visible);

  // fitrelenmiş sütunları birleştiriyoruz ve sadece görünür olanları alıyoruz ve tabloya gönderiyoruz sonu

  // sütunların sıralamasını değiştirmek için kullanılan fonksiyon

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = columns.findIndex((column) => column.key === active.id);
      const newIndex = columns.findIndex((column) => column.key === over.id);
      if (oldIndex !== -1 && newIndex !== -1) {
        setColumns((columns) => arrayMove(columns, oldIndex, newIndex));
      } else {
        console.error(`Column with key ${active.id} or ${over.id} does not exist.`);
      }
    }
  };

  // sütunların sıralamasını değiştirmek için kullanılan fonksiyon sonu

  // sütunların görünürlüğünü değiştirmek için kullanılan fonksiyon

  const toggleVisibility = (key, checked) => {
    const index = columns.findIndex((col) => col.key === key);
    if (index !== -1) {
      const newColumns = [...columns];
      newColumns[index].visible = checked;
      setColumns(newColumns);
    } else {
      console.error(`Column with key ${key} does not exist.`);
    }
  };

  // sütunların görünürlüğünü değiştirmek için kullanılan fonksiyon sonu

  // sütunları sıfırlamak için kullanılan fonksiyon

  function resetColumns() {
    localStorage.removeItem("columnOrder");
    localStorage.removeItem("columnVisibility");
    localStorage.removeItem("columnWidths");
    window.location.reload();
  }
  // sütunları sıfırlamak için kullanılan fonksiyon sonu

  return (
    <>
      <Button onClick={() => setIsModalVisible(true)}>Manage Columns</Button>
      <Modal
        title="Manage Columns"
        width={800}
        open={isModalVisible}
        onOk={() => setIsModalVisible(false)}
        onCancel={() => setIsModalVisible(false)}>
        <Text style={{ marginBottom: "15px" }}>
          Aşağıdaki Ekranlardan Sütunları Göster / Gizle ve Sıralamalarını Ayarlayabilirsiniz.
        </Text>
        <div style={{ display: "flex", width: "100%", justifyContent: "center", marginTop: "10px" }}>
          <Button onClick={resetColumns} style={{ marginBottom: "15px" }}>
            Sütunları Sıfırla
          </Button>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div style={{ width: "46%", border: "1px solid #8080806e", borderRadius: "8px", padding: "10px" }}>
            <div style={{ marginBottom: "20px", borderBottom: "1px solid #80808051", padding: "8px 8px 12px 8px" }}>
              <Text style={{ fontWeight: 600 }}>Sütunları Göster / Gizle</Text>
            </div>
            <div style={{ height: "400px", overflow: "auto" }}>
              {initialColumns.map((col) => (
                <div style={{ display: "flex", gap: "10px" }} key={col.key}>
                  <Checkbox
                    checked={columns.find((column) => column.key === col.key)?.visible || false}
                    onChange={(e) => toggleVisibility(col.key, e.target.checked)}
                  />
                  {col.title}
                </div>
              ))}
            </div>
          </div>

          <DndContext
            onDragEnd={handleDragEnd}
            sensors={useSensors(
              useSensor(PointerSensor),
              useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
            )}>
            <div style={{ width: "46%", border: "1px solid #8080806e", borderRadius: "8px", padding: "10px" }}>
              <div style={{ marginBottom: "20px", borderBottom: "1px solid #80808051", padding: "8px 8px 12px 8px" }}>
                <Text style={{ fontWeight: 600 }}>Sütunların Sıralamasını Ayarla</Text>
              </div>
              <div style={{ height: "400px", overflow: "auto" }}>
                {columns
                  .filter((col) => col.visible)
                  .map((col, index) => (
                    <DraggableRow key={col.key} id={col.key} index={index} text={col.title} />
                  ))}
              </div>
            </div>
          </DndContext>
        </div>
      </Modal>
      <Table
        components={components}
        columns={filteredColumns}
        scroll={{ y: "100vh" }}
        dataSource={[
          {
            key: "1",
            name: "John Brown",
            age: 32,
            address: "New York No. 1 Lake Park",
            anar: "Anar",
            ebubekir: "Ebubekir",
            alborz: "Alborz",
            berke: "Berke",
            ali: "Ali",
            erhan: "Erhan",
            almaz: "Almaz",
            sevda: "Sevda",
          },
        ]}
      />
    </>
  );
};

export default MainTable;
