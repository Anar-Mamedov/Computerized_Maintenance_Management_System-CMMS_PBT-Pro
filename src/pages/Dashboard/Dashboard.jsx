import React from "react";
import Hatirlatici from "./Hatirlatici/Hatirlatici";

export default function Dashboard() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        alignItems: "flex-start",
      }}>
      <div>Grafikler</div>
      <Hatirlatici />
    </div>
  );
}
