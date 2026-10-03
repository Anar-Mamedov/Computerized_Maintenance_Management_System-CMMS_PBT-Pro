import React from "react";
import PropTypes from "prop-types";
import { Spin } from "antd";
import { LuChevronDown, LuChevronRight } from "react-icons/lu";
import { agacDurumuTipi, ekipmanEtiketi } from "./altEkipmanYardimcilari";

// Satir basindaki isaret: yuklenirken Spin, cocugu varsa chevron, yoksa ayni genislikte bosluk.
const satirIsareti = (cocukluMu, acik, yukleniyor) => {
  if (yukleniyor) {
    return (
      <span className="flex h-3.5 w-3.5 shrink-0 items-center justify-center">
        <Spin size="small" />
      </span>
    );
  }
  if (!cocukluMu) return <span className="h-3.5 w-3.5 shrink-0" />;
  return acik ? <LuChevronDown size={14} className="ek-kart-soluk shrink-0" /> : <LuChevronRight size={14} className="ek-kart-soluk shrink-0" />;
};

/** Agacta bir alt ekipman satiri ve (aciksa) cocuklari. Cocugu olan satira tiklayinca acilir / kapanir. */
export default function AgacSatiri({ kayit, seviye, ustEkipmanId, agac }) {
  const id = kayit.TB_EKIPMAN_ID;
  const cocukluMu = Boolean(kayit.hasChild);
  const acik = agac.acikIdler.includes(id);
  const secili = Boolean(agac.seciliKayitlar[id]);
  const cocuklar = agac.cocuklar[id] ?? [];
  const etiket = ekipmanEtiketi(kayit);

  return (
    <li>
      <div
        className={`ek-kart-agac__satir ${cocukluMu ? "cursor-pointer" : ""} ${secili ? "ek-kart-agac__satir--secili" : ""}`}
        style={{ paddingLeft: 16 + 20 * seviye }}
        onClick={cocukluMu ? () => agac.acKapat(kayit) : undefined}
      >
        <input type="checkbox" checked={secili} aria-label={etiket} onChange={() => agac.secimiDegistir(kayit, ustEkipmanId)} onClick={(olay) => olay.stopPropagation()} />
        {satirIsareti(cocukluMu, acik, agac.yuklenenIdler.includes(id))}
        <span className="min-w-0 truncate text-sm" title={etiket}>
          {kayit.EKP_KOD ? <span className="ek-kart-soluk">({kayit.EKP_KOD})</span> : null} {kayit.EKP_TANIM}
        </span>
      </div>
      {acik && cocuklar.length > 0 && (
        <ul className="ek-kart-agac">
          {cocuklar.map((cocuk) => (
            <AgacSatiri key={cocuk.clientKey} kayit={cocuk} seviye={seviye + 1} ustEkipmanId={id} agac={agac} />
          ))}
        </ul>
      )}
    </li>
  );
}

AgacSatiri.propTypes = {
  /** GetEkipmanVeritabaniListe kaydi: TB_EKIPMAN_ID, EKP_KOD, EKP_TANIM, hasChild, clientKey. */
  kayit: PropTypes.object.isRequired,
  seviye: PropTypes.number.isRequired,
  /** Ust ekipmanin TB_EKIPMAN_ID'si; kok seviyede 0 (ust = makine). */
  ustEkipmanId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  agac: agacDurumuTipi.isRequired,
};
