import React, { useState } from "react";
import PropTypes from "prop-types";
import { message } from "antd";
import dayjs from "dayjs";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import KartModali from "../ortak/KartModali";
import ModalDugmeleri from "../ortak/ModalDugmeleri";
import Alan from "../ortak/Alan";
import TextInput from "../../../../../../../utils/components/Form/TextInput";
import Textarea from "../../../../../../../utils/components/Form/Textarea";
import NumberInput from "../../../../../../../utils/components/NumberInput";
import FullDatePicker from "../../../../../../../utils/components/FullDatePicker";
import FullTimePicker from "../../../../../../../utils/components/FullTimePicker";
import PersonelTablo from "../../../../../../../utils/components/PersonelTablo";
import { basariliMi } from "../../../ekipmanService";
import { ekleEkipmanRevizyon, hataMesaji, yanitHatasi } from "../../ekipmanKartiService";
import { apiSaati, apiTarihi, metinYaDaNull, sayiYaDaNull } from "../../yardimcilar";
import { ekipmanEtiketi } from "./altEkipmanYardimcilari";

const IZGARA = "grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2";

const varsayilanDegerler = () => ({
  revizyonNo: "",
  tarih: dayjs(),
  saat: dayjs(),
  konu: "",
  referansNo: "",
  calismaSuresi: null,
  maliyet: null,
  personel: "",
  personelID: "",
  aciklama: "",
});

const revizyonGovdesi = (ekipmanId, veri) => ({
  TB_EKIPMANBAKIM_ID: 0,
  EkipmanId: ekipmanId,
  RevizyonNo: metinYaDaNull(veri.revizyonNo),
  Tarih: apiTarihi(veri.tarih),
  Saat: apiSaati(veri.saat),
  Konu: metinYaDaNull(veri.konu),
  ReferansNo: metinYaDaNull(veri.referansNo),
  CalismaSuresi: sayiYaDaNull(veri.calismaSuresi),
  Maliyet: sayiYaDaNull(veri.maliyet),
  PersonelId: Number(veri.personelID) || 0,
  Personel: metinYaDaNull(veri.personel),
  Aciklama: metinYaDaNull(veri.aciklama),
});

/** Ekipman Revizyon: secili alt ekipmana yeni revizyon kaydi girilir (tarih bugun, saat simdi ile baslar). */
export default function RevizyonModali({ ekipman, onKapat, onKaydedildi }) {
  const { t } = useTranslation();
  const [kaydediliyor, setKaydediliyor] = useState(false);
  const methods = useForm({ defaultValues: varsayilanDegerler() });

  const kaydet = async (veri) => {
    setKaydediliyor(true);
    try {
      const yanit = await ekleEkipmanRevizyon(revizyonGovdesi(ekipman.TB_EKIPMAN_ID, veri));
      if (!basariliMi(yanit)) {
        message.error(yanitHatasi(yanit, t));
        return;
      }
      message.success(t("ekipmanKarti.altEkipman.revizyonKaydedildi"));
      onKaydedildi();
    } catch (hata) {
      console.error("Ekipman revizyonu kaydedilemedi:", hata);
      message.error(hataMesaji(hata, t("ekipmanKarti.islemBasarisiz")));
    } finally {
      setKaydediliyor(false);
    }
  };

  return (
    <FormProvider {...methods}>
      <KartModali
        acik
        baslik={t("ekipmanKarti.altEkipman.revizyon")}
        altBaslik={ekipmanEtiketi(ekipman)}
        genislik={820}
        onKapat={onKapat}
        kapatilabilir={!kaydediliyor}
        altBilgi={<ModalDugmeleri onKapat={onKapat} onKaydet={methods.handleSubmit(kaydet)} kaydediliyor={kaydediliyor} />}
      >
        <div className={IZGARA}>
          <Alan etiket={t("ekipmanKarti.altEkipman.revizyonNo")}>
            <TextInput name="revizyonNo" />
          </Alan>
          <Alan etiket={t("ekipmanKarti.tarih")} zorunlu>
            <FullDatePicker name1="tarih" isRequired />
          </Alan>
          <Alan etiket={t("ekipmanKarti.saat")}>
            <FullTimePicker name1="saat" />
          </Alan>
          <Alan etiket={t("ekipmanKarti.altEkipman.konu")}>
            <TextInput name="konu" />
          </Alan>
          <Alan etiket={t("ekipmanKarti.altEkipman.referansNo")}>
            <TextInput name="referansNo" />
          </Alan>
          <Alan etiket={t("ekipmanKarti.altEkipman.calismaSuresi")}>
            <NumberInput name1="calismaSuresi" minNumber={0} />
          </Alan>
          <Alan etiket={t("ekipmanKarti.altEkipman.maliyet")}>
            <NumberInput name1="maliyet" minNumber={0} />
          </Alan>
          <Alan etiket={t("ekipmanKarti.altEkipman.personel")}>
            <PersonelTablo name1="personel" />
          </Alan>
          <Alan etiket={t("ekipmanKarti.aciklama")} className="sm:col-span-2">
            <Textarea name="aciklama" />
          </Alan>
        </div>
      </KartModali>
    </FormProvider>
  );
}

RevizyonModali.propTypes = {
  /** Secili alt ekipman kaydi (TB_EKIPMAN_ID, EKP_KOD, EKP_TANIM). */
  ekipman: PropTypes.object.isRequired,
  onKapat: PropTypes.func.isRequired,
  /** Kayit basarili olunca (mesaj gosterildikten sonra) cagrilir. */
  onKaydedildi: PropTypes.func.isRequired,
};
