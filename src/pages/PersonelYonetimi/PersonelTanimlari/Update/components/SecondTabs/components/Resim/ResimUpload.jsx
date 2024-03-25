import React, { useEffect, useState } from "react";
import { Image, Spin, Upload, message } from "antd";
import { InboxOutlined, UserOutlined } from "@ant-design/icons";
import { useFormContext } from "react-hook-form";
import AxiosInstance from "../../../../../../../../api/http";

const ResimUpload = () => {
  const { watch } = useFormContext();
  const [imageUrls, setImageUrls] = useState([]);
  const [loadingImages, setLoadingImages] = useState(false);
  const [refreshImages, setRefreshImages] = useState(false); // Resim listesini yenilemek için kullanılacak
  const secilenPersonelID = watch("secilenPersonelID");

  const fetchResimIds = async () => {
    try {
      setLoadingImages(true);
      const response = await AxiosInstance.get(`GetResimIds?RefId=${secilenPersonelID}&RefGrup=PERSONEL`);
      const resimIDler = response; // Axios response objesinden data alınır
      const urls = await Promise.all(
        resimIDler.map(async (id) => {
          const resimResponse = await AxiosInstance.get(`ResimGetirById?id=${id}`, {
            responseType: "blob",
          });
          return URL.createObjectURL(resimResponse); // Axios response objesinden blob data alınır
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
    if (secilenPersonelID) {
      fetchResimIds();
    }
  }, [secilenPersonelID, refreshImages]); // refreshImages değişikliklerini de takip eder

  const draggerProps = {
    name: "file",
    multiple: true,
    showUploadList: false,
    beforeUpload: (file) => {
      const formData = new FormData();
      formData.append("file", file);
      AxiosInstance.post(`UploadPhoto?refid=${secilenPersonelID}&refgrup=PERSONEL`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
        .then(() => {
          message.success(`${file.name} başarıyla yüklendi.`);
          setRefreshImages((prev) => !prev); // Başarılı yüklemeden sonra resim listesini yenile
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

  return (
    <div>
      {loadingImages ? (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginBottom: "10px" }}>
          <Spin />
        </div>
      ) : (
        imageUrls.map((url, index) => (
          <Image
            style={{ margin: "10px", height: "150px", width: "150px", objectFit: "cover" }}
            key={index}
            src={url}
            fallback={<UserOutlined />}
          />
        ))
      )}
      <Upload.Dragger {...draggerProps}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">Tıklayın veya bu alana dosya sürükleyin</p>
        <p className="ant-upload-hint">
          Tek seferde bir veya birden fazla dosya yüklemeyi destekler. Şirket verileri veya diğer yasaklı dosyaların
          yüklenmesi kesinlikle yasaktır.
        </p>
      </Upload.Dragger>
    </div>
  );
};

export default ResimUpload;
