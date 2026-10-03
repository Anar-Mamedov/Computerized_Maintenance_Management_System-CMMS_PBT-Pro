import React, { useCallback, useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { ConfigProvider, Drawer, Grid, Spin, message } from "antd";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import KartBasligi from "./components/KartBasligi";
import SekmeIcerigi from "./components/SekmeIcerigi";
import OnayModali from "./components/ortak/OnayModali";
import QRCodeGenerator from "../../../../../utils/components/QRCodeGenerator";
import useTemaDegiskenleri from "../useTemaDegiskenleri";
import useSekmeVerileri from "./useSekmeVerileri";
import { basariliMi } from "../ekipmanService";
import { getMakine, guncelleMakine, hataMesaji, kaydetAracRuhsati, kaydiAl } from "./ekipmanKartiService";
import { VARSAYILAN_DEGERLER, makineFormDegerleri, makineGuncellemeGovdesi, ruhsatGovdesi } from "./formAlanlari";
import { ILK_SEKME, SEKMELER } from "./sekmeler";
import "./ekipmanKarti.css";

// Cekmece icindeki antd form elemanlari tasarimdaki olculerle cizilir (40px yukseklik, 10px kose).
const KART_TEMASI = {
  token: {
    controlHeight: 40,
    borderRadius: 10,
    colorBorder: "#e2e7ec",
    colorText: "#101828",
    colorTextPlaceholder: "rgba(100, 116, 139, 0.7)",
  },
};

const MASKE_STILI = { backgroundColor: "rgba(16, 24, 40, 0.1)" };
const GOVDE_STILI = { padding: 0, display: "flex", flexDirection: "column", background: "var(--ek-k-zemin)" };

/**
 * Ekipman Sicil Karti (tasarim: pbt-core.lovable.app). Ekipman listesinde bir kayda tiklaninca acilir.
 * Genel, detay, finansal, yakit, ozel alan, not ve ruhsat alanlari tek formdadir; "Guncelle" UpdateMakine'ye
 * (Arac sekmesi acildiysa SaveAracRuhsat'a da) gonderir. Liste sekmelerindeki islemler aninda kaydedilir;
 * bunlardan biri yapildiysa kart kapanirken ekipman listesi de yenilenir.
 */
export default function EkipmanKarti({ makineId, acik, onKapat, onKaydedildi }) {
  const { t } = useTranslation();
  const temaDegiskenleri = useTemaDegiskenleri();
  const ekranlar = Grid.useBreakpoint();
  const [yukleniyor, setYukleniyor] = useState(false);
  const [kaydediliyor, setKaydediliyor] = useState(false);
  const [makineKaydi, setMakineKaydi] = useState(null);
  const [aktifSekme, setAktifSekme] = useState(ILK_SEKME);
  const [qrAcik, setQrAcik] = useState(false);
  const [kapatmaOnayiAcik, setKapatmaOnayiAcik] = useState(false);
  const [resimSurumu, setResimSurumu] = useState(0);
  const veriDegistiRef = useRef(false);

  const methods = useForm({ defaultValues: VARSAYILAN_DEGERLER });
  const { reset, watch, handleSubmit, formState } = methods;
  // formState bir Proxy'dir; isDirty'nin izlenmesi icin render sirasinda okunmalidir.
  const { isDirty } = formState;
  const [arac, yakitKullanir, makineKodu] = watch(["arac", "makineYakitKullanim", "makineKodu"]);

  const { altEkipmanlar, sayaclar, bakimlar } = useSekmeVerileri(acik ? makineId : null);
  const sekmeVerileri = { altEkipmanlar, sayaclar, bakimlar };

  useEffect(() => {
    if (!acik || !makineId) return undefined;

    let iptal = false;
    const yukle = async () => {
      setYukleniyor(true);
      setAktifSekme(ILK_SEKME);
      try {
        const kayit = kaydiAl(await getMakine(makineId));
        if (iptal) return;
        if (!kayit) {
          message.warning(t("ekipmanKarti.kayitBulunamadi"));
          return;
        }
        reset(makineFormDegerleri(kayit));
        setMakineKaydi(kayit);
      } catch (hata) {
        if (iptal) return;
        console.error("Ekipman bilgisi alinamadi:", hata);
        message.error(hataMesaji(hata, t("ekipmanKarti.kayitAlinamadi")));
      } finally {
        if (!iptal) setYukleniyor(false);
      }
    };

    yukle();
    return () => {
      iptal = true;
    };
  }, [acik, makineId, reset, t]);

  // Arac / Yakit sekmeleri ilgili ozellik isaretliyken gorunur; liste sekmelerinin kayit sayisi basliga yazilir.
  const kosullar = { arac, makineYakitKullanim: yakitKullanir };
  const sekmeler = SEKMELER.filter((sekme) => !sekme.kosul || kosullar[sekme.kosul]).map((sekme) => ({
    key: sekme.key,
    etiket: t(sekme.etiketKey),
    sayi: sekme.sayi && !sekmeVerileri[sekme.sayi].yukleniyor ? sekmeVerileri[sekme.sayi].kayitlar.length : undefined,
  }));
  const aktifSekmeGorunur = sekmeler.some((sekme) => sekme.key === aktifSekme);

  // Gorunurlugu kalkan sekme aciksa (ör. Arac isareti kaldirildi) ilk sekmeye donulur.
  useEffect(() => {
    if (!aktifSekmeGorunur) setAktifSekme(ILK_SEKME);
  }, [aktifSekmeGorunur]);

  const kapat = useCallback(() => {
    setKapatmaOnayiAcik(false);
    setMakineKaydi(null);
    reset(VARSAYILAN_DEGERLER);
    if (veriDegistiRef.current) {
      veriDegistiRef.current = false;
      onKaydedildi?.();
    }
    onKapat();
  }, [onKapat, onKaydedildi, reset]);

  const kapatmayiIste = () => {
    if (kaydediliyor) return;
    if (isDirty) {
      setKapatmaOnayiAcik(true);
      return;
    }
    kapat();
  };

  const kaydet = async (veri) => {
    setKaydediliyor(true);
    try {
      const yanit = await guncelleMakine(makineGuncellemeGovdesi(veri));
      if (!basariliMi(yanit)) {
        message.error(yanit?.status_code === 401 ? t("ekipmanKarti.yetkiYok") : yanit?.message || t("ekipmanKarti.guncellemeBasarisiz"));
        return;
      }
      if (veri.arac && veri.ruhsatYuklendi) {
        const ruhsatYaniti = await kaydetAracRuhsati(ruhsatGovdesi(veri));
        if (!basariliMi(ruhsatYaniti)) {
          message.error(ruhsatYaniti?.message || t("ekipmanKarti.ruhsatKaydedilemedi"));
          return;
        }
      }
      message.success(t("ekipmanKarti.guncellendi"));
      veriDegistiRef.current = true;
      kapat();
    } catch (hata) {
      console.error("Ekipman guncellenemedi:", hata);
      message.error(hataMesaji(hata, t("ekipmanKarti.guncellemeBasarisiz")));
    } finally {
      setKaydediliyor(false);
    }
  };

  // Zorunlu alan hatasi baska sekmede kalip gorunmeyebilir; Genel Bilgiler'e donulur.
  const gecersiz = () => {
    setAktifSekme(ILK_SEKME);
    message.warning(t("ekipmanKarti.zorunluAlanlar"));
  };

  return (
    <ConfigProvider theme={KART_TEMASI}>
      <FormProvider {...methods}>
        <Drawer
          open={acik}
          onClose={kapatmayiIste}
          width={ekranlar.lg ? "68%" : "100%"}
          closable={false}
          title={null}
          destroyOnClose
          keyboard={!kaydediliyor}
          rootClassName="ek-sicil ek-kart-kok"
          rootStyle={temaDegiskenleri}
          className="ek-kart-cekmece"
          styles={{ mask: MASKE_STILI, body: GOVDE_STILI }}
        >
          <KartBasligi
            sekmeler={sekmeler}
            aktifSekme={aktifSekme}
            onSekmeDegistir={setAktifSekme}
            kaydediliyor={kaydediliyor}
            yukleniyor={yukleniyor || !makineKaydi}
            onKapat={kapatmayiIste}
            onQr={() => setQrAcik(true)}
            onGuncelle={handleSubmit(kaydet, gecersiz)}
          />
          {yukleniyor || !makineKaydi ? (
            <div className="flex flex-1 items-center justify-center">
              <Spin size="large" spinning={yukleniyor} />
            </div>
          ) : (
            <SekmeIcerigi
              aktifSekme={aktifSekme}
              makineId={makineId}
              makineKaydi={makineKaydi}
              sekmeVerileri={sekmeVerileri}
              resimSurumu={resimSurumu}
              onResimDegisti={() => setResimSurumu((surum) => surum + 1)}
              onVeriDegisti={() => {
                veriDegistiRef.current = true;
              }}
            />
          )}
        </Drawer>

        <OnayModali
          acik={kapatmaOnayiAcik}
          baslik={t("ekipmanKarti.iptalOnayBaslik")}
          mesaj={t("ekipmanKarti.iptalOnayMesaj")}
          onayMetni={t("ekipmanKarti.degisiklikleriAt")}
          tehlikeli
          onOnay={kapat}
          onKapat={() => setKapatmaOnayiAcik(false)}
        />
        <QRCodeGenerator
          visible={qrAcik}
          onClose={() => setQrAcik(false)}
          value={`TB_MAKINE_ID: ${makineId ?? ""}`}
          fileName={`QR-${makineKodu ?? ""}`}
          title={t("ekipmanKarti.qrBaslik")}
        />
      </FormProvider>
    </ConfigProvider>
  );
}

EkipmanKarti.propTypes = {
  makineId: PropTypes.number,
  acik: PropTypes.bool.isRequired,
  onKapat: PropTypes.func.isRequired,
  onKaydedildi: PropTypes.func,
};
