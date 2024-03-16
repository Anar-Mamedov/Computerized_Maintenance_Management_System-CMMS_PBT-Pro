import React, { useEffect, useState } from "react";
import { Avatar, Space, Button, Popover, Typography } from "antd";
import { UserOutlined, LogoutOutlined, EditOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil"; // useRecoilValue import edin
import { userState, authTokenState } from "../../../state/userState"; // Atomlarınızın yolunu güncelleyin
import AxiosInstance from "../../../api/http";

const { Text, Link } = Typography;

export default function Header() {
  const [open, setOpen] = useState(false);
  const userData = useRecoilValue(userState); // userState atomunun değerini oku
  const [imageUrl, setImageUrl] = useState(null); // Resim URL'sini saklamak için state tanımlayın

  const handleOpenChange = (newOpen) => {
    setOpen(newOpen);
  };
  const navigate = useNavigate(); // useNavigate hook'unu kullanarak `navigate` fonksiyonunu al

  // Çıkış işlevini tanımla
  const handleLogout = () => {
    localStorage.removeItem("token"); // localStorage'dan token'i sil
    localStorage.removeItem("user"); // localStorage'dan kullanıcıyı sil
    navigate("/auth"); // `/login` sayfasına yönlendir
    // window.location.reload(); // Sayfayı yenile
  };

  useEffect(() => {
    // responseType olarak 'blob' seçilir.
    AxiosInstance.get(`ResimGetirById?id=${userData.userResimID}`, { responseType: "blob" })
      .then((response) => {
        // Yanıttaki blob verisi bir URL'ye dönüştürülür.
        const imageBlob = response;
        const imageObjectURL = URL.createObjectURL(imageBlob);
        setImageUrl(imageObjectURL);
      })
      .catch((error) => {
        console.error("Error fetching image:", error);
      });

    // Component unmount olduğunda veya resim değiştiğinde oluşturulan URL iptal edilir.
    return () => {
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, []); // Dependency array'e imageUrl eklenir.

  const content = (
    <div>
      <p style={{ display: "flex", gap: "5px" }}>
        <UserOutlined style={{ fontSize: "12px" }} />
        Profil
      </p>
      <p style={{ display: "flex", gap: "5px" }}>
        <EditOutlined style={{ fontSize: "12px" }} />
        Hesabı Düzenle
      </p>
      {/* Çıkış düğmesine onClick olayı ekle */}
      <div style={{ display: "flex", gap: "5px", cursor: "pointer" }} onClick={handleLogout}>
        <LogoutOutlined style={{ fontSize: "12px" }} />
        Çıkış
      </div>
    </div>
  );
  return (
    <Popover placement="bottom" content={content} trigger="click" open={open} onOpenChange={handleOpenChange}>
      <div style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
          <Text style={{ fontWeight: "500" }}>{userData.userName || "Anonim"}</Text>
          <Text type="secondary">{userData.userUnvan || ""}</Text>
        </div>
        <Avatar
          size="large"
          src={imageUrl} // imageUrl state'ini Avatar'ın src propu olarak kullan
          icon={!imageUrl && <UserOutlined />} // Eğer imageUrl yoksa, UserOutlined ikonunu kullan
        />
      </div>
    </Popover>
  );
}
