import React from "react";
import PropTypes from "prop-types";
import { LuCog, LuFolder, LuPackage } from "react-icons/lu";
import { DUGUM } from "./altEkipmanYardimcilari";

const IKONLAR = {
  [DUGUM.GRUP]: LuFolder,
  [DUGUM.EKIPMAN]: LuCog,
  [DUGUM.MALZEME]: LuPackage,
};

/** Agac dugumunun tipini gosteren kucuk ikon: grup klasor, ekipman disli, malzeme paket. */
export default function DugumIkonu({ tip }) {
  const Ikon = IKONLAR[tip] ?? LuCog;
  return <Ikon size={14} className="ek-kart-soluk shrink-0" aria-hidden />;
}

DugumIkonu.propTypes = {
  tip: PropTypes.oneOf(Object.values(DUGUM)).isRequired,
};
