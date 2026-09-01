import React, { useMemo, useState } from "react";
import PropTypes from "prop-types";
import { Button, Segmented, Table, Tag } from "antd";
import { useFormContext } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";
import { LuChevronRight } from "react-icons/lu";
import useWidgetData from "./useWidgetData";
import { useDashboard, toApiEnd, toApiStart } from "./dashboardContext";
import { navigateToTarget } from "./navigation";
import downloadCsv from "./downloadCsv";
import WidgetDateRange from "./WidgetDateRange";
import useAutoTableScroll, { TABLE_FILL_INNER } from "./useAutoTableScroll";
import WidgetCard from "./WidgetCard";
import { COLORS } from "./theme";

const START_FIELD = "tekrarlayanArizaBaslangicTarihi";
const END_FIELD = "tekrarlayanArizaBitisTarihi";

export default function RecurringFailures({ onHide }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { containerRef, scrollY, wrapperStyle } = useAutoTableScroll(272);
  const { filters } = useDashboard();
  const { watch } = useFormContext();
  const [donem, setDonem] = useState("90GUN");

  const ozelBaslangic = watch(START_FIELD);
  const ozelBitis = watch(END_FIELD);

  const extraBody = useMemo(() => {
    if (donem !== "OZEL") return { Donem: donem };
    return { Donem: donem, BaslangicTarihi: toApiStart(ozelBaslangic), BitisTarihi: toApiEnd(ozelBitis) };
  }, [donem, ozelBaslangic, ozelBitis]);

  const { data, loading, hasError, reload } = useWidgetData("GetDashboardV2RecurringFailures", extraBody);

  const rows = useMemo(() => (data?.data || []).map((row, index) => ({ ...row, clientKey: `tekrar-${row.EkipmanId}-${row.NedenKodId}-${index}` })), [data]);

  const donemSecenekleri = [
    { value: "30GUN", label: t("son30Gun") },
    { value: "60GUN", label: t("son60Gun") },
    { value: "90GUN", label: t("son90Gun") },
    { value: "BUYIL", label: t("buYil") },
    { value: "OZEL", label: t("ozelTarih") },
  ];

  const goToDetail = () => navigateToTarget(navigate, "is-emri", { tipGrup: 1 }, filters);

  const handleDownload = () =>
    downloadCsv(
      "tekrarlayan-arizalar",
      [t("ekipman"), t("arizaNedeni"), t("sonTekrar"), t("toplamDurus"), t("tekrarSayisi")],
      rows.map((row) => [row.EkipmanEtiketi, row.ArizaNedeni, row.SonTekrarTarihiFormatli, row.ToplamDurusSuresiFormatli, row.TekrarSayisiFormatli])
    );

  const columns = [
    {
      title: t("ekipman"),
      dataIndex: "EkipmanEtiketi",
      key: "ekipman",
      render: (value, record) => (
        <span>
          <span style={{ color: COLORS.text, fontWeight: 600 }}>{record.EkipmanTanimi}</span>
          <span style={{ color: COLORS.muted }}> · {record.EkipmanKodu}</span>
        </span>
      ),
    },
    { title: t("arizaNedeni"), dataIndex: "ArizaNedeni", key: "arizaNedeni" },
    {
      title: t("sonTekrar"),
      dataIndex: "SonTekrarTarihiFormatli",
      key: "sonTekrar",
      render: (value, record) => value || (record.SonTekrarTarihi ? dayjs(record.SonTekrarTarihi).format("DD.MM.YYYY") : ""),
    },
    { title: t("toplamDurus"), dataIndex: "ToplamDurusSuresiFormatli", key: "toplamDurus", align: "right" },
    {
      title: t("tekrarSayisi"),
      dataIndex: "TekrarSayisiFormatli",
      key: "tekrarSayisi",
      align: "right",
      render: (value) => (
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
          <Tag color="red" style={{ borderRadius: 999, marginInlineEnd: 0 }}>
            {value}
          </Tag>
          <LuChevronRight size={14} color={COLORS.muted} />
        </span>
      ),
    },
  ];

  return (
    <WidgetCard
      title={t("tekrarlayanArizalar")}
      subtitle={t("tekrarlayanArizalarAciklama")}
      loading={loading}
      hasError={hasError}
      bodyPadding={donem === "OZEL" ? "12px 0 0" : 0}
      onRefresh={reload}
      onDownload={rows.length ? handleDownload : undefined}
      onDetail={goToDetail}
      onHide={onHide}
      extra={<Segmented size="small" value={donem} onChange={setDonem} options={donemSecenekleri} />}
      footer={
        <Button type="link" size="small" style={{ paddingLeft: 0 }} onClick={goToDetail}>
          {t("tumunuGor")}
        </Button>
      }
    >
      {donem === "OZEL" ? (
        <div style={{ padding: "0 16px 12px" }}>
          <WidgetDateRange startFieldName={START_FIELD} endFieldName={END_FIELD} />
        </div>
      ) : null}
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
            onRow={(record) => ({
              style: { cursor: "pointer" },
              onClick: () => navigateToTarget(navigate, "is-emri", { makineId: record.EkipmanId, nedenId: record.NedenKodId, tipGrup: 1 }, filters),
            })}
          />
        </div>
      </div>
    </WidgetCard>
  );
}

RecurringFailures.propTypes = {
  onHide: PropTypes.func,
};
