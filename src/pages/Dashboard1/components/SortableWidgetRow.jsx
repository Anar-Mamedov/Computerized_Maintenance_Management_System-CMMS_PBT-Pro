import React from "react";
import PropTypes from "prop-types";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useTranslation } from "react-i18next";
import { LuGripVertical } from "react-icons/lu";
import { COLORS } from "./theme";

/**
 * Dashboard satırlarını "Yeniden Sırala" modunda sürüklenebilir hale getirir.
 * Mod kapalıyken içerik olduğu gibi render edilir.
 */
export default function SortableWidgetRow({ id, reorderMode, children }) {
  const { t } = useTranslation();
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id, disabled: !reorderMode });

  if (!reorderMode) return children;

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        position: "relative",
        outline: `1px dashed ${COLORS.blue}`,
        outlineOffset: 4,
        borderRadius: 12,
      }}
    >
      <span
        {...attributes}
        {...listeners}
        aria-label={t("suruklemeTutamaci")}
        style={{
          position: "absolute",
          top: -10,
          left: 12,
          zIndex: 2,
          display: "inline-flex",
          alignItems: "center",
          gap: 4,
          padding: "2px 8px",
          borderRadius: 999,
          background: COLORS.blue,
          color: COLORS.surface,
          fontSize: 11,
          cursor: "grab",
        }}
      >
        <LuGripVertical size={12} />
      </span>
      {children}
    </div>
  );
}

SortableWidgetRow.propTypes = {
  id: PropTypes.string.isRequired,
  reorderMode: PropTypes.bool,
  children: PropTypes.node,
};
