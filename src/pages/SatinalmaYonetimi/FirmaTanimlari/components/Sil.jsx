import React from "react";
import AxiosInstance from "../../../../api/http";
import { Button, message, Popconfirm } from "antd";
import { DeleteOutlined, QuestionCircleOutlined } from "@ant-design/icons";

export default function Sil({ selectedRows, refreshTableData, disabled, hidePopover }) {
  const buttonStyle = disabled ? { display: "none" } : {};

  const handleDelete = async () => {
    let isError = false;

    for (const row of selectedRows) {
      try {
        // row.key → fisID, row.fisDurumID → durum ID
        const response = await AxiosInstance.get(
          `DeleteTedarikci?FirmaID=${row.key}`
        );

        if (response.status_code === 200) {
          message.success(response.message || "İşlem başarılı.");
        } else {
          isError = true;
          message.error(response.message || "İşlem başarısız.");
        }
      } catch (error) {
        isError = true;
        console.error("Silme işlemi sırasında hata oluştu:", error);
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
        title="Silme İşlemi"
        description="Bu öğeyi silmek istediğinize emin misiniz?"
        onConfirm={handleDelete}
        okText="Evet"
        cancelText="Hayır"
        icon={<QuestionCircleOutlined style={{ color: "red" }} />}
      >
        <Button style={{ paddingLeft: "0px" }} type="link" danger icon={<DeleteOutlined />}>
          Sil
        </Button>
      </Popconfirm>
    </div>
  );
}