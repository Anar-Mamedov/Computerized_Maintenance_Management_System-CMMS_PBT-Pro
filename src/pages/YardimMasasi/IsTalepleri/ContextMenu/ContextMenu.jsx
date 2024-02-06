import React, { useState } from "react";
import { Button, Popover } from "antd";
import Sil from "./components/Sil";

export default function ContextMenu({ selectedRows, refreshTableData }) {
  const [visible, setVisible] = useState(false);

  const handleVisibleChange = (visible) => {
    setVisible(visible);
  };

  const hidePopover = () => {
    setVisible(false);
  };
  // Silme işlemi için disable durumunu kontrol et
  const isDisabled = selectedRows.some((row) => row.IST_DURUM_ID === 3 || row.IST_DURUM_ID === 4);

  const content = (
    <div>
      <Sil
        selectedRows={selectedRows}
        refreshTableData={refreshTableData}
        disabled={isDisabled}
        hidePopover={hidePopover}
      />
      <p>Content</p>
    </div>
  );
  return (
    <Popover placement="bottom" content={content} trigger="click" open={visible} onOpenChange={handleVisibleChange}>
      <Button>İşlemler</Button>
    </Popover>
  );
}
