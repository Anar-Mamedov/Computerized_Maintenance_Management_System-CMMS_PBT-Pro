import React, { useMemo } from "react";
import PropTypes from "prop-types";
import { Empty } from "antd";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { LuChevronRight } from "react-icons/lu";
import { formatNumberWithSeparators } from "../../../utils/numberLocale";
import useWidgetData from "./useWidgetData";
import { useDashboard } from "./dashboardContext";
import { navigateToTarget } from "./navigation";
import downloadCsv from "./downloadCsv";
import { formatPercent } from "./formatters";
import WidgetCard from "./WidgetCard";
import { COLORS } from "./theme";

export default function TopFailureEquipment({ onHide }) {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { filters } = useDashboard();
  const { data, loading, hasError, reload } = useWidgetData("GetDashboardV2TopFailureEquipment");

  // Rehber madde 16: ariza sayisi/satir -> o ekipmanin ariza is emirleri.
  const arizaListesineGit = (row) =>
    navigateToTarget(navigate, row.TargetPage || "is-emri", { prosedurtipleri: [1], makineler: [row.EkipmanId], ...row.FilterParams }, filters);

  // Rehber madde 17: ekipman adi -> makine sayfasinda o kaydi acar.
  const makineSayfasinaGit = (row) =>
    navigateToTarget(navigate, row.TargetPageMakine || "makine", row.FilterParamsMakine || { makineler: [row.EkipmanId] }, filters);

  const rows = useMemo(() => data?.data || [], [data]);
  const enBuyukArizaSayisi = useMemo(() => rows.reduce((max, row) => Math.max(max, Number(row.ArizaSayisi) || 0), 0), [rows]);

  const handleDownload = () =>
    downloadCsv(
      "en-cok-ariza-veren-ekipmanlar",
      [t("sira"), t("ekipman"), t("arizaSayisi"), t("pay")],
      rows.map((row) => [row.Sira, row.EkipmanEtiketi, row.ArizaSayisi, formatPercent(row.YuzdePayi, i18n.language)])
    );

  return (
    <WidgetCard
      title={t("enCokArizaVerenEkipmanlar")}
      subtitle={t("secilenTarihAraligindakiIlk10Ekipman")}
      loading={loading}
      hasError={hasError}
      bodyPadding={8}
      onRefresh={reload}
      onDownload={rows.length ? handleDownload : undefined}
      onDetail={() => navigateToTarget(navigate, "is-emri", { tipGrup: 1 }, filters)}
      onHide={onHide}
    >
      {!loading && rows.length === 0 ? (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={t("veriYok")} />
      ) : (
        <div>
          {rows.map((row) => (
            <div
              key={`ekipman-${row.EkipmanId}-${row.Sira}`}
              className="pbt-row"
              role="button"
              tabIndex={0}
              onClick={() => arizaListesineGit(row)}
              onKeyDown={(event) => {
                if (event.key !== "Enter" && event.key !== " ") return;
                event.preventDefault();
                arizaListesineGit(row);
              }}
              style={{
                width: "100%",
                display: "grid",
                gridTemplateColumns: "24px minmax(0, 1fr) 56px 62px 92px 16px",
                alignItems: "center",
                gap: 10,
                padding: 8,
                border: "none",
                background: "transparent",
                cursor: "pointer",
                textAlign: "left",
                borderRadius: 8,
              }}
            >
              <span style={{ fontSize: 12, color: COLORS.muted, fontWeight: 600 }}>{row.Sira}</span>
              {/* Rehber madde 17: ekipman adi makine sayfasini acar (madde 16 ariza listesi satirin genelinde). */}
              <span
                role="button"
                tabIndex={0}
                onClick={(event) => {
                  event.stopPropagation();
                  makineSayfasinaGit(row);
                }}
                onKeyDown={(event) => {
                  if (event.key !== "Enter" && event.key !== " ") return;
                  event.preventDefault();
                  event.stopPropagation();
                  makineSayfasinaGit(row);
                }}
                style={{ fontSize: 13, color: COLORS.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", cursor: "pointer", textDecoration: "underline dotted" }}
                title={row.EkipmanEtiketi}
              >
                {row.EkipmanEtiketi}
              </span>
              <span style={{ fontSize: 13, fontWeight: 600, color: COLORS.text, textAlign: "right" }}>{formatNumberWithSeparators(row.ArizaSayisi, i18n.language)}</span>
              <span style={{ fontSize: 12, color: COLORS.muted, textAlign: "right" }}>{formatPercent(row.YuzdePayi, i18n.language)}</span>
              <span style={{ height: 6, background: COLORS.track, borderRadius: 4 }}>
                <span style={{ display: "block", width: `${enBuyukArizaSayisi ? (Number(row.ArizaSayisi) / enBuyukArizaSayisi) * 100 : 0}%`, height: 6, borderRadius: 4, background: COLORS.red }} />
              </span>
              <LuChevronRight size={14} color={COLORS.muted} />
            </div>
          ))}
        </div>
      )}
    </WidgetCard>
  );
}

TopFailureEquipment.propTypes = {
  onHide: PropTypes.func,
};
