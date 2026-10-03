import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { LuPlus } from "react-icons/lu";
import Bolum from "../ortak/Bolum";
import KartTablosu from "../ortak/KartTablosu";

/** Sigorta / kaza / ceza listelerinin ortak bolumu: baslik, "Yeni ..." dugmesi, tablo ve alt not. Satira tiklama kaydi acar. */
export default function AracListeBolumu({ baslik, altBaslik, yeniMetni, kolonlar, kayitlar, yukleniyor, onYeni, onSatirTikla }) {
  const { t } = useTranslation();

  return (
    <Bolum
      baslik={baslik}
      altBaslik={altBaslik}
      eylem={
        <button type="button" className="ek-kart-btn" onClick={onYeni}>
          <LuPlus size={14} />
          {yeniMetni}
        </button>
      }
    >
      <KartTablosu
        ic
        rowKey="clientKey"
        columns={kolonlar}
        dataSource={kayitlar}
        loading={yukleniyor}
        rowClassName="ek-kart-satir--tiklanir"
        onRow={(kayit) => ({ onClick: () => onSatirTikla(kayit) })}
      />
      <p className="ek-kart-soluk mt-2.5 text-[11px] leading-relaxed">{t("ekipmanKarti.arac.listeNotu")}</p>
    </Bolum>
  );
}

AracListeBolumu.propTypes = {
  baslik: PropTypes.node.isRequired,
  altBaslik: PropTypes.node,
  yeniMetni: PropTypes.node.isRequired,
  /** antd kolon tanimlari */
  kolonlar: PropTypes.arrayOf(PropTypes.object).isRequired,
  /** her kayitta clientKey olmali */
  kayitlar: PropTypes.arrayOf(PropTypes.object).isRequired,
  yukleniyor: PropTypes.bool,
  onYeni: PropTypes.func.isRequired,
  onSatirTikla: PropTypes.func.isRequired,
};
