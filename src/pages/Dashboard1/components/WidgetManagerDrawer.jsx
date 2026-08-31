import React from "react";
import PropTypes from "prop-types";
import { Button, Drawer, Switch } from "antd";
import { DndContext, PointerSensor, closestCenter, useSensor, useSensors } from "@dnd-kit/core";
import { restrictToParentElement, restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useTranslation } from "react-i18next";
import { LuGripVertical, LuRotateCcw } from "react-icons/lu";
import { COLORS } from "./theme";

function SortableWidgetRow({ id, title, visible, onToggle }) {
  const { t } = useTranslation();
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.6 : 1,
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "10px 12px",
        border: `1px solid ${COLORS.border}`,
        borderRadius: 10,
        marginBottom: 8,
        background: COLORS.surface,
      }}
    >
      <span {...attributes} {...listeners} style={{ cursor: "grab", display: "grid", placeItems: "center", color: COLORS.muted }} aria-label={t("suruklemeTutamaci")}>
        <LuGripVertical size={16} />
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 500, color: COLORS.text }}>{title}</div>
        <div style={{ fontSize: 12, color: COLORS.muted }}>{t("varsayilanGenislik")}</div>
      </div>
      <Switch size="small" checked={visible} onChange={(checked) => onToggle(id, checked)} />
    </div>
  );
}

SortableWidgetRow.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  visible: PropTypes.bool,
  onToggle: PropTypes.func.isRequired,
};

export default function WidgetManagerDrawer({ open, onClose, order, hidden, widgetTitles, onReorder, onToggleVisibility, onReset }) {
  const { t } = useTranslation();
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }));

  const handleDragEnd = ({ active, over }) => {
    if (!over || active.id === over.id) return;
    const oldIndex = order.indexOf(active.id);
    const newIndex = order.indexOf(over.id);
    if (oldIndex < 0 || newIndex < 0) return;

    const nextOrder = [...order];
    nextOrder.splice(newIndex, 0, nextOrder.splice(oldIndex, 1)[0]);
    onReorder(nextOrder);
  };

  return (
    <Drawer
      open={open}
      onClose={onClose}
      width={420}
      title={t("widgetleriYonet")}
      extra={
        <Button size="small" icon={<LuRotateCcw size={13} />} onClick={onReset}>
          {t("varsayilanSiralamayaDon")}
        </Button>
      }
    >
      <p style={{ fontSize: 12.5, color: COLORS.muted, marginTop: 0 }}>{t("widgetYonetimAciklama")}</p>
      <DndContext sensors={sensors} collisionDetection={closestCenter} modifiers={[restrictToVerticalAxis, restrictToParentElement]} onDragEnd={handleDragEnd}>
        <SortableContext items={order} strategy={verticalListSortingStrategy}>
          {order.map((key) => (
            <SortableWidgetRow key={key} id={key} title={widgetTitles[key]} visible={!hidden.includes(key)} onToggle={onToggleVisibility} />
          ))}
        </SortableContext>
      </DndContext>
    </Drawer>
  );
}

WidgetManagerDrawer.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  order: PropTypes.array.isRequired,
  hidden: PropTypes.array.isRequired,
  widgetTitles: PropTypes.object.isRequired,
  onReorder: PropTypes.func.isRequired,
  onToggleVisibility: PropTypes.func.isRequired,
  onReset: PropTypes.func.isRequired,
};
