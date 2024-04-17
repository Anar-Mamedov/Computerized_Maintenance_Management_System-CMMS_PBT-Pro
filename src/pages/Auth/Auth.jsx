import React, { useState, useEffect } from "react";
import { Button, Input, Form } from "antd";
import { UserAddOutlined } from "@ant-design/icons";
import backgroundImage from "../../assets/images/login.jpg";
import LoginForm from "./components/LoginForm";
import logo from "../../assets/images/logo.svg";
import RegistrationForm from "./components/RegistrationForm";

export default function Auth() {
  const [target, setTarget] = useState("login");
  const [baseURL, setBaseURL] = useState("");

  // Sayfa yüklendiğinde localStorage kontrolü yapılıyor
  useEffect(() => {
    const storedBaseURL = localStorage.getItem("baseURL");
    if (storedBaseURL) {
      setBaseURL(storedBaseURL);
      setTarget("login"); // Eğer baseURL kayıtlıysa, direkt login ekranı
    } else {
      setTarget("initial"); // Eğer kayıtlı değilse, baseURL kaydetme ekranı
    }
  }, []);

  const saveBaseURL = () => {
    localStorage.setItem("baseURL", baseURL);
    window.location.reload();
    // setTarget("login");
    // baseURL kaydedildikten sonra login ekranına geçiş
  };

  const backgroundStyle = {
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    height: "100vh",
    width: "100vw",
    position: "fixed",
    top: 0,
    left: 0,
    zIndex: -1,
  };

  const formStyle = {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "300px",
    zIndex: 1000,
  };

  // Formun gösterilmesini yönetir
  const renderForm = () => {
    if (target === "initial") {
      return (
        <Form style={formStyle}>
          <Input placeholder="Base URL girin" value={baseURL} onChange={(e) => setBaseURL(e.target.value)} />
          <Button type="primary" onClick={saveBaseURL} style={{ marginTop: 20 }}>
            Kaydet
          </Button>
        </Form>
      );
    } else if (target === "login") {
      return <LoginForm />;
    } else if (target === "register") {
      return <RegistrationForm />;
    }
  };

  return (
    <div>
      <div style={backgroundStyle}></div>
      {renderForm()}
    </div>
  );
}
