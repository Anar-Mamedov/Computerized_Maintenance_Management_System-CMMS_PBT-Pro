import React, { useState } from "react";
import { Button, Popover, Typography } from "antd";
import { ApartmentOutlined, DeleteOutlined, MoreOutlined } from "@ant-design/icons";
import Sil from "./components/Sil";
import DepoDurumModal from "../../../../../utils/components/DepoDurumModal";

const { Text } = Typography;

export default function ContextMenu({ selectedRows, refreshTableData }) {
  const [visible, setVisible] = useState(false);

  const handleVisibleChange = (visible) => {
    setVisible(visible);
  };

  const hidePopover = () => {
    setVisible(false);
  };

  const hasSingleSelection = selectedRows?.length === 1;
  const selectedStokId = hasSingleSelection ? selectedRows?.[0]?.TB_STOK_ID ?? selectedRows?.[0]?.key ?? null : null;
  const selectedStokKod = hasSingleSelection ? selectedRows?.[0]?.STK_KOD ?? null : null;

  const sectionTitleStyle = {
    fontSize: 12,
    fontWeight: 600,
    letterSpacing: 0.3,
    color: "#6B7280",
    textTransform: "uppercase",
    marginBottom: 10,
  };

  const actionButtonStyle = {
    width: "100%",
    textAlign: "left",
    height: "auto",
    padding: "12px 8px",
    display: "flex",
    alignItems: "flex-start",
    gap: 12,
    borderRadius: 10,
  };

  const ActionContent = ({ icon, iconColor, title, description }) => (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
      <span style={{ color: iconColor, fontSize: 20, lineHeight: "20px" }}>{icon}</span>
      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <span style={{ fontWeight: 700, color: "#111827" }}>{title}</span>
        {description && <span style={{ color: "#6B7280", fontSize: 13, lineHeight: 1.45 }}>{description}</span>}
      </div>
    </div>
  );

  const content = (
    <div style={{ display: "flex", flexDirection: "column", gap: 14, minWidth: 320, maxWidth: 360, background: "#fff", padding: "8px 12px" }}>
      {selectedRows.length >= 1 ? (
        <>
          {hasSingleSelection && (
            <div style={{ borderBottom: "1px solid #F3F4F6", paddingBottom: 6 }}>
              <Text style={sectionTitleStyle}>Stok İşlemleri</Text>
              <DepoDurumModal
                stokId={selectedStokId}
                stokKod={selectedStokKod}
                onOpenModal={hidePopover}
                triggerLabel={
                  <ActionContent icon={<ApartmentOutlined />} iconColor="#2563EB" title="Depodaki Durumu" description="Seçili stok için depodaki dağılımı görüntüler." />
                }
                buttonProps={{
                  style: actionButtonStyle,
                }}
              />
            </div>
          )}

          <div style={{ borderBottom: "1px solid #F3F4F6", paddingBottom: 6, paddingTop: 2 }}>
            <Text style={sectionTitleStyle}>Kayıt</Text>
            <Sil
              selectedRows={selectedRows}
              refreshTableData={refreshTableData}
              hidePopover={hidePopover}
              renderTrigger={() => (
                <Button type="text" style={actionButtonStyle} danger>
                  <ActionContent icon={<DeleteOutlined />} iconColor="#DC2626" title="Sil" description="Stok kaydını kalıcı olarak siler. Geri alınamaz." />
                </Button>
              )}
            />
          </div>
        </>
      ) : (
        <div style={{ padding: "8px 0" }}>
          <Text type="secondary">İşlem yapmak için en az bir satır seçin.</Text>
        </div>
      )}
    </div>
  );
  return (
    <Popover placement="bottom" content={content} trigger="click" open={visible} onOpenChange={handleVisibleChange}>
      <Button
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "0px 5px",
          backgroundColor: "#2BC770",
          borderColor: "#2BC770",
          height: "32px",
        }}
      >
        {selectedRows.length >= 1 && <Text style={{ color: "white", marginLeft: "3px" }}>{selectedRows.length}</Text>}
        <MoreOutlined style={{ color: "white", fontSize: "20px", margin: "0" }} />
      </Button>
    </Popover>
  );
}
