import React, { useState } from "react";
import { Modal } from "antd";
import TalepTeklifeAktarmaAntd from "./components/TalepTeklifAktarmaAntd";
import { CommentOutlined } from "@ant-design/icons"; // Konuşma balonu ikonu

export default function TalepTeklifeAktarmaModal({ selectedRow, refreshTableData, disabled = false }) {
  const [open, setOpen] = useState(false);

  const showModal = () => setOpen(true);
  const handleCancel = () => {
    setOpen(false);
    if (typeof refreshTableData === "function") {
      refreshTableData();
    }
  };

  // Duruma göre Başlık ve Açıklama belirleme
  const isViewMode = selectedRow && (selectedRow.SFS_TALEP_DURUM_ID === 2 || selectedRow.SFS_TALEP_DURUM_ID === 5 || selectedRow.SFS_TALEP_DURUM_ID === 3);
  
  const titleText = isViewMode ? "Fiyat Teklifleri" : "Fiyat Teklifi Al";
  const descText = isViewMode 
    ? "Tedarikçi tekliflerini görüntüle." 
    : "Tedarikçilere fiyat talebi gönder.";

  return (
    <>
      <div
        className="menu-item-hover"
        onClick={showModal}
        style={{
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
          {/* Görseldeki konuşma balonu ikonu */}
          <CommentOutlined style={{ color: '#595959', fontSize: '18px', marginTop: '4px' }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontWeight: '500', color: '#262626', fontSize: '14px', lineHeight: '1.2' }}>
            {titleText}
          </span>
          <span style={{ fontSize: '12px', color: '#8c8c8c', marginTop: '4px', lineHeight: '1.4' }}>
            {descText}
          </span>
        </div>
      </div>

      <Modal
        title={titleText}
        open={open}
        onCancel={handleCancel}
        footer={null}
        width="73%"
        style={{ top: 20 }}
        styles={{ body: { maxHeight: "80vh", overflowY: "auto" } }} // 'Style' prop hatası düzeltildi (styles)
      >
        <TalepTeklifeAktarmaAntd 
          fisId={selectedRow?.TB_STOK_FIS_ID} 
          baslik={selectedRow?.SFS_BASLIK} 
          fisNo={selectedRow?.SFS_FIS_NO} 
          refreshTableData={refreshTableData} 
          disabled={disabled} 
        />
      </Modal>
    </>
  );
}