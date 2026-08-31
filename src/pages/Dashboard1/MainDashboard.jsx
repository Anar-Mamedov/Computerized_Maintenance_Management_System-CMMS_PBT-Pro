import React, { useMemo, useState } from "react";
import { Col, Row } from "antd";
import { DndContext, PointerSensor, closestCenter, useSensor, useSensors } from "@dnd-kit/core";
import { restrictToParentElement, restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useTranslation } from "react-i18next";
import FilterBar from "./components/FilterBar";
import KpiCards from "./components/KpiCards";
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
import SortableWidgetRow from "./components/SortableWidgetRow";
import useWidgetLayout from "./components/useWidgetLayout";
import { ROW_GUTTER } from "./components/theme";

export default function MainDashboard() {
  const { t } = useTranslation();
  const { order, hidden, setOrder, toggleVisibility, hideWidget, resetLayout } = useWidgetLayout();
  const [reorderMode, setReorderMode] = useState(false);
  const [widgetManagerOpen, setWidgetManagerOpen] = useState(false);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }));

  const widgetTitles = useMemo(
    () => ({
      kpi: t("kpiKartlari"),
      actionCompleted: `${t("aksiyonMerkezi")} + ${t("tamamlanmisIsler")}`,
      typeCosts: `${t("isEmriTipleri")} + ${t("aylikBakimMaliyetleri")}`,
      paretoTopEquipment: `${t("arizaNedenleriPareto")} + ${t("enCokArizaVerenEkipmanlar")}`,
      recurringUpcoming: `${t("tekrarlayanArizalar")} + ${t("yaklasanBakimlar")}`,
      personnelKpi: t("personelKpi"),
      performanceSummary: t("bakimPerformansiOzeti"),
      timeDistribution: t("acilanIsEmirlerininZamanDagilimi"),
      inventoryDistribution: t("makineTiplerineGoreEnvanterDagilimi"),
    }),
    [t]
  );

  const widgetRows = useMemo(
    () => ({
      kpi: <KpiCards />,
      actionCompleted: (
        <Row gutter={ROW_GUTTER}>
          <Col xs={24} lg={10}>
            <ActionCenter onHide={() => hideWidget("actionCompleted")} />
          </Col>
          <Col xs={24} lg={14}>
            <CompletedWorkOrders onHide={() => hideWidget("actionCompleted")} />
          </Col>
        </Row>
      ),
      typeCosts: (
        <Row gutter={ROW_GUTTER}>
          <Col xs={24} lg={12}>
            <WorkOrderTypePerformance onHide={() => hideWidget("typeCosts")} />
          </Col>
          <Col xs={24} lg={12}>
            <MonthlyMaintenanceCosts onHide={() => hideWidget("typeCosts")} />
          </Col>
        </Row>
      ),
      paretoTopEquipment: (
        <Row gutter={ROW_GUTTER}>
          <Col xs={24} lg={12}>
            <FailurePareto onHide={() => hideWidget("paretoTopEquipment")} />
          </Col>
          <Col xs={24} lg={12}>
            <TopFailureEquipment onHide={() => hideWidget("paretoTopEquipment")} />
          </Col>
        </Row>
      ),
      recurringUpcoming: (
        <Row gutter={ROW_GUTTER}>
          <Col xs={24} lg={14}>
            <RecurringFailures onHide={() => hideWidget("recurringUpcoming")} />
          </Col>
          <Col xs={24} lg={10}>
            <UpcomingMaintenances onHide={() => hideWidget("recurringUpcoming")} />
          </Col>
        </Row>
      ),
      personnelKpi: <PersonnelKpi onHide={() => hideWidget("personnelKpi")} />,
      performanceSummary: <PerformanceSummary />,
      timeDistribution: <WorkOrderTimeDistribution onHide={() => hideWidget("timeDistribution")} />,
      inventoryDistribution: <InventoryDistribution onHide={() => hideWidget("inventoryDistribution")} />,
    }),
    [hideWidget]
  );

  const visibleOrder = order.filter((key) => !hidden.includes(key));

  const handleDragEnd = ({ active, over }) => {
    if (!over || active.id === over.id) return;
    const oldIndex = order.indexOf(active.id);
    const newIndex = order.indexOf(over.id);
    if (oldIndex < 0 || newIndex < 0) return;

    const nextOrder = [...order];
    nextOrder.splice(newIndex, 0, nextOrder.splice(oldIndex, 1)[0]);
    setOrder(nextOrder);
  };

  return (
    <div style={{ padding: "0 4px 16px" }}>
      <FilterBar reorderMode={reorderMode} onToggleReorder={() => setReorderMode((previous) => !previous)} onOpenWidgetManager={() => setWidgetManagerOpen(true)} />

      <DndContext sensors={sensors} collisionDetection={closestCenter} modifiers={[restrictToVerticalAxis, restrictToParentElement]} onDragEnd={handleDragEnd}>
        <SortableContext items={visibleOrder} strategy={verticalListSortingStrategy}>
          <div style={{ display: "flex", flexDirection: "column", gap: reorderMode ? 22 : 12 }}>
            {visibleOrder.map((key) => (
              <SortableWidgetRow key={key} id={key} reorderMode={reorderMode}>
                <div>{widgetRows[key]}</div>
              </SortableWidgetRow>
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <WidgetManagerDrawer
        open={widgetManagerOpen}
        onClose={() => setWidgetManagerOpen(false)}
        order={order}
        hidden={hidden}
        widgetTitles={widgetTitles}
        onReorder={setOrder}
        onToggleVisibility={toggleVisibility}
        onReset={resetLayout}
      />
    </div>
  );
}
