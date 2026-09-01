import React, { useCallback, useMemo, useState } from "react";
import { Col, Grid, Row } from "antd";
import { DndContext, PointerSensor, closestCenter, useSensor, useSensors } from "@dnd-kit/core";
import { restrictToFirstScrollableAncestor } from "@dnd-kit/modifiers";
import { SortableContext, rectSortingStrategy } from "@dnd-kit/sortable";
import { useTranslation } from "react-i18next";
import FilterBar from "./components/FilterBar";
import KpiCard from "./components/KpiCard";
import ActionCenter from "./components/ActionCenter";
import CompletedWorkOrders from "./components/CompletedWorkOrders";
import WorkOrderTypePerformance from "./components/WorkOrderTypePerformance";
import MonthlyMaintenanceCosts from "./components/MonthlyMaintenanceCosts";
import FailurePareto from "./components/FailurePareto";
import TopFailureEquipment from "./components/TopFailureEquipment";
import RecurringFailures from "./components/RecurringFailures";
import UpcomingMaintenances from "./components/UpcomingMaintenances";
import PersonnelKpi from "./components/PersonnelKpi";
import PerformanceSummary from "./components/PerformanceSummary";
import WorkOrderTimeDistribution from "./components/WorkOrderTimeDistribution";
import InventoryDistribution from "./components/InventoryDistribution";
import WidgetManagerDrawer from "./components/WidgetManagerDrawer";
import SortableWidget from "./components/SortableWidget";
import useWidgetLayout from "./components/useWidgetLayout";
import { WidgetSizeContext } from "./components/widgetSizeContext";
import { ROW_GUTTER } from "./components/theme";

// Her widget tek başına sürüklenir. `col` antd Col kırılımları, `span` yönetim çekmecesinde gösterilen genişliktir.
const WIDGET_LAYOUT = {
  kpiBekleyenIsTalepleri: { span: 6, col: { xs: 24, sm: 12, xl: 6 } },
  kpiAcikIsEmirleri: { span: 6, col: { xs: 24, sm: 12, xl: 6 } },
  kpiKritikStoklar: { span: 6, col: { xs: 24, sm: 12, xl: 6 } },
  kpiAcikArizaIsEmirleri: { span: 6, col: { xs: 24, sm: 12, xl: 6 } },
  actionCenter: { span: 10, col: { xs: 24, lg: 10 } },
  completedWorkOrders: { span: 14, col: { xs: 24, lg: 14 } },
  workOrderTypePerformance: { span: 12, col: { xs: 24, lg: 12 } },
  monthlyMaintenanceCosts: { span: 12, col: { xs: 24, lg: 12 } },
  failurePareto: { span: 12, col: { xs: 24, lg: 12 } },
  topFailureEquipment: { span: 12, col: { xs: 24, lg: 12 } },
  recurringFailures: { span: 14, col: { xs: 24, lg: 14 } },
  upcomingMaintenances: { span: 10, col: { xs: 24, lg: 10 } },
  personnelKpi: { span: 24, col: { xs: 24 } },
  performanceSummary: { span: 24, col: { xs: 24 } },
  timeDistribution: { span: 24, col: { xs: 24 } },
  inventoryDistribution: { span: 24, col: { xs: 24 } },
};

