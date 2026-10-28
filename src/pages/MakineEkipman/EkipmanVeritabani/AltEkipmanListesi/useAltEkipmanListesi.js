import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { message } from "antd";
import useDebounce from "../../../../hooks/useDebounce";
import { getAltEkipmanListesi, hataMesaji } from "./altEkipmanService";
import { agacSatirlari, camelCaseYap, listeSatirlari } from "./yardimcilar";
import { BOS_FILTRELER, SIRALAMA_ALANI, VARSAYILAN_SAYFA_BOYUTU } from "./sabitler";

const BOS_VERI = { gorunum: null, satirlar: [], toplam: 0 };

/**
 * Liste / agac gorunumu, filtreler, hizli sekme (`connectionStatus`), sayfa ve siralama durumu. Yalnizca acik gorunumun
 * verisi istenir (`viewMode`); KPI kartlari ayni yanittan gelir. Filtreler degisince hemen uygulanir (arama gecikmeli).
 */
export default function useAltEkipmanListesi() {
  const [gorunum, setGorunum] = useState("list");
  const [filtreler, setFiltreler] = useState(BOS_FILTRELER);
  const [baglanti, setBaglanti] = useState("ALL");
  const [sayfa, setSayfa] = useState(1);
  const [sayfaBoyutu, setSayfaBoyutu] = useState(VARSAYILAN_SAYFA_BOYUTU);
  const [siralama, setSiralama] = useState("ASC");
  const [veri, setVeri] = useState(BOS_VERI);
  const [kpi, setKpi] = useState(null);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [yenilemeSayaci, setYenilemeSayaci] = useState(0);
  const istekSirasiRef = useRef(0);
  const gecikmeliArama = useDebounce(filtreler.arama, 400);

  const govde = useMemo(
    () => ({
      viewMode: gorunum,
      search: gecikmeliArama.trim(),
      connectionStatus: baglanti,
      equipmentStatusIds: filtreler.durumIds,
      equipmentTypeIds: filtreler.tipIds,
      brandIds: filtreler.markaIds,
      warehouseIds: filtreler.depoIds,
      locationIds: filtreler.lokasyonIds,
      machineIds: filtreler.makineIds,
      page: sayfa,
      pageSize: sayfaBoyutu,
      sortBy: SIRALAMA_ALANI,
      sortOrder: siralama,
    }),
    [gorunum, gecikmeliArama, baglanti, filtreler, sayfa, sayfaBoyutu, siralama]
  );

  useEffect(() => {
    // Yanitlar atilma sirasiyla donmeyebilir; yalnizca en son istegin yaniti ekrana islenir.
    istekSirasiRef.current += 1;
    const istekSirasi = istekSirasiRef.current;
    const guncelMi = () => istekSirasi === istekSirasiRef.current;

    setYukleniyor(true);
    getAltEkipmanListesi(govde)
      .then((hamYanit) => {
        if (!guncelMi()) return;
        const yanit = camelCaseYap(hamYanit);
        if (govde.viewMode === "tree") {
          setVeri({ gorunum: "tree", satirlar: agacSatirlari(yanit.treeData?.groups), toplam: Number(yanit.treeData?.totalGroupCount) || 0 });
        } else {
          setVeri({ gorunum: "list", satirlar: listeSatirlari(yanit.listData?.items), toplam: Number(yanit.listData?.totalCount) || 0 });
        }
        if (yanit.kpi) setKpi(yanit.kpi);
      })
      .catch((hata) => {
        if (!guncelMi()) return;
        console.error("Alt ekipman listesi alınamadı:", hata);
        setVeri({ ...BOS_VERI, gorunum: govde.viewMode });
        message.error(hataMesaji(hata));
      })
      .finally(() => {
        if (guncelMi()) setYukleniyor(false);
      });
  }, [govde, yenilemeSayaci]);

  // Arama yazilirken sayfa hemen basa doner; istek gecikmeli aramayla gider.
  const filtreleriGuncelle = useCallback((degisiklik) => {
    setFiltreler((onceki) => ({ ...onceki, ...degisiklik }));
    setSayfa(1);
  }, []);

  const filtreleriSifirla = useCallback(() => {
    setFiltreler(BOS_FILTRELER);
    setSayfa(1);
  }, []);

  const baglantiDegistir = useCallback((deger) => {
    setBaglanti(deger);
    setSayfa(1);
  }, []);

  const gorunumDegistir = useCallback((deger) => {
    setGorunum(deger);
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

  const siralamayiDegistir = useCallback((yeni) => {
    setSiralama(yeni);
    setSayfa(1);
  }, []);

  const yenile = useCallback(() => setYenilemeSayaci((sayac) => sayac + 1), []);

  // Gorunum degisirken onceki gorunumun satirlari yeni kolonlarla cizilmez.
  const gorunumVerisi = veri.gorunum === gorunum ? veri : BOS_VERI;

  return {
    gorunum,
    filtreler,
    baglanti,
    sayfa,
    sayfaBoyutu,
    siralama,
    satirlar: gorunumVerisi.satirlar,
    toplam: gorunumVerisi.toplam,
    kpi,
    yukleniyor,
    filtreleriGuncelle,
    filtreleriSifirla,
    baglantiDegistir,
    gorunumDegistir,
    sayfaDegistir,
    siralamayiDegistir,
    yenile,
  };
}
