import React, { useMemo, useState } from "react";
import PropTypes from "prop-types";
import { Segmented } from "antd";
import { CartesianGrid, Legend, Line, LineChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";
import useWidgetData from "./useWidgetData";
import { useDashboard } from "./dashboardContext";
import { navigateToTarget } from "./navigation";
import downloadCsv from "./downloadCsv";
import { formatAxisNumber } from "./formatters";
import WidgetCard from "./WidgetCard";
import { COLORS } from "./theme";

const DATE_DISPLAY_FORMAT = "DD.MM.YYYY";

export default function WorkOrderTimeDistribution({ onHide }) {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { filters, baslangicTarihi, bitisTarihi } = useDashboard();
  const [gorunum, setGorunum] = useState("HAFTALIK");

  const extraBody = useMemo(() => ({ Gorunum: gorunum }), [gorunum]);
  const { data, loading, hasError, reload } = useWidgetData("GetDashboardV2WorkOrderTimeDistribution", extraBody);

  const rows = useMemo(() => data?.Data || [], [data]);
  const donemOrtalamasi = data?.DonemOrtalamasi;

  const gorunumSecenekleri = [
    { value: "GUNLUK", label: t("gunluk") },
    { value: "HAFTALIK", label: t("haftalik") },
    { value: "AYLIK", label: t("aylik") },
  ];

  const handleDownload = () =>
    downloadCsv(
      "acilan-is-emirlerinin-zaman-dagilimi",
      [t("periyot"), t("isEmriSayisi")],
      rows.map((row) => [row.PeriyotEtiketi, row.IsEmriSayisi])
    );

  const baslik = `${t("acilanIsEmirlerininZamanDagilimi")} (${dayjs(baslangicTarihi).format(DATE_DISPLAY_FORMAT)} / ${dayjs(bitisTarihi).format(DATE_DISPLAY_FORMAT)})`;

  return (
    <WidgetCard
      title={baslik}
      subtitle={t("zamanDagilimiAciklama")}
      loading={loading}
      hasError={hasError}
      onRefresh={reload}
      onDownload={rows.length ? handleDownload : undefined}
      onDetail={() => navigateToTarget(navigate, "is-emri", {}, filters)}
      onHide={onHide}
      extra={<Segmented size="small" value={gorunum} onChange={setGorunum} options={gorunumSecenekleri} />}
    >
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={rows} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
          <CartesianGrid stroke={COLORS.border} vertical={false} />
          <XAxis
            dataKey="PeriyotEtiketi"
            tick={{ fill: COLORS.muted, fontSize: 11 }}
            angle={-35}
            textAnchor="end"
            height={56}
            interval="preserveStartEnd"
            axisLine={{ stroke: COLORS.border }}
            tickLine={false}
          />
          <YAxis tick={{ fill: COLORS.muted, fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(value) => formatAxisNumber(value, i18n.language)} />
          <Tooltip formatter={(value) => formatAxisNumber(value, i18n.language)} />
          <Legend iconType="circle" iconSize={8} verticalAlign="top" align="right" height={26} wrapperStyle={{ fontSize: 12, color: COLORS.muted }} />
          {donemOrtalamasi ? (
            <ReferenceLine
              y={donemOrtalamasi}
              stroke={COLORS.averageLine}
              strokeWidth={2}
              strokeDasharray="6 4"
              label={{ value: data?.DonemOrtalamasiFormatli, position: "right", fill: COLORS.muted, fontSize: 11 }}
            />
          ) : null}
          <Line
            type="monotone"
            dataKey="IsEmriSayisi"
            name={t("isEmriSayisi")}
            stroke={COLORS.blue}
            strokeWidth={2}
            isAnimationActive={false}
            dot={{ r: 3, fill: COLORS.blue }}
            activeDot={{ r: 5, cursor: "pointer" }}
            onClick={(payload) => payload?.payload && navigateToTarget(navigate, payload.payload.TargetPage, payload.payload.FilterParams, filters)}
          />
          {/* Ortalama çizgisi ReferenceLine ile çizilir; bu veri taşımayan seri yalnızca göstergede yer alması içindir. */}
          <Line type="monotone" dataKey="__ortalama" name={t("donemOrtalamasi")} stroke={COLORS.averageLine} strokeWidth={2} strokeDasharray="6 4" dot={false} legendType="plainline" />
        </LineChart>
      </ResponsiveContainer>
    </WidgetCard>
  );
}

WorkOrderTimeDistribution.propTypes = {
  onHide: PropTypes.func,
};
