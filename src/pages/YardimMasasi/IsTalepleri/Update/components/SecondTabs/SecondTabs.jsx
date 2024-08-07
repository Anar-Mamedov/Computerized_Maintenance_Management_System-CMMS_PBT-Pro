import React from "react";
import { Tabs } from "antd";
import styled from "styled-components";
import { useFormContext } from "react-hook-form";
import IsTakibi from "./components/IsTakibi/IsTakibi";
import MakineVeEkipman from "./components/MakineVeEkipman/MakineVeEkipman";
import PlanlamaVeIsEmri from "./components/PlanlamaVeIsEmri/PlanlamaVeIsEmri";
import Not from "./components/Not/Not";
import Sonuc from "./components/Sonuc/Sonuc";
import Degerlendirme from "./components/Degerlendirme/Degerlendirme";
import TeknisyenListesi from "./components/TeknisyenListesi/TeknisyenListesi";
import ResimUpload from "./components/Resim/ResimUpload";
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

export default function SecondTabs({ refreshKey, disabled, fieldRequirements }) {
  const { watch } = useFormContext();

  const items = [
    {
      key: "1",
      label: "İş Takibi",
      children: <IsTakibi disabled={disabled} />,
    },
    {
      key: "2",
      label: "Makine ve Ekipman",
      children: <MakineVeEkipman disabled={disabled} />,
    },
    {
      key: "3",
      label: "Teknisyen Listesi",
      children: <TeknisyenListesi disabled={disabled} />,
    },
    {
      key: "4",
      label: "Planlama ve İş Emri",
      children: <PlanlamaVeIsEmri disabled={disabled} fieldRequirements={fieldRequirements} />,
    },
    {
      key: "5",
      label: "Not",
      children: <Not disabled={disabled} />,
    },
    {
      key: "6",
      label: "Sonuç",
      children: <Sonuc disabled={disabled} />,
    },
    {
      key: "7",
      label: "Ekli Belgeler",
      children: <DosyaUpload />,
    },
    {
      key: "8",
      label: "Resimler",
      children: <ResimUpload />,
    },
    {
      key: "9",
      label: "Ön Değerlendirme",
      children: <Degerlendirme disabled={disabled} />,
    },
  ];

  return (
    <div>
      <StyledTabs defaultActiveKey="1" items={items} onChange={onChange} />
    </div>
  );
}
