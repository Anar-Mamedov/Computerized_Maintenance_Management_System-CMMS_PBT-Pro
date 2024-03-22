import React, { useEffect, useState } from "react";
import { Image, Spin, Upload, message } from "antd";
import { InboxOutlined, UserOutlined } from "@ant-design/icons";
import { useFormContext } from "react-hook-form";
import AxiosInstance from "../../../../../../../../api/http";

const ResimUpload = () => {
  const { watch } = useFormContext(); // useFormContext'ten gerekli fonksiyonları al
  const [imageUrls, setImageUrls] = useState([]); // Çoklu resim URL'lerini saklamak için state güncellemesi
  const [loadingImages, setLoadingImages] = useState(false); // Çoklu resim yükleme durumu için state
  const secilenIsEmriID = watch("secilenIsEmriID"); // Formdan seçilen iş emri ID'sini izle
  const resimIDler = watch("resimID"); // Formdan çoklu resim ID'lerini izle

  // Dragger için prop'lar
  const draggerProps = {
    name: "file",
    multiple: true,
    showUploadList: false, // Yükleme listesini gösterme
    beforeUpload: (file) => {
      const formData = new FormData();
      formData.append("file", file);

      // Dinamik endpoint ile Axios üzerinden yükleme işlemi
      AxiosInstance.post(`UploadPhoto?refid=${secilenIsEmriID}&refgrup=ISEMRI`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
        .then(() => {
          message.success(`${file.name} başarıyla yüklendi.`);
        })
        .catch(() => {
          message.error(`${file.name} yükleme sırasında bir hata oluştu.`);
        });

      // Dosya yükleme işleminin varsayılan davranışını engelleyin
      return false;
    },
    onDrop: (e) => {
      console.log("Dropped files", e.dataTransfer.files);
    },
  };

  useEffect(() => {
    if (resimIDler && resimIDler.length) {
      setLoadingImages(true);
      const fetchImages = async () => {
        try {
          const urls = await Promise.all(
            resimIDler.map(async (id) => {
              const response = await AxiosInstance.get(`ResimGetirById?id=${id}`, {
                responseType: "blob",
              });
              return URL.createObjectURL(response); // Blob'dan URL oluştur
            })
          );
          setImageUrls(urls);
        } catch (error) {
          console.error("Error fetching images:", error);
          message.error("Resimler yüklenirken bir hata oluştu.");
        } finally {
          setLoadingImages(false);
        }
      };

      fetchImages();

      return () => {
        // Oluşturulan her URL'yi iptal edin
        imageUrls.forEach((url) => URL.revokeObjectURL(url));
      };
    }
  }, [resimIDler]);

  return (
    <div>
      {loadingImages ? (
        <Spin />
      ) : (
        imageUrls.map((url, index) => (
          <Image
            key={index}
            width={200}
            src={url}
            fallback={<UserOutlined />} // Resim yüklenemediğinde gösterilecek ikon
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
