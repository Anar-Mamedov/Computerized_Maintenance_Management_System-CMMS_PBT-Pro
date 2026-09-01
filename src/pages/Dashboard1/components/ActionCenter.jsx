import React from "react";
import PropTypes from "prop-types";
import { Empty } from "antd";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { LuAlertTriangle, LuBellOff, LuChevronRight, LuClock, LuPackageX, LuPause, LuStamp } from "react-icons/lu";
import { formatNumberWithSeparators } from "../../../utils/numberLocale";
import { useDashboard } from "./dashboardContext";
import { useActionCenter } from "./actionCenterContext";
import { navigateToTarget } from "./navigation";
import downloadCsv from "./downloadCsv";
import WidgetCard from "./WidgetCard";
import { COLORS, TONES } from "./theme";

// Aksiyon kalemlerinin ikon ve renk eşlemesi (API Key alanına göre).
const ITEM_STYLES = {
  GECIKEN_PBAKIM: { tone: "amber", Icon: LuClock },
  ONAY_BEKLEYEN_TALEP: { tone: "blue", Icon: LuStamp },
  STOKTA_OLMAYAN_KRITIK: { tone: "orange", Icon: LuPackageX },
  KRITIK_ACIK_ARIZA: { tone: "red", Icon: LuAlertTriangle },
  SURESI_GECEN_HATIRLATICI: { tone: "purple", Icon: LuBellOff },
  DURUSU_DEVAM_EDEN_ISEMRI: { tone: "green", Icon: LuPause },
};

export default function ActionCenter({ onHide }) {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { filters } = useDashboard();
  const { items, loading, hasError, reload } = useActionCenter();

  const handleDownload = () =>
    downloadCsv(
      "aksiyon-merkezi",
      [t("aksiyonMerkezi"), t("adet")],
      items.map((item) => [item.Label, item.Count])
    );

  return (
    <WidgetCard title={t("aksiyonMerkezi")} subtitle={t("aksiyonBekleyenKayitlar")} loading={loading} hasError={hasError} bodyPadding={8} onRefresh={reload} onDownload={items.length ? handleDownload : undefined} onHide={onHide}>
      {!loading && items.length === 0 ? (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={t("veriYok")} />
      ) : (
        <div style={{ display: "flex", flexDirection: "column" }}>
          {items.map((item) => {
            const { tone, Icon } = ITEM_STYLES[item.Key] || { tone: "blue", Icon: LuClock };
            const { main, soft } = TONES[tone];

            return (
              <button
                key={item.Key}
                type="button"
                className="pbt-row"
                onClick={() => navigateToTarget(navigate, item.TargetPage, item.FilterParams, filters)}
                style={{ display: "flex", alignItems: "center", gap: 10, padding: "11px 10px", border: "none", background: "transparent", cursor: "pointer", textAlign: "left", borderRadius: 8 }}
              >
                <span style={{ width: 28, height: 28, borderRadius: 8, background: soft, color: main, display: "grid", placeItems: "center", flexShrink: 0 }}>
                  <Icon size={15} strokeWidth={1.9} />
                </span>
                <span style={{ flex: 1, fontSize: 13, color: COLORS.text, minWidth: 0 }}>{item.Label}</span>
                <span style={{ background: soft, color: main, fontWeight: 700, fontSize: 12, borderRadius: 999, padding: "2px 9px" }}>{formatNumberWithSeparators(item.Count, i18n.language)}</span>
                <LuChevronRight size={15} color={COLORS.muted} />
              </button>
            );
          })}
        </div>
      )}
    </WidgetCard>
  );
}

ActionCenter.propTypes = {
  onHide: PropTypes.func,
};
