import React from "react";
import { FileTextOutlined } from "@ant-design/icons";
import { PdfAxiosInstance } from "../../../../../../../api/http";
import MenuItem from "../MenuItem";

const Form = ({ selectedRows }) => {
  const downloadPdf = async () => {
    try {
      const baseURL = localStorage.getItem("baseURL");
      selectedRows.forEach(async (row) => {
        window.open(
          `${baseURL}/FormRapor/GetFormByType?id=${row.key}&tipId=1`,
          "_blank"
        );
      });
    } catch (error) {
      console.error("PDF indirme hatası:", error);
    }
  };

  return (
    <MenuItem
      icon={<FileTextOutlined />}
      title="İş Emri Formları..."
      description="PDF ve baskı formlarını görüntüle."
      onClick={downloadPdf}
    />
  );
};

export default Form;
