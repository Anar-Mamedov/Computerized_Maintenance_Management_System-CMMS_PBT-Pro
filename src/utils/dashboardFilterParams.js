// Dashboard widget'larindan liste ekranlarina tasinan filtreler URL query string uzerinden aktarilir.
// Bu dosya hem yazma (Dashboard tarafi) hem okuma (hedef liste ekranlari) icin ortak sozlugu tutar.

import { useMemo } from "react";
import { useLocation } from "react-router-dom";

/** Liste API'lerinin ID dizisi bekledigi filtre alanlari. */
export const ID_LIST_KEYS = [
  "lokasyonlar",
  "atolyeler",
  "makineler",
  "durumlar",
  "isemritipleri",
  "prosedurtipleri",
  "onaydurumlari",
  "nedenler",
  "personeller",
  "makinetip",
  "kategori",
];

/** Liste API'lerinin true/false bekledigi filtre alanlari. */
export const BOOLEAN_KEYS = ["arizali", "durusuDevamEden"];

/** Query string'de tasinan tarih alanlari (liste API'sinde customfilters altina yazilir). */
export const DATE_KEYS = ["startDate", "endDate"];

/** Body yerine query parametresi olarak giden sayisal alanlar. */
export const NUMBER_KEYS = ["isClose", "isAktif"];

/** Metin olarak tasinan alanlar. */
export const TEXT_KEYS = ["durum"];

/** URL'de kullanilan tum dashboard filtre anahtarlari. */
export const DASHBOARD_FILTER_PARAM_KEYS = [...ID_LIST_KEYS, ...BOOLEAN_KEYS, ...DATE_KEYS, ...NUMBER_KEYS, ...TEXT_KEYS];

// Filtre gövdesine girmeyip ayrica ele alinan anahtarlar.
const RESERVED_KEYS = [...NUMBER_KEYS, "pageSize"];

/** "1,5" veya "1" seklindeki degeri sayisal ID dizisine cevirir. */
const parseIdList = (raw) => {
  if (raw === null || raw === undefined || raw === "") return [];

  return String(raw)
    .split(",")
    .map((part) => Number(String(part).trim()))
    .filter((value) => Number.isFinite(value));
};

/** "true" / "1" degerlerini boolean'a cevirir. */
const parseBoolean = (raw) => {
  const normalized = String(raw).trim().toLowerCase();
  return normalized === "true" || normalized === "1";
};

/** Bilinmeyen alanlarin degerinden tipini cikarir: dizi, boolean, sayi veya metin. */
const inferValue = (raw) => {
  const value = String(raw).trim();

  if (value.includes(",")) {
    const parts = value.split(",").map((part) => part.trim()).filter(Boolean);
    return parts.every((part) => Number.isFinite(Number(part))) ? parts.map(Number) : parts;
  }
  if (value === "true") return true;
  if (value === "false") return false;
  if (Number.isFinite(Number(value))) return Number(value);

  return value;
};

/** Sadece 0 ve 1 degerlerini kabul eden sayisal ayristirici. */
const parseBinaryNumber = (raw) => {
  const value = Number(String(raw).trim());
  return value === 0 || value === 1 ? value : null;
};

/**
 * URL query string'ini liste API'lerinin bekledigi filtre yapisina cevirir.
 * Donen `filters` dogrudan POST body'sine merge edilebilir; `isClose`/`isAktif`
 * ise ilgili ekranlarda query parametresi olarak kullanilir.
 */
