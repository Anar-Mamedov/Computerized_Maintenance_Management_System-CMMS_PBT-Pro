import React from "react";
import AxiosInstance from "../../../../../../../api/http";
import { Button, message, Popconfirm } from "antd";
import { DeleteOutlined, QuestionCircleOutlined } from "@ant-design/icons";

export default function Kapat({ selectedRows, refreshTableData, disabled, hidePopover }) {
  const buttonStyle = disabled ? { display: "none" } : {};

  const durumID = selectedRows?.[0]?.SFS_TALEP_DURUM_ID;
  const isAc = durumID === 5 || durumID === 6;

  const handleClick = async () => {
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
      title={isAc ? "Talebi Aç" : "Talebi Kapat"}
      onConfirm={handleClick}
      icon={<QuestionCircleOutlined style={{ color: isAc ? "green" : "red" }} />}
      >
        <Button
          style={{ paddingLeft: "0px", color: isAc ? "green" : "red" }}
          type="link"
        >
          {isAc ? "Talebi Aç" : "Talebi Kapat"}
        </Button>
      </Popconfirm>
    </div>
  );
}