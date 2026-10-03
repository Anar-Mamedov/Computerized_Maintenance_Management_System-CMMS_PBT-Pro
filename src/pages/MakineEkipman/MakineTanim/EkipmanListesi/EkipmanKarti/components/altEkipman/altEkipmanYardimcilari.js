import PropTypes from "prop-types";

/**
 * Alt ekipmanlari EKP_TIP'e gore gruplar: [{ anahtar, tip, kayitlar }].
 * Gruplar alfabetiktir; tipi bos olanlar ("Diger") en sondadir.
 */
export const gruplaraAyir = (kayitlar, dil) => {
  const gruplar = new Map();
  kayitlar.forEach((kayit) => {
    const tip = String(kayit.EKP_TIP ?? "").trim();
    if (!gruplar.has(tip)) gruplar.set(tip, []);
    gruplar.get(tip).push(kayit);
  });

  return [...gruplar.entries()]
    .map(([tip, grupKayitlari]) => ({ anahtar: tip ? `tip:${tip}` : "tipsiz", tip, kayitlar: grupKayitlari }))
    .sort((a, b) => {
      if (!a.tip) return 1;
      if (!b.tip) return -1;
      return a.tip.localeCompare(b.tip, dil);
    });
};

/** "(KOD) TANIM" bicimindeki ekipman etiketi. */
export const ekipmanEtiketi = (kayit) => [kayit?.EKP_KOD ? `(${kayit.EKP_KOD})` : "", kayit?.EKP_TANIM ?? ""].filter(Boolean).join(" ");

/** Agac satirlarina verilen durum (useAltEkipmanAgaci). */
export const agacDurumuTipi = PropTypes.shape({
  acikIdler: PropTypes.array.isRequired,
  yuklenenIdler: PropTypes.array.isRequired,
  cocuklar: PropTypes.object.isRequired,
  seciliKayitlar: PropTypes.object.isRequired,
  acKapat: PropTypes.func.isRequired,
  secimiDegistir: PropTypes.func.isRequired,
});
