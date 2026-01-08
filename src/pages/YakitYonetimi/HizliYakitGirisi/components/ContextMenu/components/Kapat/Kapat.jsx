import React from "react";
import AxiosInstance from "../../../../../../../api/http";
import { message, Popconfirm } from "antd";
import { CheckCircleOutlined, FolderOpenOutlined, QuestionCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";

export default function Kapat({ selectedRows, refreshTableData, disabled, hidePopover }) {
  const buttonStyle = disabled ? { display: "none" } : {};

  const durumID = selectedRows?.[0]?.SFS_TALEP_DURUM_ID;
  // Durum 5 veya 6 ise "Kapalı"dır, bu yüzden "Aç" seçeneği gösterilir.
  const isAc = durumID === 5 || durumID === 6;

  const handleClick = async () => {
    let isError = false;

    for (const row of selectedRows) {
      try {
        const response = await AxiosInstance.post(
          `MalzemeTalepAcKapatBy?fisID=${row.key}`
        );
        if (response.status_code === 200) {
          message.success(response.message || "İşlem başarılı.");
        } else {
          isError = true;
          message.error(response.message || "İşlem başarısız.");
        }
      } catch (error) {
        isError = true;
        console.error("Hata:", error);
        message.error("Sunucu hatası.");
      }
    }

    if (!isError) {
      refreshTableData();
      hidePopover();
    }
  };

  // --- İKON VE METİN AYARLARI ---
  
  // Talebi Aç Ayarları (YEŞİL)
  const openConfig = {
    title: "Talebi Aç",
    desc: "Kapalı talebi tekrar açar ve işleme alır.",
    // Klasör ikonu, YEŞİL
    icon: <CheckCircleOutlined style={{ color: "#27ae60", fontSize: '18px', marginTop: '4px' }} />, 
    popconfirmColor: "blue"
  };

  // Talebi Kapat Ayarları (KIRMIZI)
  const closeConfig = {
    title: "Talebi Kapat",
    desc: "Talep sürecini sonlandırır ve kapatır.",
    // Kapatma/Tamamlama ikonu, KIRMIZI
    // İsteğe göre ikon CheckCircle (Tamamla) veya CloseCircle (Kapat) olabilir.
    // Metin "Kapat" olduğu için ve renk kırmızı istendiği için CheckCircleOutlined kullandım ama rengi kırmızı yaptım.
    icon: <CheckCircleOutlined style={{ color: "#cf1322", fontSize: '18px', marginTop: '4px' }} />,
    popconfirmColor: "red"
  };

  // Geçerli konfigürasyonu seç
  const currentConfig = isAc ? openConfig : closeConfig;

  return (
    <Popconfirm
      title={currentConfig.title}
      description="Bu işlemi yapmak istediğinize emin misiniz?"
      onConfirm={handleClick}
      okText="Evet"
      cancelText="Hayır"
      icon={<QuestionCircleOutlined style={{ color: currentConfig.popconfirmColor }} />}
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
        {/* İkon Alanı */}
        <div>
          {currentConfig.icon}
        </div>

        {/* Metin Alanı */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontWeight: '500', color: '#262626', fontSize: '14px', lineHeight: '1.2' }}>
            {currentConfig.title}
          </span>
          <span style={{ fontSize: '12px', color: '#8c8c8c', marginTop: '4px', lineHeight: '1.4' }}>
            {currentConfig.desc}
          </span>
        </div>
      </div>
    </Popconfirm>
  );
}