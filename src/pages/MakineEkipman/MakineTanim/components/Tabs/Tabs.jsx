import React, { useEffect, useMemo, useState } from "react";
import { Radio } from "antd";
import { useFormContext } from "react-hook-form";
import OzelAlanlar from "./components/OzelAlanlar.jsx";
import Notlar from "./components/Notlar.jsx";
import ResimUpload from "../../../../../utils/components/Resim/ResimUpload.jsx";
import DosyaUpload from "../../../../../utils/components/Dosya/DosyaUpload.jsx";
import { DetayBilgi } from "./components/DetayBilgi.jsx";
import { FinansalBilgiler } from "./components/FinansalBilgiler.jsx";
import Ekipman from "./components/Ekipman/EkipmanListesiTablo.jsx";
import Sayac from "./components/Sayac/Sayac.jsx";

import { t } from "i18next";

const contentContainerStyle = {
  backgroundColor: "#ffffff",
  padding: "10px",
  borderRadius: "6px",
  border: "1px solid #D9D4D5",
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
};

function Tablar({ selectedRowID, update }) {
  const [tabKey, setTabKey] = useState("1");
  const { watch } = useFormContext();
  const watchedMakineId = watch("secilenMakineID");
  const effectiveMakineId = selectedRowID ?? watchedMakineId;

  const tabs = useMemo(() => {
    const tabDefinitions = [
      {
        key: "1",
        label: t("ekipmanListesi"),
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
        render: () => <Sayac selectedRowID={effectiveMakineId} />,
      },
      {
        key: "5",
        label: t("periyodikBakimlar", { defaultValue: "Periyodik Bakımlar" }),
        requiresUpdate: true,
        render: () => (
          <div style={contentContainerStyle}>
            <span style={{ color: "#8c8c8c" }}>Periyodik bakım planları burada görüntülenecek.</span>
          </div>
        ),
      },
      {
        key: "6",
        label: t("ozelAlanlar"),
        render: () => <OzelAlanlar />,
      },
      {
        key: "7",
        label: t("notlar"),
        render: () => <Notlar />,
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

  const handleTabChange = (e) => {
    setTabKey(e.target.value);
  };

  useEffect(() => {
    if (!tabs.some((tab) => tab.key === tabKey) && tabs.length > 0) {
      setTabKey(tabs[0].key);
    }
  }, [tabKey, tabs]);

  const activeTab = tabs.find((tab) => tab.key === tabKey);

  return (
    <>
      <div
        style={{ backgroundColor: "#ffffff", padding: "10px", borderRadius: "6px", border: "1px solid #D9D4D5", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)", marginBottom: "10px" }}
      >
        <Radio.Group
          value={tabKey}
          onChange={handleTabChange}
          style={{
            display: "inline-flex",
            justifyContent: "flex-start",
            padding: "2px",
            backgroundColor: "#F3F1F1",
            gap: "0",
            border: "1px solid #D9D4D5",
            borderRadius: "6px",
          }}
          buttonStyle="solid"
        >
          {tabs.map(({ key, label }) => (
            <Radio.Button className="custom-radio-button" value={key} key={key}>
              {label}
            </Radio.Button>
          ))}
        </Radio.Group>
      </div>

      <style>
        {`
          .ant-radio-button-wrapper {
            height: 30px;
            padding: 5px 12px;
            border: none !important;
            border-radius: 0 !important;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s;
            background: transparent;
            font-size: 14px;
            color: #24292f;
            position: relative;
          }

          .ant-radio-button-wrapper:not(:last-child):after {
            content: "";
            position: absolute;
            right: 0;
            top: 50%;
            transform: translateY(-50%);
            width: 1px;
            height: 16px;
            background-color: #D9D4D5;
          }

          .ant-radio-button-wrapper:before {
            display: none !important;
          }

          .ant-radio-button-wrapper:not(:first-child)::before {
            display: none !important;
          }

          /* .ant-radio-button-wrapper:hover {
            background: #f3f4f6;
          } */

          .ant-radio-button-wrapper-checked {
            background: white !important;
            color: #24292f !important;
            border: 1px solid #D9D4D5 !important;
            font-weight: 500;
            box-shadow: 0 1px 0 rgba(27,31,36,0.04);
            border-radius: 6px !important;
            position: relative;
            z-index: 1;
          }

          .ant-radio-button-wrapper-checked:hover {
            background: white !important;
            color: #24292f !important;
          }

          /* Hide divider after the active tab */
          .ant-radio-button-wrapper-checked:after {
            display: none !important;
          }

          /* Hide divider before the active tab */
          .ant-radio-button-wrapper:not(.ant-radio-button-wrapper-checked) + .ant-radio-button-wrapper-checked:after {
            display: none !important;
          }
        `}
      </style>
      {/* <Divider style={{ marginBottom: 10, marginTop: 5 }} /> */}
      {activeTab?.render(tabKey)}
    </>
  );
}

export default Tablar;
