import React, { useState, useEffect, Suspense } from "react";
import ReactDOM from "react-dom/client";
import { ConfigProvider } from "antd";
import trTR from "antd/es/locale/tr_TR";
import { BrowserRouter as Router } from "react-router-dom";
import { AppProvider } from "./AppContext.jsx";
import { RecoilRoot } from "recoil";
import dayjs from "dayjs";
import AxiosInstance from "./api/http.jsx";
import "./index.css";

// App bileşenini lazy load ile yükleyin
const App = React.lazy(() => import("./App.jsx"));

// Uygulamanın devre dışı olduğu durumu gösteren bileşen
const AppDisabledComponent = () => <div style={{ textAlign: "center", marginTop: "20%" }}></div>;
const AppDisabled = React.memo(AppDisabledComponent);

// Ana bileşen
const MainComponent = () => {
  const baseURL = localStorage.getItem("baseURL");
  return baseURL ? <MainComponent1 /> : <Main />;
};

// Ana uygulama bileşeni
const MainComponent1 = React.memo(function MainComponent1() {
  const [disableDate, setDisableDate] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDisableDate = async () => {
      try {
        const response = await AxiosInstance.get("GetEndDate");
        const data = response;
        if (data && data.length > 0) {
          setDisableDate(dayjs(data[0].ISL_DONEM_BITIS).format("YYYY-MM-DD"));
        } else {
          console.error("API responsunda beklenen veri bulunamadı.");
        }
      } catch (error) {
        console.error("API çağrısında hata oluştu:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDisableDate();
  }, []);

  if (loading) {
    return <div style={{ textAlign: "center", marginTop: "20%", fontSize: "18px" }}>Yükleniyor...</div>;
  }

  const currentDate = dayjs();

  if (disableDate && currentDate.isAfter(disableDate)) {
    return <AppDisabled />;
  }

  return <Main />;
});

// Main bileşeni
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

// Uygulamayı render et
ReactDOM.createRoot(document.getElementById("root")).render(<MainComponent />);
