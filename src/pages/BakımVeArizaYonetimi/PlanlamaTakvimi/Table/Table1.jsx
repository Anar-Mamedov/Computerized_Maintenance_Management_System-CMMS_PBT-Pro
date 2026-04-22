// Table1.jsx

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button, Input, Popover, Spin, Typography, message } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { SiMicrosoftexcel } from "react-icons/si";
import * as XLSX from "xlsx";
import AxiosInstance from "../../../../api/http";
import Filters from "./filter/Filters";
import { useFormContext } from "react-hook-form";
import ContextMenu from "../components/ContextMenu/ContextMenu";
import dayjs from "dayjs";
import "dayjs/locale/tr";
import weekOfYear from "dayjs/plugin/weekOfYear";
import "./MainTable.css";

const { Text } = Typography;

dayjs.locale("tr");
dayjs.extend(weekOfYear);

// Statü renkleri (tr label → hex)
const STATUSES = [
  { key: "Planlanan", color: "#60a5fa" },
  { key: "Yaklaşan", color: "#facc15" },
  { key: "Süresi Geçmiş", color: "#ef4444" },
  { key: "Yapılmadı", color: "#fb923c" },
  { key: "Devam Eden", color: "#14b8a6" },
  { key: "Zamanında Yapılan", color: "#22c55e" },
  { key: "Gecikmeli Yapılan", color: "#f43f5e" },
  { key: "İptal Edilen", color: "#9ca3af" },
];

const STATUS_COLOR = STATUSES.reduce((acc, s) => {
  acc[s.key] = s.color;
  return acc;
}, {});

const DAY_SHORT = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];

// Layout constants (virtualization için sabit yükseklikler)
const LEFT_COL_W = 420;
const DAY_COL_W = 44;
const H_MONTH = 34;
const H_WEEK = 28;
const H_DAY = 40;
const HEADER_H = H_MONTH + H_WEEK + H_DAY;
const PARENT_ROW_H = 40;
const CHILD_ROW_H = 44;
const OVERSCAN = 8;

// "PBK0184 - F1 - ŞERİTLEME ..." -> { kod, ad }
const splitBakimTanim = (tanim) => {
  if (!tanim) return { kod: "", ad: "" };
  const idx = tanim.indexOf(" - ");
  if (idx === -1) return { kod: "", ad: tanim };
  return { kod: tanim.slice(0, idx).trim(), ad: tanim.slice(idx + 3).trim() };
};

// Hover popover içeriği
const renderWoPopover = ({ bakimTanim, machineValue, statusText, dateLabel }) => {
  const status = STATUSES.find((s) => s.key === statusText);
  const { kod, ad } = splitBakimTanim(bakimTanim);
  const title = ad || bakimTanim || "-";

  return (
    <div className="ptk-wo-popover">
      <div className="ptk-wo-header">
        <div className="ptk-wo-title-area">
          <div className="ptk-wo-label">İŞ EMRİ</div>
          <div className="ptk-wo-title" title={title}>
            {title}
          </div>
        </div>
        {status && (
          <span className="ptk-wo-status-badge">
            <span className="ptk-wo-status-dot" style={{ backgroundColor: status.color }} />
            <span>{statusText}</span>
          </span>
        )}
      </div>

      <div className="ptk-wo-subrow">
        <div className="ptk-wo-sub-item">
          <span className="ptk-wo-muted">Tarih</span>
          <span className="ptk-wo-strong">{dateLabel}</span>
        </div>
        {kod && <span className="ptk-wo-chip">{kod}</span>}
      </div>

      <div className="ptk-wo-grid">
        <div className="ptk-wo-field">
          <div className="ptk-wo-muted">Makine</div>
          <div className="ptk-wo-value" title={machineValue}>
            {machineValue || "-"}
          </div>
        </div>
        <div className="ptk-wo-field">
          <div className="ptk-wo-muted">Bakım Kodu</div>
          <div className="ptk-wo-value">{kod || "-"}</div>
        </div>
        <div className="ptk-wo-field ptk-wo-field-wide">
          <div className="ptk-wo-muted">Bakım</div>
          <div className="ptk-wo-value" title={bakimTanim}>
            {bakimTanim || "-"}
          </div>
        </div>
      </div>
    </div>
  );
};

