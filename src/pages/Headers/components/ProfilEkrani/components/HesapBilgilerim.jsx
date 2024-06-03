import React, { useEffect, useState } from "react";
import { Avatar, Spin, Typography } from "antd";
import { Controller, useFormContext } from "react-hook-form";
import { UserOutlined } from "@ant-design/icons";
import AxiosInstance from "../../../../../api/http.jsx";
import { useRecoilValue } from "recoil";
import { userState } from "../../../../../state/userState.jsx";
const { Text } = Typography;

function HesapBilgilerim(props) {
  const {
    control,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();
  const userData = useRecoilValue(userState); // userState atomunun değerini oku
  const [imageUrl, setImageUrl] = useState(null); // Resim URL'sini saklamak için state tanımlayın
  const [loadingImage, setLoadingImage] = useState(false); // Yükleme durumu için yeni bir state

  const userName = watch("userName");

  useEffect(() => {
    // userData.userResimID değeri gelene kadar bekler
    if (userData.userResimID) {
      const fetchImage = async () => {
        try {
          setLoadingImage(true); // Resim yüklenmeye başladığında loadingImage'i true yap
          // responseType olarak 'blob' seçilir.
          const response = await AxiosInstance.get(
            `ResimGetirById?id=${userData.userResimID}`,
            {
              responseType: "blob",
            }
          );
          // Yanıttaki blob verisi bir URL'ye dönüştürülür.
          const imageBlob = response;
          const imageObjectURL = URL.createObjectURL(imageBlob);
          setImageUrl(imageObjectURL);
        } catch (error) {
          console.error("Error fetching image:", error);
        } finally {
          setLoadingImage(false); // Resim yüklendikten sonra veya hata durumunda loadingImage'i false yap
        }
      };

      fetchImage();

      // Component unmount olduğunda veya resim değiştiğinde oluşturulan URL iptal edilir.
      return () => {
        if (imageUrl) {
          URL.revokeObjectURL(imageUrl);
        }
      };
    }
  }, [userData.userResimID]); // Dependency array'e imageUrl eklenir.

  useEffect(() => {
    setValue("userName", "Kullanıcı Adı");
  }, []);

  useEffect(() => {
    console.log(userName);
  }, [userName]);

  return (
    <div
      style={{
        padding: "0 20px",
        display: "flex",
        gap: "10px",
        flexDirection: "column",
      }}
    >
      <Text style={{ fontWeight: "500", fontSize: "16px" }}>
        Hesap Bilgilerim
      </Text>
      <div
        style={{
          borderRadius: "16px",
          border: "1px solid #e1e1e1",
          padding: "10px",
        }}
      >
        <div style={{ display: "flex", gap: "10px" }}>
          <Avatar
            style={{ minHeight: "64px", minWidth: "64px" }}
            size={64}
            src={imageUrl}
            icon={!imageUrl && !loadingImage && <UserOutlined />} // Yükleme olmadığı ve imageUrl yoksa ikonu göster
          >
            {loadingImage && <Spin />}
            {/* Resim yüklenirken Spin göster */}
          </Avatar>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <Text style={{ fontWeight: "500", fontSize: "15px" }}>
              {userData.userName || "Anonim"}
            </Text>
            <Text type="secondary">
              {userData.userUnvan || "Takim Yöneticisi"}
            </Text>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HesapBilgilerim;
