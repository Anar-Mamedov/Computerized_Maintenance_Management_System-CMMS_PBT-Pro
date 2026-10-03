import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Grid, message } from "antd";
import { useTranslation } from "react-i18next";
import KpiKartlari from "./components/KpiKartlari";
import AracCubugu from "./components/AracCubugu/AracCubugu";
import GelismisFiltreler from "./components/AracCubugu/GelismisFiltreler";
import AktifFiltreler from "./components/AktifFiltreler";
import EkipmanTablosu from "./components/EkipmanTablosu";
import EkipmanKartlari from "./components/EkipmanKartlari";
import Sayfalama from "./components/Sayfalama";
import KolonAyarlari from "./components/KolonAyarlari";
import IslemModallari from "./components/islemler/IslemModallari";
import EkipmanKarti from "./EkipmanKarti/EkipmanKarti";
import QRCodeGenerator from "../../../../utils/components/QRCodeGenerator";
import useEkipmanListesi from "./useEkipmanListesi";
import useFiltreSecenekleri from "./useFiltreSecenekleri";
import useTemaDegiskenleri from "./useTemaDegiskenleri";
import useKolonAyarlari from "./useKolonAyarlari";
import { getEkipmanExcelListesi } from "./ekipmanService";
import { ekipmanFormunuAc } from "./ekipmanFormu";
import { excelGovdesiOlustur } from "./listeIstegi";
import { exceleAktar } from "./disaAktarma";
import { DEPOLAMA_ANAHTARLARI } from "./constants";
import { tercihOku, tercihYaz } from "./tercihler";
import "./ekipmanListesi.css";

// KPI kartlari tek secimlidir: bir kart acilinca digerlerinin filtresi kalkar.
const KPI_FILTRELERI_BOS = { arizali: null, bakimDurumu: null, acikIsEmri: null };

