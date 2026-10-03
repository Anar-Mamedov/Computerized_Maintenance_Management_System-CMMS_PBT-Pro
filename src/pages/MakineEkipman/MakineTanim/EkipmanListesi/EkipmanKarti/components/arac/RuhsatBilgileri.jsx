import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Spin, message } from "antd";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { LuInfo } from "react-icons/lu";
import Alan from "../ortak/Alan";
import Bolum from "../ortak/Bolum";
import HatirlaticiTarihler from "./HatirlaticiTarihler";
import TextInput from "../../../../../../../utils/components/Form/TextInput";
import KodIDSelectbox from "../../../../../../../utils/components/KodIDSelectbox";
import AracKodSelectbox from "../../../../../../../utils/components/AracKodSelectbox";
import FullDatePicker from "../../../../../../../utils/components/FullDatePicker";
import { basariliMi } from "../../../ekipmanService";
import { getAracRuhsati, hataMesaji, kaydiAl } from "../../ekipmanKartiService";
import { ruhsatFormDegerleri } from "../../formAlanlari";
import { KOD_GRUPLARI } from "./aracFormAlanlari";

// Ekranda girdisi olmayan ruhsat alanlari. resetField yalnizca kayitli alanlara yazdigi icin gizli Controller ile kaydedilir.
const GIZLI_ALANLAR = ["aracId", "ruhsatYuklendi", "muayeneKalanGun", "egzozKalanGun", "vergiKalanGun"];

/**
 * Ruhsat bilgileri ve hatirlatici tarihler (ana formdaki alanlar; kayit cekmecenin "Guncelle" dugmesiyle yapilir).
 * Alt sekme gorundugunde ruhsat henuz yuklenmediyse GetAracRuhsatByMakineId ile doldurulur. Degerler resetField ile
 * varsayilan olarak yazilir; boylece yukleme formu "degisti" saydirmaz.
 */
