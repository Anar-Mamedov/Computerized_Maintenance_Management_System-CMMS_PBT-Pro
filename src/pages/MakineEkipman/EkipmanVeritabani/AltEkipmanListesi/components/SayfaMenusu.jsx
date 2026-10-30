import React from "react";
import PropTypes from "prop-types";
import { Button, Dropdown } from "antd";
import { useTranslation } from "react-i18next";
import { LuColumns, LuFileSpreadsheet, LuMenu } from "react-icons/lu";

/** Sayfa geneli islemler (Ekipman Listesi'ndeki gibi): listeyi Excel'e aktarma ve "Sütunları Yönet". */
export default function SayfaMenusu({ excelHazirlaniyor, onExcel, onKolonAyarlari }) {
  const { t } = useTranslation();

  const ogeler = [
    { key: "excel", icon: <LuFileSpreadsheet size={16} />, label: t("altEkipmanVeritabani.listeyiDisaAktar"), disabled: excelHazirlaniyor },
    { key: "kolonlar", icon: <LuColumns size={16} />, label: t("sutunlariYonet") },
  ];

  const tiklandi = ({ key }) => {
    if (key === "excel") onExcel();
    if (key === "kolonlar") onKolonAyarlari();
  };

  return (
    <Dropdown trigger={["click"]} placement="bottomLeft" menu={{ items: ogeler, onClick: tiklandi }}>
      {/* Excel hazirlanirken yukleniyor gosterilir. */}
      <Button icon={<LuMenu size={16} />} loading={excelHazirlaniyor} aria-label={t("altEkipmanVeritabani.sayfaMenusu")} />
    </Dropdown>
  );
}

SayfaMenusu.propTypes = {
  excelHazirlaniyor: PropTypes.bool.isRequired,
  onExcel: PropTypes.func.isRequired,
  onKolonAyarlari: PropTypes.func.isRequired,
};
