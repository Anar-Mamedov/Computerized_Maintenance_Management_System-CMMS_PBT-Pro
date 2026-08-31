import React, { useMemo } from "react";
import PropTypes from "prop-types";
import { Button, Table } from "antd";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { LuChevronRight } from "react-icons/lu";
import { formatNumberWithSeparators } from "../../../utils/numberLocale";
import useWidgetData from "./useWidgetData";
import { useDashboard } from "./dashboardContext";
import { navigateToTarget } from "./navigation";
import downloadCsv from "./downloadCsv";
import WidgetCard from "./WidgetCard";
import { COLORS } from "./theme";

// Sayaç kartlarının renk ve arka plan eşlemesi.
const COUNTER_DEFINITIONS = [
  { key: "Bugun", labelKey: "bugun", color: COLORS.blue, background: "#F2F6FF", durum: "bugun" },
  { key: "BuHafta", labelKey: "buHafta", color: COLORS.green, background: COLORS.greenSoft, durum: "buHafta" },
  { key: "BuAy", labelKey: "buAy", color: COLORS.blue, background: "#F6F4FF", durum: "buAy" },
];

export default function UpcomingMaintenances({ onHide }) {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { filters } = useDashboard();
  const { data, loading, hasError, reload } = useWidgetData("GetDashboardV2UpcomingMaintenances");

  const rows = useMemo(() => (data?.Data || []).map((row, index) => ({ ...row, clientKey: `bakim-${row.PbakimMakineId}-${index}` })), [data]);
  const sayaclar = data?.Sayaclar || {};
  const takvimHedefi = data?.TargetPageTakvim || "bakim-takvimi";

  const handleDownload = () =>
    downloadCsv(
      "yaklasan-bakimlar",
      [t("tarih"), t("ekipman"), t("bakimKodu"), t("bakim"), t("kalan")],
      rows.map((row) => [row.HedefTarihFormatli, row.EkipmanEtiketi, row.BakimKodu, row.BakimTanimi, row.KalanGunFormatli])
    );

  const columns = [
    { title: t("tarih"), dataIndex: "HedefTarihFormatli", key: "hedefTarih", width: 104 },
    {
      title: t("ekipmanBakim"),
      dataIndex: "EkipmanEtiketi",
      key: "ekipmanBakim",
      render: (value, record) => (
        <div>
          <div style={{ fontSize: 13, fontWeight: 500, color: COLORS.text }}>{value}</div>
          <div style={{ fontSize: 12, color: COLORS.muted }}>
            {record.BakimKodu ? <span style={{ marginRight: 6 }}>{record.BakimKodu}</span> : null}
            {record.BakimTanimi}
          </div>
        </div>
      ),
    },
    {
      title: t("kalan"),
      dataIndex: "KalanGunFormatli",
      key: "kalanGun",
      align: "center",
      width: 130,
      render: (value) => <span style={{ display: "inline-block", padding: "3px 10px", borderRadius: 7, fontSize: 12.5, fontWeight: 500, color: COLORS.blue, background: COLORS.blueTint }}>{value}</span>,
    },
    {
      title: "",
      key: "ok",
      align: "right",
      width: 36,
      render: () => <LuChevronRight size={16} color={COLORS.muted} />,
    },
  ];

  return (
    <WidgetCard
      title={t("yaklasanBakimlar")}
      subtitle={t("planlananBakimVeKontroller")}
      loading={loading}
      hasError={hasError}
      bodyPadding={12}
      onRefresh={reload}
      onDownload={rows.length ? handleDownload : undefined}
      onDetail={() => navigateToTarget(navigate, takvimHedefi, {}, filters)}
      onHide={onHide}
      footer={
        <Button type="link" size="small" style={{ paddingLeft: 0 }} onClick={() => navigateToTarget(navigate, takvimHedefi, {}, filters)}>
          {t("bakimTakviminiGor")}
        </Button>
      }
    >
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 12 }}>
        {COUNTER_DEFINITIONS.map(({ key, labelKey, color, background, durum }) => (
          <button
            key={key}
            type="button"
            className="pbt-row"
            onClick={() => navigateToTarget(navigate, "periyodik-bakim", { durum }, filters)}
            style={{ border: `1px solid ${COLORS.border}`, borderLeft: `3px solid ${color}`, borderRadius: 10, background, padding: "10px 12px", cursor: "pointer", textAlign: "left" }}
          >
            <div style={{ fontSize: 22, fontWeight: 700, color, lineHeight: 1.2 }}>{formatNumberWithSeparators(sayaclar[key] ?? 0, i18n.language)}</div>
            <div style={{ fontSize: 12, color: COLORS.muted }}>{t(labelKey)}</div>
          </button>
        ))}
      </div>
      <Table
        size="small"
        rowKey="clientKey"
        columns={columns}
        dataSource={rows}
        pagination={false}
        scroll={{ y: 220 }}
        locale={{ emptyText: t("veriYok") }}
        onRow={(record) => ({ style: { cursor: "pointer" }, onClick: () => navigateToTarget(navigate, record.TargetPage, record.FilterParams, filters) })}
      />
    </WidgetCard>
  );
}

UpcomingMaintenances.propTypes = {
  onHide: PropTypes.func,
};
