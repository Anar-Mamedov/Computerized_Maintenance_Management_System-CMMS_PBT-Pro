import React, { useMemo } from "react";
import PropTypes from "prop-types";
import { Button, Table } from "antd";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { formatNumberWithSeparators } from "../../../utils/numberLocale";
import useWidgetData from "./useWidgetData";
import { useDashboard } from "./dashboardContext";
import { navigateToTarget } from "./navigation";
import downloadCsv from "./downloadCsv";
import { formatPercent } from "./formatters";
import WidgetCard from "./WidgetCard";
import { COLORS } from "./theme";

export default function FailurePareto({ onHide }) {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { filters } = useDashboard();
  const { data, loading, hasError, reload } = useWidgetData("GetDashboardV2FailureParetoAnalysis");

  const rows = useMemo(() => (data?.data || []).map((row, index) => ({ ...row, clientKey: `neden-${row.NedenKodId}-${index}` })), [data]);
  const enBuyukAdet = useMemo(() => rows.reduce((max, row) => Math.max(max, Number(row.Adet) || 0), 0), [rows]);

  const goToDetail = () => navigateToTarget(navigate, "is-emri", { tipGrup: 1 }, filters);

  const handleDownload = () =>
    downloadCsv(
      "ariza-nedenleri-pareto-analizi",
      [t("arizaNedeni"), t("adet"), t("yuzde"), t("kumulatifYuzde")],
      rows.map((row) => [row.ArizaNedeni, row.Adet, formatPercent(row.Yuzde, i18n.language), formatPercent(row.KumulatifYuzde, i18n.language)])
    );

  const columns = [
    {
      title: t("arizaNedeni"),
      dataIndex: "ArizaNedeni",
      key: "arizaNedeni",
      render: (value) => <span style={{ color: COLORS.text, fontWeight: 500 }}>{value}</span>,
    },
    {
      title: t("adet"),
      dataIndex: "Adet",
      key: "adet",
      align: "right",
      render: (value) => formatNumberWithSeparators(value, i18n.language),
    },
    {
      title: t("yuzde"),
      dataIndex: "Yuzde",
      key: "yuzde",
      align: "right",
      render: (value) => formatPercent(value, i18n.language),
    },
    {
      title: t("dagilim"),
      dataIndex: "Adet",
      key: "dagilim",
      render: (value) => (
        <div style={{ height: 8, background: COLORS.track, borderRadius: 4 }}>
          <div style={{ width: `${enBuyukAdet ? (Number(value) / enBuyukAdet) * 100 : 0}%`, height: 8, borderRadius: 4, background: COLORS.red }} />
        </div>
      ),
    },
    {
      title: t("kumulatifYuzde"),
      dataIndex: "KumulatifYuzde",
      key: "kumulatifYuzde",
      align: "right",
      render: (value) => (
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: COLORS.amber, display: "inline-block" }} />
          <span style={{ color: COLORS.text, fontWeight: 600 }}>{formatPercent(value, i18n.language)}</span>
        </span>
      ),
    },
  ];

  return (
    <WidgetCard
      title={t("arizaNedenleriParetoAnalizi")}
      subtitle={t("arizaSayisinaGoreAzalanSiralama")}
      loading={loading}
      hasError={hasError}
      bodyPadding={0}
      onRefresh={reload}
      onDownload={rows.length ? handleDownload : undefined}
      onDetail={goToDetail}
      onHide={onHide}
      extra={
        <Button type="link" size="small" onClick={goToDetail}>
          {t("tumunuGor")}
        </Button>
      }
    >
      <Table
        size="small"
        rowKey="clientKey"
        columns={columns}
        dataSource={rows}
        pagination={false}
        locale={{ emptyText: t("veriYok") }}
        onRow={(record) => ({ style: { cursor: "pointer" }, onClick: () => navigateToTarget(navigate, record.TargetPage, record.FilterParams, filters) })}
      />
    </WidgetCard>
  );
}

FailurePareto.propTypes = {
  onHide: PropTypes.func,
};
