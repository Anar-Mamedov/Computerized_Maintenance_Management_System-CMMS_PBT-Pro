import React, { useEffect, useState } from "react";
import { Tabs } from "antd";
import styled from "styled-components";
import { useFormContext } from "react-hook-form";
import DetayBilgiler from "./components/DetayBilgiler/DetayBilgiler";
import KontrolListesiTablo from "./components/KontrolListesi/KontrolListesiTablo";
import OzelAlanlar from "./components/OzelAlanlar/OzelAlanlar";
import PersonelListesiTablo from "./components/Personel/PersonelListesiTablo";
import MalzemeListesiTablo from "./components/Malzeme/MalzemeListesiTablo";
import DuruslarListesiTablo from "./components/Duruslar/DuruslarListesiTablo";
import OlcumDegerleriListesiTablo from "./components/OlcumDegerleri/OlcumDegerleriListesiTablo";
import AracGereclerListesiTablo from "./components/AracGerecler/AracGereclerListesiTablo";
import SureBilgileri from "./components/SureBilgileri/SureBilgileri";
import Maliyetler from "./components/Maliyetler/Maliyetler";
import Notlar from "./components/Notlar/Notlar";
import Aciklama from "./components/Aciklama/Aciklama";

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

export default function SecondTabs({ refreshKey, fieldRequirements }) {
  const { watch } = useFormContext();

  const items = [
    {
      key: "1",
      label: "Detay Bilgiler",
      children: <DetayBilgiler fieldRequirements={fieldRequirements} />,
    },
    {
      key: "2",
      label: "Kontrol Listesi",
      children: <KontrolListesiTablo fieldRequirements={fieldRequirements} />,
    },
    {
      key: "3",
      label: "Personel",
      children: <PersonelListesiTablo fieldRequirements={fieldRequirements} />,
    },
    {
      key: "4",
      label: "Malzeme",
      children: <MalzemeListesiTablo fieldRequirements={fieldRequirements} />,
    },
    {
      key: "5",
      label: "Duruşlar",
      children: <DuruslarListesiTablo fieldRequirements={fieldRequirements} />,
    },
    {
      key: "6",
      label: "Süre Bilgileri",
      children: <SureBilgileri fieldRequirements={fieldRequirements} />,
    },
    {
      key: "7",
      label: "Maliyetler",
      children: <Maliyetler fieldRequirements={fieldRequirements} />,
    },
    {
      key: "8",
      label: "Ölçüm Değerleri",
      children: <OlcumDegerleriListesiTablo fieldRequirements={fieldRequirements} />,
    },
    {
      key: "9",
      label: "Araç & Gereçler",
      children: <AracGereclerListesiTablo fieldRequirements={fieldRequirements} />,
    },
    {
      key: "10",
      label: "Özel Alanlar",
      children: <OzelAlanlar fieldRequirements={fieldRequirements} />,
    },
    {
      key: "11",
      label: "Notlar",
      children: <Notlar fieldRequirements={fieldRequirements} />,
    },
    {
      key: "12",
      label: "Açıklama",
      children: <Aciklama fieldRequirements={fieldRequirements} />,
    },
  ];

  // Filter the items based on the fieldRequirements prop
  const filteredItems = items.filter((item) => {
    switch (item.key) {
      case "1":
        return fieldRequirements?.IMT_DETAY_TAB || true;
      case "2":
        return fieldRequirements?.IMT_KONTROL_TAB;
      case "3":
        return fieldRequirements?.IMT_PERSONEL_TAB;
      case "4":
        return fieldRequirements?.IMT_MALZEME_TAB;
      case "5":
        return fieldRequirements?.IMT_DURUS_TAB;
      case "6":
        return fieldRequirements?.IMT_SURE_TAB;
      case "7":
        return fieldRequirements?.IMT_MALIYET_TAB;
      case "8":
        return fieldRequirements?.IMT_OLCUM_TAB;
      case "9":
        return fieldRequirements?.IMT_ARAC_GEREC_TAB;
      case "10":
        return fieldRequirements?.IMT_OZEL_ALAN_TAB;
      case "11":
        return fieldRequirements?.IMT_NOTLAR_TAB;
      case "12":
        return fieldRequirements?.IMT_ACIKLAMA_USTTAB || true; // This tab's visibility is dependent on a specific condition, with a fallback to false if undefined.
      default:
        return false; // Default case to handle any unforeseen keys
    }
  });

  return (
    <div>
      <StyledTabs defaultActiveKey={filteredItems} items={filteredItems} onChange={onChange} />
    </div>
  );
}
