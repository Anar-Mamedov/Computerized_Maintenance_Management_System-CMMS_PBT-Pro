import React, { useState } from "react";
import { Button, Form, Input, Typography, message, Spin, Checkbox, Modal } from "antd";
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
  const [isRecaptchaEnabled] = useState(true); // Toggle etmek için true/false yapın
  const [licenseModalVisible, setLicenseModalVisible] = useState(false);

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
      console.log("Login API Response:", response);
      // alert(JSON.stringify(response, null, 2));
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
          isTalepleri: response.KLL_ISTALEBI_KUL,
          Dashboard: response.KLL_WEB_DASHBOARD,
          hatirlatici: response.KLL_WEB_HATIR,

          // Ekipman Yönetimi
          makine: response.KLL_WEB_MAKINE,
          ekipmanVeritabani: response.KLL_WEB_EKIPMAN,
          durusTakibi: response.KLL_WEB_EKIPMAN,
          sayacGuncelleme: response.KLL_WEB_SAYAC,
          ekipmanTransferi: response.KLL_WEB_EKIPMAN,

          // Operasyon Yönetimi (KLL_WEB_OPERASYON_MODUL false ise tüm grup gizlenir)
          operasyonYonetimi: response.KLL_WEB_OPERASYON_MODUL ?? true,
          gunlukMakinePuantajGirisi: response.KLL_WEB_OPERASYON_MODUL ?? true,
          aylikMakinePuantajlari: response.KLL_WEB_OPERASYON_MODUL ?? true,
          makinePuantajTakibi: response.KLL_WEB_OPERASYON_MODUL ?? true,
          operasyonTakibi: response.KLL_WEB_OPERASYON_MODUL ?? true,

          // Bakım Yönetimi
          bakimTanimlari: response.KLL_WEB_BAKIM,
          arizaTanimlari: response.KLL_WEB_ARIZA,
          isEmri1: response.KLL_WEB_ISEMRI,
          periyodikBakimlar: response.KLL_WEB_PBAKIM,
          otomatikIsEmirleri: response.KLL_WEB_OTOIS,
          planlamaTakvimi: response.KLL_WEB_PTAKVIM,
          isEmriAnalizi: response.KLL_WEB_ISEMRI,

          // Malzeme & Depo Yönetimi
          malzemeTanimi: response.KLL_WEB_MALZEME,
          malzemeDepolari: response.KLL_WEB_MALDEPO,
          malzemeGirisFisi: response.KLL_WEB_MALGIRIS,
          malzemeCikisFisi: response.KLL_WEB_MALCIKIS,
          malzemeTransferFisi: response.KLL_WEB_TRANSFER,
          stokSayimlariFisListe: response.KLL_WEB_STOKSAY,
          stokSayimlari: response.KLL_WEB_STOKSAY,
          hizliMaliyetlendirme: response.KLL_WEB_HIZLIMAL,
          malzemeTransferOnayIslemleri: response.KLL_WEB_MALTRANSONAY,

          // Personel Yönetimi
          atolye: response.KLL_WEB_ATOLYE,
          personeltanimlari: response.KLL_WEB_PERTANIM,
          personelIzinleri: response.KLL_WEB_PERIZIN,
          personelNobetleri: response.KLL_WEB_PERNOBET,
          personelCalismaPLani: response.KLL_WEB_PERPLAN,
          isTalebiKullanicilari: response.KLL_WEB_ISTKUL,

          // Satınalma Yönetimi (KLL_WEB_SATINALMA_MODUL false ise tüm grup gizlenir)
          satinalmaDashboard: response.KLL_WEB_SATINALMA_MODUL ?? true,
          malzemeTalepleri: response.KLL_WEB_SATINALMA_MODUL ?? true,
          satinalmaSiparisleri: response.KLL_WEB_SATINALMA_MODUL ?? true,
          fiyatTeklifleri: response.KLL_WEB_SATINALMA_MODUL ?? true,
          tedarikciFirmalar: response.KLL_WEB_SATINALMA_MODUL ?? true,

          // Yakıt Yönetimi (KLL_WEB_YAKIT_MODUL false ise tüm grup gizlenir)
          yakitTanimlari: response.KLL_WEB_YAKIT_MODUL ?? true,
          yakitStoklari: response.KLL_WEB_YAKIT_MODUL ?? true,
          yakitGirisleri: response.KLL_WEB_YAKIT_MODUL ?? true,
          yakitHareketleri: response.KLL_WEB_YAKIT_MODUL ?? true,
          hizliYakitGirisi: response.KLL_WEB_YAKIT_MODUL ?? true,

          // Proje Yönetimi (KLL_WEB_PROJE_MODUL false ise tüm grup gizlenir)
          projeTanimlari2: response.KLL_WEB_PROJE_MODUL ?? true,
          projeIlerleme: response.KLL_WEB_PROJE_MODUL ?? true,
          projeYonetimiListe: response.KLL_WEB_PROJE_MODUL ?? true,

          // Analizler
          analizler: response.KLL_WEB_ANALIZ,
          mudaheleSuresi: response.KLL_WEB_MUDANALIZ,
          bakimKpi: true,
          yakitTuketimiAnalizi: true,

          // Rapor & Formlar
          raporYonetimi: response.KLL_WEB_RAPOR,
          formYonetimi: response.KLL_WEB_FORM,

          // Yönetim
          dokumanYonetimi: true,
          resimYonetimi: true,
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
          kullaniciTanimlari: response.KLL_WEB_KULLANICI,
          RolTanimlari1: response.KLL_WEB_ROL,
          Ayarlar: response.KLL_WEB_AYARLAR,

          // Diğer
          yonetimDashboard: true,
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

        console.log("Login data saved:", login);
        console.log("operasyonYonetimi:", login.operasyonYonetimi);
        console.log("KLL_WEB_OPERASYON_MODUL from response:", response.KLL_WEB_OPERASYON_MODUL);
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
