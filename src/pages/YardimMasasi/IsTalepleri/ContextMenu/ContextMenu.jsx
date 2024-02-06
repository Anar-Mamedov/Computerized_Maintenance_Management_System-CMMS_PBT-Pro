import React from "react";
import { DownOutlined } from "@ant-design/icons";
import { Button, Dropdown } from "antd";
import Sil from "./components/Sil";

export default function ContextMenu({ selectedRow }) {
  const items = [
    {
      label: <Sil selectedRow={selectedRow} />,
      key: "0",
    },
    {
      label: <a href="https://www.aliyun.com">2nd menu item</a>,
      key: "1",
    },
    {
      type: "divider",
    },
    {
      label: "3rd menu item",
      key: "3",
    },
  ];
  return (
    <Dropdown
      menu={{
        items,
      }}
      trigger={["click"]}>
      <a onClick={(e) => e.preventDefault()}>
        <Button>
          İşlemler
          <DownOutlined />
        </Button>
      </a>
    </Dropdown>
  );
}
