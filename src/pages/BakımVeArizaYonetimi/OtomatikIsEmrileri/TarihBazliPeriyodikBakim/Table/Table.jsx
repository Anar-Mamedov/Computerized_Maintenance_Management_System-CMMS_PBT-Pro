import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useFormContext } from "react-hook-form";
import { Button, Checkbox, DatePicker, Input, Modal, Pagination, Space, Spin, Table, Typography, message } from "antd";
import { DownloadOutlined, EllipsisOutlined, MenuOutlined, SearchOutlined } from "@ant-design/icons";
import { t } from "i18next";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import PropTypes from "prop-types";

dayjs.extend(isoWeek);
import * as XLSX from "xlsx";
import AxiosInstance from "../../../../../api/http";
import KodIDSelectbox from "../../../../../utils/components/KodIDSelectbox";
import LokasyonTablo from "../../../../../utils/components/LokasyonTablo";
import AtolyeTablo from "../../../../../utils/components/AtolyeTablo";
import MakineTablo from "../../../../../utils/components/Machina/MakineTablo";

const { RangePicker } = DatePicker;
const { Text } = Typography;

const COLUMN_STORAGE_KEY = "otomatikIsEmirleriVisibleColumns";
const DATE_REQUEST_FORMAT = "YYYY-MM-DD";
const DATE_DISPLAY_FORMAT = "DD.MM.YYYY";

const createDefaultDateRange = () => [dayjs().startOf("month"), dayjs().endOf("month")];

const formatDate = (value) => {
  if (!value) {
    return "-";
  }

  const date = dayjs(value);
  return date.isValid() ? date.format(DATE_DISPLAY_FORMAT) : "-";
};

const formatNumber = (value) => {
  if (value === null || value === undefined || value === "") {
    return "0";
  }

  const number = Number(value);
  if (Number.isNaN(number)) {
    return String(value);
  }

  return new Intl.NumberFormat("tr-TR", {
    maximumFractionDigits: Number.isInteger(number) ? 0 : 2,
  }).format(number);
};

const getStatusColors = (text, days) => {
  const normalizedText = String(text || "").toLocaleLowerCase("tr-TR");

  if (normalizedText.includes("geçti")) {
    return {
      color: "#cf1322",
      borderColor: "#ffccc7",
      backgroundColor: "#fff1f0",
    };
  }

  if (normalizedText.includes("bugün") || normalizedText.includes("yaklaş") || normalizedText.includes("yakında")) {
    return {
      color: "#d46b08",
      borderColor: "#ffd591",
      backgroundColor: "#fff7e6",
    };
  }

  if (normalizedText.includes("devam")) {
    return {
      color: "#1677ff",
      borderColor: "#adc6ff",
      backgroundColor: "#f0f5ff",
    };
  }

  if (normalizedText.includes("planlı") && Number(days) > 30) {
    return {
      color: "#389e0d",
      borderColor: "#b7eb8f",
      backgroundColor: "#f6ffed",
    };
  }

  return {
    color: "#1677ff",
    borderColor: "#adc6ff",
    backgroundColor: "#f0f5ff",
  };
};

const StatusPill = ({ text, days }) => {
  const colors = getStatusColors(text, days);

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        minWidth: 106,
        justifyContent: "center",
        padding: "2px 12px",
        borderRadius: 999,
        border: `1px solid ${colors.borderColor}`,
        backgroundColor: colors.backgroundColor,
        color: colors.color,
        fontSize: 12,
        fontWeight: 500,
        whiteSpace: "nowrap",
      }}
    >
      {text || "-"}
    </span>
  );
};

StatusPill.propTypes = {
  text: PropTypes.string,
  days: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

const getDefaultVisibleColumns = (allColumns) => {
  const saved = localStorage.getItem(COLUMN_STORAGE_KEY);

  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    } catch (error) {
      console.error("Column visibility parse error:", error);
    }
  }

  return allColumns.map((column) => column.key);
};

