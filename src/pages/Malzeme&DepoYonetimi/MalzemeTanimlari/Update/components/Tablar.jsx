import React, { useState } from "react";
import { Radio, Divider } from "antd";
import Yetkiler from "./Yetkiler/Yetkiler";
import LokasyonYetkileri from "./LokasyonYetkileri/LokasyonYetkileri1";
import DepoYetkisi from "./DepoYetkisi/DepoYetkisi";
import AtolyeYetkisi from "./AtolyeYetkisi/AtolyeYetkisi";
import GenelBilgiler from "./GenelBilgiler/GenelBilgiler";
import { t } from "i18next";

function Tablar({ selectedRowID }) {
  const [tabKey, setTabKey] = useState("1");

  const handleTabChange = (e) => {
    setTabKey(e.target.value);
  };

  return (
    <>
      <Radio.Group value={tabKey} onChange={handleTabChange} style={{ display: "flex", justifyContent: "center" }}>
        <Radio.Button value="1">{t("genelBilgiler")}</Radio.Button>
        <Radio.Button value="2">{t("lokasyonlar")}</Radio.Button>
        <Radio.Button value="3">{t("depoYetkileri")}</Radio.Button>
        <Radio.Button value="4">{t("atolyeYetkileri")}</Radio.Button>
        <Radio.Button value="5">{t("yetkiler")}</Radio.Button>
      </Radio.Group>
      <Divider style={{ marginBottom: 10 }} />
      {tabKey === "1" && <GenelBilgiler selectedRowID={selectedRowID} />}
      {tabKey === "2" && <LokasyonYetkileri />}
      {tabKey === "3" && <DepoYetkisi />}
      {tabKey === "4" && <AtolyeYetkisi />}
      {tabKey === "5" && <Yetkiler />}
    </>
  );
}

export default Tablar;
