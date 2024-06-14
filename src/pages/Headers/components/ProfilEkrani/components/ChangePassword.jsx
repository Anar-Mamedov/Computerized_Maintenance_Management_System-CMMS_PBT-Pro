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
  const [isStrongPasswordRequired, setIsStrongPasswordRequired] =
    useState(true);

  useEffect(() => {
    const fetchPasswordPolicy = async () => {
      try {
        const response = await AxiosInstance.get("/password-policy-endpoint"); // API endpointinizi buraya girin
        setIsStrongPasswordRequired(response.data.GUCLENDIRILMIS_SIFRE_KULLAN);
      } catch (error) {
        console.error("Error fetching password policy:", error);
      }
    };

    fetchPasswordPolicy();
  }, []);

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
          <Form.Item
            validateStatus={errors.oldPassword ? "error" : ""}
            help={errors.oldPassword ? errors.oldPassword.message : ""}
            style={{
              marginBottom: errors.oldPassword ? "0px" : "0", // Hata olduğunda normal margin, aksi halde 0
            }}
          >
            <Controller
              name="oldPassword"
              control={control}
              defaultValue=""
              rules={{ required: "Alan boş bırakılamaz" }}
              render={({ field }) => (
                <Input.Password {...field} placeholder="Eski Şifreniz" />
              )}
            />
          </Form.Item>

          <Controller
            name="newPassword"
            control={control}
            defaultValue=""
            rules={{
              required: isStrongPasswordRequired
                ? "Alan boş bırakılamaz"
                : "Alan boş bırakılamaz",
              validate: (value) => {
                if (isStrongPasswordRequired) {
                  const hasUpperCase = /[A-Z]/.test(value);
                  const hasLowerCase = /[a-z]/.test(value);
                  const hasNumber = /\d/.test(value);
                  const hasMinLength = value.length >= 8;
                  return (
                    (hasUpperCase &&
                      hasLowerCase &&
                      hasNumber &&
                      hasMinLength) ||
                    "Şifreniz en az 8 karakter uzunluğunda olmalı, büyük ve küçük harfler içermeli ve en az bir rakam içermelidir."
                  );
                } else {
                  return true; // GUCLENDIRILMIS_SIFRE_KULLAN false ise, her türlü şifreyi kabul eder
                }
              },
            }}
            render={({ field }) => (
              <>
                <Form.Item
                  validateStatus={errors.newPassword ? "error" : ""}
                  help={errors.newPassword ? errors.newPassword.message : ""}
                  style={{
                    marginBottom: errors.newPassword ? "0px" : "0", // Hata olduğunda normal margin, aksi halde 0
                  }}
                >
                  <Input.Password {...field} placeholder="Yeni Şifreniz" />
                </Form.Item>
              </>
            )}
          />
          <Form.Item
            validateStatus={errors.confirmPassword ? "error" : ""}
            help={errors.confirmPassword ? errors.confirmPassword.message : ""}
            style={{
              marginBottom: errors.confirmPassword ? "0px" : "0", // Hata olduğunda normal margin, aksi halde 0
            }}
          >
            <Controller
              name="confirmPassword"
              control={control}
              defaultValue=""
              rules={{
                required: "Alan boş bırakılamaz",
                validate: (value) =>
                  value === newPassword ||
                  "Şifreler eşleşmiyor, lütfen kontrol edin.",
              }}
              render={({ field }) => (
                <>
                  <Input.Password
                    {...field}
                    placeholder="Yeni Şifrenizi Onaylayın"
                  />
                </>
              )}
            />
          </Form.Item>
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