/** Ekipman Listesi ekrani (tasarim: equipment-central, API: GetEkipmanFullList). */
export default function EkipmanListesi() {
  const { t, i18n } = useTranslation();
  const temaDegiskenleri = useTemaDegiskenleri();
  const liste = useEkipmanListesi();
  const { satirlar, filtreler, filtreleriGuncelle, yenile } = liste;
  const kolonAyarlari = useKolonAyarlari(satirlar);
  // Genis ekranda ust bolum sabit kalir, yalnizca tablo govdesi kayar. Dar ekranda sabit ust bolum
  // dikey alanin cogunu kaplayacagi icin sayfanin tamami kayar.
  const ekranlar = Grid.useBreakpoint();
  const govdeKayar = Boolean(ekranlar.lg);

  const [gorunum, setGorunum] = useState(() => (tercihOku(DEPOLAMA_ANAHTARLARI.gorunum, "liste") === "kartlar" ? "kartlar" : "liste"));
  const [seciliAnahtarlar, setSeciliAnahtarlar] = useState([]);
  const [gelismisAcik, setGelismisAcik] = useState(false);
  const [kolonAyarlariAcik, setKolonAyarlariAcik] = useState(false);
  const [excelHazirlaniyor, setExcelHazirlaniyor] = useState(false);
  const [aktifIslem, setAktifIslem] = useState(null);
  const [detaySatiri, setDetaySatiri] = useState(null);
  const [qrSatiri, setQrSatiri] = useState(null);

  // Cip etiketleri icin secenekler; gelismis filtrelerinkiler cekmece acilinca ya da dashboard'dan secili geldiginde yuklenir.
  const gelismisGerekli =
    gelismisAcik || filtreler.markaIds.length > 0 || filtreler.modelIds.length > 0 || filtreler.atolyeIds.length > 0 || filtreler.durumIds.length > 0;
  const secenekler = useFiltreSecenekleri(gelismisGerekli);

  // Liste her yenilendiginde secim sifirlanir; baska sayfanin kayitlari secili kalmaz.
  useEffect(() => {
    setSeciliAnahtarlar([]);
  }, [satirlar]);

  const seciliSatirlar = useMemo(() => satirlar.filter((satir) => seciliAnahtarlar.includes(satir.clientKey)), [satirlar, seciliAnahtarlar]);

  const gorunumuDegistir = (yeniGorunum) => {
    setGorunum(yeniGorunum);
    tercihYaz(DEPOLAMA_ANAHTARLARI.gorunum, yeniGorunum);
  };

  // Ayni karta tekrar basmak filtresini kapatir, baska karta basmak oncekini kaldirir; "Toplam Ekipman" hepsini kaldirir.
  const kpiFiltresi = (filtre) => {
    if (filtre === "temizle") filtreleriGuncelle(KPI_FILTRELERI_BOS);
    if (filtre === "arizali") filtreleriGuncelle({ ...KPI_FILTRELERI_BOS, arizali: filtreler.arizali === true ? null : true });
    if (filtre === "gecikti") filtreleriGuncelle({ ...KPI_FILTRELERI_BOS, bakimDurumu: filtreler.bakimDurumu === "Gecikti" ? null : "Gecikti" });
    if (filtre === "acikIsEmri") filtreleriGuncelle({ ...KPI_FILTRELERI_BOS, acikIsEmri: filtreler.acikIsEmri === true ? null : true });
  };

  const islemYap = useCallback((anahtar, secilenler) => {
    if (anahtar === "detay") {
      setDetaySatiri(secilenler[0]);
      return;
    }
    if (anahtar === "barkod") {
      setQrSatiri(secilenler[0]);
      return;
    }
    if (anahtar === "form") {
      ekipmanFormunuAc(secilenler[0].TB_MAKINE_ID, t);
      return;
    }
    setAktifIslem({ anahtar, satirlar: secilenler });
  }, [t]);

  const islemTamamlandi = useCallback(() => {
    setAktifIslem(null);
    yenile();
  }, [yenile]);

  const exceleAktarTiklandi = async () => {
    setExcelHazirlaniyor(true);
    try {
      const response = await getEkipmanExcelListesi(excelGovdesiOlustur(liste.listeParametreleri));
      const kayitlar = Array.isArray(response) ? response : Array.isArray(response?.ekipman_listesi) ? response.ekipman_listesi : [];
      if (kayitlar.length === 0) {
        message.warning(t("ekipmanListesi.excelVeriYok"));
        return;
      }
      exceleAktar(kayitlar, kolonAyarlari.gorunurKolonlar, t, i18n.language);
    } catch (error) {
      console.error("Ekipman listesi Excel'e aktarılamadı:", error);
      message.error(t("hataOlustu"));
    } finally {
      setExcelHazirlaniyor(false);
    }
  };

  return (
    <div className={`ekipman-listesi ${govdeKayar ? "ekipman-listesi--sabit" : "ekipman-listesi--kayan"}`} style={temaDegiskenleri}>
      <KpiKartlari kpi={liste.kpi} filtreler={filtreler} onKpiFiltresi={kpiFiltresi} />

      <div className="flex flex-col gap-3">
        <AracCubugu
          filtreler={filtreler}
          isAktif={liste.isAktif}
          arama={liste.arama}
          seciliSatirlar={seciliSatirlar}
          gorunum={gorunum}
          onGorunumDegistir={gorunumuDegistir}
          excelHazirlaniyor={excelHazirlaniyor}
          onFiltreDegistir={filtreleriGuncelle}
          onKayitDurumuDegistir={liste.kayitDurumunuDegistir}
          onAramaDegistir={liste.aramayiDegistir}
          onGelismisFiltreler={() => setGelismisAcik(true)}
          onIslem={islemYap}
          onExcel={exceleAktarTiklandi}
          onKolonAyarlari={() => setKolonAyarlariAcik(true)}
          onEkipmanEklendi={yenile}
        />
        <AktifFiltreler filtreler={filtreler} secenekler={secenekler} onFiltreDegistir={filtreleriGuncelle} onTumunuTemizle={liste.filtreleriTemizle} />
      </div>

      <div className="ek-kart ek-liste-karti">
        {gorunum === "liste" ? (
          <EkipmanTablosu
            satirlar={satirlar}
            yukleniyor={liste.yukleniyor}
            seciliAnahtarlar={seciliAnahtarlar}
            onSecimDegistir={setSeciliAnahtarlar}
            siralama={liste.siralama}
            onSirala={liste.siralamayiDegistir}
            gorunurKolonlar={kolonAyarlari.gorunurKolonlar}
            onGenislikDegistir={kolonAyarlari.genislikDegistir}
            onDetay={setDetaySatiri}
            onIslem={islemYap}
            govdeKayar={govdeKayar}
          />
        ) : (
          <EkipmanKartlari
            satirlar={satirlar}
            yukleniyor={liste.yukleniyor}
            seciliAnahtarlar={seciliAnahtarlar}
            onSecimDegistir={setSeciliAnahtarlar}
            onDetay={setDetaySatiri}
            onIslem={islemYap}
            govdeKayar={govdeKayar}
          />
        )}
        <Sayfalama sayfa={liste.sayfa} sayfaBoyutu={liste.sayfaBoyutu} toplam={liste.toplam} onSayfaDegistir={liste.setSayfa} onSayfaBoyutuDegistir={liste.sayfaBoyutunuDegistir} />
      </div>

      <GelismisFiltreler acik={gelismisAcik} onKapat={() => setGelismisAcik(false)} filtreler={filtreler} onFiltreDegistir={filtreleriGuncelle} />
      <KolonAyarlari
        acik={kolonAyarlariAcik}
        kolonlar={kolonAyarlari.kolonlar}
        onGorunurlukDegistir={kolonAyarlari.gorunurlukDegistir}
        onSiraDegistir={kolonAyarlari.siraDegistir}
        onSifirla={kolonAyarlari.sifirla}
        onKapat={() => setKolonAyarlariAcik(false)}
      />
      <IslemModallari aktifIslem={aktifIslem} onKapat={() => setAktifIslem(null)} onTamamlandi={islemTamamlandi} />
      <EkipmanKarti makineId={detaySatiri?.TB_MAKINE_ID ?? null} acik={Boolean(detaySatiri)} onKapat={() => setDetaySatiri(null)} onKaydedildi={yenile} />
      <QRCodeGenerator
        visible={Boolean(qrSatiri)}
        onClose={() => setQrSatiri(null)}
        value={`TB_MAKINE_ID: ${qrSatiri?.TB_MAKINE_ID ?? ""}`}
        fileName={`QR-${qrSatiri?.MKN_KOD ?? ""}`}
        title={t("ekipmanListesi.qrBaslik")}
      />
    </div>
  );
}
