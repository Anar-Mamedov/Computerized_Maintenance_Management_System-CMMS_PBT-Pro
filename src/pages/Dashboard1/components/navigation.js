// API'lerin döndürdüğü TargetPage değerlerinin uygulama route'larına eşlenmesi.
const TARGET_PAGE_ROUTES = {
  "is-talebi": "/isTalepleri",
  "is-emri": "/isEmri1",
  stok: "/malzemeTanimi",
  "periyodik-bakim": "/periyodikBakimlar",
  "bakim-takvimi": "/planlamaTakvimi",
  makine: "/makine",
};

// Hatırlatıcılar ayrı bir sayfa değil, sağdaki panel üzerinden açılır.
const openHatirlaticiPanel = () => {
  localStorage.setItem("hatirlatici_panel_open", "true");
  window.dispatchEvent(new Event("hatirlatici_panel_open_changed"));
};

const buildSearchParams = (filterParams, globalFilters) => {
  const params = new URLSearchParams();

  Object.entries(filterParams || {}).forEach(([key, value]) => {
    if (value === null || value === undefined || value === "") return;
    params.set(key, Array.isArray(value) ? value.join(",") : String(value));
  });

  if (globalFilters?.LokasyonIds?.length) {
    params.set("lokasyonIds", globalFilters.LokasyonIds.join(","));
  }
  if (globalFilters?.AtolyeIds?.length) {
    params.set("atolyeIds", globalFilters.AtolyeIds.join(","));
  }
  if (globalFilters?.EkipmanIds?.length) {
    params.set("ekipmanIds", globalFilters.EkipmanIds.join(","));
  }
  if (globalFilters?.BaslangicTarihi) {
    params.set("baslangicTarihi", globalFilters.BaslangicTarihi);
  }
  if (globalFilters?.BitisTarihi) {
    params.set("bitisTarihi", globalFilters.BitisTarihi);
  }

  return params.toString();
};

export const isNavigableTarget = (targetPage) => targetPage === "hatirlatici" || Boolean(TARGET_PAGE_ROUTES[targetPage]);

export const navigateToTarget = (navigate, targetPage, filterParams, globalFilters) => {
  if (targetPage === "hatirlatici") {
    openHatirlaticiPanel();
    return;
  }

  const route = TARGET_PAGE_ROUTES[targetPage];
  if (!route) return;

  const search = buildSearchParams(filterParams, globalFilters);
  navigate(search ? `${route}?${search}` : route);
};
