import React from "react";
import PropTypes from "prop-types";
import { Dropdown } from "antd";
import { useTranslation } from "react-i18next";
import { LuColumns, LuFileSpreadsheet, LuLoader2, LuMenu } from "react-icons/lu";

/** Sayfa geneli islemler: listeyi Excel olarak indirme ve kolon ayarlari. */
export default function SayfaMenusu({ excelHazirlaniyor, onExcel, onKolonAyarlari }) {
  const { t } = useTranslation();

  const ogeler = [
    { key: "excel", icon: <LuFileSpreadsheet size={16} />, label: t("ekipmanListesi.listeyiDisaAktar"), disabled: excelHazirlaniyor },
    { key: "kolonlar", icon: <LuColumns size={16} />, label: t("ekipmanListesi.kolonAyarlari") },
  ];

  const tiklandi = ({ key }) => {
    if (key === "excel") onExcel();
    if (key === "kolonlar") onKolonAyarlari();
  };

  return (
    <Dropdown trigger={["click"]} placement="bottomLeft" menu={{ items: ogeler, onClick: tiklandi }}>
      <button type="button" className="ek-ikon-btn" aria-label={t("ekipmanListesi.sayfaMenusu")} aria-busy={excelHazirlaniyor}>
        {/* Eski tablodaki "İndir" butonu gibi, Excel hazirlanirken yukleniyor gosterilir. */}
        {excelHazirlaniyor ? <LuLoader2 size={16} className="animate-spin" /> : <LuMenu size={16} />}
      </button>
    </Dropdown>
  );
}

SayfaMenusu.propTypes = {
  excelHazirlaniyor: PropTypes.bool.isRequired,
  onExcel: PropTypes.func.isRequired,
  onKolonAyarlari: PropTypes.func.isRequired,
};
