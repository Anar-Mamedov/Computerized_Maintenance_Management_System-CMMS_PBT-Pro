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
  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const secilenIsEmriID = watch("secilenIsEmriID");

  const fetchDosyaIds = async () => {
    try {
      setLoading(true);
      const response = await AxiosInstance.get(`GetDosyaList?refId=${secilenIsEmriID}&refGrup=ISEMRI`);
      const fetchedData = await Promise.all(
        response.map(async (item) => {
          try {
            // Assuming `TB_DOSYA_ID` is your file ID
            const fileId = item.TB_DOSYA_ID;
            // Fetching the file blob from `GetFileByID`
            const fileResponse = await AxiosInstance.get(`GetFileByID?id=${fileId}`, { responseType: "blob" });
            // Creating a URL for the file blob
            const fileURL = URL.createObjectURL(fileResponse);
            return {
              ...item,
              key: fileId,
              downloadURL: fileURL, // Adding the download URL to your item
            };
          } catch (error) {
            console.error(`Error fetching file ${item.TB_DOSYA_ID}:`, error);
            return {
              ...item,
              key: item.TB_DOSYA_ID,
              downloadURL: "", // In case of error, provide an empty string or handle appropriately
            };
          }
        })
      );
      setDosyalar(fetchedData);
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
      dataIndex: "DSY_TANIM",
      key: "DSY_TANIM",
    },
    {
      title: "Belge Tipi",
      dataIndex: "belgeTipi",
      key: "belgeTipi",
    },
    {
      title: "Dosya Adı",
      dataIndex: "DSY_DOSYA_AD",
      key: "DSY_DOSYA_AD",
    },
    {
      title: "Boyutu",
      dataIndex: "DSY_DOSYA_BOYUT",
      key: "DSY_DOSYA_BOYUT",
    },
    {
      title: "Süreli",
      dataIndex: "DSY_SURELI",
      key: "DSY_SURELI",
      render: (text, record) => {
        return record.DSY_SURELI ? (
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
      dataIndex: "DSY_BITIS_TARIH",
      key: "DSY_BITIS_TARIH",
    },
    {
      title: "İşlem",
      key: "action",
      render: (_, record) =>
        record.downloadURL ? (
          <a
            href={record.downloadURL}
            download={record.DSY_DOSYA_AD}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}>
            Dosyayı İndir
          </a>
        ) : (
          <span>Dosya bulunamadı</span> // Or any other fallback content
        ),
    },
  ];

  const onRowClick = (record) => {
    return {
      onClick: () => {
        setSelectedRow(record); // Set the selected file state
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

  const onRowSelectChange = (selectedKeys) => {
    setSelectedRowKeys(selectedKeys.length ? [selectedKeys[0]] : []);
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
        <Table
          rowSelection={{
            type: "radio",
            selectedRowKeys,
            onChange: onRowSelectChange,
          }}
          dataSource={dosyalar}
          columns={columns}
          pagination={false}
          onRow={onRowClick}
        />
      )}
      <Upload.Dragger {...draggerProps}>
        <p className="ant-upload-drag-icon">
          <UploadOutlined />
        </p>
        <p className="ant-upload-text">Tıklayın veya bu alana dosya sürükleyin</p>
        <p className="ant-upload-hint">Tek seferde bir veya birden fazla dosya yüklemeyi destekler.</p>
      </Upload.Dragger>

      <EditModal
        onRefresh={() => setRefresh(!refresh)}
        isModalVisible={isModalVisible}
        onModalClose={() => {
          setIsModalVisible(false);
          setSelectedRow(null);
        }}
        selectedRow={selectedRow}
      />
    </div>
  );
};

export default DosyaUpload;
