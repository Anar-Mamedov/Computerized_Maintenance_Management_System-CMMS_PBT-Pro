import React, { useState } from "react";
import { Radio, Divider } from "antd";
import MainTabs from "./MainTabs/MainTabs";
import Yetkiler from "./Yetkiler/Yetkiler";
import LokasyonYetkileri from "./LokasyonYetkileri/LokasyonYetkileri1";
import { t } from "i18next";

function Tablar() {
  const [tabKey, setTabKey] = useState("1");

  const handleTabChange = (e) => {
    setTabKey(e.target.value);
  };

  return (
    <>
      <Radio.Group value={tabKey} onChange={handleTabChange} style={{ display: "flex", justifyContent: "center" }}>
        <Radio.Button value="1">{t("hesap")}</Radio.Button>
        <Radio.Button value="2">{t("lokasyonlar")}</Radio.Button>
        <Radio.Button value="3">{t("yetkiler")}</Radio.Button>
      </Radio.Group>
      <Divider style={{ marginBottom: 10 }} />
      {tabKey === "1" && <MainTabs />}
      {tabKey === "2" && <LokasyonYetkileri />}
      {tabKey === "3" && <Yetkiler />}
    </>
  );
}

export default Tablar;
