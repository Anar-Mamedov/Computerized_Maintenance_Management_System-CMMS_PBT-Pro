import React from "react";
import PropTypes from "prop-types";
import { Skeleton } from "antd";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { LuChevronRight, LuClipboardCheck, LuClipboardList, LuPackageSearch, LuAlertTriangle } from "react-icons/lu";
import { formatNumberWithSeparators } from "../../../utils/numberLocale";
import { useDashboard } from "./dashboardContext";
import { useKpiCards } from "./kpiCardsContext";
import { findActionCount, useActionCenter } from "./actionCenterContext";
import { navigateToTarget } from "./navigation";
import { CARD_STYLE, COLORS, TONES } from "./theme";

// Her kart ayrı bir widget'tır. Alt satır Aksiyon Merkezi verisinden türetilir; her parça birebir o kalemin adedidir.
export const KPI_CARD_DEFINITIONS = {
  kpiBekleyenIsTalepleri: {
    apiKey: "BekleyenIsTalepleri",
    labelKey: "bekleyenIsTalepleri",
    tone: "blue",
    Icon: LuClipboardList,
    details: [{ actionKey: "ONAY_BEKLEYEN_TALEP", textKey: "onayBekliyorAdet" }],
  },
  kpiAcikIsEmirleri: {
    apiKey: "AcikIsEmirleri",
    labelKey: "acikIsEmirleri",
    tone: "amber",
    Icon: LuClipboardCheck,
    details: [
      { actionKey: "KRITIK_ACIK_ARIZA", textKey: "kritikArizaAdet" },
      { actionKey: "DURUSU_DEVAM_EDEN_ISEMRI", textKey: "durusuDevamEdenAdet" },
    ],
  },
  kpiKritikStoklar: {
    apiKey: "KritikStoklar",
    labelKey: "kritikStoklar",
    tone: "orange",
    Icon: LuPackageSearch,
    details: [{ actionKey: "STOKTA_OLMAYAN_KRITIK", textKey: "stoktaYokAdet" }],
  },
  kpiAcikArizaIsEmirleri: {
    apiKey: "AcikArizaIsEmirleri",
    labelKey: "acikArizaIsEmirleri",
    tone: "red",
    Icon: LuAlertTriangle,
    details: [{ actionKey: "KRITIK_ACIK_ARIZA", textKey: "kritikAdet" }],
  },
};

export default function KpiCard({ cardKey }) {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { filters } = useDashboard();
  const { cards, loading, hasError } = useKpiCards();
  const { items: actionItems } = useActionCenter();

  const { apiKey, labelKey, tone, Icon, details } = KPI_CARD_DEFINITIONS[cardKey];
  const card = cards[apiKey];
  const { main, soft } = TONES[tone];

  const detailText = details
    .map(({ actionKey, textKey }) => {
      const count = findActionCount(actionItems, actionKey);
      return count === undefined ? null : t(textKey, { adet: formatNumberWithSeparators(count, i18n.language) });
    })
    .filter(Boolean)
    .join(" · ");

  return (
    <button
      type="button"
      className="pbt-kpi"
      onClick={() => card && navigateToTarget(navigate, card.TargetPage, card.FilterParams, filters)}
      style={{
        ...CARD_STYLE,
        width: "100%",
        height: "100%",
        textAlign: "left",
        padding: "14px 16px",
        cursor: "pointer",
        borderTop: `3px solid ${main}`,
        display: "flex",
        alignItems: "center",
        gap: 12,
      }}
    >
      <span style={{ width: 36, height: 36, borderRadius: 9, background: soft, color: main, display: "grid", placeItems: "center", flexShrink: 0 }}>
        <Icon size={18} strokeWidth={1.9} />
      </span>
      <span style={{ minWidth: 0, flex: 1 }}>
        <span style={{ display: "block", fontSize: 12.5, color: COLORS.muted }}>{t(labelKey)}</span>
        <span style={{ display: "block", fontSize: 24, fontWeight: 700, color: COLORS.text, lineHeight: 1.25 }}>
          {loading ? <Skeleton.Button active size="small" style={{ width: 64, height: 26 }} /> : formatNumberWithSeparators(card?.Count ?? 0, i18n.language)}
        </span>
        <span style={{ display: "block", fontSize: 11.5, color: COLORS.muted, minHeight: 17 }}>{hasError ? t("veriAlinamadi") : detailText}</span>
      </span>
      <LuChevronRight size={16} color={COLORS.muted} style={{ flexShrink: 0 }} />
    </button>
  );
}

KpiCard.propTypes = {
  cardKey: PropTypes.oneOf(Object.keys(KPI_CARD_DEFINITIONS)).isRequired,
};
