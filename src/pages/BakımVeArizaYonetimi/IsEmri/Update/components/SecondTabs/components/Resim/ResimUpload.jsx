import React from "react";
import { Upload, message } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import { useFormContext } from "react-hook-form";
import AxiosInstance from "../../../../../../../../api/http";

const ResimUploadDragDrop = () => {
  const { watch } = useFormContext(); // useFormContext'ten gerekli fonksiyonları al
  const secilenIsEmriID = watch("secilenIsEmriID"); // Formdan seçilen iş emri ID'sini izle

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

  return (
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
  );
};

export default ResimUploadDragDrop;
