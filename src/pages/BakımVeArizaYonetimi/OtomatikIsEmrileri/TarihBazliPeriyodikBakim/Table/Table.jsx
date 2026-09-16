import React, { useCallback, useEffect, useMemo, useRef, useState, isValidElement } from "react";
import { useFormContext } from "react-hook-form";
import { Button, Checkbox, Input, Modal, Pagination, Space, Spin, Table, Typography, message } from "antd";
import { DownloadOutlined, FilterOutlined, HolderOutlined, MenuOutlined, SearchOutlined } from "@ant-design/icons";
import { DndContext, useSensor, useSensors, PointerSensor, KeyboardSensor } from "@dnd-kit/core";
import { sortableKeyboardCoordinates, arrayMove, useSortable, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Resizable } from "react-resizable";
import { t } from "i18next";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import PropTypes from "prop-types";

dayjs.extend(isoWeek);
import * as XLSX from "xlsx";
import "./ResizeStyle.css";
import AxiosInstance from "../../../../../api/http";
import ContextMenu from "../components/ContextMenu/ContextMenu";
import EditDrawer from "../../../PeriyodikBakimlar1/Update/EditDrawer";
import WorkOrderEditDrawer from "../../../IsEmri/Update/EditDrawer";
import FilterDrawer from "./filter/FilterDrawer";
import { useDashboardFilterParams } from "../../../../../utils/dashboardFilterParams";

const { Text } = Typography;

const COLUMN_ORDER_KEY = "otomatikIsEmirleriColumnOrder";
const COLUMN_VISIBILITY_KEY = "otomatikIsEmirleriColumnVisibility";
const COLUMN_WIDTHS_KEY = "otomatikIsEmirleriColumnWidths";
const DATE_REQUEST_FORMAT = "YYYY-MM-DD";
const DATE_DISPLAY_FORMAT = "DD.MM.YYYY";

// React element içinden düz metni çıkartır (kolon başlığı arama/sürükleme listesi için)
const extractTextFromElement = (element) => {
  if (typeof element === "string") {
    return element;
  }
  if (Array.isArray(element)) {
    return element.map((child) => extractTextFromElement(child)).join("");
  }
  if (isValidElement(element)) {
    return extractTextFromElement(element.props.children);
  }
  if (element !== null && element !== undefined) {
    return String(element);
  }
  return "";
};

// Sütun genişliğini sürükleyerek ayarlamak için başlık hücresi
const ResizableTitle = (props) => {
  const { onResize, width, ...restProps } = props;

  const handleStyle = {
    position: "absolute",
    bottom: 0,
    right: "-5px",
    width: "20%",
    height: "100%",
    zIndex: 2,
    cursor: "col-resize",
    padding: "0px",
    backgroundSize: "0px",
  };

  if (!width) {
    return <th {...restProps} />;
  }

  return (
    <Resizable
      width={width}
      height={0}
      handle={<span className="react-resizable-handle" onClick={(e) => e.stopPropagation()} style={handleStyle} />}
      onResize={onResize}
      draggableOpts={{ enableUserSelectHack: false }}
    >
      <th {...restProps} />
    </Resizable>
  );
};

// Modal içinde sütun sırasını sürükleyerek değiştirmek için satır
const DraggableRow = ({ id, text, style, ...restProps }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const styleWithTransform = {
    ...style,
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    backgroundColor: isDragging ? "#f0f0f0" : "",
    display: "flex",
    alignItems: "center",
    gap: 8,
  };

  return (
    <div ref={setNodeRef} style={styleWithTransform} {...restProps} {...attributes}>
      <div {...listeners} style={{ cursor: "grab", flexGrow: 1, display: "flex", alignItems: "center" }}>
        <HolderOutlined style={{ marginRight: 8 }} />
        {text}
      </div>
    </div>
  );
};

DraggableRow.propTypes = {
  id: PropTypes.string.isRequired,
  text: PropTypes.node,
  style: PropTypes.object,
};

ResizableTitle.propTypes = {
  onResize: PropTypes.func,
  width: PropTypes.number,
};

const createDefaultDateRange = () => [dayjs().startOf("month"), dayjs().endOf("month")];

/**
 * Dashboard'dan URL ile gelen filtreleri GetOtomatikIsEmirleri govdesinin alan adlarina cevirir.
 * Rehber madde 1: periyodik bakim tiklamalari bu ekrana "durum" (geciken/yaklasan/bugun...) ile gelir.
 */
