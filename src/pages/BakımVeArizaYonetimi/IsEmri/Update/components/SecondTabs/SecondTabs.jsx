import React, { useCallback, useEffect, useState } from "react";
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
import ResimUpload from "./components/Resim/ResimUpload";
import DosyaUpload from "./components/Dosya/DosyaUpload";
import AxiosInstance from "../../../../../../api/http";

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
  const [activeTabKey, setActiveTabKey] = useState("1"); // Default to the first tab
  const [dataCount, setDataCount] = useState([]);

  // Modify the onChange handler to update the active tab state
  const onChange = (key) => {
    setActiveTabKey(key);
  };

  const secilenIsEmriID = watch("secilenIsEmriID");

  const fetchData = async () => {
    try {
      const response = await AxiosInstance.get(`GetIsEmriTabsCountById?isEmriId=${secilenIsEmriID}`); // API URL'niz
      setDataCount(response); // Örneğin, API'den dönen yanıt doğrudan etiket olacak
    } catch (error) {
      console.error("API isteğinde hata oluştu:", error);
    }
  };

  useEffect(() => {
    if (secilenIsEmriID) {
      // secilenIsEmriID'nin varlığını ve geçerliliğini kontrol edin
      fetchData(); // fetch fonksiyonunu çağırın
    }
  }, [secilenIsEmriID]); // secilenIsEmriID veya fetch fonksiyonu değiştiğinde useEffect'i tetikle

  const items = [
    {
      key: "1",
      label: "Detay Bilgiler",
      children: <DetayBilgiler fieldRequirements={fieldRequirements} />,
    },
    {
      key: "2",
      label:
        dataCount.IsEmriKontrolListSayisi >= 1
          ? `Kontrol Listesi (${dataCount.IsEmriKontrolListSayisi})`
          : "Kontrol Listesi",
      children: <KontrolListesiTablo isActive={activeTabKey === "2"} fieldRequirements={fieldRequirements} />,
    },
    {
      key: "3",
      label: dataCount.IsEmriPersonelListSayisi >= 1 ? `Personel (${dataCount.IsEmriPersonelListSayisi})` : "Personel",
      children: <PersonelListesiTablo isActive={activeTabKey === "3"} fieldRequirements={fieldRequirements} />,
    },
    {
      key: "4",
      label: dataCount.IsEmriMalzemeListSayisi >= 1 ? `Malzeme (${dataCount.IsEmriMalzemeListSayisi})` : "Malzeme",
      children: <MalzemeListesiTablo isActive={activeTabKey === "4"} fieldRequirements={fieldRequirements} />,
    },
    {
      key: "5",
      label: dataCount.IsEmriDurusListSayisi >= 1 ? `Duruşlar (${dataCount.IsEmriDurusListSayisi})` : "Duruşlar",
      children: <DuruslarListesiTablo isActive={activeTabKey === "5"} fieldRequirements={fieldRequirements} />,
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
      label:
        dataCount.IsEmriOlcumListSayisi >= 1
          ? `Ölçüm Değerleri (${dataCount.IsEmriOlcumListSayisi})`
          : "Ölçüm Değerleri",
      children: <OlcumDegerleriListesiTablo isActive={activeTabKey === "8"} fieldRequirements={fieldRequirements} />,
    },
    {
      key: "9",
      label:
        dataCount.IsEmriAracGerevListSayisi >= 1
          ? `Araç & Gereçler (${dataCount.IsEmriAracGerevListSayisi})`
          : "Araç & Gereçler",
      children: <AracGereclerListesiTablo isActive={activeTabKey === "9"} fieldRequirements={fieldRequirements} />,
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
    {
      key: "13",
      label: "Dosyalar",
      children: <DosyaUpload fieldRequirements={fieldRequirements} />,
    },
    {
      key: "14",
      label: "Resimler",
      children: <ResimUpload fieldRequirements={fieldRequirements} />,
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
      case "13":
        return fieldRequirements?.IMT_DOSYA_USTTAB || true; // This tab's visibility is dependent on a specific condition, with a fallback to false if undefined.
      case "14":
        return fieldRequirements?.IMT_RESIM_USTTAB || true; // This tab's visibility is dependent on a specific condition, with a fallback to false if undefined.
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
