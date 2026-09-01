import React, { useCallback, useRef, useState } from "react";
import PropTypes from "prop-types";
import { Tooltip } from "antd";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useTranslation } from "react-i18next";
import { LuGripVertical, LuRotateCcw } from "react-icons/lu";
import { MAX_WIDGET_SPAN, MIN_WIDGET_SPAN, heightToRows, snapHeight } from "./useWidgetLayout";
import { COLORS } from "./theme";

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

// Kenar tutamaçlarının tıklanabilir kalınlığı.
const HANDLE_THICKNESS = 12;

const HANDLE_BASE = {
  position: "absolute",
  zIndex: 3,
  touchAction: "none",
};

/**
 * Tek bir dashboard widget'ını "Yeniden Sırala" modunda sürüklenebilir ve
 * kesikli çerçevesinin kenarlarından yeniden boyutlandırılabilir hale getirir.
 * Mod kapalıyken içerik olduğu gibi render edilir.
 */
export default function SortableWidget({ id, reorderMode, span, height, isResized, onResize, onResetSize, children }) {
  const { t } = useTranslation();
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id, disabled: !reorderMode });
  const wrapperRef = useRef(null);
  const previewRef = useRef(null);
  const [preview, setPreview] = useState(null);

  // Tutamaç bırakıldığında son değeri okuyabilmek için state ve ref birlikte güncellenir.
  const updatePreview = useCallback((next) => {
    previewRef.current = next;
    setPreview(next);
  }, []);

  const startResize = useCallback(
    (event, axis) => {
      // Tutamaç sürüklemesi kart tıklamasına veya dnd-kit taşımasına dönüşmemeli.
      event.preventDefault();
      event.stopPropagation();

      const wrapper = wrapperRef.current;
      const rect = wrapper?.getBoundingClientRect();
      // Kolon genisligi izgaradan anlik olcülür; ayri bir ölçüm state'ine gerek kalmaz.
      const gridWidth = wrapper?.closest(".ant-row")?.getBoundingClientRect().width || 0;
      const columnWidth = gridWidth / MAX_WIDGET_SPAN;
      if (!rect || !columnWidth) return;

      const start = { x: event.clientX, y: event.clientY, width: rect.width, height: rect.height };
      // Başlangıçta widget'ın gerçek boyutu gösterilir; ızgaraya oturma ilk hareketle başlar.
      updatePreview({ span, height: Math.round(rect.height), axis, columnWidth, moved: false });

      const handleMove = (moveEvent) => {
        // Tutamaca dokunup hiç hareket etmemek boyutu değiştirmemeli.
        if (Math.abs(moveEvent.clientX - start.x) < 3 && Math.abs(moveEvent.clientY - start.y) < 3) return;

        const next = { ...previewRef.current, moved: true };

        if (axis !== "y") {
          const nextWidth = start.width + (moveEvent.clientX - start.x);
          next.span = clamp(Math.round(nextWidth / columnWidth), MIN_WIDGET_SPAN, MAX_WIDGET_SPAN);
        }
        if (axis !== "x") {
          // Genişlik gibi yükseklik de ızgara adımına oturur; iki widget aynı değere kolayca gelir.
          next.height = snapHeight(start.height + (moveEvent.clientY - start.y));
        }

        updatePreview(next);
      };

      const handleUp = () => {
        window.removeEventListener("pointermove", handleMove);
        window.removeEventListener("pointerup", handleUp);
        window.removeEventListener("pointercancel", handleUp);

        const son = previewRef.current;
        updatePreview(null);

        if (!son || !son.moved) return;
        // Yalnızca sürüklenen eksenin değeri kaydedilir.
        onResize(id, {
          span: son.axis === "y" ? undefined : son.span,
          height: son.axis === "x" ? undefined : son.height,
        });
      };

      window.addEventListener("pointermove", handleMove);
      window.addEventListener("pointerup", handleUp);
      window.addEventListener("pointercancel", handleUp);
    },
    [id, onResize, span, updatePreview]
  );

  if (!reorderMode) return children;

  const previewWidth = preview?.span ? Math.max(preview.span * preview.columnWidth - 12, 0) : null;
  // Yükseklik ayarlanmışsa veya ayarlanıyorsa rozette satır sayısı da gösterilir.
  const aktifYukseklik = preview?.axis === "x" ? height : preview?.height ?? height;
  const gosterilecekSatir = aktifYukseklik ? heightToRows(aktifYukseklik) : null;

  return (
    <div
      ref={(node) => {
        setNodeRef(node);
        wrapperRef.current = node;
      }}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        position: "relative",
        height: "100%",
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
          zIndex: 4,
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

      {/* Guncel genislik rozeti; boyut degistirildiyse sifirlama dugmesi de gosterilir. */}
      <span
        style={{
          position: "absolute",
          top: -10,
          right: 12,
          zIndex: 4,
          display: "inline-flex",
          alignItems: "center",
          gap: 4,
          padding: "1px 4px 1px 8px",
          borderRadius: 999,
          background: isResized ? COLORS.blue : COLORS.surface,
          color: isResized ? COLORS.surface : COLORS.muted,
          border: `1px solid ${COLORS.blue}`,
          fontSize: 11,
          lineHeight: "16px",
          whiteSpace: "nowrap",
        }}
      >
        {t("kolonOrani", { span: preview?.span ?? span })}
        {gosterilecekSatir ? <span style={{ opacity: 0.75 }}>{t("satirOrani", { rows: gosterilecekSatir })}</span> : null}
        {isResized ? (
          <Tooltip title={t("boyutuSifirla")}>
            <button
              type="button"
              aria-label={t("boyutuSifirla")}
              onClick={() => onResetSize(id)}
              style={{ display: "inline-flex", alignItems: "center", border: "none", background: "transparent", color: "inherit", cursor: "pointer", padding: "0 2px" }}
            >
              <LuRotateCcw size={11} />
            </button>
          </Tooltip>
        ) : (
          <span style={{ width: 2 }} />
        )}
      </span>

      {/* Kenar ve kose tutamaclari: sag = genislik, alt = yukseklik, kose = ikisi birden. */}
      <Tooltip title={t("genisligiAyarla")} placement="right">
        <span
          role="separator"
          className="pbt-resize-handle pbt-resize-handle-x"
          aria-label={t("genisligiAyarla")}
          onPointerDown={(event) => startResize(event, "x")}
          style={{ ...HANDLE_BASE, top: 12, bottom: 12, right: -HANDLE_THICKNESS / 2, width: HANDLE_THICKNESS, cursor: "col-resize" }}
        />
      </Tooltip>
      <Tooltip title={t("yuksekligiAyarla")} placement="bottom">
        <span
          role="separator"
          className="pbt-resize-handle pbt-resize-handle-y"
          aria-label={t("yuksekligiAyarla")}
          onPointerDown={(event) => startResize(event, "y")}
          style={{ ...HANDLE_BASE, left: 12, right: 12, bottom: -HANDLE_THICKNESS / 2, height: HANDLE_THICKNESS, cursor: "row-resize" }}
        />
      </Tooltip>
      <span
        role="separator"
        className="pbt-resize-corner"
        aria-label={t("boyutuAyarla")}
        onPointerDown={(event) => startResize(event, "xy")}
        style={{
          ...HANDLE_BASE,
          right: -8,
          bottom: -8,
          width: 16,
          height: 16,
          borderRadius: 4,
          border: `2px solid ${COLORS.blue}`,
          borderTop: "none",
          borderLeft: "none",
          cursor: "nwse-resize",
        }}
      />

      {/* Surukleme sirasinda hedef boyutu gosteren onizleme; gercek yerlesim birakildiginda guncellenir. */}
      {preview ? (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: previewWidth ?? "100%",
            height: preview.height,
            border: `2px solid ${COLORS.blue}`,
            background: "rgba(22, 119, 255, 0.06)",
            borderRadius: 12,
            zIndex: 5,
            pointerEvents: "none",
          }}
        />
      ) : null}

      {children}
    </div>
  );
}

SortableWidget.propTypes = {
  id: PropTypes.string.isRequired,
  reorderMode: PropTypes.bool,
  span: PropTypes.number,
  height: PropTypes.number,
  isResized: PropTypes.bool,
  onResize: PropTypes.func,
  onResetSize: PropTypes.func,
  children: PropTypes.node,
};
