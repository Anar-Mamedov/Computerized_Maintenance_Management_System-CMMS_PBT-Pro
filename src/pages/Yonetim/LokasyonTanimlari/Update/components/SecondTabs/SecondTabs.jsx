import React from "react";
import { Tabs } from "antd";
import styled from "styled-components";
import { useFormContext } from "react-hook-form";
import MainTabs from "../MainTabs/MainTabs";

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

const items = [
  {
    key: "1",
    label: "Lokasyon Bilgileri",
    children: <MainTabs />,
  },
  {
    key: "2",
    label: "Makineler",
    children: "Content of Tab Pane 2",
  },
  {
    key: "3",
    label: "Personeller",
    children: "Content of Tab Pane 3",
  },
  {
    key: "4",
    label: "Projeler",
    children: "Content of Tab Pane 4",
  },
  {
    key: "5",
    label: "Ekli Belgeler",
    children: "Content of Tab Pane 5",
  },
  {
    key: "6",
    label: "Resimler",
    children: "Content of Tab Pane 6",
  },
];

export default function SecondTabs() {
  const { watch } = useFormContext();

  return (
    <div>
      <StyledTabs defaultActiveKey="1" items={items} onChange={onChange} />
    </div>
  );
}
