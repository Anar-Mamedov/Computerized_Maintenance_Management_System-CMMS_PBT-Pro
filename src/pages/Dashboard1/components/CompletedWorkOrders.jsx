import React, { useMemo } from "react";
import PropTypes from "prop-types";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";
import { formatNumberWithSeparators } from "../../../utils/numberLocale";
import useWidgetData from "./useWidgetData";
import { useDashboard } from "./dashboardContext";
import { navigateToTarget } from "./navigation";
import downloadCsv from "./downloadCsv";
import WidgetCard from "./WidgetCard";
import { useWidgetSize } from "./widgetSizeContext";
import { COLORS } from "./theme";

export default function CompletedWorkOrders({ onHide }) {
  const { t, i18n } = useTranslation();
  const { stretch } = useWidgetSize();
  const navigate = useNavigate();
  const { filters, baslangicTarihi } = useDashboard();
  const { data, loading, hasError, reload } = useWidgetData("GetDashboardV2CompletedWorkOrdersAndRequests");

  const rows = useMemo(() => data?.data || [], [data]);
  const yil = dayjs(baslangicTarihi).format("YYYY");

  const handleDownload = () =>
    downloadCsv(
      `tamamlanmis-is-talepleri-ve-is-emirleri-${yil}`,
      [t("ay"), t("isEmri"), t("isTalebi")],
      rows.map((row) => [row.AyAdi, row.IsEmriSayisi, row.IsTalebiSayisi])
    );

  const handleBarClick = (payload, seri) => {
    if (!payload) return;
    if (seri === "isEmri") navigateToTarget(navigate, payload.TargetPageIsEmri, payload.FilterParamsIsEmri, filters);
    else navigateToTarget(navigate, payload.TargetPageIsTalep, payload.FilterParamsIsTalep, filters);
  };

  return (
    <WidgetCard
      title={`${t("tamamlanmisIsTalepleriVeIsEmirleri")} (${yil})`}
      subtitle={t("tamamlanmaTarihineGoreHesaplanir")}
      loading={loading}
      hasError={hasError}
      onRefresh={reload}
      onDownload={rows.length ? handleDownload : undefined}
      onDetail={() => navigateToTarget(navigate, "is-emri", { isClose: 1 }, filters)}
      onHide={onHide}
    >
      <ResponsiveContainer width="100%" height={stretch ? "100%" : 286} minHeight={160}>
        <BarChart data={rows} margin={{ top: 8, right: 8, left: 0, bottom: 8 }}>
          <CartesianGrid stroke={COLORS.border} vertical={false} />
          <XAxis dataKey="AyAdi" tick={{ fill: COLORS.muted, fontSize: 11 }} angle={-35} textAnchor="end" height={54} interval={0} axisLine={{ stroke: COLORS.border }} tickLine={false} />
          <YAxis tick={{ fill: COLORS.muted, fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(value) => formatNumberWithSeparators(value, i18n.language)} />
          <Tooltip formatter={(value) => formatNumberWithSeparators(value, i18n.language)} />
          <Legend iconType="circle" iconSize={8} verticalAlign="top" align="right" height={26} wrapperStyle={{ fontSize: 12, color: COLORS.muted }} />
          <Bar dataKey="IsEmriSayisi" stackId="tamamlanan" name={t("isEmri")} fill={COLORS.blue} isAnimationActive={false} cursor="pointer" onClick={(payload) => handleBarClick(payload?.payload, "isEmri")} />
          <Bar
            dataKey="IsTalebiSayisi"
            stackId="tamamlanan"
            name={t("isTalebi")}
            fill={COLORS.teal}
            radius={[4, 4, 0, 0]}
            isAnimationActive={false}
            cursor="pointer"
            onClick={(payload) => handleBarClick(payload?.payload, "isTalebi")}
          />
        </BarChart>
      </ResponsiveContainer>
    </WidgetCard>
  );
}

CompletedWorkOrders.propTypes = {
  onHide: PropTypes.func,
};
