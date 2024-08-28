import React from "react";
import MainTable from "./../Table/Table.jsx";
import { useForm, FormProvider, useFormContext } from "react-hook-form";
import ShortInfo from "../components/Component1.jsx";
import Filters from "./../Filters/Filters.jsx";

function Main(props) {
  const {
    control,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useFormContext();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px", overflow: "auto", height: "calc(100vh - 170px)" }}>
      <Filters />
      <ShortInfo />
      <MainTable />
    </div>
  );
}

export default Main;