export default function RuhsatBilgileri({ makineId, gorunur }) {
  const { t } = useTranslation();
  const { control, getValues, resetField, setValue } = useFormContext();
  const ilId = useWatch({ control, name: "ruhsatIlID" });
  const [yukleniyor, setYukleniyor] = useState(false);

  useEffect(() => {
    if (!gorunur || getValues("ruhsatYuklendi")) return undefined;

    let iptal = false;
    const yukle = async () => {
      setYukleniyor(true);
      try {
        const yanit = await getAracRuhsati(makineId);
        if (iptal) return;
        const kayit = basariliMi(yanit) ? kaydiAl(yanit) : null;
        if (!kayit) {
          message.error(yanit?.message || t("ekipmanKarti.arac.ruhsatAlinamadi"));
          return;
        }
        Object.entries(ruhsatFormDegerleri(kayit)).forEach(([alan, deger]) => resetField(alan, { defaultValue: deger }));
      } catch (hata) {
        if (iptal) return;
        console.error("Ruhsat bilgisi alinamadi:", hata);
        message.error(hataMesaji(hata, t("ekipmanKarti.arac.ruhsatAlinamadi")));
      } finally {
        if (!iptal) setYukleniyor(false);
      }
    };

    yukle();
    return () => {
      iptal = true;
    };
  }, [gorunur, makineId, getValues, resetField, t]);

  // Il degisince ilce listesi de degisir; secili ilce temizlenir.
  const ilDegisti = () => {
    setValue("ruhsatIlce", null, { shouldDirty: true });
    setValue("ruhsatIlceID", null, { shouldDirty: true });
  };

  const secimYapiniz = t("ekipmanKarti.secimYapiniz");

  return (
    <Spin spinning={yukleniyor}>
      {GIZLI_ALANLAR.map((alan) => (
        <Controller key={alan} name={alan} control={control} render={() => null} />
      ))}
      <div className="space-y-5">
        <Bolum baslik={t("ekipmanKarti.arac.ruhsatBilgileri")} altBaslik={t("ekipmanKarti.arac.ruhsatBilgileriAciklama")}>
          <div className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2 xl:grid-cols-3">
            <Alan etiket={t("ekipmanKarti.arac.plaka")}>
              <TextInput name="ruhsatPlaka" />
            </Alan>
            <Alan etiket={t("ekipmanKarti.arac.ruhsatSahibi")}>
              <KodIDSelectbox name1="ruhsatSahip" kodID={KOD_GRUPLARI.ruhsatSahibi} placeholder={secimYapiniz} />
            </Alan>
            <Alan etiket={t("ekipmanKarti.arac.aracSinifi")}>
              <TextInput name="ruhsatAracSinifi" />
            </Alan>
            <Alan etiket={t("ekipmanKarti.arac.verildigiIl")}>
              <AracKodSelectbox name1="ruhsatIl" tip="SEHIR" placeholder={secimYapiniz} onChange={ilDegisti} />
            </Alan>
            <Alan etiket={t("ekipmanKarti.arac.verildigiIlce")}>
              <AracKodSelectbox name1="ruhsatIlce" tip="ILCE" parentId={ilId} parentRequired placeholder={secimYapiniz} />
            </Alan>
            <Alan etiket={t("ekipmanKarti.arac.belgeSeriNo")}>
              <TextInput name="ruhsatBelgeSeriNo" />
            </Alan>
            <Alan etiket={t("ekipmanKarti.arac.tescilSiraNo")}>
              <TextInput name="ruhsatTescilNo" />
            </Alan>
            <Alan etiket={t("ekipmanKarti.arac.tescilTarihi")}>
              <FullDatePicker name1="ruhsatTescilTarihi" />
            </Alan>
            <Alan etiket={t("ekipmanKarti.arac.ilkTescilTarihi")}>
              <FullDatePicker name1="ruhsatIlkTescilTarihi" />
            </Alan>
            <Alan etiket={t("ekipmanKarti.arac.ticariAdi")}>
              <TextInput name="ruhsatTicariAdi" />
            </Alan>
            <Alan etiket={t("ekipmanKarti.arac.aracCinsi")}>
              <KodIDSelectbox name1="ruhsatAracCinsi" kodID={KOD_GRUPLARI.aracCinsi} placeholder={secimYapiniz} />
            </Alan>
            <Alan etiket={t("ekipmanKarti.arac.kullanimAmaci")}>
              <TextInput name="ruhsatKullanimAmaci" />
            </Alan>
            <Alan etiket={t("ekipmanKarti.arac.azamiYukluAgirlik")}>
              <TextInput name="ruhsatIstiapHaddi" placeholder={t("ekipmanKarti.arac.kg")} />
            </Alan>
            <Alan etiket={t("ekipmanKarti.arac.romorkAzamiYukluAgirlik")}>
              <TextInput name="ruhsatRomorkIstiapHaddi" placeholder={t("ekipmanKarti.arac.kg")} />
            </Alan>
            <Alan etiket={t("ekipmanKarti.arac.koltukSayisi")}>
              <TextInput name="ruhsatKoltukSayisi" placeholder="0" />
            </Alan>
            <Alan etiket={t("ekipmanKarti.arac.ayaktaYolcuSayisi")}>
              <TextInput name="ruhsatAyaktaYolcuSayisi" placeholder="0" />
            </Alan>
          </div>
        </Bolum>

        <HatirlaticiTarihler />

        <div className="ek-kart-not">
          <LuInfo size={14} />
          <span>{t("ekipmanKarti.arac.ruhsatNotu")}</span>
        </div>
      </div>
    </Spin>
  );
}

RuhsatBilgileri.propTypes = {
  makineId: PropTypes.number.isRequired,
  /** Arac sekmesi ve Ruhsat alt sekmesi ekranda mi */
  gorunur: PropTypes.bool.isRequired,
};
