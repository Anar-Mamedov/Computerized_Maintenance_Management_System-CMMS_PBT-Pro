import React, { useState } from "react";
import PropTypes from "prop-types";
import { message } from "antd";
import dayjs from "dayjs";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import FullDatePicker from "../../../../../../../utils/components/FullDatePicker";
import LocalizedDateText from "../../../../../../../utils/components/LocalizedDateText";
import KartModali from "../ortak/KartModali";
import ModalDugmeleri from "../ortak/ModalDugmeleri";
import Alan from "../ortak/Alan";
import BilgiKutusu from "../ortak/BilgiKutusu";
import { basariliMi } from "../../../ekipmanService";
import { hataMesaji, olusturBakimIsEmri, yanitHatasi } from "../../ekipmanKartiService";
import { apiTarihi, bosIse } from "../../yardimcilar";

/** Secili bakim icin verilen tarihte is emri olusturur (IsEmriOlustur). */
export default function IsEmriOlusturModali({ makineId, kayit, onKapat, onTamamlandi }) {
  const { t } = useTranslation();
  const [kaydediliyor, setKaydediliyor] = useState(false);
  const methods = useForm({ defaultValues: { tarih: dayjs() } });

  const olustur = async ({ tarih }) => {
    setKaydediliyor(true);
    try {
      const yanit = await olusturBakimIsEmri({ PBakimId: kayit.TB_PERIYODIK_BAKIM_ID, MakineId: makineId, Tarih: apiTarihi(tarih) });
      if (!basariliMi(yanit)) {
        message.error(yanitHatasi(yanit, t));
        return;
      }
      message.success(yanit?.message || t("ekipmanKarti.islemBasarili"));
      onTamamlandi();
    } catch (hata) {
      console.error("Is emri olusturulamadi:", hata);
      message.error(hataMesaji(hata, t("ekipmanKarti.islemBasarisiz")));
    } finally {
      setKaydediliyor(false);
    }
  };

  return (
    <KartModali
      acik
      baslik={t("ekipmanKarti.bakim.isEmriOlustur")}
      onKapat={onKapat}
      kapatilabilir={!kaydediliyor}
      altBilgi={<ModalDugmeleri onKapat={onKapat} onKaydet={methods.handleSubmit(olustur)} kaydediliyor={kaydediliyor} kaydetMetni={t("ekipmanKarti.bakim.olustur")} />}
    >
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          <BilgiKutusu etiket={t("ekipmanKarti.bakim.bakim")}>{bosIse(kayit.PBK_TANIM)}</BilgiKutusu>
          <BilgiKutusu etiket={t("ekipmanKarti.bakim.hedefTarih")}>
            <LocalizedDateText value={kayit.HEDEF_TARIH} fallback="—" />
          </BilgiKutusu>
        </div>
        <FormProvider {...methods}>
          <div className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
            <Alan etiket={t("ekipmanKarti.tarih")} zorunlu>
              <FullDatePicker name1="tarih" isRequired />
            </Alan>
          </div>
        </FormProvider>
      </div>
    </KartModali>
  );
}

IsEmriOlusturModali.propTypes = {
  makineId: PropTypes.number.isRequired,
  kayit: PropTypes.object.isRequired,
  onKapat: PropTypes.func.isRequired,
  onTamamlandi: PropTypes.func.isRequired,
};
