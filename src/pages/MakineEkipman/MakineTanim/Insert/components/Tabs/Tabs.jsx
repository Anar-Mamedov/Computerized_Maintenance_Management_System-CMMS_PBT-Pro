import React, { useState } from "react";
import { Radio, Divider } from "antd";
import OzelAlanlar from "./components/OzelAlanlar.jsx";
import Notlar from "./components/Notlar.jsx";
import ResimUpload from "../../../../../../utils/components/Resim/ResimUpload.jsx";
import DosyaUpload from "../../../../../../utils/components/Dosya/DosyaUpload.jsx";
import { DetayBilgi } from "./components/DetayBilgi.jsx";
import { FinansalBilgiler } from "./components/FinansalBilgiler.jsx";

import { t } from "i18next";

function Tablar({ selectedRowID }) {
  const [tabKey, setTabKey] = useState("1");

  const handleTabChange = (e) => {
    setTabKey(e.target.value);
  };

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
          <Radio.Button className="custom-radio-button" value="1">
            {t("detayBilgi")}
          </Radio.Button>
          <Radio.Button className="custom-radio-button" value="2">
            {t("finansalBilgiler")}
          </Radio.Button>
          <Radio.Button className="custom-radio-button" value="3">
            {t("ozelAlanlar")}
          </Radio.Button>
          <Radio.Button className="custom-radio-button" value="4">
            {t("notlar")}
          </Radio.Button>
          {/*  <Radio.Button className="custom-radio-button" value="5">
            {t("ekliBelgeler")}
          </Radio.Button>
          <Radio.Button className="custom-radio-button" value="6">
            {t("resimler")}
          </Radio.Button> */}
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
      {tabKey === "1" && <DetayBilgi />}
      {tabKey === "2" && <FinansalBilgiler />}
      {tabKey === "3" && <OzelAlanlar />}
      {tabKey === "4" && <Notlar />}
      {tabKey === "5" && (
        <div style={{ backgroundColor: "#ffffff", padding: "10px", borderRadius: "6px", border: "1px solid #D9D4D5", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)" }}>
          <DosyaUpload selectedRowID={selectedRowID} refGroup={"DEPO"} />
        </div>
      )}
      {tabKey === "6" && (
        <div style={{ backgroundColor: "#ffffff", padding: "10px", borderRadius: "6px", border: "1px solid #D9D4D5", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)" }}>
          <ResimUpload selectedRowID={selectedRowID} refGroup={"DEPO"} />
        </div>
      )}
    </>
  );
}

export default Tablar;
