import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { LuMoreHorizontal } from "react-icons/lu";
import DugumMenusu from "./DugumMenusu";

// Dugme satirin / basligin icinde: tiklama ve klavye olayi satiri acip kapatmasin.
const yayilmayiDurdur = (olay) => olay.stopPropagation();

/** Satir ve grup basliginin sonundaki "…" dugmesi: sag tik menusuyle ayni ogeleri tiklayinca acar (dokunmatik ekranlar icin). */
export default function DugumMenuDugmesi({ ogeleriAl, onAcildi }) {
  const { t } = useTranslation();

  return (
    <DugumMenusu tetik="click" ogeleriAl={ogeleriAl} onAcildi={onAcildi}>
      <button type="button" className="ek-kart-ikon-btn" aria-label={t("ekipmanKarti.islemler")} aria-haspopup="menu" onClick={yayilmayiDurdur} onKeyDown={yayilmayiDurdur}>
        <LuMoreHorizontal size={16} />
      </button>
    </DugumMenusu>
  );
}

DugumMenuDugmesi.propTypes = {
  ogeleriAl: PropTypes.func.isRequired,
  onAcildi: PropTypes.func,
};
