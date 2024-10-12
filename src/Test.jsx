import React, { Suspense, useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { ConfigProvider } from "antd";
import trTR from "antd/es/locale/tr_TR";
import { BrowserRouter as Router } from "react-router-dom";
import { AppProvider } from "./AppContext.jsx";
import { RecoilRoot } from "recoil";
import dayjs from "dayjs";
import AxiosInstance from "./api/http.jsx";
import "./index.css";

// App component
import App from "./App.jsx";

// Component to show when the app is disabled
const AppDisabledComponent = () => <div style={{ textAlign: "center", marginTop: "20%" }}>Lisans süresi doldu.</div>;
const AppDisabled = React.memo(AppDisabledComponent);

// Main component
const MainComponent = () => {
  const baseURL = localStorage.getItem("baseURL");
  return baseURL ? <MainComponent1 /> : <Main />;
};

// Main application component
const MainComponent1 = React.memo(function MainComponent1() {
  const [disableDate, setDisableDate] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDisableDate = async () => {
    try {
      const data = await AxiosInstance.get("GetEndDate");
      if (data && data.length > 0) {
        const endDate = data[0].ISL_DONEM_BITIS;
        if (endDate) {
          setDisableDate(dayjs(endDate).format("YYYY-MM-DD"));
        } else {
          // ISL_DONEM_BITIS is null, treat as expired
          setDisableDate(null);
        }
      } else {
        console.error("API responsunda beklenen veri bulunamadı.");
        // Treat as expired if data is not as expected
        setDisableDate(null);
      }
    } catch (error) {
      console.error("API çağrısında hata oluştu:", error);
      // Optionally, you can decide how to handle API errors
      // For example, you might set disableDate to null to disable the app
      setDisableDate(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDisableDate();
  }, []);

  if (loading) {
    return <div style={{ textAlign: "center", marginTop: "20%", fontSize: "18px" }}>Yükleniyor...</div>;
  }

  if (!disableDate || dayjs().isAfter(disableDate, "day")) {
    return <AppDisabled />;
  }

  return <Main />;
});

// Main component
const Main = React.memo(function Main() {
  return (
    <React.StrictMode>
      <ConfigProvider locale={trTR}>
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
    </React.StrictMode>
  );
});

// Render the application
ReactDOM.createRoot(document.getElementById("root")).render(<MainComponent />);
