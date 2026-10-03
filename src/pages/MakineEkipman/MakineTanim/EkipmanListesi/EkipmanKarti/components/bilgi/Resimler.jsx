import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import Bolum from "../ortak/Bolum";
import ResimUpload from "../../../../../../../utils/components/Resim/ResimUpload";

/** Resimler sekmesi: makine resimleri (global ResimUpload). Yukleme sonrasi Genel Bilgiler'deki gorsel de yenilenir. */
export default function Resimler({ makineId, onResimDegisti }) {
  const { t } = useTranslation();

  return (
    <Bolum baslik={t("ekipmanKarti.resimler.baslik")} altBaslik={t("ekipmanKarti.resimler.aciklama")}>
      <ResimUpload selectedRowID={makineId} refGroup="MAKINE" onUploadSuccess={onResimDegisti} allowDelete />
    </Bolum>
  );
}

Resimler.propTypes = {
  makineId: PropTypes.number.isRequired,
  onResimDegisti: PropTypes.func.isRequired,
};
