import React, { useState } from "react";
import PropTypes from "prop-types";
import { Input, message } from "antd";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import IslemModali, { FormAlani } from "../IslemModali";
import { yanitiBildir } from "../topluCalistir";
import TextInput from "../../../../../../../utils/components/Form/TextInput";
import SwitchForm from "../../../../../../../utils/components/Form/SwitchForm";
import KodIDSelectbox from "../../../../../../../utils/components/KodIDSelectbox";
import FullDatePicker from "../../../../../../../utils/components/FullDatePicker";
import NumberInput from "../../../../../../../utils/components/NumberInput";
import FirmaTablo from "../../../../../../../utils/components/FirmaTablo";
import { kaydetSigorta } from "../../../ekipmanService";
import { KOD_GRUPLARI } from "../../../constants";

dayjs.extend(customParseFormat);

/** Listede ham tarih yoksa backend'in "GG.AA.YYYY" metni okunur. */
const tarihOku = (ham, metin) => {
  const tarih = ham ? dayjs(ham) : dayjs(metin, "DD.MM.YYYY", true);
  return tarih.isValid() ? tarih : null;
};

const apiTarihi = (tarih) => (tarih && dayjs(tarih).isValid() ? dayjs(tarih).format("YYYY-MM-DD") : null);

const formDegerleri = (kayit) => ({
  // KodID kurali: gorunen alana etiket, gizli ...ID alanina ID yazilir.
  sigortaTuru: kayit.MSG_SIGORTA_TURU ?? null,
  sigortaTuruID: kayit.MSG_SIGORTA_KOD_ID ?? null,
  aktif: kayit.MSG_AKTIF !== false,
  baslangicTarihi: tarihOku(kayit.MSG_BASLANGIC_TARIH, kayit.MSG_BASLANGIC_TARIH_STR),
  bitisTarihi: tarihOku(kayit.MSG_TARIH, kayit.MSG_TARIH_STR),
  policeNo: kayit.MSG_POLICE_NO ?? "",
  tutar: kayit.MSG_TUTAR ?? null,
  firma: kayit.MSG_SIGORTA_SIRKETI ?? "",
  firmaID: kayit.MSG_FIRMA_ID ?? null,
  acenta: kayit.MSG_ACENTA ?? "",
  il: kayit.MSG_IL ?? "",
  ilce: kayit.MSG_ILCE ?? "",
});

/** Police ekleme / duzenleme (Ekipman/AddUpdateSigorta). Yalnizca API'nin kabul ettigi alanlar yer alir. */
export default function SigortaFormModali({ satir, kayit, onKapat, onKaydedildi }) {
  const { t } = useTranslation();
  const [yukleniyor, setYukleniyor] = useState(false);
  const methods = useForm({ defaultValues: formDegerleri(kayit) });
  const yeniKayit = !kayit.TB_MAKINE_SIGORTA_ID;

  const kaydet = methods.handleSubmit(async (veri) => {
    setYukleniyor(true);
    try {
      const response = await kaydetSigorta({
        TB_MAKINE_SIGORTA_ID: kayit.TB_MAKINE_SIGORTA_ID || 0,
        MSG_MAKINE_ID: satir.TB_MAKINE_ID,
        MSG_SIGORTA_KOD_ID: Number(veri.sigortaTuruID) || 0,
        MSG_BASLANGIC_TARIH: apiTarihi(veri.baslangicTarihi),
        MSG_TARIH: apiTarihi(veri.bitisTarihi),
        MSG_POLICE_NO: veri.policeNo || "",
        MSG_TUTAR: Number(veri.tutar) || 0,
        MSG_FIRMA_ID: Number(veri.firmaID) || 0,
        MSG_ACENTA: veri.acenta || "",
        MSG_IL: veri.il || "",
        MSG_ILCE: veri.ilce || "",
        MSG_AKTIF: Boolean(veri.aktif),
      });
      if (yanitiBildir(response, t)) onKaydedildi();
    } catch (error) {
      console.error("Sigorta kaydı kaydedilemedi:", error);
      message.error(t("islemBasarisiz"));
    } finally {
      setYukleniyor(false);
    }
  });

  return (
    <IslemModali
      genislik={900}
      baslik={yeniKayit ? t("ekipmanListesi.sigorta.yeniPolice") : t("ekipmanListesi.sigorta.detay")}
      aciklama={t("ekipmanListesi.sigorta.formAciklama")}
      kaydetMetni={t("kaydet")}
      yukleniyor={yukleniyor}
      onKaydet={kaydet}
      onKapat={onKapat}
    >
      <FormProvider {...methods}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <FormAlani etiket={t("ekipmanKodu")}>
            <Input value={satir.MKN_KOD} disabled />
          </FormAlani>
          <FormAlani etiket={t("ekipmanListesi.sigorta.tur")} zorunlu>
            <KodIDSelectbox name1="sigortaTuru" kodID={KOD_GRUPLARI.sigortaTuru} isRequired placeholder={t("ekipmanListesi.sigorta.turSeciniz")} />
          </FormAlani>
          <FormAlani etiket={t("aktif")}>
            <div className="flex h-8 items-center">
              <SwitchForm name="aktif" />
            </div>
          </FormAlani>
          <FormAlani etiket={t("baslangicTarihi")}>
            <FullDatePicker name1="baslangicTarihi" />
          </FormAlani>
          <FormAlani etiket={t("bitisTarihi")}>
            <FullDatePicker name1="bitisTarihi" />
          </FormAlani>
          <FormAlani etiket={t("ekipmanListesi.sigorta.policeNo")}>
            <TextInput name="policeNo" />
          </FormAlani>
          <FormAlani etiket={t("tutar")}>
            <NumberInput name1="tutar" minNumber={0} />
          </FormAlani>
          <FormAlani etiket={t("ekipmanListesi.sigorta.sirket")} className="lg:col-span-2">
            <FirmaTablo firmaFieldName="firma" firmaIdFieldName="firmaID" />
          </FormAlani>
          <FormAlani etiket={t("ekipmanListesi.sigorta.acenta")}>
            <TextInput name="acenta" />
          </FormAlani>
          <FormAlani etiket={t("ekipmanListesi.sigorta.il")}>
            <TextInput name="il" />
          </FormAlani>
          <FormAlani etiket={t("ekipmanListesi.sigorta.ilce")}>
            <TextInput name="ilce" />
          </FormAlani>
        </div>
      </FormProvider>
    </IslemModali>
  );
}

SigortaFormModali.propTypes = {
  satir: PropTypes.shape({ TB_MAKINE_ID: PropTypes.number.isRequired, MKN_KOD: PropTypes.string }).isRequired,
  kayit: PropTypes.object.isRequired,
  onKapat: PropTypes.func.isRequired,
  onKaydedildi: PropTypes.func.isRequired,
};
