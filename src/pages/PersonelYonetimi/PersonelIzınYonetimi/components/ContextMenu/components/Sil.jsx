import React from "react";
import AxiosInstance from "../../../../../../api/http";
import { message, Popconfirm } from "antd";
import { DeleteOutlined, QuestionCircleOutlined } from "@ant-design/icons";

export default function Sil({ selectedRows, refreshTableData, disabled, hidePopover }) {
  // Disabled ise display: none yapar, değilse boş obje döner
  const buttonStyle = disabled ? { display: "none" } : {};

  const handleDelete = async () => {
    let isError = false;

    // Birden fazla seçim varsa döngüye girer
    for (const row of selectedRows) {
      try {
        // Tablodan gelebilecek izin ID varyasyonlarını yakalıyoruz
        const kayitId = row.TB_PERSONEL_IZIN_ID || row.key || row.IzinId;
        
        if (!kayitId) {
          console.warn("Silinecek izin ID'si bulunamadı:", row);
          continue;
        }

        // API İsteği: POST /api/DeletePersonelIzin?id={id}
        // Dokümana göre body boş bırakılmalıdır
        const response = await AxiosInstance.post(
          `DeletePersonelIzin?id=${kayitId}`,
          {}
        );

        // Dokümana göre başarı kontrolü: has_error false olması yeterlidir
        if (response && response.has_error === false) {
          // Başarılı mesajı 'status' alanından geliyor ("Kayıt silindi.")
          message.success(response.status || "İzin kaydı başarıyla silindi.");
        } else {
          isError = true;
          message.error(response.status || "Silme işlemi başarısız.");
        }
      } catch (error) {
        isError = true;
        console.error("Silme işlemi sırasında hata oluştu:", error);
        message.error("Sunucu hatası, silinemedi.");
      }
    }

    // Her durumda veya başarılı işlemler sonrasında tabloyu yenile ve menüyü kapat
    refreshTableData(); 
    hidePopover();      
  };

  return (
    <Popconfirm
      title="Silme İşlemi"
      description="Bu personel izin kaydını silmek istediğinize emin misiniz?"
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
            Personel izin kaydını kalıcı olarak siler. Geri alınamaz.
          </span>
        </div>
      </div>
    </Popconfirm>
  );
}