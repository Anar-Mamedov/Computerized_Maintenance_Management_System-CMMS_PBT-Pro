import React, { useState, useEffect, useCallback } from "react";
import { Tabs } from "antd";
import styled from "styled-components";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import AxiosInstance from "../../../../../../api/http";
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
  const { t } = useTranslation();
  const secilenBakimID = watch("secilenBakimID");

  const [tabCounts, setTabCounts] = useState({
    KontrolListSayisi: 0,
    MalzemeListSayisi: 0,
    PersonelListSayisi: 0,
    OlcumListSayisi: 0,
    ResimSayisi: 0,
    DosyaSayisi: 0,
    AciklamaVar: 0,
  });

  const fetchCounts = useCallback(() => {
    if (secilenBakimID) {
      AxiosInstance.get(`GetIsTanimTabsCountById?isTanimId=${secilenBakimID}`)
        .then((response) => {
          if (response && response.data) {
            setTabCounts(response.data);
          } else if (response) {
            setTabCounts(response);
          }
        })
        .catch((err) => {
          console.error("Error fetching tab counts:", err);
        });
    }
  }, [secilenBakimID]);

  useEffect(() => {
    fetchCounts();
  }, [secilenBakimID, fetchCounts, refreshKey]);

  const handleTabChange = (key) => {
    fetchCounts();
  };

  const items = [
    {
      key: "1",
      label: tabCounts.KontrolListSayisi > 0 ? `${t("tab.kontrolListesi", "Kontrol Listesi")} (${tabCounts.KontrolListSayisi})` : t("tab.kontrolListesi", "Kontrol Listesi"),
      children: <KontrolListesiTablo />,
    },
    {
      key: "2",
      label: tabCounts.MalzemeListSayisi > 0 ? `${t("tab.malzemeler", "Malzemeler")} (${tabCounts.MalzemeListSayisi})` : t("tab.malzemeler", "Malzemeler"),
      children: <Tablo />,
    },
    {
      key: "3",
      label: t("tab.maliyetler", "Maliyetler"),
      children: <Maliyetler />,
    },
    {
      key: "4",
      label: tabCounts.OlcumListSayisi > 0 ? `${t("tab.olcumler", "Ölçümler")} (${tabCounts.OlcumListSayisi})` : t("tab.olcumler", "Ölçümler"),
      children: <Olcumler />,
    },
    {
      key: "5",
      label: t("tab.sureBilgileri", "Süre Bilgileri"),
      children: <SureBilgileri />,
    },
    {
      key: "6",
      label: t("tab.ozelAlanlar", "Özel Alanlar"),
      children: <OzelAlanlar />,
    },
    {
      key: "7",
      label: t("tab.uygulamaBilgileri", "Uygulama Bilgileri"),
      children: <UygulamaBilgileri />,
    },
    {
      key: "8",
      label: tabCounts.DosyaSayisi > 0 ? `${t("tab.ekliBelgeler", "Ekli Belgeler")} (${tabCounts.DosyaSayisi})` : t("tab.ekliBelgeler", "Ekli Belgeler"),
      children: <DosyaUpload />,
    },
    {
      key: "9",
      label: tabCounts.ResimSayisi > 0 ? `${t("tab.resimler", "Resimler")} (${tabCounts.ResimSayisi})` : t("tab.resimler", "Resimler"),
      children: <ResimUpload />,
    },
    {
      key: "10",
      label: (
        <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
          {t("tab.aciklama", "Açıklama")}
          {tabCounts.AciklamaVar === 1 && (
            <span
              style={{
                width: "6px",
                height: "6px",
                backgroundColor: "#2bc770",
                borderRadius: "50%",
                display: "inline-block",
              }}
            />
          )}
        </span>
      ),
      children: <Aciklama />,
    },
  ];

  return (
    <div>
      <StyledTabs defaultActiveKey="1" items={items} onChange={handleTabChange} />
    </div>
  );
}
