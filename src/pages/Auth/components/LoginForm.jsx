import React, { useState, useEffect, useCallback } from "react";
import { Button, Form, Input, Typography, message, Spin, Checkbox, Modal } from "antd";
import { UserOutlined, LockOutlined, EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import AxiosInstance from "../../../api/http";
import { useSetRecoilState } from "recoil";
import { userState } from "../../../state/userState";
import LanguageSelectbox from "../../components/Language/LanguageSelectbox";
import ReCAPTCHA from "react-google-recaptcha"; // reCAPTCHA bileşenini import edin
import { useTranslation } from "react-i18next";

const { Text } = Typography;

export default function LoginForm() {
  const navigate = useNavigate();
  const setUser = useSetRecoilState(userState);
  const { t, i18n } = useTranslation(); // Initialize useTranslation
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [microsoftLoading, setMicrosoftLoading] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState(null); // reCAPTCHA token'ı için state
  const [isRecaptchaEnabled] = useState(true); // Toggle etmek için true/false yapın
  const [licenseModalVisible, setLicenseModalVisible] = useState(false);
  const [isEntraID, setIsEntraID] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("isEntraID") ?? "false") === true;
    } catch (error) {
      return false;
    }
  });

  const token = localStorage.getItem("token") || sessionStorage.getItem("token");

  useEffect(() => {
    if (token) {
      navigate("/", { replace: true });
    }
  }, [navigate, token]);

  const handleSuccessfulLogin = useCallback((response, remember = true) => {
    setUser({
      userId: response.TB_KULLANICI_ID,
      userName: response.KLL_TANIM,
      userResimID: response.resimId,
      userUnvan: response.KLL_UNVAN,
    });

    const userInfo = {
      userId: response.TB_KULLANICI_ID ?? null,
      userName: response.KLL_TANIM ?? null,
      userResimID: response.resimId ?? null,
      userUnvan: response.KLL_UNVAN ?? null,
    };

    if (remember) {
      localStorage.setItem("token", response.AUTH_TOKEN);
      localStorage.setItem("user", JSON.stringify(userInfo));
      localStorage.setItem("login", JSON.stringify(response));
    } else {
      sessionStorage.setItem("token", response.AUTH_TOKEN);
      sessionStorage.setItem("user", JSON.stringify(userInfo));
      sessionStorage.setItem("login", JSON.stringify(response));
    }
  }, [setUser]);

  const completeMicrosoftLogin = useCallback(async (accessToken, remember = true) => {
    setMicrosoftLoading(true);

    try {
      const response = await AxiosInstance.post("/MicrosoftLogin", {
        AccessToken: accessToken,
      });

      if (response?.AUTH_TOKEN) {
        handleSuccessfulLogin(response, remember);
        message.success(t("islemBasarili"));
        navigate("/", { replace: true });
        return;
      }

      message.error(t("microsoftGirisBasarisiz"));
    } catch (error) {
      console.error("Microsoft login error:", error);
      message.error(t("microsoftGirisHata"));
    } finally {
      setMicrosoftLoading(false);
    }
  }, [handleSuccessfulLogin, navigate, t]);

  const handleMicrosoftRedirect = useCallback(async () => {
    setMicrosoftLoading(true);
    try {
      const redirectUri = `${window.location.origin}/auth`;
      const response = await AxiosInstance.get(`/GetMicrosoftLoginUrl?redirectUri=${encodeURIComponent(redirectUri)}`);

      if (response?.url) {
        window.location.href = response.url;
        return;
      }

      message.error(t("microsoftYonlendirmeAlinamadi"));
    } catch (error) {
      console.error("Microsoft redirect url error:", error);
      message.error(t("microsoftYonlendirmeAlinamadi"));
    } finally {
      setMicrosoftLoading(false);
    }
  }, [t]);

  useEffect(() => {
    const refreshEntraStatus = async () => {
      try {
        const response = await AxiosInstance.get("/VeritabaniBaglantiKontrol");
        const status = response?.isEntraID === true;
        setIsEntraID(status);
        localStorage.setItem("isEntraID", JSON.stringify(status));
      } catch (error) {
        console.error("VeritabaniBaglantiKontrol error:", error);
      }
    };

    refreshEntraStatus();
  }, []);

  useEffect(() => {
    const hash = window.location.hash;
    if (!hash) {
      return;
    }

    const hashParams = new URLSearchParams(hash.replace(/^#/, ""));
    const microsoftToken = hashParams.get("id_token") || hashParams.get("access_token");

    if (!microsoftToken) {
      return;
    }

    // Token tekrar işlenmesin diye hash'i temizliyoruz.
    window.history.replaceState({}, document.title, `${window.location.pathname}${window.location.search}`);

    const remember = form.getFieldValue("remember") ?? true;
    completeMicrosoftLogin(microsoftToken, remember);
  }, [completeMicrosoftLogin, form]);

  // Lisans kontrolü fonksiyonu
  const checkLicense = async () => {
    try {
      const response = await AxiosInstance.get("/GetEndDate");

      if (response && response.length > 0) {
        const endDate = new Date(response[0].ISL_DONEM_BITIS);
        const currentDate = new Date();

        // Tarihleri karşılaştır (sadece tarih kısmını, saat kısmını göz ardı et)
        const endDateOnly = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
        const currentDateOnly = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());

        // Eğer mevcut tarih, bitiş tarihinden sonraysa lisans süresi bitmiştir
        if (currentDateOnly > endDateOnly) {
          setLicenseModalVisible(true);
          return false; // Lisans süresi bitmiş
        }

        return true; // Lisans geçerli
      }

      // Response boşsa veya beklenmeyen formattaysa, güvenlik için false döndür
      return false;
    } catch (error) {
      console.error("License check error:", error);
      // Lisans kontrolünde hata olursa, güvenlik için false döndür
      return false;
    }
  };

  const onSubmit = async (values) => {
    if (isRecaptchaEnabled && !recaptchaToken) {
      message.error("Lütfen reCAPTCHA doğrulamasını tamamlayın.");
      return;
    }

    console.log("Received values of form: ", values);
    setLoading(true);

    try {
      // İlk önce lisans kontrolü yap
      const isLicenseValid = await checkLicense();

      if (!isLicenseValid) {
        setLoading(false);
        return; // Lisans geçersizse giriş işlemini durdur
      }

      // Lisans geçerliyse normal giriş işlemine devam et
      const payload = {
        KLL_KOD: values.email,
        KLL_SIFRE: values.password ?? "",
        recaptchaToken: isRecaptchaEnabled ? recaptchaToken : null, // reCAPTCHA token'ı payload'a ekleyin
      };

      const response = await AxiosInstance.post("/login", payload);
      if (response.status_code === 401) {
        message.error("Kullanıcı adı ve ya şifre yanlıştır");
        return;
      } else if (response.AUTH_TOKEN) {
        handleSuccessfulLogin(response, values.remember);

        const anar = localStorage.getItem("login") || sessionStorage.getItem("login");
        console.log(anar);
        message.success("Giriş başarılı!");
        navigate("/", { replace: true });
      } else {
        message.error("Giriş başarısız!");
        console.error("Token not received from API");
      }
    } catch (error) {
      console.error("Login error:", error);
      message.error("Giriş işlemi sırasında bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  const handleClearBaseURL = () => {
    localStorage.removeItem("baseURL");
    localStorage.removeItem("isEntraID");
    window.location.reload();
  };

  if (token) {
    return null; // Ekranın anlık görünmesini engellemek için boş render
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        width: "400px",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div style={{ width: "100%" }}>
        <div style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <Text style={{ fontSize: "20px" }}>{t("girisYap")}</Text>
          <LanguageSelectbox />
        </div>

        <Form form={form} name="normal_login" className="login-form" initialValues={{ remember: true }} onFinish={onSubmit} style={{ width: "100%", marginTop: "20px" }}>
          <Form.Item name="email" rules={[{ required: true, message: "Lütfen kullanıcı kodunuzu girin!" }]}>
            <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder={t("kullaniciKodu")} />
          </Form.Item>
          <Form.Item name="password">
            <Input.Password
              prefix={<LockOutlined className="site-form-item-icon" />}
              placeholder={t("sifre")}
              iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
            />
          </Form.Item>
          <Form.Item name="remember" valuePropName="checked" label={null}>
            <Checkbox>{t("beniHatirla")}</Checkbox>
          </Form.Item>
          {isRecaptchaEnabled && (
            <Form.Item>
              <ReCAPTCHA
                sitekey="6LdF_QAqAAAAAK7vusKLAVNVvf4o_vLu66azz_S8" // Google reCAPTCHA site anahtarınızı buraya ekleyin
                onChange={(token) => setRecaptchaToken(token)}
                hl={i18n.language} // Set language based on i18n
              />
            </Form.Item>
          )}
          <Form.Item>
            <Button type="primary" htmlType="submit" className="login-form-button" style={{ width: "100%" }} disabled={loading || microsoftLoading}>
              {loading ? <Spin /> : t("girisYap")}
            </Button>
          </Form.Item>
          {isEntraID && (
            <Form.Item>
              <Button onClick={handleMicrosoftRedirect} style={{ width: "100%" }} disabled={loading || microsoftLoading}>
                {microsoftLoading ? <Spin /> : t("microsoftIleGirisYap")}
              </Button>
            </Form.Item>
          )}
          <Form.Item>
            <Button danger onClick={handleClearBaseURL} style={{ width: "100%" }} disabled={loading || microsoftLoading}>
              {t("anahtariDegistir")}
            </Button>
          </Form.Item>
        </Form>
      </div>

      {/* Lisans Süresi Bitmiş Modal */}
      <Modal
        title="Sözleşme Süreniz Sona Erdi..!"
        open={licenseModalVisible}
        onCancel={() => setLicenseModalVisible(false)}
        footer={[
          <Button key="ok" type="primary" onClick={() => setLicenseModalVisible(false)}>
            Tamam
          </Button>,
        ]}
        centered
        width={500}
      >
        <div style={{ padding: "1px 0", lineHeight: "1.6" }}>
          <p>
            PBT PRO yazılımına erişiminiz, sözleşme sürenizin sona ermesi nedeniyle geçici olarak durdurulmuştur. Sisteme yeniden erişim sağlayabilmek için sözleşmenizi yenilemeniz
            gerekmektedir.
          </p>
          <p>
            Detaylı bilgi ve yenileme işlemleri için lütfen Orjin Yazılım ile iletişime geçin:{" "}
            <a href="mailto:destek@orjin.net" style={{ color: "#1890ff", fontWeight: "bold" }}>
              destek@orjin.net
            </a>
          </p>
        </div>
      </Modal>
    </div>
  );
}
