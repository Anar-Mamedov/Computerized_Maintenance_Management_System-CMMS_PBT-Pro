import React from "react";
import { Tabs } from "antd";
import styled from "styled-components";
import { useFormContext } from "react-hook-form";
import PersonelListesiTablo from "./components/KontrolListesiEkle/PersonelListesiTablo";
import Aciklama from "./components/Aciklama/Aciklama";
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
  const { watch } = useFormContext();

  const items = [
    {
      key: "1",
      label: "Personel Listesi",
      children: <PersonelListesiTablo />,
    },
    {
      key: "8",
      label: "Ekli Belgeler",
      children: <DosyaUpload />,
    },
    {
      key: "10",
      label: "Açıklama",
      children: <Aciklama />,
    },
  ];

  return (
    <div>
      <StyledTabs defaultActiveKey="1" items={items} onChange={onChange} />
    </div>
  );
}
