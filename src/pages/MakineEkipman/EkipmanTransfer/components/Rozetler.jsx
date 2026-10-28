import React from "react";
import PropTypes from "prop-types";
import { Tag } from "antd";
import { useTranslation } from "react-i18next";
import { EKIPMAN_DURUMLARI, TESLIM_EDILDI, TRANSFER_DURUMLARI } from "../sabitler";

/** Metin anahtardan cevrilir; bilinmeyen anahtarda backend'in gonderdigi metin yazilir. */
const rozetMetni = (t, onEk, anahtar, metin) => t(`${onEk}.${anahtar}`, { defaultValue: metin || anahtar || "–" });

/** Transfer fisinin durumu (Taslak, Onay Bekliyor ...). */
export function TransferDurumRozeti({ statusKey, statusText }) {
  const { t } = useTranslation();
  const durum = TRANSFER_DURUMLARI.find((oge) => oge.key === statusKey);

  return (
    <Tag className="et-rozet" color={durum?.renk ?? "default"}>
      {rozetMetni(t, "ekipmanTransfer.durum", statusKey, statusText)}
    </Tag>
  );
}

/** Ekipmanin operasyonel durumu (Aktif, Transferde, Bakimda, Bosta). */
export function EkipmanDurumRozeti({ statusKey, statusText }) {
  const { t } = useTranslation();
  const durum = EKIPMAN_DURUMLARI.find((oge) => oge.key === statusKey);

  return (
    <Tag className="et-rozet" color={durum?.renk ?? "default"}>
      {rozetMetni(t, "ekipmanTransfer.ekipmanDurumu", statusKey, statusText)}
    </Tag>
  );
}

/** Transfer satirinin teslim durumu; teslim alinan satir yesil rozetle gosterilir. */
export function TeslimDurumu({ deliveryStatusKey, deliveryStatusText }) {
  const { t } = useTranslation();
  const metin = rozetMetni(t, "ekipmanTransfer.teslimDurumu", deliveryStatusKey, deliveryStatusText);

  if (deliveryStatusKey === TESLIM_EDILDI) {
    return (
      <Tag className="et-rozet" color="green">
        {metin}
      </Tag>
    );
  }
  return <span className="et-soluk">{metin}</span>;
}

TransferDurumRozeti.propTypes = { statusKey: PropTypes.string, statusText: PropTypes.string };
EkipmanDurumRozeti.propTypes = { statusKey: PropTypes.string, statusText: PropTypes.string };
TeslimDurumu.propTypes = { deliveryStatusKey: PropTypes.string, deliveryStatusText: PropTypes.string };
