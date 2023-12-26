import React from "react";
import { Tabs } from "antd";
import SatinalmaKrediBilgileri from "./SatinalmaKrediBilgileri";

const items = [
  {
    key: "1",
    label: "Satınalma ve Kredi Bilgileri",
    children: <SatinalmaKrediBilgileri />,
  },
  {
    key: "2",
    label: "Amortisman Bilgileri",
    children: "Content of Tab Pane 2",
  },
];

export default function SatinalmaSekme() {
  return (
    <div>
      <Tabs defaultActiveKey="1" items={items} tabPosition="bottom" />
    </div>
  );
}
