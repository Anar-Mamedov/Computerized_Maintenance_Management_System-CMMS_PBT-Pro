import React from "react";
import AxiosInstance from "../../../../../../api/http";
import { message, Popconfirm } from "antd";
import { DeleteOutlined, QuestionCircleOutlined } from "@ant-design/icons";

export default function Sil({ selectedRows, refreshTableData, disabled, hidePopover }) {
  const buttonStyle = disabled ? { display: "none" } : {};

  const handleDelete = async () => {
    const idsToDelete = selectedRows.map((row) => row.key || row.TB_IS_TANIM_ID);

    if (idsToDelete.length === 0) {
      message.warning("Lütfen silinecek kayıtları seçin.");
      return;
    }

    let successCount = 0;
    let errorCount = 0;

    // API tek bir ID alır (POST /api/BakimArizaTanimSil?id={id}), seçili her kayıt için ayrı istek atılır
    for (const id of idsToDelete) {
      try {
        const response = await AxiosInstance.post(`BakimArizaTanimSil?id=${id}`);

        if (response?.has_error) {
          // Kullanımda olan veya silinemeyen kayıtlar için backend uyarı döner
          errorCount++;
          message.warning(response.status || "Kayıt silinemedi.");
        } else {
          successCount++;
        }
      } catch (error) {
        errorCount++;
        const errorMessage = error.response?.data?.status || "Sunucu hatası, silinemedi.";
        message.error(errorMessage);
        console.error("Silme hatası:", error);
      }
    }

    if (successCount > 0) {
      message.success(`${successCount} adet bakım/arıza tanımı başarıyla silindi.`);
      refreshTableData();
    }

    if (errorCount === 0) {
      hidePopover();
    }
  };

  return (
    <Popconfirm
      title="Silme İşlemi"
      description={`${selectedRows.length} adet bakım/arıza tanımını silmek istediğinize emin misiniz?`}
      onConfirm={handleDelete}
      okText="Evet"
      cancelText="Hayır"
      icon={<QuestionCircleOutlined style={{ color: "red" }} />}
    >
      <div
        className="menu-item-hover"
        style={{
          ...buttonStyle,
          display: disabled ? "none" : "flex",
          alignItems: "flex-start",
          gap: "12px",
          cursor: "pointer",
          padding: "10px 12px",
          transition: "background-color 0.3s",
          width: "100%",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f5f5f5")}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
      >
        <div>
          <DeleteOutlined style={{ color: "#cf1322", fontSize: "18px", marginTop: "4px" }} />
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ fontWeight: "500", color: "#262626", fontSize: "14px", lineHeight: "1.2" }}>Sil</span>
          <span style={{ fontSize: "12px", color: "#8c8c8c", marginTop: "4px", lineHeight: "1.4" }}>
            Seçili bakım/arıza tanımını kalıcı olarak siler.
          </span>
        </div>
      </div>
    </Popconfirm>
  );
}
