import React, { useCallback, useMemo, useState } from "react";
import { Button, Popover, Typography } from "antd";
import { CalendarOutlined, CloseCircleOutlined, HistoryOutlined, MoreOutlined } from "@ant-design/icons";
import { t } from "i18next";
import IleriTarihePlanla from "./IleriTarihePlanla.jsx";
import PeriyodikBakimIptal from "./PeriyodikBakimIptal.jsx";
import Tarihce from "./Tarihce.jsx";

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
  width: "280px",
  padding: "0",
  display: "flex",
  flexDirection: "column",
  maxHeight: "60vh",
  overflowY: "auto",
  overflowX: "hidden",
};

export default function ContextMenu({ selectedRows, refreshTableData, makineId }) {
  const [visible, setVisible] = useState(false);
  const selectionCount = Array.isArray(selectedRows) ? selectedRows.length : 0;
  const hasSingleSelection = selectionCount === 1;

  const handleVisibleChange = useCallback((nextVisible) => {
    setVisible(nextVisible);
  }, []);

  const hidePopover = useCallback(() => {
    setVisible(false);
  }, []);

  const content = useMemo(() => {
    if (selectionCount < 1) {
      return (
        <div style={{ padding: "12px" }}>
          <Text type="secondary">{t("islemIcinSecim", { defaultValue: "İşlem yapmak için en az bir satır seçin." })}</Text>
        </div>
      );
    }

    return (
      <>
        <div style={baseHeaderStyle}>{t("bakimIslemleri", { defaultValue: "Bakım İşlemleri" })}</div>
        {hasSingleSelection && (
          <IleriTarihePlanla
            selectedRows={selectedRows}
            refreshTableData={refreshTableData}
            hidePopover={hidePopover}
            makineId={makineId}
            icon={<CalendarOutlined />}
            iconColor="#2563eb"
          />
        )}
        {hasSingleSelection && (
          <PeriyodikBakimIptal
            selectedRows={selectedRows}
            refreshTableData={refreshTableData}
            hidePopover={hidePopover}
            makineId={makineId}
            icon={<CloseCircleOutlined />}
            iconColor="#dc2626"
          />
        )}

        {makineId && (
          <>
            <div style={separatorHeaderStyle}>{t("kayitVeTarihce", { defaultValue: "Kayıt ve Tarihçe" })}</div>
            <Tarihce
              makineId={makineId}
              hidePopover={hidePopover}
              icon={<HistoryOutlined />}
              iconColor="#0f766e"
            />
          </>
        )}
      </>
    );
  }, [hasSingleSelection, hidePopover, makineId, refreshTableData, selectedRows, selectionCount, t]);

  return (
    <Popover
      placement="bottom"
      content={<div style={contentContainerStyle}>{content}</div>}
      trigger="click"
      open={visible}
      onOpenChange={handleVisibleChange}
      arrow={false}
      overlayInnerStyle={{ padding: 0 }}
    >
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
