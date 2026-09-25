// GetEkipmanFullList istek govdesinin tek kaynagi. React'e bagimli degildir;
// dashboard uyum testi (scripts/dashboard-filter-conformance.mjs) de bu dosyayi kullanir.

export const BOS_FILTRELER = Object.freeze({
  lokasyonIds: [],
  makineTipIds: [],
  kategoriIds: [],
  durumIds: [],
  markaIds: [],
  modelIds: [],
  atolyeIds: [],
  makineIds: [],
  bakimDurumu: null,
  arizali: null,
  acikIsEmri: null,
});

const idListesi = (deger) => (Array.isArray(deger) ? deger.map(Number).filter(Number.isFinite) : []);

/**
 * Dashboard'dan URL ile gelen filtreleri (readDashboardFilterParams ciktisi) ekranin filtre yapisina cevirir.
 * /makine rotasinda "atolyeler" alani "atolye" adiyla gelir (utils/dashboardFilterParams.js).
 */
export function dashboardFiltreleriniCevir(dashboardFiltreleri = {}) {
  return {
    ...BOS_FILTRELER,
    lokasyonIds: idListesi(dashboardFiltreleri.lokasyonlar),
    makineTipIds: idListesi(dashboardFiltreleri.makinetip),
    kategoriIds: idListesi(dashboardFiltreleri.kategori),
    durumIds: idListesi(dashboardFiltreleri.durumlar),
    atolyeIds: idListesi(dashboardFiltreleri.atolye || dashboardFiltreleri.atolyeler),
    makineIds: idListesi(dashboardFiltreleri.makineler),
    arizali: dashboardFiltreleri.arizali === true ? true : null,
  };
}

/** GetEkipmanFullList govdesi (dokuman: Bolum 1.1). */
export function listeGovdesiOlustur({ filtreler, arama, isAktif, siralama, sayfa, sayfaBoyutu }) {
  const govde = {
    page: sayfa,
    pageSize: sayfaBoyutu,
    isAktif,
    parametre: arama,
    sortField: siralama.field,
    sortOrder: siralama.order,
    includeKpi: true,
    lokasyonIds: filtreler.lokasyonIds,
    makineTipIds: filtreler.makineTipIds,
    kategoriIds: filtreler.kategoriIds,
    durumIds: filtreler.durumIds,
    markaIds: filtreler.markaIds,
    modelIds: filtreler.modelIds,
    atolyeIds: filtreler.atolyeIds,
    bakimDurumu: filtreler.bakimDurumu || null,
    arizali: typeof filtreler.arizali === "boolean" ? filtreler.arizali : null,
  };

  // Dokumanda yok (swagger: EkipmanFiltreModel.EkipmanIds): dashboard'dan belirli ekipmanlari acmaya gelindiginde tasinir.
  if (filtreler.makineIds.length) {
    govde.ekipmanIds = filtreler.makineIds;
  }

  // Dokumanda ve swagger'da yok: "Acik Is Emri" KPI karti icin backend'den EkipmanFiltreModel.AcikIsEmri (bool) istendi.
  if (filtreler.acikIsEmri === true) {
    govde.acikIsEmri = true;
  }

  return govde;
}

/** Excel ucu ayni filtreleri alir, sayfalama ve KPI istemez (dokuman: Bolum 1.4). */
export function excelGovdesiOlustur(listeParametreleri) {
  const govde = { ...listeGovdesiOlustur(listeParametreleri) };
  delete govde.page;
  delete govde.pageSize;
  delete govde.includeKpi;
  return govde;
}
