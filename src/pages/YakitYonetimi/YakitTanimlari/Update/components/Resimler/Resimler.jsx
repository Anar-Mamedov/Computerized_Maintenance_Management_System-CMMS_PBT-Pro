import React, { useEffect, useState } from "react";
import { Image, Spin, Upload, message, Popconfirm, Button } from "antd";
import { InboxOutlined, UserOutlined, QuestionCircleOutlined, CloseOutlined } from "@ant-design/icons";
import { useFormContext } from "react-hook-form";
import AxiosInstance from "../../../../../../api/http";
import { t } from "i18next";

const imageCardStyle = {
  position: "relative",
  display: "inline-flex",
  margin: "10px",
};

const imageStyle = {
  height: "150px",
  width: "150px",
  objectFit: "cover",
};

const deleteButtonStyle = {
  position: "absolute",
  top: 6,
  right: 6,
  zIndex: 2,
  minWidth: 24,
  width: 24,
  height: 24,
  padding: 0,
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "#ff4d4f",
  borderColor: "#ff4d4f",
};

// onImagesChange prop'u eksikti, ekledik
const ResimUpload = ({ selectedRowID, onImagesChange }) => {
  const { watch } = useFormContext();
  const [imageUrls, setImageUrls] = useState([]); // Artık [{id: 1, url: '...'}, ...] formatında tutacağız
  const [loadingImages, setLoadingImages] = useState(false);
  const [refreshImages, setRefreshImages] = useState(false);
  const [deletingImageId, setDeletingImageId] = useState(null);

  const kapali = watch("kapali");

  const fetchResimIds = async () => {
    try {
      setLoadingImages(true);
      const [resimIDler] = await Promise.all([
        AxiosInstance.get(`GetResimIds?RefId=${selectedRowID}&RefGrup=YAKIT`),
      ]);

      const urls = await Promise.all(
        resimIDler.map(async (id) => {
          const resimResponse = await AxiosInstance.get(`ResimGetirById?id=${id}`, {
            responseType: "blob",
          });
          // Hem ID'yi hem de oluşturulan URL'i obje olarak dönüyoruz
          return {
            id: id,
            url: URL.createObjectURL(resimResponse),
          };
        })
      );
      setImageUrls(urls);
    } catch (error) {
      console.error("Resim ID'leri alınırken bir hata oluştu:", error);
      message.error("Resimler yüklenirken bir hata oluştu.");
    } finally {
      setLoadingImages(false);
    }
  };

  useEffect(() => {
    if (selectedRowID) {
      fetchResimIds();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedRowID, refreshImages]);

  const draggerProps = {
    name: "file",
    multiple: true,
    showUploadList: false,
    beforeUpload: (file) => {
      const formData = new FormData();
      formData.append("file", file);
      AxiosInstance.post(`UploadPhoto?refid=${selectedRowID}&refgrup=YAKIT`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
        .then(() => {
          message.success(`${file.name} başarıyla yüklendi.`);
          setRefreshImages((prev) => !prev);
        })
        .catch(() => {
          message.error(`${file.name} yükleme sırasında bir hata oluştu.`);
        });

      return false;
    },
    onDrop: (e) => {
      console.log("Dropped files", e.dataTransfer.files);
    },
  };

  // Parametre ismini karışıklık olmasın diye resimId yaptık
  const handleDeleteImage = async (resimId) => {
  try {
    setDeletingImageId(resimId);
    
    // API isteği
    const response = await AxiosInstance.get(`ResimSil?resimID=${resimId}`);
    if (response && (response.Durum === true || response.data?.Durum === true)) {
      message.success(t("islemBasarili"));
      setRefreshImages((prev) => !prev);
      
      if (onImagesChange) {
        onImagesChange();
      }
    } else {
      const errorMsg = response?.Aciklama || response?.data?.Aciklama || t("islemBasarisiz");
      message.error(errorMsg);
    }
  } catch (error) {
    console.error("Resim silinirken bir hata oluştu:", error);
    message.error(t("islemBasarisiz"));
  } finally {
    setDeletingImageId(null);
  }
};

  return (
    <div>
      {loadingImages ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: "10px",
          }}
        >
          <Spin />
        </div>
      ) : (
        imageUrls.map((img) => (
          <div key={img.id} style={imageCardStyle}>
            {!kapali ? (
              <Popconfirm
                title={t("silmeOnayBaslik")}
                description={t("silmeOnayMesaj")}
                onConfirm={() => handleDeleteImage(img.id)}
                okText={t("globalYes")}
                cancelText={t("globalNo")}
                icon={<QuestionCircleOutlined style={{ color: "red" }} />}
              >
                <Button
                  type="primary"
                  danger
                  icon={<CloseOutlined />}
                  loading={deletingImageId === img.id}
                  style={deleteButtonStyle}
                />
              </Popconfirm>
            ) : null}
            <Image style={imageStyle} src={img.url} fallback={<UserOutlined />} />
          </div>
        ))
      )}
      <Upload.Dragger disabled={kapali} {...draggerProps}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">Tıklayın veya bu alana dosya sürükleyin</p>
        <p className="ant-upload-hint">
          Tek seferde bir veya birden fazla dosya yüklemeyi destekler.
        </p>
      </Upload.Dragger>
    </div>
  );
};

export default ResimUpload;