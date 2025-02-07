import React, { useState } from "react";
import { Radio, Divider } from "antd";
import MainTabs from "./MainTabs/MainTabs";
import Yetkiler from "./Yetkiler/Yetkiler";
import MenuVeEkranYetkileri from "./MenuVeEkranYetkileri/MenuVeEkranYetkileri";

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

        <Radio.Button value="5">{t("yetkiler")}</Radio.Button>
        <Radio.Button value="6">{t("menuVeEkranYetkileri")}</Radio.Button>
      </Radio.Group>
      <Divider style={{ marginBottom: 10 }} />
      {tabKey === "1" && <MainTabs />}

      {tabKey === "5" && <Yetkiler />}
      {tabKey === "6" && <MenuVeEkranYetkileri />}
    </>
  );
}

export default Tablar;
