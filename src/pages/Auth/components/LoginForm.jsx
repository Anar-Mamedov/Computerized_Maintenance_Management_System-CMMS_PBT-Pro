import React, { useState } from "react";
import { Button, Form, Input, Typography, message, Spin } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import AxiosInstance from "../../../api/http";
import { useSetRecoilState } from "recoil";
import { userState, authTokenState } from "../../../state/userState";
import ReCAPTCHA from "react-google-recaptcha"; // reCAPTCHA bileşenini import edin

const { Text } = Typography;

export default function LoginForm() {
  const navigate = useNavigate();
  const setUser = useSetRecoilState(userState);
  const [loading, setLoading] = useState(false);
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

      if (response && response.AUTH_TOKEN) {
        setUser({
          userId: response.TB_KULLANICI_ID,
          userName: response.KLL_TANIM,
          userResimID: response.resimId,
          userUnvan: response.KLL_UNVAN,
        });
        localStorage.setItem("token", response.AUTH_TOKEN);
        const userInfo = {
          userId: response.TB_KULLANICI_ID,
          userName: response.KLL_TANIM,
          userResimID: response.resimId,
          userUnvan: response.KLL_UNVAN,
        };
        localStorage.setItem("user", JSON.stringify(userInfo));
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
          onaylayicilar: response.KLL_WEB_ONAY,
          projeTanimlari: response.KLL_WEB_PROJE,
        };
        localStorage.setItem("login", JSON.stringify(login));
        const anar = localStorage.getItem("login");
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
        <Text style={{ fontSize: "20px" }}>Giriş Yap</Text>
        <Form
          name="normal_login"
          className="login-form"
          initialValues={{ remember: true }}
          onFinish={onSubmit}
          style={{ width: "100%", marginTop: "20px" }}
        >
          <Form.Item
            name="email"
            rules={[
              { required: true, message: "Lütfen kullanıcı kodunuzu girin!" },
            ]}
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="Kullanıcı Kodu"
            />
          </Form.Item>
          <Form.Item name="password">
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Şifre"
            />
          </Form.Item>
          <Form.Item>
            <ReCAPTCHA
              sitekey="6LdF_QAqAAAAAK7vusKLAVNVvf4o_vLu66azz_S8" // Google reCAPTCHA site anahtarınızı buraya ekleyin
              onChange={(token) => setRecaptchaToken(token)}
            />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button"
              style={{ width: "100%" }}
              disabled={loading}
            >
              {loading ? <Spin /> : "Giriş Yap"}
            </Button>
          </Form.Item>
          <Form.Item>
            <Button
              danger
              onClick={handleClearBaseURL}
              style={{ width: "100%" }}
            >
              Anahtarı Değiştir
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
