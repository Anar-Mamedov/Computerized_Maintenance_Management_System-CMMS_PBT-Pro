import React from "react";
import MainDashboard from "./MainDashboard.jsx";
import { FormProvider, useForm } from "react-hook-form";

export default function Dashboard() {
  const formMethods = useForm();
  return (
    <FormProvider {...formMethods}>
      <div style={{ height: "100%", minHeight: 0 }}>
        <MainDashboard />
      </div>
    </FormProvider>
  );
}
