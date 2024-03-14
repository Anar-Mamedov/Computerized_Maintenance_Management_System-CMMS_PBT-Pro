import MainTable from "./Table/Table";
import { FormProvider, useForm } from "react-hook-form";

export default function OtomatikIsEmri() {
  const formMethods = useForm();
  
  return (
    <FormProvider {...formMethods}>
      <div>
        <MainTable />
      </div>
    </FormProvider>
  )
}
