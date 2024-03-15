import React from "react";
import Kullanici from "./components/Kullanici";

export default function Header() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        padding: "10px 10px",
        width: "100%",
        justifyContent: "flex-end",
      }}>
      <Kullanici />
    </div>
  );
}
