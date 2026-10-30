import React from "react";
import PropTypes from "prop-types";
import { Tag } from "antd";
import { useTranslation } from "react-i18next";
import { BAGLANTI_ROZETLERI, DURUM_RENKLERI } from "../sabitler";
import { baglantiMetni } from "../yardimcilar";

/** Baglanti durumu (Ekipmana Bagli / Stokta / Hurda); bilinmeyen kodda backend metni yazilir. */
export function BaglantiRozeti({ kod, metin }) {
  const { t } = useTranslation();
  return (
    <Tag className="ae-rozet" color={BAGLANTI_ROZETLERI[kod]?.renk ?? "default"}>
      {baglantiMetni(kod, metin, t) || "–"}
    </Tag>
  );
}

/** Ekipman durumu kod listesinden gelen metindir; rengi bilinen adlara gore secilir. */
export function DurumRozeti({ metin }) {
  if (!metin) return <span className="ae-soluk">–</span>;
  return (
    <Tag className="ae-rozet" color={DURUM_RENKLERI[metin.toLocaleLowerCase("tr")] ?? "default"}>
      {metin}
    </Tag>
  );
}

BaglantiRozeti.propTypes = { kod: PropTypes.string, metin: PropTypes.string };
DurumRozeti.propTypes = { metin: PropTypes.string };
