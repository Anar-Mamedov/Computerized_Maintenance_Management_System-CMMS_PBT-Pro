import React, { useEffect, useState } from "react";
import { Button, Input, Typography, Form, message, Progress } from "antd";
import { useForm, Controller } from "react-hook-form";
import AxiosInstance from "../../../../../api/http.jsx";

const { Text } = Typography;

function ChangePassword(props) {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const [passwordStrength, setPasswordStrength] = useState(0);

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length > 5) strength += 1;
    if (password.length > 7) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[a-z]/.test(password)) strength += 1; // Küçük harf kontrolü
    if (/\d/.test(password)) strength += 1;
    return (strength / 5) * 100; // Toplam koşul sayısı 5 olduğu için bölme işlemi 5'e bölünür
  };

  const newPassword = watch("newPassword");

  useEffect(() => {
    setPasswordStrength(calculatePasswordStrength(watch("newPassword")));
  }, [watch("newPassword")]);

  const onSubmit = async (data) => {
    if (data.newPassword !== data.confirmPassword) {
      message.error("New password and confirm password do not match");
      return;
    }

    try {
      const user = JSON.parse(localStorage.getItem("user"));
      console.log(user.userId);
      const response = await AxiosInstance.post("/change-password", {
        userID: user.userId,
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
      });

      message.success("Password changed successfully");
    } catch (error) {
      message.error("Error changing password");
    }
  };

  return (
    <Form onFinish={handleSubmit(onSubmit)}>
      <div
        style={{
          padding: "0 20px",
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        <Text style={{ fontSize: "16px", fontWeight: "500" }}>
          Şifre Güncelleme
        </Text>
        <div
          style={{
            padding: "20px",
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
            gap: "10px",
            borderRadius: "16px",
            border: "1px solid #e1e1e1",
          }}
        >
          <Controller
            name="oldPassword"
            control={control}
            defaultValue=""
            rules={{ required: true }}
            render={({ field }) => (
              <Input.Password {...field} placeholder="Eski Şifreniz" />
            )}
          />
          <Controller
            name="newPassword"
            control={control}
            defaultValue=""
            rules={{ required: true }}
            render={({ field }) => (
              <>
                <Input.Password {...field} placeholder="Yeni Şifreniz" />
              </>
            )}
          />
          <Controller
            name="confirmPassword"
            control={control}
            defaultValue=""
            rules={{ required: true }}
            render={({ field }) => (
              <Input.Password
                {...field}
                placeholder="Yeni Şifrenizi Onaylayın"
              />
            )}
          />

          <Text style={{ fontSize: "14px", fontWeight: "400", color: "#888" }}>
            Şifreniz en az 6 karakter uzunluğunda olmalı, büyük ve küçük harfler
            içermeli ve en az bir rakam içermelidir.
          </Text>
          {newPassword && (
            <Progress
              percent={passwordStrength}
              status={
                passwordStrength < 50
                  ? "exception"
                  : passwordStrength < 100
                  ? "active"
                  : "success"
              }
            />
          )}
          <Button type="primary" htmlType="submit">
            Uygula
          </Button>
        </div>
      </div>
    </Form>
  );
}

export default ChangePassword;
