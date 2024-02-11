// Fotoğrafı içe aktarın
import React from "react";
import backgroundImage from "../../assets/images/login.jpg";
import LoginForm from "./components/LoginForm";

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
    width: "800px",
    position: "fixed", // Sabit pozisyon, içerik kaydırılsa bile sol tarafta sabit kalır
    left: 0,
    top: 0,
    zIndex: 1, // İçerikle çakışmaması için arka plandan öne alır
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };

  const toggleTarget = () => {
    setTarget(target === "login" ? "register" : "login");
  };

  return (
    <div>
      <div style={backgroundStyle}></div>
      {/* Beyaz alanı ekleyin */}

      <div style={whiteAreaStyle}>{target === "login" ? <LoginForm /> : <div>kayit ol</div>}</div>
      <button style={{ zIndex: "10" }} onClick={toggleTarget}>
        {target === "login" ? "Kayıt Ol" : "Giriş Yap"}
      </button>

      {/* İçerik, beyaz alanın üzerine veya dışına gelebilir */}
    </div>
  );
}
