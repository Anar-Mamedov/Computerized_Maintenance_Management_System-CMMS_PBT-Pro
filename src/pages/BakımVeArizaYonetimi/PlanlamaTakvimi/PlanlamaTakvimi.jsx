import React from "react";
import MainTable from "./Table/Table1";
import { FormProvider, useForm } from "react-hook-form";

export default function PersonelTanimlari() {
  const formMethods = useForm();
  return (
    <FormProvider {...formMethods}>
      <div>
        <MainTable />
      </div>
    </FormProvider>
  );
}
