import React from "react";
import PropTypes from "prop-types";
import { Dropdown } from "antd";
import { useTranslation } from "react-i18next";
import useTemaDegiskenleri from "../../useTemaDegiskenleri";
import { SATIR_MENUSU } from "./islemTanimlari";
import { menuBasligi, menuOgesi } from "./menuOgesi";

/**
 * Tek bir ekipmanin islem menusu. Tabloda sag tik (kontrollu), kartlarda "..." dugmesi (kontrolsuz) ile acilir.
 */
export default function SatirIslemMenusu({ satir, tetikleyici, acik, onAcikDegistir, onIslem, children }) {
  const { t } = useTranslation();
  const temaDegiskenleri = useTemaDegiskenleri();
  const kontrollu = acik !== undefined;

  const ogeler = [...(satir ? [menuBasligi(satir.MKN_KOD, satir.MKN_TANIM), { type: "divider", key: "ayrac" }] : []), ...SATIR_MENUSU.map((anahtar) => menuOgesi(anahtar, t))];

  const tiklandi = ({ key, domEvent }) => {
    // Menu portal ile acilsa da React olaylari kartin tiklamasina kadar kabarir; detay acilmasin.
    domEvent.stopPropagation();
    if (satir) onIslem(key, [satir]);
    if (kontrollu) onAcikDegistir(false);
  };

  return (
    <Dropdown
      trigger={[tetikleyici]}
      overlayClassName="ek-tokenlar ek-islem-menusu"
      overlayStyle={{ ...temaDegiskenleri, width: 288 }}
      menu={{ items: ogeler, onClick: tiklandi }}
      {...(kontrollu ? { open: acik, onOpenChange: onAcikDegistir } : {})}
    >
      {children}
    </Dropdown>
  );
}

SatirIslemMenusu.propTypes = {
  satir: PropTypes.shape({ MKN_KOD: PropTypes.string, MKN_TANIM: PropTypes.string }),
  tetikleyici: PropTypes.oneOf(["click", "contextMenu"]).isRequired,
  acik: PropTypes.bool,
  onAcikDegistir: PropTypes.func,
  onIslem: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};