export default function MainDashboard() {
  const { t } = useTranslation();
  const { order, hidden, spans, heights, setOrder, toggleVisibility, hideWidget, setWidgetSize, resetWidgetSize, resetLayout } = useWidgetLayout();
  const [reorderMode, setReorderMode] = useState(false);
  const [widgetManagerOpen, setWidgetManagerOpen] = useState(false);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }));
  const screens = Grid.useBreakpoint();
  // Dar ekranda sabit filtre çubuğu dikey alanın çoğunu yediği için yalnızca geniş ekranlarda sabitlenir.
  const filtreCubuguSabit = screens.lg !== false;

  const widgetTitles = useMemo(
    () => ({
      kpiBekleyenIsTalepleri: t("bekleyenIsTalepleri"),
      kpiAcikIsEmirleri: t("acikIsEmirleri"),
      kpiKritikStoklar: t("kritikStoklar"),
      kpiAcikArizaIsEmirleri: t("acikArizaIsEmirleri"),
      actionCenter: t("aksiyonMerkezi"),
      completedWorkOrders: t("tamamlanmisIsler"),
      workOrderTypePerformance: t("isEmriTipleri"),
      monthlyMaintenanceCosts: t("aylikBakimMaliyetleri"),
      failurePareto: t("arizaNedenleriPareto"),
      topFailureEquipment: t("enCokArizaVerenEkipmanlar"),
      recurringFailures: t("tekrarlayanArizalar"),
      upcomingMaintenances: t("yaklasanBakimlar"),
      personnelKpi: t("personelKpi"),
      performanceSummary: t("bakimPerformansiOzeti"),
      timeDistribution: t("acilanIsEmirlerininZamanDagilimi"),
      inventoryDistribution: t("makineTiplerineGoreEnvanterDagilimi"),
    }),
    [t]
  );

  const widgets = useMemo(
    () => ({
      kpiBekleyenIsTalepleri: <KpiCard cardKey="kpiBekleyenIsTalepleri" />,
      kpiAcikIsEmirleri: <KpiCard cardKey="kpiAcikIsEmirleri" />,
      kpiKritikStoklar: <KpiCard cardKey="kpiKritikStoklar" />,
      kpiAcikArizaIsEmirleri: <KpiCard cardKey="kpiAcikArizaIsEmirleri" />,
      actionCenter: <ActionCenter onHide={() => hideWidget("actionCenter")} />,
      completedWorkOrders: <CompletedWorkOrders onHide={() => hideWidget("completedWorkOrders")} />,
      workOrderTypePerformance: <WorkOrderTypePerformance onHide={() => hideWidget("workOrderTypePerformance")} />,
      monthlyMaintenanceCosts: <MonthlyMaintenanceCosts onHide={() => hideWidget("monthlyMaintenanceCosts")} />,
      failurePareto: <FailurePareto onHide={() => hideWidget("failurePareto")} />,
      topFailureEquipment: <TopFailureEquipment onHide={() => hideWidget("topFailureEquipment")} />,
      recurringFailures: <RecurringFailures onHide={() => hideWidget("recurringFailures")} />,
      upcomingMaintenances: <UpcomingMaintenances onHide={() => hideWidget("upcomingMaintenances")} />,
      personnelKpi: <PersonnelKpi onHide={() => hideWidget("personnelKpi")} />,
      performanceSummary: <PerformanceSummary />,
      timeDistribution: <WorkOrderTimeDistribution onHide={() => hideWidget("timeDistribution")} />,
      inventoryDistribution: <InventoryDistribution onHide={() => hideWidget("inventoryDistribution")} />,
    }),
    [hideWidget]
  );

  const visibleOrder = order.filter((key) => !hidden.includes(key));

  // Kullanici bir widget'i yeniden boyutlandirdiysa lg ve ustu kirilimlarda o genislik kullanilir.
  const effectiveSpans = useMemo(
    () => Object.fromEntries(Object.keys(WIDGET_LAYOUT).map((key) => [key, spans[key] ?? WIDGET_LAYOUT[key].span])),
    [spans]
  );

  const stretchValues = useMemo(
    () => Object.fromEntries(Object.keys(WIDGET_LAYOUT).map((key) => [key, { stretch: Boolean(heights[key]), height: heights[key] ?? null }])),
    [heights]
  );

  const colPropsFor = useCallback(
    (key) => {
      const base = WIDGET_LAYOUT[key].col;
      const span = spans[key];
      return span ? { ...base, lg: span, xl: span, xxl: span } : base;
    },
    [spans]
  );

  const handleDragEnd = ({ active, over }) => {
    if (!over || active.id === over.id) return;
    const oldIndex = order.indexOf(active.id);
    const newIndex = order.indexOf(over.id);
    if (oldIndex < 0 || newIndex < 0) return;

    const nextOrder = [...order];
    nextOrder.splice(newIndex, 0, nextOrder.splice(oldIndex, 1)[0]);
    setOrder(nextOrder);
  };

  const filtreCubugu = <FilterBar reorderMode={reorderMode} onToggleReorder={() => setReorderMode((previous) => !previous)} onOpenWidgetManager={() => setWidgetManagerOpen(true)} />;

  return (
    // Sayfa yüksekliği sabit; sadece widget listesi kendi içinde kayar, filtre çubuğu ve arka plan sabit kalır.
    <div style={{ height: "100%", minHeight: 0, display: "flex", flexDirection: "column", overflow: "hidden" }}>
      {filtreCubuguSabit && <div style={{ flexShrink: 0, padding: "0 4px" }}>{filtreCubugu}</div>}

      {/* Yeniden sirala modunda satirlarin kesikli cercevesi ve tutamaci kutunun disina tastigi icin ekstra bosluk birakilir. */}
      <div
        style={{
          flex: 1,
          minHeight: 0,
          overflowY: "auto",
          overflowX: "hidden",
          overscrollBehavior: "contain",
          scrollbarGutter: "stable",
          padding: reorderMode ? "16px 8px" : "0 4px 16px",
        }}
      >
        {!filtreCubuguSabit && filtreCubugu}
        <DndContext sensors={sensors} collisionDetection={closestCenter} modifiers={[restrictToFirstScrollableAncestor]} onDragEnd={handleDragEnd}>
          <SortableContext items={visibleOrder} strategy={rectSortingStrategy}>
            {/* Widget'lar tek bir akış içinde dizilir; genişlikleri toplandıkça satırlar kendiliğinden oluşur. */}
            <Row gutter={reorderMode ? [ROW_GUTTER[0], 22] : ROW_GUTTER}>
              {visibleOrder.map((key) => (
                <Col key={key} {...colPropsFor(key)}>
                  {/* Elle yukseklik verilmediyse kart satirdaki en uzun widget kadar uzar (height:100%). */}
                  <WidgetSizeContext.Provider value={stretchValues[key]}>
                    <div style={{ height: heights[key] || "100%" }}>
                      <SortableWidget
                        id={key}
                        reorderMode={reorderMode}
                        span={effectiveSpans[key]}
                        height={heights[key]}
                        isResized={Boolean(spans[key] || heights[key])}
                        onResize={setWidgetSize}
                        onResetSize={resetWidgetSize}
                      >
                        {widgets[key]}
                      </SortableWidget>
                    </div>
                  </WidgetSizeContext.Provider>
                </Col>
              ))}
            </Row>
          </SortableContext>
        </DndContext>
      </div>

      <WidgetManagerDrawer
        open={widgetManagerOpen}
        onClose={() => setWidgetManagerOpen(false)}
        order={order}
        hidden={hidden}
        widgetTitles={widgetTitles}
        widgetSpans={effectiveSpans}
        onReorder={setOrder}
        onToggleVisibility={toggleVisibility}
        onReset={resetLayout}
      />
    </div>
  );
}
