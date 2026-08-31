import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import dayjs from "dayjs";
import MainDashboard from "./MainDashboard.jsx";
import DashboardProvider from "./components/DashboardProvider.jsx";
import ActionCenterProvider from "./components/ActionCenterProvider.jsx";
import KpiCardsProvider from "./components/KpiCardsProvider.jsx";
import "./dashboard.css";

export default function Dashboard() {
  const formMethods = useForm({
    defaultValues: {
      dashboardBaslangicTarihi: dayjs().startOf("year"),
      dashboardBitisTarihi: dayjs().endOf("year"),
      tekrarlayanArizaBaslangicTarihi: dayjs().subtract(90, "day"),
      tekrarlayanArizaBitisTarihi: dayjs(),
      personelKpiBaslangicTarihi: dayjs().startOf("month"),
      personelKpiBitisTarihi: dayjs(),
    },
  });

  return (
    <FormProvider {...formMethods}>
      <DashboardProvider>
        <ActionCenterProvider>
          <KpiCardsProvider>
            <MainDashboard />
          </KpiCardsProvider>
        </ActionCenterProvider>
      </DashboardProvider>
    </FormProvider>
  );
}
