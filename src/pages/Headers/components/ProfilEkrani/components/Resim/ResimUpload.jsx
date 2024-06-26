import React, { useEffect, useState } from "react";
import { Image, Spin, Upload, message } from "antd";
import { InboxOutlined, UserOutlined } from "@ant-design/icons";
import { useFormContext } from "react-hook-form";
import AxiosInstance from "../../../../../../api/http";
import { useAppContext } from "../../../../../../AppContext.jsx"; // AppContext'i import edin

const ResimUpload = () => {
  const { watch } = useFormContext();
  const { userData1 } = useAppContext(); // AppContext'ten userData1 değerini alın
  const { setIsButtonClicked } = useAppContext(); // AppContext'ten setIsButtonClicked fonksiyonunu alın
  const secilenIsEmriID = watch("secilenIsEmriID");

  const draggerProps = {
    name: "file",
    multiple: true,
    showUploadList: false,
    beforeUpload: (file) => {
      if (userData1?.KLL_PERSONEL_ID) {
        const formData = new FormData();
        formData.append("file", file);
        AxiosInstance.post(
          `UploadPhoto?refid=${userData1?.KLL_PERSONEL_ID}&refgrup=PERSONEL`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        )
          .then(() => {
            message.success(`${file.name} başarıyla yüklendi.`);
            setIsButtonClicked((prev) => !prev); // Başarılı yüklemeden sonra resim listesini yenile
          })
          .catch(() => {
            message.error(`${file.name} yükleme sırasında bir hata oluştu.`);
          });

        return false; // Yükleme işleminin varsayılan davranışını engeller
      }
    },
    onDrop: (e) => {
      console.log("Dropped files", e.dataTransfer.files);
    },
  };

  return (
    <div>
      <Upload.Dragger {...draggerProps}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">
          Tıklayın veya bu alana dosya sürükleyin
        </p>
        <p className="ant-upload-hint">
          Tek seferde bir veya birden fazla dosya yüklemeyi destekler. Şirket
          verileri veya diğer yasaklı dosyaların yüklenmesi kesinlikle yasaktır.
        </p>
      </Upload.Dragger>
    </div>
  );
};

export default ResimUpload;
