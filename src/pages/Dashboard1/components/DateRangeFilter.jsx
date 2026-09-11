import React, { useState } from "react";
import { Button, Popover, Select, Space } from "antd";
import { SwapRightOutlined } from "@ant-design/icons";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import FullDatePicker from "../../../utils/components/FullDatePicker";
import { COLORS } from "./theme";
import { HAZIR_ARALIKLAR } from "./dateRanges";

const START_FIELD = "dashboardBaslangicTarihi";
const END_FIELD = "dashboardBitisTarihi";
// Popover içindeki seçim önce taslak alanlara yazılır; dashboard yalnızca "Uygula" ile güncellenir.
const DRAFT_START_FIELD = "dashboardTaslakBaslangicTarihi";
const DRAFT_END_FIELD = "dashboardTaslakBitisTarihi";

const VARSAYILAN_ARALIK = "buYil";

/** Dashboard tarih aralığı filtresi: hazır aralık seçimi ve başlangıç/bitiş tarihleri. */
export default function DateRangeFilter() {
  const { t } = useTranslation();
  const { watch, getValues, setValue } = useFormContext();
  const [open, setOpen] = useState(false);
  // Popover içinde seçili olan aralık ile dashboard'a uygulanmış aralık ayrı tutulur.
  const [taslakAralik, setTaslakAralik] = useState(VARSAYILAN_ARALIK);
  const [uygulananAralik, setUygulananAralik] = useState(VARSAYILAN_ARALIK);

  const baslangic = watch(START_FIELD);
  const bitis = watch(END_FIELD);

  const hazirAralikSecenekleri = [
    { value: "tumu", label: t("tumu") },
    { value: "bugun", label: t("bugun") },
    { value: "dun", label: t("dun") },
    { value: "buHafta", label: t("buHafta") },
    { value: "gecenHafta", label: t("gecenHafta") },
    { value: "buAy", label: t("buAy") },
    { value: "gecenAy", label: t("gecenAy") },
    { value: "buYil", label: t("buYil") },
    { value: "gecenYil", label: t("gecenYil") },
    { value: "son1Ay", label: t("son1Ay") },
    { value: "son3Ay", label: t("son3Ay") },
    { value: "son6Ay", label: t("son6Ay") },
  ];

  // Popover her açıldığında taslak, dashboard'a uygulanmış değerlerle tazelenir.
  const handleOpenChange = (nextOpen) => {
    if (nextOpen) {
      setValue(DRAFT_START_FIELD, baslangic);
      setValue(DRAFT_END_FIELD, bitis);
      setTaslakAralik(uygulananAralik);
    }
    setOpen(nextOpen);
  };

  const handleHazirAralikChange = (value) => {
    const [yeniBaslangic, yeniBitis] = HAZIR_ARALIKLAR[value]();
    setValue(DRAFT_START_FIELD, yeniBaslangic);
    setValue(DRAFT_END_FIELD, yeniBitis);
    setTaslakAralik(value);
  };

  const handleUygula = () => {
    setValue(START_FIELD, getValues(DRAFT_START_FIELD) || null);
    setValue(END_FIELD, getValues(DRAFT_END_FIELD) || null);
    setUygulananAralik(taslakAralik);
    setOpen(false);
  };

  const handleIptal = () => setOpen(false);

  const icerik = (
    <div style={{ width: 300 }}>
      <div style={{ borderBottom: `1px solid ${COLORS.border}`, padding: 10, display: "flex", justifyContent: "space-between" }}>
        <Button onClick={handleIptal}>{t("iptal")}</Button>
        <Button type="primary" onClick={handleUygula}>
          {t("uygula")}
        </Button>
      </div>
      <div style={{ padding: 10, display: "flex", flexDirection: "column", gap: 10 }}>
        <Space size={6} style={{ width: "100%" }}>
          <span style={{ display: "inline-block", width: 128 }}>
            <FullDatePicker name1={DRAFT_START_FIELD} showError={false} allowClear={false} placeholder={t("baslangicTarihi")} onChange={() => setTaslakAralik(undefined)} />
          </span>
          <SwapRightOutlined style={{ color: COLORS.muted }} />
          <span style={{ display: "inline-block", width: 128 }}>
            <FullDatePicker name1={DRAFT_END_FIELD} showError={false} allowClear={false} placeholder={t("bitisTarihi")} onChange={() => setTaslakAralik(undefined)} />
          </span>
        </Space>
        <Select style={{ width: "100%" }} value={taslakAralik} onChange={handleHazirAralikChange} placeholder={t("secimYapin")} options={hazirAralikSecenekleri} />
      </div>
    </div>
  );

  return (
    <Popover content={icerik} trigger="click" open={open} onOpenChange={handleOpenChange} placement="bottom">
      <Button>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
          {t("tarih")}
          {(baslangic || bitis) && <span style={{ width: 8, height: 8, borderRadius: "50%", background: COLORS.blue }} />}
        </span>
      </Button>
    </Popover>
  );
}
