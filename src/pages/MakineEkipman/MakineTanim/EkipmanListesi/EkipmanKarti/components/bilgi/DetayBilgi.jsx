import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import Bolum from "../ortak/Bolum";
import Alan from "../ortak/Alan";
import TextInput from "../../../../../../../utils/components/Form/TextInput";
import KodIDSelectbox from "../../../../../../../utils/components/KodIDSelectbox";
import MasrafMerkeziTablo from "../../../../../../../utils/components/MasrafMerkeziTablo";
import AtolyeTablo from "../../../../../../../utils/components/AtolyeTablo";
import OncelikTablo from "../../../../../../../utils/components/OncelikTablo";
import FullDatePicker from "../../../../../../../utils/components/FullDatePicker";
import NumberInput from "../../../../../../../utils/components/NumberInput";

const IZGARA = "grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2 xl:grid-cols-3";
const BIRIM_KOD_GRUBU = 32001;

/** Deger + birim alani (ör. agirlik + kg). */
function BirimliAlan({ etiket, degerAlani, birimAlani }) {
  return (
    <Alan etiket={etiket}>
      <div className="flex gap-2">
        <div className="w-28 shrink-0">
          <NumberInput name1={degerAlani} minNumber={0} />
        </div>
        <div className="min-w-0 flex-1">
          <KodIDSelectbox name1={birimAlani} kodID={BIRIM_KOD_GRUBU} isRequired={false} placeholder="" />
        </div>
      </div>
    </Alan>
  );
}

BirimliAlan.propTypes = {
  etiket: PropTypes.string.isRequired,
  degerAlani: PropTypes.string.isRequired,
  birimAlani: PropTypes.string.isRequired,
};

