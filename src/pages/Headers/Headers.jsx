import React, { useEffect } from "react";
import { message } from "antd";
import Kullanici from "./components/Kullanici";
import Bildirim from "./components/Bildirim";
import FirmaLogo from "./components/FirmaLogo.jsx";
import Hatirlatici from "./components/Hatırlatıcı.jsx";

export default function Header() {
  useEffect(() => {
    const checkInternetConnection = () => {
      if (!navigator.onLine) {
        message.error("İnternet bağlantınız kesildi", 3); // 3 saniye sonra kaybolur
      }
    };

    // Her 30 saniyede bir internet bağlantısını kontrol et
    const interval = setInterval(checkInternetConnection, 30000);

    // Component unmount edildiğinde interval'ı temizle
    return () => clearInterval(interval);
  }, []);

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
        <Hatirlatici />
        <Bildirim />
        <Kullanici />
      </div>
    </div>
  );
}
