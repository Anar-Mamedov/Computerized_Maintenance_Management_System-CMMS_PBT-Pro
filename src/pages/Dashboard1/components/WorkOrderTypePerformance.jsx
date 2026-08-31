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
import { formatCurrency, formatPercent } from "./formatters";
import WidgetCard from "./WidgetCard";
import { COLORS } from "./theme";

// Tablo altındaki genel toplam satırı. Render sırasında bileşen tanımlamamak için modül seviyesindedir.
const renderGenelToplamSatiri = ({ genelToplam, language, paraBirimi, t }) => {
  if (!genelToplam) return null;

  return (
    <Table.Summary fixed>
      <Table.Summary.Row style={{ background: COLORS.zebra, fontWeight: 600 }}>
        <Table.Summary.Cell index={0}>{t("toplam")}</Table.Summary.Cell>
        <Table.Summary.Cell index={1} align="right">
          {formatNumberWithSeparators(genelToplam.Toplam, language)}
        </Table.Summary.Cell>
        <Table.Summary.Cell index={2} align="right">
          {formatNumberWithSeparators(genelToplam.Acik, language)}
        </Table.Summary.Cell>
        <Table.Summary.Cell index={3} align="right">
          {genelToplam.OrtalamaSureFormatli}
        </Table.Summary.Cell>
        <Table.Summary.Cell index={4} align="right">
          {formatCurrency(genelToplam.ToplamMaliyet, language, paraBirimi)}
        </Table.Summary.Cell>
        <Table.Summary.Cell index={5}>{formatPercent(genelToplam.IsYukuPayi, language)}</Table.Summary.Cell>
      </Table.Summary.Row>
    </Table.Summary>
  );
};

export default function WorkOrderTypePerformance({ onHide }) {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { filters } = useDashboard();
  const { data, loading, hasError, reload } = useWidgetData("GetDashboardV2WorkOrderTypePerformance");
  const paraBirimi = t("paraBirimi");

  const rows = useMemo(() => (data?.data || []).map((row, index) => ({ ...row, clientKey: `tip-${row.IsEmriTipId}-${index}` })), [data]);
  const genelToplam = data?.genel_toplam;

  const goToDetail = () => navigateToTarget(navigate, "is-emri", {}, filters);

  const handleDownload = () =>
    downloadCsv(
      "is-emri-tipleri-performans-analizi",
      [t("isEmriTipi"), t("toplam"), t("acik"), t("ortalamaSure"), t("toplamMaliyet"), t("isYukuPayi")],
      rows.map((row) => [row.IsEmriTipi, row.Toplam, row.Acik, row.OrtalamaSureFormatli, formatCurrency(row.ToplamMaliyet, i18n.language, paraBirimi), formatPercent(row.IsYukuPayi, i18n.language)])
    );

  const columns = [
    {
      title: t("isEmriTipi"),
      dataIndex: "IsEmriTipi",
      key: "isEmriTipi",
      render: (value) => <span style={{ fontWeight: 600, color: COLORS.text }}>{value}</span>,
    },
    {
      title: t("toplam"),
      dataIndex: "Toplam",
      key: "toplam",
      align: "right",
      render: (value) => formatNumberWithSeparators(value, i18n.language),
    },
    {
      title: t("acik"),
      dataIndex: "Acik",
      key: "acik",
      align: "right",
      render: (value, record) => (
        <span
          style={{ color: COLORS.red, cursor: "pointer" }}
          onClick={(event) => {
            event.stopPropagation();
            navigateToTarget(navigate, record.TargetPage, record.FilterParamsAcik, filters);
          }}
        >
          {formatNumberWithSeparators(value, i18n.language)}
        </span>
      ),
    },
    { title: t("ortalamaSure"), dataIndex: "OrtalamaSureFormatli", key: "ortalamaSure", align: "right" },
    {
      title: t("toplamMaliyet"),
      dataIndex: "ToplamMaliyet",
      key: "toplamMaliyet",
      align: "right",
      render: (value) => formatCurrency(value, i18n.language, paraBirimi),
    },
    {
      title: t("isYukuPayi"),
      dataIndex: "IsYukuPayi",
      key: "isYukuPayi",
      render: (value) => (
        <div>
          <div style={{ fontSize: 12, color: COLORS.text, marginBottom: 3 }}>{formatPercent(value, i18n.language)}</div>
          <div style={{ height: 4, borderRadius: 4, background: COLORS.track }}>
            <div style={{ width: `${Math.min(Number(value) || 0, 100)}%`, height: 4, borderRadius: 4, background: COLORS.blue }} />
          </div>
        </div>
      ),
    },
  ];

  return (
    <WidgetCard
      title={t("isEmriTipleriPerformansAnalizi")}
      subtitle={t("adetSureMaliyetVeIsYukuPayi")}
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
        onRow={(record) => ({ style: { cursor: "pointer" }, onClick: () => navigateToTarget(navigate, record.TargetPage, record.FilterParams, filters) })}
        summary={() => renderGenelToplamSatiri({ genelToplam, language: i18n.language, paraBirimi, t })}
      />
    </WidgetCard>
  );
}

WorkOrderTypePerformance.propTypes = {
  onHide: PropTypes.func,
};
