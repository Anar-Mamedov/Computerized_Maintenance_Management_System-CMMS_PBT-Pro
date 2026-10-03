import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { LuFuel, LuTrendingUp } from "react-icons/lu";
import Bolum from "../ortak/Bolum";
import Alan from "../ortak/Alan";
import SecimKutusu from "../ortak/SecimKutusu";
import KodIDSelectbox from "../../../../../../../utils/components/KodIDSelectbox";
import NumberInput from "../../../../../../../utils/components/NumberInput";

const YAKIT_TIPI_KOD_GRUBU = 35600;

/** Sayi alani + sagdaki birim (ör. lt). */
function BirimliSayi({ alan, birim, saltOkunur = false }) {
  return (
    <div className="flex items-center gap-2">
      <div className={`min-w-0 flex-1 ${saltOkunur ? "ek-kart-salt-okunur" : ""}`}>
        <NumberInput name1={alan} minNumber={0} readOnly={saltOkunur} />
      </div>
      <span className="w-12 shrink-0 text-xs text-(--ek-k-soluk-yazi)">{birim}</span>
    </div>
  );
}

BirimliSayi.propTypes = {
  alan: PropTypes.string.isRequired,
  birim: PropTypes.string.isRequired,
  saltOkunur: PropTypes.bool,
};

/** Yakit Bilgileri sekmesi (tasarimdaki iki bolum). Yalnizca "Yakit Kullanir" isaretli ekipmanlarda gorunur. */
export default function YakitBilgileri() {
  const { t } = useTranslation();
  const tuketimBirimi = t("ekipmanKarti.yakit.tuketimBirimi");

  return (
    <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
      <Bolum baslik={t("ekipmanKarti.yakit.yakitBilgileri")} altBaslik={t("ekipmanKarti.yakit.yakitBilgileriAciklama")}>
        <div className="space-y-4">
          <Alan etiket={t("ekipmanKarti.yakit.yakitTipi")}>
            <KodIDSelectbox name1="makineYakitTipi" kodID={YAKIT_TIPI_KOD_GRUBU} isRequired={false} placeholder="" showDropdownAdd={false} />
          </Alan>
          <Alan etiket={t("ekipmanKarti.yakit.depoHacmi")}>
            <BirimliSayi alan="YakitDepoHacmi" birim={t("ekipmanKarti.yakit.litre")} />
          </Alan>
          <div className="ek-kart-ic-kutu space-y-2">
            <div className="flex items-center gap-2 text-xs font-medium text-(--ek-k-soluk-yazi)">
              <LuFuel size={14} />
              {t("ekipmanKarti.yakit.girisKurallari")}
            </div>
            <SecimKutusu name="makineYakitSayacTakibi" etiket={t("ekipmanKarti.yakit.sayacTakibiZorunlu")} />
            <SecimKutusu name="makineYakitSayacGuncellemesi" etiket={t("ekipmanKarti.yakit.sayacGuncellemesiYap")} />
          </div>
        </div>
      </Bolum>

      <Bolum baslik={t("ekipmanKarti.yakit.ortalamaTuketim")} altBaslik={t("ekipmanKarti.yakit.ortalamaTuketimAciklama")}>
        <div className="space-y-4">
          <Alan etiket={t("ekipmanKarti.yakit.ongorulenMin")}>
            <BirimliSayi alan="ongorulenMin" birim={tuketimBirimi} />
          </Alan>
          <Alan etiket={t("ekipmanKarti.yakit.ongorulenMax")}>
            <BirimliSayi alan="ongorulenMax" birim={tuketimBirimi} />
          </Alan>
          <Alan etiket={t("ekipmanKarti.yakit.gerceklesen")}>
            <BirimliSayi alan="gerceklesen" birim={tuketimBirimi} saltOkunur />
          </Alan>
          <div className="ek-kart-not">
            <LuTrendingUp size={14} />
            <p className="m-0">{t("ekipmanKarti.yakit.gerceklesenNotu")}</p>
          </div>
        </div>
      </Bolum>
    </div>
  );
}
