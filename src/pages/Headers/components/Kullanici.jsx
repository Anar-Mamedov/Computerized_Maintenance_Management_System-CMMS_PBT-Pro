import React, { useEffect, useState } from "react";
import { Avatar, Space, Button, Popover, Typography, Spin } from "antd";
import { UserOutlined, LogoutOutlined, EditOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil"; // useRecoilValue import edin
import { userState, authTokenState } from "../../../state/userState"; // Atomlarınızın yolunu güncelleyin
import AxiosInstance from "../../../api/http";
import { useAppContext } from "../../../AppContext";
import HesapBilgileriDuzenle from "./HesapBilgileriDuzenle.jsx";
import SifreDegistirme from "./SifreDegistirme.jsx"; // AppContext'ten useAppContext hook'unu alın

const { Text, Link } = Typography;

export default function Header() {
  const [open, setOpen] = useState(false);
  const userData = useRecoilValue(userState); // userState atomunun değerini oku
  const { isButtonClicked, setIsButtonClicked } = useAppContext(); // AppContext'ten isButtonClicked ve setIsButtonClicked'i alın
  const { userData1, setUserData1 } = useAppContext(); // AppContext'ten userData1 ve setUserData1'i alın
  const [imageUrl, setImageUrl] = useState(null); // Resim URL'sini saklamak için state tanımlayın
  const [loadingImage, setLoadingImage] = useState(false); // Yükleme durumu için yeni bir state
  const [isModalVisible, setIsModalVisible] = useState(false); // Modal'ın görünürlüğünü kontrol etmek için state
  const [isModalVisible2, setIsModalVisible2] = useState(false); // Modal'ın görünürlüğünü kontrol etmek için state
  const [passwordExpiryTime, setPasswordExpiryTime] = useState(null); // Şifre değiştirme süresi için state tanımlayın

  const handleOpenChange = (newOpen) => {
    setOpen(newOpen);
  };
  const navigate = useNavigate(); // useNavigate hook'unu kullanarak `navigate` fonksiyonunu al

  // Çıkış işlevini tanımla
  const handleLogout = () => {
    localStorage.removeItem("token"); // localStorage'dan token'i sil
    sessionStorage.removeItem("token"); // sessionStorage'dan token'i sil
    localStorage.removeItem("user"); // localStorage'dan kullanıcıyı sil
    sessionStorage.removeItem("user"); // sessionStorage'dan kullanıcıyı sil
    localStorage.removeItem("login"); // localStorage'dan login'i sil
    sessionStorage.removeItem("login"); // sessionStorage'dan login'i sil
    navigate("/auth"); // `/login` sayfasına yönlendir
    // window.location.reload(); // Sayfayı yenile
  };

  const fetchUserData = async () => {
    try {
      const response = await AxiosInstance.get("GetKullaniciProfile");
      setUserData1(response[0]); // API'den gelen veriyi setUserData1 ile güncelleyin
      if (response[0]?.KLL_NEW_USER === true) {
        setIsModalVisible2(true); // Kullanıcıya göre butonu gizle
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };
  const fetchUserData1 = async () => {
    try {
      const response = await AxiosInstance.get("GetPassExTime");
      setPasswordExpiryTime(response); // API'den gelen veriyi setUserData1 ile güncelleyin
      if (passwordExpiryTime > 0) {
        const changeDate = new Date(userData1?.KLL_DEGISTIRME_TARIH);
        const now = new Date();
        const timeDifference = now.getTime() - changeDate.getTime(); // milisaniye cinsinden süre farkı
        const timeDifferenceInDays = timeDifference / (1000 * 60 * 60 * 24); // süre farkını gün cinsine çevir

        const passwordExpiryTimeInDays = passwordExpiryTime * 30; // passwordExpiryTime'ı aydan güne çevir

        if (timeDifferenceInDays >= passwordExpiryTimeInDays) {
          setIsModalVisible2(true); // Kullanıcıya göre butonu göster
        }
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    // userData1 verisini API'den alın
    fetchUserData();
  }, [setUserData1]);

  useEffect(() => {
    // passwordExpiryTime verisini API'den alın
    fetchUserData1();
  }, [passwordExpiryTime]);

  useEffect(() => {
    if (isButtonClicked) {
      fetchUserData();
      setIsButtonClicked(false); // API çağrısı yapıldıktan sonra durumu resetleyin
    }
  }, [isButtonClicked, setIsButtonClicked]);

  useEffect(() => {
    if (!userData1?.PRS_RESIM_ID) {
      setImageUrl(null);
    }
  }, [userData1]);

  useEffect(() => {
    // userData.userResimID değeri gelene kadar bekler
    if (userData1?.PRS_RESIM_ID !== undefined) {
      const fetchImage = async () => {
        try {
          setLoadingImage(true); // Resim yüklenmeye başladığında loadingImage'i true yap
          // responseType olarak 'blob' seçilir.
          const response = await AxiosInstance.get(`ResimGetirById?id=${userData1?.PRS_RESIM_ID}`, {
            responseType: "blob",
          });
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

  const showModal = () => {
    setIsModalVisible(true); // Modal'ı göster
  };

  const content = (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        alignItems: "flex-start",
      }}
    >
      <div style={{ display: "flex", gap: "5px", cursor: "pointer" }} onClick={() => navigate("/User")}>
        <UserOutlined style={{ fontSize: "12px" }} />
        Profil
      </div>
      {/*<div*/}
      {/*  style={{ display: "flex", gap: "5px", cursor: "pointer" }}*/}
      {/*  onClick={showModal}*/}
      {/*>*/}
      {/*  <EditOutlined style={{ fontSize: "12px" }} />*/}
      {/*  Hesabı Düzenle*/}
      {/*</div>*/}
      {/* Çıkış düğmesine onClick olayı ekle */}
      <div style={{ display: "flex", gap: "5px", cursor: "pointer" }} onClick={handleLogout}>
        <LogoutOutlined style={{ fontSize: "12px" }} />
        Çıkış
      </div>
    </div>
  );

  return (
    <div>
      <Popover placement="bottom" content={content} trigger="click" open={open} onOpenChange={handleOpenChange}>
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
            <Text style={{ fontWeight: "500" }}>{userData1?.KLL_TANIM || "Bilinmiyor"}</Text>
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

          <HesapBilgileriDuzenle
            accountEditModalOpen={isModalVisible}
            accountEditModalClose={() => {
              setIsModalVisible(false);
            }}
          />
        </div>
      </Popover>
      <SifreDegistirme
        accountEditModalOpen={isModalVisible2}
        accountEditModalClose={() => {
          setIsModalVisible2(false);
        }}
      />
    </div>
  );
}
