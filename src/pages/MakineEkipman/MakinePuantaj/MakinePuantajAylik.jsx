import React, { useEffect, useMemo, useRef, useState } from "react";

// O-MEGA Makine Puantajları — Tek Dosya React Mockup (Canvas uyumlu)
// PC davranışları:
// - Sol tık: Değer Seçimi (tek hücre)
// - Uzun bas (0.4sn): Satır seçimi (range sürükle)
// - Gün başlığı uzun bas: Sütun seçimi (range sürükle)
// - Sağ tık: Detay (SADECE dolu hücre)
// - Boş hücre: Detay açılmaz
// - TOPLAM satırı sticky ve kalın çerçeveli

const WORK_VALUES = [
  { key: "X", label: "TAMGÜN", hours: 12, order: 1, tone: "ok" },
  { key: "Y", label: "YARIM GÜN", hours: 5, order: 2, tone: "ok" },
  { key: "CE", label: "ÇEYREK", hours: 2, order: 3, tone: "warn" },
  { key: "-", label: "ÇALIŞMADI", hours: 0, order: 4, tone: "muted" },
  { key: "A", label: "ARIZA", hours: 0, order: 5, tone: "warn" },
  { key: "S", label: "SEFER", hours: 0, order: 6, tone: "info" },
  { key: "IZ", label: "İZİNLİ", hours: 0, order: 7, tone: "info" },
];

const MACHINES = [
  {
    id: "m1",
    code: "EXC-023",
    name: "Ekskavatör 23",
    type: "Ekskavatör",
    plate: "16 ABC 123",
    site: "Santiye A",
    status: "Aktif",
  },
  {
    id: "m2",
    code: "LDR-011",
    name: "Yükleyici 11",
    type: "Yükleyici",
    plate: "34 XYZ 908",
    site: "Santiye A",
    status: "Aktif",
  },
  {
    id: "m3",
    code: "DMP-004",
    name: "Damper 4",
    type: "Kamyon",
    plate: "06 KLM 404",
    site: "Santiye B",
    status: "Aktif",
  },
];

const INITIAL_GRID = {
  m1: { 1: "X", 2: "X", 3: "Y", 4: "A", 5: "X" },
  m2: { 1: "X", 2: "-", 3: "X", 4: "X", 5: "CE" },
  m3: { 1: "-", 2: "A", 3: "A", 4: "X", 5: "Y" },
};

function cn(...xs) {
  return xs.filter(Boolean).join(" ");
}

function pillTone(tone) {
  switch (tone) {
    case "ok":
      return "bg-emerald-50 text-emerald-800 ring-emerald-200 font-bold";
    case "warn":
      return "bg-amber-50 text-amber-900 ring-amber-200 font-bold";
    case "info":
      return "bg-sky-50 text-sky-800 ring-sky-200 font-bold";
    default:
      return "bg-slate-100 text-slate-700 ring-slate-200";
  }
}

function pad2(n) {
  return String(n).padStart(2, "0");
}

function ymd(y, m, d) {
  return `${y}-${pad2(m)}-${pad2(d)}`;
}

function trWeekday(y, m, d) {
  try {
    return new Intl.DateTimeFormat("tr-TR", { weekday: "long" }).format(new Date(y, m - 1, d));
  } catch {
    return "";
  }
}

