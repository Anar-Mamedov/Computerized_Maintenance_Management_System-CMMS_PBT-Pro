import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import Bolum from "../ortak/Bolum";
import DosyaUpload from "../../../../../../../utils/components/Dosya/DosyaUpload";

/** Ekli Belgeler sekmesi: makineye ait dosyalar (global DosyaUpload, RefGrup MAKINE). */
export default function EkliBelgeler({ makineId }) {
  const { t } = useTranslation();

  return (
    <Bolum baslik={t("ekipmanKarti.belgeler.baslik")} altBaslik={t("ekipmanKarti.belgeler.aciklama")}>
      <DosyaUpload selectedRowID={makineId} refGroup="MAKINE" />
    </Bolum>
  );
}

EkliBelgeler.propTypes = {
  makineId: PropTypes.number.isRequired,
};
