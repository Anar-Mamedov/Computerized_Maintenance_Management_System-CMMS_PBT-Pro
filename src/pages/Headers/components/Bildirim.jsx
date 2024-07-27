import React, { useState } from "react";
import { Button, Popover } from "antd";
import { IoNotificationsOutline } from "react-icons/io5";
import styled from "styled-components";

const IconContainer = styled.div`
  position: relative;
  height: 100%;
  display: flex;
`;

const Badge = styled.span`
  position: absolute;
  top: 0;
  right: 0;
  width: 15px;
  height: 15px;
  background-color: red;
  border-radius: 50%;
  border: 2px solid white; /* Rozetin etrafında beyaz bir sınır */
`;

export default function Bildirim() {
  const [open, setOpen] = useState(false);

  const handleOpenChange = (newOpen) => {
    setOpen(newOpen);
  };

  const content = (
    <div>
      {/*<Hatirlatici />*/}
      <p>Yeni bildirim yok</p>
    </div>
  );

  return (
    <Popover content={content} trigger="click" open={open} onOpenChange={handleOpenChange}>
      <IconContainer>
        <Button type="success" shape="circle" icon={<IoNotificationsOutline style={{ fontSize: "24px" }} />}></Button>
        <Badge />
      </IconContainer>
    </Popover>
  );
}
