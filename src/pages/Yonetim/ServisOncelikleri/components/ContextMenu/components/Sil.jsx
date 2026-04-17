import React from "react";
import AxiosInstance from "../../../../../../api/http";
import { message, Popconfirm } from "antd";
import { DeleteOutlined, QuestionCircleOutlined } from "@ant-design/icons";

export default function Sil({ selectedRows, refreshTableData, disabled, hidePopover }) {
  const buttonStyle = disabled ? { display: "none" } : {};

  const handleDelete = async () => {
    // 1. Dokümana göre sadece ID'lerden oluşan bir dizi hazırlıyoruz
    // selectedRows içindeki doğru ID alanını kullandığından emin ol (genelde 'key' veya 'Id' olur)
    const idsToDelete = selectedRows.map((row) => row.key || row.Id);

    if (idsToDelete.length === 0) {
      message.warning("Lütfen silinecek kayıtları seçin.");
      return;
    }

    try {
      // 2. Döngüye girmeden, tek seferde POST isteği atıyoruz
      // Body olarak direkt diziyi [12, 15, 18] gönderiyoruz
      const response = await AxiosInstance.post("DeleteServisOncelik", idsToDelete);

      // Backend'den gelen yanıtı kontrol et
      if (response.status_code === 200 || response.status === 200) {
        message.success("Seçilen servis önceliği başarıyla silindi.");
        refreshTableData(); // Tabloyu tazele
        hidePopover();      // Popover'ı kapat
      } else {
        // Hata durumunda (Örn: Vardiya kullanımda uyarısı buradan döner)
        message.error(response.statusText || response.message || "Silme işlemi başarısız.");
      }
    } catch (error) {
      // Eğer vardiya başka yerde kullanılıyorsa 400 Bad Request buraya düşer
      const errorMessage = error.response?.data?.status || "Sunucu hatası, silinemedi.";
      message.error(errorMessage);
      console.error("Silme hatası:", error);
    }
  };

  return (
    <Popconfirm
      title="Silme İşlemi"
      description={`${selectedRows.length} adet servis önceliğini silmek istediğinize emin misiniz?`}
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
        <div>
          <DeleteOutlined style={{ color: '#cf1322', fontSize: '18px', marginTop: '4px' }} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontWeight: '500', color: '#262626', fontSize: '14px', lineHeight: '1.2' }}>
            Sil
          </span>
          <span style={{ fontSize: '12px', color: '#8c8c8c', marginTop: '4px', lineHeight: '1.4' }}>
            Seçili servis önceliği kalıcı olarak siler.
          </span>
        </div>
      </div>
    </Popconfirm>
  );
}