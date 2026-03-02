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
        // API İsteği: POST /api/DeleteYakitTank?id={id}
        const response = await AxiosInstance.post(
          `DeleteYakitTank?id=${row.TB_DEPO_ID}`
        );

        // Dokümana göre başarı kontrolü: status_code 200 ve has_error false
        if (response.status_code === 200 && !response.has_error) {
          // Başarılı mesajı 'status' alanından geliyor
          message.success(response.status || "Yakıt tankı başarıyla silindi.");
        } 
        // Dokümana göre hata durumu: status_code 400 (Örn: Hareket varsa)
        else if (response.status_code === 400 || response.has_error) {
          isError = true;
          // Backend'den gelen özel hata mesajını (hareket var uyarısını) gösteriyoruz
          message.error(response.status || "Silme işlemi başarısız.");
        }
      } catch (error) {
        isError = true;
        console.error("Silme işlemi sırasında hata oluştu:", error);
        message.error("Sunucu hatası, silinemedi.");
      }
    }

    // Eğer hiç hata yoksa veya işlem bittiyse tabloyu yenile ve menüyü kapat
    if (!isError) {
      refreshTableData(); 
      hidePopover();      
    }
  };

  return (
    <Popconfirm
      title="Silme İşlemi"
      description="Bu yakıt tankını kaydını silmek istediğinize emin misiniz?"
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
            Yakıt tankını kalıcı olarak siler. Geri alınamaz.
          </span>
        </div>
      </div>
    </Popconfirm>
  );
}