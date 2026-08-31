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

export default function InventoryDistribution({ onHide }) {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { filters } = useDashboard();
  const { data, loading, hasError, reload } = useWidgetData("GetDashboardV2InventoryDistribution");

  const rows = useMemo(() => (data?.Data || []).map((row, index) => ({ ...row, clientKey: `makineTip-${row.MakineTipId}-${index}` })), [data]);
  const toplamEkipman = data?.ToplamEkipman;
  const listeHedefi = data?.TargetPageListe || "makine";

  const goToList = () => navigateToTarget(navigate, listeHedefi, {}, filters);

  const handleDownload = () =>
    downloadCsv(
      "makine-tipi-envanter-dagilimi",
      [t("makineTipi"), t("aktif"), t("arizali"), t("pasif"), t("toplamAdet"), t("pay")],
      rows.map((row) => [row.MakineTipi, row.AktifSayisi, row.ArizaliSayisi, row.PasifSayisi, row.ToplamAdet, formatPercent(row.Pay, i18n.language)])
    );

  const sayiKolonu = (title, dataIndex, color) => ({
    title,
    dataIndex,
    key: dataIndex,
    align: "right",
    render: (value) => <span style={{ color }}>{formatNumberWithSeparators(value, i18n.language)}</span>,
  });

  const columns = [
    {
      title: t("makineTipi"),
      dataIndex: "MakineTipi",
      key: "makineTipi",
      render: (value) => <span style={{ fontWeight: 600, color: COLORS.text }}>{value}</span>,
    },
    sayiKolonu(t("aktif"), "AktifSayisi", COLORS.green),
    sayiKolonu(t("arizali"), "ArizaliSayisi", COLORS.red),
    sayiKolonu(t("pasif"), "PasifSayisi", COLORS.muted),
    sayiKolonu(t("toplamAdet"), "ToplamAdet", COLORS.text),
    {
      title: t("pay"),
      dataIndex: "Pay",
      key: "pay",
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
      title={t("makineTiplerineGoreEnvanterDagilimi")}
      subtitle={toplamEkipman === undefined ? t("aktifArizaliPasifDagilimi") : `${t("toplamEkipman")}: ${formatNumberWithSeparators(toplamEkipman, i18n.language)}`}
      loading={loading}
      hasError={hasError}
      bodyPadding={0}
      onRefresh={reload}
      onDownload={rows.length ? handleDownload : undefined}
      onDetail={goToList}
      onHide={onHide}
      extra={
        <Button type="link" size="small" onClick={goToList}>
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
        scroll={{ y: 280 }}
        locale={{ emptyText: t("veriYok") }}
        onRow={(record) => ({ style: { cursor: "pointer" }, onClick: () => navigateToTarget(navigate, record.TargetPage, record.FilterParams, filters) })}
      />
    </WidgetCard>
  );
}

InventoryDistribution.propTypes = {
  onHide: PropTypes.func,
};
