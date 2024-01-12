import React from "react";
import { DownOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Dropdown, message, Space, Tooltip } from "antd";

export default function ContextMenu() {
  const items = [
    {
      label: "Sil",
      key: "2",
      icon: <UserOutlined />,
    },
    {
      label: "İleri Tarihe İş Emri Planla",
      key: "3",
      // icon: <UserOutlined />,
      // danger: true,
    },
    {
      label: "Atölye Transferi",
      key: "4",
      // icon: <UserOutlined />,
      // danger: true,
      // disabled: true,
    },
    {
      label: "İş Emri Formları...",
      key: "5",
      icon: <UserOutlined />,
    },
    {
      label: "Seçili İş Emrini Kapat",
      key: "7",
      // icon:<UserOutlined/>
    },
    {
      label: "İş Emri Tarihçesi",
      key: "8",
      // icon:<UserOutlined/>
    },
    {
      label: "Makine Tarihçesi",
      key: "9",
    },
    {
      label: "Malzeme İhtiyaç Analizi",
      key: "10",
    },
    {
      label: "Süreç Analizi",
      key: "11",
    },
    {
      label: "Maliyet Analizi",
      key: "12",
    },
    {
      label: "Seçili Kaydı Çoğalt",
      key: "13",
      icon: <UserOutlined />,
    },
  ];

  const menuProps = {
    items,
    // onClick: handleMenuClick,
  };
  return (
    <Dropdown menu={menuProps} trigger="click">
      <Button>
        <Space>
          Menü
          <DownOutlined />
        </Space>
      </Button>
    </Dropdown>
  );
}
