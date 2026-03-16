import React from "react";
import AxiosInstance from "../../../../../../api/http";
import { message, Popconfirm } from "antd";
import { UndoOutlined, QuestionCircleOutlined } from "@ant-design/icons"; // UndoOutlined eklendi

export default function OnayiGeriAl({ selectedRows, refreshTableData, disabled, hidePopover }) {
  const buttonStyle = disabled ? { display: "none" } : {};

  const handleDelete = async () => {
    let isError = false;
    for (const row of selectedRows) {
      try {
        const fisId = row.key || row.ONAY_TABLO_ID || 0;
        const response = await AxiosInstance.post(`OnayGeriAlBy?fisId=${fisId}`);
        if (response.status_code === 200 || response.status_code === 201) {
          message.success("İşlem Başarılı.");
        } else if (response.status_code === 401) {
          message.error("Yetkiniz yok.");
        } else {
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
      title="Onayı Geri Al"
      description="Onaya gönderme işlemini geri almak emin misiniz?"
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
           {/* Görseldeki turuncu renk */}
          <UndoOutlined style={{ color: '#d46b08', fontSize: '18px', marginTop: '4px' }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontWeight: '500', color: '#262626', fontSize: '14px', lineHeight: '1.2' }}>
            Onayı Geri Al
          </span>
          <span style={{ fontSize: '12px', color: '#8c8c8c', marginTop: '4px', lineHeight: '1.4' }}>
            Verilen onayı geri alır, talebi önceki duruma çeker.
          </span>
        </div>
      </div>
    </Popconfirm>
  );
}