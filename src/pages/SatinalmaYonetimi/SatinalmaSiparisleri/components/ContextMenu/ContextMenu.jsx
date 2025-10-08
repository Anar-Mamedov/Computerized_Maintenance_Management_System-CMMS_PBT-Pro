import React, { useState } from "react";
import { Button, Popover, Typography } from "antd";
import { MoreOutlined } from "@ant-design/icons";
// Gerçek işlem yapan componentler
import Sil from "./components/Sil";
import TarihceTablo from "./components/TarihceTablo";
import Kapat from "./components/Kapat/Kapat";
import Iptal from "./components/Iptal/Iptal";
import Ac from "./components/Ac/Ac";
import GirisFisleri from "../../../../Malzeme&DepoYonetimi/GirisFisleri/Insert/CreateDrawer";

const { Text } = Typography;

export default function ContextMenu({ selectedRows, refreshTableData }) {
  const [visible, setVisible] = useState(false);

  const hidePopover = () => setVisible(false);

  const durumId = selectedRows.length === 1 ? selectedRows[0].SSP_DURUM_ID : null;

  const commonProps = {
    selectedRows,
    refreshTableData,
    hidePopover,
    fisNo: selectedRows.length === 1 ? selectedRows[0].SSP_SIPARIS_KODU : null,
  };

  const renderButtonsByDurum = (id) => {
    switch (id) {
      case 1:
      case 5:
        return <Iptal {...commonProps} />; // İptal Et
      case 6:
      case 2:
        return <Kapat {...commonProps} />; // Kapat
      case 4:
      case 3:
        return <Ac {...commonProps} />; //Aç
      default:
        return null;
    }
  };

  const content = (
    <div>
      {durumId && renderButtonsByDurum(durumId)}

      {/* Sil ve Tarihçe her durumda gözükecek */}
        <Sil {...commonProps} />
      <div style={{ marginTop: 10 }}>
        <TarihceTablo {...commonProps} />
      </div>
      {selectedRows.length === 1 && <GirisFisleri selectedRows={selectedRows} numarator={true} siparisID={selectedRows[0].key} onRefresh={refreshTableData} />}
    </div>
  );

  return (
    <Popover
      placement="bottom"
      content={content}
      trigger="click"
      open={visible}
      onOpenChange={setVisible}
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
        {selectedRows.length > 0 && (
          <Text style={{ color: "white", marginLeft: "3px" }}>
            {selectedRows.length}
          </Text>
        )}
        <MoreOutlined style={{ color: "white", fontSize: "20px", margin: "0" }} />
      </Button>
    </Popover>
  );
}