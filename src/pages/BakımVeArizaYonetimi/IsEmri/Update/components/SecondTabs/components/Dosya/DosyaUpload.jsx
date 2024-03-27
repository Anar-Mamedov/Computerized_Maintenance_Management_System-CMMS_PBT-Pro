import React, { useEffect, useState } from "react";
import { Upload, Button, Table, Spin, message, Modal } from "antd";
import { UploadOutlined, CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { useFormContext } from "react-hook-form";
import AxiosInstance from "../../../../../../../../api/http";
import EditModal from "./Update/EditModal";

const DosyaUpload = () => {
  const { watch } = useFormContext();
  const [dosyalar, setDosyalar] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const secilenIsEmriID = watch("secilenIsEmriID");

  const fetchDosyaIds = async () => {
    try {
      setLoading(true);
      const response = await AxiosInstance.get(`GetFileIds?RefId=${secilenIsEmriID}&RefGrup=ISEMRI`);
      const dosyaIDler = response; // Adjust according to the actual response structure
      const dosyaUrls = await Promise.all(
        dosyaIDler.map(async (id) => {
          const dosyaResponse = await AxiosInstance.get(`GetFileByID?id=${id}`, { responseType: "blob" });
          return {
            key: id,
            url: URL.createObjectURL(dosyaResponse),
            name: `Dosya ${id}`, // Assuming file naming or retrieval logic here
          };
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

  const columns = [
    {
      title: "Belge Tanımı",
      dataIndex: "belgeTanimi",
      key: "belgeTanimi",
    },
    {
      title: "Belge Tipi",
      dataIndex: "belgeTipi",
      key: "belgeTipi",
    },
    {
      title: "Dosya Adı",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Boyutu",
      dataIndex: "boyutu",
      key: "boyutu",
    },
    {
      title: "Süreli",
      dataIndex: "sureli",
      key: "sureli",
      render: (text, record) => {
        return record.DKN_YAPILDI ? (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            <CheckOutlined style={{ color: "green" }} />
          </div>
        ) : (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            <CloseOutlined style={{ color: "red" }} />
          </div>
        );
      },
    },
    {
      title: "Bitiş Tarihi",
      dataIndex: "bitisTarihi",
      key: "bitisTarihi",
    },
    {
      title: "İşlem",
      key: "action",
      render: (_, record) => (
        <a
          href={record.url}
          download={record.name}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}>
          Dosyayı İndir
        </a>
      ),
    },
  ];

  const onRowClick = (record) => {
    return {
      onClick: () => {
        setSelectedFile(record); // Set the selected file state
        setIsModalVisible(true); // Open the modal
      },
    };
  };

  // Step 1: Define a new function for handling file uploads and refreshing the table data.
  const handleFileUpload = (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("name", file.name);

    AxiosInstance.post(`UploadFile?refid=${secilenIsEmriID}&refgrup=ISEMRI`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
      .then(() => {
        message.success(`${file.name} başarıyla yüklendi.`);
        fetchDosyaIds(); // Refresh the table data by calling fetchDosyaIds directly after successful upload.
      })
      .catch((error) => {
        console.error("Dosya yükleme sırasında bir hata oluştu:", error);
        message.error(`${file.name} yükleme sırasında bir hata oluştu.`);
      });

    return false; // Prevent default upload behavior
  };

  // Step 2: Update the beforeUpload callback in draggerProps to use the new handleFileUpload function.
  const draggerProps = {
    name: "file",
    multiple: true,
    showUploadList: false,
    beforeUpload: (file) => {
      handleFileUpload(file); // Use the new function to handle file upload and refresh logic.
      return false; // Prevent default upload behavior
    },
  };

  return (
    <div style={{ marginBottom: "35px" }}>
      {loading ? (
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: "20px",
          }}>
          <Spin />
        </div>
      ) : (
        <Table dataSource={dosyalar} columns={columns} pagination={false} onRow={onRowClick} />
      )}
      <Upload.Dragger {...draggerProps}>
        <p className="ant-upload-drag-icon">
          <UploadOutlined />
        </p>
        <p className="ant-upload-text">Tıklayın veya bu alana dosya sürükleyin</p>
        <p className="ant-upload-hint">Tek seferde bir veya birden fazla dosya yüklemeyi destekler.</p>
      </Upload.Dragger>

      <EditModal
        isModalVisible={isModalVisible}
        onModalClose={() => {
          setIsModalVisible(false);
          setSelectedFile(null);
        }}
        selectedFile={selectedFile}
      />
    </div>
  );
};

export default DosyaUpload;
