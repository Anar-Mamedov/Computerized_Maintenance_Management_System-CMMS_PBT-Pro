import React, { Suspense, useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { ConfigProvider } from "antd";
import trTR from "antd/es/locale/tr_TR";
import enUS from "antd/es/locale/en_US"; // İngilizce locale
import ruRU from "antd/es/locale/ru_RU"; // Rusça locale
import azAZ from "antd/es/locale/az_AZ"; // Azerbaycan locale
import { BrowserRouter as Router } from "react-router-dom";
import { AppProvider } from "./AppContext.jsx";
import { RecoilRoot } from "recoil";
import { I18nextProvider, useTranslation } from "react-i18next";
import i18n from "./utils/i18n.js";
import { useDevToolsStatus } from "./utils/useDevToolsStatus.js";
import dayjs from "dayjs";
import AxiosInstance from "./api/http.jsx";
import "./index.css";

// App component
// const App = React.lazy(() => import("./App.jsx"));
import App from "./App.jsx";

// Ant Design locale mapping
const antdLocales = {
  tr: trTR,
  en: enUS,
  ru: ruRU,
  az: azAZ,
  // fr: frFR,
  // de: deDE,
  // Diğer dilleri buraya ekleyin
};

// Component to show when the app is disabled
const AppDisabledComponent = () => {
  const isDevToolsOpen = useDevToolsStatus();

  useEffect(() => {
    if (isDevToolsOpen) {
      window.location.href = "about:blank";
    }
  }, [isDevToolsOpen]);
  return <div style={{ textAlign: "center", marginTop: "20%" }}></div>;
};
const AppDisabled = React.memo(AppDisabledComponent);

// Main component
const MainComponent = () => {
  const baseURL = localStorage.getItem("baseURL");
  return baseURL ? <MainComponent1 /> : <Main />;
};

// Main application component
const MainComponent1 = React.memo(function MainComponent1() {
  const isDevToolsOpen = useDevToolsStatus();

  useEffect(() => {
    if (isDevToolsOpen) {
      window.location.href = "about:blank";
    }
  }, [isDevToolsOpen]);

  return <Main />;
});

// Main component
const Main = React.memo(function Main() {
  const { i18n } = useTranslation();
  const language = i18n.language || "tr"; // Varsayılan dili 'tr' olarak ayarlayın

  const isDevToolsOpen = useDevToolsStatus();

  useEffect(() => {
    if (isDevToolsOpen) {
      window.location.href = "about:blank";
    }
  }, [isDevToolsOpen]);

  // Domain'e göre title'ı değiştir
  useEffect(() => {
    const hostname = window.location.hostname;
    if (hostname === "omegaerp.net" || hostname === "www.omegaerp.net") {
      document.title = "Omega";
    }
  }, []);

  // Ant Design locale objesini belirleme
  const antdLocale = antdLocales[language] || enUS; // Desteklenmeyen diller için varsayılan olarak enUS

  // dayjs'i doğru locale ile ayarlayın
  useEffect(() => {
    dayjs.locale(language);
  }, [language]);
  return (
    // <React.StrictMode>
    <I18nextProvider i18n={i18n}>
      <ConfigProvider locale={antdLocale}>
        <Router>
          <AppProvider>
            <RecoilRoot>
              <Suspense
                fallback={
                  <div style={{ textAlign: "center", fontSize: "18px", display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>Yükleniyor...</div>
                }
              >
                <App />
              </Suspense>
            </RecoilRoot>
          </AppProvider>
        </Router>
      </ConfigProvider>
    </I18nextProvider>
    // </React.StrictMode>
  );
});

// Render the application
ReactDOM.createRoot(document.getElementById("root")).render(<MainComponent />);
