import React from "react";
import PropTypes from "prop-types";
import { Select } from "antd";
import { Controller, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import AracKayitModali from "./AracKayitModali";
import SecimKutusu from "../ortak/SecimKutusu";
import Alan from "../ortak/Alan";
import TextInput from "../../../../../../../utils/components/Form/TextInput";
import Textarea from "../../../../../../../utils/components/Form/Textarea";
import KodIDSelectbox from "../../../../../../../utils/components/KodIDSelectbox";
import LokasyonTablo from "../../../../../../../utils/components/LokasyonTablo";
import PersonelTablo from "../../../../../../../utils/components/PersonelTablo";
import FullDatePicker from "../../../../../../../utils/components/FullDatePicker";
import FullTimePicker from "../../../../../../../utils/components/FullTimePicker";
import NumberInput from "../../../../../../../utils/components/NumberInput";
import { ekleAracKazasi, getAracKazasi, guncelleAracKazasi, silAracKazasi } from "../../ekipmanKartiService";
import { BOS_KAZA, KAZA_DURUMU, KOD_GRUPLARI, kazaDurumEtiketi, kazaFormDegerleri, kazaGovdesi } from "./aracFormAlanlari";

const KAZA_SERVISI = { getir: getAracKazasi, ekle: ekleAracKazasi, guncelle: guncelleAracKazasi, sil: silAracKazasi };
const SECIM_KUTUSU_STILI = { width: "100%" };

/** Kaza alanlari; AracKayitModali'nin formunu kullanir. */
function KazaAlanlari() {
  const { t } = useTranslation();
  const { control } = useFormContext();
  const secimYapiniz = t("ekipmanKarti.secimYapiniz");
  const durumSecenekleri = Object.values(KAZA_DURUMU).map((durum) => ({ value: durum, label: kazaDurumEtiketi(durum, t) }));

  return (
    <div className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
      <Alan etiket={t("ekipmanKarti.arac.kayitNo")}>
        <TextInput name="belgeNo" />
      </Alan>
      <Alan etiket={t("ekipmanKarti.tarih")} zorunlu>
        <FullDatePicker name1="tarih" isRequired />
      </Alan>
      <Alan etiket={t("ekipmanKarti.saat")}>
        <FullTimePicker name1="saat" />
      </Alan>
      <Alan etiket={t("ekipmanKarti.arac.lokasyon")}>
        <LokasyonTablo lokasyonFieldName="kazaLokasyon" lokasyonIdFieldName="kazaLokasyonID" />
      </Alan>
      <Alan etiket={t("ekipmanKarti.arac.kazaTuru")}>
        <KodIDSelectbox name1="kazaTuru" kodID={KOD_GRUPLARI.kazaTuru} placeholder={secimYapiniz} />
      </Alan>
      <Alan etiket={t("ekipmanKarti.arac.kazaSekli")}>
        <KodIDSelectbox name1="kazaSekli" kodID={KOD_GRUPLARI.kazaSekli} placeholder={secimYapiniz} />
      </Alan>
      <Alan etiket={t("ekipmanKarti.arac.surucu")}>
        <PersonelTablo name1="kazaSurucu" />
      </Alan>
      <Alan etiket={t("ekipmanKarti.arac.aracKm")}>
        <NumberInput name1="aracKm" minNumber={0} />
      </Alan>
      <Alan etiket={t("ekipmanKarti.arac.karsiPlaka")}>
        <TextInput name="karsiPlaka" />
      </Alan>
      <Alan etiket={t("ekipmanKarti.arac.karsiSurucu")}>
        <TextInput name="karsiSurucu" />
      </Alan>
      <Alan etiket={t("ekipmanKarti.arac.karsiSigorta")}>
        <TextInput name="karsiSigorta" />
      </Alan>
      <Alan etiket={t("ekipmanKarti.arac.hasarNo")}>
        <TextInput name="hasarNo" />
      </Alan>
      <Alan etiket={t("ekipmanKarti.arac.asliKusur")}>
        <KodIDSelectbox name1="asliKusur" kodID={KOD_GRUPLARI.asliKusur} placeholder={secimYapiniz} />
      </Alan>
      <Alan etiket={t("ekipmanKarti.arac.taliKusur")}>
        <KodIDSelectbox name1="taliKusur" kodID={KOD_GRUPLARI.taliKusur} placeholder={secimYapiniz} />
      </Alan>
      <Alan etiket={t("ekipmanKarti.arac.durum")}>
        <Controller
          name="durum"
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              value={field.value ?? undefined}
              options={durumSecenekleri}
              allowClear
              placeholder={secimYapiniz}
              style={SECIM_KUTUSU_STILI}
              onChange={(deger) => field.onChange(deger ?? null)}
            />
          )}
        />
      </Alan>
      <SecimKutusu name="geriOdeme" etiket={t("ekipmanKarti.arac.geriOdeme")} className="min-h-10 self-end" />
      <Alan etiket={t("ekipmanKarti.aciklama")} className="sm:col-span-2">
        <Textarea name="aciklama" />
      </Alan>
    </div>
  );
}

/** Kaza kaydi ekleme / duzenleme (AddAracKaza / UpdateAracKaza). */
export default function KazaModali({ kayitId, makineId, aracId, onKapat, onKaydedildi }) {
  const { t } = useTranslation();

  return (
    <AracKayitModali
      kayitId={kayitId}
      baslik={kayitId ? t("ekipmanKarti.arac.kazaDuzenle") : t("ekipmanKarti.arac.yeniKaza")}
      altBaslik={t("ekipmanKarti.arac.kazaAltBaslik")}
      genislik={820}
      bosDegerler={BOS_KAZA}
      servis={KAZA_SERVISI}
      formDegerleri={kazaFormDegerleri}
      govde={(veri) => kazaGovdesi(veri, { kayitId, makineId, aracId })}
      onKapat={onKapat}
      onKaydedildi={onKaydedildi}
    >
      <KazaAlanlari />
    </AracKayitModali>
  );
}

KazaModali.propTypes = {
  /** 0: yeni kayit, digerleri: TB_ARAC_KAZA_ID */
  kayitId: PropTypes.number.isRequired,
  makineId: PropTypes.number.isRequired,
  aracId: PropTypes.number.isRequired,
  onKapat: PropTypes.func.isRequired,
  onKaydedildi: PropTypes.func.isRequired,
};
