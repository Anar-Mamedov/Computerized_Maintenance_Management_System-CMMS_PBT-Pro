import React, { useState } from "react";
import { Grid, Pagination, Tabs, message, theme } from "antd";
import { useTranslation } from "react-i18next";
import FiltreCubugu from "./components/FiltreCubugu";
import KpiKartlari from "./components/KpiKartlari";
import HareketTablosu from "./components/HareketTablosu";
import EkipmanOzetiTablosu from "./components/EkipmanOzetiTablosu";
import Karsilastirma from "./components/Karsilastirma";
import HareketDetayiModali from "./components/HareketDetayiModali";
import useSayacHareketleri, { sekmeGovdesi } from "./useSayacHareketleri";
import { excelHataMesaji, exceleAktar } from "./excelIndir";
import { SAYFA_BOYUTLARI, SEKMELER } from "./sabitler";
import { sayiMetni } from "./yardimcilar";
import "./sayacHareketleri.css";

/** Sayac Hareketleri ekrani (tasarim: image-to-web-page-canvas, API: CounterMovement/*). */
export default function SayacHareketleri() {
  const { t, i18n } = useTranslation();
  const { token } = theme.useToken();
  const liste = useSayacHareketleri();
  // Genis ekranda ust bolum sabit kalir, yalnizca tablo govdesi kayar; dar ekranda sayfanin tamami kayar.
  const govdeKayar = Boolean(Grid.useBreakpoint().lg);
  const [detayId, setDetayId] = useState(null);
  const [indiriliyor, setIndiriliyor] = useState(false);
  const sekme = SEKMELER.find((oge) => oge.key === liste.sekme);
  const sayi = (deger) => sayiMetni(deger, i18n.language);

  // "Indir" acik sekmenin uygulanmis filtreleriyle, sayfalamasiz calisir.
  const indir = async () => {
    setIndiriliyor(true);
    try {
      const govde = sekmeGovdesi({ ...liste, sayfa: undefined, sayfaBoyutu: undefined });
      const veriVar = await exceleAktar({ govde, excelTab: sekme.excelTab, dosyaAdi: `${t("sayacHareketleri.baslik")} - ${t(sekme.labelKey)}` });
      if (!veriVar) message.warning(t("sayacHareketleri.excelVeriYok"));
    } catch (hata) {
      console.error("Sayaç hareketleri Excel'e aktarılamadı:", hata);
      message.error(await excelHataMesaji(hata));
    } finally {
      setIndiriliyor(false);
    }
  };

  return (
    <div className={`sayac-hareketleri ${govdeKayar ? "sayac-hareketleri--sabit" : "sayac-hareketleri--kayan"}`} style={{ "--sh-marka": token.colorPrimary }}>
      <div className="sh-baslik">
        <h1>{t("sayacHareketleri.baslik")}</h1>
        <p className="sh-soluk">{t("sayacHareketleri.altBaslik")}</p>
      </div>

      <FiltreCubugu onUygula={liste.filtreleriUygula} onIndir={indir} indiriliyor={indiriliyor} />
      <Tabs className="sh-sekmeler" activeKey={liste.sekme} onChange={liste.sekmeDegistir} items={SEKMELER.map((oge) => ({ key: oge.key, label: t(oge.labelKey) }))} />
      <KpiKartlari kpi={liste.kpi} />

      {liste.sekme === "karsilastirma" ? (
        <Karsilastirma
          satirlar={liste.satirlar}
          birim={liste.birim}
          yukleniyor={liste.yukleniyor}
          grupla={liste.grupla}
          onGruplaDegistir={liste.setGrupla}
          onSayacTipiDegistir={liste.setKarsilastirmaSayacTipi}
        />
      ) : (
        <div className="sh-kart sh-liste-karti">
          {liste.sekme === "hareketler" ? (
            <HareketTablosu
              satirlar={liste.satirlar}
              yukleniyor={liste.yukleniyor}
              govdeKayar={govdeKayar}
              siralama={liste.siralama}
              onSirala={liste.siralamayiDegistir}
              onDetay={setDetayId}
            />
          ) : (
            <EkipmanOzetiTablosu satirlar={liste.satirlar} yukleniyor={liste.yukleniyor} govdeKayar={govdeKayar} />
          )}
          <div className="sh-sayfalama">
            <span className="sh-soluk">
              {t("sayacHareketleri.sayfaBilgisi", { toplam: sayi(liste.toplam), sayfa: sayi(liste.sayfa), toplamSayfa: sayi(Math.max(1, Math.ceil(liste.toplam / liste.sayfaBoyutu))) })}
            </span>
            <Pagination
              size="small"
              current={liste.sayfa}
              pageSize={liste.sayfaBoyutu}
              total={liste.toplam}
              showSizeChanger
              pageSizeOptions={SAYFA_BOYUTLARI}
              onChange={liste.sayfaDegistir}
            />
          </div>
        </div>
      )}

      <HareketDetayiModali readingId={detayId} onKapat={() => setDetayId(null)} />
    </div>
  );
}
