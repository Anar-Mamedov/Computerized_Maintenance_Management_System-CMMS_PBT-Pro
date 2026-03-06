import React, { useState } from "react";
import { Button, Dropdown } from "antd";
import { PlusOutlined, DownOutlined } from "@ant-design/icons";
import CreateModal from "./CreateModal";
import CreateDrawer from "../../../../../../EkipmanVeritabani/Insert/CreateDrawer";

export default function EkleButton({ kapali, onRefresh, secilenIsEmriID }) {
  const [stokluVisible, setStokluVisible] = useState(false);
  const [stoksuzVisible, setStoksuzVisible] = useState(false);

  const handleStoklu = () => {
    setStokluVisible(true);
  };

  const handleStoksuz = () => {
    setStoksuzVisible(true);
  };

  const items = [
    {
      key: "1",
      label: "Stoklu",
      onClick: handleStoklu,
    },
    {
      key: "2",
      label: "Stoksuz",
      onClick: handleStoksuz,
    },
  ];

  return (
    <>
      <Dropdown menu={{ items }} disabled={kapali} trigger={["click"]}>
        <Button type="link" style={{ padding: "0" }}>
          <PlusOutlined /> Ekle <DownOutlined />
        </Button>
      </Dropdown>

      <CreateModal kapali={kapali} secilenIsEmriID={secilenIsEmriID} onRefresh={onRefresh} isVisible={stokluVisible} onModalClose={() => setStokluVisible(false)} />

      <CreateDrawer onRefresh={onRefresh} isVisible={stoksuzVisible} onDrawerClose={() => setStoksuzVisible(false)} />
    </>
  );
}
