import React, { useEffect, useState } from "react";
import { Avatar, Spin, Typography, Image, Button, Modal } from "antd";
import { Controller, useFormContext } from "react-hook-form";
import { UserOutlined, EditOutlined, PictureOutlined } from "@ant-design/icons";
import AxiosInstance from "../../../../../api/http.jsx";
import { useRecoilValue } from "recoil";
import { userState } from "../../../../../state/userState.jsx";
import { useAppContext } from "../../../../../AppContext.jsx";
import ResimUpload from "./Resim/ResimUpload.jsx"; // AppContext'i import edin
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
  const { userData1 } = useAppContext(); // AppContext'ten userData1 değerini alın
  const [isModalVisible, setIsModalVisible] = useState(false); // Modal'ın görünürlüğünü kontrol etmek için state
  const [isModalVisible1, setIsModalVisible1] = useState(false); // Modal'ın görünürlüğünü kontrol etmek için state

  const userName = watch("userName");

  console.log(userData1);

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

  // useEffect(() => {
  //   setValue("userName", "Kullanıcı Adı");
  // }, []);
  //
  // useEffect(() => {
  //   console.log(userName);
  // }, [userName]);

  const showModal = () => {
    setIsModalVisible(true); // Modal'ı göster
  };

  const uploadPhoto = () => {
    setIsModalVisible1(true); // Modal'ı göster
  };

  const handleOk = () => {
    setIsModalVisible(false); // Modal'ı kapat
  };

  const handleCancel = () => {
    setIsModalVisible(false); // Modal'ı kapat
  };

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
          <div style={{ position: "relative", width: "84px", height: "84px" }}>
            {imageUrl ? (
              <Image.PreviewGroup>
                <Image
                  width={84}
                  height={84}
                  src={imageUrl}
                  placeholder={loadingImage ? <Spin /> : <UserOutlined />}
                  style={{ borderRadius: "50%", minWidth: "84px" }} // Resmi yuvarlak yap
                />
              </Image.PreviewGroup>
            ) : (
              <Avatar
                style={{ minHeight: "84px", minWidth: "84px" }}
                size={84}
                icon={!loadingImage && <UserOutlined />} // Yükleme olmadığı ve imageUrl yoksa ikonu göster
              >
                {loadingImage && <Spin />}
                {/* Resim yüklenirken Spin göster */}
              </Avatar>
            )}
            <Button
              style={{
                position: "absolute",
                bottom: "0px",
                right: "0px",
              }}
              size={"medium"}
              shape="circle"
              icon={<PictureOutlined />}
              onClick={uploadPhoto}
            />
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column" }}>
              <Text style={{ fontWeight: "500", fontSize: "15px" }}>
                {userData1?.KLL_TANIM || "Bilinmiyor"}
              </Text>
              <Text type="secondary">{userData1?.PRS_UNVAN || ""}</Text>
              <Text type="secondary">{userData1?.PRS_ADRES || ""}</Text>
            </div>
            <Button
              shape="circle"
              icon={<EditOutlined />}
              onClick={showModal}
            />
          </div>
        </div>
      </div>

      <div
        style={{
          borderRadius: "16px",
          border: "1px solid #e1e1e1",
          padding: "10px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "10px",
            justifyContent: "space-between",
          }}
        >
          <Text
            style={{
              fontWeight: "500",
              fontSize: "16px",
              marginBottom: "10px",
            }}
          >
            Kişisel Bilgilerim
          </Text>
          <Button shape="circle" icon={<EditOutlined />} onClick={showModal} />
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gridGap: "10px",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <Text type="secondary">İsim Soyisim</Text>
            <Text>{userData1?.PRS_ISIM || "Bilinmiyor"}</Text>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <Text type="secondary">Kullanici Kodu</Text>
            <Text>{userData1?.KLL_KOD || "Bilinmiyor"}</Text>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <Text type="secondary">E-posta</Text>
            <Text>{userData1?.PRS_EMAIL || "Bilinmiyor"}</Text>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <Text type="secondary">Telefon</Text>
            <Text>{userData1?.PRS_TELEFON || "Bilinmiyor"}</Text>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <Text type="secondary">Dahili</Text>
            <Text>{userData1?.PRS_DAHILI || "Bilinmiyor"}</Text>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <Text type="secondary">Adres</Text>
            <Text>{userData1?.PRS_ADRES || "Bilinmiyor"}</Text>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <Text type="secondary">Açıklama</Text>
            <Text>{userData1?.PRS_ACIKLAMA || "Bilinmiyor"}</Text>
          </div>
        </div>
      </div>
      <Modal
        title="Modal Başlık"
        centered
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <p>Modal içeriği...</p>
      </Modal>

      <Modal
        title="Resim Yükle"
        centered
        open={isModalVisible1}
        onOk={() => setIsModalVisible1(false)}
        onCancel={() => setIsModalVisible1(false)}
        width={800}
      >
        <ResimUpload />
      </Modal>
    </div>
  );
}

export default HesapBilgilerim;
