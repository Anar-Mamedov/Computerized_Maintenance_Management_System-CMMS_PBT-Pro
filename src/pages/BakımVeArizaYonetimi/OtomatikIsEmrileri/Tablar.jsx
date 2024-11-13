import React, { useState } from "react";
import { Radio, Divider } from "antd";
import MainTable from "./TarihBazliPeriyodikBakim/Table/Table";
import Hazirlaniyor from "../../Hazirlaniyor";
import { t } from "i18next";

function Tablar() {
  const [tabKey, setTabKey] = useState("1");

  const handleTabChange = (e) => {
    setTabKey(e.target.value);
  };

  return (
    <>
      <Radio.Group value={tabKey} onChange={handleTabChange} style={{ display: "flex", justifyContent: "center" }}>
        <Radio.Button value="1">{t("tarihBazliPeriyodikBakim")}</Radio.Button>
        <Radio.Button value="2">{t("sayacBazliPeriyodikBakim")}</Radio.Button>
      </Radio.Group>
      <Divider style={{ marginBottom: 10, marginTop: "10px" }} />
      {tabKey === "1" && <MainTable />}
      {tabKey === "2" && <Hazirlaniyor />}
    </>
  );
}

export default Tablar;
