import React, { useState } from "react";
import { Button, Form, Input, Space, Typography, message, Spin } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import AxiosInstance from "../../../api/http";
import { useSetRecoilState } from "recoil";
import { userState, authTokenState } from "../../../state/userState";

const { Text, Link } = Typography;

export default function LoginForm() {
  const navigate = useNavigate();
  const setUser = useSetRecoilState(userState);
  // const setAuthToken = useSetRecoilState(authTokenState);
  const [loading, setLoading] = useState(false); // Yükleme durumunu takip eden durum değişkeni

  const onSubmit = async (values) => {
    console.log("Received values of form: ", values);
    setLoading(true); // API isteği başladığında yükleme durumunu true yap
    try {
      // Constructing payload with the structure { KLL_KOD: "", KLL_SIFRE: "" }
      const payload = {
        KLL_KOD: values.email,
        KLL_SIFRE: values.password ?? "",
      };

      // Sending the login request
      const response = await AxiosInstance.post("/login", payload);

      // Assuming the token is in the response data with the key 'token'
      if (response && response.AUTH_TOKEN) {
        // setAuthToken(response.data.AUTH_TOKEN); // Auth token'ı Recoil state'ine kaydet
        setUser({
          userId: response.TB_KULLANICI_ID,
          userName: response.KLL_TANIM,
          userResimID: response.resimId,
          userUnvan: response.KLL_UNVAN,
        }); // Kullanıcı bilgilerini Recoil state'ine kaydet
        localStorage.setItem("token", response.AUTH_TOKEN);
        // Kullanıcı bilgilerini localStorage'a kaydet
        const userInfo = {
          userId: response.TB_KULLANICI_ID,
          userName: response.KLL_TANIM,
          userResimID: response.resimId,
          userUnvan: response.KLL_UNVAN,
        };
        localStorage.setItem("user", JSON.stringify(userInfo));
        // Recoil durumunu güncelleme işlemini App bileşeninde yapabilirsiniz
        message.success("Giriş başarılı!");
        // Optional: Store user ID if available in response
        // localStorage.setItem("userId", response.data.userId);

        navigate("/");
      } else {
        message.error("Giriş başarısız!");
        // Handle case where token is not in response
        console.error("Token not received from API");
      }
    } catch (error) {
      console.error("Login error:", error);
      message.error("Giriş işlemi sırasında bir hata oluştu.");
      // Handle login error (e.g., show an error message)
    } finally {
      setLoading(false); // İşlem bittiğinde yükleme durumunu false yap
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        width: "400px",
        flexDirection: "column",
        alignItems: "center",
      }}>
      <div style={{ width: "100%" }}>
        <Text style={{ fontSize: "20px" }}>Giriş Yap</Text>
        <Form
          name="normal_login"
          className="login-form"
          initialValues={{ remember: true }}
          onFinish={onSubmit}
          style={{ width: "100%", marginTop: "20px" }}>
          <Form.Item name="email" rules={[{ required: true, message: "Lütfen e-posta adresinizi girin!" }]}>
            <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="E-posta" />
          </Form.Item>
          <Form.Item
            name="password"
            // rules={[{ required: true, message: "Lütfen şifrenizi girin!" }]}
          >
            <Input prefix={<LockOutlined className="site-form-item-icon" />} type="password" placeholder="Şifre" />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button"
              style={{ width: "100%" }}
              disabled={loading}>
              {loading ? <Spin /> : "Giriş Yap"}
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
