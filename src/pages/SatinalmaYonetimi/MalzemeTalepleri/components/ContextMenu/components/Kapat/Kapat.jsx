import React from "react";
import AxiosInstance from "../../../../../../../api/http";
import { Button, message, Popconfirm } from "antd";
import { DeleteOutlined, QuestionCircleOutlined } from "@ant-design/icons";

export default function Kapat({ selectedRows, refreshTableData, disabled, hidePopover }) {
  const buttonStyle = disabled ? { display: "none" } : {};

  const handleKapat = async () => {
    let isError = false;

    for (const row of selectedRows) {
      try {
        // row.key → fisID, row.fisDurumID → durum ID
        const response = await AxiosInstance.post(
          `MalzemeTalepAcKapatBy?fisID=${row.key}`
        );

        console.log("Talep Kapatma işlemi sonucu:", response);

        if (response.status_code === 200) {
          message.success(response.message || "İşlem başarılı.");
        } else {
          isError = true;
          message.error(response.message || "İşlem başarısız.");
        }
      } catch (error) {
        isError = true;
        console.error("Talep Kapatma işlemi sırasında hata oluştu:", error);
        message.error("Sunucu hatası.");
      }
    }

    if (!isError) {
      refreshTableData();
      hidePopover();
    }
  };

  return (
  <div style={buttonStyle}>
    <Popconfirm
      title="Talebi Kapat"
      onConfirm={handleKapat}
      icon={<QuestionCircleOutlined style={{ color: "red" }} />}
    >
      <Button style={{ paddingLeft: "0px" }} type="link" danger>
        Talebi Kapat
      </Button>
    </Popconfirm>
  </div>
);
}