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
        const payload = {
          ONAY_TABLO_ID: Number(row.key) || 0,       // Satır ID
          ONAY_TABLO_KOD: row.IST_KOD || "",         // Satır kodu
          ONAY_ONYTANIM_ID: 3                         // Sabit değer, istersen burayı props ile dinamik yapabilirsin
        };

        const response = await AxiosInstance.post("OnayaGonder", payload);

        // AxiosInstance.post genellikle response.data içinde döner, o yüzden kontrol buna göre olmalı
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
        console.error("Silme işlemi sırasında hata oluştu:", error);
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
        title="Onaya Gönderme İşlemi"
        description="Bu öğeyi onaya göndermek istediğinize emin misiniz?"
        onConfirm={handleDelete}
        okText="Evet"
        cancelText="Hayır"
        icon={<QuestionCircleOutlined style={{ color: "red" }} />}
      >
        <Button
          style={{ paddingLeft: "0px", display: "flex", alignItems: "center" }}
          type="link"
          icon={<BsSendCheck />}
        >
          Onaya Gönder
        </Button>
      </Popconfirm>
    </div>
  );
}