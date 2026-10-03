import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import Rozet from "../ortak/Rozet";
import { sayiMetni, sayiYaDaNull } from "../../yardimcilar";

/**
 * Bitise kalan gun rozeti: gecmisse hata ("{{gun}} gun gecti"), 30 gun ve altiysa uyari, digerleri basari.
 * `kisa`: tablodaki metin ("{{gun}} gun"), degilse "{{gun}} gun kaldi". Deger yoksa `bos` cizilir.
 */
export default function KalanGunRozeti({ gun, kisa = false, bos = null }) {
  const { t, i18n } = useTranslation();
  const sayi = sayiYaDaNull(gun);
  if (sayi === null) return bos;

  const metin = sayiMetni(Math.abs(sayi), i18n.language);
  if (sayi < 0) return <Rozet ton="hata">{t("ekipmanKarti.arac.gunGecti", { gun: metin })}</Rozet>;

  return <Rozet ton={sayi <= 30 ? "uyari" : "basari"}>{kisa ? t("ekipmanKarti.arac.gun", { gun: metin }) : t("ekipmanKarti.arac.gunKaldi", { gun: metin })}</Rozet>;
}

KalanGunRozeti.propTypes = {
  gun: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  kisa: PropTypes.bool,
  bos: PropTypes.node,
};
