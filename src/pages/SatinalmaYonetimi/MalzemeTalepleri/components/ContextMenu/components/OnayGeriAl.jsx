import React from "react";
import AxiosInstance from "../../../../../../api/http";
import { Button, message, Popconfirm } from "antd";
import { BsSendCheck } from "react-icons/bs";
import { QuestionCircleOutlined } from "@ant-design/icons";

export default function Sil({ selectedRows, refreshTableData, disabled, hidePopover }) {
  // Sil düğmesini gizlemek için koşullu stil
  const buttonStyle = disabled ? { display: "none" } : {};

  const handleDelete = async () => {
    let isError = false;

    for (const row of selectedRows) {
      try {
        const fisId = row.key || row.ONAY_TABLO_ID || 0; // Satırdan fisId al

        const response = await AxiosInstance.post(`OnayGeriAlBy?fisId=${fisId}`);
        const resData = response.data || {};
        const statusCode = resData.status_code;

        if ([200, 201].includes(statusCode)) {
          message.success("İşlem Başarılı.");
        } else if (statusCode === 401) {
          message.error("Bu işlemi yapmaya yetkiniz bulunmamaktadır.");
        } else {
          message.error("İşlem Başarısız.");
        }

      } catch (error) {
        console.error("Geri alma işlemi sırasında hata oluştu:", error);
        message.error("Hata: " + error.message);
        isError = true;
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
        title="Onay Geri Alma İşlemi"
        description="Bu öğeyi onaydan geri almak istediğinize emin misiniz?"
        onConfirm={handleDelete}
        okText="Evet"
        cancelText="Hayır"
        icon={<QuestionCircleOutlined style={{ color: "red" }} />}
      >
        <Button
          style={{ paddingLeft: "0px", display: "flex", alignItems: "center", color: "red" }}
          type="link"
          icon={<BsSendCheck />}
        >
          Onay Geri Al
        </Button>
      </Popconfirm>
    </div>
  );
}