import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { ConfigProvider } from "antd";
import trTR from "antd/es/locale/tr_TR";
import { BrowserRouter as Router } from "react-router-dom";
// import './index.css'

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ConfigProvider locale={trTR}>
      <Router>
        <App />
      </Router>
    </ConfigProvider>
  </React.StrictMode>
);
