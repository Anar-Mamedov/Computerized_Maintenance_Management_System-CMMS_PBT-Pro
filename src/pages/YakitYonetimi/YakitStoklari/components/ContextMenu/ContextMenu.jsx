import React, { useState } from "react";
import { Button, Popover, Typography } from "antd";
import { MoreOutlined } from "@ant-design/icons";

// Componentler
import Sil from "./components/Sil";
import DepoDetay from "./components/TarihceOnayTablo";

const { Text } = Typography;

export default function ContextMenu({ selectedRows, refreshTableData }) {
  const [visible, setVisible] = useState(false);

  const handleVisibleChange = (visible) => {
    setVisible(visible);
  };

  const hidePopover = () => {
    setVisible(false);
  };

  // Ortak props
  const commonProps = {
    selectedRows,
    refreshTableData,
    hidePopover,
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

  const content = (
    <div style={contentContainerStyle}>
      {selectedRows.length >= 1 && (
        <>
          {/* Herhangi bir koşula bağlı olmadan Sil gösterilir (disabled false) */}
          <Sil {...commonProps} disabled={false} />
          <DepoDetay {...commonProps} disabled={false} />
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