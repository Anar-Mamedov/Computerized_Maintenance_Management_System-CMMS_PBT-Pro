import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import Alan from "../ortak/Alan";
import SayacBilgiKutulari from "./SayacBilgiKutulari";
import SecimRadyolari from "./SecimRadyolari";
import NumberInput from "../../../../../../../utils/components/NumberInput";
import FullDatePicker from "../../../../../../../utils/components/FullDatePicker";
import FullTimePicker from "../../../../../../../utils/components/FullTimePicker";
import VardiyaSelectbox from "../../../../../../../utils/components/VardiyaSelectbox";
import Textarea from "../../../../../../../utils/components/Form/Textarea";

/** Sayac okuma alanlari (Sayac Guncelleme ve Sayac Gir modallari ayni icerigi kullanir). Form: useSayacOkumaFormu. */
export default function SayacOkumaFormu({ sayac }) {
  const { t } = useTranslation();
  const girisSekilleri = [
    { deger: "okunan", etiket: t("ekipmanKarti.sayac.okunanDeger") },
    { deger: "artis", etiket: t("ekipmanKarti.sayac.artisDegeri") },
  ];

  return (
    <div className="space-y-4">
      <SayacBilgiKutulari sayac={sayac} />
      <Alan etiket={t("ekipmanKarti.sayac.girisSekli")}>
        <SecimRadyolari name="girisSekli" secenekler={girisSekilleri} className="grid grid-cols-1 gap-2 sm:grid-cols-2" />
      </Alan>
      <div className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
        <Alan etiket={t("ekipmanKarti.sayac.deger")} zorunlu className="sm:col-span-2">
          <NumberInput name1="deger" isRequired minNumber={0} />
        </Alan>
        <Alan etiket={t("ekipmanKarti.tarih")} zorunlu>
          <FullDatePicker name1="tarih" isRequired />
        </Alan>
        <Alan etiket={t("ekipmanKarti.saat")} zorunlu>
          <FullTimePicker name1="saat" isRequired />
        </Alan>
        <Alan etiket={t("ekipmanKarti.sayac.vardiya")} className="sm:col-span-2">
          <VardiyaSelectbox name1="vardiyaID" placeholder={t("ekipmanKarti.secimYapiniz")} />
        </Alan>
        <Alan etiket={t("ekipmanKarti.aciklama")} className="sm:col-span-2">
          <Textarea name="aciklama" />
        </Alan>
      </div>
    </div>
  );
}

SayacOkumaFormu.propTypes = {
  sayac: PropTypes.shape({
    tanim: PropTypes.string,
    guncelDeger: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    birim: PropTypes.string,
  }).isRequired,
};
