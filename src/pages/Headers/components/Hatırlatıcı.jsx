import React, { useState } from "react";
import { Button, Popover } from "antd";
import { BellOutlined } from "@ant-design/icons";
import { FaRegCalendarAlt } from "react-icons/fa";
import Hatirlatici from "../../Dashboard/Hatirlatici/Hatirlatici";

export default function Bildirim() {
  const [open, setOpen] = useState(false);

  const handleOpenChange = (newOpen) => {
    setOpen(newOpen);
  };
  const content = (
    <div>
      <Hatirlatici />
    </div>
  );
  return (
    <Popover content={content} trigger="click" open={open} onOpenChange={handleOpenChange}>
      <Button type="succes" shape="circle" icon={<FaRegCalendarAlt style={{ fontSize: "20px" }} />}></Button>
    </Popover>
  );
}