const dashboardFiltreleriniCevir = (dashboardFilters) => {
  const tarihler = dashboardFilters.customfilters || {};
  const baslangic = tarihler.startDate ? dayjs(tarihler.startDate) : null;
  const bitis = tarihler.endDate ? dayjs(tarihler.endDate) : null;

  return {
    Durum: dashboardFilters.durum || "",
    LokasyonIds: dashboardFilters.lokasyonlar || [],
    AtolyeIds: dashboardFilters.atolyeler || [],
    EkipmanIds: dashboardFilters.makineler || [],
    EkipmanTipIds: dashboardFilters.makinetip || [],
    PeriyodikBakimIds: dashboardFilters.pbakimId ? [dashboardFilters.pbakimId] : [],
    // Dashboard tarih vermediyse ekranin varsayilan "bu ay" araligi temizlenir; aksi halde
    // "geciken" gibi gecmise donuk bir durum sessizce bu aya daraltilmis olurdu.
    TarihAraligi: baslangic && bitis ? [baslangic, bitis] : [],
  };
};

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
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [editDrawer, setEditDrawer] = useState({
    visible: false,
    data: null,
  });
  const [workOrderDrawer, setWorkOrderDrawer] = useState({
    visible: false,
    data: null,
  });
  // Dashboard'dan gelen filtreler; ekranin kendi secimleri bunlarin uzerine yazar.
  // expectedPath verildigi icin bu tablo baska ekranlarda modal olarak kullanildiginda filtre almaz.
  const { active: dashboardAktif, filters: dashboardFilters } = useDashboardFilterParams("/otomatikIsEmirleri");
  const dashboardTemeli = useMemo(() => dashboardFiltreleriniCevir(dashboardFilters), [dashboardFilters]);
  // Baslangic degerleri dogrudan dashboard'dan kurulur; aksi halde ekran once kendi
  // varsayilanlariyla bir istek atip hemen ardindan dogru filtrelerle ikinci kez atardi.
  const dashboardBaslangiciRef = useRef(dashboardAktif ? dashboardTemeli : null);

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
    PeriyodikBakimIds: dashboardBaslangiciRef.current?.PeriyodikBakimIds || [],
    TarihAraligi: dashboardBaslangiciRef.current ? dashboardBaslangiciRef.current.TarihAraligi : createDefaultDateRange(),
  });
  const [appliedFilters, setAppliedFilters] = useState(() => {
    const dashboarddan = dashboardBaslangiciRef.current;
    const [baslangic, bitis] = dashboarddan ? dashboarddan.TarihAraligi : createDefaultDateRange();

    return {
      Kelime: "",
      LokasyonIds: dashboarddan?.LokasyonIds || [],
      AtolyeIds: dashboarddan?.AtolyeIds || [],
      EkipmanIds: dashboarddan?.EkipmanIds || [],
      EkipmanTipIds: dashboarddan?.EkipmanTipIds || [],
      PeriyodikBakimIds: dashboarddan?.PeriyodikBakimIds || [],
      BaslangicTarih: baslangic ? dayjs(baslangic).format(DATE_REQUEST_FORMAT) : null,
      BitisTarih: bitis ? dayjs(bitis).format(DATE_REQUEST_FORMAT) : null,
      Durum: dashboarddan?.Durum || "",
    };
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

  const [columnSearchTerm, setColumnSearchTerm] = useState("");

  // Sütun sırası / görünürlüğü / genişliği localStorage'dan okunup state'e atılır
  const [columns, setColumns] = useState(() => {
    const savedOrder = localStorage.getItem(COLUMN_ORDER_KEY);
    const savedVisibility = localStorage.getItem(COLUMN_VISIBILITY_KEY);
    const savedWidths = localStorage.getItem(COLUMN_WIDTHS_KEY);

    let order = [];
    let visibility = {};
    let widths = {};

    try {
      order = savedOrder ? JSON.parse(savedOrder) : [];
    } catch (error) {
      order = [];
    }
    try {
      visibility = savedVisibility ? JSON.parse(savedVisibility) : {};
    } catch (error) {
      visibility = {};
    }
    try {
      widths = savedWidths ? JSON.parse(savedWidths) : {};
    } catch (error) {
      widths = {};
    }

    // Yeni eklenmiş kolonları (storage'da olmayan) sona ekle ve varsayılanlarını ata
    tableColumns.forEach((col) => {
      if (!order.includes(col.key)) {
        order.push(col.key);
      }
      if (visibility[col.key] === undefined) {
        visibility[col.key] = col.visible !== false;
      }
      if (widths[col.key] === undefined) {
        widths[col.key] = col.width;
      }
    });

    // Artık var olmayan kolon anahtarlarını sıralamadan temizle
    order = order.filter((key) => tableColumns.some((col) => col.key === key));

    return order.map((key) => {
      const column = tableColumns.find((col) => col.key === key);
      return { ...column, visible: visibility[key], width: widths[key] };
    });
  });

  // Sütun ayarlarını localStorage'a kaydet
  useEffect(() => {
    localStorage.setItem(COLUMN_ORDER_KEY, JSON.stringify(columns.map((col) => col.key)));
    localStorage.setItem(COLUMN_VISIBILITY_KEY, JSON.stringify(columns.reduce((acc, col) => ({ ...acc, [col.key]: col.visible }), {})));
    localStorage.setItem(COLUMN_WIDTHS_KEY, JSON.stringify(columns.reduce((acc, col) => ({ ...acc, [col.key]: col.width }), {})));
  }, [columns]);

  const columnSensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  // Sütun genişliğini günceller
  const handleResize =
    (key) =>
    (_, { size }) => {
      setColumns((prev) => prev.map((col) => (col.key === key ? { ...col, width: size.width } : col)));
    };

  const components = {
    header: {
      cell: ResizableTitle,
    },
  };

  const mergedColumns = columns.map((col) => ({
    ...col,
    onHeaderCell: (column) => ({
      width: column.width,
      onResize: handleResize(column.key),
    }),
  }));

  const filteredColumns = mergedColumns.filter((col) => col.visible);

  // Sütun sırasını değiştirir
  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = columns.findIndex((column) => column.key === active.id);
      const newIndex = columns.findIndex((column) => column.key === over.id);
      if (oldIndex !== -1 && newIndex !== -1) {
        setColumns((prev) => arrayMove(prev, oldIndex, newIndex));
      }
    }
  };

  // Sütun görünürlüğünü değiştirir
  const toggleVisibility = (key, checked) => {
    setColumns((prev) => prev.map((col) => (col.key === key ? { ...col, visible: checked } : col)));
  };

  // Sütun ayarlarını sıfırlar
  const resetColumns = () => {
    localStorage.removeItem(COLUMN_ORDER_KEY);
    localStorage.removeItem(COLUMN_VISIBILITY_KEY);
    localStorage.removeItem(COLUMN_WIDTHS_KEY);
    setColumns(tableColumns.map((col) => ({ ...col, visible: col.visible !== false })));
  };

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
        PeriyodikBakimIds: Array.isArray(filters.PeriyodikBakimIds) ? filters.PeriyodikBakimIds : [],
        BaslangicTarih: filters.BaslangicTarih || null,
        BitisTarih: filters.BitisTarih || null,
        Kelime: filters.Kelime || "",
      };

      // Dashboard'dan gelen donem kapsami (geciken / yaklasan / bugun / buHafta / buAy).
      if (filters.Durum) {
        payload.durum = filters.Durum;
      }

      try {
        setLoading(true);
        const endpoint = hatirlaticiGrupId
          ? `GetOtomatikIsEmirleriHatirlatici?pagingDeger=${page}&pageSize=${size}&hatirlaticiGrupId=${hatirlaticiGrupId}&hatirlaticiSiraId=${hatirlaticiSiraId}`
          : `GetOtomatikIsEmirleri?pagingDeger=${page}&pageSize=${size}`;
        const response = await AxiosInstance.post(endpoint, payload);
        const list = Array.isArray(response?.liste) ? response.liste : [];
        const normalizedRows = list.map((item, index) => ({
          ...item,
          BakimID: item.TB_PERIYODIK_BAKIM_ID ?? item.BakimID,
          MakineID: item.TB_MAKINE_ID ?? item.MakineID,
          PlanlamaTarih: item.HEDEF_TAHMINI_TARIH ?? item.PBM_HEDEF_TARIH ?? item.PlanlamaTarih,
          clientKey: item.TB_PERIYODIK_BAKIM_MAKINE_ID ?? `${item.TB_PERIYODIK_BAKIM_ID || "pb"}-${item.TB_MAKINE_ID || "mk"}-${index}`,
        }));

        setRows(normalizedRows);
        setTotalCount(response?.kayit_sayisi ?? normalizedRows.length);
        setSelectedRowKeys([]);
        setSelectedRows([]);
      } catch (error) {
        console.error("Automatic work orders error:", error);
        setRows([]);
        setTotalCount(0);
        setSelectedRowKeys([]);
        setSelectedRows([]);

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

  // Dashboard'dan gelindiginde ekran URL'deki filtrelerle acilir.
  // Ilk acilis zaten baslangic degerleriyle kuruldugu icin burada yalnizca sonraki
  // URL degisiklikleri (ayni ekranda kalip baska bir widget'tan gelinmesi) ele alinir.
  // Cekmecedeki form alanlariyla surulen filtreler asagidaki watch efektlerinde islenir.
  useEffect(() => {
    if (!dashboardAktif) return;
    if (dashboardBaslangiciRef.current === dashboardTemeli) return;
    dashboardBaslangiciRef.current = dashboardTemeli;

    const [baslangic, bitis] = dashboardTemeli.TarihAraligi;

    setDraftFilters((state) => ({
      ...state,
      PeriyodikBakimIds: dashboardTemeli.PeriyodikBakimIds,
      TarihAraligi: dashboardTemeli.TarihAraligi,
    }));
    setAppliedFilters((state) => ({
      ...state,
      LokasyonIds: dashboardTemeli.LokasyonIds,
      AtolyeIds: dashboardTemeli.AtolyeIds,
      EkipmanIds: dashboardTemeli.EkipmanIds,
      EkipmanTipIds: dashboardTemeli.EkipmanTipIds,
      PeriyodikBakimIds: dashboardTemeli.PeriyodikBakimIds,
      BaslangicTarih: baslangic ? baslangic.format(DATE_REQUEST_FORMAT) : null,
      BitisTarih: bitis ? bitis.format(DATE_REQUEST_FORMAT) : null,
      Durum: dashboardTemeli.Durum,
    }));
    setCurrentPage(1);
  }, [dashboardAktif, dashboardTemeli]);

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
      PeriyodikBakimIds: draftFilters.PeriyodikBakimIds || [],
      BaslangicTarih: startDate ? dayjs(startDate).format(DATE_REQUEST_FORMAT) : null,
      BitisTarih: endDate ? dayjs(endDate).format(DATE_REQUEST_FORMAT) : null,
      // Donem kapsaminin cekmecede karsiligi yok; kullanici filtre uygularken kaybolmamali.
      Durum: dashboardTemeli.Durum,
    });
    setCurrentPage(1);
  }, [draftFilters, dashboardTemeli]);

  // Filtreler panelindeki bir filtre uygulandı mı? (Filtreler butonundaki gösterge için)
  const isFilterApplied = useMemo(() => {
    return (
      (appliedFilters.LokasyonIds?.length || 0) > 0 ||
      (appliedFilters.AtolyeIds?.length || 0) > 0 ||
      (appliedFilters.EkipmanIds?.length || 0) > 0 ||
      (appliedFilters.EkipmanTipIds?.length || 0) > 0 ||
      (appliedFilters.PeriyodikBakimIds?.length || 0) > 0
    );
  }, [appliedFilters]);

  // Filtreler panelinden uygula: filtreleri uygula ve paneli kapat
  const handleApplyFiltersFromDrawer = useCallback(() => {
    applyFilters();
    setFilterDrawerOpen(false);
  }, [applyFilters]);

  const handleRefresh = useCallback(() => {
    fetchTableData(currentPage, pageSize, appliedFilters);
  }, [appliedFilters, currentPage, pageSize, fetchTableData]);

  const handleRowOpen = useCallback((record) => {
    const periyodikBakimId = record?.TB_PERIYODIK_BAKIM_ID ?? record?.BakimID;

    if (!periyodikBakimId) {
      return;
    }

    setEditDrawer({
      visible: true,
      data: {
        ...record,
        key: periyodikBakimId,
      },
    });
  }, []);

  const handleWorkOrderCreated = useCallback(({ id, code }) => {
    setWorkOrderDrawer({
      visible: true,
      data: {
        key: id,
        ISEMRI_NO: code,
      },
    });
  }, []);

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

  const rowSelection = useMemo(
    () => ({
      selectedRowKeys,
      onChange: (keys, selectedRowsList) => {
        setSelectedRowKeys(keys);
        setSelectedRows(selectedRowsList);
        const selectedRow = selectedRowsList?.[0];
        setValue("selectedOtomatikIsEmriId", selectedRow?.TB_PERIYODIK_BAKIM_ID ?? null);
        setValue("selectedPeriyodikBakimMakineId", selectedRow?.TB_PERIYODIK_BAKIM_MAKINE_ID ?? null);
      },
    }),
    [selectedRowKeys, setValue]
  );

  useEffect(() => {
    setDraftFilters((state) => ({
      ...state,
      LokasyonIds: filterLokasyonId ? [filterLokasyonId] : dashboardTemeli.LokasyonIds,
      LokasyonLabels: filterLokasyonTanim ? [filterLokasyonTanim] : [],
    }));
    setValue("lokasyonID", filterLokasyonId || "");
  }, [filterLokasyonId, filterLokasyonTanim, setValue, dashboardTemeli]);

  useEffect(() => {
    setDraftFilters((state) => ({
      ...state,
      AtolyeIds: filterAtolyeId ? [filterAtolyeId] : dashboardTemeli.AtolyeIds,
      AtolyeLabels: filterAtolyeTanim ? [filterAtolyeTanim] : [],
    }));
    setValue("atolyeID", filterAtolyeId || "");
  }, [filterAtolyeId, filterAtolyeTanim, setValue, dashboardTemeli]);

  useEffect(() => {
    setDraftFilters((state) => ({
      ...state,
      EkipmanIds: filterEkipmanId ? [filterEkipmanId] : dashboardTemeli.EkipmanIds,
      EkipmanLabels: filterEkipmanTanim ? [filterEkipmanTanim] : [],
    }));
  }, [filterEkipmanId, filterEkipmanTanim, dashboardTemeli]);

  useEffect(() => {
    setDraftFilters((state) => ({
      ...state,
      EkipmanTipIds: filterEkipmanTipIds?.length ? filterEkipmanTipIds : dashboardTemeli.EkipmanTipIds,
    }));
  }, [filterEkipmanTipIds, dashboardTemeli]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {contextHolder}

      <Modal
        title={t("sutunlariYonet", { defaultValue: "Sütunları Yönet" })}
        centered
        width={800}
        open={columnsModalOpen}
        onOk={() => setColumnsModalOpen(false)}
        onCancel={() => setColumnsModalOpen(false)}
      >
        <Text style={{ marginBottom: "15px" }}>
          {t("sutunGosterGizleSiralaAciklama", { defaultValue: "Aşağıdaki Ekranlardan Sütunları Göster / Gizle ve Sıralamalarını Ayarlayabilirsiniz." })}
        </Text>
        <div style={{ display: "flex", width: "100%", justifyContent: "center", marginTop: "10px" }}>
          <Button onClick={resetColumns} style={{ marginBottom: "15px" }}>
            {t("sutunlariSifirla", { defaultValue: "Sütunları Sıfırla" })}
          </Button>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div style={{ width: "46%", border: "1px solid #8080806e", borderRadius: "8px", padding: "10px" }}>
            <div
              style={{
                marginBottom: "10px",
                borderBottom: "1px solid #80808051",
                padding: "8px 8px 12px 8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "10px",
              }}
            >
              <Text style={{ fontWeight: 600 }}>{t("sutunlariGosterGizle", { defaultValue: "Sütunları Göster / Gizle" })}</Text>
              <Checkbox
                checked={columns.length > 0 && columns.every((c) => c.visible)}
                indeterminate={columns.some((c) => c.visible) && !columns.every((c) => c.visible)}
                onChange={(e) => {
                  const checked = e.target.checked;
                  setColumns((prev) => prev.map((col) => ({ ...col, visible: checked })));
                }}
              >
                {t("tumunuSec", { defaultValue: "Tümünü Seç" })}
              </Checkbox>
            </div>
            <Input
              style={{ marginBottom: "10px" }}
              placeholder={t("sutunAra", { defaultValue: "Sütun ara..." })}
              prefix={<SearchOutlined style={{ color: "#0091ff" }} />}
              value={columnSearchTerm}
              onChange={(e) => setColumnSearchTerm(e.target.value)}
              allowClear
            />
            <div style={{ height: "360px", overflow: "auto" }}>
              {tableColumns
                .filter((col) => extractTextFromElement(col.title).toLowerCase().includes(columnSearchTerm.toLowerCase()))
                .map((col) => (
                  <div style={{ display: "flex", gap: "10px", marginBottom: "6px" }} key={col.key}>
                    <Checkbox checked={columns.find((column) => column.key === col.key)?.visible || false} onChange={(e) => toggleVisibility(col.key, e.target.checked)} />
                    {col.title}
                  </div>
                ))}
            </div>
          </div>

          <DndContext onDragEnd={handleDragEnd} sensors={columnSensors}>
            <div style={{ width: "46%", border: "1px solid #8080806e", borderRadius: "8px", padding: "10px" }}>
              <div style={{ marginBottom: "20px", borderBottom: "1px solid #80808051", padding: "8px 8px 12px 8px" }}>
                <Text style={{ fontWeight: 600 }}>{t("sutunlarinSiralamasiniAyarla", { defaultValue: "Sütunların Sıralamasını Ayarla" })}</Text>
              </div>
              <div style={{ height: "400px", overflow: "auto" }}>
                <SortableContext items={columns.filter((col) => col.visible).map((col) => col.key)} strategy={verticalListSortingStrategy}>
                  {columns
                    .filter((col) => col.visible)
                    .map((col) => (
                      <DraggableRow key={col.key} id={col.key} text={col.title} />
                    ))}
                </SortableContext>
              </div>
            </div>
          </DndContext>
        </div>
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
              style={{ width: 200 }}
            />

            <Button
              icon={<FilterOutlined />}
              onClick={() => setFilterDrawerOpen(true)}
              style={{ backgroundColor: isFilterApplied ? "#EBF6FE" : undefined, borderColor: isFilterApplied ? "#1677ff" : undefined }}
            >
              {t("filtreler", { defaultValue: "Filtreler" })}
            </Button>
          </div>

          <Space wrap>
            <Button icon={<DownloadOutlined />} loading={exporting} onClick={handleExport}>
              {t("indir")}
            </Button>
            <ContextMenu selectedRows={selectedRows} refreshTableData={handleRefresh} onWorkOrderCreated={handleWorkOrderCreated} />
            <Button type="primary" onClick={applyFilters}>
              {t("uygula")}
            </Button>
          </Space>
        </div>

        <Spin spinning={loading}>
          <Table
            rowKey="clientKey"
            components={components}
            rowSelection={rowSelection}
            columns={filteredColumns}
            dataSource={rows}
            size="middle"
            bordered
            pagination={false}
            scroll={{ x: filteredColumns.reduce((sum, col) => sum + (Number(col.width) || 150), 0) + 60, y: "calc(100vh - 340px)" }}
            locale={{
              emptyText: t("veriYok", { defaultValue: "Veri Yok" }),
            }}
            rowClassName={() => "otomatik-is-emri-row"}
            onRow={(record) => ({
              onClick: (event) => {
                if (event.target?.closest?.(".ant-table-selection-column, .ant-checkbox-wrapper, .ant-checkbox, input, button, a")) {
                  return;
                }

                handleRowOpen(record);
              },
              style: { cursor: "pointer" },
            })}
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
      <EditDrawer
        selectedRow={editDrawer.data}
        onDrawerClose={() => setEditDrawer({ visible: false, data: null })}
        drawerVisible={editDrawer.visible}
        onRefresh={handleRefresh}
      />
      <WorkOrderEditDrawer
        selectedRow={workOrderDrawer.data}
        onDrawerClose={() => setWorkOrderDrawer({ visible: false, data: null })}
        drawerVisible={workOrderDrawer.visible}
        onRefresh={handleRefresh}
      />
      <FilterDrawer
        open={filterDrawerOpen}
        onClose={() => setFilterDrawerOpen(false)}
        onApply={handleApplyFiltersFromDrawer}
        draftFilters={draftFilters}
        onFilterChange={handleFilterChange}
      />
    </div>
  );
}

MainTable.propTypes = {
  hatirlaticiGrupId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  hatirlaticiSiraId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};
