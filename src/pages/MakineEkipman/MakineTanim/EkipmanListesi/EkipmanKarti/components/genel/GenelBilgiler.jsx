import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import Bolum from "../ortak/Bolum";
import Alan from "../ortak/Alan";
import DurumOzellikler from "./DurumOzellikler";
import HizliIslemler from "./HizliIslemler";
import TextInput from "../../../../../../../utils/components/Form/TextInput";
import KodIDSelectbox from "../../../../../../../utils/components/KodIDSelectbox";
import LokasyonTablo from "../../../../../../../utils/components/LokasyonTablo";
import MarkaEkleSelect from "../../../../../../../utils/components/MarkaEkleSelect";
import ModelEkleSelect from "../../../../../../../utils/components/ModelEkleSelect";
import OperatorSelectBox from "../../../../../../../utils/components/OperatorSelectBox";
import MakineTablo from "../../../../../../../utils/components/Machina/MakineTablo";
import ProjeTablo from "../../../../../../../utils/components/ProjeTablo";
import MakineTakvimTablo from "../../../../../../../utils/components/MakineTakvimTablo";
import FullDatePicker from "../../../../../../../utils/components/FullDatePicker";
import NumberInput from "../../../../../../../utils/components/NumberInput";
import ResimCarousel from "../../../../../../../utils/components/Resim/ResimCarousel";

const IZGARA = "grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2";

