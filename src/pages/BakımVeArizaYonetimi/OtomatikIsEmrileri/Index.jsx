import React from "react";
import Tablar from "./Tablar";
import { FormProvider, useForm } from "react-hook-form";

export default function OtomatikIsEmirleri({ hatirlaticiGrupId, hatirlaticiSiraId }) {
  const formMethods = useForm();
  return (
    <FormProvider {...formMethods}>
      <div>
        <Tablar hatirlaticiGrupId={hatirlaticiGrupId} hatirlaticiSiraId={hatirlaticiSiraId} />
      </div>
    </FormProvider>
  );
}
