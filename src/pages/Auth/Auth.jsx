// Fotoğrafı içe aktarın
import React, { useEffect, useState } from "react";
import { Button, Form, Input, Space, Spin, Typography, theme } from "antd";
import { UserAddOutlined, GlobalOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import backgroundImage from "../../assets/images/login.jpg";
import backgroundBaseURL from "../../assets/images/backgroundBaseURL.webp";
import LoginForm from "./components/LoginForm";
import logo from "../../assets/images/logo.svg";
import RegistrationForm from "./components/RegistrationForm";
import LanguageSelectbox from "../components/Language/LanguageSelectbox";
import axios from "axios";
import AxiosInstance, { setApiBaseURL } from "../../api/http";
import "./Auth.css";

const { Text, Link } = Typography;

const hostname = window.location.hostname;
const isOmega = hostname === "omegaerp.net" || hostname === "www.omegaerp.net";
const brandName = isOmega ? "Omega" : "PBT PRO";

export default function Auth() {
  const { t, i18n } = useTranslation();
  const { token: themeToken } = theme.useToken();
  const [target, setTarget] = React.useState("login"); // login veya register
  const [target1, setTarget1] = React.useState("login"); // login veya register
  const [baseURL, setBaseURL] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false); // Yükleme durumunu takip eden durum değişkeni
  const [loadingImage, setLoadingImage] = useState(false); // Yükleme durumu için yeni bir state
  const [logoUrl, setLogoUrl] = useState(null); // logo URL'i için state
  const [backgroundImageUrl, setBackgroundImageUrl] = useState(null); // Arka plan resmi URL'i için state
  const [sslWarning, setSslWarning] = useState(""); // SSL uyarısı için state

  // Sayfa yüklendiğinde localStorage kontrolü yapılıyor
  useEffect(() => {
    const storedBaseURL = localStorage.getItem("baseURL");
    if (storedBaseURL) {
      setBaseURL(storedBaseURL);
      setApiBaseURL(storedBaseURL);
      setTarget("login"); // Eğer baseURL kayıtlıysa, direkt login ekranı
    } else {
      setTarget("initial"); // Eğer kayıtlı değilse, baseURL kaydetme ekranı
    }
  }, []);

  const saveBaseURL = () => {
    const sanitizedBaseURL = baseURL.trim().replace(/\/+$/, "");
    if (!sanitizedBaseURL) {
      setErrorMessage("Geçerli Bir Bağlantı Anahtarı Giriniz.");
      return;
    }

    setLoading(true);
    axios
      .get(`${sanitizedBaseURL}/api/VeritabaniBaglantiKontrol`)
      .then((response) => {
        if (response.data.baglantiDurumu === true) {
          localStorage.setItem("baseURL", sanitizedBaseURL);
          localStorage.setItem("isEntraID", JSON.stringify(response.data.isEntraID));
          setApiBaseURL(sanitizedBaseURL);
          setBaseURL(sanitizedBaseURL);
          setErrorMessage("");
          setTarget("login");
          setTarget1("login");
        } else {
          console.error("URL is not valid or server is not responding correctly.");
          setErrorMessage("Geçerli Bir Bağlantı Anahtarı Giriniz.");
        }
      })
      .catch((error) => {
        console.error("Error occurred while trying to reach the URL:", error);
        setErrorMessage("Geçerli Bir Bağlantı Anahtarı Giriniz.");
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
    if (!baseURL || target !== "login") {
      return;
    }

    let isMounted = true;
    setLoadingImage(true);

    const fetchImages = async () => {
      try {
        const responseLogo = await AxiosInstance.get(`ResimGetirById?id=1`, {
          responseType: "blob",
        });

        if (isMounted) {
          setLogoUrl((prev) => {
            if (prev) {
              URL.revokeObjectURL(prev);
            }
            return URL.createObjectURL(responseLogo);
          });
        }
      } catch (error) {
        console.error("Error fetching logo image:", error);
      }

      try {
        const responseBackground = await AxiosInstance.get(`ResimGetirById?id=2`, {
          responseType: "blob",
        });

        if (isMounted) {
          setBackgroundImageUrl((prev) => {
            if (prev) {
              URL.revokeObjectURL(prev);
            }
            return URL.createObjectURL(responseBackground);
          });
        }
      } catch (error) {
        console.error("Error fetching background image:", error);
      } finally {
        if (isMounted) {
          setLoadingImage(false);
        }
      }
    };

    fetchImages();

    return () => {
      isMounted = false;
    };
  }, [baseURL, target]);

  useEffect(() => {
    return () => {
      if (logoUrl) {
        URL.revokeObjectURL(logoUrl);
      }
      if (backgroundImageUrl) {
        URL.revokeObjectURL(backgroundImageUrl);
      }
    };
  }, [logoUrl, backgroundImageUrl]);

  const handleBaseURLChange = (e) => {
    const url = e.target.value;
    setBaseURL(url);
    if (url.startsWith("http:") && !url.startsWith("https:")) {
      setSslWarning("SSL sertifikası olmayan bir bağlantı anahtarı girdiniz lütfen site ayarlarından Güvenli Olmayan İçerik ayarına izin verin.");
    } else {
      setSslWarning("");
    }
  };

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
                  flexDirection: "column",
                }}
              >
                <Text style={{ textAlign: "center" }}>Uygulamayı kullanmak için aşağıdaki alana veri tabanı bağlantı anahtarını girin.</Text>
                {sslWarning && (
                  <Text
                    style={{
                      color: "red",
                      marginBottom: "-5px",
                      marginTop: "5px",
                      textAlign: "center",
                    }}
                  >
                    {sslWarning}
                  </Text>
                )}
              </div>

              <Form style={{ width: "300px" }}>
                <Input placeholder="Bağlantı Anahtarını Girin" value={baseURL} onChange={handleBaseURLChange} name="baseURL" autoComplete="on" />
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
        <div
          className="auth-panel"
          style={{
            "--auth-primary": themeToken.colorPrimary,
            "--auth-primary-hover": themeToken.colorPrimaryHover,
            "--auth-ring": themeToken.controlOutline,
          }}
        >
          <div className="auth-panel-header">
            <div className="auth-language">
              <GlobalOutlined className="auth-language-icon" />
              <LanguageSelectbox />
            </div>
          </div>

          <div className="auth-panel-body">
            <div className="auth-content">
              <div className="auth-brand">
                {loadingImage ? <Spin /> : logoUrl && <img src={logoUrl} alt={brandName} className="auth-brand-logo" />}
                {/* lang: CSS uppercase dönüşümünün Türkçe/Azerbaycan "i -> İ" kuralını uygulaması için gerekli. */}
                <span className="auth-brand-subtitle" lang={i18n.language}>
                  {t("kurumsalVarlikBakimYonetimi")}
                </span>
              </div>

              {target1 === "login" ? <LoginForm /> : <RegistrationForm />}
            </div>
          </div>

          <div className="auth-panel-footer">
            <span>
              © {new Date().getFullYear()} {brandName}
            </span>
            <span>
              <span className="auth-footer-brand">Orjin</span> {t("yazilimTeknolojisidir")}
            </span>
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
