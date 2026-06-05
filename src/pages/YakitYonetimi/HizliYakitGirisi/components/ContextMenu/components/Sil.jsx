import React from "react";
import AxiosInstance from "../../../../../../api/http";
import { message, Popconfirm } from "antd";
import { DeleteOutlined, QuestionCircleOutlined } from "@ant-design/icons";

export default function Sil({ selectedRows, refreshTableData, disabled, hidePopover }) {
  // Disabled ise display: none yapar, değilse boş obje döner
  const buttonStyle = disabled ? { display: "none" } : {};

  const handleDelete = async () => {
    let isError = false;

    for (const row of selectedRows) {
      try {
        // Dokümana göre istek: POST /api/DeleteYakit?id=6012
        // row içindeki ID alanı: TB_STOK_ID (Önceki JSON verisine göre)
        const response = await AxiosInstance.post(
          `DeleteYakit?id=${row.TB_STOK_ID}`
        );

        if (response.status_code === 200) {
          message.success(response.message || "Silme işlemi başarılı.");
        } else {
          isError = true;
          message.error(response.message || "Silme işlemi başarısız.");
        }
      } catch (error) {
        isError = true;
        console.error("Silme işlemi sırasında hata oluştu:", error);
        message.error("Sunucu hatası, silinemedi.");
      }
    }

    if (!isError) {
      refreshTableData(); // Tabloyu yenile
      hidePopover();      // Menüyü kapat
    }
  };

  return (
    <Popconfirm
      title="Silme İşlemi"
      description="Bu yakıt kaydını silmek istediğinize emin misiniz?"
      onConfirm={handleDelete}
      okText="Evet"
      cancelText="Hayır"
      icon={<QuestionCircleOutlined style={{ color: "red" }} />}
    >
      <div
        className="menu-item-hover"
        style={{
          ...buttonStyle,
          display: disabled ? 'none' : 'flex',
          alignItems: 'flex-start',
          gap: '12px',
          cursor: 'pointer',
          padding: '10px 12px',
          transition: 'background-color 0.3s',
          width: '100%'
        }}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
      >
        {/* Sol Taraf: İkon */}
        <div>
          <DeleteOutlined style={{ color: '#cf1322', fontSize: '18px', marginTop: '4px' }} />
        </div>

        {/* Sağ Taraf: Başlık ve Açıklama */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontWeight: '500', color: '#262626', fontSize: '14px', lineHeight: '1.2' }}>
            Sil
          </span>
          <span style={{ fontSize: '12px', color: '#8c8c8c', marginTop: '4px', lineHeight: '1.4' }}>
            Yakıt kaydını kalıcı olarak siler. Geri alınamaz.
          </span>
        </div>
      </div>
    </Popconfirm>
  );
}