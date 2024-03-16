// Fotoğrafı içe aktarın
import React from "react";
import { Button, Form, Input, Space, Typography } from "antd";
import { UserAddOutlined } from "@ant-design/icons";
import backgroundImage from "../../assets/images/login.jpg";
import LoginForm from "./components/LoginForm";
import logo from "../../assets/images/logo.svg";
import RegistrationForm from "./components/RegistrationForm";

const { Text, Link } = Typography;

export default function Auth() {
  const [target, setTarget] = React.useState("login"); // login veya register

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

  const toggleTarget = () => {
    setTarget(target === "login" ? "register" : "login");
  };

  return (
    <div>
      <div style={backgroundStyle}></div>
      {/* Beyaz alanı ekleyin */}

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
          {target === "login" ? <LoginForm /> : <RegistrationForm />}
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
            {target === "login" ? <UserAddOutlined /> : null}
            {target === "login" ? "Kayıt Ol" : "Giriş Yap"}
          </Button>
        </div>
      </div>

      {/* İçerik, beyaz alanın üzerine veya dışına gelebilir */}
    </div>
  );
}
