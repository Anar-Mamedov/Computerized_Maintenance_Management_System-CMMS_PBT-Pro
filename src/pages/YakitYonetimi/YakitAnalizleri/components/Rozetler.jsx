import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { isaretliYuzde } from "../../ortak/yakitBicim";

/** Renkli kucuk rozet; `ton`: basari | uyari | tehlike | bilgi | notr. */
export function Rozet({ ton, children }) {
  return <span className={`ya-rozet ya-rozet--${ton}`}>{children}</span>;
}

Rozet.propTypes = { ton: PropTypes.oneOf(["basari", "uyari", "tehlike", "bilgi", "notr"]).isRequired, children: PropTypes.node };

/**
 * 30 gunluk fark rozeti (dokuman 3.1): "down" yesil, "flat" mavi, "up" ve fark >= %10 kirmizi, "up" ve < %10 turuncu.
 */
export function FarkRozeti({ yuzde, ton: yon }) {
  const { t, i18n } = useTranslation();
  let ton = "bilgi";
  if (yon === "down") ton = "basari";
  if (yon === "up") ton = Number(yuzde) >= 10 ? "tehlike" : "uyari";
  return <Rozet ton={ton}>{isaretliYuzde(yuzde, i18n.language, t)}</Rozet>;
}

FarkRozeti.propTypes = { yuzde: PropTypes.number, ton: PropTypes.oneOf(["up", "down", "flat"]) };

/** Makine tipi / lokasyon modali durum rozeti (dokuman 3.2): Iyi yesil, Normal mavi, Incelenmeli turuncu. */
const MODAL_DURUMLARI = {
  İyi: { ton: "basari", labelKey: "yakitAnalizleri.durum.iyi" },
  Normal: { ton: "bilgi", labelKey: "yakitAnalizleri.durum.normal" },
  İncelenmeli: { ton: "uyari", labelKey: "yakitAnalizleri.durum.incelenmeli" },
};

/** Ekipman performansi sapma rozeti (dokuman 3.4): Veri Yetersiz gri, Normal yesil, Incelenmeli turuncu, Yuksek Sapma kirmizi. */
const SAPMA_DURUMLARI = {
  "Veri Yetersiz": { ton: "notr", labelKey: "yakitAnalizleri.durum.veriYetersiz" },
  Normal: { ton: "basari", labelKey: "yakitAnalizleri.durum.normal" },
  İncelenmeli: { ton: "uyari", labelKey: "yakitAnalizleri.durum.incelenmeli" },
  "Yüksek Sapma": { ton: "tehlike", labelKey: "yakitAnalizleri.durum.yuksekSapma" },
};

/** Backend'in durum metnini rengiyle ve dil dosyasindaki karsiligiyla gosterir; bilinmeyen metin oldugu gibi yazilir. */
function DurumRozeti({ durum, tablo }) {
  const { t } = useTranslation();
  if (!durum) return "–";
  const tanim = tablo[durum];
  return <Rozet ton={tanim?.ton ?? "notr"}>{tanim ? t(tanim.labelKey) : durum}</Rozet>;
}

DurumRozeti.propTypes = { durum: PropTypes.string, tablo: PropTypes.object.isRequired };

export const ModalDurumRozeti = ({ durum }) => <DurumRozeti durum={durum} tablo={MODAL_DURUMLARI} />;

ModalDurumRozeti.propTypes = { durum: PropTypes.string };

export const SapmaDurumRozeti = ({ durum }) => <DurumRozeti durum={durum} tablo={SAPMA_DURUMLARI} />;

SapmaDurumRozeti.propTypes = { durum: PropTypes.string };
