import PropTypes from "prop-types";

/** Alt ekipman agacindaki dugum tipleri (GetEkipmanMakineListWeb `TIP`). */
export const DUGUM = { GRUP: "GRUP", EKIPMAN: "EKIPMAN", MALZEME: "MALZEME" };

/** Yeni kaydin dogrudan makineye baglandigi hedef tipi (hicbir grup / ekipman secili degilken). */
export const MAKINE_HEDEFI = "MAKINE";

/** Gruba bagli olmayan kok kayitlarin bolumu ("Diger"). */
export const DIGER_BOLUMU = "diger";

/** Kaydin dugum tipi. TIP gelmeyen ya da taninmayan kayitlar ekipman sayilir. */
export const kayitTipi = (kayit) => {
  const tip = String(kayit?.TIP ?? "")
    .trim()
    .toUpperCase();
  return Object.values(DUGUM).includes(tip) ? tip : DUGUM.EKIPMAN;
};

// Backend ID'si: malzemede TB_EKIPMAN_MALZEME_ID, grup ve ekipmanda TB_EKIPMAN_ID (listede ikisi de ID alanina esittir).
const backendIdsi = (kayit, tip) => Number(tip === DUGUM.MALZEME ? (kayit.TB_EKIPMAN_MALZEME_ID ?? kayit.ID) : (kayit.TB_EKIPMAN_ID ?? kayit.ID));

/**
 * GetEkipmanMakineListWeb'in duz listesinden agac kurar ve kok dugumleri doner.
 * Dugum: { ...kayit, tip, id (backend ID), ustId (PARENT_ID, makineye bagliysa 0), anahtar, cocuklar, anaEkipman }.
 * Malzeme ID'leri ayri tablodan gelir ve ekipman ID'leriyle cakisabilir; bu yuzden anahtar tip + ID'dir ve yalnizca
 * grup / ekipman ust dugum olabilir. Ust dugumu listede bulunmayan kayitlar koke konur.
 * Ana ekipman: makineye ya da bir gruba dogrudan bagli ekipman (ustu ekipman olmayan); agacta kalin gosterilir.
 */
export const agaciKur = (kayitlar) => {
  const dugumler = kayitlar.map((kayit) => {
    const tip = kayitTipi(kayit);
    const id = backendIdsi(kayit, tip);
    return { ...kayit, tip, id, ustId: Number(kayit.PARENT_ID) || 0, anahtar: `${tip}-${id}`, cocuklar: [], anaEkipman: false };
  });
  const ustler = new Map(dugumler.filter((dugum) => dugum.tip !== DUGUM.MALZEME).map((dugum) => [dugum.id, dugum]));
  const kokler = [];

  dugumler.forEach((dugum) => {
    const ust = ustler.get(dugum.ustId);
    const kokte = !ust || ust === dugum;
    dugum.anaEkipman = dugum.tip === DUGUM.EKIPMAN && (kokte || ust.tip === DUGUM.GRUP);
    if (kokte) kokler.push(dugum);
    else ust.cocuklar.push(dugum);
  });
  return kokler;
};

/**
 * Agacin bolumleri: koke bagli her grup bir bolumdur, gruba bagli olmayan kok kayitlar en sondaki "Diger" bolumundedir.
 * Bolum: { anahtar, grup (dugum; "Diger"de null), dugumler }.
 */
export const bolumlereAyir = (kokler) => {
  const bolumler = kokler.filter((dugum) => dugum.tip === DUGUM.GRUP).map((grup) => ({ anahtar: grup.anahtar, grup, dugumler: grup.cocuklar }));
  const digerleri = kokler.filter((dugum) => dugum.tip !== DUGUM.GRUP);
  if (digerleri.length) bolumler.push({ anahtar: DIGER_BOLUMU, grup: null, dugumler: digerleri });
  return bolumler;
};

/** Agactaki tum dugumler (derinlemesine, duz liste). */
export const tumDugumler = (dugumler) => dugumler.flatMap((dugum) => [dugum, ...tumDugumler(dugum.cocuklar)]);

/** Altina kayit eklenebilen dugum: grup ya da ekipman (malzemenin alti olmaz). */
export const altinaEklenirMi = (dugum) => Boolean(dugum) && dugum.tip !== DUGUM.MALZEME;

/** Dugumun kodu: malzemede figur no, digerlerinde kod. */
export const dugumKodu = (dugum) => (dugum.tip === DUGUM.MALZEME ? (dugum.EML_FIGURE_NO ?? dugum.KOD) : (dugum.EKP_KOD ?? dugum.KOD)) ?? "";

/** Dugumun adi: malzemede stok tanimi, digerlerinde tanim. */
export const dugumAdi = (dugum) => (dugum.tip === DUGUM.MALZEME ? (dugum.EML_STOK_TANIM ?? dugum.TANIM) : (dugum.EKP_TANIM ?? dugum.TANIM)) ?? "";

/** "(KOD) AD" bicimindeki dugum etiketi. */
export const dugumEtiketi = (dugum) => [dugumKodu(dugum) ? `(${dugumKodu(dugum)})` : "", dugumAdi(dugum)].filter(Boolean).join(" ");

/** "(KOD) TANIM" bicimindeki ekipman etiketi. */
export const ekipmanEtiketi = (kayit) => [kayit?.EKP_KOD ? `(${kayit.EKP_KOD})` : "", kayit?.EKP_TANIM ?? ""].filter(Boolean).join(" ");

/** agaciKur'un dugumu. */
export const dugumTipi = PropTypes.shape({
  tip: PropTypes.oneOf(Object.values(DUGUM)).isRequired,
  id: PropTypes.number.isRequired,
  ustId: PropTypes.number.isRequired,
  anahtar: PropTypes.string.isRequired,
  cocuklar: PropTypes.array.isRequired,
  anaEkipman: PropTypes.bool.isRequired,
});

/** Yeni kaydin baglanacagi yer: secili grup / ekipman ya da makine (id null). */
export const hedefTipi = PropTypes.shape({
  tip: PropTypes.oneOf([DUGUM.GRUP, DUGUM.EKIPMAN, MAKINE_HEDEFI]).isRequired,
  id: PropTypes.number,
  anahtar: PropTypes.string,
  etiket: PropTypes.string.isRequired,
});

/** Agac satirlarina verilen durum (useAltEkipmanAgaci). */
export const agacDurumuTipi = PropTypes.shape({
  acikAnahtarlar: PropTypes.array.isRequired,
  kapaliBolumler: PropTypes.array.isRequired,
  seciliAnahtar: PropTypes.string,
  acKapat: PropTypes.func.isRequired,
  bolumuAcKapat: PropTypes.func.isRequired,
  sec: PropTypes.func.isRequired,
  secimiDegistir: PropTypes.func.isRequired,
});
