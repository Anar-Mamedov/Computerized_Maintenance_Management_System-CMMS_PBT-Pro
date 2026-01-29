import React, { useMemo, useState, useEffect } from "react";

// -----------------------------
// Helpers (Yardımcı Fonksiyonlar)
// -----------------------------
const pad2 = (n) => String(n).padStart(2, "0");

const formatISODate = (d) => {
  const y = d.getFullYear();
  const m = pad2(d.getMonth() + 1);
  const day = pad2(d.getDate());
  return `${y}-${m}-${day}`;
};

const formatTRDate = (iso) => {
  if (!iso || !/^\d{4}-\d{2}-\d{2}$/.test(iso)) return "";
  return `${iso.slice(8, 10)}.${iso.slice(5, 7)}.${iso.slice(0, 4)}`;
};

const startOfWeekMonday = (d) => {
  const day = d.getDay();
  const diff = (day + 6) % 7; // Mon=0 ... Sun=6
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  x.setDate(x.getDate() - diff);
  return x;
};

const startOfMonth = (d) => {
  const x = new Date(d.getFullYear(), d.getMonth(), 1);
  x.setHours(0, 0, 0, 0);
  return x;
};

const endOfMonth = (d) => {
  const x = new Date(d.getFullYear(), d.getMonth() + 1, 0);
  x.setHours(0, 0, 0, 0);
  return x;
};

const addMonths = (d, delta) => {
  const x = new Date(d);
  const day = x.getDate();
  x.setDate(1);
  x.setMonth(x.getMonth() + delta);
  const lastDay = new Date(x.getFullYear(), x.getMonth() + 1, 0).getDate();
  x.setDate(Math.min(day, lastDay));
  x.setHours(0, 0, 0, 0);
  return x;
};

const startOfYear = (d) => {
  const x = new Date(d.getFullYear(), 0, 1);
  x.setHours(0, 0, 0, 0);
  return x;
};

const endOfYear = (d) => {
  const x = new Date(d.getFullYear(), 11, 31);
  x.setHours(0, 0, 0, 0);
  return x;
};

const getDurationRangeISO = (key) => {
  if (!key) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const toISO = (dt) => formatISODate(dt);

  if (key === "today") {
    const iso = toISO(today);
    return { startISO: iso, endISO: iso };
  }

  if (key === "yesterday") {
    const d = new Date(today);
    d.setDate(d.getDate() - 1);
    const iso = toISO(d);
    return { startISO: iso, endISO: iso };
  }

  if (key === "this_week") {
    const s = startOfWeekMonday(today);
    return { startISO: toISO(s), endISO: toISO(today) };
  }

  if (key === "last_week") {
    const thisW = startOfWeekMonday(today);
    const s = new Date(thisW);
    s.setDate(s.getDate() - 7);
    const e = new Date(thisW);
    e.setDate(e.getDate() - 1);
    return { startISO: toISO(s), endISO: toISO(e) };
  }

  if (key === "this_month") {
    const s = startOfMonth(today);
    return { startISO: toISO(s), endISO: toISO(today) };
  }

  if (key === "last_month") {
    const prev = addMonths(today, -1);
    const s = startOfMonth(prev);
    const e = endOfMonth(prev);
    return { startISO: toISO(s), endISO: toISO(e) };
  }

  if (key === "last_3_months") {
    const s = addMonths(today, -3);
    return { startISO: toISO(s), endISO: toISO(today) };
  }

  if (key === "last_6_months") {
    const s = addMonths(today, -6);
    return { startISO: toISO(s), endISO: toISO(today) };
  }

  if (key === "this_year") {
    const s = startOfYear(today);
    return { startISO: toISO(s), endISO: toISO(today) };
  }

  if (key === "last_year") {
    const prev = new Date(today.getFullYear() - 1, 0, 1);
    const s = startOfYear(prev);
    const e = endOfYear(prev);
    return { startISO: toISO(s), endISO: toISO(e) };
  }

  return null;
};

const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

