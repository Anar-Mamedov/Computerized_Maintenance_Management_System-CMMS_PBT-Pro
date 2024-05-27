import React from "react";
import Kullanici from "./components/Kullanici";
import Bildirim from "./components/Bildirim";
import FirmaLogo from "./components/FirmaLogo.jsx";

export default function Header() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        padding: "10px 10px",
        width: "100%",
        justifyContent: "speace-between",
        gap: "10px",
      }}
    >
      <FirmaLogo />
      <div
        style={{
          display: "flex",
          alignItems: "center",
          padding: "10px 10px",
          width: "100%",
          justifyContent: "flex-end",
          gap: "10px",
        }}
      >
        <Bildirim />
        <Kullanici />
      </div>
    </div>
  );
}
