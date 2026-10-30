import { useCallback, useEffect, useRef, useState } from "react";
import { message } from "antd";
import { getEkipmanOzeti, getHareketListesi, getKarsilastirma, hataMesaji } from "./sayacHareketleriService";
import { anahtarEkle, filtreGovdesi } from "./yardimcilar";
import { BOS_FILTRELER, VARSAYILAN_SAYFA_BOYUTU } from "./sabitler";

const ISTEKLER = { hareketler: getHareketListesi, ozet: getEkipmanOzeti, karsilastirma: getKarsilastirma };
const ID_ALANLARI = { hareketler: "readingId", ozet: "counterId", karsilastirma: "groupId" };
const BOS_VERI = { sekme: null, satirlar: [], toplam: 0 };

/** Sekmenin istek govdesi: ortak filtre + listelerde sayfalama, hareketlerde tarih sirasi, karsilastirmada gruplama. */
export const sekmeGovdesi = ({ sekme, filtreler, sayfa, sayfaBoyutu, siralama, grupla, karsilastirmaSayacTipi }) => {
  const govde = filtreGovdesi(filtreler);
  if (sekme === "karsilastirma") {
    return { ...govde, groupBy: grupla, ...(karsilastirmaSayacTipi ? { comparisonCounterTypeId: karsilastirmaSayacTipi } : {}) };
  }
  return { ...govde, page: sayfa, pageSize: sayfaBoyutu, ...(sekme === "hareketler" ? { sortOrder: siralama } : {}) };
};

/**
 * Ekranin filtre, sekme, sayfa ve veri durumu. Yalnizca acik sekmenin ucu cagrilir; KPI kartlari o yanittaki
 * `kpi` nesnesinden beslenir. Filtreler ust cubuktaki "Uygula" ile degisir.
 */
export default function useSayacHareketleri() {
  const [filtreler, setFiltreler] = useState(BOS_FILTRELER);
  const [sekme, setSekme] = useState("hareketler");
  const [sayfa, setSayfa] = useState(1);
  const [sayfaBoyutu, setSayfaBoyutu] = useState(VARSAYILAN_SAYFA_BOYUTU);
  const [siralama, setSiralama] = useState("DESC");
  const [grupla, setGrupla] = useState("equipmentType");
  const [karsilastirmaSayacTipi, setKarsilastirmaSayacTipi] = useState(null);
  const [veri, setVeri] = useState(BOS_VERI);
  const [kpi, setKpi] = useState(null);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [yenilemeSayaci, setYenilemeSayaci] = useState(0);
  const istekSirasiRef = useRef(0);

  useEffect(() => {
    // Yanitlar atilma sirasiyla donmeyebilir; yalnizca en son istegin yaniti ekrana islenir.
    istekSirasiRef.current += 1;
    const istekSirasi = istekSirasiRef.current;
    const guncelMi = () => istekSirasi === istekSirasiRef.current;
    const govde = sekmeGovdesi({ sekme, filtreler, sayfa, sayfaBoyutu, siralama, grupla, karsilastirmaSayacTipi });

    setYukleniyor(true);
    ISTEKLER[sekme](govde)
      .then((yanit) => {
        if (!guncelMi()) return;
        // Liste uclari `items`, `totalCount` ve `kpi` alanlarini yanitin en ustunde doner (`data` sarmali yok); birim satirlarda.
        setVeri({ sekme, satirlar: anahtarEkle(yanit.items, ID_ALANLARI[sekme]), toplam: Number(yanit.totalCount) || 0 });
        if (yanit.kpi) setKpi(yanit.kpi);
      })
      .catch((hata) => {
        if (!guncelMi()) return;
        console.error("Sayaç hareketleri alınamadı:", hata);
        setVeri({ ...BOS_VERI, sekme });
        message.error(hataMesaji(hata));
      })
      .finally(() => {
        if (guncelMi()) setYukleniyor(false);
      });
  }, [sekme, filtreler, sayfa, sayfaBoyutu, siralama, grupla, karsilastirmaSayacTipi, yenilemeSayaci]);

  const filtreleriUygula = useCallback((yeniFiltreler) => {
    setFiltreler(yeniFiltreler);
    setSayfa(1);
    // Filtre degismese de "Uygula" listeyi yeniler.
    setYenilemeSayaci((sayac) => sayac + 1);
  }, []);

  const sekmeDegistir = useCallback((yeniSekme) => {
    setSekme(yeniSekme);
    setSayfa(1);
  }, []);

  const sayfaDegistir = useCallback(
    (yeniSayfa, yeniBoyut) => {
      if (yeniBoyut !== sayfaBoyutu) {
        setSayfaBoyutu(yeniBoyut);
        setSayfa(1);
        return;
      }
      setSayfa(yeniSayfa);
    },
    [sayfaBoyutu]
  );

  const siralamayiDegistir = useCallback((yeniSiralama) => {
    setSiralama(yeniSiralama);
    setSayfa(1);
  }, []);

  // Sekme degisirken onceki sekmenin satirlari yeni sekmenin kolonlariyla cizilmez.
  const sekmeVerisi = veri.sekme === sekme ? veri : BOS_VERI;

  return {
    filtreler,
    sekme,
    sayfa,
    sayfaBoyutu,
    siralama,
    grupla,
    karsilastirmaSayacTipi,
    satirlar: sekmeVerisi.satirlar,
    toplam: sekmeVerisi.toplam,
    kpi,
    yukleniyor,
    filtreleriUygula,
    sekmeDegistir,
    sayfaDegistir,
    siralamayiDegistir,
    setGrupla,
    setKarsilastirmaSayacTipi,
  };
}
