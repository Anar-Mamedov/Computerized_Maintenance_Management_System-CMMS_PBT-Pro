import React, { useState } from "react";
import PropTypes from "prop-types";
import GenelBilgiler from "./genel/GenelBilgiler";
import AltEkipmanlar from "./altEkipman/AltEkipmanlar";
import DetayBilgi from "./bilgi/DetayBilgi";
import FinansalBilgiler from "./bilgi/FinansalBilgiler";
import Sayaclar from "./sayac/Sayaclar";
import PeriyodikBakimlar from "./periyodikBakim/PeriyodikBakimlar";
import YakitBilgileri from "./bilgi/YakitBilgileri";
import AracDetaylari from "./arac/AracDetaylari";
import OzelAlanlar from "./bilgi/OzelAlanlar";
import Notlar from "./bilgi/Notlar";
import EkliBelgeler from "./bilgi/EkliBelgeler";
import Resimler from "./bilgi/Resimler";

const listeVerisiTipi = PropTypes.shape({
  kayitlar: PropTypes.arrayOf(PropTypes.object).isRequired,
  yukleniyor: PropTypes.bool.isRequired,
  yenile: PropTypes.func.isRequired,
});

/**
 * Kart govdesi. Sekmeler ilk acildiklarinda olusturulur ve sonra gizlenerek korunur: form bilesenlerinin
 * acilis davranislari (ör. ModelEkleSelect'in marka degisince modeli temizlemesi) tekrar calismaz,
 * liste sekmelerindeki secimler kaybolmaz.
 */
export default function SekmeIcerigi({ aktifSekme, makineId, makineKaydi, sekmeVerileri, resimSurumu, onResimDegisti, onVeriDegisti }) {
  const [acilanSekmeler, setAcilanSekmeler] = useState([aktifSekme]);

  if (!acilanSekmeler.includes(aktifSekme)) {
    setAcilanSekmeler([...acilanSekmeler, aktifSekme]);
  }

  const sekmeyiCiz = (anahtar) => {
    const aktif = anahtar === aktifSekme;
    switch (anahtar) {
      case "genel":
        return <GenelBilgiler makineId={makineId} makineKaydi={makineKaydi} resimSurumu={resimSurumu} onVeriDegisti={onVeriDegisti} />;
      case "altEkipman":
        return <AltEkipmanlar makineId={makineId} veri={sekmeVerileri.altEkipmanlar} aktif={aktif} onVeriDegisti={onVeriDegisti} />;
      case "detay":
        return <DetayBilgi />;
      case "finansal":
        return <FinansalBilgiler />;
      case "sayac":
        return <Sayaclar makineId={makineId} veri={sekmeVerileri.sayaclar} aktif={aktif} onVeriDegisti={onVeriDegisti} />;
      case "periyodikBakim":
        return <PeriyodikBakimlar makineId={makineId} veri={sekmeVerileri.bakimlar} aktif={aktif} onVeriDegisti={onVeriDegisti} />;
      case "yakit":
        return <YakitBilgileri />;
      case "arac":
        return <AracDetaylari makineId={makineId} aktif={aktif} />;
      case "ozelAlanlar":
        return <OzelAlanlar />;
      case "notlar":
        return <Notlar />;
      case "belgeler":
        return <EkliBelgeler makineId={makineId} />;
      case "resimler":
        return <Resimler makineId={makineId} onResimDegisti={onResimDegisti} />;
      default:
        return null;
    }
  };

  return (
    <div className="ek-kart-govde">
      {acilanSekmeler.map((anahtar) => (
        <div key={anahtar} role="tabpanel" hidden={anahtar !== aktifSekme}>
          {sekmeyiCiz(anahtar)}
        </div>
      ))}
    </div>
  );
}

SekmeIcerigi.propTypes = {
  aktifSekme: PropTypes.string.isRequired,
  makineId: PropTypes.number.isRequired,
  makineKaydi: PropTypes.object.isRequired,
  sekmeVerileri: PropTypes.shape({
    altEkipmanlar: listeVerisiTipi.isRequired,
    sayaclar: listeVerisiTipi.isRequired,
    bakimlar: listeVerisiTipi.isRequired,
  }).isRequired,
  resimSurumu: PropTypes.number.isRequired,
  onResimDegisti: PropTypes.func.isRequired,
  onVeriDegisti: PropTypes.func.isRequired,
};
