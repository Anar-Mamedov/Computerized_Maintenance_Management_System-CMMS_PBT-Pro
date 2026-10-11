import React from "react";
import PropTypes from "prop-types";
import IsEmriOlusturModali from "../../../../../../MakineEkipman/MakineTanim/EkipmanListesi/EkipmanKarti/components/periyodikBakim/IsEmriOlusturModali";
import IleriTarihePlanlaModali from "../../../../../../MakineEkipman/MakineTanim/EkipmanListesi/EkipmanKarti/components/periyodikBakim/IleriTarihePlanlaModali";
import BakimIptalModali from "../../../../../../MakineEkipman/MakineTanim/EkipmanListesi/EkipmanKarti/components/periyodikBakim/BakimIptalModali";
import "../../../../../../MakineEkipman/MakineTanim/EkipmanListesi/EkipmanKarti/ekipmanKarti.css";

/** Bakim isleminin penceresi; Ekipman Karti'ndaki pencereler secili hucrenin bilgileriyle acilir. */
export default function BakimIslemModali({ modal, onKapat, onTamamlandi }) {
  if (!modal) return null;

  const { tur, hucre } = modal;
  const kayit = {
    TB_PERIYODIK_BAKIM_ID: Number(hucre.bakimID),
    PBK_TANIM: hucre.recordMachine,
    HEDEF_TARIH: hucre.tarih,
  };
  const ortak = { makineId: Number(hucre.makineID), onKapat, onTamamlandi };

  switch (tur) {
    case "isEmri":
      return <IsEmriOlusturModali {...ortak} kayit={kayit} />;
    case "planla":
      return <IleriTarihePlanlaModali {...ortak} kayitlar={[kayit]} />;
    case "iptal":
      return <BakimIptalModali {...ortak} kayitlar={[kayit]} />;
    default:
      return null;
  }
}

BakimIslemModali.propTypes = {
  /** { tur, hucre: { makineID, bakimID, recordMachine, tarih (YYYY-MM-DD) } } */
  modal: PropTypes.shape({
    tur: PropTypes.string.isRequired,
    hucre: PropTypes.object.isRequired,
  }),
  onKapat: PropTypes.func.isRequired,
  onTamamlandi: PropTypes.func.isRequired,
};
