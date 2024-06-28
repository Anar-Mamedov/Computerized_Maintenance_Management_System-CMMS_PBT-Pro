import React, { useState } from "react";
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
  rectSortingStrategy,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Typography, Modal, Button } from "antd";
import { HolderOutlined } from "@ant-design/icons";
import Component1 from "./components/Component1.jsx";
import Component2 from "./components/Component2.jsx";
import Component3 from "./components/Component3.jsx";

const { Text } = Typography;

const SortableItem = ({ id, children }) => {
  return <div style={{ marginBottom: "10px" }}>{children}</div>;
};

const DraggableRow = ({ id, text }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const styleWithTransform = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    backgroundColor: isDragging ? "#f0f0f0" : "",
    display: "flex",
    alignItems: "center",
    gap: 8,
    marginBottom: "10px",
  };

  return (
    <div ref={setNodeRef} style={styleWithTransform} {...attributes}>
      <div
        {...listeners}
        style={{
          cursor: "grab",
          flexGrow: 1,
          display: "flex",
          alignItems: "center",
        }}
      >
        <HolderOutlined style={{ marginRight: 8 }} />
        {text}
      </div>
    </div>
  );
};

function Dashboard() {
  const [items, setItems] = useState([
    "Component1",
    "Component2",
    "Component3",
  ]);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const componentsMap = {
    Component1: <Component1 />,
    Component2: <Component2 />,
    Component3: <Component3 />,
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.indexOf(active.id);
        const newIndex = items.indexOf(over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  return (
    <div>
      <Button onClick={() => setIsModalVisible(true)}>Open Modal</Button>

      <div
        style={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          gap: "10px",
          alignItems: "flex-start",
        }}
      >
        {items.map((id) => (
          <SortableItem key={id} id={id}>
            {componentsMap[id]}
          </SortableItem>
        ))}
      </div>

      <Modal
        title="Manage Components"
        centered
        width={800}
        open={isModalVisible}
        onOk={() => setIsModalVisible(false)}
        onCancel={() => setIsModalVisible(false)}
      >
        <Text style={{ marginBottom: "15px" }}>
          You can reorder components in the list below.
        </Text>
        <DndContext
          onDragEnd={handleDragEnd}
          sensors={useSensors(
            useSensor(PointerSensor),
            useSensor(KeyboardSensor, {
              coordinateGetter: sortableKeyboardCoordinates,
            })
          )}
        >
          <div style={{ height: "400px", overflow: "auto" }}>
            <SortableContext
              items={items}
              strategy={verticalListSortingStrategy}
            >
              {items.map((id) => (
                <DraggableRow key={id} id={id} text={id} />
              ))}
            </SortableContext>
          </div>
        </DndContext>
      </Modal>
    </div>
  );
}

export default Dashboard;
