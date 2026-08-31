import React, { useMemo, useState } from "react";
import PropTypes from "prop-types";
import { Button, Input, Segmented, Space, Table } from "antd";
import { useFormContext } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { LuDownload, LuSearch } from "react-icons/lu";
import { formatNumberWithSeparators } from "../../../utils/numberLocale";
import useDebounce from "../../../hooks/useDebounce";
import useWidgetData from "./useWidgetData";
import { useDashboard, toApiEnd, toApiStart } from "./dashboardContext";
import { navigateToTarget } from "./navigation";
import downloadCsv from "./downloadCsv";
import WidgetDateRange from "./WidgetDateRange";
import WidgetCard from "./WidgetCard";
import { COLORS } from "./theme";

const START_FIELD = "personelKpiBaslangicTarihi";
const END_FIELD = "personelKpiBitisTarihi";

export default function PersonnelKpi({ onHide }) {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { filters } = useDashboard();
  const { watch } = useFormContext();
  const [donem, setDonem] = useState("BUAY");
  const [aramaMetni, setAramaMetni] = useState("");
  const debouncedAramaMetni = useDebounce(aramaMetni, 400);

  const ozelBaslangic = watch(START_FIELD);
  const ozelBitis = watch(END_FIELD);

  const extraBody = useMemo(() => {
    const body = { Donem: donem, AramaMetni: debouncedAramaMetni };
    if (donem !== "OZEL") return body;
    return { ...body, BaslangicTarihi: toApiStart(ozelBaslangic), BitisTarihi: toApiEnd(ozelBitis) };
  }, [donem, debouncedAramaMetni, ozelBaslangic, ozelBitis]);

  const { data, loading, hasError, reload } = useWidgetData("GetDashboardV2PersonnelKpi", extraBody);

  const rows = useMemo(() => (data?.data || []).map((row, index) => ({ ...row, clientKey: `personel-${row.PersonelId}-${index}` })), [data]);

  const donemSecenekleri = [
    { value: "BUHAFTA", label: t("buHafta") },
    { value: "BUAY", label: t("buAy") },
    { value: "GECENAY", label: t("gecenAy") },
    { value: "SON3AY", label: t("son3Ay") },
    { value: "BUYIL", label: t("buYil") },
    { value: "OZEL", label: t("ozelTarih") },
  ];

  const handleDownload = () =>
    downloadCsv(
      "personel-kpi",
      [t("personel"), t("unvan"), t("tamamlananIsEmri"), t("acikIsEmri"), t("toplamCalismaSuresi"), t("ortalamaTamamlamaSuresi")],
      rows.map((row) => [row.Personel, row.Unvan, row.TamamlananIsEmri, row.AcikIsEmri, row.ToplamCalismaSuresiFormatli, row.OrtalamaTamamlamaSuresiFormatli])
    );

  const columns = [
    {
      title: t("personel"),
      dataIndex: "Personel",
      key: "personel",
      sorter: (a, b) => String(a.Personel || "").localeCompare(String(b.Personel || "")),
      render: (value) => <span style={{ fontWeight: 600, color: COLORS.blue }}>{value}</span>,
    },
    { title: t("unvan"), dataIndex: "Unvan", key: "unvan" },
    {
      title: t("tamamlananIsEmri"),
      dataIndex: "TamamlananIsEmri",
      key: "tamamlananIsEmri",
      align: "right",
      sorter: (a, b) => a.TamamlananIsEmri - b.TamamlananIsEmri,
      render: (value, record) => (
        <span
          style={{ cursor: "pointer" }}
          onClick={(event) => {
            event.stopPropagation();
            navigateToTarget(navigate, record.TargetPage, record.FilterParamsKapali, filters);
          }}
        >
          {formatNumberWithSeparators(value, i18n.language)}
        </span>
      ),
    },
    {
      title: t("acikIsEmri"),
      dataIndex: "AcikIsEmri",
      key: "acikIsEmri",
      align: "right",
      sorter: (a, b) => a.AcikIsEmri - b.AcikIsEmri,
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
    {
      title: t("toplamCalismaSuresi"),
      dataIndex: "ToplamCalismaSuresiFormatli",
      key: "toplamCalismaSuresi",
      align: "right",
      sorter: (a, b) => a.ToplamCalismaSuresiDakika - b.ToplamCalismaSuresiDakika,
    },
    {
      title: t("ortalamaTamamlamaSuresi"),
      dataIndex: "OrtalamaTamamlamaSuresiFormatli",
      key: "ortalamaTamamlamaSuresi",
      align: "right",
      sorter: (a, b) => a.OrtalamaTamamlamaSuresiDakika - b.OrtalamaTamamlamaSuresiDakika,
    },
  ];

  return (
    <WidgetCard
      title={t("personelKpi")}
      subtitle={t("secilenDonemdekiPersonelIsYukuVePerformansi")}
      loading={loading}
      hasError={hasError}
      bodyPadding={0}
      onRefresh={reload}
      onDownload={rows.length ? handleDownload : undefined}
      onDetail={() => navigateToTarget(navigate, "is-emri", {}, filters)}
      onHide={onHide}
      extra={
        <Space size={8} wrap>
          <Input
            allowClear
            size="small"
            value={aramaMetni}
            onChange={(event) => setAramaMetni(event.target.value)}
            placeholder={t("personelAra")}
            prefix={<LuSearch size={13} color={COLORS.muted} />}
            style={{ width: 180 }}
          />
          <Segmented size="small" value={donem} onChange={setDonem} options={donemSecenekleri} />
          <Button size="small" icon={<LuDownload size={14} />} onClick={handleDownload} disabled={!rows.length}>
            {t("indir")}
          </Button>
        </Space>
      }
    >
      {donem === "OZEL" ? (
        <div style={{ padding: "12px 16px 0" }}>
          <WidgetDateRange startFieldName={START_FIELD} endFieldName={END_FIELD} />
        </div>
      ) : null}
      <Table
        size="small"
        rowKey="clientKey"
        columns={columns}
        dataSource={rows}
        pagination={{ pageSize: 8, size: "small", hideOnSinglePage: true }}
        locale={{ emptyText: t("veriYok") }}
        onRow={(record) => ({ style: { cursor: "pointer" }, onClick: () => navigateToTarget(navigate, record.TargetPage, record.FilterParams, filters) })}
      />
    </WidgetCard>
  );
}

PersonnelKpi.propTypes = {
  onHide: PropTypes.func,
};
