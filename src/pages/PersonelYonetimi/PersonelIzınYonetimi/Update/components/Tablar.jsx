import React, { useState } from "react";
import { Radio, Divider } from "antd";
import GenelBilgiler from "./GenelBilgiler/GenelBilgiler";
import OzelAlanlar from "./OzelAlanlar/OzelAlanlar";
import DosyaUpload from "./Belgeler/DosyaUpload";
import Resimler from "./Resimler/Resimler";
import Aciklama from "./Aciklama";
import { t } from "i18next";

function Tablar({ selectedRowID }) {
  const [tabKey, setTabKey] = useState("1");

  const handleTabChange = (e) => {
    setTabKey(e.target.value);
  };

  return (
    <>
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
          {t("genelBilgiler")}
        </Radio.Button>
        <Radio.Button className="custom-radio-button" value="2">
          {t("ozelAlanlar")}
        </Radio.Button>
        <Radio.Button className="custom-radio-button" value="3">
          {t("ekliBelgeler")}
        </Radio.Button>
        <Radio.Button className="custom-radio-button" value="4">
          {t("resimler")}
        </Radio.Button>
        <Radio.Button className="custom-radio-button" value="5">
          {t("aciklama")}
        </Radio.Button>
      </Radio.Group>
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
      <Divider style={{ marginBottom: 10, marginTop: 5 }} />
      {tabKey === "1" && <GenelBilgiler selectedRowID={selectedRowID} />}
      {tabKey === "2" && <OzelAlanlar />}
      {tabKey === "3" && <DosyaUpload selectedRowID={selectedRowID} />}
      {tabKey === "4" && <Resimler selectedRowID={selectedRowID} />}
      {tabKey === "5" && <Aciklama />}
    </>
  );
}

export default Tablar;
