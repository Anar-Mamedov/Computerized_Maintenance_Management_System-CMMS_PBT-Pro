import React from "react";
import PropTypes from "prop-types";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { LuImage } from "react-icons/lu";
import Alan from "../ortak/Alan";
import SecimKutusu from "../ortak/SecimKutusu";
import SecimRadyolari from "./SecimRadyolari";
import FullDatePicker from "../../../../../../../utils/components/FullDatePicker";
import NumberInput from "../../../../../../../utils/components/NumberInput";
import LocalizedDateText from "../../../../../../../utils/components/LocalizedDateText";

const RESIM_KUTUSU =
  "flex min-h-[180px] flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-(--ek-k-cizgi) bg-(--ek-k-zemin) px-3 text-center text-(--ek-k-soluk-yazi)";

/**
 * Sayac tanimi > Detay Bilgileri: sanal sayac degerleri, guncelleme sekli ve resim kutusu.
 * Sanal sayac isaretli degilse sanal alanlari soluk ve pasiftir.
 */
export default function SayacDetayBilgileri({ duzenleme, kayit, onResimlereGit }) {
  const { t } = useTranslation();
  const { watch } = useFormContext();
  const sanal = watch("sanalSayac");

  const guncellemeSekilleri = [
    { deger: 0, etiket: t("ekipmanKarti.sayac.sekilYok") },
    { deger: 1, etiket: t("ekipmanKarti.sayac.okunanDeger") },
    { deger: 2, etiket: t("ekipmanKarti.sayac.artisDeger") },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_180px]">
      <div className="ek-kart-ic-kutu space-y-3">
        <SecimKutusu name="sanalSayac" etiket={t("ekipmanKarti.sayac.sanalSayac")} />
        <div className={`space-y-3 ${sanal ? "" : "pointer-events-none opacity-55"}`}>
          <Alan etiket={t("ekipmanKarti.baslangicTarihi")}>
            <FullDatePicker name1="baslangicTarihi" disabled={!sanal} />
          </Alan>
          <Alan etiket={t("ekipmanKarti.sayac.baslangicDegeri")}>
            <NumberInput name1="baslangicDegeri" minNumber={0} disabled={!sanal} />
          </Alan>
          <Alan etiket={t("ekipmanKarti.sayac.artisDegeriGunluk")}>
            <NumberInput name1="artisDegeri" minNumber={0} disabled={!sanal} />
          </Alan>
        </div>
      </div>

      <div className="ek-kart-ic-kutu">
        <Alan etiket={t("ekipmanKarti.sayac.guncellemeSekli")}>
          <SecimRadyolari name="guncellemeSekli" secenekler={guncellemeSekilleri} />
        </Alan>
        <p className="mt-3 mb-0 text-[11px] leading-relaxed ek-kart-soluk">
          {t("ekipmanKarti.sayac.sonGuncelleme")}:{" "}
          <span className="font-medium text-(--ek-k-yazi)">
            <LocalizedDateText value={kayit?.MES_SON_OKUMA_TARIH} timeValue={kayit?.MES_SON_OKUMA_SAAT} mode="datetime" fallback="—" />
          </span>
        </p>
      </div>

      {duzenleme ? (
        <button type="button" className={`${RESIM_KUTUSU} cursor-pointer hover:text-(--ek-k-yazi)`} onClick={onResimlereGit}>
          <LuImage size={24} />
          <span className="text-xs">{t("ekipmanKarti.sayac.resimlerdenYonetilir")}</span>
        </button>
      ) : (
        <div className={RESIM_KUTUSU}>
          <LuImage size={24} />
          <p className="m-0 text-xs">{t("ekipmanKarti.sayac.resimYok")}</p>
        </div>
      )}
    </div>
  );
}

SayacDetayBilgileri.propTypes = {
  duzenleme: PropTypes.bool.isRequired,
  kayit: PropTypes.shape({
    MES_SON_OKUMA_TARIH: PropTypes.string,
    MES_SON_OKUMA_SAAT: PropTypes.string,
  }),
  onResimlereGit: PropTypes.func.isRequired,
};
