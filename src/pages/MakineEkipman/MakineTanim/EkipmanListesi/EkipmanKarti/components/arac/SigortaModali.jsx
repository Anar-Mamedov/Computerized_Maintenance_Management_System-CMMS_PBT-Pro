import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import AracKayitModali from "./AracKayitModali";
import Alan from "../ortak/Alan";
import TextInput from "../../../../../../../utils/components/Form/TextInput";
import Textarea from "../../../../../../../utils/components/Form/Textarea";
import KodIDSelectbox from "../../../../../../../utils/components/KodIDSelectbox";
import FirmaTablo from "../../../../../../../utils/components/FirmaTablo";
import FullDatePicker from "../../../../../../../utils/components/FullDatePicker";
import NumberInput from "../../../../../../../utils/components/NumberInput";
import { ekleAracSigortasi, getAracSigortasi, guncelleAracSigortasi, silAracSigortasi } from "../../ekipmanKartiService";
import { BOS_SIGORTA, KOD_GRUPLARI, sigortaFormDegerleri, sigortaGovdesi } from "./aracFormAlanlari";

const SIGORTA_SERVISI = { getir: getAracSigortasi, ekle: ekleAracSigortasi, guncelle: guncelleAracSigortasi, sil: silAracSigortasi };

/** Police alanlari; AracKayitModali'nin formunu kullanir. */
function SigortaAlanlari() {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
      <Alan etiket={t("ekipmanKarti.arac.sigortaTipi")}>
        <KodIDSelectbox name1="sigortaTipi" kodID={KOD_GRUPLARI.sigortaTipi} placeholder={t("ekipmanKarti.secimYapiniz")} />
      </Alan>
      <Alan etiket={t("ekipmanKarti.arac.sigortaSirketi")}>
        <FirmaTablo firmaFieldName="sigortaFirma" firmaIdFieldName="sigortaFirmaID" />
      </Alan>
      <Alan etiket={t("ekipmanKarti.arac.acenta")}>
        <TextInput name="acenta" />
      </Alan>
      <Alan etiket={t("ekipmanKarti.arac.policeNo")}>
        <TextInput name="policeNo" />
      </Alan>
      <Alan etiket={t("ekipmanKarti.baslangicTarihi")} zorunlu>
        <FullDatePicker name1="baslangicTarihi" isRequired />
      </Alan>
      <Alan etiket={t("ekipmanKarti.bitisTarihi")} zorunlu>
        <FullDatePicker name1="bitisTarihi" isRequired />
      </Alan>
      <Alan etiket={t("ekipmanKarti.arac.tutar")}>
        <NumberInput name1="tutar" minNumber={0} />
      </Alan>
      <Alan etiket={t("ekipmanKarti.aciklama")} className="sm:col-span-2">
        <Textarea name="aciklama" />
      </Alan>
    </div>
  );
}

/** Sigorta policesi ekleme / duzenleme (AddAracSigorta / UpdateAracSigorta). */
export default function SigortaModali({ kayitId, makineId, aracId, onKapat, onKaydedildi }) {
  const { t } = useTranslation();

  return (
    <AracKayitModali
      kayitId={kayitId}
      baslik={kayitId ? t("ekipmanKarti.arac.sigortaDuzenle") : t("ekipmanKarti.arac.yeniSigorta")}
      altBaslik={t("ekipmanKarti.arac.sigortaAltBaslik")}
      genislik={560}
      bosDegerler={BOS_SIGORTA}
      servis={SIGORTA_SERVISI}
      formDegerleri={sigortaFormDegerleri}
      govde={(veri) => sigortaGovdesi(veri, { kayitId, makineId, aracId })}
      onKapat={onKapat}
      onKaydedildi={onKaydedildi}
    >
      <SigortaAlanlari />
    </AracKayitModali>
  );
}

SigortaModali.propTypes = {
  /** 0: yeni kayit, digerleri: TB_ARAC_SIGORTA_ID */
  kayitId: PropTypes.number.isRequired,
  makineId: PropTypes.number.isRequired,
  aracId: PropTypes.number.isRequired,
  onKapat: PropTypes.func.isRequired,
  onKaydedildi: PropTypes.func.isRequired,
};
