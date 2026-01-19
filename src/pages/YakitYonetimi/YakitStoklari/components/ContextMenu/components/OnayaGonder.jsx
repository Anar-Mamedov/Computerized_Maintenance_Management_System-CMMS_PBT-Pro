import React from "react";
import AxiosInstance from "../../../../../../api/http";
import { message, Popconfirm } from "antd";
import { SendOutlined, QuestionCircleOutlined } from "@ant-design/icons"; // SendOutlined eklendi

export default function OnayaGonder({ selectedRows, refreshTableData, disabled, hidePopover }) {
  const buttonStyle = disabled ? { display: "none" } : {};

  const handleDelete = async () => {
    let isError = false;
    for (const row of selectedRows) {
      try {
        const response = await AxiosInstance.post(`OnayaGonder`, {
          ONAY_TABLO_ID: Number(row.key) || 0,
          ONAY_TABLO_KOD: row.SFS_FIS_NO || "",
          ONAY_ONYTANIM_ID: 3
        });
        if (response.status_code === 200 || response.status_code === 201) {
          message.success("İşlem Başarılı.");
        } else if (response.status_code === 401) {
          message.error("Bu işlemi yapmaya yetkiniz bulunmamaktadır.");
        } else {
          isError = true;
          message.error("İşlem Başarısız.");
        }
      } catch (error) {
        console.error("Hata:", error);
      }
    }
    if (!isError) {
      refreshTableData();
      hidePopover();
    }
  };

  return (
    <Popconfirm
      title="Onaya Gönderme İşlemi"
      description="Bu öğeyi onaya göndermek istediğinize emin misiniz?"
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
          <SendOutlined style={{ color: '#595959', fontSize: '18px', marginTop: '4px' }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontWeight: '500', color: '#262626', fontSize: '14px', lineHeight: '1.2' }}>
            Onaya Gönder
          </span>
          <span style={{ fontSize: '12px', color: '#8c8c8c', marginTop: '4px', lineHeight: '1.4' }}>
            Talebi onay sürecine gönderir.
          </span>
        </div>
      </div>
    </Popconfirm>
  );
}