import React from "react";
import { Tabs } from "antd";
import styled from "styled-components";
import { useFormContext } from "react-hook-form";
import KontrolListesiTablo from "./components/KontrolListesiEkle/KontrolListesiTablo";
import Tablo from "./components/Malzemeler/Tablo";
import Maliyetler from "./components/Maliyetler/Maliyetler";
import Olcumler from "./components/Olcumler/Tablo";
import SureBilgileri from "./components/SureBilgileri/SureBilgileri";
import OzelAlanlar from "./components/OzelAlanlar/OzelAlanlar";
import UygulamaBilgileri from "./components/UygulamaBilgileri/UygulamaBilgileri";
import Aciklama from "./components/Aciklama/Aciklama";
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

export default function SecondTabs({ refreshKey, count }) {
  const { watch } = useFormContext();

  const items = [
    {
      key: "1",
      label: `Kontrol Listesi (${count?.KONTROL_SAYI})`,
      children: <KontrolListesiTablo />,
    },
    {
      key: "2",
      label: `Malzemeler (${count?.MALZEME_SAYI})`,
      children: <Tablo />,
    },
    {
      key: "3",
      label: "Maliyetler",
      children: <Maliyetler />,
    },
    {
      key: "4",
      label: `Ölçümler (${count?.OLCUM_SAYI})`,
      children: <Olcumler />,
    },
    {
      key: "5",
      label: "Süre Bilgileri",
      children: <SureBilgileri />,
    },
    {
      key: "6",
      label: "Özel Alanlar",
      children: <OzelAlanlar />,
    },
    {
      key: "7",
      label: "Uygulama Bilgileri",
      children: <UygulamaBilgileri />,
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

  return <StyledTabs style={{ width: "100%" }} defaultActiveKey="1" items={items} onChange={onChange} />;
}
