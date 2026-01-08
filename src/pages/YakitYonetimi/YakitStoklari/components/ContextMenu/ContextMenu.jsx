import React, { useState } from "react";
import { Button, Popover, Typography } from "antd";
import { MoreOutlined } from "@ant-design/icons";

// Componentler
import Sil from "./components/Sil";
import TarihceTablo from "./components/TarihceTablo";
import Kapat from "./components/Kapat/Kapat";
import Iptal from "./components/Iptal/Iptal";
import Ac from "./components/Ac/Ac"; // Yeniden Aç componenti
import GirisFisleri from "../../../../Malzeme&DepoYonetimi/GirisFisleri/Insert/CreateDrawer";
import Form from "./components/Form/Form";

const { Text } = Typography;

export default function ContextMenu({ selectedRows, refreshTableData }) {
  const [visible, setVisible] = useState(false);

  const handleVisibleChange = (visible) => {
    setVisible(visible);
  };

  const hidePopover = () => {
    setVisible(false);
  };

  const durumId = selectedRows.length === 1 ? selectedRows[0].SSP_DURUM_ID : null;
  const isKapaliOrIptal = durumId === 3 || durumId === 4;

  // Ortak props
  const commonProps = {
    selectedRows,
    refreshTableData,
    hidePopover,
    fisNo: selectedRows.length === 1 ? selectedRows[0].SSP_SIPARIS_KODU : null,
  };

  // --- STİLLER ---
  
  // Temel Başlık Stili (Çizgisiz)
  const baseHeaderStyle = {
    color: '#8c8c8c',
    fontSize: '11px',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    textAlign: 'right', 
    padding: '8px 12px 4px 12px',
  };

  // Ara Başlıklar İçin Stil (Üstte Çizgi Var)
  const separatorHeaderStyle = {
    ...baseHeaderStyle,
    borderTop: '1px solid #f0f0f0', 
    marginTop: '4px', 
    paddingTop: '8px'
  };

  const contentContainerStyle = {
    width: '260px', 
    padding: '0',
    display: 'flex',
    flexDirection: 'column',
    maxHeight: '60vh',
    overflowY: 'auto',
    overflowX: 'hidden',
  };

  // --- GRUP 1: SİPARİŞ İŞLEMLERİ ---
  const renderSiparisIslemleri = () => {
    return (
      <>
        <div style={baseHeaderStyle}>Sipariş İşlemleri</div>

        {/* Duruma göre butonlar */}
        {(durumId === 1 || durumId === 5) && <Iptal {...commonProps} />}
        {durumId !== 3 && durumId !== 4 && <Kapat {...commonProps} />}
        {(durumId === 3) && <Ac {...commonProps} />}

        {/* Giriş Fişleri (Eğer tek satır seçiliyse) */}
        {selectedRows.length === 1 && !isKapaliOrIptal && (
          <GirisFisleri 
            selectedRows={selectedRows} 
            numarator={true} 
            siparisID={selectedRows[0].key} 
            onRefresh={refreshTableData} 
          />
        )}

        {/* Sil İşlemi */}
        <Sil {...commonProps} />
      </>
    );
  };

  // --- GRUP 2: KAYIT VE TARİHÇE ---
  const renderKayitVeTarihce = () => {
    return (
      <>
        {/* Ayırıcı çizgi içeren stil */}
        <div style={separatorHeaderStyle}>Kayıt ve Tarihçe</div>
        
        <TarihceTablo {...commonProps} />
      </>
    );
  };

  // --- GRUP 3: FORM ---
  const renderForm = () => {
    return (
      <>
        <div style={separatorHeaderStyle}>Form</div>
        
        <Form {...commonProps} />
      </>
    );
  };

  const content = (
    <div style={contentContainerStyle}>
      {selectedRows.length >= 1 ? (
        <>
          {renderSiparisIslemleri()}
          {renderKayitVeTarihce()}
          {renderForm()}
        </>
      ) : (
        <div style={{ padding: '10px', color: '#999', textAlign: 'center' }}>Lütfen bir satır seçiniz.</div>
      )}
    </div>
  );

  return (
    <Popover
      placement="bottomRight"
      content={content}
      trigger="click"
      open={visible}
      arrow={false}
      onOpenChange={handleVisibleChange}
      overlayInnerStyle={{ padding: 0 }}
    >
      <Button
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "0px 10px",
          backgroundColor: "#2BC770",
          borderColor: "#2BC770",
          height: "32px",
          minWidth: "60px"
        }}
      >
        {selectedRows.length >= 1 && (
          <Text style={{ color: "white", marginRight: "8px", fontWeight: 600 }}>
            {selectedRows.length}
          </Text>
        )}
        <MoreOutlined style={{ color: "white", fontSize: "20px", margin: "0" }} />
      </Button>
    </Popover>
  );
}
