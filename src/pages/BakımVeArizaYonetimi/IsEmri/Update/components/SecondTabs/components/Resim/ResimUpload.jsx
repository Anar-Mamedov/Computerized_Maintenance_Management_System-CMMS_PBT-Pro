import React, { useEffect, useState } from "react";
import { Button, Image, Popconfirm, Spin, Upload, message } from "antd";
import { CloseOutlined, InboxOutlined, QuestionCircleOutlined, UserOutlined } from "@ant-design/icons";
import { useFormContext } from "react-hook-form";
import AxiosInstance from "../../../../../../../../api/http";
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

const revokeImageUrls = (items) => {
  items.forEach((item) => {
    if (item?.url) {
      URL.revokeObjectURL(item.url);
    }
  });
};

const isDeleteSuccessful = (response) => response?.Durum === true || [200, 201, 202].includes(response?.status_code);

const ResimUpload = ({ onImagesChange }) => {
  const { watch } = useFormContext();
  const [imageItems, setImageItems] = useState([]);
  const [loadingImages, setLoadingImages] = useState(false);
  const [refreshImages, setRefreshImages] = useState(false); // Resim listesini yenilemek için kullanılacak
  const [deletingImageId, setDeletingImageId] = useState(null);
  const secilenIsEmriID = watch("secilenIsEmriID");
  const secilenTalepID = watch("secilenTalepID");

  // Watch the 'kapali' field from the form
  const kapali = watch("kapali"); // Assuming 'kapali' is the name of the field in your form

  const fetchResimIds = async () => {
    try {
      setLoadingImages(true);
      const requests = [
        AxiosInstance.get(`GetResimIds?RefId=${secilenIsEmriID}&RefGrup=ISEMRI`),
      ];

      if (secilenTalepID > 0) {
        requests.push(
          AxiosInstance.get(`GetResimIds?RefId=${secilenTalepID}&RefGrup=CAGRI MERKEZI`)
        );
      }

      const responses = await Promise.all(requests);
      const resimIDler = responses.reduce((acc, ids) => acc.concat(ids), []); // Her iki API'den gelen verileri birleştiriyoruz
      const nextImageItems = await Promise.all(
        resimIDler.map(async (id) => {
          const resimResponse = await AxiosInstance.get(`ResimGetirById?id=${id}`, {
            responseType: "blob",
          });
          return {
            id,
            url: URL.createObjectURL(resimResponse),
          };
        })
      );
      setImageItems((prev) => {
        revokeImageUrls(prev);
        return nextImageItems;
      });
    } catch (error) {
      console.error("Resim ID'leri alınırken bir hata oluştu:", error);
      message.error("Resimler yüklenirken bir hata oluştu.");
    } finally {
      setLoadingImages(false);
    }
  };

  useEffect(() => {
    if (secilenIsEmriID) {
      fetchResimIds();
    }
  }, [secilenIsEmriID, refreshImages]); // refreshImages değişikliklerini de takip eder

  useEffect(() => () => revokeImageUrls(imageItems), [imageItems]);

  const draggerProps = {
    name: "file",
    multiple: true,
    showUploadList: false,
    beforeUpload: (file) => {
      const formData = new FormData();
      formData.append("file", file);
      AxiosInstance.post(`UploadPhoto?refid=${secilenIsEmriID}&refgrup=ISEMRI`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
        .then(() => {
          message.success(`${file.name} başarıyla yüklendi.`);
          setRefreshImages((prev) => !prev); // Başarılı yüklemeden sonra resim listesini yenile
          if (onImagesChange) {
            onImagesChange();
          }
        })
        .catch(() => {
          message.error(`${file.name} yükleme sırasında bir hata oluştu.`);
        });

      return false; // Yükleme işleminin varsayılan davranışını engeller
    },
    onDrop: (e) => {
      console.log("Dropped files", e.dataTransfer.files);
    },
  };

  const handleDeleteImage = async (imageId) => {
    try {
      setDeletingImageId(imageId);
      const response = await AxiosInstance.get(`ResimSil?resimID=${imageId}`);
      if (isDeleteSuccessful(response)) {
        message.success(t("islemBasarili"));
        setRefreshImages((prev) => !prev);
        if (onImagesChange) {
          onImagesChange();
        }
      } else {
        message.error(t("islemBasarisiz"));
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
        imageItems.map((item) => (
          <div key={item.id} style={imageCardStyle}>
            {!kapali ? (
              <Popconfirm
                title={t("silmeOnayBaslik")}
                description={t("silmeOnayMesaj")}
                onConfirm={() => handleDeleteImage(item.id)}
                okText={t("globalYes")}
                cancelText={t("globalNo")}
                icon={<QuestionCircleOutlined style={{ color: "red" }} />}
              >
                <Button
                  type="primary"
                  danger
                  icon={<CloseOutlined />}
                  loading={deletingImageId === item.id}
                  style={deleteButtonStyle}
                />
              </Popconfirm>
            ) : null}
            <Image style={imageStyle} src={item.url} fallback={<UserOutlined />} />
          </div>
        ))
      )}
      <Upload.Dragger
        disabled={kapali} // Disable the upload component based on the value of 'kapali'
        {...draggerProps}
      >
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">Tıklayın veya bu alana dosya sürükleyin</p>
        <p className="ant-upload-hint">
          Tek seferde bir veya birden fazla dosya yüklemeyi destekler. Şirket verileri veya diğer yasaklı dosyaların yüklenmesi kesinlikle yasaktır.
        </p>
      </Upload.Dragger>
    </div>
  );
};

export default ResimUpload;
