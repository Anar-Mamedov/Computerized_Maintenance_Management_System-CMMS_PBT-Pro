import React, { useState } from "react";
import PropTypes from "prop-types";
import { Input } from "antd";
import { useFormContext, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { LuSearch, LuX } from "react-icons/lu";
import StokSecimModali from "./StokSecimModali";

/**
 * Malzeme penceresindeki stok karti alani (rehberde "stoklu kullanim", istege bagli). Bos ise malzeme stoksuzdur.
 * Stok secilince formdaki stokId / stokKodu yazilir ve malzeme tanimi stok tanimiyla doldurulur.
 * `degistirilebilir` degilse (duzenlemede; UpdateEkipmanMalzeme stok almaz) yalnizca gosterilir.
 */
export default function StokKartiAlani({ degistirilebilir }) {
  const { t } = useTranslation();
  const { control, setValue } = useFormContext();
  const [stokId, stokKodu, stokTanim] = useWatch({ control, name: ["stokId", "stokKodu", "stokTanim"] });
  const [secimAcik, setSecimAcik] = useState(false);
  const bagli = Boolean(stokId);
  const etiket = bagli ? [stokKodu ? `(${stokKodu})` : "", stokTanim].filter(Boolean).join(" ") : "";

  const secildi = (stok) => {
    setValue("stokId", stok.TB_STOK_ID);
    setValue("stokKodu", stok.STK_KOD ?? "");
    setValue("stokTanim", stok.STK_TANIM ?? "", { shouldValidate: true });
    setSecimAcik(false);
  };

  // Baglanti kalkinca tanim kalir; kullanici serbest tanim olarak degistirebilir.
  const kaldir = () => {
    setValue("stokId", null);
    setValue("stokKodu", "");
  };

  return (
    <>
      <div className="flex items-center gap-2">
        <Input readOnly value={etiket} placeholder={t("ekipmanKarti.altEkipman.stoksuz")} title={etiket || undefined} />
        {degistirilebilir && bagli && (
          <button
            type="button"
            className="ek-kart-ikon-btn"
            aria-label={t("ekipmanKarti.altEkipman.stokBaglantisiniKaldir")}
            title={t("ekipmanKarti.altEkipman.stokBaglantisiniKaldir")}
            onClick={kaldir}
          >
            <LuX size={16} />
          </button>
        )}
        {degistirilebilir && (
          <button type="button" className="ek-kart-btn ek-kart-btn--kucuk shrink-0" onClick={() => setSecimAcik(true)}>
            <LuSearch size={14} />
            {t("ekipmanKarti.altEkipman.stoktanSec")}
          </button>
        )}
      </div>
      {secimAcik && <StokSecimModali onKapat={() => setSecimAcik(false)} onSecildi={secildi} />}
    </>
  );
}

StokKartiAlani.propTypes = {
  degistirilebilir: PropTypes.bool.isRequired,
};
