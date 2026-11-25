import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Grid, Pagination, message } from "antd";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";
import useTemaDegiskenleri from "../../MakineEkipman/MakineTanim/EkipmanListesi/useTemaDegiskenleri";
import { ortakFiltreVarsayilanlari } from "../ortak/yakitFiltresi";
import { hataMetni } from "../ortak/yakitApi";
import { exceleAktar } from "../ortak/exceleAktar";
import { sayi } from "../ortak/yakitBicim";
import KpiKartlari from "./components/KpiKartlari";
import AracCubugu from "./components/AracCubugu";
import IslemTablosu from "./components/IslemTablosu";
import SilmeOnayModali from "./components/SilmeOnayModali";
import YakitFisModali from "./components/YakitFisModali/YakitFisModali";
import useYakitStokIslemListesi, { SAYFA_BOYUTLARI } from "./useYakitStokIslemListesi";
import useYakitTanklari from "./useYakitTanklari";
import { getYakitStokIslemListesi } from "./yakitStokIslemService";
import "./yakitStokIslemleri.css";

const GC_ISLEM_TIPI = { G: "GIRIS", C: "CIKIS", T: "TRANSFER" };

/**
 * Yakit Stok Islemleri: yalnizca yakit stok fisleri (TB_STOK_FIS giris / cikis / transfer). Listeler, detayini
 * gosterir, yeni fis olusturur, gunceller ve siler (dokuman 4. bolum).
 */
