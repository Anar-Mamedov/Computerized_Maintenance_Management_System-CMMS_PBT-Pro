import React from "react";
import PropTypes from "prop-types";
import BakimDetayModali from "./BakimDetayModali";
import BakimDuzenleModali from "./BakimDuzenleModali";
import BakimEkleme from "./BakimEkleme";
import BakimSilmeModali from "./BakimSilmeModali";
import IleriTarihePlanlaModali from "./IleriTarihePlanlaModali";
import BakimIptalModali from "./BakimIptalModali";
import IsEmriOlusturModali from "./IsEmriOlusturModali";
import BakimTarihcesiModali from "./BakimTarihcesiModali";

/** Menuden / satirdan acilan pencere. Listeyi degistiren islemler bitince `onTamamlandi` cagrilir. */
export default function BakimModallari({ modal, makineId, onDegistir, onKapat, onTamamlandi }) {
  if (!modal) return null;

  const { tur, kayit, kayitlar } = modal;
  const ortak = { makineId, onKapat, onTamamlandi };

  switch (tur) {
    case "detay":
      return <BakimDetayModali kayit={kayit} onKapat={onKapat} onDuzenle={() => onDegistir({ tur: "duzenle", kayit })} />;
    case "duzenle":
      return <BakimDuzenleModali {...ortak} kayit={kayit} />;
    case "ekle":
      return <BakimEkleme {...ortak} />;
    case "sil":
      return <BakimSilmeModali kayitlar={kayitlar} onKapat={onKapat} onTamamlandi={onTamamlandi} />;
    case "planla":
      return <IleriTarihePlanlaModali {...ortak} kayitlar={kayitlar} />;
    case "iptal":
      return <BakimIptalModali {...ortak} kayitlar={kayitlar} />;
    case "isEmri":
      return <IsEmriOlusturModali {...ortak} kayit={kayit} />;
    case "tarihce":
      return <BakimTarihcesiModali makineId={makineId} kayit={kayit} onKapat={onKapat} />;
    default:
      return null;
  }
}

BakimModallari.propTypes = {
  /** { tur, kayit? (tek kayit), kayitlar? (secili kayitlar) } */
  modal: PropTypes.shape({
    tur: PropTypes.string.isRequired,
    kayit: PropTypes.object,
    kayitlar: PropTypes.arrayOf(PropTypes.object),
  }),
  makineId: PropTypes.number.isRequired,
  onDegistir: PropTypes.func.isRequired,
  onKapat: PropTypes.func.isRequired,
  onTamamlandi: PropTypes.func.isRequired,
};
