import React, { useState } from "react";
import { Button, Popover, Typography } from "antd";
import { MoreOutlined } from "@ant-design/icons";
import Sil from "./components/Sil";
import TarihceTablo from "./components/TarihceTablo";
import GirisFisleri from "../../../../Malzeme&DepoYonetimi/GirisFisleri/Insert/CreateDrawer";

const { Text, Link } = Typography;

export default function ContextMenu({ selectedRows, refreshTableData, onayCheck }) {
  const [visible, setVisible] = useState(false);

  const handleVisibleChange = (visible) => {
    setVisible(visible);
  };

  const hidePopover = () => {
    setVisible(false);
  };
  // Silme işlemi için disable durumunu kontrol et
  const isDisabled = selectedRows.some((row) => row.IST_DURUM_ID === 3 || row.IST_DURUM_ID === 4 || row.IST_DURUM_ID === 6);

  const content = (
    <div>
      {selectedRows.length >= 1 && <Sil selectedRows={selectedRows} refreshTableData={refreshTableData} disabled={isDisabled} hidePopover={hidePopover} />}
      {selectedRows.length === 1 && <TarihceTablo selectedRows={selectedRows} />}
      {selectedRows.length === 1 && <GirisFisleri selectedRows={selectedRows} numarator={true} siparisID={selectedRows[0].key} />}
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
