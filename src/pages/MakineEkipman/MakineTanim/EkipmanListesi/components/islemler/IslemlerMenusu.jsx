import React from "react";
import PropTypes from "prop-types";
import { Dropdown } from "antd";
import { useTranslation } from "react-i18next";
import { LuMoreVertical } from "react-icons/lu";
import useTemaDegiskenleri from "../../useTemaDegiskenleri";
import { ISLEMLER, TOPLU_MENU_BOLUMLERI } from "./islemTanimlari";
import { menuBasligi, menuOgesi } from "./menuOgesi";

/** Yesil islem dugmesi: secili ekipmanlar uzerindeki makine, toplu, diger ve form islemleri. */
export default function IslemlerMenusu({ seciliSatirlar, onIslem }) {
  const { t, i18n } = useTranslation();
  const temaDegiskenleri = useTemaDegiskenleri();
  const adet = seciliSatirlar.length;

  const ogeler = [
    menuBasligi(t("ekipmanListesi.islemler.baslik"), t("ekipmanListesi.islemler.seciliKayit", { adet })),
    ...TOPLU_MENU_BOLUMLERI.flatMap((bolum) => [
      { type: "divider", key: `ayrac-${bolum.key}` },
      {
        type: "group",
        key: bolum.key,
        // CSS text-transform dil bilmedigi icin (i -> I) buyuk harfe dile gore cevrilir.
        label: t(bolum.baslikKey).toLocaleUpperCase(i18n.language),
        children: bolum.islemler.map((anahtar) => menuOgesi(anahtar, t, ISLEMLER[anahtar].tekKayit && adet !== 1)),
      },
    ]),
  ];

  return (
    <Dropdown
      trigger={["click"]}
      placement="bottomRight"
      disabled={adet === 0}
      overlayClassName="ek-tokenlar ek-islem-menusu"
      overlayStyle={{ ...temaDegiskenleri, width: 320 }}
      menu={{ items: ogeler, onClick: ({ key }) => onIslem(key, seciliSatirlar) }}
    >
      <button type="button" className="ek-ikon-btn ek-ikon-btn--islem" disabled={adet === 0} aria-label={t("ekipmanListesi.islemlerMenusu")}>
        <LuMoreVertical size={16} />
      </button>
    </Dropdown>
  );
}

IslemlerMenusu.propTypes = {
  seciliSatirlar: PropTypes.arrayOf(PropTypes.object).isRequired,
  onIslem: PropTypes.func.isRequired,
};
