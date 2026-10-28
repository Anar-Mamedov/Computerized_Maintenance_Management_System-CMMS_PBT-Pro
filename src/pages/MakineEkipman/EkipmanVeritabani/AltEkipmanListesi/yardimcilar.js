/**
 * Ornek yanitta alan adlari PascalCase (Code, MachineId), sayfalama alanlari camelCase (totalCount); iki bicim de
 * gelebilecegi icin yanit bir kez camelCase'e cevrilir ve ekran yalnizca camelCase okur.
 */
const kucukBas = (anahtar) => anahtar.charAt(0).toLowerCase() + anahtar.slice(1);

export const camelCaseYap = (deger) => {
  if (Array.isArray(deger)) return deger.map(camelCaseYap);
  if (deger && typeof deger === "object") return Object.fromEntries(Object.entries(deger).map(([anahtar, ic]) => [kucukBas(anahtar), camelCaseYap(ic)]));
  return deger;
};

/** Liste satirlari: React render / secim icin istemci anahtari; API'ye ve modallara her zaman `id` gider. */
export const listeSatirlari = (items) => (Array.isArray(items) ? items : []).map((satir, index) => ({ ...satir, clientKey: `${satir.id ?? "satir"}-${index}` }));

/**
 * Agac satirlari: makine gruplari kok satirdir (`grup: true`), altlarinda ekipmanlar sinirsiz derinlikte durur.
 * Islem modallari icin her ekipmana grubun makinesi (`machineId`) ve ust ekipmani (`parentId`, kokte 0) eklenir.
 */
export const agacSatirlari = (groups) =>
  (Array.isArray(groups) ? groups : []).map((grup, grupSirasi) => {
    const dugumler = (liste, ustId, yol) =>
      (Array.isArray(liste) ? liste : []).map((dugum, index) => {
        const anahtar = `${yol}-${dugum.id ?? index}`;
        const cocuklar = dugumler(dugum.children, dugum.id, anahtar);
        return { ...dugum, clientKey: anahtar, machineId: grup.machineId, parentId: ustId, children: cocuklar.length ? cocuklar : undefined };
      });

    const grupAnahtari = `grup-${grup.groupKey ?? grupSirasi}`;
    const cocuklar = dugumler(grup.children, 0, grupAnahtari);
    return { ...grup, grup: true, clientKey: grupAnahtari, children: cocuklar.length ? cocuklar : undefined };
  });

/** Agacta secilen anahtarlarin satirlari (gruplar secilemez). */
export const agactanBul = (satirlar, anahtarlar) => {
  const bulunanlar = [];
  const gez = (liste) =>
    (liste || []).forEach((satir) => {
      if (anahtarlar.includes(satir.clientKey) && !satir.grup) bulunanlar.push(satir);
      gez(satir.children);
    });
  gez(satirlar);
  return bulunanlar;
};
