import React from "react";
import { Tabs } from "antd";
import styled from "styled-components";
import { useFormContext } from "react-hook-form";
import IletisimBilgileri from "./components/IletisimBilgileri/IletisimBilgileri";
import KisiselBilgiler from "./components/KisiselBilgiler/KisiselBilgiler";
import KimlikBilgileri from "./components/KimlikBilgileri/KimlikBilgileri";
import EhliyetBilgileri from "./components/EhliyetBilgileri/EhliyetBilgileri";
import OzelAlanlar from "./components/OzelAlanlar/OzelAlanlar";
import Aciklama from "./components/Aciklama/Aciklama";
import SertifikalarTablo from "./components/Sertifikalar/SertifikalarTablo";
import LokasyonTablo from "./components/Lokasyon/LokasyonTablo";
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

export default function SecondTabs({ refreshKey }) {
  const { watch } = useFormContext();

  const items = [
    {
      key: "1",
      label: "İletişim Bilgileri",
      children: <IletisimBilgileri />,
    },
    {
      key: "2",
      label: "Kişisel Bilgiler",
      children: <KisiselBilgiler />,
    },
    {
      key: "3",
      label: "Kimlik Bilgileri",
      children: <KimlikBilgileri />,
    },
    {
      key: "4",
      label: "Ehliyet Bilgileri",
      children: <EhliyetBilgileri />,
    },
    {
      key: "5",
      label: "Sertifikalar",
      children: <SertifikalarTablo />,
    },
    {
      key: "6",
      label: "Lokasyonlar",
      children: <LokasyonTablo />,
    },
    {
      key: "7",
      label: "Özel Alanlar",
      children: <OzelAlanlar />,
    },
    {
      key: "8",
      label: "Ekli Belgeler",
      children: <DosyaUpload />,
    },
    {
      key: "9",
      label: "Resimler",
      children: <ResimUpload />,
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
