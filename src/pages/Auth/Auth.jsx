// Fotoğrafı içe aktarın
import React, { useEffect, useState } from "react";
import { Button, Form, Input, Space, Typography } from "antd";
import { UserAddOutlined } from "@ant-design/icons";
import backgroundImage from "../../assets/images/login.jpg";
import LoginForm from "./components/LoginForm";
import logo from "../../assets/images/logo.svg";
import RegistrationForm from "./components/RegistrationForm";

const { Text, Link } = Typography;

export default function Auth() {
  const [target, setTarget] = React.useState("login"); // login veya register
  const [target1, setTarget1] = React.useState("login"); // login veya register
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

  // JavaScript objesi olarak stil tanımlaması
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

  // Beyaz alan için stil tanımlaması
  const whiteAreaStyle = {
    backgroundColor: "white",
    height: "100vh",
    width: "100vw", // Genişlik ve yükseklik 100vw ve 100vh olacak
    maxWidth: "800px",
    position: "fixed", // Sabit pozisyon, içerik kaydırılsa bile sol tarafta sabit kalır
    left: 0,
    top: 0,
    zIndex: 1, // İçerikle çakışmaması için arka plandan öne alır
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };

  const logoStyle = {
    width: "200px", // Genişliği sabit tutun
    marginBottom: "50px", // Aşağıda 20 piksellik boşluk bırakın
  };

  const formStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "100%",
    height: "100%",
    zIndex: 1000,
    backgroundColor: "#ffffffcc",
  };

  const toggleTarget = () => {
    setTarget1(target1 === "login" ? "register" : "login");
  };

  // Formun gösterilmesini yönetir
  const renderForm = () => {
    if (target === "initial") {
      return (
        <div style={formStyle}>
          <Form style={{ width: "300px" }}>
            <Input placeholder="Base URL girin" value={baseURL} onChange={(e) => setBaseURL(e.target.value)} />
            <Button type="primary" onClick={saveBaseURL} style={{ marginTop: 20, width: "100%" }}>
              Kaydet
            </Button>
          </Form>
        </div>
      );
    } else if (target === "login") {
      return (
        <div style={whiteAreaStyle}>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              width: "400px",
              height: "700px",
              flexDirection: "column",
              alignItems: "center",
            }}>
            <img src={logo} alt="Logo" style={logoStyle} />
            {target1 === "login" ? <LoginForm /> : <RegistrationForm />}
            <Text type="secondary" style={{ fontSize: "14px", marginBottom: "20px" }}>
              ve ya
            </Text>
            <Button
              style={{
                zIndex: "10",
                width: "100%",
                backgroundColor: "rgb(43, 199, 112)",
                borderColor: "rgb(43, 199, 112)",
                color: "white",
              }}
              onClick={toggleTarget}>
              {target1 === "login" ? <UserAddOutlined /> : null}
              {target1 === "login" ? "Kayıt Ol" : "Giriş Yap"}
            </Button>
          </div>
        </div>
      );
    }
  };

  return (
    <div>
      <div style={backgroundStyle}></div>
      {/* Beyaz alanı ekleyin */}

      {renderForm()}

      {/* İçerik, beyaz alanın üzerine veya dışına gelebilir */}
    </div>
  );
}
