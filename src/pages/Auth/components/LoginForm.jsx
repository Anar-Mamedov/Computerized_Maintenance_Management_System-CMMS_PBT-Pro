import React, { useState } from "react";
import { Button, Form, Input, Typography, message, Spin, Checkbox } from "antd";
import { UserOutlined, LockOutlined, EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import AxiosInstance from "../../../api/http";
import { useSetRecoilState } from "recoil";
import { userState, authTokenState } from "../../../state/userState";
import { t } from "i18next";
import LanguageSelectbox from "../../components/Language/LanguageSelectbox";
import ReCAPTCHA from "react-google-recaptcha"; // reCAPTCHA bileşenini import edin
import { useTranslation } from "react-i18next";

const { Text } = Typography;

export default function LoginForm() {
  const navigate = useNavigate();
  const setUser = useSetRecoilState(userState);
  const { t, i18n } = useTranslation(); // Initialize useTranslation
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState(null); // reCAPTCHA token'ı için state

  const onSubmit = async (values) => {
    if (!recaptchaToken) {
      message.error("Lütfen reCAPTCHA doğrulamasını tamamlayın.");
      return;
    }

    console.log("Received values of form: ", values);
    setLoading(true);
    try {
      const payload = {
        KLL_KOD: values.email,
        KLL_SIFRE: values.password ?? "",
        recaptchaToken, // reCAPTCHA token'ı payload'a ekleyin
      };

      const response = await AxiosInstance.post("/login", payload);
      if (response.status_code === 401) {
        message.error("Kullanıcı adı ve ya şifre yanlıştır");
        return;
      } else if (response.AUTH_TOKEN) {
        setUser({
          userId: response.TB_KULLANICI_ID,
          userName: response.KLL_TANIM,
          userResimID: response.resimId,
          userUnvan: response.KLL_UNVAN,
        });
        const login = {
          "": true,
          Dashboard: response.KLL_WEB_DASHBOARD,
          makine: response.KLL_WEB_MAKINE,
          ekipmanVeritabani: response.KLL_WEB_EKIPMAN,
          sayacGuncelleme: response.KLL_WEB_SAYAC,
          bakimTanimlari: response.KLL_WEB_BAKIM,
          arizaTanimlari: response.KLL_WEB_ARIZA,
          isEmri1: response.KLL_WEB_ISEMRI,
          periyodikBakimlar: response.KLL_WEB_PBAKIM,
          otomatikIsEmirleri: response.KLL_WEB_OTOIS,
          planlamaTakvimi: response.KLL_WEB_PTAKVIM,
          atolye: response.KLL_WEB_ATOLYE,
          personeltanimlari: response.KLL_WEB_PERTANIM,
          personelIzinleri: response.KLL_WEB_PERIZIN,
          personelNobetleri: response.KLL_WEB_PERNOBET,
          personelCalismaPLani: response.KLL_WEB_PERPLAN,
          isTalepleri: response.KLL_ISTALEBI_KUL,
          isTalebiKullanicilari: response.KLL_WEB_ISTKUL,
          raporYonetimi: response.KLL_WEB_RAPOR,
          analizler: response.KLL_WEB_RAPOR,
          formYonetimi: response.KLL_WEB_FORM,
          lokasyon: response.KLL_WEB_LOKASYON,
          vardiyalar: response.KLL_WEB_VARDIYA,
          kodYonetimi: response.KLL_WEB_KOD,
          otomatikKodlar: response.KLL_WEB_OTOKOD,
          servisOncelikSeviyeleri: response.KLL_WEB_SERVIS,
          isEmriTipleri: response.KLL_WEB_ISEMRITIP,
          onayIslemleri: response.KLL_WEB_ONAY,
          onayTanimlari: response.KLL_WEB_ONAY,
          rolTanimlari: response.KLL_WEB_ONAY,
          onaylayicilar: response.KLL_WEB_ONAY,
          projeTanimlari: response.KLL_WEB_PROJE,
          mudaheleSuresi: response.KLL_WEB_RAPOR,
          kullaniciTanimlari: response.KLL_WEB_RAPOR,
          RolTanimlari1: response.KLL_WEB_RAPOR,
          Ayarlar: response.KLL_WEB_RAPOR,
          malzemeTanimi: response.KLL_WEB_RAPOR,
          malzemeDepolari: response.KLL_WEB_RAPOR,
          malzemeGirisFisi: response.KLL_WEB_RAPOR,
          malzemeCikisFisi: response.KLL_WEB_RAPOR,
          malzemeTransferFisi: response.KLL_WEB_RAPOR,
          stokSayimlari: response.KLL_WEB_RAPOR,
          hizliMaliyetlendirme: response.KLL_WEB_RAPOR,
          malzemeTransferOnayIslemleri: response.KLL_WEB_RAPOR,
        };
        const userInfo = {
          userId: response.TB_KULLANICI_ID ?? null,
          userName: response.KLL_TANIM ?? null,
          userResimID: response.resimId ?? null,
          userUnvan: response.KLL_UNVAN ?? null,
          /* kullaniciName: response.KLL_PERSONEL?.PRS_ISIM ?? null,
          kullaniciID: response.KLL_PERSONEL?.TB_PERSONEL_ID ?? null,
          kullaniciLokasyon: response.KLL_PERSONEL?.PRS_LOKASYON ?? null,
          kullaniciLokasyonID: response.KLL_PERSONEL?.PRS_LOKASYON_ID ?? null,
          kullaniciDepartman: response.KLL_PERSONEL?.PRS_DEPARTMAN ?? null,
          kullaniciDepartmanID: response.KLL_PERSONEL?.PRS_DEPARTMAN_ID ?? null,
          kullaniciEmail: response.KLL_PERSONEL?.PRS_EMAIL ?? null,
          kullaniciTelefon: response.KLL_PERSONEL?.PRS_TELEFON ?? null, */
        };
        if (values.remember) {
          localStorage.setItem("token", response.AUTH_TOKEN);
          localStorage.setItem("user", JSON.stringify(userInfo));
          localStorage.setItem("login", JSON.stringify(login));
        } else {
          sessionStorage.setItem("token", response.AUTH_TOKEN);
          sessionStorage.setItem("user", JSON.stringify(userInfo));
          sessionStorage.setItem("login", JSON.stringify(login));
        }

        const anar = localStorage.getItem("login") || sessionStorage.getItem("login");
        console.log(anar);
        message.success("Giriş başarılı!");
        navigate("/");
        window.location.reload();
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
    window.location.reload();
  };

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

        <Form name="normal_login" className="login-form" initialValues={{ remember: true }} onFinish={onSubmit} style={{ width: "100%", marginTop: "20px" }}>
          <Form.Item name="email" rules={[{ required: true, message: "Lütfen kullanıcı kodunuzu girin!" }]}>
            <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder={t("kullaniciKodu")} />
          </Form.Item>
          <Form.Item name="password">
            <Input.Password
              prefix={<LockOutlined className="site-form-item-icon" />}
              type={showPassword ? "text" : "password"}
              placeholder={t("sifre")}
              iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
            />
          </Form.Item>
          <Form.Item name="remember" valuePropName="checked" label={null}>
            <Checkbox>{t("beniHatirla")}</Checkbox>
          </Form.Item>
          <Form.Item>
            <ReCAPTCHA
              sitekey="6LdF_QAqAAAAAK7vusKLAVNVvf4o_vLu66azz_S8" // Google reCAPTCHA site anahtarınızı buraya ekleyin
              onChange={(token) => setRecaptchaToken(token)}
              hl={i18n.language} // Set language based on i18n
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" className="login-form-button" style={{ width: "100%" }} disabled={loading}>
              {loading ? <Spin /> : t("girisYap")}
            </Button>
          </Form.Item>
          <Form.Item>
            <Button danger onClick={handleClearBaseURL} style={{ width: "100%" }}>
              {t("anahtariDegistir")}
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
