import React from "react";
import { Tabs } from "antd";
import styled from "styled-components";
import { useFormContext } from "react-hook-form";
import MainTabs from "./MainTabs.jsx";
import PeriotBilgileri from "./components/PeryotBilgileri/PeriotBilgileri.jsx";
import TanimliMakineler from "./components/TanimliMakineler.jsx";

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

export default function MainTabs1({ refreshKey }) {
  const { watch } = useFormContext();

  const items = [
    {
      key: "1",
      label: "Bakım Bilgileri",
      children: <MainTabs />,
    },
    {
      key: "2",
      label: "Bakım Periyot Bilgileri",
      children: <PeriotBilgileri />,
    },
    {
      key: "3",
      label: "Tanımlı Makineler",
      children: <TanimliMakineler />,
    },
  ];

  return (
    <div>
      <StyledTabs defaultActiveKey="1" items={items} onChange={onChange} />
    </div>
  );
}
