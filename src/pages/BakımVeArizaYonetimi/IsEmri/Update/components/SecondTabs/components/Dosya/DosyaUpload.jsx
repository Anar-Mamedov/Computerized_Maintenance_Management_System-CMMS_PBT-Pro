import React, { useEffect, useState } from "react";
import { Upload, Button, List, Spin, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useFormContext } from "react-hook-form";
import AxiosInstance from "../../../../../../../../api/http";

const DosyaUpload = () => {
  const { watch } = useFormContext();
  const [files, setFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [shouldRefresh, setShouldRefresh] = useState(false);

  const selectedJobOrderId = watch("secilenIsEmriID");

  const fetchFileIds = async () => {
    try {
      setIsLoading(true);
      const response = await AxiosInstance.get(`GetFileIds?RefId=${selectedJobOrderId}&RefGrup=ISEMRI`);
      const fileIds = response;

      const fileUrls = await Promise.all(
        fileIds.map(async (id) => {
          const fileResponse = await AxiosInstance.get(`GetFileByID?id=${id}`, {
            responseType: "blob",
          });
          return URL.createObjectURL(fileResponse);
        })
      );

      setFiles(fileUrls);
    } catch (error) {
      console.error("An error occurred while fetching file IDs:", error);
      message.error("An error occurred while loading files.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (selectedJobOrderId) {
      fetchFileIds();
    }
  }, [selectedJobOrderId, shouldRefresh]);

  const handleUpload = (file) => {
    const formData = new FormData();
    formData.append("file", file);
    // formData.append("name", file.name);
    console.log(file.name);
    console.log(file);

    AxiosInstance.post(`UploadFile?refid=${selectedJobOrderId}&refgrup=ISEMRI`, formData, {})
      .then(() => {
        message.success(`${file.name} was uploaded successfully.`);
        setShouldRefresh((prev) => !prev);
      })
      .catch((error) => {
        console.error("An error occurred while uploading the file:", error);
        message.error(`An error occurred while uploading ${file.name}.`);
      });
  };

  const draggerProps = {
    name: "file",
    multiple: true,
    showUploadList: false,
    beforeUpload: handleUpload,
  };

  return (
    <div style={{ marginBottom: "35px" }}>
      {isLoading ? (
        <Spin />
      ) : (
        <List
          dataSource={files}
          renderItem={(url, index) => (
            <List.Item key={index}>
              <a href={url} target="_blank" rel="noopener noreferrer">
                Download File
              </a>
            </List.Item>
          )}
        />
      )}
      <Upload.Dragger {...draggerProps}>
        <p className="ant-upload-drag-icon">
          <UploadOutlined />
        </p>
        <p className="ant-upload-text">Click or drag file to this area to upload</p>
        <p className="ant-upload-hint">Support for uploading one or multiple files at a time.</p>
      </Upload.Dragger>
    </div>
  );
};

export default DosyaUpload;
