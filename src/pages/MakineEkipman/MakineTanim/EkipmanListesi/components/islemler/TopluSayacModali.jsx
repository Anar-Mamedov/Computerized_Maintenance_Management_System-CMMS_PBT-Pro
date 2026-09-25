import React, { useState } from "react";
import PropTypes from "prop-types";
import { message } from "antd";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import IslemModali, { FormAlani } from "./IslemModali";
import { yanitiBildir } from "./topluCalistir";
import TextInput from "../../../../../../utils/components/Form/TextInput";
import Textarea from "../../../../../../utils/components/Form/Textarea";
import CheckboxInput from "../../../../../../utils/components/Form/CheckboxInput";
import KodIDSelectbox from "../../../../../../utils/components/KodIDSelectbox";
import NumberInput from "../../../../../../utils/components/NumberInput";
import { topluSayacTanimla } from "../../ekipmanService";
import { KOD_GRUPLARI } from "../../constants";

/** Secili ekipmanlarin hepsine ayni sayac tanimini ekler (Ekipman/TopluSayacTanimla). */
export default function TopluSayacModali({ satirlar, onKapat, onTamamlandi }) {
  const { t } = useTranslation();
  const [yukleniyor, setYukleniyor] = useState(false);
  const methods = useForm({
    defaultValues: { sayacTanim: "", sayacTipi: null, sayacTipiID: null, sayacBirimi: null, sayacBirimiID: null, guncelDeger: 0, varsayilan: true, aciklama: "" },
  });

  const kaydet = methods.handleSubmit(async (veri) => {
    setYukleniyor(true);
    try {
      const response = await topluSayacTanimla({
        makineIds: satirlar.map((satir) => satir.TB_MAKINE_ID),
        sayacTanim: veri.sayacTanim.trim(),
        birimKodId: Number(veri.sayacBirimiID),
        tipKodId: Number(veri.sayacTipiID),
        guncelDeger: Number(veri.guncelDeger) || 0,
        varsayilan: Boolean(veri.varsayilan),
        aciklama: veri.aciklama || "",
      });
      if (yanitiBildir(response, t)) onTamamlandi();
    } catch (error) {
      console.error("Toplu sayaç tanımlanamadı:", error);
      message.error(t("islemBasarisiz"));
    } finally {
      setYukleniyor(false);
    }
  });

  return (
    <IslemModali
      genislik={680}
      baslik={t("ekipmanListesi.sayac.baslik")}
      aciklama={t("ekipmanListesi.sayac.aciklama")}
      seciliAdet={satirlar.length}
      secimAciklamasi={t("ekipmanListesi.sayac.bilgi")}
      kaydetMetni={t("ekipmanListesi.sayac.kaydet")}
      yukleniyor={yukleniyor}
      onKaydet={kaydet}
      onKapat={onKapat}
    >
      <FormProvider {...methods}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormAlani etiket={t("ekipmanListesi.sayac.ad")} zorunlu>
            <TextInput name="sayacTanim" required placeholder={t("ekipmanListesi.sayac.adOrnek")} />
          </FormAlani>
          <FormAlani etiket={t("sayacTipi")} zorunlu>
            <KodIDSelectbox name1="sayacTipi" kodID={KOD_GRUPLARI.sayacTipi} isRequired placeholder={t("ekipmanListesi.sayac.tipSeciniz")} />
          </FormAlani>
          <FormAlani etiket={t("ekipmanListesi.sayac.birim")} zorunlu>
            <KodIDSelectbox name1="sayacBirimi" kodID={KOD_GRUPLARI.sayacBirimi} isRequired placeholder={t("ekipmanListesi.sayac.birimSeciniz")} />
          </FormAlani>
          <FormAlani etiket={t("ekipmanListesi.sayac.baslangicDegeri")}>
            <NumberInput name1="guncelDeger" minNumber={0} />
          </FormAlani>
          <div className="flex items-center gap-2 text-sm sm:col-span-2">
            <CheckboxInput name="varsayilan" />
            {t("ekipmanListesi.sayac.varsayilan")}
          </div>
          <FormAlani etiket={t("aciklama")} className="sm:col-span-2">
            <Textarea name="aciklama" />
          </FormAlani>
        </div>
      </FormProvider>
    </IslemModali>
  );
}

TopluSayacModali.propTypes = {
  satirlar: PropTypes.arrayOf(PropTypes.shape({ TB_MAKINE_ID: PropTypes.number })).isRequired,
  onKapat: PropTypes.func.isRequired,
  onTamamlandi: PropTypes.func.isRequired,
};
