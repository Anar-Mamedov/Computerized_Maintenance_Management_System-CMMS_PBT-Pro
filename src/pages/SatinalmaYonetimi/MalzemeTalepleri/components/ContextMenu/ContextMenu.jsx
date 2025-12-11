import React, { useState } from "react";
import { Button, Popover, Typography } from "antd";
import { MoreOutlined } from "@ant-design/icons";

// Componentler
import Sil from "./components/Sil";
import TarihceTablo from "./components/TarihceTablo";
import Kapat from "./components/Kapat/Kapat"; 
import Iptal from "./components/Iptal/Iptal";
import SatinalmaSiparisleri from "./components/SatinalmaSiparisleri";
import OnayaGonder from "./components/OnayaGonder";
import TarihceOnayTablo from "./components/TarihceOnayTablo";
import OnayGeriAl from "./components/OnayGeriAl";
import SipariseAktar from "./components/SipariseAktar/EditDrawer";
import Teklif from "./components/Teklif/Teklif";
import Form from "./components/Form/Form";

const { Text } = Typography;

export default function ContextMenu({ selectedRows, refreshTableData, onayCheck }) {
  const [visible, setVisible] = useState(false);

  const handleVisibleChange = (visible) => {
    setVisible(visible);
  };

  const hidePopover = () => {
    setVisible(false);
  };

  // Silme işlemi için disable kontrolü
  const isDeleteDisabled = selectedRows.some(
    (row) =>
      row.SFS_TALEP_DURUM_ID === 3 ||
      row.SFS_TALEP_DURUM_ID === 4 ||
      row.SFS_TALEP_DURUM_ID === 6
  );

  const durumId = selectedRows.length === 1 ? selectedRows[0].SFS_TALEP_DURUM_ID : null;

  // Ortak props
  const commonProps = {
    selectedRows,
    refreshTableData,
    hidePopover,
    fisNo: selectedRows.length === 1 ? selectedRows[0].SFS_FIS_NO : null,
    baslik: selectedRows.length === 1 ? selectedRows[0].SFS_BASLIK : null,
  };

  // --- STİLLER ---
  
  // Temel Başlık Stili
  const baseHeaderStyle = {
    color: '#8c8c8c',
    fontSize: '11px',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    textAlign: 'right', // Sağa dayalı
    padding: '8px 12px 4px 12px', // İç boşluklar
  };

  // Ara Başlıklar İçin Stil (Üstte Çizgi Var)
  const separatorHeaderStyle = {
    ...baseHeaderStyle,
    borderTop: '1px solid #f0f0f0', // Çizgi üstte
    marginTop: '4px', // Önceki elemanla biraz mesafe
    paddingTop: '8px' // Çizgi ile yazı arası mesafe
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

  // --- GRUP 1: TALEP İŞLEMLERİ ---
  const renderTalepIslemleri = () => {
    
    // 1. Teklif Alma Butonu Kontrolü (4 BURADA VAR)
    const isTeklifAllowed = () => {
      // 3, 8 ve 4 (Red) durumlarında Teklif butonu görünsün
      if ([3, 4, 8].includes(durumId)) return true;
      // Onay kapalıysa Açık (1) durumda da görünsün
      if (!onayCheck && durumId === 1) return true;
      return false;
    };

    // 2. Siparişe Aktar Butonu Kontrolü (4 BURADA YOK)
    const isSiparisAllowed = () => {
      // Sadece 3 ve 8 durumlarında görünsün (4 YOK)
      if ([3, 8].includes(durumId)) return true;
      // Onay kapalıysa Açık (1) durumda da görünsün
      if (!onayCheck && durumId === 1) return true;
      return false;
    };

    return (
      <>
        <div style={baseHeaderStyle}>Talep İşlemleri</div>

        {/* 1. Talebi Aç / Kapat */}
        {[1, 2, 4, 5, 6, 8, 9].includes(durumId) && (
           <Kapat {...commonProps} />
        )}

        {/* 2. Onaya Gönder */}
        {onayCheck &&
          selectedRows.length >= 1 &&
          selectedRows.some((row) => row.SFS_TALEP_DURUM_ID === 0 || row.SFS_TALEP_DURUM_ID === 1 || row.SFS_TALEP_DURUM_ID === 9) && (
            <OnayaGonder {...commonProps} />
        )}

        {/* 3. Onayı Geri Al */}
        {durumId === 7 && <OnayGeriAl {...commonProps} />}

        {/* 4. Fiyat Teklifi Al (isTeklifAllowed kullanıyoruz - 4 Dahil) */}
        {isTeklifAllowed() && (
           <Teklif {...commonProps} selectedRow={selectedRows[0]} onRefresh={refreshTableData} />
        )}

        {/* 5. Siparişe Aktar (isSiparisAllowed kullanıyoruz - 4 Hariç) */}
        {isSiparisAllowed() && (
          <SipariseAktar selectedRow={selectedRows[0]} onRefresh={refreshTableData} />
        )}

        {/* 6. İptal Et */}
        {[1, 2, 3, 7, 8, 9].includes(durumId) && (
           <Iptal {...commonProps} />
        )}

        {/* 7. Sil */}
        <Sil {...commonProps} disabled={isDeleteDisabled} />
      </>
    );
  };

  // --- GRUP 2: İLGİLİ KAYITLAR ---
  const renderIlgiliKayitlar = () => {
    const showSatinalma = [2, 3, 4, 5].includes(durumId);
    
    // Durum 2 veya 5 (Kapalı) ise Teklifleri göster
    const showTeklifView = [2, 5].includes(durumId);

    if (!showSatinalma && !showTeklifView) return null;

    return (
      <>
        {/* Ayırıcı çizgi içeren stil kullanıldı */}
        <div style={separatorHeaderStyle}>İlgili Kayıtlar</div>

        {showSatinalma && <SatinalmaSiparisleri {...commonProps} />}

        {showTeklifView && (
           <Teklif 
             {...commonProps} 
             selectedRow={selectedRows[0]} 
             onRefresh={refreshTableData} 
             // disabled propunu kaldırdım, artık 5 olduğunda da içine girip bakabilirsin.
           />
        )}
      </>
    );
  };

  // --- GRUP 3: KAYIT VE TARİHÇE ---
  const renderKayitVeTarihce = () => {
    return (
      <>
        {/* Ayırıcı çizgi içeren stil kullanıldı */}
        <div style={separatorHeaderStyle}>Kayıt ve Tarihçe</div>

        <TarihceTablo {...commonProps} />
        <TarihceOnayTablo {...commonProps} />
      </>
    );
  };

  // --- GRUP 4: FORM ---
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
      {selectedRows.length >= 1 && (
        <>
          {renderTalepIslemleri()}
          {renderIlgiliKayitlar()}
          {renderKayitVeTarihce()}
          {renderForm()}
        </>
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
        <MoreOutlined
          style={{ color: "white", fontSize: "20px", margin: "0" }}
        />
      </Button>
    </Popover>
  );
}