import React, { useState } from "react";
import { Button, Popover, Typography } from "antd";
import { MoreOutlined } from "@ant-design/icons";
import Sil from "./components/Sil";
import IsEmriOlustur from "./components/IsEmriOlustur.jsx";
import PeriyodikBakimIptal from "./components/PeriyodikBakimIptal/PeriyodikBakimIptal.jsx";
import IleriTarihePlanla from "./components/IleriTarihePlanla/IleriTarihePlanla.jsx";

const { Text, Link } = Typography;

export default function ContextMenu({ selectedRows, refreshTableData, onayCheck }) {
  const [visible, setVisible] = useState(false);

  const handleVisibleChange = (visible) => {
    setVisible(visible);
  };

  const hidePopover = () => {
    setVisible(false);
  };

  const content = (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      {selectedRows.length >= 1 && <IsEmriOlustur selectedRows={selectedRows} refreshTableData={refreshTableData} hidePopover={hidePopover} />}

      {selectedRows.length == 1 && <IleriTarihePlanla selectedRows={selectedRows} refreshTableData={refreshTableData} hidePopover={hidePopover} />}

      {selectedRows.length == 1 && <PeriyodikBakimIptal selectedRows={selectedRows} refreshTableData={refreshTableData} hidePopover={hidePopover} />}

      {/* {selectedRows.length >= 1 && selectedRows.every((row) => row.KAPALI === false) && (
        <Sil selectedRows={selectedRows} refreshTableData={refreshTableData} hidePopover={hidePopover} />
      )} */}
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
