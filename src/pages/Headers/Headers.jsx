import React, { useEffect, useState } from "react";
import { message } from "antd";
import Kullanici from "./components/Kullanici";
import Bildirim from "./components/Bildirim";
import FirmaLogo from "./components/FirmaLogo.jsx";
import Hatirlatici from "./components/Hatirlatici.jsx";
import AxiosInstance from "../../api/http.jsx";
import SearchComponent from "./components/SearchComponent.jsx";
import LanguageSelectbox from "../components/Language/LanguageSelectbox.jsx";

export default function Header() {
  const [hatirlaticiData, setHatirlaticiData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const checkInternetConnection = () => {
      if (!navigator.onLine) {
        message.error("Ağ bağlantınız kesildi", 5); // 3 saniye sonra kaybolur
      }
    };

    // Her 30 saniyede bir internet bağlantısını kontrol et
    const interval = setInterval(checkInternetConnection, 15000);

    // Component unmount edildiğinde interval'ı temizle
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const checkInternetConnection1 = async () => {
      const timeout = new Promise((_, reject) => setTimeout(() => reject(new Error("Request timed out")), 2000));

      try {
        const response = await Promise.race([fetch("https://www.google.com", { mode: "no-cors" }), timeout]);
        if (response) {
          // Veribaglanti();
          // message.success("İnternet bağlantısi sağlandı", 5); // 3 saniye sonra kaybolur
        }
      } catch (error) {
        message.error("İnternet bağlantınız kesildi", 5); // 3 saniye sonra kaybolur
      }
    };

    const intervalId = setInterval(checkInternetConnection1, 15000); // 15 saniye = 15000 ms

    // Cleanup function to clear the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);

  const Veribaglanti = async () => {
    const timeout = new Promise((_, reject) => setTimeout(() => reject(new Error("Request timed out")), 2000));
    try {
      const response = await Promise.race([AxiosInstance.get("VeritabaniBaglantiKontrol"), timeout]);
    } catch (error) {
      message.error("Sunucu bağlantınız kesildi", 5); // 3 saniye sonra kaybolur
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await AxiosInstance.get("PbakimYaklasanSureSayi");
        setHatirlaticiData(response);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [open]);

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
      <LanguageSelectbox />
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
        <SearchComponent />
        <Hatirlatici hatirlaticiData={hatirlaticiData} loading={loading} open={open} setOpen={setOpen} />
        <Bildirim />
        <Kullanici />
      </div>
    </div>
  );
}
