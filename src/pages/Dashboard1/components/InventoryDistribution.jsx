import React, { useMemo } from "react";
import PropTypes from "prop-types";
import { Button, Table } from "antd";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { LuArrowRight, LuChevronRight } from "react-icons/lu";
import { formatNumberWithSeparators } from "../../../utils/numberLocale";
import useWidgetData from "./useWidgetData";
import { useDashboard } from "./dashboardContext";
import { navigateToTarget } from "./navigation";
import downloadCsv from "./downloadCsv";
import { formatPercent } from "./formatters";
import useAutoTableScroll, { TABLE_FILL_INNER } from "./useAutoTableScroll";
import WidgetCard from "./WidgetCard";
import { COLORS } from "./theme";

// Durum dağılımı çubuğunun segmentleri; sıra, çubuktaki soldan sağa dizilimi belirler.
const DURUM_SEGMENTLERI = [
  { key: "AktifSayisi", labelKey: "aktif", color: COLORS.teal, textColor: COLORS.surface },
  { key: "ArizaliSayisi", labelKey: "arizali", color: COLORS.red, textColor: COLORS.surface },
  { key: "PasifSayisi", labelKey: "pasif", color: COLORS.neutral, textColor: COLORS.text },
];

// Segment daralsa da içindeki sayı okunabilir kalsın diye taban genişlik verilir.
const SEGMENT_MIN_GENISLIK = 34;
const CUBUK_YUKSEKLIGI = 34;

/** Bir satırın aktif/arızalı/pasif dağılımını tek bir yığılmış çubukta gösterir. */
function DurumCubugu({ row, language, t }) {
  const segmentler = DURUM_SEGMENTLERI.filter(({ key }) => Number(row[key]) > 0);

  if (segmentler.length === 0) {
    return <div style={{ height: CUBUK_YUKSEKLIGI, borderRadius: 8, background: COLORS.track }} />;
  }

  return (
    <div style={{ display: "flex", height: CUBUK_YUKSEKLIGI, borderRadius: 8, overflow: "hidden", background: COLORS.track }}>
      {segmentler.map(({ key, labelKey, color, textColor }) => (
        <div
          key={key}
          title={`${t(labelKey)}: ${formatNumberWithSeparators(row[key], language)}`}
          style={{
            flex: `${row[key]} 1 0`,
            minWidth: SEGMENT_MIN_GENISLIK,
            background: color,
            color: textColor,
            display: "grid",
            placeItems: "center",
            fontSize: 12,
            fontWeight: 600,
          }}
        >
          {formatNumberWithSeparators(row[key], language)}
        </div>
      ))}
    </div>
  );
}

DurumCubugu.propTypes = {
  row: PropTypes.object.isRequired,
  language: PropTypes.string,
  t: PropTypes.func.isRequired,
};

/** Çubuk renklerinin ne anlama geldiğini gösteren açıklama satırı. */
function DurumAciklamasi({ t }) {
  return (
    <div style={{ display: "flex", justifyContent: "flex-end", gap: 18, padding: "10px 16px 2px" }}>
      {DURUM_SEGMENTLERI.map(({ labelKey, color }) => (
        <span key={labelKey} style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 12.5, color: COLORS.muted }}>
          <span style={{ width: 10, height: 10, borderRadius: "50%", background: color }} />
          {t(labelKey)}
        </span>
      ))}
    </div>
  );
}

DurumAciklamasi.propTypes = {
  t: PropTypes.func.isRequired,
};

export default function InventoryDistribution({ onHide }) {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { containerRef, scrollY, wrapperStyle } = useAutoTableScroll(320);
  const { filters } = useDashboard();
  const { data, loading, hasError, reload } = useWidgetData("GetDashboardV2InventoryDistribution");

  const rows = useMemo(() => (data?.Data || []).map((row, index) => ({ ...row, clientKey: `makineTip-${row.MakineTipId}-${index}` })), [data]);
  const toplamEkipman = data?.ToplamEkipman;
  const listeHedefi = data?.TargetPageListe || "makine";

  const goToList = () => navigateToTarget(navigate, listeHedefi, {}, filters);

  const handleDownload = () =>
    downloadCsv(
      "makine-tipi-envanter-dagilimi",
      [t("makineTipi"), t("aktif"), t("arizali"), t("pasif"), t("adet"), t("pay")],
      rows.map((row) => [row.MakineTipi, row.AktifSayisi, row.ArizaliSayisi, row.PasifSayisi, row.ToplamAdet, formatPercent(row.Pay, i18n.language)])
    );

  const columns = [
    {
      title: t("makineTipi"),
      dataIndex: "MakineTipi",
      key: "makineTipi",
      width: "22%",
      render: (value) => <span style={{ fontWeight: 600, color: COLORS.text }}>{value}</span>,
    },
    {
      title: t("durumDagilimi"),
      key: "durumDagilimi",
      render: (value, record) => <DurumCubugu row={record} language={i18n.language} t={t} />,
    },
    {
      title: t("adet"),
      dataIndex: "ToplamAdet",
      key: "adet",
      align: "right",
      width: 92,
      render: (value) => <span style={{ fontWeight: 700, color: COLORS.text }}>{formatNumberWithSeparators(value, i18n.language)}</span>,
    },
    {
      title: t("pay"),
      dataIndex: "Pay",
      key: "pay",
      align: "right",
      width: 88,
      render: (value) => <span style={{ color: COLORS.muted }}>{formatPercent(value, i18n.language)}</span>,
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
      title={t("makineTiplerineGoreEnvanterDagilimi")}
      subtitle={t("aktifEnvanterinTipVeDurumDagilimi")}
      loading={loading}
      hasError={hasError}
      bodyPadding={0}
      onRefresh={reload}
      onDownload={rows.length ? handleDownload : undefined}
      onDetail={goToList}
      onHide={onHide}
      extra={
        toplamEkipman === undefined ? null : (
          <span style={{ border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: "5px 12px", fontSize: 13, color: COLORS.muted, whiteSpace: "nowrap" }}>
            {t("toplam")} <strong style={{ color: COLORS.text }}>{formatNumberWithSeparators(toplamEkipman, i18n.language)}</strong> {t("ekipman")}
          </span>
        )
      }
      footer={
        <div style={{ textAlign: "center" }}>
          <Button type="link" onClick={goToList} style={{ color: COLORS.teal, fontWeight: 600 }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
              {t("ekipmanListesineGit")}
              <LuArrowRight size={15} />
            </span>
          </Button>
        </div>
      }
    >
      <DurumAciklamasi t={t} />
      {/* Tablo kartta kalan alanı doldurur; kaydırma yüksekliği dış kutudan ölçülür. */}
      <div style={wrapperStyle}>
        <div ref={containerRef} style={TABLE_FILL_INNER}>
          <Table
            size="small"
            rowKey="clientKey"
            columns={columns}
            dataSource={rows}
            pagination={false}
            scroll={{ y: scrollY }}
            locale={{ emptyText: t("veriYok") }}
            onRow={(record) => ({ style: { cursor: "pointer" }, onClick: () => navigateToTarget(navigate, record.TargetPage, record.FilterParams, filters) })}
          />
        </div>
      </div>
    </WidgetCard>
  );
}

InventoryDistribution.propTypes = {
  onHide: PropTypes.func,
};
