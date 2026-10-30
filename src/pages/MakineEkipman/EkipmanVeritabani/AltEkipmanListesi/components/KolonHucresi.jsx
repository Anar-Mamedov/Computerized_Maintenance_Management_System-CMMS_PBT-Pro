import React from "react";
import PropTypes from "prop-types";
import LocalizedDateText from "../../../../../utils/components/LocalizedDateText";
import { BaglantiRozeti, DurumRozeti } from "./Rozetler";

/** Liste ve agac tablosunda bir alt ekipman hucresi: kolonun `tur`'une gore cizilir, turu olmayan kolon `alan` degerini yazar. */
export default function KolonHucresi({ kolon, satir, onDetay }) {
  const deger = satir[kolon.alan];

  switch (kolon.tur) {
    case "kod":
      return (
        <button type="button" className="ae-link" title={deger || undefined} onClick={() => onDetay(satir)}>
          {deger}
        </button>
      );
    case "baglanti":
      return <BaglantiRozeti kod={satir.connectionStatusCode} metin={satir.connectionStatus} />;
    case "durum":
      return <DurumRozeti metin={deger} />;
    case "tarih":
      return (
        <span className="ae-tasan">
          <LocalizedDateText value={deger} fallback="–" />
        </span>
      );
    default:
      return (
        <span className={`ae-tasan ${kolon.tur === "kalin" ? "ae-kalin" : ""}`} title={deger || undefined}>
          {deger || "–"}
        </span>
      );
  }
}

KolonHucresi.propTypes = {
  kolon: PropTypes.shape({ alan: PropTypes.string, tur: PropTypes.string }).isRequired,
  satir: PropTypes.object.isRequired,
  onDetay: PropTypes.func.isRequired,
};
