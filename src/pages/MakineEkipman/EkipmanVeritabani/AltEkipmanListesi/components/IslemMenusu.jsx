import React, { useState } from "react";
import PropTypes from "prop-types";
import { Dropdown } from "antd";
import { useTranslation } from "react-i18next";
import { LuPencil, LuPlus, LuUnlink } from "react-icons/lu";

/**
 * Bir alt ekipmanin islem menusu (satirdaki "⋮" ve ustteki yesil "Islemler"). Stoktan baglama kaydin makinesine
 * baglar (alt kirilima degil), cikartma yalnizca ekipmana bagli kayitlarda acilir; "Degistir" icin backend ucu yok.
 */
export default function IslemMenusu({ kayit, onIslem, children }) {
  const { t } = useTranslation();
  // Alt menuden secim yapilinca antd alt menu penceresini acik birakabiliyor; menu kontrollu kapatilir ve DOM'dan kaldirilir.
  const [acik, setAcik] = useState(false);

  const ogeler = [
    {
      key: "ekle",
      icon: <LuPlus size={15} />,
      label: t("altEkipmanVeritabani.islem.ekle"),
      children: [
        { key: "stoktanBagla", label: t("altEkipmanVeritabani.islem.stoktanBagla"), disabled: !(Number(kayit?.machineId) > 0) },
        { key: "yeniAltEkipman", label: t("altEkipmanVeritabani.islem.yeniAltEkipman") },
      ],
    },
    { key: "degistir", icon: <LuPencil size={15} />, label: t("altEkipmanVeritabani.islem.degistir"), disabled: true },
    { type: "divider", key: "ayrac" },
    {
      key: "cikart",
      icon: <LuUnlink size={15} />,
      label: t("altEkipmanVeritabani.islem.cikart"),
      disabled: kayit?.connectionStatusCode !== "BAGLI",
      children: [
        { key: "stogaAl", label: t("ekipmanKarti.altEkipman.stogaAl") },
        { key: "hurdayaAyir", label: t("ekipmanKarti.altEkipman.hurdayaAyir") },
      ],
    },
  ];

  return (
    <Dropdown
      trigger={["click"]}
      open={acik}
      onOpenChange={setAcik}
      destroyPopupOnHide
      overlayClassName="ae-islem-menusu"
      menu={{
        items: ogeler,
        onClick: ({ key }) => {
          setAcik(false);
          if (kayit) onIslem(key, kayit);
        },
      }}
    >
      {children}
    </Dropdown>
  );
}

IslemMenusu.propTypes = {
  kayit: PropTypes.shape({ machineId: PropTypes.number, connectionStatusCode: PropTypes.string }),
  onIslem: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};
