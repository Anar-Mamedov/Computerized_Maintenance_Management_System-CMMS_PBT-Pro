import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { message } from "antd";
import { t } from "i18next";
import { useDashboardFilterParams } from "../../../../utils/dashboardFilterParams";
import { getEkipmanListesi } from "./ekipmanService";
import { BOS_FILTRELER, dashboardFiltreleriniCevir, listeGovdesiOlustur } from "./listeIstegi";
import { DEPOLAMA_ANAHTARLARI, SAYFA_BOYUTLARI, VARSAYILAN_KAYIT_DURUMU, VARSAYILAN_SAYFA_BOYUTU, VARSAYILAN_SIRALAMA } from "./constants";
import { tercihOku, tercihYaz } from "./tercihler";

const BOS_VERI = { satirlar: [], toplam: 0 };

const sayfaBoyutuOku = () => {
  const kayitli = Number(tercihOku(DEPOLAMA_ANAHTARLARI.sayfaBoyutu, VARSAYILAN_SAYFA_BOYUTU));
  return SAYFA_BOYUTLARI.includes(kayitli) ? kayitli : VARSAYILAN_SAYFA_BOYUTU;
};

const siralamaOku = () => {
  const kayitli = tercihOku(DEPOLAMA_ANAHTARLARI.siralama, null);
  const gecerli = kayitli && typeof kayitli.field === "string" && (kayitli.order === "ASC" || kayitli.order === "DESC");
  return gecerli ? kayitli : VARSAYILAN_SIRALAMA;
};

/** React render ve secim icin istemci anahtari uretilir; API'ye her zaman TB_MAKINE_ID gider. */
const satirlariHazirla = (liste) => (Array.isArray(liste) ? liste : []).map((satir, index) => ({ ...satir, clientKey: `${satir.TB_MAKINE_ID ?? "ekipman"}-${index}` }));

/** Ekipman listesinin filtre, siralama, sayfalama ve veri durumunu yonetir. */
export default function useEkipmanListesi() {
  // Dashboard widget'indan gelindiyse filtreler URL uzerinden tasinir.
  const { filters: dashboardFiltreleri, isAktif: dashboardIsAktif } = useDashboardFilterParams("/makine");
  const dashboardTemeli = useMemo(() => dashboardFiltreleriniCevir(dashboardFiltreleri), [dashboardFiltreleri]);
  const dashboardTemeliRef = useRef(dashboardTemeli);

  // Ilk acilista state dogrudan URL'den kurulur; boylece filtresiz ara bir istek atilmaz.
  const [filtreler, setFiltreler] = useState(dashboardTemeli);
  const [isAktif, setIsAktif] = useState(dashboardIsAktif ?? VARSAYILAN_KAYIT_DURUMU);
  const [arama, setArama] = useState("");
  const [siralama, setSiralama] = useState(siralamaOku);
  const [sayfa, setSayfa] = useState(1);
  const [sayfaBoyutu, setSayfaBoyutu] = useState(sayfaBoyutuOku);
  const [veri, setVeri] = useState(BOS_VERI);
  const [kpi, setKpi] = useState(null);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [yenilemeSayaci, setYenilemeSayaci] = useState(0);
  const istekSirasiRef = useRef(0);

  // Ekran aciktayken dashboard'dan yeni bir URL ile gelinirse filtreler yeniden kurulur.
  useEffect(() => {
    if (dashboardTemeliRef.current === dashboardTemeli) return;
    dashboardTemeliRef.current = dashboardTemeli;
    setFiltreler(dashboardTemeli);
    if (dashboardIsAktif === 0 || dashboardIsAktif === 1) setIsAktif(dashboardIsAktif);
    setSayfa(1);
  }, [dashboardTemeli, dashboardIsAktif]);

  useEffect(() => {
    tercihYaz(DEPOLAMA_ANAHTARLARI.siralama, siralama);
  }, [siralama]);

  useEffect(() => {
    tercihYaz(DEPOLAMA_ANAHTARLARI.sayfaBoyutu, sayfaBoyutu);
  }, [sayfaBoyutu]);

  const listeParametreleri = useMemo(() => ({ filtreler, arama, isAktif, siralama, sayfa, sayfaBoyutu }), [filtreler, arama, isAktif, siralama, sayfa, sayfaBoyutu]);

  useEffect(() => {
    // Yanitlar atilma sirasiyla donmeyebilir; yalnizca en son istegin yaniti ekrana islenir.
    istekSirasiRef.current += 1;
    const istekSirasi = istekSirasiRef.current;
    const guncelMi = () => istekSirasi === istekSirasiRef.current;

    setYukleniyor(true);
    getEkipmanListesi(listeGovdesiOlustur(listeParametreleri))
      .then((response) => {
        if (!guncelMi()) return;
        if (!response || response.has_error) {
          setVeri(BOS_VERI);
          message.error(response?.message || t("hataOlustu"));
          return;
        }
        setVeri({ satirlar: satirlariHazirla(response.ekipman_listesi), toplam: Number(response.toplam_kayit) || 0 });
        if (response.kpi) setKpi(response.kpi);
      })
      .catch((error) => {
        if (!guncelMi()) return;
        console.error("Ekipman listesi alınamadı:", error);
        setVeri(BOS_VERI);
        message.error(t("hataOlustu"));
      })
      .finally(() => {
        if (guncelMi()) setYukleniyor(false);
      });
  }, [listeParametreleri, yenilemeSayaci]);

  // Kayit silinince son sayfa bosalabilir; bir onceki dolu sayfaya donulur.
  useEffect(() => {
    const sonSayfa = Math.max(1, Math.ceil(veri.toplam / sayfaBoyutu));
    if (!yukleniyor && sayfa > sonSayfa) setSayfa(sonSayfa);
  }, [veri.toplam, sayfaBoyutu, sayfa, yukleniyor]);

  const filtreleriGuncelle = useCallback((degisiklik) => {
    setFiltreler((onceki) => ({ ...onceki, ...degisiklik }));
    setSayfa(1);
  }, []);

  const filtreleriTemizle = useCallback(() => {
    setFiltreler(BOS_FILTRELER);
    setArama("");
    setSayfa(1);
  }, []);

  const kayitDurumunuDegistir = useCallback((deger) => {
    setIsAktif(deger);
    setSayfa(1);
  }, []);

  const aramayiDegistir = useCallback((deger) => {
    setArama(deger);
    setSayfa(1);
  }, []);

  // Ayni kolona tekrar tiklaninca yon degisir, baska kolona gecince A-Z baslar.
  const siralamayiDegistir = useCallback((field) => {
    setSiralama((onceki) => (onceki.field === field ? { field, order: onceki.order === "ASC" ? "DESC" : "ASC" } : { field, order: "ASC" }));
    setSayfa(1);
  }, []);

  const sayfaBoyutunuDegistir = useCallback((boyut) => {
    setSayfaBoyutu(boyut);
    setSayfa(1);
  }, []);

  const yenile = useCallback(() => setYenilemeSayaci((sayac) => sayac + 1), []);

  return {
    satirlar: veri.satirlar,
    toplam: veri.toplam,
    kpi,
    yukleniyor,
    filtreler,
    isAktif,
    arama,
    siralama,
    sayfa,
    sayfaBoyutu,
    listeParametreleri,
    filtreleriGuncelle,
    filtreleriTemizle,
    kayitDurumunuDegistir,
    aramayiDegistir,
    siralamayiDegistir,
    setSayfa,
    sayfaBoyutunuDegistir,
    yenile,
  };
}
