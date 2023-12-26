import React from "react";
import { Tabs } from "antd";
import styled from "styled-components";
import WorkOrder from "./components/WorkOrder";
import UploadImage from "./components/UploadImage";
import Explanation from "./components/Explanation";

const onChange = (key) => {
  console.log(key);
};
const items = [
  {
    key: "1",
    label: "İş Emri Bilgileri",
    children: <WorkOrder />,
  },
  {
    key: "2",
    label: "Ek Bilgiler",
    children: <UploadImage />,
  },
  {
    key: "3",
    label: "Resımler",
    children: <UploadImage />,
  },
  {
    key: "4",
    label: "Açıklama",
    children: <Explanation />,
  },
];

const StyledTabs = styled(Tabs)`
  .ant-tabs-nav {
    margin-bottom: 20px;
  }
  .ant-tabs-nav-list {
    border-top-right-radius: 10px;
    background-color: rgba(230, 230, 230, 0.3);
    overflow: hidden;
  }

  .ant-tabs-tab {
    /* background-color: rgba(230, 230, 230, 0.3); */
    margin: 0 !important;
    width: fit-content;
    padding: 10px 15px;
    justify-content: center;
  }

  .ant-tabs-nav-wrap {
    border-radius: 10px 10px 0 0;
  }

  .ant-tabs-tab-active {
    background-color: #2bc77135;
    color: rgba(0, 0, 0, 0.88);
  }

  .ant-tabs-tab:not(:first-child) {
    border-left: 1px solid #80808024;
  }

  .ant-tabs-tab-btn {
    color: rgba(0, 0, 0, 0.88) !important;
  }

  .ant-tabs-ink-bar {
    background-color: #2bc770;
  }
`;

export default function MainTabs() {
  return <StyledTabs style={{ marginBottom: "20px" }} defaultActiveKey="1" items={items} onChange={onChange} />;
}