// Tarih aralığından kolon/ay/hafta gruplarını üretir
const buildDateGroups = (startDate, endDate) => {
  if (!startDate || !endDate) return { dayCols: [], monthGroups: [], weekGroups: [] };

  const dayCols = [];
  const start = dayjs(startDate);
  const end = dayjs(endDate);
  let cursor = start;
  let idx = 0;
  while (cursor.isBefore(end) || cursor.isSame(end, "day")) {
    dayCols.push({
      idx,
      dt: cursor,
      dataIndex: cursor.format("YYYY-MM-DD"),
      dateLabel: cursor.format("DD.MM.YYYY"),
      dayShort: DAY_SHORT[(cursor.day() + 6) % 7],
      dayNum: cursor.format("DD"),
      week: cursor.week(),
      monthLabel: cursor.format("MMMM YYYY"),
    });
    cursor = cursor.add(1, "day");
    idx++;
  }

  const monthGroups = [];
  for (let i = 0; i < dayCols.length; ) {
    const m = dayCols[i].monthLabel;
    let j = i;
    while (j < dayCols.length && dayCols[j].monthLabel === m) j++;
    monthGroups.push({ label: m, colSpan: j - i, startCol: i });
    i = j;
  }

  const weekGroups = [];
  for (let i = 0; i < dayCols.length; ) {
    const w = dayCols[i].week;
    let j = i;
    while (j < dayCols.length && dayCols[j].week === w) j++;
    weekGroups.push({ week: w, colSpan: j - i, startCol: i });
    i = j;
  }

  return { dayCols, monthGroups, weekGroups };
};

