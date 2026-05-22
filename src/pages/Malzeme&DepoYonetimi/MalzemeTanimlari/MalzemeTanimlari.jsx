import React from "react";
import MainTable from "./Table/Table";
import { FormProvider, useForm } from "react-hook-form";

export default function LokasyonTanim({ hatirlaticiGrupId, hatirlaticiSiraId }) {
  const formMethods = useForm();
  return (
    <FormProvider {...formMethods}>
      <div>
        <MainTable hatirlaticiGrupId={hatirlaticiGrupId} hatirlaticiSiraId={hatirlaticiSiraId} />
      </div>
    </FormProvider>
  );
}
