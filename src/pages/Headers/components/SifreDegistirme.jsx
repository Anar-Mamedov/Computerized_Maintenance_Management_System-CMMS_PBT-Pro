import React, { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Form,
  Input,
  message,
  Modal,
  Progress,
  Typography,
} from "antd";
import { InfoCircleTwoTone } from "@ant-design/icons";
import { useAppContext } from "../../../AppContext.jsx";
import {
  Controller,
  useForm,
  FormProvider,
  useFormContext,
} from "react-hook-form";
import AxiosInstance from "../../../api/http.jsx";
import dayjs from "dayjs";

const { Text } = Typography;
const { TextArea } = Input;

const SifreDegistirme = ({ accountEditModalOpen, accountEditModalClose }) => {
  const { userData1 } = useAppContext(); // AppContext'ten userData1 değerini alın
  const { setIsButtonClicked } = useAppContext(); // AppContext'ten setIsButtonClicked fonksiyonunu alın
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm();
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [isStrongPasswordRequired, setIsStrongPasswordRequired] =
    useState(true);
  const [mesaj, setMesaj] = useState("");
  const [errorMessageShow, setErrorMessageShow] = useState(false);

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
    if (!password) return 0; // Eğer password undefined ise, 0 döndür
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
      const response = await AxiosInstance.post(
        `UpdateUserPass?oldPass=${encodeURIComponent(
          data.oldPassword
        )}&updatePass=${encodeURIComponent(data.newPassword)}`
      );
      console.log("Data sent successfully:", response);
      if (response.status_code === 200 || response.status_code === 201) {
        message.success("Şifre Güncellendi.");
        reset(); // Reset form fields
        setIsButtonClicked((prev) => !prev); // Başarılı yüklemeden sonra resim listesini yenile
        accountEditModalClose(); // Modal'ı kapat
      } else if (response.status_code === 401) {
        message.error("Bu işlemi yapmaya yetkiniz bulunmamaktadır.");
      } else {
        message.error("Eski Şifrenizi Yanlış Girdiniz.");
      }
    } catch (error) {
      message.error("Error changing password");
    }
  };

  useEffect(() => {
    if (!accountEditModalOpen) {
      reset();
    }
  }, [accountEditModalOpen, reset]);

  useEffect(() => {
    if (userData1?.KLL_NEW_USER === true) {
      setErrorMessageShow(true);
      setMesaj(
        "İlk girişiniz olduğu için şifrenizi güncellemeniz gerekmektedir."
      );
    } else if (userData1?.KLL_NEW_USER === false) {
      setErrorMessageShow(true);
      setMesaj("Şifrenizin süresi dolmuştur lütfen şifrenizi güncelleyiniz");
    } else {
      setErrorMessageShow(false);
      setMesaj("");
    }
  }, [userData1]);

  return (
    <Modal
      title={
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <InfoCircleTwoTone />
          <Text>Şifre Güncelleme</Text>
        </div>
      }
      open={accountEditModalOpen}
      // onCancel={accountEditModalClose}
      width={500}
      centered
      closable={false} // "X" düğmesini gizler
      footer={false} // Sadece "Tamam" düğmesini gösterir
    >
      <Form onFinish={handleSubmit(onSubmit)}>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          <div style={{ width: "100%" }}>
            {errorMessageShow ? (
              <Alert
                key="alert"
                style={{ fontWeight: 500, color: "red", textAlign: "left" }}
                message={mesaj}
                type="error"
                showIcon
              />
            ) : null}
          </div>
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
                if (value === watch("oldPassword")) {
                  return "Yeni şifre, eski şifreyle aynı olamaz.";
                }
                if (isStrongPasswordRequired) {
                  const hasUpperCase = /[A-Z]/.test(value);
                  const hasLowerCase = /[a-z]/.test(value);
                  const hasNumber = /\d/.test(value);
                  const hasSpecialChar =
                    /[^A-Za-z0-9 `!@$%^*()_+\-={};"|,.<>?~/':§]/.test(value);
                  const hasMinLength = value.length >= 8;
                  return (
                    (hasUpperCase &&
                      hasLowerCase &&
                      hasNumber &&
                      !hasSpecialChar &&
                      hasMinLength) ||
                    "Şifreniz en az 8 karakter uzunluğunda olmalı, büyük ve küçük harfler, rakam ve belirtilen özel karakterler ( `!@$%^*()_+\\-={};\"|,.<>?~/':§) dışında herhangi bir özel karakter içermemelidir."
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
      </Form>
    </Modal>
  );
};
export default SifreDegistirme;