export function readDashboardFilterParams(search) {
  const params = new URLSearchParams(search || "");
  const filters = {};
  const customfilters = {};

  // Query string'i Dashboard tarafi urettigi icin pageSize disindaki her anahtar bir filtredir.
  // Bilinen anahtarlar tipine gore, tanimadiklarimiz ise degerinden cikarilan tiple aktarilir;
  // boylece Dashboard API'si ileride yeni bir filtre dondurdugunde kod degisikligi gerekmez.
  params.forEach((rawValue, key) => {
    if (RESERVED_KEYS.includes(key)) return;

    const value = String(rawValue).trim();
    if (!value) return;

    if (ID_LIST_KEYS.includes(key)) {
      const ids = parseIdList(value);
      if (ids.length) filters[key] = ids;
      return;
    }

    if (BOOLEAN_KEYS.includes(key)) {
      if (parseBoolean(value)) filters[key] = true;
      return;
    }

    if (TEXT_KEYS.includes(key)) {
      filters[key] = value;
      return;
    }

    if (DATE_KEYS.includes(key)) {
      customfilters[key] = value;
      return;
    }

    filters[key] = inferValue(value);
  });

  if (Object.keys(customfilters).length) {
    filters.customfilters = customfilters;
  }

  const isClose = params.has("isClose") ? parseBinaryNumber(params.get("isClose")) : null;
  const isAktif = params.has("isAktif") ? parseBinaryNumber(params.get("isAktif")) : null;
  return {
    // pageSize tek basina filtre sayilmaz; sadece filtre varsa ekran dashboard modunda kabul edilir.
    active: Object.keys(filters).length > 0 || isClose !== null || isAktif !== null,
    filters,
    isClose,
    isAktif,
  };
}

/**
 * Dashboard filtrelerini ekranin kendi filtrelerinin altina serer.
 * Kullanici ekranda ayni alan icin secim yaptiginda ekranin secimi kazanir.
 */
export function mergeDashboardFilters(pageFilters = {}, dashboardFilters = {}) {
  const merged = { ...dashboardFilters, ...(pageFilters || {}) };

  Object.keys(dashboardFilters || {}).forEach((key) => {
    const pageValue = (pageFilters || {})[key];
    const isEmptyPageValue =
      pageValue === undefined ||
      pageValue === null ||
      pageValue === "" ||
      (Array.isArray(pageValue) && pageValue.length === 0) ||
      (typeof pageValue === "object" && !Array.isArray(pageValue) && Object.keys(pageValue).length === 0);

    if (isEmptyPageValue) {
      merged[key] = dashboardFilters[key];
    }
  });

  return merged;
}

const EMPTY_RESULT = { active: false, filters: {}, isClose: null, isAktif: null };

/**
 * Bazi liste ekranlari ayni filtreyi farkli alan adiyla bekliyor.
 * Ornek: is emri "atolyeler" ve "onaydurumlari" beklerken,
 * makine listesi tekil "atolye", is talebi ise "onayDurumlari" bekliyor.
 */
const SCREEN_FIELD_ALIASES = {
  "/makine": { atolyeler: "atolye" },
  "/isTalepleri": { onaydurumlari: "onayDurumlari" },
};

/**
 * /isEmri1 ekraninin kendi tarih filtresi "customfilter" (tekil) anahtarini uretiyor,
 * is talebi ekrani ise "customfilters" (cogul). Tekil anahtar yalnizca onu kullanan ekrana
 * eklenir; kullanmayan ekrana gonderilmesi sonucu bozabiliyor.
 */
const TEKIL_CUSTOMFILTER_KULLANAN_EKRANLAR = ["/isEmri1"];

/** Kanonik alan adlarini hedef ekranin bekledigi adlara cevirir. */
const applyScreenAliases = (filters, route) => {
  const aliases = SCREEN_FIELD_ALIASES[route];
  if (!aliases) return filters;

  const renamed = {};
  Object.entries(filters).forEach(([key, value]) => {
    renamed[aliases[key] || key] = value;
  });

  return renamed;
};

/**
 * Aktif route'un query string'inden dashboard filtrelerini okur.
 *
 * Liste tablolari baska ekranlarda secim modali olarak da kullanildigi icin
 * `expectedPath` verildiginde filtreler yalnizca o route'un kendi sayfasinda uygulanir;
 * boylece modal icindeki listeler yanlislikla dashboard filtresi almaz.
 */
export function useDashboardFilterParams(expectedPath) {
  const { pathname, search } = useLocation();

  return useMemo(() => {
    if (expectedPath && pathname !== expectedPath) return EMPTY_RESULT;

    const okunan = readDashboardFilterParams(search);
    const filters = applyScreenAliases(okunan.filters, expectedPath);

    if (filters.customfilters && TEKIL_CUSTOMFILTER_KULLANAN_EKRANLAR.includes(expectedPath)) {
      filters.customfilter = filters.customfilters;
    }

    return { ...okunan, filters };
  }, [expectedPath, pathname, search]);
}
