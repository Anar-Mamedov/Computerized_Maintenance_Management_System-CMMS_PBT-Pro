import React from "react";
import { Button, Skeleton } from "antd";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { LuClock, LuRefreshCw, LuTrendingDown, LuTrendingUp, LuUsers } from "react-icons/lu";
import useWidgetData from "./useWidgetData";
import { useDashboard } from "./dashboardContext";
import { isNavigableTarget, navigateToTarget } from "./navigation";
import { CARD_STYLE, COLORS } from "./theme";

export default function PerformanceSummary() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { filters } = useDashboard();
  const { data, loading, hasError, reload } = useWidgetData("GetDashboardV2PerformanceSummary");

  const ozet = data?.data;
  const arizaArtti = ozet?.ArizaTekrarOrani?.Durum === "ARTTI";

  const items = [
    {
      key: "arizaTekrarOrani",
      Icon: arizaArtti ? LuTrendingUp : LuTrendingDown,
      color: arizaArtti ? COLORS.red : COLORS.green,
      background: arizaArtti ? COLORS.redSoft : COLORS.greenSoft,
      metin: ozet?.ArizaTekrarOrani?.Metin,
    },
    {
      key: "gecikenPeriyodikBakim",
      Icon: LuClock,
      color: COLORS.amber,
      background: COLORS.amberSoft,
      metin: ozet?.GecikenPeriyodikBakim?.Metin,
      targetPage: ozet?.GecikenPeriyodikBakim?.TargetPage,
      filterParams: ozet?.GecikenPeriyodikBakim?.FilterParams,
    },
    {
      key: "enYuksekIsYukuEkip",
      Icon: LuUsers,
      color: COLORS.blue,
      background: COLORS.blueSoft,
      metin: ozet?.EnYuksekIsYukuEkip?.Metin,
      targetPage: ozet?.EnYuksekIsYukuEkip?.TargetPage,
      filterParams: ozet?.EnYuksekIsYukuEkip?.FilterParams,
    },
  ];

  return (
    <div style={{ ...CARD_STYLE, padding: "10px 14px", display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
      <span style={{ fontSize: 13, fontWeight: 600, color: COLORS.text }}>{t("bakimPerformansiOzeti")}</span>
      <span style={{ width: 1, height: 18, background: COLORS.border }} />
      {hasError ? (
        <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 12.5, color: COLORS.muted }}>{t("veriAlinamadi")}</span>
          <Button size="small" icon={<LuRefreshCw size={12} />} onClick={reload}>
            {t("tekrarDene")}
          </Button>
        </span>
      ) : loading ? (
        <Skeleton.Input active size="small" style={{ width: 420 }} />
      ) : (
        items.map(({ key, Icon, color, background, metin, targetPage, filterParams }) => {
          const tiklanabilir = Boolean(metin) && isNavigableTarget(targetPage);

          return (
            <span
              key={key}
              role={tiklanabilir ? "button" : undefined}
              tabIndex={tiklanabilir ? 0 : undefined}
              onClick={tiklanabilir ? () => navigateToTarget(navigate, targetPage, filterParams, filters) : undefined}
              onKeyDown={tiklanabilir ? (event) => event.key === "Enter" && navigateToTarget(navigate, targetPage, filterParams, filters) : undefined}
              style={{ display: "inline-flex", alignItems: "center", gap: 8, cursor: tiklanabilir ? "pointer" : "default" }}
            >
              <span style={{ width: 22, height: 22, borderRadius: 6, background, color, display: "grid", placeItems: "center" }}>
                <Icon size={13} />
              </span>
              <span style={{ fontSize: 12.5, color: COLORS.muted }}>{metin || t("veriYok")}</span>
            </span>
          );
        })
      )}
    </div>
  );
}
