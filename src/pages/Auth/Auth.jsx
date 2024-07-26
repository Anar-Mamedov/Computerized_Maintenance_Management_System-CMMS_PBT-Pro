// Fotoğrafı içe aktarın
import React, { useEffect, useState } from "react";
import { Button, Form, Input, Space, Spin, Typography } from "antd";
import { UserAddOutlined } from "@ant-design/icons";
import backgroundImage from "../../assets/images/login.jpg";
import backgroundBaseURL from "../../assets/images/backgroundBaseURL.webp";
import LoginForm from "./components/LoginForm";
import logo from "../../assets/images/logo.svg";
import RegistrationForm from "./components/RegistrationForm";
import axios from "axios";
import AxiosInstance from "../../api/http";

const { Text, Link } = Typography;

export default function Auth() {
  const [target, setTarget] = React.useState("login"); // login veya register
  const [target1, setTarget1] = React.useState("login"); // login veya register
  const [baseURL, setBaseURL] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false); // Yükleme durumunu takip eden durum değişkeni
  const [loadingImage, setLoadingImage] = useState(false); // Yükleme durumu için yeni bir state
  const [logoUrl, setLogoUrl] = useState(null); // logo URL'i için state
  const [backgroundImageUrl, setBackgroundImageUrl] = useState(null); // Arka plan resmi URL'i için state

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
    setLoading(true);
    axios
      .get(`${baseURL}/api/VeritabaniBaglantiKontrol`)
      .then((response) => {
        if (response.data === true) {
          localStorage.setItem("baseURL", baseURL);
          window.location.reload();
        } else {
          console.error("URL is not valid or server is not responding correctly.");
          setErrorMessage("Geçerli Bir Bağlantı Anahtarı Giriniz.");
        }
      })
      .catch((error) => {
        console.error("Error occurred while trying to reach the URL:", error);
      })
      .finally(() => setLoading(false));
  };

  // const saveBaseURL = () => {
  //   localStorage.setItem("baseURL", baseURL);
  //   window.location.reload();
  //   // setTarget("login");
  //   // baseURL kaydedildikten sonra login ekranına geçiş
  // };

  // JavaScript objesi olarak stil tanımlaması
  const backgroundStyle = {
    backgroundImage: `url(${backgroundImageUrl})`,
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
    backgroundColor: "rgba(255, 255, 255, 0.85)",
  };

  const formBackground = {
    backgroundImage: `url(${backgroundBaseURL})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    width: "100vw",
    height: "100vh",
  };

  // Resimleri yüklemek için useEffect
  useEffect(() => {
    if (baseURL) {
      setLoadingImage(true);
      const fetchImages = async () => {
        try {
          const responseLogo = await AxiosInstance.get(`ResimGetirById?id=1`, {
            responseType: "blob",
          });
          const logoBlob = responseLogo;
          setLogoUrl(URL.createObjectURL(logoBlob));
        } catch (error) {
          console.error("Error fetching logo image:", error);
        }

        try {
          const responseBackground = await AxiosInstance.get(`ResimGetirById?id=2`, {
            responseType: "blob",
          });
          const backgroundBlob = responseBackground;
          setBackgroundImageUrl(URL.createObjectURL(backgroundBlob));
        } catch (error) {
          console.error("Error fetching background image:", error);
        } finally {
          setLoadingImage(false);
        }
      };
      fetchImages();
    }
  }, [baseURL]);

  const toggleTarget = () => {
    setTarget1(target1 === "login" ? "register" : "login");
  };

  // Formun gösterilmesini yönetir
  const renderForm = () => {
    if (target === "initial") {
      return (
        <div style={formBackground}>
          <div style={formStyle}>
            <div
              style={{
                backgroundColor: "white",
                padding: "70px 50px",
                borderRadius: "16px",
                boxShadow: "rgba(0, 0, 0, 0.2) 0px 0px 25px 3px",
              }}
            >
              <div
                style={{
                  width: "300px",
                  marginBottom: "15px",
                  display: "flex",
                }}
              >
                <Text style={{ textAlign: "center" }}>Uygulamayı kullanmak için aşağıdaki alana veri tabanı bağlantı anahtarını girin.</Text>
              </div>

              <Form style={{ width: "300px" }}>
                <Input placeholder="Bağlantı Anahtarını Girin" value={baseURL} onChange={(e) => setBaseURL(e.target.value)} name="baseURL" autoComplete="on" />
                {errorMessage && (
                  <p
                    style={{
                      color: "red",
                      marginBottom: "-10px",
                      marginTop: "5px",
                    }}
                  >
                    {errorMessage}
                  </p>
                )}
                {/* <Button type="primary" onClick={saveBaseURL} style={{ marginTop: 20, width: "100%" }}>
                  Kaydet
                </Button> */}
                <Button type="primary" onClick={saveBaseURL} style={{ marginTop: 20, width: "100%" }} disabled={loading}>
                  {loading ? <Spin /> : "Kaydet"}
                </Button>
              </Form>
            </div>
          </div>
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
            }}
          >
            <div>
              {loadingImage && <Spin />}
              <img
                src={logoUrl}
                alt="Logo"
                style={{
                  ...logoStyle,
                  visibility: loadingImage ? "hidden" : "visible",
                }}
              />
            </div>
            {target1 === "login" ? <LoginForm /> : <RegistrationForm />}
            {/* <Text type="secondary" style={{ fontSize: "14px", marginBottom: "20px" }}>
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
            </Button> */}
          </div>
        </div>
      );
    }
  };

  return (
    <div>
      {loadingImage ? <Spin style={{ position: "fixed", right: "25%", top: "50%" }} /> : <div style={backgroundStyle}></div>}
      {/* Beyaz alanı ekleyin */}

      {renderForm()}

      {/* İçerik, beyaz alanın üzerine veya dışına gelebilir */}
    </div>
  );
}
