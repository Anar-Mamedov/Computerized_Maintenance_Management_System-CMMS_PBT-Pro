import React, { useState } from "react";
import { Button, Popover } from "antd";
import { MoreOutlined, PlusOutlined } from "@ant-design/icons";
import CreateModal from "../Insert/CreateModal";
import MalzemeTablo from "../Insert/Stoklu/MalzemeTablo";

export default function ContextMenu({ onRefresh, secilenIsEmriID }) {
  const [visible, setVisible] = useState(false);

  const handleVisibleChange = (visible) => {
    setVisible(visible);
  };

  const hidePopover = () => {
    setVisible(false);
  };

  const content = (
    <div>
      <MalzemeTablo onRefresh={onRefresh} secilenIsEmriID={secilenIsEmriID} />
      <CreateModal onRefresh={onRefresh} secilenIsEmriID={secilenIsEmriID} />
    </div>
  );
  return (
    <Popover placement="bottom" content={content} trigger="click" open={visible} onOpenChange={handleVisibleChange}>
      <Button
        type="link"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}>
        <PlusOutlined /> Yeni Kayıt
      </Button>
    </Popover>
  );
}
