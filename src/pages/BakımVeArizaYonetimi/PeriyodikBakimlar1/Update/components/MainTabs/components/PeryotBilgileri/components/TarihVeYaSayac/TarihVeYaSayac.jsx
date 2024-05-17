import React, { useEffect } from "react";
import { Tabs } from "antd";
import styled from "styled-components";
import { useFormContext } from "react-hook-form";

import Gun from "./components/Gun.jsx";
import Haftalik from "./components/Haftalik.jsx";
import Aylik from "./components/Aylik.jsx";
import Yillik from "./components/Yillik.jsx";
import Sayac from "./components/Sayac.jsx";
import FixTarihler from "./components/FixTarihler.jsx";

const onChange = (key) => {
  // console.log(key);
};

//styled components
const StyledTabs = styled(Tabs)`
  .ant-tabs-tab {
    margin: 0 !important;
    padding: 10px 15px;
    justify-content: center;
    background-color: rgba(230, 230, 230, 0.3);
    width: 100% !important;
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

export default function TarihVeYaSayac({ refreshKey }) {
  const { watch, setValue } = useFormContext();

  // Backend'den gelen bilgiyi izlemek için bir form alanı oluşturun
  const activeTab = watch("activeTab");

  const onChange = (key) => {
    // Kullanıcının seçtiği tab'ı form alanına atayın
    setValue("activeTab", key);
  };

  const items = [
    {
      key: "GUN",
      label: "Günlük",
      children: <Gun />,
    },
    {
      key: "HAFTA",
      label: "Haftalık",
      children: <Haftalik />,
    },
    {
      key: "AY123",
      label: "Aylık",
      children: <Aylik />,
    },
    {
      key: "YIL123",
      label: "Yıllık",
      children: <Yillik />,
    },
    {
      key: "5",
      label: "Fix Tarihler",
      children: <FixTarihler />,
    },
    {
      key: "SAYAC",
      label: "Sayaç",
      children: <Sayac />,
    },
  ];

  return (
    <div style={{ marginTop: "10px" }}>
      <StyledTabs
        tabPosition="left"
        defaultActiveKey={activeTab}
        items={items}
        onChange={onChange}
      />
    </div>
  );
}