const toMinutes = (hhmm) => {
  const m = /^([01]\d|2[0-3]):([0-5]\d)$/.exec(hhmm || "");
  if (!m) return null;
  return Number(m[1]) * 60 + Number(m[2]);
};

const diffHours = (start, end) => {
  const s = toMinutes(start);
  const e = toMinutes(end);
  if (s == null || e == null) return null;
  return Math.round(((Math.max(0, e - s)) / 60) * 10) / 10;
};

// -----------------------------
// Options (Sabit Veriler)
// -----------------------------
const SITES = [
  { label: "Ankara – Etlik", value: "ankara-etlik" },
  { label: "Bursa – Nilüfer", value: "bursa-nilufer" },
  { label: "İzmir – Aliağa", value: "izmir-aliaga" },
];

const STATUS = [
  { label: "Taslak", value: "draft" },
  { label: "Onay Bekliyor", value: "pending" },
  { label: "Onaylandı", value: "approved" },
  { label: "Reddedildi", value: "rejected" },
];

const DURATION = [
  { label: "Bugün", value: "today" },
  { label: "Dün", value: "yesterday" },
  { label: "Bu Hafta", value: "this_week" },
  { label: "Geçen Hafta", value: "last_week" },
  { label: "Bu Ay", value: "this_month" },
  { label: "Geçen Ay", value: "last_month" },
  { label: "Son 3 Ay", value: "last_3_months" },
  { label: "Son 6 Ay", value: "last_6_months" },
  { label: "Bu Yıl", value: "this_year" },
  { label: "Geçen Yıl", value: "last_year" },
];

const USERS = [
  { label: "Ahmet Yılmaz (Formen)", value: "ahmet" },
  { label: "Mert Kaya (Formen)", value: "mert" },
  { label: "Ayşe Demir (Şantiye Şefi)", value: "ayse" },
  { label: "Merkez Onay (Admin)", value: "admin" },
];

const MACHINES = ["EX-102", "EX-108", "KM-044", "KM-051", "DZ-011", "LD-023", "VN-005"];

const WORK_VALUES = [
  { label: "Kazı", value: "kazi" },
  { label: "Nakliye", value: "nakliye" },
  { label: "Dolgu", value: "dolgu" },
  { label: "Bekleme", value: "bekleme" },
  { label: "Servis/Bakım", value: "servis" },
];

const UNITS = [
  { label: "m³", value: "m3" },
  { label: "ton", value: "ton" },
  { label: "adet", value: "adet" },
  { label: "km", value: "km" },
  { label: "saat", value: "saat" },
];

// -----------------------------
// Demo Generator
// -----------------------------
const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

function pick(arr) { return arr[randInt(0, arr.length - 1)]; }

const computeRow = (r) => {
  const h = diffHours(r.start, r.end);
  const hours = h == null ? r.hours || 0 : h;
  const overtime = Math.max(0, Math.round((hours - 8) * 10) / 10);
  return { ...r, hours, overtime };
};

const computeTotals = (rows) => {
  let total = 0;
  let ot = 0;
  for (const r of rows) {
    total += Number(r.hours || 0);
    ot += Number(r.overtime || 0);
  }
  return {
    machineCount: rows.length,
    totalHours: Math.round(total * 10) / 10,
    overtime: Math.round(ot * 10) / 10,
  };
};

const generateDemoRows = (min = 1, max = 4) => {
  const count = randInt(min, max);
  const used = new Set();
  const rows = [];

  for (let i = 0; i < count; i++) {
    let m = pick(MACHINES);
    let guard = 0;
    while (used.has(m) && guard++ < 50) m = pick(MACHINES);
    used.add(m);

    const startH = randInt(7, 10);
    const startM = pick(["00", "15", "30", "45"]);
    const dur = pick([7.5, 8, 9, 9.5, 10]);
    const endMinutes = clamp(startH * 60 + Number(startM) + Math.round(dur * 60), 0, 23 * 60 + 59);
    const end = `${pad2(Math.floor(endMinutes / 60))}:${pad2(endMinutes % 60)}`;

    const base = {
      key: m,
      machineId: m,
      workType: pick(WORK_VALUES).value,
      start: `${pad2(startH)}:${startM}`,
      end,
      hours: dur,
      overtime: Math.max(0, Math.round((dur - 8) * 10) / 10),
      jobQty: "",
      unit: null,
      desc: "",
    };

    rows.push(computeRow(base));
  }

  return rows;
};

