import React, { useState } from "react";
import { Button, Popover, Typography } from "antd";
import { MoreOutlined } from "@ant-design/icons";

// Gerçek işlem yapan componentler
import Sil from "./components/Sil";
import TarihceTablo from "./components/TarihceTablo";
import Kapat from "./components/Kapat/Kapat";
import Iptal from "./components/Iptal/Iptal";
import SatinalmaSiparisleri from "./components/SatinalmaSiparisleri";
import TalebiAc from "./components/Kapat/Kapat";
import OnayaGonder from "./components/OnayaGonder";
import TarihceOnayTablo from "./components/TarihceOnayTablo";
import OnayGeriAl from "./components/OnayGeriAl";
import SipariseAktar from "./components/SipariseAktar/EditDrawer";
import Teklif from "./components/Teklif/Teklif";

const { Text } = Typography;

export default function ContextMenu({ selectedRows, refreshTableData, onayCheck }) { // onayCheck ekledik
  const [visible, setVisible] = useState(false);

  const handleVisibleChange = (visible) => {
    setVisible(visible);
  };

  const hidePopover = () => {
    setVisible(false);
  };

  const isDisabled = selectedRows.some(
    (row) =>
      row.SFS_TALEP_DURUM_ID === 3 ||
      row.SFS_TALEP_DURUM_ID === 4 ||
      row.SFS_TALEP_DURUM_ID === 6
  );

  const durumId =
    selectedRows.length === 1 ? selectedRows[0].SFS_TALEP_DURUM_ID : null;

  // Ortak props
  const commonProps = {
    selectedRows,
    refreshTableData,
    hidePopover,
    fisNo: selectedRows.length === 1 ? selectedRows[0].SFS_FIS_NO : null,
    baslik: selectedRows.length === 1 ? selectedRows[0].SFS_BASLIK : null,
  };

  const renderButtonsByDurum = (id) => {
    switch (id) {
      case 1:
        return (
          <>
            <Kapat {...commonProps} />
            <Iptal {...commonProps} />
          </>
        );
      case 3:
      return (
        <>
          <SatinalmaSiparisleri {...commonProps} />
          <Iptal {...commonProps} />
        </>
      );
      case 7:
        return (
        <>
          <OnayGeriAl {...commonProps} />
          <Iptal {...commonProps} />
        </>
      );
      case 8:
        return (
        <>
          <Kapat {...commonProps} />
          <Iptal {...commonProps} />
          <SipariseAktar selectedRow={selectedRows[0]} onRefresh={refreshTableData} />
          <Teklif {...commonProps} selectedRow={selectedRows[0]} onRefresh={refreshTableData} />
        </>
      );
      case 9:
        return (
          <>
            <Kapat {...commonProps} />
            <Iptal {...commonProps} />
          </>
        );
      case 2:
        return (
          <>
            <SatinalmaSiparisleri {...commonProps} />
            <Kapat {...commonProps} />
            <Iptal {...commonProps} />
            <Teklif {...commonProps} selectedRow={selectedRows[0]} onRefresh={refreshTableData} />
          </>
        );
      case 6:
        return <TalebiAc {...commonProps} />;
      case 5:
        return (
          <>
            <TalebiAc {...commonProps} />
            <SatinalmaSiparisleri {...commonProps} />
            <Teklif {...commonProps} selectedRow={selectedRows[0]} onRefresh={refreshTableData} disabled={true} />
          </>
        );
      case 4:
        return (
          <>
            <Kapat {...commonProps} />
            <SatinalmaSiparisleri {...commonProps} />
          </>
        );
      default:
        return null;
    }
  };

  const content = (
    <div>
      {/* OnayaGonder ekledik */}
      {onayCheck &&
        selectedRows.length >= 1 &&
        selectedRows.some((row) => row.SFS_TALEP_DURUM_ID === 0 || row.SFS_TALEP_DURUM_ID === 1) && (
          <OnayaGonder {...commonProps} />
        )}

      {durumId && renderButtonsByDurum(durumId)}

      {selectedRows.length >= 1 && (
        <>
          <Sil {...commonProps} disabled={isDisabled} />
          <div style={{ marginTop: 10 }}>
            <TarihceTablo {...commonProps} />
          </div>
          <div style={{ marginTop: 10 }}>
            <TarihceOnayTablo {...commonProps} />
          </div>
        </>
      )}
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
        {selectedRows.length >= 1 && (
          <Text style={{ color: "white", marginLeft: "3px" }}>
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