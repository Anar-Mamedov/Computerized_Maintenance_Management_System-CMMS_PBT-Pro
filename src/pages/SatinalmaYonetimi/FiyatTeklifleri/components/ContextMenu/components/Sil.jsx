import React from "react";
import AxiosInstance from "../../../../../../api/http";
import { message, Popconfirm } from "antd";
import { DeleteOutlined, QuestionCircleOutlined } from "@ant-design/icons";

export default function Sil({ selectedRows, refreshTableData, disabled, hidePopover }) {
  const buttonStyle = disabled ? { display: "none" } : {};

  const handleDelete = async () => {
    let isError = false;

    for (const row of selectedRows) {
      try {
        const response = await AxiosInstance.post(
          `DeleteSatinalmaSiparis?siparisId=${row.key}`
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

  return (
    <Popconfirm
      title="Silme İşlemi"
      description="Bu öğeyi silmek istediğinize emin misiniz?"
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
            Sipariş kaydını kalıcı olarak siler. Geri alınamaz.
          </span>
        </div>
      </div>
    </Popconfirm>
  );
}