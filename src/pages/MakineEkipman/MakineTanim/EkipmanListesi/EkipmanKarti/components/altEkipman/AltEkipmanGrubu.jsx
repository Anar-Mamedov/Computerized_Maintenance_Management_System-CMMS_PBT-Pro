import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { LuChevronDown, LuChevronRight } from "react-icons/lu";
import AgacSatiri from "./AgacSatiri";
import { agacDurumuTipi } from "./altEkipmanYardimcilari";
import { buyukHarf, sayiMetni } from "../../yardimcilar";

/** Bir ekipman tipinin (grup) karti: acilip kapanan baslik ve kok seviyedeki alt ekipmanlarin agaci. */
export default function AltEkipmanGrubu({ grup, acik, onAcKapat, agac }) {
  const { t, i18n } = useTranslation();
  const baslik = grup.tip || t("ekipmanKarti.altEkipman.tipsiz");

  return (
    <section className="ek-kart-bolum overflow-hidden">
      <button type="button" className="ek-kart-grup-basligi" aria-expanded={acik} onClick={onAcKapat}>
        <span className="flex min-w-0 items-center gap-2">
          {acik ? <LuChevronDown size={16} className="ek-kart-soluk shrink-0" /> : <LuChevronRight size={16} className="ek-kart-soluk shrink-0" />}
          <span className="truncate text-xs font-semibold tracking-wide">{buyukHarf(baslik, i18n.language)}</span>
        </span>
        <span className="ek-kart-soluk shrink-0 text-xs">{t("ekipmanKarti.altEkipman.kayitSayisi", { sayi: sayiMetni(grup.kayitlar.length, i18n.language) })}</span>
      </button>
      {acik && (
        <ul className="ek-kart-agac">
          {grup.kayitlar.map((kayit) => (
            <AgacSatiri key={kayit.clientKey} kayit={kayit} seviye={0} ustEkipmanId={0} agac={agac} />
          ))}
        </ul>
      )}
    </section>
  );
}

AltEkipmanGrubu.propTypes = {
  grup: PropTypes.shape({
    anahtar: PropTypes.string.isRequired,
    tip: PropTypes.string.isRequired,
    kayitlar: PropTypes.arrayOf(PropTypes.object).isRequired,
  }).isRequired,
  acik: PropTypes.bool.isRequired,
  onAcKapat: PropTypes.func.isRequired,
  agac: agacDurumuTipi.isRequired,
};
