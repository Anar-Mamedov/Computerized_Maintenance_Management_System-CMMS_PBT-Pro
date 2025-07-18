import React from "react";
import LocationFilter from "./components/LocationFilter.jsx";
import AtolyeFilter from "./components/AtolyeFilter.jsx";
import TarihFilter from "./components/TarihFilter.jsx";
import MakineFilter from "./components/MakineFilter.jsx";

function Filters(props) {
  return (
    <div style={{ display: "flex", gap: "10px" }}>
      <LocationFilter />
      <AtolyeFilter />
      <MakineFilter />
      <TarihFilter />
    </div>
  );
}

export default Filters;