const buildExcelData = (rows) =>
  rows.map((item) => ({
    [t("ekipman", { defaultValue: "Ekipman" })]: `${item.MKN_KOD || ""} ${item.MKN_TANIM || ""}`.trim(),
    [t("bakim", { defaultValue: "Bakım" })]: `${item.PBK_KOD || ""} ${item.PBK_TANIM || ""}`.trim(),
    [t("baz", { defaultValue: "Baz" })]: item.BAZ_DURUM || "",
    [t("periyot", { defaultValue: "Periyot" })]: item.PBK_PERIYOT_ACIKLAMA || "",
    [t("hedefTahminiTarih", { defaultValue: "Hedef/Tahmini Tarih" })]: formatDate(item.HEDEF_TAHMINI_TARIH || item.PBM_HEDEF_TARIH),
    [t("kalanGunBirim", { defaultValue: "Kalan (Gün/Birim)" })]: item.KALAN_DURUM_TEXT || "",
    [t("sonOkuma", { defaultValue: "Son Okuma" })]: `${formatNumber(item.GUNCEL_SAYAC)} ${item.MES_SON_OKUMA_TARIH ? `(${formatDate(item.MES_SON_OKUMA_TARIH)})` : ""}`.trim(),
    [t("lokasyon")]: item.LOKASYON || "",
    [t("atolye")]: item.ATOLYE || "",
    [t("ekipmanTipi")]: item.EKIPMAN_TIPI || "",
  }));

const baseToolbarStyles = {
  display: "flex",
  alignItems: "center",
  gap: 10,
  flexWrap: "wrap",
};

