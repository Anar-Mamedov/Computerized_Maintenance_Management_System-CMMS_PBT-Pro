import React from "react";
import { message } from "antd";
import { FilePdfOutlined } from "@ant-design/icons";
import AxiosInstance from "../../../../../../../api/http";

const Form = ({ selectedRows }) => {
  
  const divStyle = {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    cursor: 'pointer',
    padding: '10px 12px',
    transition: 'background-color 0.3s',
    width: '100%'
  };

  const downloadPdf = async () => {
    if (!selectedRows || selectedRows.length === 0) {
      message.warning("Lütfen formunu indirmek istediğiniz satırı seçin.");
      return;
    }

    // Seçili her satır için döngü
    for (const row of selectedRows) {
      // 1. ADIM: API'ye gitmeden ÖNCE boş bir pencere açıyoruz.
      // Bu sayede tarayıcı "Kullanıcı tıkladı, izin ver" der.
      const newWindow = window.open("", "_blank");

      try {
        // 2. ADIM: API isteğini atıyoruz
        const response = await AxiosInstance.get(`GetRaporLink?formId=12&tabloId=${row.key}`);

        // Axios genelde veriyi response.data içinde döner, senin yapına göre ikisini de kontrol ediyoruz.
        // Gelen JSON: { "status_code": 200, "raporLink": "..." }
        const data = response.data || response; 

        if (data.status_code === 200 && data.raporLink) {
          // 3. ADIM: Link geldiyse, açtığımız boş pencereyi o linke yönlendiriyoruz
          if (newWindow) {
            newWindow.location.href = data.raporLink;
          }
        } else {
          // Hata varsa pencereyi kapatıp uyarı verelim
          if (newWindow) newWindow.close();
          message.error(`Rapor linki alınamadı! (ID: ${row.key})`);
        }
      } catch (error) {
        console.error("PDF link hatası:", error);
        if (newWindow) newWindow.close(); // Hata durumunda boş pencereyi kapat
        message.error("Sunucu ile iletişim hatası.");
      }
    }
  };

  return (
    <div
      className="menu-item-hover"
      style={divStyle}
      onClick={downloadPdf}
      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'}
      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
    >
      <div>
        <FilePdfOutlined style={{ color: '#ff4d4f', fontSize: '18px', marginTop: '4px' }} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <span style={{ fontWeight: '500', color: '#262626', fontSize: '14px', lineHeight: '1.2' }}>
          Malzeme Talebi Formu
        </span>
        <span style={{ fontSize: '12px', color: '#8c8c8c', marginTop: '4px', lineHeight: '1.4' }}>
          Seçili malzeme talep formunu PDF olarak açar.
        </span>
      </div>
    </div>
  );
};

export default Form;