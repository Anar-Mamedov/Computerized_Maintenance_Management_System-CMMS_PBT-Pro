import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import LocalizedDateText from "../../../../../../../utils/components/LocalizedDateText";
import BilgiKutusu from "../ortak/BilgiKutusu";
import { bosIse } from "../../yardimcilar";

/** Ileri tarihe planlama / iptal modallarinin ustu: tek kayitta bakim ve mevcut hedef tarih, coklu secimde adet. */
export default function SeciliBakimOzeti({ kayitlar }) {
  const { t } = useTranslation();

  if (kayitlar.length > 1) {
    return <p className="text-sm font-medium">{t("ekipmanKarti.bakim.seciliBakimSayisi", { sayi: kayitlar.length })}</p>;
  }

  const [kayit] = kayitlar;
  return (
    <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
      <BilgiKutusu etiket={t("ekipmanKarti.bakim.bakim")}>{bosIse(kayit.PBK_TANIM)}</BilgiKutusu>
      <BilgiKutusu etiket={t("ekipmanKarti.bakim.mevcutHedefTarih")}>
        <LocalizedDateText value={kayit.HEDEF_TARIH} fallback="—" />
      </BilgiKutusu>
    </div>
  );
}

SeciliBakimOzeti.propTypes = {
  kayitlar: PropTypes.arrayOf(PropTypes.object).isRequired,
};
