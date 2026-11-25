import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { message } from "antd";
import { useTranslation } from "react-i18next";
import useDebounce from "../../../hooks/useDebounce";
import { ortakFiltreGovdesi } from "../ortak/yakitFiltresi";
import { hataMetni } from "../ortak/yakitApi";
import { getYakitStokIslemListesi } from "./yakitStokIslemService";

export const SAYFA_BOYUTLARI = [10, 25, 50];
const VARSAYILAN_SIRALAMA = { SortBy: "tarih", SortDir: "desc" };
const BOS_VERI = { satirlar: [], ozetler: null, toplam: 0 };

/** React render ve secim icin istemci anahtari; API'ye her zaman TB_STOK_FIS_ID gider. */
const satirlariHazirla = (liste) => (Array.isArray(liste) ? liste : []).map((satir, index) => ({ ...satir, clientKey: `${satir.TB_STOK_FIS_ID ?? "fis"}-${index}` }));

/**
 * Liste, KPI, siralama ve sayfalama durumu. Filtreler formdan gelir (`filtreDegerleri`); filtre, arama ya da
 * siralama degisince ilk sayfaya donulur.
 */
export default function useYakitStokIslemListesi(filtreDegerleri) {
  const { t } = useTranslation();
  const arama = useDebounce(filtreDegerleri.arama ?? "", 500);
  const [siralama, setSiralama] = useState(VARSAYILAN_SIRALAMA);
  const [sayfaBoyutu, setSayfaBoyutu] = useState(SAYFA_BOYUTLARI[0]);
  const [veri, setVeri] = useState(BOS_VERI);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [yenilemeSayaci, setYenilemeSayaci] = useState(0);
  const istekSirasiRef = useRef(0);

  const { baslangicTarihi, bitisTarihi, lokasyonIds, yakitTipIds, islemTuru } = filtreDegerleri;
  // Tarih kutulari ayni gunu yeni bir nesneyle yazabilir; govde yalnizca icerigi degisince yenilenir (gereksiz istek atilmaz).
  const filtreJson = JSON.stringify({
    ...ortakFiltreGovdesi({ baslangicTarihi, bitisTarihi, lokasyonIds, yakitTipIds }),
    IslemTuru: islemTuru || "TUMU",
    Arama: arama,
  });
  const filtreGovdesi = useMemo(() => JSON.parse(filtreJson), [filtreJson]);

  // Sayfa, secildigi filtre + siralamayla birlikte tutulur; filtre, arama ya da siralama degisince ayni render'da
  // ilk sayfaya donulur (once eski sayfa icin gereksiz bir istek atilmaz).
  const filtreAnahtari = useMemo(() => JSON.stringify({ filtreJson, siralama }), [filtreJson, siralama]);
  const [sayfaDurumu, setSayfaDurumu] = useState({ anahtar: filtreAnahtari, sayfa: 1 });
  const sayfa = sayfaDurumu.anahtar === filtreAnahtari ? sayfaDurumu.sayfa : 1;
  const setSayfa = useCallback((yeniSayfa) => setSayfaDurumu({ anahtar: filtreAnahtari, sayfa: yeniSayfa }), [filtreAnahtari]);

  const listeGovdesi = useMemo(() => ({ ...filtreGovdesi, ...siralama, Page: sayfa, PageSize: sayfaBoyutu, IsExcel: false }), [filtreGovdesi, siralama, sayfa, sayfaBoyutu]);

  useEffect(() => {
    // Yanitlar atilma sirasiyla donmeyebilir; yalnizca en son istegin yaniti ekrana islenir.
    istekSirasiRef.current += 1;
    const istekSirasi = istekSirasiRef.current;

    setYukleniyor(true);
    getYakitStokIslemListesi(listeGovdesi)
      .then((yanit) => {
        if (istekSirasi !== istekSirasiRef.current) return;
        const data = yanit?.data ?? {};
        setVeri({ satirlar: satirlariHazirla(data.Liste), ozetler: data.Ozetler ?? null, toplam: Number(data.ToplamKayit) || 0 });
      })
      .catch((error) => {
        if (istekSirasi !== istekSirasiRef.current) return;
        setVeri(BOS_VERI);
        message.error(hataMetni(error, t));
      })
      .finally(() => {
        if (istekSirasi === istekSirasiRef.current) setYukleniyor(false);
      });
  }, [listeGovdesi, yenilemeSayaci, t]);

  const yenile = useCallback(() => setYenilemeSayaci((sayac) => sayac + 1), []);

  const sayfaBoyutunuDegistir = useCallback(
    (yeniBoyut) => {
      setSayfaBoyutu(yeniBoyut);
      setSayfa(1);
    },
    [setSayfa]
  );

  /** Excel: ayni filtre ve siralama, sayfalamasiz (IsExcel: true). */
  const excelGovdesi = useMemo(() => ({ ...filtreGovdesi, ...siralama, Page: 1, PageSize: sayfaBoyutu, IsExcel: true }), [filtreGovdesi, siralama, sayfaBoyutu]);

  return {
    ...veri,
    yukleniyor,
    siralama,
    setSiralama,
    sayfa,
    setSayfa,
    sayfaBoyutu,
    sayfaBoyutunuDegistir,
    yenile,
    excelGovdesi,
  };
}
