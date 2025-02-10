import React, { useState } from "react";
import { Radio, Divider } from "antd";
import MainTabs from "./MainTabs/MainTabs";
import Yetkiler from "./Yetkiler/Yetkiler";
import LokasyonYetkileri from "./LokasyonYetkileri/LokasyonYetkileri1";
import DepoYetkisi from "./DepoYetkisi/DepoYetkisi";
import AtolyeYetkisi from "./AtolyeYetkisi/AtolyeYetkisi";
import MenuVeEkranYetkileri from "./MenuVeEkranYetkileri/MenuVeEkranYetkileri";
import { t } from "i18next";
import { useFormContext } from "react-hook-form";

function Tablar() {
  const [tabKey, setTabKey] = useState("1");
  const { watch } = useFormContext();
  const rolSelect = watch("rolSelect");

  const handleTabChange = (e) => {
    setTabKey(e.target.value);
  };

  // If rolSelect has a value and user tries to access disabled tabs, prevent tab change
  React.useEffect(() => {
    if (rolSelect && (tabKey === "5" || tabKey === "6")) {
      setTabKey("1");
    }
  }, [rolSelect]);

  return (
    <>
      <Radio.Group value={tabKey} onChange={handleTabChange} style={{ display: "flex", justifyContent: "center" }}>
        <Radio.Button value="1">{t("hesap")}</Radio.Button>
        <Radio.Button value="2">{t("lokasyonlar")}</Radio.Button>
        <Radio.Button value="3">{t("depoYetkileri")}</Radio.Button>
        <Radio.Button value="4">{t("atolyeYetkileri")}</Radio.Button>
        <Radio.Button value="5" disabled={!!rolSelect}>
          {t("yetkiler")}
        </Radio.Button>
        <Radio.Button value="6" disabled={!!rolSelect}>
          {t("menuVeEkranYetkileri")}
        </Radio.Button>
      </Radio.Group>
      <Divider style={{ marginBottom: 10 }} />
      {tabKey === "1" && <MainTabs />}
      {tabKey === "2" && <LokasyonYetkileri />}
      {tabKey === "3" && <DepoYetkisi />}
      {tabKey === "4" && <AtolyeYetkisi />}
      {tabKey === "5" && <Yetkiler />}
      {tabKey === "6" && <MenuVeEkranYetkileri />}
    </>
  );
}

export default Tablar;
