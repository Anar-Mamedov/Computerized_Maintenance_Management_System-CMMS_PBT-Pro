import React from "react";
import PropTypes from "prop-types";
import { useFormContext, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import AracKayitModali from "./AracKayitModali";
import SecimKutusu from "../ortak/SecimKutusu";
import Alan from "../ortak/Alan";
import TextInput from "../../../../../../../utils/components/Form/TextInput";
import Textarea from "../../../../../../../utils/components/Form/Textarea";
import KodIDSelectbox from "../../../../../../../utils/components/KodIDSelectbox";
import AracKodSelectbox from "../../../../../../../utils/components/AracKodSelectbox";
import LokasyonTablo from "../../../../../../../utils/components/LokasyonTablo";
import PersonelTablo from "../../../../../../../utils/components/PersonelTablo";
import FullDatePicker from "../../../../../../../utils/components/FullDatePicker";
import FullTimePicker from "../../../../../../../utils/components/FullTimePicker";
import NumberInput from "../../../../../../../utils/components/NumberInput";
import { ekleAracCezasi, getAracCezasi, guncelleAracCezasi, silAracCezasi } from "../../ekipmanKartiService";
import { BOS_CEZA, KOD_GRUPLARI, cezaFormDegerleri, cezaGovdesi } from "./aracFormAlanlari";

const CEZA_SERVISI = { getir: getAracCezasi, ekle: ekleAracCezasi, guncelle: guncelleAracCezasi, sil: silAracCezasi };

/** Ceza alanlari; AracKayitModali'nin formunu kullanir. Odeme tarihi yalnizca "Odendi" isaretliyken girilir. */
function CezaAlanlari() {
  const { t } = useTranslation();
  const { control } = useFormContext();
  const odendi = useWatch({ control, name: "odendi" });
  const secimYapiniz = t("ekipmanKarti.secimYapiniz");

  return (
    <div className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
      <Alan etiket={t("ekipmanKarti.arac.cezaNo")}>
        <TextInput name="belgeNo" />
      </Alan>
      <Alan etiket={t("ekipmanKarti.tarih")} zorunlu>
        <FullDatePicker name1="tarih" isRequired />
      </Alan>
      <Alan etiket={t("ekipmanKarti.saat")}>
        <FullTimePicker name1="saat" />
      </Alan>
      <Alan etiket={t("ekipmanKarti.arac.kesildigiYer")}>
        <LokasyonTablo lokasyonFieldName="cezaLokasyon" lokasyonIdFieldName="cezaLokasyonID" />
      </Alan>
      <Alan etiket={t("ekipmanKarti.arac.cezaTuru")}>
        <KodIDSelectbox name1="cezaTuru" kodID={KOD_GRUPLARI.cezaTuru} placeholder={secimYapiniz} />
      </Alan>
      <Alan etiket={t("ekipmanKarti.arac.cezaMaddesi")}>
        <AracKodSelectbox name1="cezaMaddesi" tip="CEZA_MADDE" placeholder={secimYapiniz} />
      </Alan>
      <Alan etiket={t("ekipmanKarti.arac.tutar")}>
        <NumberInput name1="tutar" minNumber={0} />
      </Alan>
      <Alan etiket={t("ekipmanKarti.arac.gecikmeTutari")}>
        <NumberInput name1="gecikmeTutari" minNumber={0} />
      </Alan>
      <Alan etiket={t("ekipmanKarti.arac.cezaPuani")}>
        <NumberInput name1="cezaPuani" minNumber={0} />
      </Alan>
      <Alan etiket={t("ekipmanKarti.arac.surucu")}>
        <PersonelTablo name1="cezaSurucu" />
      </Alan>
      <Alan etiket={t("ekipmanKarti.arac.aracKm")}>
        <NumberInput name1="aracKm" minNumber={0} />
      </Alan>
      <SecimKutusu name="odendi" etiket={t("ekipmanKarti.arac.odendi")} className="min-h-10 self-end" />
      <Alan etiket={t("ekipmanKarti.arac.odemeTarihi")}>
        <FullDatePicker name1="odemeTarihi" disabled={!odendi} />
      </Alan>
      <Alan etiket={t("ekipmanKarti.aciklama")} className="sm:col-span-2">
        <Textarea name="aciklama" />
      </Alan>
    </div>
  );
}

/** Trafik cezasi ekleme / duzenleme (AddAracCeza / UpdateAracCeza). */
export default function CezaModali({ kayitId, makineId, aracId, onKapat, onKaydedildi }) {
  const { t } = useTranslation();

  return (
    <AracKayitModali
      kayitId={kayitId}
      baslik={kayitId ? t("ekipmanKarti.arac.cezaDuzenle") : t("ekipmanKarti.arac.yeniCeza")}
      altBaslik={t("ekipmanKarti.arac.cezaAltBaslik")}
      genislik={820}
      bosDegerler={BOS_CEZA}
      servis={CEZA_SERVISI}
      formDegerleri={cezaFormDegerleri}
      govde={(veri) => cezaGovdesi(veri, { kayitId, makineId, aracId })}
      onKapat={onKapat}
      onKaydedildi={onKaydedildi}
    >
      <CezaAlanlari />
    </AracKayitModali>
  );
}

CezaModali.propTypes = {
  /** 0: yeni kayit, digerleri: TB_ARAC_CEZA_ID */
  kayitId: PropTypes.number.isRequired,
  makineId: PropTypes.number.isRequired,
  aracId: PropTypes.number.isRequired,
  onKapat: PropTypes.func.isRequired,
  onKaydedildi: PropTypes.func.isRequired,
};
