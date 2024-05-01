import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { ConfigProvider } from "antd";
import trTR from "antd/es/locale/tr_TR";
import { BrowserRouter as Router } from "react-router-dom";
import { AppProvider } from "./AppContext.jsx";
import { RecoilRoot } from "recoil";
import dayjs from "dayjs"; // Day.js kütüphanesini ekleyin
import "./index.css";

// Uygulamanın kullanılamayacağı durum için bir bileşen
const AppDisabled = () => <div style={{ textAlign: "center", marginTop: "20%" }}></div>;

// Uygulamanın render edilip edilmeyeceğini kontrol eden bir fonksiyon
const renderAppOrDisabled = () => {
  const currentDate = dayjs();
  const disableDate = dayjs("2024-07-01");

  if (currentDate.isAfter(disableDate)) {
    // Mevcut tarih belirlenen tarihten sonra ise, uygulamayı engelle
    return <AppDisabled />;
  } else {
    // Aksi takdirde, uygulamayı normal şekilde render et
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
  }
};

// Uygulamayı render et
ReactDOM.createRoot(document.getElementById("root")).render(renderAppOrDisabled());
