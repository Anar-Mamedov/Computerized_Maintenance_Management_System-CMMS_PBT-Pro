import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import Sekmeler from "./Sekmeler.jsx";

export default function Analizler() {
  const formMethods = useForm();
  return (
    <FormProvider {...formMethods}>
      <div>
        <Sekmeler />
      </div>
    </FormProvider>
  );
}
