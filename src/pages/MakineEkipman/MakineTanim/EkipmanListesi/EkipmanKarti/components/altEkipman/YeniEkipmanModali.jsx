import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { message } from "antd";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import KartModali from "../ortak/KartModali";
import ModalDugmeleri from "../ortak/ModalDugmeleri";
import Alan from "../ortak/Alan";
import TextInput from "../../../../../../../utils/components/Form/TextInput";
import Textarea from "../../../../../../../utils/components/Form/Textarea";
import SwitchForm from "../../../../../../../utils/components/Form/SwitchForm";
import KodIDSelectbox from "../../../../../../../utils/components/KodIDSelectbox";
import MarkaEkleSelect from "../../../../../../../utils/components/MarkaEkleSelect";
import ModelEkleSelect from "../../../../../../../utils/components/ModelEkleSelect";
import HedefBilgisi from "./HedefBilgisi";
import { basariliMi } from "../../../ekipmanService";
import { ekleYeniAltEkipman, getYeniEkipmanKodu, hataMesaji, yanitHatasi } from "../../ekipmanKartiService";
import { metinYaDaNull } from "../../yardimcilar";
import { hedefTipi } from "./altEkipmanYardimcilari";

// Ekipman kod listeleri (Ekipman Veritabani ekleme ekraniyla ayni gruplar).
const KOD_GRUBU = { tip: 32601, birim: 32001, durum: 32606 };

const VARSAYILAN_DEGERLER = {
  ekipmanKodu: "",
  ekipmanTanimi: "",
  seriNo: "",
  tip: null,
  tipID: null,
  birim: null,
  birimID: null,
  durum: null,
  durumID: null,
  marka: null,
  markaID: null,
  model: null,
  modelID: null,
  aktif: true,
  aciklama: "",
};

const kodId = (deger) => Number(deger) || 0;

/**
 * Yeni Ekipman (Stoksuz): yeni alt ekipman karti acilir ve ayni istekte `hedef`e (secili grup / ekipman ya da makine)
 * monte edilir. Kod acilista otomatik doldurulur, kullanici degistirebilir.
 */
export default function YeniEkipmanModali({ makineId, hedef, onKapat, onEklendi }) {
  const { t } = useTranslation();
  const [kaydediliyor, setKaydediliyor] = useState(false);
  const methods = useForm({ defaultValues: VARSAYILAN_DEGERLER });
  const { setValue } = methods;
  const secimYerTutucu = t("ekipmanKarti.secimYapiniz");

  useEffect(() => {
    let iptal = false;
    getYeniEkipmanKodu()
      .then((kod) => {
        if (!iptal && kod) setValue("ekipmanKodu", String(kod));
      })
      .catch((hata) => console.error("Yeni ekipman kodu alinamadi:", hata));
    return () => {
      iptal = true;
    };
  }, [setValue]);

  const kaydet = async (veri) => {
    setKaydediliyor(true);
    try {
      const yanit = await ekleYeniAltEkipman({
        EKP_KOD: veri.ekipmanKodu.trim(),
        EKP_TANIM: veri.ekipmanTanimi.trim(),
        EKP_SERI_NO: metinYaDaNull(veri.seriNo),
        EKP_TIP_KOD_ID: kodId(veri.tipID),
        EKP_BIRIM_KOD_ID: kodId(veri.birimID),
        EKP_DURUM_KOD_ID: kodId(veri.durumID),
        EKP_MARKA_KOD_ID: kodId(veri.markaID),
        EKP_MODEL_KOD_ID: kodId(veri.modelID),
        EKP_AKTIF: veri.aktif,
        EKP_MAKINE_ID: makineId,
        EKP_REF_ID: hedef.id,
        EKP_ACIKLAMA: metinYaDaNull(veri.aciklama),
      });
      if (!basariliMi(yanit)) {
        message.error(yanitHatasi(yanit, t));
        return;
      }
      message.success(t("ekipmanKarti.altEkipman.yeniEkipmanEklendi"));
      onEklendi();
    } catch (hata) {
      console.error("Yeni alt ekipman eklenemedi:", hata);
      message.error(hataMesaji(hata, t("ekipmanKarti.islemBasarisiz")));
    } finally {
      setKaydediliyor(false);
    }
  };

  return (
    <FormProvider {...methods}>
      <KartModali
        acik
        baslik={t("ekipmanKarti.altEkipman.yeniEkipmanStoksuz")}
        genislik={720}
        onKapat={onKapat}
        kapatilabilir={!kaydediliyor}
        altBilgi={<ModalDugmeleri onKapat={onKapat} onKaydet={methods.handleSubmit(kaydet)} kaydediliyor={kaydediliyor} />}
      >
        <div className="space-y-4">
          <HedefBilgisi hedef={hedef} />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Alan etiket={t("ekipmanKarti.altEkipman.kolon.ekipmanKodu")} zorunlu>
              <TextInput name="ekipmanKodu" required />
            </Alan>
            <Alan etiket={t("ekipmanKarti.altEkipman.kolon.tanim")} zorunlu>
              <TextInput name="ekipmanTanimi" required />
            </Alan>
            <Alan etiket={t("ekipmanKarti.altEkipman.kolon.seriNo")}>
              <TextInput name="seriNo" />
            </Alan>
            <Alan etiket={t("ekipmanKarti.altEkipman.kolon.tip")}>
              <KodIDSelectbox name1="tip" kodID={KOD_GRUBU.tip} isRequired={false} placeholder={secimYerTutucu} />
            </Alan>
            <Alan etiket={t("ekipmanKarti.altEkipman.birim")}>
              <KodIDSelectbox name1="birim" kodID={KOD_GRUBU.birim} isRequired={false} placeholder={secimYerTutucu} />
            </Alan>
            <Alan etiket={t("ekipmanKarti.altEkipman.kolon.durum")}>
              <KodIDSelectbox name1="durum" kodID={KOD_GRUBU.durum} isRequired={false} placeholder={secimYerTutucu} />
            </Alan>
            <Alan etiket={t("ekipmanKarti.altEkipman.kolon.marka")}>
              <MarkaEkleSelect markaFieldName="marka" markaIdFieldName="markaID" placeholder={secimYerTutucu} />
            </Alan>
            <Alan etiket={t("ekipmanKarti.altEkipman.kolon.model")}>
              <ModelEkleSelect modelFieldName="model" modelIdFieldName="modelID" markaIdFieldName="markaID" placeholder={secimYerTutucu} />
            </Alan>
            <Alan etiket={t("ekipmanKarti.aktif")}>
              <SwitchForm name="aktif" />
            </Alan>
          </div>
          <Alan etiket={t("ekipmanKarti.aciklama")}>
            <Textarea name="aciklama" />
          </Alan>
        </div>
      </KartModali>
    </FormProvider>
  );
}

YeniEkipmanModali.propTypes = {
  makineId: PropTypes.number.isRequired,
  hedef: hedefTipi.isRequired,
  onKapat: PropTypes.func.isRequired,
  /** Ekleme basarili olunca (mesaj gosterildikten sonra) cagrilir. */
  onEklendi: PropTypes.func.isRequired,
};
