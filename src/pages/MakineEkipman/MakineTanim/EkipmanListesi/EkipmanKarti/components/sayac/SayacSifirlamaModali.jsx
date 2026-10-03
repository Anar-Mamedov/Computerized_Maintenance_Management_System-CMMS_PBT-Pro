import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import dayjs from "dayjs";
import { message } from "antd";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { LuInfo } from "react-icons/lu";
import Alan from "../ortak/Alan";
import KartModali from "../ortak/KartModali";
import ModalDugmeleri from "../ortak/ModalDugmeleri";
import SayacBilgiKutulari from "./SayacBilgiKutulari";
import FullDatePicker from "../../../../../../../utils/components/FullDatePicker";
import FullTimePicker from "../../../../../../../utils/components/FullTimePicker";
import VardiyaSelectbox from "../../../../../../../utils/components/VardiyaSelectbox";
import Textarea from "../../../../../../../utils/components/Form/Textarea";
import { basariliMi } from "../../../ekipmanService";
import { hataMesaji, sifirlaSayac, yanitHatasi } from "../../ekipmanKartiService";
import { apiSaati, apiTarihi, metinYaDaNull } from "../../yardimcilar";

const BOS_FORM = { tarih: null, saat: null, vardiyaID: null, aciklama: "" };

/**
 * Sayac Sifirlama: sayac degeri sifirlanir, hareketlere SIFIRLAMA kaydi eklenir. Aciklama zorunludur
 * (global Textarea kural almadigi icin kaydederken denetlenir). Kaydedince once onKaydedildi, sonra onKapat cagrilir.
 */
export default function SayacSifirlamaModali({ acik, sayac, onKapat, onKaydedildi }) {
  const { t } = useTranslation();
  const [kaydediliyor, setKaydediliyor] = useState(false);
  const methods = useForm({ defaultValues: BOS_FORM });
  const { reset, handleSubmit, setError, formState } = methods;
  const aciklamaHatasi = formState.errors.aciklama;

  useEffect(() => {
    if (acik) reset({ ...BOS_FORM, tarih: dayjs(), saat: dayjs() });
  }, [acik, reset]);

  const sifirla = handleSubmit(async (veri) => {
    const aciklama = metinYaDaNull(veri.aciklama);
    if (!aciklama) {
      setError("aciklama", { type: "required", message: t("ekipmanKarti.sayac.alanZorunlu") });
      return;
    }

    setKaydediliyor(true);
    try {
      const yanit = await sifirlaSayac({
        SayacId: sayac.sayacId,
        Tarih: apiTarihi(veri.tarih),
        Saat: apiSaati(veri.saat),
        Aciklama: aciklama,
        VardiyaId: Number(veri.vardiyaID) || 0,
      });
      if (!basariliMi(yanit)) {
        message.error(yanitHatasi(yanit, t));
        return;
      }
      message.success(t("ekipmanKarti.sayac.sifirlandi"));
      onKaydedildi();
      onKapat();
    } catch (hata) {
      console.error("Sayac sifirlanamadi:", hata);
      message.error(hataMesaji(hata, t("ekipmanKarti.islemBasarisiz")));
    } finally {
      setKaydediliyor(false);
    }
  });

  return (
    <KartModali
      acik={acik}
      baslik={t("ekipmanKarti.sayac.sifirlama")}
      onKapat={onKapat}
      kapatilabilir={!kaydediliyor}
      altBilgi={<ModalDugmeleri onKapat={onKapat} onKaydet={sifirla} kaydediliyor={kaydediliyor} kaydetMetni={t("ekipmanKarti.sayac.sifirla")} tehlikeli />}
    >
      <FormProvider {...methods}>
        {sayac && (
          <div className="space-y-4">
            <SayacBilgiKutulari sayac={sayac} />
            <div className="ek-kart-not">
              <LuInfo size={14} />
              <span>{t("ekipmanKarti.sayac.sifirlamaNotu")}</span>
            </div>
            <div className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
              <Alan etiket={t("ekipmanKarti.tarih")} zorunlu>
                <FullDatePicker name1="tarih" isRequired />
              </Alan>
              <Alan etiket={t("ekipmanKarti.saat")} zorunlu>
                <FullTimePicker name1="saat" isRequired />
              </Alan>
              <Alan etiket={t("ekipmanKarti.sayac.vardiya")} className="sm:col-span-2">
                <VardiyaSelectbox name1="vardiyaID" placeholder={t("ekipmanKarti.secimYapiniz")} />
              </Alan>
              <Alan etiket={t("ekipmanKarti.aciklama")} zorunlu className="sm:col-span-2">
                <Textarea name="aciklama" />
                {aciklamaHatasi && <p className="mt-1.5 mb-0 text-xs text-(--ek-k-hata)">{aciklamaHatasi.message}</p>}
              </Alan>
            </div>
          </div>
        )}
      </FormProvider>
    </KartModali>
  );
}

SayacSifirlamaModali.propTypes = {
  acik: PropTypes.bool.isRequired,
  sayac: PropTypes.shape({
    sayacId: PropTypes.number.isRequired,
    tanim: PropTypes.string,
    guncelDeger: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    birim: PropTypes.string,
  }),
  onKapat: PropTypes.func.isRequired,
  onKaydedildi: PropTypes.func.isRequired,
};
