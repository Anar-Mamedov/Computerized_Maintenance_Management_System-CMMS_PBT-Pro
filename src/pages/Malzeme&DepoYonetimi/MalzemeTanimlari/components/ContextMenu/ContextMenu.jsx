import React, { useCallback, useMemo, useState } from "react";
import { Button, Popover, Typography } from "antd";
import { ApartmentOutlined, DeleteOutlined, MoreOutlined } from "@ant-design/icons";
import Sil from "./components/Sil";
import DepoDurumModal from "../../../../../utils/components/DepoDurumModal";

const { Text } = Typography;

const baseHeaderStyle = {
  color: "#8c8c8c",
  fontSize: "11px",
  fontWeight: "600",
  textTransform: "uppercase",
  letterSpacing: "0.5px",
  textAlign: "right",
  padding: "8px 12px 4px 12px",
};

const separatorHeaderStyle = {
  ...baseHeaderStyle,
  borderTop: "1px solid #f0f0f0",
  marginTop: "4px",
  paddingTop: "8px",
};

const contentContainerStyle = {
  width: "260px",
  padding: "0",
  display: "flex",
  flexDirection: "column",
  maxHeight: "60vh",
  overflowY: "auto",
  overflowX: "hidden",
};

export default function ContextMenu({ selectedRows = [], refreshTableData }) {
  const [visible, setVisible] = useState(false);
  const selectionCount = Array.isArray(selectedRows) ? selectedRows.length : 0;
  const hasSingleSelection = selectionCount === 1;
  const selectedRow = hasSingleSelection ? selectedRows[0] : null;
  const selectedStokId = selectedRow?.TB_STOK_ID ?? selectedRow?.key ?? null;
  const selectedStokKod = selectedRow?.STK_KOD ?? null;

  const hidePopover = useCallback(() => setVisible(false), []);
  const handleVisibleChange = useCallback((nextVisible) => setVisible(nextVisible), []);

  const content = useMemo(() => {
    if (selectionCount < 1) {
      return (
        <div style={{ padding: "12px" }}>
          <Text type="secondary">İşlem yapmak için en az bir satır seçin.</Text>
        </div>
      );
    }

    return (
      <>
        {hasSingleSelection && (
          <>
            <div style={baseHeaderStyle}>Stok İşlemleri</div>
            <DepoDurumModal
              stokId={selectedStokId}
              stokKod={selectedStokKod}
              onOpenModal={hidePopover}
              icon={<ApartmentOutlined />}
              iconColor="#535c68"
              title="Depodaki Durumu"
              description="Seçili stok için depodaki dağılımı görüntüler."
            />
          </>
        )}

        <div style={hasSingleSelection ? separatorHeaderStyle : baseHeaderStyle}>Kayıt</div>
        <Sil
          selectedRows={selectedRows}
          refreshTableData={refreshTableData}
          hidePopover={hidePopover}
          icon={<DeleteOutlined />}
          iconColor="#DC2626"
          title="Sil"
          description="Stok kaydını kalıcı olarak siler. Geri alınamaz."
        />
      </>
    );
  }, [hasSingleSelection, hidePopover, refreshTableData, selectedRows, selectedStokId, selectedStokKod, selectionCount]);

  return (
    <Popover placement="bottom" content={<div style={contentContainerStyle}>{content}</div>} trigger="click" open={visible} onOpenChange={handleVisibleChange} arrow={false} overlayInnerStyle={{ padding: 0 }}>
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
        {selectionCount >= 1 && <Text style={{ color: "white", marginLeft: "3px" }}>{selectionCount}</Text>}
        <MoreOutlined style={{ color: "white", fontSize: "20px", margin: "0" }} />
      </Button>
    </Popover>
  );
}