export default function YakitStokIslemleri() {
  const { t, i18n } = useTranslation();
  const temaDegiskenleri = useTemaDegiskenleri();
  const govdeKayar = Boolean(Grid.useBreakpoint().lg);
  const filtreFormu = useForm({ defaultValues: { ...ortakFiltreVarsayilanlari(), islemTuru: "TUMU", arama: "" } });
  const [baslangicTarihi, bitisTarihi, lokasyonIds, yakitTipIds, islemTuru, arama] = filtreFormu.watch([
    "baslangicTarihi",
    "bitisTarihi",
    "lokasyonIds",
    "yakitTipIds",
    "islemTuru",
    "arama",
  ]);
  const liste = useYakitStokIslemListesi({ baslangicTarihi, bitisTarihi, lokasyonIds, yakitTipIds, islemTuru, arama });
  const tankListesi = useYakitTanklari();

  const [seciliAnahtarlar, setSeciliAnahtarlar] = useState([]);
  const [fisAcilisi, setFisAcilisi] = useState(null);
  const [silinecekIdler, setSilinecekIdler] = useState([]);
  const [excelHazirlaniyor, setExcelHazirlaniyor] = useState(false);

  // Liste yenilenince secim sifirlanir; baska sayfanin kayitlari secili kalmaz.
  useEffect(() => {
    setSeciliAnahtarlar([]);
  }, [liste.satirlar]);

  const seciliIdler = useMemo(
    () => liste.satirlar.filter((satir) => seciliAnahtarlar.includes(satir.clientKey)).map((satir) => satir.TB_STOK_FIS_ID),
    [liste.satirlar, seciliAnahtarlar]
  );

  const { yenile: listeyiYenile } = liste;
  const { yenile: tanklariYenile } = tankListesi;
  // Kayit, guncelleme ve silmeden sonra hem liste hem tank secenekleri (stoklar degisti) yenilenir.
  const herSeyiYenile = useCallback(() => {
    listeyiYenile();
    tanklariYenile();
  }, [listeyiYenile, tanklariYenile]);

  const fisModaliniKapat = useCallback(() => setFisAcilisi(null), []);

  const exceleAktarTiklandi = async () => {
    setExcelHazirlaniyor(true);
    try {
      const yanit = await getYakitStokIslemListesi(liste.excelGovdesi);
      const kayitlar = yanit?.data?.Liste ?? [];
      if (kayitlar.length === 0) {
        message.warning(t("yakitStokIslemleri.excelVeriYok"));
        return;
      }
      const tarihMetni = (satir) => (satir.Tarih ? dayjs(satir.Tarih).locale(i18n.language).format("L") : "");
      exceleAktar({
        satirlar: kayitlar,
        dosyaAdi: t("yakitStokIslemleri.excelDosyaAdi"),
        sutunlar: [
          { baslik: t("yakitStokIslemleri.kolon.tarih"), deger: tarihMetni, genislik: 12 },
          { baslik: t("yakitStokIslemleri.kolon.saat"), deger: (satir) => satir.Saat, genislik: 8 },
          { baslik: t("yakitStokIslemleri.kolon.islemTuru"), deger: (satir) => (GC_ISLEM_TIPI[satir.GC] ? t(`yakitOrtak.islemTuru.${GC_ISLEM_TIPI[satir.GC]}`) : satir.IslemTuru) },
          { baslik: t("yakitStokIslemleri.kolon.yakitTipi"), deger: (satir) => satir.YakitTipi },
          { baslik: t("yakitStokIslemleri.kolon.yakitTanimi"), deger: (satir) => satir.YakitTanimi },
          { baslik: t("yakitStokIslemleri.kolon.miktar"), deger: (satir) => satir.Miktar },
          { baslik: t("yakitStokIslemleri.kolon.birimFiyat"), deger: (satir) => satir.BirimFiyat },
          { baslik: t("yakitStokIslemleri.kolon.tutar"), deger: (satir) => satir.Tutar },
          { baslik: t("yakitStokIslemleri.kolon.lokasyon"), deger: (satir) => satir.Lokasyon },
          { baslik: t("yakitStokIslemleri.kolon.kaynakDepo"), deger: (satir) => satir.KaynakDepo, genislik: 22 },
          { baslik: t("yakitStokIslemleri.kolon.hedefDepo"), deger: (satir) => satir.HedefDepo, genislik: 22 },
          { baslik: t("yakitStokIslemleri.kolon.aciklama"), deger: (satir) => satir.Aciklama, genislik: 30 },
        ],
      });
    } catch (error) {
      message.error(hataMetni(error, t));
    } finally {
      setExcelHazirlaniyor(false);
    }
  };

  return (
    <div className={`yakit-stok-islemleri ys-tokenlar ${govdeKayar ? "yakit-stok-islemleri--sabit" : ""}`} style={temaDegiskenleri}>
      <KpiKartlari ozetler={liste.ozetler} />

      <FormProvider {...filtreFormu}>
        <AracCubugu
          seciliSayisi={seciliIdler.length}
          excelHazirlaniyor={excelHazirlaniyor}
          onExcel={exceleAktarTiklandi}
          onSil={() => setSilinecekIdler(seciliIdler)}
          onYeniIslem={(islemTipi) => setFisAcilisi({ islemTipi })}
        />
      </FormProvider>

      <div className="ys-kart ys-liste-karti">
        <IslemTablosu
          satirlar={liste.satirlar}
          yukleniyor={liste.yukleniyor}
          seciliAnahtarlar={seciliAnahtarlar}
          onSecimDegistir={setSeciliAnahtarlar}
          siralama={liste.siralama}
          onSirala={liste.setSiralama}
          onDetay={(satir) => setFisAcilisi({ fisId: satir.TB_STOK_FIS_ID })}
          govdeKayar={govdeKayar}
        />
        <div className="flex justify-end border-t border-(--ys-border) px-3 py-3">
          <Pagination
            current={liste.sayfa}
            pageSize={liste.sayfaBoyutu}
            total={liste.toplam}
            showSizeChanger
            pageSizeOptions={SAYFA_BOYUTLARI}
            showTotal={(toplam) => t("yakitStokIslemleri.toplamKayit", { toplam: sayi(toplam, i18n.language) })}
            onChange={(yeniSayfa, yeniBoyut) => (yeniBoyut !== liste.sayfaBoyutu ? liste.sayfaBoyutunuDegistir(yeniBoyut) : liste.setSayfa(yeniSayfa))}
          />
        </div>
      </div>

      <YakitFisModali acilis={fisAcilisi} tanklar={tankListesi.tanklar} yakitKartlari={tankListesi.yakitKartlari} onKapat={fisModaliniKapat} onKaydedildi={herSeyiYenile} />
      <SilmeOnayModali ids={silinecekIdler} onKapat={() => setSilinecekIdler([])} onSilindi={herSeyiYenile} />
    </div>
  );
}