export default function MainTable({ hatirlaticiGrupId, hatirlaticiSiraId }) {
  const { setValue, watch } = useFormContext();
  const [messageApi, contextHolder] = message.useMessage();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [columnsModalOpen, setColumnsModalOpen] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [totalCount, setTotalCount] = useState(0);
  const [draftFilters, setDraftFilters] = useState({
    Kelime: "",
    LokasyonIds: [],
    LokasyonLabels: [],
    AtolyeIds: [],
    AtolyeLabels: [],
    EkipmanIds: [],
    EkipmanLabels: [],
    EkipmanTipIds: [],
    TarihAraligi: createDefaultDateRange(),
  });
  const [appliedFilters, setAppliedFilters] = useState({
    Kelime: "",
    LokasyonIds: [],
    AtolyeIds: [],
    EkipmanIds: [],
    EkipmanTipIds: [],
    BaslangicTarih: dayjs().startOf("month").format(DATE_REQUEST_FORMAT),
    BitisTarih: dayjs().endOf("month").format(DATE_REQUEST_FORMAT),
  });
  const filterLokasyonId = watch("filterLokasyonID");
  const filterLokasyonTanim = watch("filterLokasyonTanim");
  const filterAtolyeId = watch("filterAtolyeID");
  const filterAtolyeTanim = watch("filterAtolyeTanim");
  const filterEkipmanId = watch("filterEkipmanID");
  const filterEkipmanTanim = watch("filterEkipmanTanim");
  const filterEkipmanTipIds = watch("filterEkipmanTipIds");

  const tableColumns = useMemo(
    () => [
      {
        title: t("ekipman", { defaultValue: "Ekipman" }),
        dataIndex: "MKN_KOD",
        key: "ekipman",
        width: 300,
        render: (_, record) => (
          <div style={{ lineHeight: 1.2 }}>
            <div style={{ fontWeight: 700, color: "#344054" }}>{record.MKN_KOD || "-"}</div>
            <Text type="secondary" style={{ fontSize: 12 }}>
              {record.MKN_TANIM || "-"}
            </Text>
          </div>
        ),
      },
      {
        title: t("bakim", { defaultValue: "Bakım" }),
        dataIndex: "PBK_KOD",
        key: "bakim",
        width: 340,
        render: (_, record) => (
          <div style={{ lineHeight: 1.2 }}>
            <div style={{ fontWeight: 700, color: "#344054" }}>{record.PBK_KOD || "-"}</div>
            <Text type="secondary" style={{ fontSize: 12 }}>
              {record.PBK_TANIM || "-"}
            </Text>
          </div>
        ),
      },
      {
        title: t("baz", { defaultValue: "Baz" }),
        dataIndex: "BAZ_DURUM",
        key: "baz",
        width: 110,
        render: (value) => value || "-",
      },
      {
        title: t("periyot", { defaultValue: "Periyot" }),
        dataIndex: "PBK_PERIYOT_ACIKLAMA",
        key: "periyot",
        width: 220,
        render: (value) => value || "-",
      },
      {
        title: t("hedefTahminiTarih", { defaultValue: "Hedef/Tahmini Tarih" }),
        dataIndex: "HEDEF_TAHMINI_TARIH",
        key: "hedefTahminiTarih",
        width: 170,
        render: (_, record) => formatDate(record.HEDEF_TAHMINI_TARIH || record.PBM_HEDEF_TARIH),
      },
      {
        title: t("kalanGunBirim", { defaultValue: "Kalan (Gün/Birim)" }),
        dataIndex: "KALAN_DURUM_TEXT",
        key: "kalanDurum",
        width: 210,
        render: (_, record) => <StatusPill text={record.KALAN_DURUM_TEXT} days={record.KALAN_GUN_SAYI} />,
      },
      {
        title: t("sonOkuma", { defaultValue: "Son Okuma" }),
        dataIndex: "GUNCEL_SAYAC",
        key: "sonOkuma",
        width: 200,
        render: (_, record) => (
          <div style={{ lineHeight: 1.2 }}>
            <div style={{ fontWeight: 700, color: "#344054" }}>{formatNumber(record.GUNCEL_SAYAC)}</div>
            <Text type="secondary" style={{ fontSize: 12 }}>
              {record.MES_SON_OKUMA_TARIH ? formatDate(record.MES_SON_OKUMA_TARIH) : "-"}
            </Text>
          </div>
        ),
      },
      {
        title: t("lokasyon"),
        dataIndex: "LOKASYON",
        key: "lokasyon",
        width: 170,
        render: (value) => value || "-",
      },
      {
        title: t("atolye"),
        dataIndex: "ATOLYE",
        key: "atolye",
        width: 130,
        render: (value) => value || "-",
      },
      {
        title: t("ekipmanTipi"),
        dataIndex: "EKIPMAN_TIPI",
        key: "ekipmanTipi",
        width: 160,
        render: (value) => value || "-",
      },
    ],
    []
  );

  const [visibleColumnKeys, setVisibleColumnKeys] = useState(() => getDefaultVisibleColumns(tableColumns));

  const visibleColumns = useMemo(() => tableColumns.filter((column) => visibleColumnKeys.includes(column.key)), [tableColumns, visibleColumnKeys]);

  const handleFilterChange = useCallback((key, value) => {
    setDraftFilters((state) => ({
      ...state,
      [key]: value,
    }));
  }, []);

  const fetchTableData = useCallback(
    async (page = currentPage, size = pageSize, filters = appliedFilters) => {
      const payload = {
        LokasyonIds: Array.isArray(filters.LokasyonIds) ? filters.LokasyonIds : [],
        AtolyeIds: Array.isArray(filters.AtolyeIds) ? filters.AtolyeIds : [],
        EkipmanIds: Array.isArray(filters.EkipmanIds) ? filters.EkipmanIds : [],
        EkipmanTipIds: Array.isArray(filters.EkipmanTipIds) ? filters.EkipmanTipIds : [],
        BaslangicTarih: filters.BaslangicTarih || null,
        BitisTarih: filters.BitisTarih || null,
        Kelime: filters.Kelime || "",
      };

      try {
        setLoading(true);
        const endpoint = hatirlaticiGrupId
          ? `GetOtomatikIsEmirleriHatirlatici?pagingDeger=${page}&pageSize=${size}&hatirlaticiGrupId=${hatirlaticiGrupId}&hatirlaticiSiraId=${hatirlaticiSiraId}`
          : `GetOtomatikIsEmirleri?pagingDeger=${page}&pageSize=${size}`;
        const response = await AxiosInstance.post(endpoint, payload);
        const list = Array.isArray(response?.liste) ? response.liste : [];
        const normalizedRows = list.map((item, index) => ({
          ...item,
          clientKey: item.TB_PERIYODIK_BAKIM_MAKINE_ID ?? `${item.TB_PERIYODIK_BAKIM_ID || "pb"}-${item.TB_MAKINE_ID || "mk"}-${index}`,
        }));

        setRows(normalizedRows);
        setTotalCount(response?.kayit_sayisi ?? normalizedRows.length);
      } catch (error) {
        console.error("Automatic work orders error:", error);
        setRows([]);
        setTotalCount(0);

        if (navigator.onLine) {
          messageApi.error(`Hata Mesajı: ${error.message}`);
        } else {
          messageApi.error(t("internetBaglantisiMevcutDegil", { defaultValue: "İnternet bağlantısı mevcut değil." }));
        }
      } finally {
        setLoading(false);
      }
    },
    [appliedFilters, currentPage, pageSize, messageApi, hatirlaticiGrupId, hatirlaticiSiraId]
  );

  useEffect(() => {
    if (hatirlaticiGrupId && hatirlaticiSiraId) {
      let start = null;
      let end = null;
      let clearDate = true;

      if (Number(hatirlaticiSiraId) === 5) {
        // Yaklaşan (30 gün)
        start = dayjs();
        end = dayjs().add(30, "day");
        clearDate = false;
      } else if (Number(hatirlaticiSiraId) === 6) {
        // Bu Ay
        start = dayjs().startOf("month");
        end = dayjs().endOf("month");
        clearDate = false;
      } else if (Number(hatirlaticiSiraId) === 7) {
        // Bu Hafta
        start = dayjs().startOf("isoWeek");
        end = dayjs().endOf("isoWeek");
        clearDate = false;
      }

      if (clearDate) {
        setDraftFilters((prev) => ({
          ...prev,
          TarihAraligi: [],
        }));
        setAppliedFilters((prev) => ({
          ...prev,
          BaslangicTarih: null,
          BitisTarih: null,
        }));
      } else if (start && end) {
        setDraftFilters((prev) => ({
          ...prev,
          TarihAraligi: [start, end],
        }));
        setAppliedFilters((prev) => ({
          ...prev,
          BaslangicTarih: start.format(DATE_REQUEST_FORMAT),
          BitisTarih: end.format(DATE_REQUEST_FORMAT),
        }));
      }
    }
  }, [hatirlaticiGrupId, hatirlaticiSiraId]);

  useEffect(() => {
    fetchTableData(currentPage, pageSize, appliedFilters);
  }, [currentPage, pageSize, appliedFilters, fetchTableData]);

  const applyFilters = useCallback(() => {
    const [startDate, endDate] = Array.isArray(draftFilters.TarihAraligi) ? draftFilters.TarihAraligi : [];

    setAppliedFilters({
      Kelime: draftFilters.Kelime?.trim?.() || "",
      LokasyonIds: draftFilters.LokasyonIds || [],
      AtolyeIds: draftFilters.AtolyeIds || [],
      EkipmanIds: draftFilters.EkipmanIds || [],
      EkipmanTipIds: draftFilters.EkipmanTipIds || [],
      BaslangicTarih: startDate ? dayjs(startDate).format(DATE_REQUEST_FORMAT) : null,
      BitisTarih: endDate ? dayjs(endDate).format(DATE_REQUEST_FORMAT) : null,
    });
    setCurrentPage(1);
  }, [draftFilters]);

  const handleRefresh = useCallback(() => {
    fetchTableData(currentPage, pageSize, appliedFilters);
  }, [appliedFilters, currentPage, pageSize, fetchTableData]);

  const handleExport = useCallback(() => {
    try {
      setExporting(true);
      const worksheet = XLSX.utils.json_to_sheet(buildExcelData(rows));
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Otomatik İş Emirleri");
      XLSX.writeFile(workbook, "Otomatik_Is_Emirleri.xlsx");
    } finally {
      setExporting(false);
    }
  }, [rows]);

  const handleColumnVisibilityChange = useCallback((checkedValues) => {
    setVisibleColumnKeys(checkedValues);
    localStorage.setItem(COLUMN_STORAGE_KEY, JSON.stringify(checkedValues));
  }, []);

  const rowSelection = useMemo(
    () => ({
      selectedRowKeys,
      onChange: (keys, selectedRows) => {
        setSelectedRowKeys(keys);
        const selectedRow = selectedRows?.[0];
        setValue("selectedOtomatikIsEmriId", selectedRow?.TB_PERIYODIK_BAKIM_ID ?? null);
        setValue("selectedPeriyodikBakimMakineId", selectedRow?.TB_PERIYODIK_BAKIM_MAKINE_ID ?? null);
      },
    }),
    [selectedRowKeys, setValue]
  );

  useEffect(() => {
    setDraftFilters((state) => ({
      ...state,
      LokasyonIds: filterLokasyonId ? [filterLokasyonId] : [],
      LokasyonLabels: filterLokasyonTanim ? [filterLokasyonTanim] : [],
    }));
    setValue("lokasyonID", filterLokasyonId || "");
  }, [filterLokasyonId, filterLokasyonTanim, setValue]);

  useEffect(() => {
    setDraftFilters((state) => ({
      ...state,
      AtolyeIds: filterAtolyeId ? [filterAtolyeId] : [],
      AtolyeLabels: filterAtolyeTanim ? [filterAtolyeTanim] : [],
    }));
    setValue("atolyeID", filterAtolyeId || "");
  }, [filterAtolyeId, filterAtolyeTanim, setValue]);

  useEffect(() => {
    setDraftFilters((state) => ({
      ...state,
      EkipmanIds: filterEkipmanId ? [filterEkipmanId] : [],
      EkipmanLabels: filterEkipmanTanim ? [filterEkipmanTanim] : [],
    }));
  }, [filterEkipmanId, filterEkipmanTanim]);

  useEffect(() => {
    setDraftFilters((state) => ({
      ...state,
      EkipmanTipIds: Array.isArray(filterEkipmanTipIds) ? filterEkipmanTipIds : [],
    }));
  }, [filterEkipmanTipIds]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {contextHolder}

      <Modal
        width={720}
        title={t("kolonlariDuzenle", { defaultValue: "Kolonları Düzenle" })}
        open={columnsModalOpen}
        onOk={() => setColumnsModalOpen(false)}
        onCancel={() => setColumnsModalOpen(false)}
      >
        <Checkbox.Group style={{ width: "100%", display: "flex", flexDirection: "column", gap: 10 }} value={visibleColumnKeys} onChange={handleColumnVisibilityChange}>
          {tableColumns.map((column) => (
            <Checkbox key={column.key} value={column.key}>
              {column.title}
            </Checkbox>
          ))}
        </Checkbox.Group>
      </Modal>

      <div
        style={{
          border: "1px solid #f0f0f0",
          borderRadius: 16,
          background: "#ffffff",
          padding: 12,
        }}
      >
        <div style={{ ...baseToolbarStyles, justifyContent: "space-between", marginBottom: 12 }}>
          <div style={{ ...baseToolbarStyles, flex: 1 }}>
            <Button icon={<MenuOutlined />} onClick={() => setColumnsModalOpen(true)} />

            <Input
              allowClear
              value={draftFilters.Kelime}
              onChange={(event) => handleFilterChange("Kelime", event.target.value)}
              onPressEnter={applyFilters}
              prefix={<SearchOutlined style={{ color: "#98a2b3" }} />}
              placeholder={t("aramaYap", { defaultValue: "Arama Yap" })}
              style={{ width: 150 }}
            />

            <div style={{ width: 150 }}>
              <MakineTablo
                hideHeader={false}
                suppressFormFields={false}
                includeAtolyeFilter={false}
                makineFieldName="filterEkipmanTanim"
                makineIdFieldName="filterEkipmanID"
                placeholder={t("ekipmanKodu", { defaultValue: "Ekipman Kodu" })}
              />
            </div>

            <div style={{ width: 150 }}>
              <LokasyonTablo
                lokasyonFieldName="filterLokasyonTanim"
                lokasyonIdFieldName="filterLokasyonID"
                placeholder={t("lokasyon", { defaultValue: "Lokasyon" })}
              />
            </div>

            <div style={{ width: 150 }}>
              <AtolyeTablo nameFields={{ tanim: "filterAtolyeTanim", id: "filterAtolyeID" }} placeholder={t("atolye", { defaultValue: "Atölye" })} />
            </div>

            <div style={{ width: 132 }}>
              <KodIDSelectbox
                name1="filterEkipmanTipIds"
                kodID={32501}
                isRequired={false}
                mode="multiple"
                maxTagCount="responsive"
                showDropdownAdd={false}
                placeholder={t("ekipmanTipi", { defaultValue: "Ekipman Tipi" })}
                style={{ width: "100%" }}
              />
            </div>

            <RangePicker
              allowClear
              value={draftFilters.TarihAraligi}
              format={DATE_DISPLAY_FORMAT}
              style={{ width: 210 }}
              onChange={(value) => handleFilterChange("TarihAraligi", value ?? [])}
            />
          </div>

          <Space wrap>
            <Button icon={<DownloadOutlined />} loading={exporting} onClick={handleExport}>
              {t("indir")}
            </Button>
            <Button
              type="primary"
              style={{ backgroundColor: "#52c41a", borderColor: "#52c41a" }}
              icon={<EllipsisOutlined />}
              onClick={handleRefresh}
            />
            <Button type="primary" onClick={applyFilters}>
              {t("uygula")}
            </Button>
          </Space>
        </div>

        <Spin spinning={loading}>
          <Table
            rowKey="clientKey"
            rowSelection={rowSelection}
            columns={visibleColumns}
            dataSource={rows}
            size="middle"
            pagination={false}
            scroll={{ x: 1650, y: "calc(100vh - 340px)" }}
            locale={{
              emptyText: t("veriYok", { defaultValue: "Veri Yok" }),
            }}
            rowClassName={() => "otomatik-is-emri-row"}
          />
        </Spin>

        <div style={{ marginTop: 8, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
          <Text type="secondary" style={{ margin: 0 }}>
            {t("kayit", { defaultValue: "kayıt" })}: {totalCount}
          </Text>
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={totalCount}
            showSizeChanger
            pageSizeOptions={["20", "50", "100"]}
            onChange={(page, size) => {
              setCurrentPage(page);
              setPageSize(size);
            }}
          />
        </div>
      </div>
    </div>
  );
}
