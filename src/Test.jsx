import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { ConfigProvider } from "antd";
import trTR from "antd/es/locale/tr_TR";
import { BrowserRouter as Router } from "react-router-dom";
import { AppProvider } from "./AppContext.jsx";
import { RecoilRoot } from "recoil";
import dayjs from "dayjs"; // Day.js kütüphanesini ekleyin
import AxiosInstance from "./api/http.jsx"; // Axios kütüphanesini ekleyin
import "./index.css";

// Uygulamanın kullanılamayacağı durum için bir bileşen
const AppDisabled = () => <div style={{ textAlign: "center", marginTop: "20%" }}></div>;
const Main = () => {
  return (
    <React.StrictMode>
      <ConfigProvider locale={trTR}>
        <Router>
          <AppProvider>
            <RecoilRoot>
              <App />
            </RecoilRoot>
          </AppProvider>
        </Router>
      </ConfigProvider>
    </React.StrictMode>
  );
};
const MainComponent1 = () => {
  const [disableDate, setDisableDate] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // API çağrısını burada yapın
    AxiosInstance.get("GetEndDate") // Burada API endpoint'inizi kullanın
      .then((response) => {
        setDisableDate(dayjs(response.ISL_DONEM_BITIS));
        setLoading(false);
      })
      .catch((error) => {
        console.error("API çağrısında hata oluştu:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div style={{ textAlign: "center", marginTop: "20%", fontSize: "18px" }}>Yükleniyor...</div>;
  }

  const currentDate = dayjs();

  if (disableDate && currentDate.isAfter(disableDate)) {
    // Mevcut tarih belirlenen tarihten sonra ise, uygulamayı engelle
    return <AppDisabled />;
  } else {
    // Aksi takdirde, uygulamayı normal şekilde render et
    return <Main />;
  }
};

const MainComponent = () => {
  useEffect(() => {
    const baseURL = localStorage.getItem("baseURL");
    if (baseURL) {
      return <MainComponent1 />;
    } else {
      return <Main />;
    }
  }, []);
};

// Uygulamayı render et
ReactDOM.createRoot(document.getElementById("root")).render(<MainComponent />);
