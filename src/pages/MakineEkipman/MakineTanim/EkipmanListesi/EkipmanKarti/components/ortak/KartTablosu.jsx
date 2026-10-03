import React from "react";
import PropTypes from "prop-types";
import { Table } from "antd";
import { useTranslation } from "react-i18next";

/**
 * Tasarimdaki tablo: ince cerceve, gri baslik satiri, satir uzerinde vurgu. antd Table ozellikleri aynen gecer.
 * Kolon basliklari `buyukHarf` ile verilir (CSS uppercase Turkce "i" harfini bozar).
 * `ic`: bolum karti icindeki tablolar (golgesiz, kucuk kose).
 */
export default function KartTablosu({ ic = false, className = "", locale, ...tabloOzellikleri }) {
  const { t } = useTranslation();

  return (
    <div className={`ek-kart-tablo-cerceve ${ic ? "ek-kart-tablo-cerceve--ic" : ""} ${className}`}>
      <Table className="ek-kart-tablo" size="middle" pagination={false} tableLayout="fixed" locale={{ emptyText: t("ekipmanKarti.kayitYok"), ...locale }} {...tabloOzellikleri} />
    </div>
  );
}

KartTablosu.propTypes = {
  ic: PropTypes.bool,
  className: PropTypes.string,
  locale: PropTypes.object,
};
