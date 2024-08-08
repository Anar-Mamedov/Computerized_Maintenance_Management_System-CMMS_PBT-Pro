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
        message.error("Ağ bağlantınız kesildi", 3); // 3 saniye sonra kaybolur
      }
    };

    // Her 30 saniyede bir internet bağlantısını kontrol et
    const interval = setInterval(checkInternetConnection, 15000);

    // Component unmount edildiğinde interval'ı temizle
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const checkInternetConnection = async () => {
      try {
        const response = await fetch("https://www.google.com", { mode: "no-cors" });
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
      } catch (error) {
        message.error("İnternet bağlantınız kesildi", 3); // 3 saniye sonra kaybolur
      }
    };

    const intervalId = setInterval(checkInternetConnection, 15000); // 1 dakika = 60000 ms

    // Cleanup function to clear the interval when the component unmounts
    return () => clearInterval(intervalId);
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
