import React, { useState } from "react";
import { Button, Popover } from "antd";
import { MoreOutlined } from "@ant-design/icons";
import TedarikciListesi from "./TedarikciListesi/TedarikciListesi";
import DepoStokListesi from "./DepoStokListesi/DepoStokListesi";
import MalzemeHareketleri from "./MalzemeHareketleri/MalzemeHareketleri";
import MalzemeTarihce from "./MalzemeTarihce/MalzemeTarihce";

export default function ContextMenu({ selectedRowId, refreshTableData, onayCheck }) {
  const [visible, setVisible] = useState(false);

  const handleVisibleChange = (newVisible) => {
    setVisible(newVisible);
  };

  const hidePopover = () => {
    setVisible(false);
  };

  const content = (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, minWidth: 220 }}>
      <TedarikciListesi selectedRowId={selectedRowId} hidePopover={hidePopover} />
      <DepoStokListesi selectedRowId={selectedRowId} hidePopover={hidePopover} />
      <MalzemeHareketleri selectedRowId={selectedRowId} hidePopover={hidePopover} />
      <MalzemeTarihce selectedRowId={selectedRowId} hidePopover={hidePopover} />
    </div>
  );

  return (
    <Popover
      placement="bottom"
      content={content}
      trigger="click"
      open={visible}
      onOpenChange={handleVisibleChange}
    >
      <Button
        disabled={!selectedRowId}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 5px",
          backgroundColor: "#2BC770",
          borderColor: "#2BC770",
          height: 32,
        }}
      >
        <MoreOutlined style={{ color: "white", fontSize: 20, margin: 0 }} />
      </Button>
    </Popover>
  );
}