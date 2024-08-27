import React from "react";
import Main from "./Main/Main";
import { FormProvider, useForm } from "react-hook-form";

export default function PersonelTanimlari() {
  const formMethods = useForm();
  return (
    <FormProvider {...formMethods}>
      <div>
        <Main />
      </div>
    </FormProvider>
  );
}
