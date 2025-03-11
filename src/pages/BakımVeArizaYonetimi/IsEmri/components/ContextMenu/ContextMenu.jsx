import React, { useState } from "react";
import { Button, Popover, Typography } from "antd";
import { MoreOutlined } from "@ant-design/icons";
import Sil from "./components/Sil";
import Iptal from "./components/Iptal/Iptal";
import Kapat from "./components/Kapat/Kapat";
import Parametreler from "./components/Parametreler/Parametreler";
import TarihceTablo from "./components/TarihceTablo";
import Form from "./components/Form/Form";
import Ac from "./components/Ac";
import OnayaGonder from "./components/OnayaGonder.jsx";
import OnayaGonderOnaylayiciList from "./components/OnayaGonderOnaylayiciList.jsx";

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
  const isDisabled = selectedRows.some((row) => row.IST_DURUM_ID === 3 || row.IST_DURUM_ID === 4);
  const iptalDisabled = selectedRows.some((row) => row.IST_DURUM_ID === 3 || row.IST_DURUM_ID === 2 || row.IST_DURUM_ID === 4 || row.IST_DURUM_ID === 5);
  const kapatDisabled = selectedRows.some((row) => row.KAPALI === true);

  const content = (
    <div>
      {selectedRows.length === 1 && selectedRows.every((row) => row.KAPALI === true) && (
        <Ac selectedRows={selectedRows} refreshTableData={refreshTableData} disabled={isDisabled} hidePopover={hidePopover} />
      )}

      {selectedRows.length >= 1 && selectedRows.every((row) => row.KAPALI === false) && (
        <Sil selectedRows={selectedRows} refreshTableData={refreshTableData} disabled={isDisabled} hidePopover={hidePopover} />
      )}
      {onayCheck &&
        onayCheck.ONY_AKTIF == 1 &&
        onayCheck.ONY_MANUEL == 0 &&
        selectedRows.length >= 1 &&
        selectedRows.some((row) => row.ISM_ONAY_DURUM === 0 || row.ISM_ONAY_DURUM === 3) &&
        selectedRows.every((row) => row.KAPALI === false) && <OnayaGonder selectedRows={selectedRows} refreshTableData={refreshTableData} hidePopover={hidePopover} />}

      {/* <Iptal selectedRows={selectedRows} refreshTableData={refreshTableData} iptalDisabled={iptalDisabled} /> */}
      {/*{selectedRows.length >= 1 && <Kapat selectedRows={selectedRows} refreshTableData={refreshTableData} kapatDisabled={kapatDisabled} />}*/}

      {selectedRows.length >= 1 &&
        (onayCheck && onayCheck.ONY_AKTIF == 1 && onayCheck.ONY_MANUEL == 0 ? (
          selectedRows.every((row) => row.ISM_ONAY_DURUM === 2) && <Kapat selectedRows={selectedRows} refreshTableData={refreshTableData} kapatDisabled={kapatDisabled} />
        ) : (
          <Kapat selectedRows={selectedRows} refreshTableData={refreshTableData} kapatDisabled={kapatDisabled} />
        ))}

      {onayCheck &&
        onayCheck.ONY_AKTIF == 1 &&
        onayCheck.ONY_MANUEL == 1 &&
        selectedRows.length >= 1 &&
        selectedRows.some((row) => row.ISM_ONAY_DURUM === 0 || row.ISM_ONAY_DURUM === 3) &&
        selectedRows.every((row) => row.KAPALI === false) && (
          <OnayaGonderOnaylayiciList selectedRows={selectedRows} refreshTableData={refreshTableData} hidePopover={hidePopover} />
        )}

      {/* <Parametreler />
      {selectedRows.length === 1 && <TarihceTablo selectedRows={selectedRows} />} */}
      {selectedRows.length >= 1 && <Form selectedRows={selectedRows} />}
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
