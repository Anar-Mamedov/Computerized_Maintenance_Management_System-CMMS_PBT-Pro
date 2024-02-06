import React from "react";
import { Button, Popover } from "antd";
import Sil from "./components/Sil";

export default function ContextMenu({ selectedRows, refreshTableData }) {
  // Silme işlemi için disable durumunu kontrol et
  const isDisabled = selectedRows.some((row) => row.IST_DURUM_ID === 3 || row.IST_DURUM_ID === 4);

  const content = (
    <div>
      <Sil selectedRows={selectedRows} onRefresh={refreshTableData} disabled={isDisabled} />
      <p>Content</p>
    </div>
  );
  return (
    <Popover placement="bottom" content={content} trigger="click">
      <Button>İşlemler</Button>
    </Popover>
  );
}
