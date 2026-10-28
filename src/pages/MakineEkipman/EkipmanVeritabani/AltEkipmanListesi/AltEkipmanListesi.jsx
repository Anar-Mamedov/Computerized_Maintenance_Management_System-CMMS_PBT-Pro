import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Grid, Pagination, theme } from "antd";
import { useTranslation } from "react-i18next";
import Baslik from "./components/Baslik";
import KpiKartlari from "./components/KpiKartlari";
import FiltreCubugu from "./components/FiltreCubugu";
import SecimBandi from "./components/SecimBandi";
import ListeTablosu from "./components/ListeTablosu";
import AgacTablosu from "./components/AgacTablosu";
import IslemModallari from "./components/IslemModallari";
import useAltEkipmanListesi from "./useAltEkipmanListesi";
import { agactanBul } from "./yardimcilar";
import { SAYFA_BOYUTLARI } from "./sabitler";
import { formatNumberWithSeparators } from "../../../../utils/numberLocale";
import "./altEkipmanListesi.css";

/** Alt Ekipman Veritabani ekrani (tasarim: equip-tree, API: GetEkipmanVeritabaniListe liste / agac + KPI). */
export default function AltEkipmanListesi() {
  const { t, i18n } = useTranslation();
  const { token } = theme.useToken();
  const liste = useAltEkipmanListesi();
  const { satirlar, yenile } = liste;
  // Genis ekranda ust bolum sabit kalir, yalnizca tablo govdesi kayar; dar ekranda sayfanin tamami kayar.
  const govdeKayar = Boolean(Grid.useBreakpoint().lg);
  const [seciliAnahtarlar, setSeciliAnahtarlar] = useState([]);
  const [islem, setIslem] = useState(null);

  // Liste yenilenince ya da gorunum degisince secim sifirlanir; baska sayfanin kayitlari secili kalmaz.
  useEffect(() => {
    setSeciliAnahtarlar([]);
  }, [satirlar]);

  const seciliSatirlar = useMemo(() => agactanBul(satirlar, seciliAnahtarlar), [satirlar, seciliAnahtarlar]);
  // Ust "Ekle" ve yesil "Islemler" yalnizca tek bir kayit secildiginde o kayit uzerinde calisir.
  const hedefKayit = seciliSatirlar.length === 1 ? seciliSatirlar[0] : null;

  const islemYap = useCallback((anahtar, kayit) => setIslem({ anahtar, kayit }), []);
  const detayAc = useCallback((kayit) => setIslem({ anahtar: "detay", kayit }), []);
  const islemKapandi = useCallback(() => setIslem(null), []);
  const islemTamamlandi = useCallback(() => {
    setIslem(null);
    yenile();
  }, [yenile]);

  const tabloOrtak = {
    satirlar,
    yukleniyor: liste.yukleniyor,
    govdeKayar,
    seciliAnahtarlar,
    onSecimDegistir: setSeciliAnahtarlar,
    onDetay: detayAc,
    onIslem: islemYap,
  };
  const sayi = (deger) => formatNumberWithSeparators(deger, i18n.language);
  const toplamSayfa = Math.max(1, Math.ceil(liste.toplam / liste.sayfaBoyutu));

  return (
    <div className={`alt-ekipman-listesi ${govdeKayar ? "alt-ekipman-listesi--sabit" : "alt-ekipman-listesi--kayan"}`} style={{ "--ae-marka": token.colorPrimary }}>
      <Baslik gorunum={liste.gorunum} onGorunumDegistir={liste.gorunumDegistir} hedefKayit={hedefKayit} onIslem={islemYap} />
      <KpiKartlari kpi={liste.kpi} baglanti={liste.baglanti} onBaglantiDegistir={liste.baglantiDegistir} />
      <FiltreCubugu
        filtreler={liste.filtreler}
        onFiltreDegistir={liste.filtreleriGuncelle}
        onSifirla={liste.filtreleriSifirla}
        kpi={liste.kpi}
        baglanti={liste.baglanti}
        onBaglantiDegistir={liste.baglantiDegistir}
      />
      <SecimBandi seciliSatirlar={seciliSatirlar} onTemizle={() => setSeciliAnahtarlar([])} />

      <div className="ae-kart ae-liste-karti">
        {liste.gorunum === "tree" ? (
          <AgacTablosu {...tabloOrtak} />
        ) : (
          <ListeTablosu {...tabloOrtak} siralama={liste.siralama} onSirala={liste.siralamayiDegistir} />
        )}
        <div className="ae-sayfalama">
          <span className="ae-soluk">
            {t(liste.gorunum === "tree" ? "altEkipmanVeritabani.sayfaBilgisiAgac" : "altEkipmanVeritabani.sayfaBilgisi", {
              toplam: sayi(liste.toplam),
              sayfa: sayi(liste.sayfa),
              toplamSayfa: sayi(toplamSayfa),
            })}
          </span>
          <Pagination size="small" current={liste.sayfa} pageSize={liste.sayfaBoyutu} total={liste.toplam} showSizeChanger pageSizeOptions={SAYFA_BOYUTLARI} onChange={liste.sayfaDegistir} />
        </div>
      </div>

      <IslemModallari islem={islem} onKapat={islemKapandi} onTamamlandi={islemTamamlandi} />
    </div>
  );
}
