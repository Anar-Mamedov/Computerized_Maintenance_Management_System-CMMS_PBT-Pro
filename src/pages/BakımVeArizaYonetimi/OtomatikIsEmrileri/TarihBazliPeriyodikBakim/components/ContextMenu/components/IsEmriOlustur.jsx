import React, { useEffect } from "react";
import AxiosInstance from "../../../../../../../api/http";
import { Button, message, Popconfirm, Typography } from "antd";
import { DeleteOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import { t } from "i18next";

const { Text } = Typography;

export default function Sil({ selectedRows, refreshTableData, hidePopover }) {
  // Silme işlemini tetikleyecek fonksiyon
  const handleDelete = async () => {
    let isError = false;
    // Seçili satırlar üzerinde döngü yaparak her birini sil
    for (const row of selectedRows) {
      try {
        const body = {
          PBakimId: row.BakimID,
          MakineId: row.MakineID,
          Tarih: row.PlanlamaTarih,
        };
        // Silme API isteğini gönder
        const response = await AxiosInstance.post(`IsEmriOlustur`, body);
        console.log("İşlem başarılı:", response);
        if (response.status_code === 200 || response.status_code === 201) {
          message.success("İşlem Başarılı.");
          isError = false;
        } else if (response.status_code === 401) {
          message.error("Bu işlemi yapmaya yetkiniz bulunmamaktadır.");
          isError = true;
        } else {
          message.error("İşlem Başarısız.");
          isError = true;
        }
        // Burada başarılı silme işlemi sonrası yapılacak işlemler bulunabilir.
      } catch (error) {
        console.error("Silme işlemi sırasında hata oluştu:", error);
        message.error("İşlem Başarısız.");
        isError = true;
      }
    }
    // Tüm silme işlemleri tamamlandıktan sonra ve hata oluşmamışsa refreshTableData'i çağır
    if (!isError) {
      refreshTableData();
      hidePopover(); // Silme işlemi başarılı olursa Popover'ı kapat
    }
  };

  return (
    <div>
      <Text style={{ cursor: "pointer" }} onClick={handleDelete}>
        {t("isEmriOlustur")}
      </Text>
    </div>
  );
}
