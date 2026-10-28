import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { message } from "antd";
import { getTransferListesi, hataMesaji } from "./transferService";
import { BOS_FILTRELER, LISTE_TARIH_BICIMI, VARSAYILAN_SAYFA_BOYUTU, VARSAYILAN_SIRALAMA } from "./sabitler";

const BOS_VERI = { satirlar: [], toplam: 0 };

/** GetList istek govdesi; KPI kartlari ayni yanittan beslendigi icin `includeKpi` hep gonderilir. */
const listeGovdesi = ({ filtreler, siralama, sayfa, sayfaBoyutu }) => ({
  page: sayfa,
  pageSize: sayfaBoyutu,
  search: filtreler.arama.trim(),
  startDate: filtreler.baslangicTarihi ? filtreler.baslangicTarihi.format(LISTE_TARIH_BICIMI) : null,
  endDate: filtreler.bitisTarihi ? filtreler.bitisTarihi.format(LISTE_TARIH_BICIMI) : null,
  sourceLocationId: filtreler.kaynakLokasyonID || null,
  targetLocationId: filtreler.hedefLokasyonID || null,
  status: filtreler.durum ?? null,
  sortField: siralama.field,
  sortOrder: siralama.order,
  includeKpi: true,
});

/** React render icin istemci anahtari uretilir; API'ye her zaman `transferId` gider. */
const satirlariHazirla = (liste) => (Array.isArray(liste) ? liste : []).map((satir, index) => ({ ...satir, clientKey: `${satir.transferId ?? "transfer"}-${index}` }));

/** Transfer listesinin filtre, siralama, sayfalama ve veri durumunu yonetir. */
export default function useTransferListesi() {
  const [filtreler, setFiltreler] = useState(BOS_FILTRELER);
  const [siralama, setSiralama] = useState(VARSAYILAN_SIRALAMA);
  const [sayfa, setSayfa] = useState(1);
  const [sayfaBoyutu, setSayfaBoyutu] = useState(VARSAYILAN_SAYFA_BOYUTU);
  const [veri, setVeri] = useState(BOS_VERI);
  const [kpi, setKpi] = useState(null);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [yenilemeSayaci, setYenilemeSayaci] = useState(0);
  const istekSirasiRef = useRef(0);

  const parametreler = useMemo(() => ({ filtreler, siralama, sayfa, sayfaBoyutu }), [filtreler, siralama, sayfa, sayfaBoyutu]);

  useEffect(() => {
    // Yanitlar atilma sirasiyla donmeyebilir; yalnizca en son istegin yaniti ekrana islenir.
    istekSirasiRef.current += 1;
    const istekSirasi = istekSirasiRef.current;
    const guncelMi = () => istekSirasi === istekSirasiRef.current;

    setYukleniyor(true);
    getTransferListesi(listeGovdesi(parametreler))
      .then((yanit) => {
        if (!guncelMi()) return;
        setVeri({ satirlar: satirlariHazirla(yanit.items), toplam: Number(yanit.totalCount) || 0 });
        if (yanit.kpi) setKpi(yanit.kpi);
      })
      .catch((hata) => {
        if (!guncelMi()) return;
        console.error("Transfer listesi alınamadı:", hata);
        setVeri(BOS_VERI);
        message.error(hataMesaji(hata));
      })
      .finally(() => {
        if (guncelMi()) setYukleniyor(false);
      });
  }, [parametreler, yenilemeSayaci]);

  // Kayit silinince son sayfa bosalabilir; bir onceki dolu sayfaya donulur.
  useEffect(() => {
    const sonSayfa = Math.max(1, Math.ceil(veri.toplam / sayfaBoyutu));
    if (!yukleniyor && sayfa > sonSayfa) setSayfa(sonSayfa);
  }, [veri.toplam, sayfaBoyutu, sayfa, yukleniyor]);

  const filtreleriUygula = useCallback((yeniFiltreler) => {
    setFiltreler({ ...BOS_FILTRELER, ...yeniFiltreler });
    setSayfa(1);
  }, []);

  const siralamayiDegistir = useCallback((yeniSiralama) => {
    setSiralama(yeniSiralama ?? VARSAYILAN_SIRALAMA);
    setSayfa(1);
  }, []);

  const sayfaDegistir = useCallback((yeniSayfa, yeniBoyut) => {
    if (yeniBoyut !== sayfaBoyutu) {
      setSayfaBoyutu(yeniBoyut);
      setSayfa(1);
      return;
    }
    setSayfa(yeniSayfa);
  }, [sayfaBoyutu]);

  const yenile = useCallback(() => setYenilemeSayaci((sayac) => sayac + 1), []);

  return {
    satirlar: veri.satirlar,
    toplam: veri.toplam,
    kpi,
    yukleniyor,
    siralama,
    sayfa,
    sayfaBoyutu,
    filtreleriUygula,
    siralamayiDegistir,
    sayfaDegistir,
    yenile,
  };
}
