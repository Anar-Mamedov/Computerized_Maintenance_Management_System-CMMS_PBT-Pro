import React, { useState } from "react";
import PropTypes from "prop-types";
import { message } from "antd";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import FullDatePicker from "../../../../../../../utils/components/FullDatePicker";
import KodIDSelectbox from "../../../../../../../utils/components/KodIDSelectbox";
import Textarea from "../../../../../../../utils/components/Form/Textarea";
import KartModali from "../ortak/KartModali";
import ModalDugmeleri from "../ortak/ModalDugmeleri";
import Alan from "../ortak/Alan";
import SeciliBakimOzeti from "./SeciliBakimOzeti";
import { basariliMi } from "../../../ekipmanService";
import { hataMesaji, ileriTariheBakimPlanla, yanitHatasi } from "../../ekipmanKartiService";
import { apiTarihi, formTarihi, metinYaDaNull } from "../../yardimcilar";

const PLANLAMA_NEDENI_KOD_GRUBU = 32914;

/** Secili bakimlarin hedef tarihini ileri alir; tum kayitlar tek istekte (dizi govde) gider. */
export default function IleriTarihePlanlaModali({ makineId, kayitlar, onKapat, onTamamlandi }) {
  const { t } = useTranslation();
  const [kaydediliyor, setKaydediliyor] = useState(false);
  const methods = useForm({
    defaultValues: {
      yeniHedefTarih: kayitlar.length === 1 ? formTarihi(kayitlar[0].HEDEF_TARIH) : null,
      planlamaNedeni: null,
      planlamaNedeniID: null,
      aciklama: "",
    },
  });

  const kaydet = async (degerler) => {
    setKaydediliyor(true);
    try {
      const govde = kayitlar.map((kayit) => ({
        PBM_MAKINE_ID: makineId,
        PBM_PERIYODIK_BAKIM_ID: kayit.TB_PERIYODIK_BAKIM_ID,
        PBM_HEDEF_TARIH: apiTarihi(degerler.yeniHedefTarih),
        PBI_IPTAL_NEDEN_KOD_ID: Number(degerler.planlamaNedeniID),
        PBI_ACIKLAMA: metinYaDaNull(degerler.aciklama),
      }));
      const yanit = await ileriTariheBakimPlanla(govde);
      if (!basariliMi(yanit)) {
        message.error(yanitHatasi(yanit, t));
        return;
      }
      message.success(t("ekipmanKarti.islemBasarili"));
      onTamamlandi();
    } catch (hata) {
      console.error("Bakim ileri tarihe planlanamadi:", hata);
      message.error(hataMesaji(hata, t("ekipmanKarti.islemBasarisiz")));
    } finally {
      setKaydediliyor(false);
    }
  };

  return (
    <KartModali
      acik
      baslik={t("ekipmanKarti.bakim.ileriTarihePlanla")}
      onKapat={onKapat}
      kapatilabilir={!kaydediliyor}
      altBilgi={<ModalDugmeleri onKapat={onKapat} onKaydet={methods.handleSubmit(kaydet)} kaydediliyor={kaydediliyor} />}
    >
      <div className="space-y-4">
        <SeciliBakimOzeti kayitlar={kayitlar} />
        <FormProvider {...methods}>
          <div className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
            <Alan etiket={t("ekipmanKarti.bakim.yeniHedefTarih")} zorunlu>
              <FullDatePicker name1="yeniHedefTarih" isRequired />
            </Alan>
            <Alan etiket={t("ekipmanKarti.bakim.planlamaNedeni")} zorunlu>
              <KodIDSelectbox name1="planlamaNedeni" kodID={PLANLAMA_NEDENI_KOD_GRUBU} isRequired placeholder={t("ekipmanKarti.secimYapiniz")} />
            </Alan>
            <Alan etiket={t("ekipmanKarti.aciklama")} className="sm:col-span-2">
              <Textarea name="aciklama" />
            </Alan>
          </div>
        </FormProvider>
      </div>
    </KartModali>
  );
}

IleriTarihePlanlaModali.propTypes = {
  makineId: PropTypes.number.isRequired,
  kayitlar: PropTypes.arrayOf(PropTypes.object).isRequired,
  onKapat: PropTypes.func.isRequired,
  onTamamlandi: PropTypes.func.isRequired,
};
