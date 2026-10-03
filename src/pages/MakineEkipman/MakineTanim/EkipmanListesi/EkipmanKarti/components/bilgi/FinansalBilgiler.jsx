import React from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import Bolum from "../ortak/Bolum";
import Alan from "../ortak/Alan";
import TextInput from "../../../../../../../utils/components/Form/TextInput";
import SwitchForm from "../../../../../../../utils/components/Form/SwitchForm";
import KodIDSelectbox from "../../../../../../../utils/components/KodIDSelectbox";
import FirmaTablo from "../../../../../../../utils/components/FirmaTablo";
import FullDatePicker from "../../../../../../../utils/components/FullDatePicker";
import NumberInput from "../../../../../../../utils/components/NumberInput";

const IZGARA = "grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2";

/** Finansal Bilgiler sekmesi: satinalma, kredi, kiralama ve satis bilgileri (eski karttaki alanlar). */
export default function FinansalBilgiler() {
  const { t } = useTranslation();
  const { watch } = useFormContext();
  const [kiralik, satildi] = watch(["kiralik", "satildi"]);

  return (
    <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
      <div className="min-w-0 space-y-5">
        <Bolum baslik={t("ekipmanKarti.finansal.satinalma")} altBaslik={t("ekipmanKarti.finansal.satinalmaAciklama")}>
          <div className={IZGARA}>
            <Alan etiket={t("ekipmanKarti.finansal.firma")}>
              <FirmaTablo firmaFieldName="satinalmaFirma" firmaIdFieldName="satinalmaFirmaID" />
            </Alan>
            <Alan etiket={t("ekipmanKarti.finansal.faturaNo")}>
              <TextInput name="faturaNo" />
            </Alan>
            <Alan etiket={t("ekipmanKarti.finansal.satinalmaTarihi")}>
              <FullDatePicker name1="satinalmaTarihi" placeholder="" />
            </Alan>
            <Alan etiket={t("ekipmanKarti.finansal.faturaTarihi")}>
              <FullDatePicker name1="faturaTarihi" placeholder="" />
            </Alan>
            <Alan etiket={t("ekipmanKarti.finansal.satinalmaFiyati")}>
              <NumberInput name1="satinalmaFiyati" minNumber={0} />
            </Alan>
            <Alan etiket={t("ekipmanKarti.finansal.faturaTutari")}>
              <NumberInput name1="faturaTutari" minNumber={0} />
            </Alan>
          </div>
        </Bolum>

        <Bolum baslik={t("ekipmanKarti.finansal.kredi")} altBaslik={t("ekipmanKarti.finansal.krediAciklama")}>
          <div className={IZGARA}>
            <Alan etiket={t("ekipmanKarti.finansal.krediMiktari")}>
              <NumberInput name1="krediMiktari" minNumber={0} />
            </Alan>
            <Alan etiket={t("ekipmanKarti.finansal.krediOrani")}>
              <NumberInput name1="krediOrani" minNumber={0} />
            </Alan>
            <Alan etiket={t("ekipmanKarti.baslangicTarihi")}>
              <FullDatePicker name1="krediBaslamaTarihi" placeholder="" />
            </Alan>
            <Alan etiket={t("ekipmanKarti.bitisTarihi")}>
              <FullDatePicker name1="krediBitisTarihi" placeholder="" />
            </Alan>
          </div>
        </Bolum>
      </div>

      <div className="min-w-0 space-y-5">
        <Bolum baslik={t("ekipmanKarti.finansal.kiralik")} altBaslik={t("ekipmanKarti.finansal.kiralikAciklama")} eylem={<SwitchForm name="kiralik" />}>
          <div className={IZGARA}>
            <Alan etiket={t("ekipmanKarti.finansal.firma")}>
              <FirmaTablo firmaFieldName="kiralikFirma" firmaIdFieldName="kiralikFirmaID" disabled={!kiralik} />
            </Alan>
            <Alan etiket={t("ekipmanKarti.finansal.kiraTutari")}>
              <NumberInput name1="kiraTutari" minNumber={0} disabled={!kiralik} />
            </Alan>
            <Alan etiket={t("ekipmanKarti.baslangicTarihi")}>
              <FullDatePicker name1="kiraBaslangicTarihi" disabled={!kiralik} placeholder="" />
            </Alan>
            <Alan etiket={t("ekipmanKarti.bitisTarihi")}>
              <FullDatePicker name1="kiraBitisTarihi" disabled={!kiralik} placeholder="" />
            </Alan>
            <Alan etiket={t("ekipmanKarti.finansal.kiraSuresi")}>
              <div className="flex gap-2">
                <div className="w-24 shrink-0">
                  <NumberInput name1="kiraSuresi" minNumber={0} disabled={!kiralik} />
                </div>
                <div className="min-w-0 flex-1">
                  <KodIDSelectbox name1="kiraSuresiBirim" kodID={32001} isRequired={false} disabled={!kiralik} placeholder="" />
                </div>
              </div>
            </Alan>
            <Alan etiket={t("ekipmanKarti.aciklama")}>
              <TextInput name="kiraAciklama" disabled={!kiralik} />
            </Alan>
          </div>
        </Bolum>

        <Bolum baslik={t("ekipmanKarti.finansal.satildi")} altBaslik={t("ekipmanKarti.finansal.satildiAciklama")} eylem={<SwitchForm name="satildi" />}>
          <div className={IZGARA}>
            <Alan etiket={t("ekipmanKarti.finansal.satisNedeni")}>
              <TextInput name="satisNedeni" disabled={!satildi} />
            </Alan>
            <Alan etiket={t("ekipmanKarti.finansal.satisTarihi")}>
              <FullDatePicker name1="satisTarihi" disabled={!satildi} placeholder="" />
            </Alan>
            <Alan etiket={t("ekipmanKarti.finansal.satisYeri")}>
              <TextInput name="satisYeri" disabled={!satildi} />
            </Alan>
            <Alan etiket={t("ekipmanKarti.finansal.satisTutari")}>
              <NumberInput name1="satisTutari" minNumber={0} disabled={!satildi} />
            </Alan>
            <Alan etiket={t("ekipmanKarti.aciklama")} className="sm:col-span-2">
              <TextInput name="satisAciklama" disabled={!satildi} />
            </Alan>
          </div>
        </Bolum>
      </div>
    </div>
  );
}
