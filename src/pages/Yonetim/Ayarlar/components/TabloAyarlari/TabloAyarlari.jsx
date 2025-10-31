import React, { useEffect, useState } from "react";
import { Button, Switch } from "antd";
import { t } from "i18next";

function TabloAyarlari() {
  const [scrollPage, setScrollPage] = useState(false);
  const [pendingValue, setPendingValue] = useState(false);
  const storageKey = "scroolPage";

  useEffect(() => {
    if (typeof window === "undefined") return;

    const storedValue = localStorage.getItem(storageKey);

    if (storedValue === null) {
      localStorage.setItem(storageKey, JSON.stringify(false));
      setScrollPage(false);
      setPendingValue(false);
      return;
    }

    try {
      const value = Boolean(JSON.parse(storedValue));
      setScrollPage(value);
      setPendingValue(value);
    } catch {
      const fallback = storedValue === "true";
      setScrollPage(fallback);
      setPendingValue(fallback);
    }
  }, [storageKey]);

  const handleChange = (checked) => {
    setPendingValue(checked);
  };

  const handleSave = () => {
    if (typeof window === "undefined") return;
    localStorage.setItem(storageKey, JSON.stringify(pendingValue));
    setScrollPage(pendingValue);
    window.location.reload();
  };

  const isDirty = pendingValue !== scrollPage;

  return (
    <div style={{ padding: "16px" }}>
      <h3 style={{ marginBottom: "16px" }}>{t("tabloAyarlari")}</h3>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px" }}>
        <span>{t("tableInfiniteScroll")}</span>
        <Switch checked={pendingValue} onChange={handleChange} />
      </div>
      <Button block type="primary" style={{ marginTop: "24px" }} onClick={handleSave} disabled={!isDirty}>
        {t("kaydet")}
      </Button>
    </div>
  );
}

export default TabloAyarlari;
