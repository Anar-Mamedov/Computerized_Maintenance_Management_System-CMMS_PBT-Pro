import React from "react";
import AyarlarTabs from "./components/Tabs";
import { FormProvider, useForm } from "react-hook-form";

function Ayarlar(props) {
  const formMethods = useForm();
  return (
    <FormProvider {...formMethods}>
      <div>
        <AyarlarTabs />
      </div>
    </FormProvider>
  );
}

export default Ayarlar;