const MainTable = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [data, setData] = useState([]);
  const [checkedState, setCheckedState] = useState({});
  const [selectedCells, setSelectedCells] = useState([]);
  const [loading, setLoading] = useState(true);
  const [body, setBody] = useState({ keyword: "", filters: {} });
  const [expandedKeys, setExpandedKeys] = useState({});
  const [search, setSearch] = useState("");
  const [selectedStatusKeys, setSelectedStatusKeys] = useState(() => STATUSES.map((s) => s.key));
  const [xlsxLoading, setXlsxLoading] = useState(false);

  // Virtualization
  const outerRef = useRef(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [viewportH, setViewportH] = useState(600);

  const toggleExpand = useCallback((key) => {
    setExpandedKeys((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const toggleStatus = useCallback((key) => {
    setSelectedStatusKeys((prev) => {
      const onlyThis = prev.length === 1 && prev[0] === key;
      return onlyThis ? STATUSES.map((s) => s.key) : [key];
    });
  }, []);

  const resetStatuses = useCallback(() => {
    setSelectedStatusKeys(STATUSES.map((s) => s.key));
  }, []);

  const { dayCols, monthGroups, weekGroups } = useMemo(
    () => buildDateGroups(startDate, endDate),
    [startDate, endDate]
  );

  useFormContext();

  useEffect(() => {
    fetchEquipmentData(body);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [body]);

  const fetchEquipmentData = async (requestBody) => {
    const { filters = {} } = requestBody || {};
    setLoading(true);

    if (Object.keys(filters).length === 0) {
      setLoading(false);
      return;
    }

    try {
      const response = await AxiosInstance.post("PeriyodikBakimPlanlamaTakvimi", filters);
      if (response) {
        const responseObject = JSON.parse(response);

        const grouped = responseObject.reduce((acc, item) => {
          const makineKey = item.MAKINE_ID ? item.MAKINE_ID.toString() : `makine-${item.MAKINE_TANIM}`;
          if (!acc[makineKey]) {
            acc[makineKey] = {
              key: makineKey,
              machine: item.MAKINE_TANIM,
              isParent: true,
              children: [],
            };
          }
          const child = {
            key: `${item.MAKINE_ID}-${item.PBAKIM_ID}`,
            machine: item.BAKIM_TANIM,
            parentKey: makineKey,
            isParent: false,
          };
          const startD = dayjs(startDate);
          const endD = dayjs(endDate);
          const daysDiff = endD.diff(startD, "day");
          let cursor = startD;
          for (let i = 1; i <= daysDiff + 1; i++) {
            child[cursor.format("YYYY-MM-DD")] = item[i];
            cursor = cursor.add(1, "day");
          }
          acc[makineKey].children.push(child);
          return acc;
        }, {});

        const newData = Object.values(grouped);
        setData(newData);

        const initialExpanded = {};
        newData.forEach((n) => (initialExpanded[n.key] = true));
        setExpandedKeys(initialExpanded);

        setLoading(false);
      } else {
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      if (navigator.onLine) {
        message.error("Hata Mesajı: " + error.message);
      } else {
        message.error("Internet Bağlantısı Mevcut Değil.");
      }
    }
  };

  const handleBodyChange = useCallback((type, newBody) => {
    setStartDate(newBody.baslamaTarihi);
    setEndDate(newBody.bitisTarihi);
    setBody((state) => ({ ...state, [type]: newBody }));
  }, []);

  const filteredData = useMemo(() => {
    if (!search.trim()) return data;
    const q = search.trim().toLowerCase();
    return data
      .map((m) => {
        const machineMatch = (m.machine || "").toLowerCase().includes(q);
        const childMatches = (m.children || []).filter((c) => (c.machine || "").toLowerCase().includes(q));
        if (machineMatch) return m;
        if (childMatches.length) return { ...m, children: childMatches };
        return null;
      })
      .filter(Boolean);
  }, [data, search]);

  const flattenedData = useMemo(() => {
    const result = [];
    filteredData.forEach((node) => {
      result.push({ ...node, depth: 0 });
      if (node.isParent && expandedKeys[node.key] && node.children?.length) {
        node.children.forEach((c) => result.push({ ...c, depth: 1 }));
      }
    });
    return result;
  }, [filteredData, expandedKeys]);

  // Satır ofsetleri (virtualization için)
  const rowOffsets = useMemo(() => {
    const offsets = [0];
    let acc = 0;
    for (let i = 0; i < flattenedData.length; i++) {
      acc += flattenedData[i].isParent ? PARENT_ROW_H : CHILD_ROW_H;
      offsets.push(acc);
    }
    return offsets;
  }, [flattenedData]);

  const totalBodyHeight = rowOffsets[rowOffsets.length - 1] || 0;
  const totalWidth = LEFT_COL_W + dayCols.length * DAY_COL_W;

  // Görünür satır aralığı (ikili arama)
  const { startIdx, endIdx } = useMemo(() => {
    const count = flattenedData.length;
    if (!count) return { startIdx: 0, endIdx: 0 };

    // startIdx: offsets[i+1] > scrollTop olan ilk i
    let lo = 0;
    let hi = count - 1;
    let start = 0;
    while (lo <= hi) {
      const mid = (lo + hi) >> 1;
      if (rowOffsets[mid + 1] > scrollTop) {
        start = mid;
        hi = mid - 1;
      } else {
        lo = mid + 1;
      }
    }

    // endIdx: offsets[i] >= scrollTop+viewportH olan ilk i
    const bottom = scrollTop + viewportH;
    lo = 0;
    hi = count;
    let end = count;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (rowOffsets[mid] >= bottom) {
        end = mid;
        hi = mid;
      } else {
        lo = mid + 1;
      }
    }

    return {
      startIdx: Math.max(0, start - OVERSCAN),
      endIdx: Math.min(count, end + OVERSCAN),
    };
  }, [flattenedData.length, rowOffsets, scrollTop, viewportH]);

  // Scroll takibi
  useEffect(() => {
    const el = outerRef.current;
    if (!el) return undefined;
    const onScroll = () => setScrollTop(el.scrollTop);
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  // Viewport yüksekliği (resize)
  useEffect(() => {
    const el = outerRef.current;
    if (!el) return undefined;
    const measure = () => {
      if (outerRef.current) setViewportH(outerRef.current.clientHeight);
    };
    measure();
    if (typeof ResizeObserver !== "undefined") {
      const ro = new ResizeObserver(measure);
      ro.observe(el);
      return () => ro.disconnect();
    }
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  // Veri/filtre değişince scroll başa al (yanlış pencere render etmemek için)
  useEffect(() => {
    if (outerRef.current) outerRef.current.scrollTop = 0;
    setScrollTop(0);
  }, [flattenedData.length]);

  const handleCellClick = useCallback(
    (cellKey, text, record, column) => {
      setCheckedState((prev) => {
        const isSelected = prev[cellKey] || false;
        const next = { ...prev, [cellKey]: !isSelected };

        setSelectedCells((prevCells) => {
          const parts = record.key ? record.key.split("-") : [];
          const makineID = parts[0] || null;
          const bakimID = parts[1] || null;
          const parentRecord = data.find((item) => item.key === record.parentKey);
          const machineValue = record.isParent ? record.machine : parentRecord?.machine || "Kayıt bulunamadı";
          const date = dayjs(column.dataIndex, "YYYY-MM-DD").format("DD.MM.YYYY");
          const cellInfo = {
            key: cellKey,
            machineValue,
            recordMachine: record.machine,
            status: text,
            date,
            makineID,
            bakimID,
          };
          return isSelected ? prevCells.filter((c) => c.key !== cellKey) : [...prevCells, cellInfo];
        });

        return next;
      });
    },
    [data]
  );

  const handleDownloadXLSX = async () => {
    try {
      setXlsxLoading(true);

      const xlsxData = data.flatMap((item) => {
        if (!item.isParent || !item.children) return [];
        return item.children.map((child) => {
          const row = {
            Makine: item.machine || "",
            Bakım: child.machine || "",
          };
          dayCols.forEach((c) => {
            row[c.dateLabel] = child[c.dataIndex] || "";
          });
          return row;
        });
      });

      if (!xlsxData.length) {
        message.warning("İndirilecek veri bulunamadı.");
        setXlsxLoading(false);
        return;
      }

      const worksheet = XLSX.utils.json_to_sheet(xlsxData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Planlama Takvimi");

      worksheet["!cols"] = [
        { wpx: 220 },
        { wpx: 260 },
        ...dayCols.map(() => ({ wpx: 85 })),
      ];

      const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });
      const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", "planlama-takvimi.xlsx");
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setXlsxLoading(false);
    } catch (error) {
      setXlsxLoading(false);
      console.error("XLSX indirme hatası:", error);
      if (navigator.onLine) {
        message.error("Hata Mesajı: " + error.message);
      } else {
        message.error("Internet Bağlantısı Mevcut Değil.");
      }
    }
  };

  const allStatusActive = selectedStatusKeys.length === STATUSES.length;

  // Görünür satır indeksleri
  const visibleIndexes = [];
  for (let i = startIdx; i < endIdx; i++) visibleIndexes.push(i);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 170px)" }}>
      {/* Üst kontrol alanı */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          marginBottom: "12px",
          gap: "10px",
          padding: "0 5px",
        }}
      >
        <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          <Filters onChange={handleBodyChange} />
          <Input
            prefix={<SearchOutlined style={{ color: "#9ca3af" }} />}
            placeholder="Makine veya bakım ara..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            allowClear
            style={{ width: 240 }}
          />
        </div>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <ContextMenu selectedCells={selectedCells} />
          <Button
            style={{ display: "flex", alignItems: "center" }}
            onClick={handleDownloadXLSX}
            loading={xlsxLoading}
            disabled={!data || data.length === 0}
            icon={<SiMicrosoftexcel />}
          >
            Excel'e Aktar
          </Button>
        </div>
      </div>

      {/* Durum legend chipleri */}
      <div className="ptk-legend">
        {STATUSES.map((s) => {
          const active = selectedStatusKeys.includes(s.key);
          return (
            <button
              key={s.key}
              type="button"
              className={`ptk-legend-chip ${active ? "is-active" : "is-muted"}`}
              onClick={() => toggleStatus(s.key)}
              title={
                active && selectedStatusKeys.length === 1
                  ? "Tekrar tıklarsan filtreyi kaldır"
                  : "Tıkla: sadece bu durumu göster"
              }
            >
              <span className="ptk-legend-dot" style={{ backgroundColor: s.color }} />
              <span className="ptk-legend-label">{s.key}</span>
            </button>
          );
        })}
        {!allStatusActive && (
          <button type="button" className="ptk-legend-reset" onClick={resetStatuses}>
            Tümünü göster
          </button>
        )}
      </div>

      {/* Tablo (virtualized) */}
      <div className="ptk-table-wrapper">
        <Spin spinning={loading}>
          <div ref={outerRef} className="ptk-v-outer">
            {dayCols.length > 0 && (
              <div className="ptk-v-inner" style={{ width: totalWidth, minHeight: HEADER_H + Math.max(totalBodyHeight, 80) }}>
                {/* Header — CSS grid ile 3 satır, sticky top + sticky left-top */}
                <div
                  className="ptk-v-header"
                  style={{
                    gridTemplateColumns: `${LEFT_COL_W}px repeat(${dayCols.length}, ${DAY_COL_W}px)`,
                    gridTemplateRows: `${H_MONTH}px ${H_WEEK}px ${H_DAY}px`,
                  }}
                >
                  <div className="ptk-v-header-left" style={{ gridRow: "1 / 4", gridColumn: "1 / 2" }}>
                    Makine / Bakım
                  </div>
                  {monthGroups.map((g, i) => (
                    <div
                      key={`m-${i}`}
                      className="ptk-v-th-month"
                      style={{
                        gridRow: "1 / 2",
                        gridColumn: `${2 + g.startCol} / ${2 + g.startCol + g.colSpan}`,
                      }}
                    >
                      {g.label}
                    </div>
                  ))}
                  {weekGroups.map((g, i) => (
                    <div
                      key={`w-${i}`}
                      className="ptk-v-th-week"
                      style={{
                        gridRow: "2 / 3",
                        gridColumn: `${2 + g.startCol} / ${2 + g.startCol + g.colSpan}`,
                      }}
                    >
                      {g.week}. Hafta
                    </div>
                  ))}
                  {dayCols.map((c, i) => (
                    <div
                      key={`d-${c.idx}`}
                      className="ptk-v-th-day"
                      style={{ gridRow: "3 / 4", gridColumn: `${2 + i} / ${3 + i}` }}
                    >
                      <div className="ptk-th-day-name">{c.dayShort}</div>
                      <div className="ptk-th-day-num">{c.dayNum}</div>
                    </div>
                  ))}
                </div>

                {/* Body — absolute positioned virtualized rows */}
                <div
                  className="ptk-v-body"
                  style={{ height: Math.max(totalBodyHeight, 80), width: totalWidth }}
                >
                  {visibleIndexes.map((i) => {
                    const rec = flattenedData[i];
                    if (!rec) return null;
                    const top = rowOffsets[i];
                    const height = rec.isParent ? PARENT_ROW_H : CHILD_ROW_H;

                    if (rec.isParent) {
                      const isOpen = !!expandedKeys[rec.key];
                      return (
                        <div
                          key={rec.key}
                          className="ptk-v-row ptk-v-parent"
                          style={{ top, height, width: totalWidth }}
                        >
                          <div
                            className="ptk-v-left ptk-v-parent-left"
                            style={{ width: LEFT_COL_W, height }}
                          >
                            <button
                              type="button"
                              className="ptk-expand-btn"
                              onClick={() => toggleExpand(rec.key)}
                              aria-label={isOpen ? "Daralt" : "Genişlet"}
                            >
                              {isOpen ? "−" : "+"}
                            </button>
                            <Text className="ptk-parent-title">{rec.machine}</Text>
                          </div>
                          <div
                            className="ptk-v-parent-filler"
                            style={{ width: totalWidth - LEFT_COL_W, height }}
                          />
                        </div>
                      );
                    }

                    const parentRecord = data.find((x) => x.key === rec.parentKey);
                    const machineValue = parentRecord?.machine || "";

                    return (
                      <div
                        key={rec.key}
                        className="ptk-v-row ptk-v-child"
                        style={{ top, height, width: totalWidth }}
                      >
                        <div
                          className="ptk-v-left ptk-v-child-left"
                          style={{ width: LEFT_COL_W, height }}
                        >
                          <span className="ptk-child-indent" />
                          <Text className="ptk-child-title">{rec.machine}</Text>
                        </div>
                        {dayCols.map((c) => {
                          const text = rec[c.dataIndex];
                          const visible = text && selectedStatusKeys.includes(text);
                          const cellKey = `${rec.key}-${c.dataIndex}`;
                          const checked = !!checkedState[cellKey];

                          return (
                            <div
                              key={c.idx}
                              className={`ptk-v-cell ${visible ? "has-event" : ""} ${checked ? "is-checked" : ""}`}
                              style={{ width: DAY_COL_W, height }}
                              title={visible ? undefined : c.dateLabel}
                              onClick={() => {
                                if (visible) handleCellClick(cellKey, text, rec, { dataIndex: c.dataIndex });
                              }}
                            >
                              {visible && (
                                <Popover
                                  trigger="hover"
                                  placement="right"
                                  mouseEnterDelay={0.1}
                                  overlayClassName="ptk-wo-popover-overlay"
                                  content={renderWoPopover({
                                    bakimTanim: rec.machine,
                                    machineValue,
                                    statusText: text,
                                    dateLabel: c.dateLabel,
                                  })}
                                >
                                  <span
                                    className="ptk-dot"
                                    style={{ backgroundColor: STATUS_COLOR[text] || "#9ca3af" }}
                                  >
                                    <span className="ptk-dot-inner" />
                                  </span>
                                </Popover>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}

                  {!flattenedData.length && !loading && (
                    <div className="ptk-empty-inline">Kayıt bulunamadı.</div>
                  )}
                </div>
              </div>
            )}
            {dayCols.length === 0 && !loading && (
              <div className="ptk-empty-inline" style={{ position: "static", padding: 28 }}>
                Lütfen filtrelerden bir tarih aralığı seçin.
              </div>
            )}
          </div>
        </Spin>
      </div>
    </div>
  );
};

export default MainTable;