/** Detay Bilgi sekmesi: eski karttaki siniflandirma, teknik/kurulum ve valf/motor alanlari (tasarim dilinde). */
export default function DetayBilgi() {
  const { t } = useTranslation();

  return (
    <div className="space-y-5">
      <Bolum baslik={t("ekipmanKarti.detay.siniflandirma")} altBaslik={t("ekipmanKarti.detay.siniflandirmaAciklama")}>
        <div className={IZGARA}>
          <Alan etiket={t("ekipmanKarti.detay.masrafMerkezi")}>
            <MasrafMerkeziTablo masrafMerkeziFieldName="masrafMerkeziDetay" masrafMerkeziIdFieldName="masrafMerkeziIDDetay" />
          </Alan>
          <Alan etiket={t("ekipmanKarti.detay.atolye")}>
            <AtolyeTablo nameFields={{ tanim: "atolyeTanim", id: "atolyeID" }} isRequired={false} />
          </Alan>
          <Alan etiket={t("ekipmanKarti.detay.bakimGrubu")}>
            <KodIDSelectbox name1="bakimGrubu" kodID={32441} isRequired={false} placeholder="" />
          </Alan>
          <Alan etiket={t("ekipmanKarti.detay.arizaGrubu")}>
            <KodIDSelectbox name1="arizaGrubu" kodID={32402} isRequired={false} placeholder="" />
          </Alan>
          <Alan etiket={t("ekipmanKarti.detay.servisSaglayici")}>
            <KodIDSelectbox name1="servisSaglayici" kodID={32508} isRequired={false} placeholder="" />
          </Alan>
          <Alan etiket={t("ekipmanKarti.detay.servisSekli")}>
            <KodIDSelectbox name1="servisSekli" kodID={32509} isRequired={false} placeholder="" />
          </Alan>
          <Alan etiket={t("ekipmanKarti.detay.teknikSeviye")}>
            <KodIDSelectbox name1="teknikSeviyesi" kodID={32510} isRequired={false} placeholder="" />
          </Alan>
          <Alan etiket={t("ekipmanKarti.detay.fizikselDurum")}>
            <KodIDSelectbox name1="fizikselDurumu" kodID={32511} isRequired={false} placeholder="" />
          </Alan>
          <Alan etiket={t("ekipmanKarti.detay.oncelik")}>
            <OncelikTablo oncelikFieldName="oncelikDetay" oncelikIdFieldName="oncelikIDDetay" />
          </Alan>
          <Alan etiket={t("ekipmanKarti.detay.riskPuani")}>
            <NumberInput name1="riskPuani" minNumber={0} />
          </Alan>
        </div>
      </Bolum>

      <Bolum baslik={t("ekipmanKarti.detay.teknikKurulum")} altBaslik={t("ekipmanKarti.detay.teknikKurulumAciklama")}>
        <div className={IZGARA}>
          <Alan etiket={t("ekipmanKarti.detay.kurulumTarihi")}>
            <FullDatePicker name1="kurulumTarihi" placeholder="" />
          </Alan>
          <Alan etiket={t("ekipmanKarti.detay.isletimSistemi")}>
            <KodIDSelectbox name1="isletimSistemi" kodID={32513} isRequired={false} placeholder="" />
          </Alan>
          <Alan etiket={t("ekipmanKarti.detay.ipNo")}>
            <TextInput name="ipNo" />
          </Alan>
          <BirimliAlan etiket={t("ekipmanKarti.detay.agirlik")} degerAlani="agirlik" birimAlani="agirlikBirim" />
          <BirimliAlan etiket={t("ekipmanKarti.detay.hacim")} degerAlani="hacim" birimAlani="hacimBirim" />
          <BirimliAlan etiket={t("ekipmanKarti.detay.kapasite")} degerAlani="kapasite" birimAlani="kapasiteBirim" />
          <BirimliAlan etiket={t("ekipmanKarti.detay.elektrikTuketimi")} degerAlani="elektrikTuketimi" birimAlani="elektrikTuketimiBirim" />
          <Alan etiket={t("ekipmanKarti.detay.voltajGuc")}>
            <div className="grid grid-cols-2 gap-2">
              <NumberInput name1="voltaj" minNumber={0} />
              <NumberInput name1="guc" minNumber={0} />
            </div>
          </Alan>
          <Alan etiket={t("ekipmanKarti.detay.faz")}>
            <NumberInput name1="faz" minNumber={0} />
          </Alan>
        </div>
      </Bolum>

      <Bolum baslik={t("ekipmanKarti.detay.valfMotor")} altBaslik={t("ekipmanKarti.detay.valfMotorAciklama")}>
        <div className={IZGARA}>
          <Alan etiket={t("ekipmanKarti.detay.valfTipi")}>
            <KodIDSelectbox name1="valfTipi" kodID={32514} isRequired={false} placeholder="" />
          </Alan>
          <Alan etiket={t("ekipmanKarti.detay.valfBoyutu")}>
            <KodIDSelectbox name1="valfBoyutu" kodID={32515} isRequired={false} placeholder="" />
          </Alan>
          <Alan etiket={t("ekipmanKarti.detay.girisBoyutu")}>
            <KodIDSelectbox name1="girisBoyutu" kodID={32516} isRequired={false} placeholder="" />
          </Alan>
          <Alan etiket={t("ekipmanKarti.detay.cikisBoyutu")}>
            <KodIDSelectbox name1="cikisBoyutu" kodID={32517} isRequired={false} placeholder="" />
          </Alan>
          <Alan etiket={t("ekipmanKarti.detay.konnektor")}>
            <KodIDSelectbox name1="konnektor" kodID={32518} isRequired={false} placeholder="" />
          </Alan>
          <Alan etiket={t("ekipmanKarti.detay.basinc")}>
            <KodIDSelectbox name1="makineBasinc" kodID={32519} isRequired={false} placeholder="" />
          </Alan>
          <BirimliAlan etiket={t("ekipmanKarti.detay.basincMiktari")} degerAlani="basincMiktar" birimAlani="basincMiktarBirim" />
          <Alan etiket={t("ekipmanKarti.detay.devirSayisi")}>
            <NumberInput name1="devirSayisi" minNumber={0} />
          </Alan>
          <Alan etiket={t("ekipmanKarti.detay.motorGucu")}>
            <NumberInput name1="motorGucu" minNumber={0} />
          </Alan>
          <Alan etiket={t("ekipmanKarti.detay.silindirSayisi")}>
            <NumberInput name1="silindirSayisi" minNumber={0} />
          </Alan>
        </div>
      </Bolum>
    </div>
  );
}
