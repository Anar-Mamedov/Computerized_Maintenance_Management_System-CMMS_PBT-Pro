import React from "react";
import { Tabs } from "antd";
import styled from "styled-components";
import { useFormContext } from "react-hook-form";
import MainTabs from "../MainTabs/MainTabs";
import MakineTablo from "./components/MakineTablo";
import PersonelTablo from "./components/PersonelTablo";
import ProjeTablo from "./components/ProjeTablo";
import ResimUpload from "./components/ResimUpload";
import DosyaUpload from "./components/Dosya/DosyaUpload";

const onChange = (key) => {
  // console.log(key);
};

//styled components
const StyledTabs = styled(Tabs)`
  .ant-tabs-tab {
    margin: 0 !important;
    width: fit-content;
    padding: 10px 15px;
    justify-content: center;
    background-color: rgba(230, 230, 230, 0.3);
  }

  .ant-tabs-tab-active {
    background-color: #2bc77135;
  }

  .ant-tabs-nav .ant-tabs-tab-active .ant-tabs-tab-btn {
    color: rgba(0, 0, 0, 0.88) !important;
  }

  .ant-tabs-tab:hover .ant-tabs-tab-btn {
    color: rgba(0, 0, 0, 0.88) !important;
  }

  .ant-tabs-tab:not(:first-child) {
    border-left: 1px solid #80808024;
  }

  .ant-tabs-ink-bar {
    background: #2bc770;
  }
`;

//styled components end

export default function SecondTabs({ refreshKey }) {
  const items = [
    {
      key: "1",
      label: "Lokasyon Bilgileri",
      children: <MainTabs />,
    },
    {
      key: "2",
      label: "Makineler",
      children: <MakineTablo key={refreshKey} />,
    },
    {
      key: "3",
      label: "Personeller",
      children: <PersonelTablo />,
    },
    {
      key: "4",
      label: "Projeler",
      children: <ProjeTablo />,
    },
    {
      key: "5",
      label: "Ekli Belgeler",
      children: <DosyaUpload />,
    },
    {
      key: "6",
      label: "Resimler",
      children: <ResimUpload />,
    },
  ];
  const { watch } = useFormContext();

  return (
    <div>
      <StyledTabs
        // tabPosition="right"
        defaultActiveKey="1"
        items={items}
        onChange={onChange}
      />
    </div>
  );
}
