import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { Dropdown } from "antd";
import { useTranslation } from "react-i18next";
import useTemaDegiskenleri from "../../../useTemaDegiskenleri";

// Odak cekmecenin disindaysa (ör. acik bir modalda) kisayollar calismaz.
const odakCekmecedeMi = () => {
  const odak = document.activeElement;
  return !odak || odak === document.body || Boolean(odak.closest(".ek-kart-kok"));
};

const tumOgeler = (ogeler) => ogeler.flatMap((oge) => (oge.altOgeler ? [oge, ...oge.altOgeler] : [oge]));

const menuOgesi = (oge) => ({
  key: oge.key,
  icon: oge.ikon,
  disabled: oge.devreDisi,
  danger: oge.tehlikeli,
  label: (
    <span className="ek-kart-menu__satir">
      <span className="min-w-0 truncate">{oge.etiket}</span>
      {oge.kisayol && <span className="ek-kart-menu__kisayol">{oge.kisayol}</span>}
    </span>
  ),
});

/**
 * Sekmelerin yesil "⋮" islem menusu.
 * Ogeler: { key, etiket, onClick, kisayol?, ikon?, devreDisi?, tehlikeli?, altOgeler? } ya da { tip: "ayrac" }.
 * `aktif` iken (sekme gorunur ve uzerinde modal yok) menudeki F4 / F5 / F7 / F9 kisayollari klavyeden de calisir.
 */
export default function IslemMenusu({ ogeler, aktif = false }) {
  const { t } = useTranslation();
  const temaDegiskenleri = useTemaDegiskenleri();
  const [acik, setAcik] = useState(false);
  const ogelerRef = useRef(ogeler);

  useEffect(() => {
    ogelerRef.current = ogeler;
  }, [ogeler]);

  useEffect(() => {
    if (!aktif) return undefined;

    const tusaBasildi = (olay) => {
      const oge = tumOgeler(ogelerRef.current).find((aday) => aday.kisayol && aday.kisayol === olay.key);
      if (!oge || oge.devreDisi || !odakCekmecedeMi()) return;
      // F5 tarayicida sayfayi yeniler; burada yalnizca listeyi yeniler.
      olay.preventDefault();
      setAcik(false);
      oge.onClick();
    };

    window.addEventListener("keydown", tusaBasildi);
    return () => window.removeEventListener("keydown", tusaBasildi);
  }, [aktif]);

  const menuOgeleri = ogeler.map((oge, index) => {
    if (oge.tip === "ayrac") return { type: "divider", key: `ayrac-${index}` };
    if (!oge.altOgeler) return menuOgesi(oge);
    return {
      ...menuOgesi(oge),
      popupClassName: "ek-sicil ek-kart-menu",
      children: oge.altOgeler.map(menuOgesi),
    };
  });

  const tiklandi = ({ key }) => {
    const oge = tumOgeler(ogeler).find((aday) => aday.key === key);
    setAcik(false);
    oge?.onClick?.();
  };

  return (
    <Dropdown
      trigger={["click"]}
      placement="bottomRight"
      open={acik}
      onOpenChange={setAcik}
      overlayClassName="ek-sicil ek-kart-menu"
      overlayStyle={{ ...temaDegiskenleri, minWidth: 240 }}
      menu={{ items: menuOgeleri, onClick: tiklandi }}
    >
      <button type="button" className="ek-kart-islem-btn" aria-label={t("ekipmanKarti.islemler")} aria-haspopup="menu" aria-expanded={acik}>
        <span className="ek-kart-islem-btn__nokta">⋮</span>
      </button>
    </Dropdown>
  );
}

const ogeTipi = PropTypes.shape({
  key: PropTypes.string,
  etiket: PropTypes.node,
  onClick: PropTypes.func,
  kisayol: PropTypes.string,
  ikon: PropTypes.node,
  devreDisi: PropTypes.bool,
  tehlikeli: PropTypes.bool,
  tip: PropTypes.oneOf(["ayrac"]),
});

IslemMenusu.propTypes = {
  ogeler: PropTypes.arrayOf(PropTypes.oneOfType([ogeTipi, PropTypes.shape({ altOgeler: PropTypes.arrayOf(ogeTipi) })])).isRequired,
  aktif: PropTypes.bool,
};
