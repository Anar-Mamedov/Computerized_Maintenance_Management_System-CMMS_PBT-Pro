import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { LuLoader2 } from "react-icons/lu";

/** Modal alt dugmeleri: Kapat (ikincil) ve istege bagli Kaydet / onay (birincil ya da tehlikeli). */
export default function ModalDugmeleri({ onKapat, onKaydet, kaydediliyor = false, kaydetMetni, kapatMetni, tehlikeli = false, kaydetDevreDisi = false }) {
  const { t } = useTranslation();

  return (
    <>
      <button type="button" className="ek-kart-btn" onClick={onKapat} disabled={kaydediliyor}>
        {kapatMetni || t("ekipmanKarti.kapat")}
      </button>
      {onKaydet && (
        <button
          type="button"
          className={`ek-kart-btn ${tehlikeli ? "ek-kart-btn--tehlikeli" : "ek-kart-btn--birincil"}`}
          onClick={onKaydet}
          disabled={kaydediliyor || kaydetDevreDisi}
        >
          {kaydediliyor && <LuLoader2 size={14} className="animate-spin" />}
          {kaydetMetni || t("ekipmanKarti.kaydet")}
        </button>
      )}
    </>
  );
}

ModalDugmeleri.propTypes = {
  onKapat: PropTypes.func.isRequired,
  onKaydet: PropTypes.func,
  kaydediliyor: PropTypes.bool,
  kaydetMetni: PropTypes.node,
  kapatMetni: PropTypes.node,
  tehlikeli: PropTypes.bool,
  kaydetDevreDisi: PropTypes.bool,
};