function ModalShell({ title, children, onClose }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl ring-1 ring-slate-200"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="text-lg font-bold text-slate-800">{title}</div>
          <button
            className="h-10 w-10 rounded-xl ring-1 ring-slate-200 hover:bg-slate-50 flex items-center justify-center text-xl"
            onClick={onClose}
            aria-label="Kapat"
            title="Kapat"
            type="button"
          >
            <span className="text-slate-700">×</span>
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

function runSanityChecks() {
  const keys = WORK_VALUES.map((w) => w.key);
  const uniq = new Set(keys);
  console.assert(uniq.size === keys.length, "WORK_VALUES keys unique olmalı");

  const mids = MACHINES.map((m) => m.id);
  const um = new Set(mids);
  console.assert(um.size === mids.length, "MACHINES id unique olmalı");

  console.assert(typeof INITIAL_GRID === "object", "INITIAL_GRID object olmalı");
}

export default function App() {
  const monthNamesTR = [
    "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
    "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık",
  ];

  const [viewYear, setViewYear] = useState(2026);
  const [viewMonth, setViewMonth] = useState(1);

  const [q, setQ] = useState("");
  const [siteFilter, setSiteFilter] = useState("");
  const [shiftFilter, setShiftFilter] = useState("Gündüz");
  const [selectedDate, setSelectedDate] = useState("2026-01-01");

  const [monthPickerOpen, setMonthPickerOpen] = useState(false);
  const [yearCursor, setYearCursor] = useState(2026);
  const monthPickerRef = useRef(null);

  const [grid, setGrid] = useState(INITIAL_GRID);

  const [selectionMode, setSelectionMode] = useState("none");
  const [sel, setSel] = useState(null);
  const [picker, setPicker] = useState(null);

  const [detail, setDetail] = useState(null);

  const valuesSorted = useMemo(() => [...WORK_VALUES].sort((a, b) => a.order - b.order), []);

  const daysInMonth = useMemo(() => new Date(viewYear, viewMonth, 0).getDate(), [viewYear, viewMonth]);
  const monthLabel = `${monthNamesTR[Math.max(1, Math.min(12, viewMonth)) - 1]} ${viewYear}`;

  useEffect(() => {
    runSanityChecks();
  }, []);

  useEffect(() => {
    setSelectedDate(`${viewYear}-${pad2(viewMonth)}-01`);
  }, [viewYear, viewMonth]);

  useEffect(() => {
    if (!monthPickerOpen) return;
    const onDown = (e) => {
      const el = monthPickerRef.current;
      if (!el) return;
      if (e.target instanceof Node && !el.contains(e.target)) setMonthPickerOpen(false);
    };
    const onKey = (e) => {
      if (e.key === "Escape") setMonthPickerOpen(false);
    };
    window.addEventListener("mousedown", onDown);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [monthPickerOpen]);

  const filteredMachines = useMemo(() => {
    const t = q.trim().toLowerCase();
    return MACHINES.filter((m) => {
      const siteOk = !siteFilter || m.site.toLowerCase().includes(siteFilter.toLowerCase());
      if (!siteOk) return false;
      if (!t) return true;
      return `${m.code} ${m.name} ${m.type} ${m.site} ${m.plate || ""}`.toLowerCase().includes(t);
    });
  }, [q, siteFilter]);

  const totalsByRowHours = useMemo(() => {
    const out = {};
    filteredMachines.forEach((m) => {
      let sum = 0;
      for (let d = 1; d <= daysInMonth; d++) {
        const v = (grid[m.id] || {})[d] || "";
        const w = valuesSorted.find((x) => x.key === v);
        if (w) sum += w.hours;
      }
      out[m.id] = sum;
    });
    return out;
  }, [filteredMachines, grid, daysInMonth, valuesSorted]);

  const rowValueCounts = useMemo(() => {
    const out = {};
    filteredMachines.forEach((m) => {
      const counts = {};
      valuesSorted.forEach((w) => (counts[w.key] = 0));
      for (let d = 1; d <= daysInMonth; d++) {
        const v = (grid[m.id] || {})[d] || "";
        if (v && counts[v] !== undefined) counts[v] += 1;
      }
      out[m.id] = counts;
    });
    return out;
  }, [filteredMachines, grid, daysInMonth, valuesSorted]);

  const columnValueTotals = useMemo(() => {
    const totals = {};
    valuesSorted.forEach((w) => (totals[w.key] = 0));
    filteredMachines.forEach((m) => {
      for (let d = 1; d <= daysInMonth; d++) {
        const v = (grid[m.id] || {})[d] || "";
        if (v && totals[v] !== undefined) totals[v] += 1;
      }
    });
    return totals;
  }, [filteredMachines, grid, daysInMonth, valuesSorted]);

  const totalHoursAll = useMemo(
    () => Object.values(totalsByRowHours).reduce((a, b) => a + b, 0),
    [totalsByRowHours]
  );

  function closePicker() {
    setPicker(null);
  }

  function closeSelection() {
    setSelectionMode("none");
    setSel(null);
  }

  function closeDetail() {
    setDetail(null);
  }

  function setMonthDelta(delta) {
    let y = viewYear;
    let m = viewMonth + delta;
    while (m < 1) {
      m += 12;
      y -= 1;
    }
    while (m > 12) {
      m -= 12;
      y += 1;
    }
    setViewYear(y);
    setViewMonth(m);
    closePicker();
    closeSelection();
    closeDetail();
  }

  function normalizeSel(s) {
    const a = Math.min(s.aDay, s.bDay);
    const b = Math.max(s.aDay, s.bDay);
    return { ...s, aDay: a, bDay: b };
  }

  function applyValueToSelection(value) {
    if (!sel || selectionMode === "none") return;
    const s = normalizeSel(sel);
    setGrid((prev) => {
      const next = { ...prev };
      if (s.mode === "row" && s.machineId) {
        const row = { ...(next[s.machineId] || {}) };
        for (let d = s.aDay; d <= s.bDay; d++) row[d] = value;
        next[s.machineId] = row;
      } else if (s.mode === "col") {
        filteredMachines.forEach((m) => {
          const row = { ...(next[m.id] || {}) };
          for (let d = s.aDay; d <= s.bDay; d++) row[d] = value;
          next[m.id] = row;
        });
      }
      return next;
    });
    closePicker();
    closeSelection();
  }

  function openDetail(machine, day) {
    const value = (grid[machine.id] || {})[day] || "";
    if (!value) return;
    setDetail({ machine, day, value });
  }

  // Long press state
  const isMouseDown = useRef(false);
  const lpTimer = useRef(null);
  const lpFired = useRef(false);
  const activePress = useRef(null);
  const suppressMouseUp = useRef(false);

  function cancelLongPressTimer() {
    if (lpTimer.current) {
      window.clearTimeout(lpTimer.current);
      lpTimer.current = null;
    }
  }

  function resetLongPress() {
    cancelLongPressTimer();
    lpFired.current = false;
    activePress.current = null;
    isMouseDown.current = false;
  }

  function armLongPress(ctx) {
    cancelLongPressTimer();
    lpFired.current = false;
    activePress.current = ctx;
    lpTimer.current = window.setTimeout(() => {
      if (!isMouseDown.current || !activePress.current) return;
      const c = activePress.current;
      lpFired.current = true;
      setSelectionMode(c.mode);
      setSel({ mode: c.mode, machineId: c.machineId, aDay: c.day, bDay: c.day });
    }, 400);
  }

  function updateSelectionDrag(day) {
    if (!lpFired.current || !sel) return;
    setSel((prev) => {
      if (!prev) return prev;
      return { ...prev, bDay: day };
    });
  }

  function openPickerAt(x, y) {
    setPicker({ x, y });
  }

  function getSingleSelectedCell() {
    if (!sel || selectionMode === "none") return null;
    const s = normalizeSel(sel);
    if (s.mode !== "row" || !s.machineId) return null;
    if (s.aDay !== s.bDay) return null;
    const machine =
      filteredMachines.find((m) => m.id === s.machineId) || MACHINES.find((m) => m.id === s.machineId);
    if (!machine) return null;
    const value = (grid[machine.id] || {})[s.aDay] || "";
    if (!value) return null;
    return { machine, day: s.aDay, value };
  }

  function onHeaderMouseDown(e, day) {
    if (e.button === 2) return;
    isMouseDown.current = true;
    armLongPress({ mode: "col", day });
  }

  function onHeaderMouseUp(e) {
    isMouseDown.current = false;
    if (lpFired.current && sel) {
      openPickerAt(e.clientX ?? 0, e.clientY ?? 0);
      resetLongPress();
      return;
    }
    cancelLongPressTimer();
    lpFired.current = false;
  }

  function cellInSelection(machineId, day) {
    if (!sel || selectionMode === "none") return false;
    const s = normalizeSel(sel);
    if (s.mode === "row") {
      if (s.machineId !== machineId) return false;
      return day >= s.aDay && day <= s.bDay;
    }
    if (s.mode === "col") {
      return day >= s.aDay && day <= s.bDay;
    }
    return false;
  }

  const pickerUi = picker ? (
    <div className="fixed z-50" style={{ left: picker.x + 8, top: picker.y + 8 }} role="dialog" aria-label="Değer Seçimi">
      <div className="w-[300px] rounded-2xl bg-white shadow-xl ring-1 ring-slate-200">
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
          <div className="text-sm font-bold text-slate-800">Değer Seçimi</div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className={cn(
                "h-8 px-3 rounded-lg ring-1 text-xs font-bold transition-colors",
                getSingleSelectedCell()
                  ? "bg-white text-slate-700 ring-slate-200 hover:bg-slate-50"
                  : "bg-slate-100 text-slate-400 ring-slate-200 cursor-not-allowed"
              )}
              title={getSingleSelectedCell() ? "Detayı Aç" : "Detay yalnızca tek ve dolu hücre seçiliyken açılır"}
              disabled={!getSingleSelectedCell()}
              onClick={() => {
                const one = getSingleSelectedCell();
                if (!one) return;
                closePicker();
                closeSelection();
                resetLongPress();
                openDetail(one.machine, one.day);
              }}
            >
              Detay
            </button>
            <button
              type="button"
              className="h-8 w-8 rounded-lg ring-1 ring-slate-200 hover:bg-slate-50 flex items-center justify-center text-lg"
              onClick={() => {
                closePicker();
                closeSelection();
              }}
              aria-label="Kapat"
              title="Kapat"
            >
              ×
            </button>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-2 p-3">
          {valuesSorted.map((w) => (
            <button
              key={w.key}
              type="button"
              className={cn(
                "h-12 rounded-xl ring-1 text-base font-bold transition-transform",
                pillTone(w.tone),
                "hover:shadow-md active:scale-[0.98]"
              )}
              title={w.label}
              onClick={() => applyValueToSelection(w.key)}
            >
              {w.key}
            </button>
          ))}
        </div>
      </div>
    </div>
  ) : null;

  const detailUi = detail ? (
    <ModalShell
      title={`Detay • ${detail.machine.code} — ${ymd(viewYear, viewMonth, detail.day)} (${trWeekday(
        viewYear,
        viewMonth,
        detail.day
      )})`}
      onClose={closeDetail}
    >
      <div className="space-y-6">
        <div className="rounded-2xl bg-slate-50 p-5 ring-1 ring-slate-200">
          <div className="text-base font-bold text-slate-900 mb-3">Özet</div>
          <div className="grid grid-cols-2 gap-4 text-base">
            <div className="text-slate-600">Şantiye</div>
            <div className="font-semibold text-slate-900">{detail.machine.site}</div>
            <div className="text-slate-600">Vardiya</div>
            <div className="font-semibold text-slate-900">{shiftFilter}</div>
            <div className="text-slate-600">Değer</div>
            <div className="font-semibold text-slate-900">{detail.value}</div>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-5 ring-1 ring-slate-200">
          <div className="text-base font-bold text-slate-900 mb-2">Yapılan İş / Olay</div>
          <div className="text-base text-slate-600 mb-4">
            Bu alan gerçek üründe iş emri, yapılan iş türü, miktar/birim, lokasyon, operatör, notlar vb. detayları içerir.
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-slate-50 p-3 ring-1 ring-slate-200">
              <div className="text-xs text-slate-500 font-semibold uppercase">İş</div>
              <div className="text-base font-bold text-slate-900">Kazı</div>
            </div>
            <div className="rounded-xl bg-slate-50 p-3 ring-1 ring-slate-200">
              <div className="text-xs text-slate-500 font-semibold uppercase">Miktar</div>
              <div className="text-base font-bold text-slate-900">120 m³</div>
            </div>
            <div className="rounded-xl bg-slate-50 p-3 ring-1 ring-slate-200">
              <div className="text-xs text-slate-500 font-semibold uppercase">Lokasyon</div>
              <div className="text-base font-bold text-slate-900">Blok-3</div>
            </div>
            <div className="rounded-xl bg-slate-50 p-3 ring-1 ring-slate-200">
              <div className="text-xs text-slate-500 font-semibold uppercase">Operatör</div>
              <div className="text-base font-bold text-slate-900">Ahmet Y.</div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            className="h-12 px-6 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-colors"
            onClick={closeDetail}
          >
            Kapat
          </button>
        </div>
      </div>
    </ModalShell>
  ) : null;

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      {/* Full width container: max-w-none */}
      <div className="w-full">
        <div className="rounded-3xl bg-white shadow-sm ring-1 ring-slate-200">
          <div className="p-6">
            <div className="flex items-center justify-between gap-4">
              <div className="inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-2 ring-1 ring-slate-200">
                <span className="text-sm font-bold text-slate-500">O-MEGA</span>
                <span className="text-sm text-slate-300">/</span>
                <span className="text-sm text-slate-500">Operasyon</span>
                <span className="text-sm text-slate-300">/</span>
                <span className="text-sm font-bold text-slate-900">Ekipman Puantajları</span>
              </div>

              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-6 py-3 text-base font-bold text-white shadow-md hover:bg-slate-800 transition-all active:scale-95"
              >
                <span className="text-xl leading-none">＋</span>
                Yeni Kayıt
              </button>
            </div>

            <div className="mt-6">
              <div className="text-4xl font-bold tracking-tight text-slate-900">Ekipman Puantajları</div>
              <div className="mt-2 text-base text-slate-500">
                Şantiyede günlük ekipman çalışmalarını hızlı gir, gerektiğinde detaylandır. (Tasarım mockup)
              </div>
            </div>

            <div className="mt-8 rounded-3xl bg-slate-50 p-6 ring-1 ring-slate-200">
              <div className="flex flex-wrap items-center gap-4">
                <div className="relative flex-1 min-w-[300px] order-1">
                  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg">🔎</span>
                  <input
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="Ekipman / plaka / operatör ara"
                    className="h-14 w-full rounded-2xl bg-white pl-12 pr-4 text-base font-medium ring-1 ring-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-400 transition-shadow"
                  />
                </div>

                <div className="inline-flex items-center gap-3 rounded-2xl bg-white px-4 py-3 ring-1 ring-slate-200 order-2 h-14">
                  <span className="text-sm font-bold text-slate-500">Şantiye:</span>
                  <select
                    value={siteFilter}
                    onChange={(e) => setSiteFilter(e.target.value)}
                    className="text-base font-bold text-slate-900 outline-none bg-transparent"
                  >
                    <option value="">Tüm Şantiyeler</option>
                    <option value="Santiye A">Şantiye A (Merkez)</option>
                    <option value="Santiye B">Şantiye B</option>
                  </select>
                </div>

                <div className="relative order-3 h-14" ref={monthPickerRef}>
                  <button
                    type="button"
                    className="h-full inline-flex items-center gap-3 rounded-2xl bg-white px-4 ring-1 ring-slate-200 hover:bg-slate-50 transition-colors"
                    onClick={() => {
                      setYearCursor(viewYear);
                      setMonthPickerOpen((v) => !v);
                    }}
                    aria-haspopup="dialog"
                    aria-expanded={monthPickerOpen}
                    title="Ay/Yıl Seç"
                  >
                    <span className="text-2xl">🗓️</span>
                    <span className="text-sm font-bold text-slate-500">Dönem:</span>
                    <span className="text-lg font-bold text-slate-900">{monthLabel}</span>
                    <span className="text-slate-400">▾</span>
                  </button>

                  {monthPickerOpen ? (
                    <div className="absolute right-0 mt-2 w-[400px] rounded-3xl bg-white shadow-2xl ring-1 ring-slate-200 p-5 z-40">
                      <div className="flex items-center justify-between mb-4">
                        <button
                          type="button"
                          className="h-10 w-10 rounded-2xl ring-1 ring-slate-200 hover:bg-slate-50 flex items-center justify-center text-lg font-bold"
                          title="Önceki Yıl"
                          onClick={() => setYearCursor((y) => y - 1)}
                        >
                          ‹
                        </button>
                        <div className="text-xl font-bold text-slate-900">{yearCursor}</div>
                        <button
                          type="button"
                          className="h-10 w-10 rounded-2xl ring-1 ring-slate-200 hover:bg-slate-50 flex items-center justify-center text-lg font-bold"
                          title="Sonraki Yıl"
                          onClick={() => setYearCursor((y) => y + 1)}
                        >
                          ›
                        </button>
                      </div>

                      <div className="grid grid-cols-3 gap-3">
                        {monthNamesTR.map((mn, idx) => {
                          const mm = idx + 1;
                          const active = yearCursor === viewYear && mm === viewMonth;
                          return (
                            <button
                              key={mn}
                              type="button"
                              className={cn(
                                "h-12 rounded-2xl ring-1 text-base font-bold transition-all",
                                active
                                  ? "bg-slate-900 text-white ring-slate-900 shadow-md"
                                  : "bg-white text-slate-800 ring-slate-200 hover:bg-slate-50"
                              )}
                              onClick={() => {
                                setViewYear(yearCursor);
                                setViewMonth(mm);
                                setMonthPickerOpen(false);
                                closePicker();
                                closeSelection();
                                closeDetail();
                              }}
                            >
                              {mn}
                            </button>
                          );
                        })}
                      </div>

                      <div className="mt-5 flex items-center justify-between gap-3">
                        <button
                          type="button"
                          className="h-10 px-4 rounded-2xl ring-1 ring-slate-200 hover:bg-slate-50 text-sm font-bold text-slate-700"
                          onClick={() => {
                            setYearCursor(new Date().getFullYear());
                          }}
                          title="Bu yıla git"
                        >
                          Bu Yıl
                        </button>
                        <button
                          type="button"
                          className="h-10 px-4 rounded-2xl bg-slate-900 text-white hover:bg-slate-800 text-sm font-bold"
                          onClick={() => {
                            setYearCursor(viewYear);
                            setMonthPickerOpen(false);
                          }}
                          title="Kapat"
                        >
                          Kapat
                        </button>
                      </div>
                    </div>
                  ) : null}
                </div>

                <div className="inline-flex items-center gap-3 rounded-2xl bg-white px-4 py-3 ring-1 ring-slate-200 order-4 h-14">
                  <span className="text-sm font-bold text-slate-500">Vardiya:</span>
                  <select
                    value={shiftFilter}
                    onChange={(e) => setShiftFilter(e.target.value)}
                    className="text-base font-bold text-slate-900 outline-none bg-transparent"
                  >
                    <option value="Gündüz">Gündüz</option>
                    <option value="Gece">Gece</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-100" />

          <div className="p-6">
            <div className="flex items-center justify-center gap-4 mb-6">
              <button
                type="button"
                className="h-12 w-12 rounded-2xl ring-1 ring-slate-200 hover:bg-slate-50 flex items-center justify-center text-2xl font-bold text-slate-600"
                title="Önceki Ay"
                onClick={() => setMonthDelta(-1)}
              >
                ‹
              </button>
              <div className="text-xl font-bold text-slate-900 min-w-[180px] text-center">{monthLabel}</div>
              <button
                type="button"
                className="h-12 w-12 rounded-2xl ring-1 ring-slate-200 hover:bg-slate-50 flex items-center justify-center text-2xl font-bold text-slate-600"
                title="Sonraki Ay"
                onClick={() => setMonthDelta(1)}
              >
                ›
              </button>
            </div>

            <div className="mt-4 overflow-auto rounded-3xl ring-1 ring-slate-200 bg-white shadow-sm">
              <table className="w-full border-collapse min-w-full">
                <thead>
                  <tr className="bg-white h-14">
                    <th className="sticky left-0 z-20 bg-white px-6 py-3 min-w-[300px] text-left border-b border-slate-100">
                      <div className="text-sm font-bold text-slate-500 uppercase tracking-wide">Ekipman Kodu / Tanımı</div>
                    </th>
                    {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
                      const inSel =
                        selectionMode !== "none" &&
                        sel &&
                        sel.mode === "col" &&
                        day >= normalizeSel(sel).aDay &&
                        day <= normalizeSel(sel).bDay;
                      return (
                        <th
                          key={day}
                          className={cn(
                            "px-1 py-3 text-center text-sm font-bold sticky top-0 z-10 bg-white border-l border-b border-slate-100 min-w-[44px]",
                            inSel && "bg-slate-100"
                          )}
                          onMouseDown={(e) => onHeaderMouseDown(e, day)}
                          onMouseEnter={() => updateSelectionDrag(day)}
                          onMouseUp={onHeaderMouseUp}
                          title={`${ymd(viewYear, viewMonth, day)} • ${trWeekday(viewYear, viewMonth, day)}`}
                        >
                          {day}
                        </th>
                      );
                    })}
                    <th className="px-4 py-3 text-center text-sm font-bold sticky top-0 z-10 bg-white border-l border-b border-slate-100 min-w-[60px]">
                      Saat
                    </th>
                    {valuesSorted.map((w) => (
                      <th
                        key={`h-${w.key}`}
                        className={cn(
                          "px-2 py-3 text-center text-sm font-bold sticky top-0 z-10 bg-white border-l border-b border-slate-100 min-w-[50px]",
                          pillTone(w.tone)
                        )}
                        title={`${w.label} adedi`}
                      >
                        {w.key}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredMachines.map((m) => (
                    <tr key={m.id} className="border-t border-slate-100 h-16 hover:bg-slate-50/50 transition-colors">
                      <td className="sticky left-0 z-10 bg-white px-6 py-2 min-w-[300px] border-r border-slate-100 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]">
                        <div className="flex items-center justify-between gap-3">
                          <div className="min-w-0">
                            <div className="text-base font-bold text-slate-900 truncate">
                              {m.code} · {m.name}
                            </div>
                            <div className="text-sm text-slate-500 truncate mt-0.5">
                              {m.type} {m.plate ? ` · ${m.plate}` : ""}
                            </div>
                          </div>
                          <span
                            className={cn(
                              "shrink-0 rounded-lg px-2.5 py-1 text-xs font-bold ring-1 uppercase tracking-wider",
                              m.status === "Aktif"
                                ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
                                : "bg-slate-100 text-slate-600 ring-slate-200"
                            )}
                          >
                            {m.status}
                          </span>
                        </div>
                      </td>
                      {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
                        const v = (grid[m.id] || {})[day] || "";
                        const selected = cellInSelection(m.id, day);
                        const isEmpty = !v;
                        const tone = valuesSorted.find((x) => x.key === v)?.tone || "muted";
                        return (
                          <td
                            key={`${m.id}-${day}`}
                            className={cn(
                              "px-1 py-1 text-center border-l border-slate-100 cursor-pointer select-none",
                              selected && "bg-blue-50 ring-inset ring-2 ring-blue-200",
                              isEmpty ? "text-slate-300" : "text-slate-900"
                            )}
                            onMouseDown={(e) => {
                              if (e.button === 2) return;
                              if (suppressMouseUp.current) return;
                              isMouseDown.current = true;
                              armLongPress({ mode: "row", machineId: m.id, day });
                            }}
                            onMouseEnter={() => updateSelectionDrag(day)}
                            onMouseUp={(e) => {
                              if (suppressMouseUp.current) {
                                suppressMouseUp.current = false;
                                resetLongPress();
                                return;
                              }
                              isMouseDown.current = false;
                              if (lpFired.current && sel) {
                                openPickerAt(e.clientX ?? 0, e.clientY ?? 0);
                                resetLongPress();
                                return;
                              }
                              cancelLongPressTimer();
                              if (!lpFired.current) {
                                setSelectionMode("row");
                                setSel({ mode: "row", machineId: m.id, aDay: day, bDay: day });
                                openPickerAt(e.clientX ?? 0, e.clientY ?? 0);
                              }
                              lpFired.current = false;
                            }}
                            onContextMenu={(e) => {
                              const vv = (grid[m.id] || {})[day] || "";
                              if (!vv) return;
                              e.preventDefault();
                              e.stopPropagation();
                              suppressMouseUp.current = true;
                              closePicker();
                              closeSelection();
                              resetLongPress();
                              openDetail(m, day);
                              return;
                            }}
                            title={`${ymd(viewYear, viewMonth, day)} • ${trWeekday(viewYear, viewMonth, day)}`}
                          >
                            <div
                              className={cn(
                                "h-14 w-full rounded-lg flex items-center justify-center text-base font-bold transition-transform active:scale-95",
                                v ? pillTone(tone) : "hover:bg-slate-100 text-slate-300"
                              )}
                            >
                              {v || "·"}
                            </div>
                          </td>
                        );
                      })}
                      <td className="px-3 py-2 text-center border-l border-slate-100 bg-slate-50/30">
                        <span className="text-base font-bold text-slate-900">{totalsByRowHours[m.id] || 0}</span>
                      </td>
                      {valuesSorted.map((w) => (
                        <td
                          key={`${m.id}-c-${w.key}`}
                          className={cn("px-2 py-2 text-center border-l border-slate-100 opacity-90", pillTone(w.tone))}
                        >
                          <span className="text-base font-bold">{rowValueCounts[m.id]?.[w.key] ?? 0}</span>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t-4 border-slate-300 h-16">
                    <td className="sticky left-0 bottom-0 z-30 bg-slate-100 px-6 py-3 min-w-[300px] text-base font-bold text-slate-900 border-r-2 border-slate-300 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                      TOPLAM
                    </td>
                    {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
                      let filled = 0;
                      filteredMachines.forEach((m) => {
                        const v = (grid[m.id] || {})[day] || "";
                        if (v) filled += 1;
                      });
                      return (
                        <td
                          key={`t-${day}`}
                          className="sticky bottom-0 z-20 bg-slate-100 px-1 py-3 text-center border-l border-slate-200"
                          title={`Bu gün dolu kayıt adedi: ${filled}`}
                        >
                          <span className="text-sm font-bold text-slate-700">{filled}</span>
                        </td>
                      );
                    })}
                    <td className="sticky bottom-0 z-20 bg-slate-200 px-3 py-3 text-center border-l border-slate-300">
                      <span className="text-base font-bold text-slate-900">{totalHoursAll}</span>
                    </td>
                    {valuesSorted.map((w) => (
                      <td
                        key={`tot-${w.key}`}
                        className={cn("sticky bottom-0 z-20 px-2 py-3 text-center border-l border-slate-300", pillTone(w.tone))}
                        title={`${w.label} toplam adedi`}
                      >
                        <span className="text-base font-bold">{columnValueTotals[w.key] ?? 0}</span>
                      </td>
                    ))}
                  </tr>
                </tfoot>
              </table>
            </div>

            <div className="mt-4 flex items-center gap-2 text-sm text-slate-500 font-medium">
              <span className="text-xl">💡</span>
              İpucu: Satır seçimi için hücrede basılı tut (0.4 sn) → sürükle → Değer Seçimi. Sütun seçimi için gün başlığında basılı tut.
            </div>
          </div>
        </div>
      </div>

      {pickerUi}
      {detailUi}
    </div>
  );
}