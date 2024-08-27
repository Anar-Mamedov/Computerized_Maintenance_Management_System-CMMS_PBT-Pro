import React from "react";
import MainTable from "./../Table/Table.jsx";
import { useForm, FormProvider, useFormContext } from "react-hook-form";
import ShortInfo from "../components/Component1.jsx";

function Main(props) {
  const {
    control,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useFormContext();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      <ShortInfo />
      <MainTable />
    </div>
  );
}

export default Main;
