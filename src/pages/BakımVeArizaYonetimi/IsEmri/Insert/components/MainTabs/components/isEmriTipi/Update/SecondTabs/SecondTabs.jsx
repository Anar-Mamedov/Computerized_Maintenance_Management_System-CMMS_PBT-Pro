import React from "react";
import { Tabs } from "antd";
import styled from "styled-components";
import { useFormContext } from "react-hook-form";
import ZorunluAlanlar from "./components/ZorunluAlanlar";
import GoruntelenecekSayfalar from "./components/GoruntelenecekSayfalar";

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

export default function SecondTabs({ refreshKey, disabled, fieldRequirements }) {
  const { watch } = useFormContext();

  const tipGroupValue = watch("tipGroup"); // "tipGroup" isimli radio grubunu izle

  let items = [
    {
      key: "1",
      label: "Zorunlu Alanlar",
      children: <ZorunluAlanlar />,
    },
    {
      key: "2",
      label: "Görüntülenecek Sayfalar",
      children: <GoruntelenecekSayfalar />,
    },
    {
      key: "3",
      label: "Çağrılacak Prosedür",
      children: "tets",
    },
    {
      key: "4",
      label: "İş Emri Kapama",
      children: "tets",
    },
  ];

  // Eğer 5. seçenek seçili değilse, key'i 3 olan sekme hariç tüm sekmeleri göster
  if (tipGroupValue !== 5) {
    items = items.filter((item) => item.key !== "3");
  }

  return (
    <div>
      <StyledTabs defaultActiveKey="1" items={items} onChange={onChange} />
    </div>
  );
}
