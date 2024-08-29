import React, { useState, useEffect } from "react";
import MainTable from "./../Table/Table.jsx";
import { useForm, FormProvider, useFormContext } from "react-hook-form";
import ShortInfo from "../components/Component1.jsx";
import Filters from "./../Filters/Filters.jsx";
import IsTalebiTipleriAtolyeler from "./components/IsTalebiTipleriAtolyeler.jsx";
import PersonellerMudahaleSuresi from "./components/PersonellerMudahaleSuresi.jsx";
import MudaheleSuresiHistogram from "../components/MudaheleSuresiHistogram.jsx";
import AylikOrtalamaMudaheleSuresi from "../components/AylikOrtalamaMudaheleSuresi.jsx";
import AylikOrtalamaMudaheleSuresiTable from "../components/AylikOrtalamaMudaheleSuresiTable.jsx";

function Main(props) {
  const {
    control,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useFormContext();

  const [isWideScreen, setIsWideScreen] = useState(window.innerWidth > 850);

  useEffect(() => {
    const handleResize = () => {
      setIsWideScreen(window.innerWidth > 850);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px", overflow: "auto", height: "calc(100vh - 170px)" }}>
      <Filters />
      <ShortInfo />
      <div style={{ display: "flex", gap: "10px" }}>
        <MudaheleSuresiHistogram />
        <AylikOrtalamaMudaheleSuresi />
      </div>
      <AylikOrtalamaMudaheleSuresiTable />

      <div
        style={{
          display: "flex",
          gap: "10px",
          flexDirection: isWideScreen ? "row" : "column",
        }}
      >
        <IsTalebiTipleriAtolyeler />
        <PersonellerMudahaleSuresi />
      </div>
      <MainTable />
    </div>
  );
}

export default Main;