/** Genel Bilgiler sekmesi: solda Temel Bilgiler ve Operasyon & Maliyet, sagda gorsel, durum ozellikleri ve hizli islemler. */
export default function GenelBilgiler({ makineId, makineKaydi, resimSurumu, onVeriDegisti }) {
  const { t } = useTranslation();
  const { setValue, getValues, watch } = useFormContext();
  const markaID = watch("markaID");

  // ModelEkleSelect marka alani her degistiginde (ilk acilis dahil) modeli temizler. Marka kayittaki markaysa ve
  // model bossa kayittaki model geri yazilir. Cocuk bilesenin efekti bundan once calistigi icin sira guvenlidir.
  useEffect(() => {
    if (markaID !== (makineKaydi.MKN_MARKA_KOD_ID ?? null) || getValues("modelID")) return;
    setValue("model", makineKaydi.MKN_MODEL ?? null);
    setValue("modelID", makineKaydi.MKN_MODEL_KOD_ID ?? null);
  }, [markaID, makineKaydi, getValues, setValue]);

  return (
    <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,70fr)_minmax(0,30fr)]">
      <div className="min-w-0 space-y-5">
        <Bolum baslik={t("ekipmanKarti.genel.temelBilgiler")} altBaslik={t("ekipmanKarti.genel.temelBilgilerAciklama")}>
          <div className={IZGARA}>
            <Alan etiket={t("ekipmanKarti.genel.ekipmanKodu")} zorunlu>
              <TextInput name="makineKodu" required />
            </Alan>
            <Alan etiket={t("ekipmanKarti.genel.ekipmanTanimi")} zorunlu>
              <TextInput name="makineTanimi" required />
            </Alan>
            <Alan etiket={t("ekipmanKarti.genel.lokasyon")} zorunlu>
              <LokasyonTablo lokasyonFieldName="lokasyon" lokasyonIdFieldName="lokasyonID" isRequired />
            </Alan>
            <Alan etiket={t("ekipmanKarti.genel.ekipmanTipi")} zorunlu>
              <KodIDSelectbox name1="makineTipi" kodID={32501} isRequired placeholder="" />
            </Alan>
            <Alan etiket={t("ekipmanKarti.genel.kategori")}>
              <KodIDSelectbox name1="kategori" kodID={32502} isRequired={false} placeholder="" />
            </Alan>
            <Alan etiket={t("ekipmanKarti.genel.operator")}>
              <OperatorSelectBox name1="operator" isRequired={false} placeholder={t("ekipmanKarti.secimYapiniz")} />
            </Alan>
            <Alan etiket={t("ekipmanKarti.genel.marka")}>
              <MarkaEkleSelect markaFieldName="marka" markaIdFieldName="markaID" placeholder="" />
            </Alan>
            <Alan etiket={t("ekipmanKarti.genel.model")}>
              <ModelEkleSelect modelFieldName="model" modelIdFieldName="modelID" markaIdFieldName="markaID" placeholder="" />
            </Alan>
          </div>
        </Bolum>

        <Bolum baslik={t("ekipmanKarti.genel.operasyonMaliyet")} altBaslik={t("ekipmanKarti.genel.operasyonMaliyetAciklama")}>
          <div className={IZGARA}>
            <Alan etiket={t("ekipmanKarti.genel.durum")}>
              <KodIDSelectbox name1="operasyonDurumu" kodID={32505} isRequired={false} placeholder="" onLabelChange={(etiket) => setValue("operasyonDurumuText", etiket ?? null)} />
            </Alan>
            <Alan etiket={t("ekipmanKarti.genel.seriNo")}>
              <TextInput name="seriNo" placeholder={t("ekipmanKarti.genel.seriNo")} />
            </Alan>
            <Alan etiket={t("ekipmanKarti.genel.masterEkipman")}>
              <MakineTablo makineFieldName="masterMakine" makineIdFieldName="masterMakineID" />
            </Alan>
            <Alan etiket={t("ekipmanKarti.genel.proje")}>
              <ProjeTablo name1="proje" isRequired={false} />
            </Alan>
            <Alan etiket={t("ekipmanKarti.genel.uretici")}>
              <TextInput name="uretici" placeholder={t("ekipmanKarti.genel.uretici")} />
            </Alan>
            <Alan etiket={t("ekipmanKarti.genel.uretimYili")}>
              <FullDatePicker name1="uretimYili" pickType="year" placeholder="YYYY" />
            </Alan>
            <Alan etiket={t("ekipmanKarti.genel.garantiBitisTarihi")}>
              <FullDatePicker name1="garantiBitisTarihi" placeholder="" />
            </Alan>
            <Alan etiket={t("ekipmanKarti.genel.durusBirimMaliyeti")}>
              <NumberInput name1="durusBirimMaliyeti" minNumber={0} />
            </Alan>
            <Alan etiket={t("ekipmanKarti.genel.planCalismaSuresi")}>
              <NumberInput name1="planCalismaSuresi" minNumber={0} maxNumber={24} />
            </Alan>
            <Alan etiket={t("ekipmanKarti.genel.takvim")}>
              <MakineTakvimTablo fieldName="takvim" fieldNameID="takvimID" />
            </Alan>
          </div>
        </Bolum>
      </div>

      <aside className="min-w-0 space-y-5">
        <Bolum baslik={t("ekipmanKarti.genel.ekipmanGorseli")} altBaslik={t("ekipmanKarti.genel.ekipmanGorseliAciklama")}>
          <div className="relative overflow-hidden rounded-lg border border-(--ek-k-cizgi) bg-(--ek-k-zemin) p-2">
            <ResimCarousel makineID={makineId} refreshKey={resimSurumu} />
          </div>
        </Bolum>
        <Bolum baslik={t("ekipmanKarti.genel.durumOzellikler")} altBaslik={t("ekipmanKarti.genel.durumOzelliklerAciklama")}>
          <DurumOzellikler />
        </Bolum>
        <Bolum baslik={t("ekipmanKarti.genel.hizliIslemler")} altBaslik={t("ekipmanKarti.genel.hizliIslemlerAciklama")}>
          <HizliIslemler makineId={makineId} makineKaydi={makineKaydi} onVeriDegisti={onVeriDegisti} />
        </Bolum>
      </aside>
    </div>
  );
}

GenelBilgiler.propTypes = {
  makineId: PropTypes.number.isRequired,
  makineKaydi: PropTypes.shape({
    MKN_MARKA_KOD_ID: PropTypes.number,
    MKN_MODEL: PropTypes.string,
    MKN_MODEL_KOD_ID: PropTypes.number,
  }).isRequired,
  resimSurumu: PropTypes.number.isRequired,
  onVeriDegisti: PropTypes.func.isRequired,
};
