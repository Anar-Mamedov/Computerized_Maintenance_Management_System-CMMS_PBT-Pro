import { useEffect, useRef, useState } from "react";
import { getAtolyeler, getKodListesi, getLokasyonlar, getMarkalar, getModeller } from "./ekipmanService";
import { KOD_GRUPLARI } from "./constants";

// Filtre secenekleri { value, label } bicimine indirgenir. Aktif filtre ciplerinin etiketleri de buradan okunur.

const diziMi = (deger) => (Array.isArray(deger) ? deger : []);

const kodSecenekleri = (liste) =>
  diziMi(liste)
    .filter((kod) => kod?.TB_KOD_ID !== undefined && kod?.TB_KOD_ID !== null)
    .map((kod) => ({ value: kod.TB_KOD_ID, label: kod.KOD_TANIM ?? "" }));

const markaSecenekleri = (response) =>
  diziMi(response?.Makine_Marka_List)
    .filter((marka) => marka?.TB_MARKA_ID !== undefined && marka?.TB_MARKA_ID !== null)
    .map((marka) => ({ value: marka.TB_MARKA_ID, label: marka.MRK_MARKA ?? "" }));

const modelSecenekleri = (response) =>
  diziMi(response?.Makine_Model_List)
    .filter((model) => model?.TB_MODEL_ID !== undefined && model?.TB_MODEL_ID !== null)
    .map((model) => ({ value: model.TB_MODEL_ID, label: model.MDL_MODEL ?? "" }));

const atolyeSecenekleri = (liste) =>
  diziMi(liste)
    .filter((atolye) => atolye?.TB_ATOLYE_ID !== undefined && atolye?.TB_ATOLYE_ID !== null)
    .map((atolye) => ({ value: atolye.TB_ATOLYE_ID, label: atolye.ATL_TANIM ?? "" }));

/**
 * Lokasyon listesini agac sirasina dizer; her ogenin derinligi girinti icin tasinir.
 * Ana lokasyonu listede olmayan kayitlar kok kabul edilir.
 */
export const lokasyonAgaciniDuzlestir = (response) => {
  const liste = diziMi(response?.data || response);
  const idler = new Set(liste.map((lokasyon) => lokasyon.TB_LOKASYON_ID));
  const cocuklar = new Map();

  liste.forEach((lokasyon) => {
    const ustId = idler.has(lokasyon.LOK_ANA_LOKASYON_ID) ? lokasyon.LOK_ANA_LOKASYON_ID : null;
    if (!cocuklar.has(ustId)) cocuklar.set(ustId, []);
    cocuklar.get(ustId).push(lokasyon);
  });

  const sonuc = [];
  const ziyaretEdilen = new Set();
  const ekle = (ustId, derinlik) => {
    (cocuklar.get(ustId) || []).forEach((lokasyon) => {
      if (ziyaretEdilen.has(lokasyon.TB_LOKASYON_ID)) return;
      ziyaretEdilen.add(lokasyon.TB_LOKASYON_ID);
      sonuc.push({ value: lokasyon.TB_LOKASYON_ID, label: lokasyon.LOK_TANIM ?? "", derinlik });
      ekle(lokasyon.TB_LOKASYON_ID, derinlik + 1);
    });
  };
  ekle(null, 0);

  return sonuc;
};

const sonucuAl = (sonuc, donustur, ad) => {
  if (sonuc.status === "fulfilled") return donustur(sonuc.value);
  console.error(`${ad} filtre seçenekleri alınamadı:`, sonuc.reason);
  return [];
};

/**
 * Arac cubugundaki filtrelerin secenekleri ekran acilirken, gelismis filtrelerinkiler
 * ise ilk ihtiyac aninda (cekmece acildiginda ya da dashboard'dan secili geldiginde) yuklenir.
 */
export default function useFiltreSecenekleri(gelismisGerekli) {
  const [secenekler, setSecenekler] = useState({ lokasyon: [], makineTipi: [], kategori: [], durum: [], marka: [], model: [], atolye: [] });
  const gelismisIstendiRef = useRef(false);

  useEffect(() => {
    let iptal = false;

    Promise.allSettled([getLokasyonlar(), getKodListesi(KOD_GRUPLARI.makineTipi), getKodListesi(KOD_GRUPLARI.kategori)]).then(([lokasyon, makineTipi, kategori]) => {
      if (iptal) return;
      setSecenekler((onceki) => ({
        ...onceki,
        lokasyon: sonucuAl(lokasyon, lokasyonAgaciniDuzlestir, "Lokasyon"),
        makineTipi: sonucuAl(makineTipi, kodSecenekleri, "Makine tipi"),
        kategori: sonucuAl(kategori, kodSecenekleri, "Kategori"),
      }));
    });

    return () => {
      iptal = true;
    };
  }, []);

  useEffect(() => {
    if (!gelismisGerekli || gelismisIstendiRef.current) return;
    gelismisIstendiRef.current = true;

    // Eski filtredeki gibi model listesi markadan bagimsizdir: markaId=0 tum modelleri dondurur.
    Promise.allSettled([getKodListesi(KOD_GRUPLARI.makineDurumu), getMarkalar(), getModeller(0), getAtolyeler()]).then(([durum, marka, model, atolye]) => {
      setSecenekler((onceki) => ({
        ...onceki,
        durum: sonucuAl(durum, kodSecenekleri, "Durum"),
        marka: sonucuAl(marka, markaSecenekleri, "Marka"),
        model: sonucuAl(model, modelSecenekleri, "Model"),
        atolye: sonucuAl(atolye, atolyeSecenekleri, "Atölye"),
      }));
    });
  }, [gelismisGerekli]);

  return secenekler;
}
