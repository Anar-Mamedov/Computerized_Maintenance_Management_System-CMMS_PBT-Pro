import React, { useState } from "react";
import PropTypes from "prop-types";
import { Dropdown } from "antd";
import useTemaDegiskenleri from "../../../useTemaDegiskenleri";

const tumOgeler = (ogeler) => ogeler.flatMap((oge) => (oge.altOgeler ? [oge, ...oge.altOgeler] : [oge]));

// Islem menusundeki (ortak/IslemMenusu) satirla ayni gorunum: etiket ve sagda kisayol.
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

// Menu portal'da cizilse de React olaylari bilesen agacinda yukari tasinir; menudeki tiklama / tus satiri ya da grup
// basligini acip kapatmasin diye menu kabugunda durdurulur.
const yayilmayiDurdur = (olay) => olay.stopPropagation();
const menuKabugu = (menu) => (
  <div onClick={yayilmayiDurdur} onKeyDown={yayilmayiDurdur}>
    {menu}
  </div>
);

const menuOgeleri = (ogeler) =>
  ogeler.map((oge, index) => {
    if (oge.tip === "ayrac") return { type: "divider", key: `ayrac-${index}` };
    if (!oge.altOgeler) return menuOgesi(oge);
    return { ...menuOgesi(oge), popupClassName: "ek-sicil ek-kart-menu", children: oge.altOgeler.map(menuOgesi) };
  });

/**
 * Agac dugumunun islem menusu: satirin sag tikinda (`tetik="contextMenu"`) ya da satir sonundaki "…" dugmesinde
 * (`tetik="click"`) acilir. Ogeler IslemMenusu ile ayni bicimdedir ({ key, etiket, onClick, altOgeler? } ya da ayrac) ve
 * yalnizca menu acilirken `ogeleriAl` ile hazirlanir. `onAcildi` menu acilinca cagrilir (ör. dugumu secmek icin).
 */
export default function DugumMenusu({ tetik = "contextMenu", ogeleriAl, onAcildi, children }) {
  const temaDegiskenleri = useTemaDegiskenleri();
  const [ogeler, setOgeler] = useState(null);

  const acikDegisti = (acik) => {
    if (!acik) {
      setOgeler(null);
      return;
    }
    setOgeler(ogeleriAl());
    onAcildi?.();
  };

  const tiklandi = ({ key }) => {
    const oge = tumOgeler(ogeler ?? []).find((aday) => aday.key === key);
    setOgeler(null);
    oge?.onClick?.();
  };

  return (
    <Dropdown
      trigger={[tetik]}
      placement={tetik === "click" ? "bottomRight" : undefined}
      open={Boolean(ogeler)}
      onOpenChange={acikDegisti}
      overlayClassName="ek-sicil ek-kart-menu"
      overlayStyle={{ ...temaDegiskenleri, minWidth: 240 }}
      menu={{ items: menuOgeleri(ogeler ?? []), onClick: tiklandi }}
      dropdownRender={menuKabugu}
    >
      {children}
    </Dropdown>
  );
}

DugumMenusu.propTypes = {
  tetik: PropTypes.oneOf(["contextMenu", "click"]),
  ogeleriAl: PropTypes.func.isRequired,
  onAcildi: PropTypes.func,
  children: PropTypes.element.isRequired,
};
