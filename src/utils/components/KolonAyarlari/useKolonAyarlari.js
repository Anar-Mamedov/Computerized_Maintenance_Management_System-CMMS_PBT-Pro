import { useCallback, useEffect, useMemo, useState } from "react";
import { arrayMove } from "@dnd-kit/sortable";

const varsayilanDurum = (tanimlar) => tanimlar.map((tanim) => ({ key: tanim.key, gorunur: !tanim.varsayilanGizli, genislik: tanim.genislik }));

/** Kayitli tercih okunur; sonradan eklenen kolonlar sona eklenir, artik olmayanlar atilir. Depolama kapaliysa varsayilan. */
const kayitliDurumuOku = (tanimlar, depolamaAnahtari) => {
  let kayitli = null;
  try {
    kayitli = JSON.parse(localStorage.getItem(depolamaAnahtari));
  } catch {
    kayitli = null;
  }
  if (!Array.isArray(kayitli)) return varsayilanDurum(tanimlar);

  const tanimlarByKey = new Map(tanimlar.map((tanim) => [tanim.key, tanim]));
  const bilinenler = kayitli
    .filter((kolon) => tanimlarByKey.has(kolon?.key))
    .map((kolon) => ({
      key: kolon.key,
      gorunur: Boolean(kolon.gorunur),
      genislik: Number(kolon.genislik) > 0 ? Number(kolon.genislik) : tanimlarByKey.get(kolon.key).genislik,
    }));
  const eksikler = varsayilanDurum(tanimlar).filter((varsayilan) => !bilinenler.some((kolon) => kolon.key === varsayilan.key));

  return [...bilinenler, ...eksikler];
};

/**
 * Bir tablonun kolon sirasi, gorunurlugu ve genisligi; tarayicida `depolamaAnahtari` altinda saklanir.
 * `tanimlar` varsayilan siradaki kolonlardir: `{ key, baslik, genislik, varsayilanGizli?, ...ekrana ozel alanlar }`.
 * Ekran `tanimlar`'i sabit tutmalidir (`useMemo`). Donen `kolonlar` tanimi kullanicinin ayariyla birlestirir.
 */
export default function useKolonAyarlari(tanimlar, depolamaAnahtari) {
  const [durum, setDurum] = useState(() => kayitliDurumuOku(tanimlar, depolamaAnahtari));

  useEffect(() => {
    try {
      localStorage.setItem(depolamaAnahtari, JSON.stringify(durum));
    } catch {
      // Tercih kaydedilemese de tablo calismaya devam eder.
    }
  }, [durum, depolamaAnahtari]);

  const kolonlar = useMemo(() => {
    const tanimlarByKey = new Map(tanimlar.map((tanim) => [tanim.key, tanim]));
    return durum.filter((kolon) => tanimlarByKey.has(kolon.key)).map((kolon) => ({ ...tanimlarByKey.get(kolon.key), ...kolon }));
  }, [durum, tanimlar]);

  const gorunurKolonlar = useMemo(() => kolonlar.filter((kolon) => kolon.gorunur), [kolonlar]);
  const varsayilanSira = useMemo(() => tanimlar.map((tanim) => tanim.key), [tanimlar]);

  const gorunurlukDegistir = useCallback((key, gorunur) => {
    setDurum((onceki) => onceki.map((kolon) => (kolon.key === key ? { ...kolon, gorunur } : kolon)));
  }, []);

  const siraDegistir = useCallback((kaynakKey, hedefKey) => {
    setDurum((onceki) => {
      const kaynak = onceki.findIndex((kolon) => kolon.key === kaynakKey);
      const hedef = onceki.findIndex((kolon) => kolon.key === hedefKey);
      return kaynak === -1 || hedef === -1 ? onceki : arrayMove(onceki, kaynak, hedef);
    });
  }, []);

  const genislikDegistir = useCallback((key, genislik) => {
    setDurum((onceki) => onceki.map((kolon) => (kolon.key === key ? { ...kolon, genislik } : kolon)));
  }, []);

  const sifirla = useCallback(() => setDurum(varsayilanDurum(tanimlar)), [tanimlar]);

  return { kolonlar, gorunurKolonlar, varsayilanSira, gorunurlukDegistir, siraDegistir, genislikDegistir, sifirla };
}