const generateDemoTimesheets = (count = 100) => {
  const today = formatISODate(new Date());
  return Array.from({ length: count }).map((_, i) => {
    const rows = generateDemoRows(1, 4);
    const totals = computeTotals(rows);

    return {
      id: `ts-${i}`,
      dateISO: today,
      site: pick(SITES).value,
      enteredBy: pick(USERS).value,
      status: pick(STATUS).value,
      updatedAt: `${today} 10:30`,
      note: "",
      rows,
      ...totals,
    };
  });
};

// -----------------------------
// UI Primitives (Text-base & Text-lg UPDATE)
// -----------------------------
function FieldLabel({ children }) {
  // text-xs -> text-sm ve font-semibold eklendi
  return <div className="mb-2 text-sm font-semibold text-gray-700">{children}</div>;
}

function SelectBox({ value, onChange, options, allLabel }) {
  // text-sm -> text-base, h-10 -> h-12 (daha büyük input)
  return (
    <select
      value={value || ""}
      onChange={(e) => onChange(e.target.value || null)}
      className="h-12 w-full rounded-lg border border-gray-300 bg-white px-4 text-base outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
    >
      <option value="">{allLabel || "Tümü"}</option>
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

function TextInput({ value, onChange, placeholder, className, type, disabled }) {
  // text-sm -> text-base, h-10 -> h-12
  return (
    <input
      type={type || "text"}
      value={value}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={
        "h-12 w-full rounded-lg border border-gray-300 px-4 text-base outline-none focus:ring-2 focus:ring-blue-500 transition-shadow " +
        (disabled ? "bg-gray-100 text-gray-700" : "bg-white") +
        " " +
        (className || "")
      }
    />
  );
}

function TimeInput({ value, onChange, placeholder }) {
  return (
    <input
      value={value}
      onChange={(e) => {
        const v = e.target.value;
        if (v === "" || /^\d{0,2}:?\d{0,2}$/.test(v)) onChange(v);
      }}
      onBlur={() => {
        if (!value) return;
        const m = /^([0-2]?\d):?([0-5]?\d)$/.exec(value);
        if (!m) return;
        const hh = clamp(Number(m[1]), 0, 23);
        const mm = clamp(Number(m[2] || 0), 0, 59);
        onChange(`${pad2(hh)}:${pad2(mm)}`);
      }}
      placeholder={placeholder || "08:00"}
      className="h-12 w-full rounded-lg border border-gray-300 bg-white px-4 text-base outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
    />
  );
}

function Pill({ children }) {
  // text-sm -> text-base, padding arttırıldı
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-1.5 text-base font-medium shadow-sm">
      {children}
    </span>
  );
}

function ChipDark({ children }) {
  // text-xs -> text-sm
  return <span className="inline-flex rounded-full bg-gray-900 px-3 py-1 text-sm font-medium text-white">{children}</span>;
}

function StatusChip({ status }) {
  const map = {
    draft: "bg-gray-100 text-gray-700 border-gray-200",
    pending: "bg-yellow-50 text-yellow-700 border-yellow-200",
    approved: "bg-green-50 text-green-700 border-green-200",
    rejected: "bg-red-50 text-red-700 border-red-200",
  };
  const label = STATUS.find((s) => s.value === status)?.label || status;
  // text-xs -> text-sm
  return (
    <span className={"rounded-full border px-3 py-1 text-sm font-medium " + (map[status] || "bg-gray-100 text-gray-700 border-gray-200")}>
      {label}
    </span>
  );
}

// -----------------------------
// KPI Section
// -----------------------------
function KpiSection({ items }) {
  const totals = useMemo(() => {
    const machineSet = new Set();
    let totalHours = 0;
    let overtime = 0;
    let approved = 0;
    let pending = 0;
    let rejected = 0;

    items.forEach((t) => {
      t.rows?.forEach((r) => {
        machineSet.add(r.machineId);
        totalHours += Number(r.hours || 0);
        overtime += Number(r.overtime || 0);
      });

      if (t.status === "approved") approved++;
      if (t.status === "pending") pending++;
      if (t.status === "rejected") rejected++;
    });

    const avgHours = machineSet.size > 0 ? totalHours / machineSet.size : 0;

    return {
      machines: machineSet.size,
      totalHours,
      overtime,
      approved,
      pending,
      rejected,
      avgHours,
    };
  }, [items]);

  return (
    <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="text-sm font-medium text-gray-500">Toplam Ekipman</div>
        <div className="mt-2 text-3xl font-bold text-gray-900">{totals.machines}</div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="text-sm font-medium text-gray-500">Toplam Saat</div>
        <div className="mt-2 text-3xl font-bold text-gray-900">{totals.totalHours.toFixed(1)}</div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="text-sm font-medium text-gray-500">Fazla Mesai</div>
        <div className="mt-2 text-3xl font-bold text-red-600">{totals.overtime.toFixed(1)}</div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="text-sm font-medium text-gray-500">Ort. Ekipman Saati</div>
        <div className="mt-2 text-3xl font-bold text-gray-900">{totals.avgHours.toFixed(1)}</div>
        <div className="mt-3 text-sm text-gray-500 font-medium">Onaylı: {totals.approved} · Bekleyen: {totals.pending} · Red: {totals.rejected}</div>
      </div>
    </div>
  );
}

// -----------------------------
// LIST VIEW
// -----------------------------
function TimesheetsList({ items, onOpen, onCreate }) {
  const [duration, setDuration] = useState("today");
  const [site, setSite] = useState(null);
  const [status, setStatus] = useState(null);
  const [query, setQuery] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((it) => {
      const range = getDurationRangeISO(duration);
      if (range) {
        if (it.dateISO < range.startISO || it.dateISO > range.endISO) return false;
      }
      if (site && it.site !== site) return false;
      if (status && it.status !== status) return false;
      if (q) {
        const hay = (it.id + " " + it.site + " " + it.enteredBy).toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [items, duration, site, status, query]);

  useEffect(() => {
    setCurrentPage(1);
  }, [duration, site, status, query]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filtered.slice(startIndex, startIndex + itemsPerPage);

  const siteLabel = (v) => SITES.find((s) => s.value === v)?.label || v;
  const userLabel = (v) => USERS.find((u) => u.value === v)?.label || v;

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((p) => p - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((p) => p + 1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full px-6 py-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Ekipman Puantajları</h1>
          <button className="h-12 rounded-lg bg-blue-600 px-6 text-base font-medium text-white hover:bg-blue-700 shadow-sm transition-colors" onClick={onCreate}>
            + Yeni Puantaj
          </button>
        </div>

        <KpiSection items={filtered} />

        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
          <div>
            <FieldLabel>Ara</FieldLabel>
            <TextInput value={query} onChange={setQuery} placeholder="Puantaj no / lokasyon / giren" />
          </div>

          <div>
            <FieldLabel>Süre</FieldLabel>
            <SelectBox value={duration} onChange={setDuration} options={DURATION} allLabel="Tümü" />
          </div>

          <div>
            <FieldLabel>Lokasyon</FieldLabel>
            <SelectBox value={site} onChange={setSite} options={SITES} />
          </div>

          <div>
            <FieldLabel>Durum</FieldLabel>
            <SelectBox value={status} onChange={setStatus} options={STATUS} />
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-base text-left text-gray-600">
              <thead className="bg-gray-50 text-gray-800 uppercase text-sm font-semibold tracking-wider border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4">Puantaj No</th>
                  <th className="px-6 py-4">Tarih</th>
                  <th className="px-6 py-4">Lokasyon</th>
                  <th className="px-6 py-4">Giren</th>
                  <th className="px-6 py-4 text-right">Ekipman</th>
                  <th className="px-6 py-4 text-right">Saat</th>
                  <th className="px-6 py-4">Durum</th>
                  <th className="px-6 py-4 text-right">Güncelleme</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {currentItems.map((it) => (
                  <tr key={it.id} className="hover:bg-blue-50 transition-colors">
                    <td
                      className="px-6 py-4 font-semibold text-blue-600 cursor-pointer"
                      onClick={() => onOpen(it)}
                    >
                      {it.id}
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">{formatTRDate(it.dateISO)}</td>
                    <td className="px-6 py-4">{siteLabel(it.site)}</td>
                    <td className="px-6 py-4">{userLabel(it.enteredBy)}</td>
                    <td className="px-6 py-4 text-right">{it.machineCount}</td>
                    <td className="px-6 py-4 text-right font-medium text-gray-900">{it.totalHours}</td>
                    <td className="px-6 py-4">
                      <StatusChip status={it.status} />
                    </td>
                    <td className="px-6 py-4 text-right text-sm text-gray-500">{it.updatedAt}</td>
                  </tr>
                ))}

                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center text-lg text-gray-500">
                      Kayıt bulunamadı
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {filtered.length > 0 && (
            <div className="flex items-center justify-between border-t border-gray-200 bg-gray-50 px-6 py-4">
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <span className="font-medium">Sayfa başına:</span>
                <select 
                  value={itemsPerPage} 
                  onChange={(e) => setItemsPerPage(Number(e.target.value))}
                  className="rounded border border-gray-300 bg-white py-1.5 px-3 text-sm outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
                <span>/ Toplam {filtered.length} kayıt</span>
              </div>
              
              <div className="flex items-center gap-2">
                <button 
                  onClick={handlePrevPage} 
                  disabled={currentPage === 1}
                  className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Önceki
                </button>
                <span className="mx-2 text-sm font-medium text-gray-900">
                  Sayfa {currentPage} / {totalPages}
                </span>
                <button 
                  onClick={handleNextPage} 
                  disabled={currentPage === totalPages}
                  className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Sonraki
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// -----------------------------
// DETAIL VIEW
// -----------------------------
function TimesheetDetail({ value, onBack, onChange }) {
  const siteLabel = (v) => SITES.find((s) => s.value === v)?.label || v;
  const userLabel = (v) => USERS.find((u) => u.value === v)?.label || v;

  const totals = useMemo(() => computeTotals(value.rows || []), [value.rows]);
  const workLabel = (v) => WORK_VALUES.find((w) => w.value === v)?.label || (v || "-");

  const workBreakdown = useMemo(() => {
    const map = new Map();
    for (const r of value.rows || []) {
      const key = r.workType || "(bos)";
      map.set(key, (map.get(key) || 0) + Number(r.hours || 0));
    }
    return Array.from(map.entries())
      .map(([k, h]) => ({ key: k, label: workLabel(k === "(bos)" ? null : k), hours: Math.round(h * 10) / 10 }))
      .sort((a, b) => b.hours - a.hours);
  }, [value.rows]);

  const existingMachines = useMemo(() => new Set((value.rows || []).map((r) => r.machineId)), [value.rows]);

  const addMachine = () => {
    const nextId = MACHINES.find((m) => !existingMachines.has(m));
    if (!nextId) return;
    const base = {
      key: nextId, machineId: nextId, workType: null, start: "", end: "", hours: 0, overtime: 0, jobQty: "", unit: null, desc: "",
    };
    const nextRows = [...value.rows, base];
    onChange({ ...value, rows: nextRows, ...computeTotals(nextRows) });
  };

  const updateRow = (key, patch) => {
    const nextRows = value.rows.map((r) => r.key === key ? computeRow({ ...r, ...patch }) : r);
    onChange({ ...value, rows: nextRows, ...computeTotals(nextRows) });
  };

  const removeRow = (key) => {
    const nextRows = value.rows.filter((r) => r.key !== key);
    onChange({ ...value, rows: nextRows, ...computeTotals(nextRows) });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="sticky top-0 z-20 border-b border-gray-200 bg-gray-50/95 backdrop-blur shadow-sm">
        <div className="w-full px-6 py-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-2xl font-bold text-gray-900">Puantaj Detayı</div>
              <div className="text-base text-gray-500">Günlük ekipman puantaj girişi</div>
            </div>
            <button onClick={onBack} className="h-10 rounded-lg border border-gray-300 bg-white px-5 text-sm font-medium hover:bg-gray-100 transition-colors">
              ← Listeye Dön
            </button>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-12">
            <div className="md:col-span-3">
              <FieldLabel>Tarih</FieldLabel>
              <TextInput type="date" value={value.dateISO} onChange={(v) => onChange({ ...value, dateISO: v })} />
            </div>
            <div className="md:col-span-6">
              <FieldLabel>Lokasyon</FieldLabel>
              <SelectBox value={value.site} onChange={(v) => onChange({ ...value, site: v })} options={SITES} allLabel="Seç" />
              <div className="mt-1 text-sm text-gray-500 font-medium">Seçili: {siteLabel(value.site)}</div>
            </div>
            <div className="md:col-span-3">
              <FieldLabel>Girişi yapan</FieldLabel>
              <TextInput value={userLabel(value.enteredBy)} onChange={() => {}} disabled />
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={addMachine}
              className="h-10 rounded-lg bg-blue-600 px-5 text-sm font-medium text-white hover:bg-blue-700 shadow-sm transition-colors"
            >
              + Ekipman Ekle
            </button>
            <Pill>Toplam Ekipman: <b>{totals.machineCount}</b></Pill>
            <Pill>Toplam Saat: <b>{totals.totalHours}</b></Pill>
            <Pill>Fazla Mesai: <b>{totals.overtime}</b></Pill>

            {workBreakdown.slice(0, 3).map((x) => (
              <Pill key={x.key}>{x.label}: <b>{x.hours}</b></Pill>
            ))}

            <div className="ml-auto text-sm text-gray-500 font-medium">İpucu: Başlangıç + Bitiş girince süre otomatik hesaplanır.</div>
          </div>
        </div>
      </div>

      <div className="w-full px-6 py-8">
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-[1200px] w-full text-base">
              <thead className="bg-gray-50 text-gray-700 text-sm font-bold uppercase border-b border-gray-200">
                <tr>
                  <th className="px-5 py-4 text-left">Ekipman</th>
                  <th className="px-5 py-4 text-left">Çalışma Türü</th>
                  <th className="px-5 py-4 text-left">Başlangıç</th>
                  <th className="px-5 py-4 text-left">Bitiş</th>
                  <th className="px-5 py-4 text-left">Süre (saat)</th>
                  <th className="px-5 py-4 text-left">Fazla Mesai</th>
                  <th className="px-5 py-4 text-left">İş Miktarı</th>
                  <th className="px-5 py-4 text-left">Birim</th>
                  <th className="px-5 py-4 text-left">Açıklama</th>
                  <th className="px-5 py-4 text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {value.rows.map((r) => (
                  <tr key={r.key} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4 font-bold text-gray-900">{r.machineId}</td>
                    <td className="px-5 py-4">
                      <SelectBox value={r.workType} onChange={(v) => updateRow(r.key, { workType: v })} options={WORK_VALUES} allLabel="Seç" />
                    </td>
                    <td className="px-5 py-4">
                      <TimeInput value={r.start} onChange={(v) => updateRow(r.key, { start: v })} placeholder="08:00" />
                    </td>
                    <td className="px-5 py-4">
                      <TimeInput value={r.end} onChange={(v) => updateRow(r.key, { end: v })} placeholder="17:30" />
                    </td>
                    <td className="px-5 py-4">
                      <TextInput
                        value={String(r.hours ?? "")}
                        onChange={(raw) => {
                          if (raw === "" || /^\d{0,3}(?:[\.,]\d{0,2})?$/.test(raw)) {
                            const num = Number(String(raw).replace(",", "."));
                            updateRow(r.key, { hours: Number.isFinite(num) ? num : 0 });
                          }
                        }}
                        className="w-28 text-center font-medium"
                        placeholder="0"
                      />
                    </td>
                    <td className="px-5 py-4">
                      {r.overtime > 0 ? <ChipDark>{r.overtime}</ChipDark> : <span className="text-gray-300">–</span>}
                    </td>
                    <td className="px-5 py-4">
                      <TextInput value={r.jobQty} onChange={(v) => updateRow(r.key, { jobQty: v })} placeholder="" className="w-36" />
                    </td>
                    <td className="px-5 py-4">
                      <SelectBox value={r.unit} onChange={(v) => updateRow(r.key, { unit: v })} options={UNITS} allLabel="Seç" />
                    </td>
                    <td className="px-5 py-4">
                      <TextInput value={r.desc} onChange={(v) => updateRow(r.key, { desc: v })} placeholder="" />
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button className="text-sm font-medium text-red-600 hover:text-red-800 hover:underline" onClick={() => removeRow(r.key)}>
                        Sil
                      </button>
                    </td>
                  </tr>
                ))}

                {value.rows.length === 0 && (
                  <tr>
                    <td colSpan={10} className="px-6 py-12 text-center text-lg text-gray-500">
                      Henüz ekipman eklenmedi.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="border-t border-gray-200 bg-gray-50 p-6">
            <div className="text-base font-semibold text-gray-900">Not</div>
            <div className="mt-2">
              <textarea
                value={value.note || ""}
                onChange={(e) => onChange({ ...value, note: e.target.value })}
                placeholder="Kısa not (değişiklik uyarısını test etmek için)"
                className="min-h-[120px] w-full rounded-lg border border-gray-300 bg-white p-4 text-base outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
              />
            </div>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-4 text-sm text-gray-600">
              <div className="font-medium">
                Özet: Ekipman <b className="text-gray-900">{totals.machineCount}</b> · Saat <b className="text-gray-900">{totals.totalHours}</b> · FM <b className="text-gray-900">{totals.overtime}</b>
              </div>
              <div className="font-medium">
                Durum: <b className="text-gray-900">{STATUS.find((s) => s.value === value.status)?.label || value.status}</b>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// -----------------------------
// MAIN COMPONENT (ROOT)
// -----------------------------
export default function DailyMachineTimesheet() {
  const [view, setView] = useState("list");
  const [data, setData] = useState(() => generateDemoTimesheets(100));
  const [draft, setDraft] = useState(null);

  const handleOpen = (item) => {
    setDraft(JSON.parse(JSON.stringify(item)));
    setView("detail");
  };

  const handleCreate = () => {
    const today = formatISODate(new Date());
    const newItem = {
      id: `new-${Date.now()}`, dateISO: today, site: "", enteredBy: "admin", status: "draft", updatedAt: `${today} 12:00`, note: "", rows: [], machineCount: 0, totalHours: 0, overtime: 0,
    };
    setDraft(newItem);
    setView("detail");
  };

  const handleBack = () => { setView("list"); setDraft(null); };

  const handleChange = (nextVal) => {
    setDraft(nextVal);
    setData((prev) => {
      const idx = prev.findIndex((p) => p.id === nextVal.id);
      return idx === -1 ? [nextVal, ...prev] : prev.map((p, i) => i === idx ? nextVal : p);
    });
  };

  if (view === "detail" && draft) {
    return <TimesheetDetail value={draft} onBack={handleBack} onChange={handleChange} />;
  }

  return <TimesheetsList items={data} onOpen={handleOpen} onCreate={handleCreate} />;
}