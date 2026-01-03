import React, { useEffect, useMemo, useState } from "react";
import { Tabs } from "antd";
import { useFormContext } from "react-hook-form";
import OzelAlanlar from "./components/OzelAlanlar.jsx";
import Notlar from "./components/Notlar.jsx";
import ResimUpload from "../../../../../utils/components/Resim/ResimUpload.jsx";
import DosyaUpload from "../../../../../utils/components/Dosya/DosyaUpload.jsx";
import { DetayBilgi } from "./components/DetayBilgi.jsx";
import { FinansalBilgiler } from "./components/FinansalBilgiler.jsx";
import Ekipman from "./components/Ekipman/EkipmanListesiTablo.jsx";
import Sayac from "./components/Sayac/Sayac.jsx";
import PeriyodikBakimlarTablo from "./components/PeriyodikBakimlarTablo.jsx";
import MainTabs from "../MainTabs/MainTabs.jsx";

import { t } from "i18next";

const contentContainerStyle = {
  backgroundColor: "#ffffff",
  padding: "10px",
  borderRadius: "6px",
  border: "1px solid #D9D4D5",
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
  marginBottom: "10px",
};
const tabBarContainerStyle = {
  backgroundColor: "#ffffff",
  padding: "10px",
  borderRadius: "6px",
  border: "1px solid #D9D4D5",
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
  marginBottom: "10px",
};

function Tablar({ selectedRowID, update }) {
  const [activeKey, setActiveKey] = useState("0");
  const { watch } = useFormContext();
  const watchedMakineId = watch("secilenMakineID");
  const effectiveMakineId = selectedRowID ?? watchedMakineId;

  const tabs = useMemo(() => {
    const tabDefinitions = [
      {
        key: "0",
        label: t("genelBilgiler"),
        render: () => (
          <div>
            <MainTabs />
          </div>
        ),
      },
      {
        key: "1",
        label: t("altEkipmanlar"),
        requiresUpdate: true,
        render: (currentKey) => (
          <div style={contentContainerStyle}>
            <Ekipman isActive={currentKey === "1"} />
          </div>
        ),
      },
      { key: "2", label: t("detayBilgi"), render: () => <DetayBilgi /> },
      { key: "3", label: t("finansalBilgiler"), render: () => <FinansalBilgiler /> },
      {
        key: "4",
        label: t("sayac"),
        requiresUpdate: true,
        render: () => (
          <div style={{ marginBottom: "10px" }}>
            <Sayac selectedRowID={effectiveMakineId} />
          </div>
        ),
      },
      {
        key: "5",
        label: t("periyodikBakimlar", { defaultValue: "Periyodik Bakımlar" }),
        requiresUpdate: true,
        render: (currentKey) => (
          <div style={contentContainerStyle}>
            <PeriyodikBakimlarTablo makineId={effectiveMakineId} isActive={currentKey === "5"} />
          </div>
        ),
      },
      {
        key: "6",
        label: t("ozelAlanlar"),
        render: () => (
          <div style={{ marginBottom: "10px" }}>
            <OzelAlanlar />
          </div>
        ),
      },
      {
        key: "7",
        label: t("notlar"),
        render: () => (
          <div style={{ marginBottom: "10px" }}>
            <Notlar />
          </div>
        ),
      },
      {
        key: "8",
        label: t("ekliBelgeler"),
        requiresUpdate: true,
        render: () => (
          <div style={contentContainerStyle}>
            <DosyaUpload selectedRowID={effectiveMakineId} refGroup={"MAKINE"} />
          </div>
        ),
      },
      {
        key: "9",
        label: t("resimler"),
        requiresUpdate: true,
        render: () => (
          <div style={contentContainerStyle}>
            <ResimUpload selectedRowID={effectiveMakineId} refGroup={"MAKINE"} />
          </div>
        ),
      },
    ];

    return tabDefinitions.filter(({ requiresUpdate }) => update || !requiresUpdate);
  }, [effectiveMakineId, t, update]);

  useEffect(() => {
    if (!tabs.some((tab) => tab.key === activeKey) && tabs.length > 0) {
      setActiveKey(tabs[0].key);
    }
  }, [activeKey, tabs]);

  return (
    <Tabs
      activeKey={activeKey}
      onChange={setActiveKey}
      tabBarStyle={{ margin: 0 }}
      renderTabBar={(props, DefaultTabBar) => (
        <div style={tabBarContainerStyle}>
          <DefaultTabBar {...props} />
        </div>
      )}
      items={tabs.map(({ key, label, render }) => ({
        key,
        label,
        children: render(activeKey),
      }))}
    />
  );
}

export default Tablar;
