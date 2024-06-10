import React from "react";
import { Tabs } from "antd";
import styled from "styled-components";
import MainTable from "./components/IsEmriTipiSekmesi/Table/Table.jsx";
import PersonelMainTable from "./components/PersonelSekmesi/Table/MainTable.jsx";

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

const onChange = (key) => {
  console.log(key);
};
const items = [
  {
    key: "1",
    label: "Personeller",
    children: <PersonelMainTable />,
  },
  {
    key: "2",
    label: "İş Emri Tipleri",
    children: <MainTable />,
  },
];

function Sekmeler(props) {
  return <StyledTabs defaultActiveKey="1" items={items} onChange={onChange} />;
}

export default Sekmeler;
