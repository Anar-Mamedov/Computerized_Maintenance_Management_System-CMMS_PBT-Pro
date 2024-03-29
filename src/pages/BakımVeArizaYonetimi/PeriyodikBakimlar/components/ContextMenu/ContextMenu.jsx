import { useState } from "react";
import { Button, Popover } from "antd";
import { MoreOutlined } from "@ant-design/icons";
import Sil from "./components/Sil";
import Iptal from "./components/Iptal/Iptal";
import Kapat from "./components/Kapat/Kapat";
import Parametreler from "./components/Parametreler/Parametreler";
import TarihceTablo from "./components/TarihceTablo";

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
  const iptalDisabled = selectedRows.some(
    (row) => row.IST_DURUM_ID === 3 || row.IST_DURUM_ID === 2 || row.IST_DURUM_ID === 4 || row.IST_DURUM_ID === 5
  );
  const kapatDisabled = selectedRows.some(
    (row) => row.IST_DURUM_ID === 4 || row.IST_DURUM_ID === 5 || row.IST_DURUM_ID === 3
  );

  const content = (
    <div>
      <Sil
        selectedRows={selectedRows}
        refreshTableData={refreshTableData}
        disabled={isDisabled}
        hidePopover={hidePopover}
      />
      <Iptal selectedRows={selectedRows} refreshTableData={refreshTableData} iptalDisabled={iptalDisabled} />
      <Kapat selectedRows={selectedRows} refreshTableData={refreshTableData} kapatDisabled={kapatDisabled} />
      <Parametreler />
      {selectedRows.length === 1 && <TarihceTablo selectedRows={selectedRows} />}
    </div>
  );
  return (
    <Popover placement="bottom" content={content} trigger="click" open={visible} onOpenChange={handleVisibleChange}>
      <Button
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "0px 0px",
          backgroundColor: "#2BC770",
          borderColor: "#2BC770",
          width: "32px",
          height: "32px",
        }}>
        <MoreOutlined style={{ color: "white", fontSize: "20px" }} />
      </Button>
    </Popover>
  );
}
