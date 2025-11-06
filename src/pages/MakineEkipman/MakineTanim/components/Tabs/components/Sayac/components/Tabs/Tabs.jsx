import React, { useEffect, useMemo, useState } from "react";
import { Radio } from "antd";
import { useFormContext } from "react-hook-form";
import { SayacDetayBilgileri } from "./components/SayacDetayBilgileri.jsx";
import Textarea from "../../../../../../../../../utils/components/Form/Textarea.jsx";
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
    const baseTabs = [
      { key: "1", label: t("detayBilgileri"), content: <SayacDetayBilgileri /> },
      /* {
        key: "3",
        label: t("ozelAlanlar"),
        content: (
          <div
            style={{
              backgroundColor: "#ffffffff",
              padding: "10px",
              border: "1px solid #80808068",
              borderRadius: "5px",
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
              width: "100%",
            }}
          >

          </div>
        ),
      }, */
      {
        key: "4",
        label: t("aciklama"),
        content: (
          <div
            style={{
              backgroundColor: "#ffffffff",
              padding: "10px",
              border: "1px solid #80808068",
              borderRadius: "5px",
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
              width: "100%",
            }}
          >
            <Textarea name="aciklama" styles={{ minHeight: "100px", width: "100%", border: "1px solid #D9D4D5", borderRadius: "4px", padding: "8px" }} />
          </div>
        ),
      },
    ];

    if (!update) {
      return baseTabs;
    }

    return [...baseTabs];
  }, [selectedRowID, update, effectiveMakineId]);

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
      {activeTab?.content}
    </>
  );
}

export default Tablar;
