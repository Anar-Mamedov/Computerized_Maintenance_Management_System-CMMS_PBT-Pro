import React, { useEffect, useState } from "react";
import { Avatar, Space, Button, Popover, Typography, Spin } from "antd";
import { UserOutlined, LogoutOutlined, EditOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil"; // useRecoilValue import edin
import { userState, authTokenState } from "../../../state/userState"; // Atomlarınızın yolunu güncelleyin
import AxiosInstance from "../../../api/http";
import { useAppContext } from "../../../AppContext"; // AppContext'ten useAppContext hook'unu alın

const { Text, Link } = Typography;

export default function Header() {
  const [open, setOpen] = useState(false);
  const userData = useRecoilValue(userState); // userState atomunun değerini oku
  const { isButtonClicked, setIsButtonClicked } = useAppContext(); // AppContext'ten isButtonClicked ve setIsButtonClicked'i alın
  const { userData1, setUserData1 } = useAppContext(); // AppContext'ten userData1 ve setUserData1'i alın
  const [imageUrl, setImageUrl] = useState(null); // Resim URL'sini saklamak için state tanımlayın
  const [loadingImage, setLoadingImage] = useState(false); // Yükleme durumu için yeni bir state

  const handleOpenChange = (newOpen) => {
    setOpen(newOpen);
  };
  const navigate = useNavigate(); // useNavigate hook'unu kullanarak `navigate` fonksiyonunu al

  // Çıkış işlevini tanımla
  const handleLogout = () => {
    localStorage.removeItem("token"); // localStorage'dan token'i sil
    localStorage.removeItem("user"); // localStorage'dan kullanıcıyı sil
    localStorage.removeItem("login"); // localStorage'dan login'i sil
    navigate("/auth"); // `/login` sayfasına yönlendir
    // window.location.reload(); // Sayfayı yenile
  };

  const fetchUserData = async () => {
    try {
      const response = await AxiosInstance.get("GetKullaniciProfile");
      setUserData1(response[0]); // API'den gelen veriyi setUserData1 ile güncelleyin
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    // userData1 verisini API'den alın
    fetchUserData();
  }, [setUserData1]);

  useEffect(() => {
    if (isButtonClicked) {
      fetchUserData();
      setIsButtonClicked(false); // API çağrısı yapıldıktan sonra durumu resetleyin
    }
  }, [isButtonClicked, setIsButtonClicked]);

  useEffect(() => {
    // userData.userResimID değeri gelene kadar bekler
    if (userData1?.PRS_RESIM_ID) {
      const fetchImage = async () => {
        try {
          setLoadingImage(true); // Resim yüklenmeye başladığında loadingImage'i true yap
          // responseType olarak 'blob' seçilir.
          const response = await AxiosInstance.get(
            `ResimGetirById?id=${userData1?.PRS_RESIM_ID}`,
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
  }, [userData1?.PRS_RESIM_ID]); // Dependency array'e imageUrl eklenir.

  const content = (
    <div>
      <p
        style={{ display: "flex", gap: "5px", cursor: "pointer" }}
        onClick={() => navigate("/User")}
      >
        <UserOutlined style={{ fontSize: "12px" }} />
        Profil
      </p>
      <p style={{ display: "flex", gap: "5px", cursor: "pointer" }}>
        <EditOutlined style={{ fontSize: "12px" }} />
        Hesabı Düzenle
      </p>
      {/* Çıkış düğmesine onClick olayı ekle */}
      <div
        style={{ display: "flex", gap: "5px", cursor: "pointer" }}
        onClick={handleLogout}
      >
        <LogoutOutlined style={{ fontSize: "12px" }} />
        Çıkış
      </div>
    </div>
  );
  return (
    <Popover
      placement="bottom"
      content={content}
      trigger="click"
      open={open}
      onOpenChange={handleOpenChange}
    >
      <div
        style={{
          display: "flex",
          gap: "10px",
          alignItems: "flex-start",
          cursor: "pointer",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
          }}
        >
          <Text style={{ fontWeight: "500" }}>
            {userData1?.KLL_TANIM || "Bilinmiyor"}
          </Text>
          <Text type="secondary">{userData1?.PRS_UNVAN || ""}</Text>
        </div>
        <Avatar
          size="large"
          src={imageUrl}
          icon={!imageUrl && !loadingImage && <UserOutlined />} // Yükleme olmadığı ve imageUrl yoksa ikonu göster
        >
          {loadingImage && <Spin />}
          {/* Resim yüklenirken Spin göster */}
        </Avatar>
      </div>
    </Popover>
  );
}
