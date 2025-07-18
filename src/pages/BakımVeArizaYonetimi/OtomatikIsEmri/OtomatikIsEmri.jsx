
import { FormProvider, useForm } from "react-hook-form";
import MainTable from "./Table/Table";

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
