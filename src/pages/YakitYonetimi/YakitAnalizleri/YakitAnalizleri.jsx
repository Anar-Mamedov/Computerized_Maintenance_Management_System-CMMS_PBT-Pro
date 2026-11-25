import React, { useEffect, useMemo, useRef, useState } from "react";
import { Spin, message } from "antd";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { LuFuel } from "react-icons/lu";
import useTemaDegiskenleri from "../../MakineEkipman/MakineTanim/EkipmanListesi/useTemaDegiskenleri";
import { ortakFiltreGovdesi, ortakFiltreVarsayilanlari } from "../ortak/yakitFiltresi";
import { hataMetni } from "../ortak/yakitApi";
import { getYakitAnalizDashboard } from "./yakitAnalizService";
import FiltreCubugu from "./components/FiltreCubugu";
import KpiKartlari from "./components/KpiKartlari";
import AylikTuketimGrafigi from "./components/AylikTuketimGrafigi";
import MakineTipiDagilimi from "./components/MakineTipiDagilimi";
import TankStokDurumu from "./components/TankStokDurumu";
import LokasyonDagilimi from "./components/LokasyonDagilimi";
import EnFazlaTuketenler from "./components/EnFazlaTuketenler";
import KontrolGerektirenler from "./components/KontrolGerektirenler";
import MakineTipiAnalizModali from "./components/MakineTipiAnalizModali";
import LokasyonKarsilastirmaModali from "./components/LokasyonKarsilastirmaModali";
import DetayliTablo from "./components/DetayliTablo/DetayliTablo";
import "./yakitAnalizleri.css";

/**
 * Yakit Analizleri dashboard'u (YakitAnalizController): kartlar, grafikler, tank durumu, en fazla tuketenler,
 * uyarilar (GetYakitAnalizDashboard), iki detay modali ve 4 gorunumlu detayli tablo. Tum uclar ayni filtreyi alir.
 */
export default function YakitAnalizleri() {
  const { t } = useTranslation();
  const temaDegiskenleri = useTemaDegiskenleri();
  const filtreFormu = useForm({ defaultValues: ortakFiltreVarsayilanlari() });
  const [baslangicTarihi, bitisTarihi, lokasyonIds, yakitTipIds] = filtreFormu.watch(["baslangicTarihi", "bitisTarihi", "lokasyonIds", "yakitTipIds"]);
  const filtre = useMemo(() => ortakFiltreGovdesi({ baslangicTarihi, bitisTarihi, lokasyonIds, yakitTipIds }), [baslangicTarihi, bitisTarihi, lokasyonIds, yakitTipIds]);
  // Tarih kutulari ayni gunu yeni bir nesneyle yazabilir; istek yalnizca govde gercekten degisince atilir.
  const filtreAnahtari = JSON.stringify(filtre);
  const sabitFiltre = useMemo(() => JSON.parse(filtreAnahtari), [filtreAnahtari]);

  const [veri, setVeri] = useState(null);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [acikModal, setAcikModal] = useState(null);
  const istekSirasiRef = useRef(0);

  useEffect(() => {
    // Yanitlar atilma sirasiyla donmeyebilir; yalnizca en son istegin yaniti ekrana islenir.
    istekSirasiRef.current += 1;
    const istekSirasi = istekSirasiRef.current;
    setYukleniyor(true);
    getYakitAnalizDashboard(sabitFiltre)
      .then((yanit) => istekSirasi === istekSirasiRef.current && setVeri(yanit?.data ?? null))
      .catch((error) => {
        if (istekSirasi !== istekSirasiRef.current) return;
        setVeri(null);
        message.error(hataMetni(error, t));
      })
      .finally(() => istekSirasi === istekSirasiRef.current && setYukleniyor(false));
  }, [sabitFiltre, t]);

  return (
    <div className="yakit-analizleri ya-tokenlar" style={temaDegiskenleri}>
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-3">
            <span className="ya-kpi-ikon ya-kpi-ikon--turuncu">
              <LuFuel size={18} />
            </span>
            <h2 className="m-0 text-[22px] font-bold tracking-tight">{t("yakitAnalizleri.baslik")}</h2>
          </div>
          <p className="m-0 mt-2 text-[13px] text-(--ya-muted)">{t("yakitAnalizleri.altBaslik")}</p>
        </div>
        <FormProvider {...filtreFormu}>
          <FiltreCubugu />
        </FormProvider>
      </header>

      <Spin spinning={yukleniyor}>
        <div className="flex flex-col gap-4">
          <KpiKartlari kpi={veri?.Kpis} />
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)]">
            <AylikTuketimGrafigi yil={veri?.AylikYil} aylar={veri?.AylikTuketimler} aktifAy={veri?.AktifAyOzeti} />
            <MakineTipiDagilimi dagilim={veri?.MakineTipiDagilimi} toplam={veri?.MakineTipiToplamMiktar} onTipAnalizi={() => setAcikModal("makineTipi")} />
          </div>
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            <TankStokDurumu tanklar={veri?.TankStokDurumu} />
            <LokasyonDagilimi lokasyonlar={veri?.LokasyonDagilimi} onKarsilastir={() => setAcikModal("lokasyon")} />
          </div>
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
            <EnFazlaTuketenler ekipmanlar={veri?.EnFazlaTuketenEkipmanlar} />
            <KontrolGerektirenler uyarilar={veri?.KontrolGerektirenler} />
          </div>
        </div>
      </Spin>

      <DetayliTablo filtre={sabitFiltre} />

      {veri?.GuncellemeZamani && <p className="m-0 text-[12px] text-(--ya-muted)">{t("yakitAnalizleri.guncellemeZamani", { zaman: veri.GuncellemeZamani })}</p>}

      <MakineTipiAnalizModali acik={acikModal === "makineTipi"} filtre={sabitFiltre} onKapat={() => setAcikModal(null)} />
      <LokasyonKarsilastirmaModali acik={acikModal === "lokasyon"} filtre={sabitFiltre} onKapat={() => setAcikModal(null)} />
    </div>
  );
}
