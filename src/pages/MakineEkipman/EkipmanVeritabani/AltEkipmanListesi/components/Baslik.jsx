import React from "react";
import PropTypes from "prop-types";
import { Button, Dropdown, Segmented } from "antd";
import { useTranslation } from "react-i18next";
import { LuChevronDown, LuList, LuListTree, LuMoreVertical, LuPlus } from "react-icons/lu";
import IslemMenusu from "./IslemMenusu";

/**
 * Baslik, Liste / Agac secici, "Ekle" (yeni alt ekipman ya da secili kaydin makinesine stoktan baglama) ve secili tek
 * kayit uzerinde calisan yesil "Islemler" dugmesi.
 */
export default function Baslik({ gorunum, onGorunumDegistir, hedefKayit, onIslem }) {
  const { t } = useTranslation();

  const ekleOgeleri = [
    { key: "yeniAltEkipman", label: t("altEkipmanVeritabani.islem.yeniAltEkipman") },
    { key: "stoktanBagla", label: t("altEkipmanVeritabani.islem.stoktanBagla"), disabled: !(Number(hedefKayit?.machineId) > 0) },
  ];

  return (
    <div className="ae-baslik">
      <div>
        <h1>{t("altEkipmanVeritabani.baslik")}</h1>
        <p className="ae-soluk">{t("altEkipmanVeritabani.altBaslik")}</p>
      </div>
      <div className="ae-baslik-dugmeleri">
        <Segmented
          value={gorunum}
          onChange={onGorunumDegistir}
          options={[
            { value: "list", label: t("altEkipmanVeritabani.liste"), icon: <LuList size={14} /> },
            { value: "tree", label: t("altEkipmanVeritabani.agac"), icon: <LuListTree size={14} /> },
          ]}
        />
        <Dropdown trigger={["click"]} menu={{ items: ekleOgeleri, onClick: ({ key }) => onIslem(key, hedefKayit) }}>
          <Button type="primary" icon={<LuPlus size={14} />}>
            {t("ekle")} <LuChevronDown size={14} />
          </Button>
        </Dropdown>
        <IslemMenusu kayit={hedefKayit} onIslem={onIslem}>
          <Button className="ae-yesil-btn" disabled={!hedefKayit} icon={<LuMoreVertical size={16} />} aria-label={t("altEkipmanVeritabani.islemler")} />
        </IslemMenusu>
      </div>
    </div>
  );
}

Baslik.propTypes = {
  gorunum: PropTypes.oneOf(["list", "tree"]).isRequired,
  onGorunumDegistir: PropTypes.func.isRequired,
  hedefKayit: PropTypes.object,
  onIslem: PropTypes.func.isRequired,
};
