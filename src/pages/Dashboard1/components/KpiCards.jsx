import React from "react";
import { Col, Row, Skeleton } from "antd";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { LuChevronRight, LuClipboardCheck, LuClipboardList, LuPackageSearch, LuAlertTriangle } from "react-icons/lu";
import { formatNumberWithSeparators } from "../../../utils/numberLocale";
import useWidgetData from "./useWidgetData";
import { useDashboard } from "./dashboardContext";
import { findActionCount, useActionCenter } from "./actionCenterContext";
import { navigateToTarget } from "./navigation";
import { CARD_STYLE, COLORS, ROW_GUTTER, TONES } from "./theme";

// Kartların alt satırı Aksiyon Merkezi verisinden türetilir; her parça birebir o kalemin adedidir.
const CARD_DEFINITIONS = [
  {
    key: "BekleyenIsTalepleri",
    labelKey: "bekleyenIsTalepleri",
    tone: "blue",
    Icon: LuClipboardList,
    details: [{ actionKey: "ONAY_BEKLEYEN_TALEP", textKey: "onayBekliyorAdet" }],
  },
  {
    key: "AcikIsEmirleri",
    labelKey: "acikIsEmirleri",
    tone: "amber",
    Icon: LuClipboardCheck,
    details: [
      { actionKey: "KRITIK_ACIK_ARIZA", textKey: "kritikArizaAdet" },
      { actionKey: "DURUSU_DEVAM_EDEN_ISEMRI", textKey: "durusuDevamEdenAdet" },
    ],
  },
  {
    key: "KritikStoklar",
    labelKey: "kritikStoklar",
    tone: "orange",
    Icon: LuPackageSearch,
    details: [{ actionKey: "STOKTA_OLMAYAN_KRITIK", textKey: "stoktaYokAdet" }],
  },
  {
    key: "AcikArizaIsEmirleri",
    labelKey: "acikArizaIsEmirleri",
    tone: "red",
    Icon: LuAlertTriangle,
    details: [{ actionKey: "KRITIK_ACIK_ARIZA", textKey: "kritikAdet" }],
  },
];

export default function KpiCards() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { filters } = useDashboard();
  const { data, loading, hasError } = useWidgetData("GetDashboardV2Cards");
  const { items: actionItems } = useActionCenter();

  const cards = data?.data || {};

  const buildDetailText = (details) =>
    details
      .map(({ actionKey, textKey }) => {
        const count = findActionCount(actionItems, actionKey);
        return count === undefined ? null : t(textKey, { adet: formatNumberWithSeparators(count, i18n.language) });
      })
      .filter(Boolean)
      .join(" · ");

  return (
    <Row gutter={ROW_GUTTER}>
      {CARD_DEFINITIONS.map(({ key, labelKey, tone, Icon, details }) => {
        const card = cards[key];
        const { main, soft } = TONES[tone];
        const detailText = buildDetailText(details);

        return (
          <Col key={key} xs={24} sm={12} xl={6}>
            <button
              type="button"
              className="pbt-kpi"
              onClick={() => card && navigateToTarget(navigate, card.TargetPage, card.FilterParams, filters)}
              style={{ ...CARD_STYLE, width: "100%", textAlign: "left", padding: "14px 16px", cursor: "pointer", borderTop: `3px solid ${main}`, display: "flex", alignItems: "center", gap: 12 }}
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
          </Col>
        );
      })}
    </Row>
  );
}
