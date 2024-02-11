import React from "react";
import { Button, Form, Input, Space, Typography } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Text, Link } = Typography;

export default function LoginForm() {
  const navigate = useNavigate();

  const onSubmit = (values) => {
    console.log("Received values of form: ", values);

    // api sorgusu
    // successidse
    // localStorage.setItem("token", <apiden gelen token>);
    // localStorage.setItem("userId", <apiden gelen user ID bilgisi>);
    navigate("/");
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
          <Form.Item name="password" rules={[{ required: true, message: "Lütfen şifrenizi girin!" }]}>
            <Input prefix={<LockOutlined className="site-form-item-icon" />} type="password" placeholder="Şifre" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" className="login-form-button" style={{ width: "100%" }}>
              Giriş Yap
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
