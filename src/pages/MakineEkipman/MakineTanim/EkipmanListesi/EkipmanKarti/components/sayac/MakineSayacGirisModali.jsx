import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Spin, message } from "antd";
import { FormProvider } from "react-hook-form";
import { useTranslation } from "react-i18next";
import KartModali from "../ortak/KartModali";
import ModalDugmeleri from "../ortak/ModalDugmeleri";
import SayacOkumaFormu from "./SayacOkumaFormu";
import useSayacOkumaFormu from "./useSayacOkumaFormu";
import { basariliMi } from "../../../ekipmanService";
import { getMakineSayacGuncellemeBilgi, hataMesaji, kaydiAl, yanitHatasi } from "../../ekipmanKartiService";

// Yanit alan adlari dokumanda camelCase (makineKodu, sayacId...); PascalCase gelirse de okunur. Canli API'de teyit edilecek.
const alan = (bilgi, ad) => bilgi?.[ad] ?? bilgi?.[ad.charAt(0).toUpperCase() + ad.slice(1)];

/**
 * Hizli Islemler > Sayac Gir: makinenin varsayilan sayacina okuma girisi (GetMakineSayacGuncelleBilgi).
 * Varsayilan sayac yoksa bilgi gosterilir. Kaydedince once onKaydedildi, sonra onKapat cagrilir.
 */
export default function MakineSayacGirisModali({ acik, makineId, lokasyonId, onKapat, onKaydedildi }) {
  const { t } = useTranslation();
  const [bilgi, setBilgi] = useState(null);
  const [durum, setDurum] = useState("yukleniyor");

  useEffect(() => {
    if (!acik || !makineId) return undefined;

    let iptal = false;
    const yukle = async () => {
      setBilgi(null);
      setDurum("yukleniyor");
      try {
        const yanit = await getMakineSayacGuncellemeBilgi(makineId);
        if (iptal) return;
        if (!basariliMi(yanit)) {
          message.error(yanitHatasi(yanit, t));
          setDurum("hata");
          return;
        }
        setBilgi(kaydiAl(yanit));
        setDurum("hazir");
      } catch (hata) {
        if (iptal) return;
        console.error("Sayac giris bilgisi alinamadi:", hata);
        message.error(hataMesaji(hata, t("ekipmanKarti.sayac.bilgiAlinamadi")));
        setDurum("hata");
      }
    };

    yukle();
    return () => {
      iptal = true;
    };
  }, [acik, makineId, t]);

  const sayacId = alan(bilgi, "sayacId");
  const sayac = sayacId ? { sayacId, tanim: alan(bilgi, "sayacTanimi"), guncelDeger: alan(bilgi, "mevcutDeger"), birim: alan(bilgi, "sayacBirimi") } : null;
  const { methods, kaydediliyor, kaydet } = useSayacOkumaFormu({
    acik,
    makineId,
    lokasyonId,
    sayac,
    onBasarili: () => {
      onKaydedildi();
      onKapat();
    },
  });

  const girisYapilabilir = durum === "hazir" && Boolean(sayac);
  let icerik;
  if (durum === "yukleniyor") {
    icerik = (
      <div className="flex min-h-[240px] items-center justify-center">
        <Spin />
      </div>
    );
  } else if (girisYapilabilir) {
    icerik = <SayacOkumaFormu sayac={sayac} />;
  } else {
    icerik = (
      <div className="ek-kart-bos">
        <p className="m-0 text-sm ek-kart-soluk">{durum === "hata" ? t("ekipmanKarti.sayac.bilgiAlinamadi") : t("ekipmanKarti.sayac.varsayilanSayacYok")}</p>
      </div>
    );
  }

  return (
    <KartModali
      acik={acik}
      baslik={t("ekipmanKarti.sayac.sayacGir")}
      altBaslik={[alan(bilgi, "makineKodu"), alan(bilgi, "makineTanimi")].filter(Boolean).join(" · ") || undefined}
      onKapat={onKapat}
      kapatilabilir={!kaydediliyor}
      altBilgi={girisYapilabilir ? <ModalDugmeleri onKapat={onKapat} onKaydet={kaydet} kaydediliyor={kaydediliyor} /> : <ModalDugmeleri onKapat={onKapat} />}
    >
      <FormProvider {...methods}>{icerik}</FormProvider>
    </KartModali>
  );
}

MakineSayacGirisModali.propTypes = {
  acik: PropTypes.bool.isRequired,
  makineId: PropTypes.number.isRequired,
  /** Makinenin lokasyonu (ana formdaki lokasyonID). */
  lokasyonId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  onKapat: PropTypes.func.isRequired,
  onKaydedildi: PropTypes.func.isRequired,
};
