import React, { useMemo } from "react";
import PropTypes from "prop-types";
import { Bar, BarChart, CartesianGrid, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";
import useWidgetData from "./useWidgetData";
import { useDashboard } from "./dashboardContext";
import { navigateToTarget } from "./navigation";
import downloadCsv from "./downloadCsv";
import { formatCompactCurrency, formatCurrency } from "./formatters";
import WidgetCard from "./WidgetCard";
import { useWidgetSize } from "./widgetSizeContext";
import { COLORS } from "./theme";

export default function MonthlyMaintenanceCosts({ onHide }) {
  const { t, i18n } = useTranslation();
  const { stretch } = useWidgetSize();
  const navigate = useNavigate();
  const { filters, baslangicTarihi } = useDashboard();
  const { data, loading, hasError, reload } = useWidgetData("GetDashboardV2MonthlyMaintenanceCosts");
  const paraBirimi = t("paraBirimi");

  const rows = useMemo(() => data?.data || [], [data]);
  const yil = dayjs(baslangicTarihi).format("YYYY");
  const kisaPara = (value) => formatCompactCurrency(value, i18n.language, paraBirimi, t);

  const handleDownload = () =>
    downloadCsv(
      `aylik-bakim-maliyetleri-${yil}`,
      [t("ay"), t("toplamMaliyet")],
      rows.map((row) => [row.AyAdi, formatCurrency(row.ToplamMaliyet, i18n.language, paraBirimi)])
    );

  return (
    <WidgetCard
      title={`${t("aylikBakimMaliyetleri")} (${yil})`}
      subtitle={t("tutarlarParaBirimiCinsindendir", { paraBirimi })}
      loading={loading}
      hasError={hasError}
      onRefresh={reload}
      onDownload={rows.length ? handleDownload : undefined}
      onDetail={() => navigateToTarget(navigate, "is-emri", {}, filters)}
      onHide={onHide}
    >
      <ResponsiveContainer width="100%" height={stretch ? "100%" : 286} minHeight={160}>
        <BarChart data={rows} margin={{ top: 24, right: 8, left: 8, bottom: 8 }}>
          <CartesianGrid stroke={COLORS.border} vertical={false} />
          <XAxis dataKey="AyAdi" tick={{ fill: COLORS.muted, fontSize: 11 }} angle={-35} textAnchor="end" height={54} interval={0} axisLine={{ stroke: COLORS.border }} tickLine={false} />
          <YAxis tick={{ fill: COLORS.muted, fontSize: 11 }} axisLine={false} tickLine={false} width={82} tickFormatter={kisaPara} />
          <Tooltip formatter={(value) => formatCurrency(value, i18n.language, paraBirimi)} />
          <Bar
            dataKey="ToplamMaliyet"
            name={t("toplamMaliyet")}
            fill={COLORS.blue}
            radius={[4, 4, 0, 0]}
            isAnimationActive={false}
            cursor="pointer"
            onClick={(payload) => payload?.payload && navigateToTarget(navigate, payload.payload.TargetPage, payload.payload.FilterParams, filters)}
          >
            <LabelList dataKey="ToplamMaliyet" position="top" formatter={kisaPara} fill={COLORS.muted} fontSize={10.5} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </WidgetCard>
  );
}

MonthlyMaintenanceCosts.propTypes = {
  onHide: PropTypes.func,
};
