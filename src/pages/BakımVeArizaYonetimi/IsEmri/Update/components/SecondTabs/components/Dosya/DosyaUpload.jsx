import React, { useEffect, useState } from "react";
import { Upload, Button, List, Spin, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useFormContext } from "react-hook-form";
import AxiosInstance from "../../../../../../../../api/http";

const DosyaUpload = () => {
  const { watch } = useFormContext();
  const [dosyalar, setDosyalar] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);
  // Dosya listesini yenilemek için kullanılacak
  const secilenIsEmriID = watch("secilenIsEmriID");

  const fetchDosyaIds = async () => {
    try {
      setLoading(true);
      const response = await AxiosInstance.get(`GetFileIds?RefId=${secilenIsEmriID}&RefGrup=ISEMRI`);
      const dosyaIDler = response;
      // Varsayılan olarak response kullanılır
      const dosyaUrls = await Promise.all(
        dosyaIDler.map(async (id) => {
          const dosyaResponse = await AxiosInstance.get(`GetFileByID?id=${id}`, { responseType: "blob" });
          return URL.createObjectURL(dosyaResponse);
          // Blob'dan URL oluştur
        })
      );
      setDosyalar(dosyaUrls);
    } catch (error) {
      console.error("Dosya ID'leri alınırken bir hata oluştu:", error);
      message.error("Dosyalar yüklenirken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (secilenIsEmriID) {
      fetchDosyaIds();
    }
  }, [secilenIsEmriID, refresh]);

  // refresh değişikliklerini de takip eder

  const draggerProps = {
    name: "file",
    multiple: true,
    showUploadList: false,
    beforeUpload: (file) => {
      const formData = new FormData();
      formData.append("file", file);
      // formData.append("name", file.name);
      console.log(file.name);
      console.log(file);

      AxiosInstance.post(`UploadFile?refid=${secilenIsEmriID}&refgrup=ISEMRI`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
        .then(() => {
          message.success(`${file.name} başarıyla yüklendi.`);
          setRefresh((prev) => !prev);
          // Başarılı yüklemeden sonra dosya listesini yenile
        })
        .catch((error) => {
          console.error("Dosya yükleme sırasında bir hata oluştu:", error);
          message.error(`${file.name} yükleme sırasında bir hata oluştu.`);
        });
      return false;
      // Yükleme işleminin varsayılan davranışını engeller
    },
  };

  return (
    <div style={{ marginBottom: "35px" }}>
      {loading ? (
        <Spin />
      ) : (
        <List
          dataSource={dosyalar}
          renderItem={(url, index) => (
            <List.Item key={index}>
              <a href={url} target="\_blank" rel="noopener noreferrer">
                Dosyayı İndir
              </a>
            </List.Item>
          )}
        />
      )}
      <Upload.Dragger {...draggerProps}>
        <p className="ant-upload-drag-icon">
          <UploadOutlined />
        </p>
        <p className="ant-upload-text">Tıklayın veya bu alana dosya sürükleyin</p>
        <p className="ant-upload-hint">Tek seferde bir veya birden fazla dosya yüklemeyi destekler.</p>
      </Upload.Dragger>
    </div>
  );
};
export default DosyaUpload;
