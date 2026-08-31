import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { Button, Space, Tag } from "antd";
import { SwapRightOutlined } from "@ant-design/icons";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";
import { LuArrowDownUp, LuLayoutGrid, LuRefreshCw } from "react-icons/lu";
import FullDatePicker from "../../../utils/components/FullDatePicker";
import LokasyonFilterSelect from "./LokasyonFilterSelect";
import EkipmanFilterSelect from "./EkipmanFilterSelect";
import { useDashboard } from "./dashboardContext";
import { COLORS } from "./theme";

const DATE_DISPLAY_FORMAT = "DD.MM.YYYY";

export default function FilterBar({ reorderMode, onToggleReorder, onOpenWidgetManager }) {
  const { t } = useTranslation();
  const { watch } = useFormContext();
  const { baslangicTarihi, bitisTarihi, lokasyonIds, ekipmanIds, setBaslangicTarihi, setBitisTarihi, setLokasyonIds, setEkipmanIds, refresh, sonGuncelleme } = useDashboard();

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

  const araligiEtiketi = `${dayjs(baslangicTarihi).format(DATE_DISPLAY_FORMAT)} – ${dayjs(bitisTarihi).format(DATE_DISPLAY_FORMAT)}`;

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
            <LokasyonFilterSelect value={lokasyonIds} onChange={setLokasyonIds} />
            <EkipmanFilterSelect value={ekipmanIds} onChange={setEkipmanIds} />
            <Tag style={{ color: COLORS.muted }}>{araligiEtiketi}</Tag>
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
        <Button icon={<LuArrowDownUp size={14} />} type={reorderMode ? "primary" : "default"} onClick={onToggleReorder}>
          {reorderMode ? t("siralamayiBitir") : t("yenidenSirala")}
        </Button>
        <Button icon={<LuLayoutGrid size={14} />} onClick={onOpenWidgetManager}>
          {t("widgetleriYonet")}
        </Button>
      </Space>
    </div>
  );
}

FilterBar.propTypes = {
  reorderMode: PropTypes.bool,
  onToggleReorder: PropTypes.func.isRequired,
  onOpenWidgetManager: PropTypes.func.isRequired,
};
