// Liste ekranlarında filtre gövdesi değişti mi kararı için ortak yardımcı.
// Boş değerler (undefined, null, "", [], {}) "filtre yok" demektir; mergeDashboardFilters de aynı kuralı kullanır.

const bosDegerMi = (deger) =>
  deger === undefined ||
  deger === null ||
  deger === "" ||
  (Array.isArray(deger) && deger.length === 0) ||
  (typeof deger === "object" && !Array.isArray(deger) && Object.keys(deger).length === 0);

// Nesnenin boş alanlarını atar ve alanları sıralar; nesne olmayan değerler olduğu gibi döner.
const bosAlanlariAt = (deger) => {
  if (!deger || typeof deger !== "object" || Array.isArray(deger)) return deger;

  return Object.keys(deger)
    .sort()
    .reduce((sonuc, alan) => (bosDegerMi(deger[alan]) ? sonuc : { ...sonuc, [alan]: deger[alan] }), {});
};

/** İki filtre değeri, boş alanlar ve alan sırası yok sayıldığında aynı mı? */
export const filtrelerAyni = (ilk, ikinci) => JSON.stringify(bosAlanlariAt(ilk)) === JSON.stringify(bosAlanlariAt(ikinci));
