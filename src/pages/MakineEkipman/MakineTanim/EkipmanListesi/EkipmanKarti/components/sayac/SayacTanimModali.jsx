import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Spin, message } from "antd";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import KartModali from "../ortak/KartModali";
import ModalDugmeleri from "../ortak/ModalDugmeleri";
import SayacTanimFormu from "./SayacTanimFormu";
import { SAYAC_FORM_VARSAYILANLARI, sayacFormDegerleri, sayacKaydetGovdesi } from "./sayacTanimi";
import { basariliMi } from "../../../ekipmanService";
import { ekleSayac, getSayac, guncelleSayac, hataMesaji, kaydiAl, yanitHatasi } from "../../ekipmanKartiService";

/**
 * Sayac tanimi modali (Yeni Kayit / Degistir). `sayacId` yoksa yeni kayit; varsa kayit GetSayac ile yuklenir.
 * Kaydedince once onKaydedildi, sonra onKapat cagrilir.
 */
export default function SayacTanimModali({ acik, makineId, sayacId, onKapat, onKaydedildi }) {
  const { t } = useTranslation();
  const methods = useForm({ defaultValues: SAYAC_FORM_VARSAYILANLARI });
  const { reset, handleSubmit } = methods;
  const [kayit, setKayit] = useState(null);
  const [yukleniyor, setYukleniyor] = useState(false);
  const [kaydediliyor, setKaydediliyor] = useState(false);
  const [altSekme, setAltSekme] = useState("detay");
  const duzenleme = Boolean(sayacId);

  // Her acilista form sifirlanir; yukleme durumu da yeniden kurulur (onceki yukleme yarida kesilmis olabilir).
  useEffect(() => {
    if (!acik) return undefined;
    setAltSekme("detay");
    setKayit(null);
    setYukleniyor(Boolean(sayacId));
    reset(SAYAC_FORM_VARSAYILANLARI);
    if (!sayacId) return undefined;

    let iptal = false;
    const yukle = async () => {
      try {
        const yanit = await getSayac(sayacId);
        if (iptal) return;
        const bulunan = basariliMi(yanit) ? kaydiAl(yanit) : null;
        if (!bulunan) {
          message.error(yanit?.message || t("ekipmanKarti.sayac.bilgiAlinamadi"));
          return;
        }
        setKayit(bulunan);
        reset(sayacFormDegerleri(bulunan));
      } catch (hata) {
        if (iptal) return;
        console.error("Sayac bilgisi alinamadi:", hata);
        message.error(hataMesaji(hata, t("ekipmanKarti.sayac.bilgiAlinamadi")));
      } finally {
        if (!iptal) setYukleniyor(false);
      }
    };

    yukle();
    return () => {
      iptal = true;
    };
  }, [acik, sayacId, reset, t]);

  const kaydet = handleSubmit(async (veri) => {
    setKaydediliyor(true);
    try {
      const govde = sayacKaydetGovdesi(veri, { makineId, sayacId, kayit });
      const yanit = await (duzenleme ? guncelleSayac(govde) : ekleSayac(govde));
      if (!basariliMi(yanit)) {
        message.error(yanitHatasi(yanit, t));
        return;
      }
      message.success(t("ekipmanKarti.kaydedildi"));
      onKaydedildi();
      onKapat();
    } catch (hata) {
      console.error("Sayac kaydedilemedi:", hata);
      message.error(hataMesaji(hata, t("ekipmanKarti.islemBasarisiz")));
    } finally {
      setKaydediliyor(false);
    }
  });

  // Duzenlenecek kayit yuklenemediyse bos formla kaydetmeye izin verilmez.
  const kayitYok = duzenleme && !kayit;
  let icerik = <SayacTanimFormu sayacId={sayacId} kayit={kayit} altSekme={altSekme} onAltSekmeDegistir={setAltSekme} />;
  if (yukleniyor) {
    icerik = (
      <div className="flex min-h-[320px] items-center justify-center">
        <Spin />
      </div>
    );
  } else if (kayitYok) {
    icerik = (
      <div className="ek-kart-bos">
        <p className="m-0 text-sm ek-kart-soluk">{t("ekipmanKarti.sayac.bilgiAlinamadi")}</p>
      </div>
    );
  }

  return (
    <KartModali
      acik={acik}
      baslik={t("ekipmanKarti.sayac.sayacTanimi")}
      altBaslik={duzenleme ? t("ekipmanKarti.sayac.duzenleAciklama") : t("ekipmanKarti.sayac.yeniAciklama")}
      genislik={820}
      onKapat={onKapat}
      kapatilabilir={!kaydediliyor}
      altBilgi={<ModalDugmeleri onKapat={onKapat} onKaydet={kaydet} kaydediliyor={kaydediliyor} kaydetDevreDisi={yukleniyor || kayitYok} />}
    >
      <FormProvider {...methods}>{icerik}</FormProvider>
    </KartModali>
  );
}

SayacTanimModali.propTypes = {
  acik: PropTypes.bool.isRequired,
  makineId: PropTypes.number.isRequired,
  /** Duzenlenecek sayacin TB_SAYAC_ID'si; yeni kayitta null. */
  sayacId: PropTypes.number,
  onKapat: PropTypes.func.isRequired,
  onKaydedildi: PropTypes.func.isRequired,
};
