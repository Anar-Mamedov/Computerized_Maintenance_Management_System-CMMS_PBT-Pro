import React from "react";
import MainTable from "./../Table/Table.jsx";
import { useForm, FormProvider, useFormContext } from "react-hook-form";

function Main(props) {
  const {
    control,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useFormContext();

  return (
    <div>
      <MainTable />
    </div>
  );
}

export default Main;
