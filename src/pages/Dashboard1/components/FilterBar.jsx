import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { Button, Space } from "antd";
import { SwapRightOutlined } from "@ant-design/icons";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";
import { LuLayoutGrid, LuRefreshCw } from "react-icons/lu";
import FullDatePicker from "../../../utils/components/FullDatePicker";
import LokasyonTablo from "../../../utils/components/LokasyonTablo";
import EkipmanFilterSelect from "./EkipmanFilterSelect";
import { useDashboard } from "./dashboardContext";
import { COLORS } from "./theme";

export default function FilterBar({ onOpenWidgetManager }) {
  const { t } = useTranslation();
  const { watch } = useFormContext();
  const { baslangicTarihi, bitisTarihi, ekipmanIds, setBaslangicTarihi, setBitisTarihi, setLokasyonIds, setEkipmanIds, refresh, sonGuncelleme } = useDashboard();

  const formBaslangic = watch("dashboardBaslangicTarihi");
  const formBitis = watch("dashboardBitisTarihi");

  // Form üzerindeki tarih seçimleri dashboard filtre state'ine aktarılır.
  useEffect(() => {
    if (formBaslangic && !dayjs(formBaslangic).isSame(baslangicTarihi, "day")) {
      setBaslangicTarihi(formBaslangic);
    }
  }, [formBaslangic, baslangicTarihi, setBaslangicTarihi]);

  useEffect(() => {
    if (formBitis && !dayjs(formBitis).isSame(bitisTarihi, "day")) {
      setBitisTarihi(formBitis);
    }
  }, [formBitis, bitisTarihi, setBitisTarihi]);

  return (
    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, flexWrap: "wrap", marginBottom: 14 }}>
      <div>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: COLORS.text, margin: 0, lineHeight: 1.3 }}>{t("dashboard")}</h1>
        <div style={{ marginTop: 10 }}>
          <Space wrap size={8}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6, width: 290 }}>
              <span style={{ flex: 1, minWidth: 0 }}>
                <FullDatePicker name1="dashboardBaslangicTarihi" showError={false} allowClear={false} placeholder={t("baslangicTarihi")} />
              </span>
              <SwapRightOutlined style={{ color: COLORS.muted, flexShrink: 0 }} />
              <span style={{ flex: 1, minWidth: 0 }}>
                <FullDatePicker name1="dashboardBitisTarihi" showError={false} allowClear={false} placeholder={t("bitisTarihi")} />
              </span>
            </span>
            <span style={{ display: "inline-block", width: 232 }}>
              <LokasyonTablo
                lokasyonFieldName="dashboardLokasyonTanim"
                lokasyonIdFieldName="dashboardLokasyonID"
                placeholder={t("tumLokasyonlar")}
                onSubmit={(selectedData) => setLokasyonIds([selectedData.key])}
                onClear={() => setLokasyonIds([])}
              />
            </span>
            <EkipmanFilterSelect value={ekipmanIds} onChange={setEkipmanIds} />
          </Space>
        </div>
      </div>

      <Space wrap size={8}>
        <span style={{ fontSize: 12.5, color: COLORS.muted }}>
          {t("sonGuncelleme")}: {dayjs(sonGuncelleme).format("HH:mm")}
        </span>
        <Button icon={<LuRefreshCw size={14} />} onClick={refresh}>
          {t("verileriYenile")}
        </Button>
        <Button icon={<LuLayoutGrid size={14} />} onClick={onOpenWidgetManager}>
          {t("widgetleriYonet")}
        </Button>
      </Space>
    </div>
  );
}

FilterBar.propTypes = {
  onOpenWidgetManager: PropTypes.func.isRequired,
};
