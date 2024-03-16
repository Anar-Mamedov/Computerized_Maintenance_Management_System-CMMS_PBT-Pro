import React, { useState } from "react";
import { Avatar, Space, Button, Popover, Typography } from "antd";
import { UserOutlined, LogoutOutlined, EditOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil"; // useRecoilValue import edin
import { userState, authTokenState } from "../../../state/userState"; // Atomlarınızın yolunu güncelleyin

const { Text, Link } = Typography;

export default function Header() {
  const [open, setOpen] = useState(false);
  const userData = useRecoilValue(userState); // userState atomunun değerini oku

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
          <Text type="secondary">Mühendis</Text>
        </div>
        <Avatar size="large" icon={<UserOutlined />} />
      </div>
    </Popover>
  );
}
