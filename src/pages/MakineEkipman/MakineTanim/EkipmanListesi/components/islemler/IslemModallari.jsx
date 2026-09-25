import React from "react";
import PropTypes from "prop-types";
import AktiflikModali from "./AktiflikModali";
import IsEmriOlusturma from "./IsEmriOlusturma";
import SilmeModali from "./SilmeModali";
import TopluDurumModali from "./TopluDurumModali";
import TopluSayacModali from "./TopluSayacModali";
import TopluTipModali from "./TopluTipModali";
import SigortaModali from "./sigorta/SigortaModali";
import Tarihce from "../../../components/ContextMenu/components/Tarihçe/Tarihce";
import TopluLokasyon from "../../../components/ContextMenu/components/TopluLokasyon/CreateModal";

/** Menuden secilen islemin penceresini acar. Degisiklik yapan islemler bitince `onTamamlandi` cagrilir. */
export default function IslemModallari({ aktifIslem, onKapat, onTamamlandi }) {
  if (!aktifIslem) return null;

  const { anahtar, satirlar } = aktifIslem;
  const ortak = { satirlar, onKapat, onTamamlandi };

  switch (anahtar) {
    case "aktiflik":
      return <AktiflikModali {...ortak} />;
    case "isEmri":
      return <IsEmriOlusturma satir={satirlar[0]} onKapat={onKapat} />;
    case "sayac":
      return <TopluSayacModali {...ortak} />;
    case "tip":
      return <TopluTipModali {...ortak} />;
    case "durum":
      return <TopluDurumModali {...ortak} />;
    case "sil":
      return <SilmeModali {...ortak} />;
    case "sigorta":
      return <SigortaModali satir={satirlar[0]} onKapat={onKapat} />;
    case "tarihce":
      return <Tarihce selectedRows={satirlar} open onClose={onKapat} />;
    case "lokasyon":
      return <TopluLokasyon open onClose={onKapat} onRefresh={onTamamlandi} />;
    default:
      return null;
  }
}

IslemModallari.propTypes = {
  aktifIslem: PropTypes.shape({
    anahtar: PropTypes.string.isRequired,
    satirlar: PropTypes.arrayOf(PropTypes.object).isRequired,
  }),
  onKapat: PropTypes.func.isRequired,
  onTamamlandi: PropTypes.func.isRequired,
};
