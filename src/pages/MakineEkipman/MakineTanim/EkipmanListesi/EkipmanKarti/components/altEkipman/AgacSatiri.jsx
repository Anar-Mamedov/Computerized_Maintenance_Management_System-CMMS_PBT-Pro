import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { LuChevronDown, LuChevronRight } from "react-icons/lu";
import DugumIkonu from "./DugumIkonu";
import DugumMenusu from "./DugumMenusu";
import DugumMenuDugmesi from "./DugumMenuDugmesi";
import { DUGUM, agacDurumuTipi, dugumAdi, dugumEtiketi, dugumKodu, dugumTipi } from "./altEkipmanYardimcilari";
import { sayiMetni } from "../../yardimcilar";

// Satir basindaki isaret: alt kirilimi varsa chevron, yoksa ayni genislikte bosluk.
const satirIsareti = (cocukluMu, acik) => {
  if (!cocukluMu) return <span className="h-3.5 w-3.5 shrink-0" />;
  return acik ? <LuChevronDown size={14} className="ek-kart-soluk shrink-0" /> : <LuChevronRight size={14} className="ek-kart-soluk shrink-0" />;
};

/**
 * Agacta bir grup / ekipman / malzeme satiri ve (aciksa) alt kirilimi. Alt kirilimi olan satira tiklayinca acilir / kapanir;
 * kutucuk satiri secer, sag tik ya da satir sonundaki "…" satiri secip tipine gore islem menusunu acar.
 */
export default function AgacSatiri({ dugum, seviye, agac, menuOgeleriniAl }) {
  const { t, i18n } = useTranslation();
  const cocukluMu = dugum.cocuklar.length > 0;
  const acik = cocukluMu && agac.acikAnahtarlar.includes(dugum.anahtar);
  const secili = agac.seciliAnahtar === dugum.anahtar;
  const etiket = dugumEtiketi(dugum);
  const kod = dugumKodu(dugum);
  const miktarVar = dugum.tip === DUGUM.MALZEME && dugum.EML_MIKTAR !== null && dugum.EML_MIKTAR !== undefined;
  const menuOgeleri = () => menuOgeleriniAl(dugum);
  const sec = () => agac.sec(dugum.anahtar);

  return (
    <li>
      <DugumMenusu ogeleriAl={menuOgeleri} onAcildi={sec}>
        <div
          className={`ek-kart-agac__satir ${cocukluMu ? "cursor-pointer" : ""} ${secili ? "ek-kart-agac__satir--secili" : ""}`}
          style={{ paddingLeft: 16 + 20 * seviye }}
          onClick={cocukluMu ? () => agac.acKapat(dugum.anahtar) : undefined}
        >
          <input type="checkbox" checked={secili} aria-label={etiket} onChange={() => agac.secimiDegistir(dugum.anahtar)} onClick={(olay) => olay.stopPropagation()} />
          {satirIsareti(cocukluMu, acik)}
          <div className="flex min-w-0 items-center gap-2 text-sm">
            <DugumIkonu tip={dugum.tip} />
            <span className={`min-w-0 truncate ${dugum.anaEkipman ? "font-semibold" : ""}`} title={etiket}>
              {kod ? <span className="ek-kart-soluk">({kod})</span> : null} {dugumAdi(dugum)}
            </span>
            {miktarVar && (
              <span className="ek-kart-soluk shrink-0 text-xs">{t("ekipmanKarti.altEkipman.miktarEtiketi", { miktar: sayiMetni(dugum.EML_MIKTAR, i18n.language) })}</span>
            )}
            <span className="ml-auto flex shrink-0">
              <DugumMenuDugmesi ogeleriAl={menuOgeleri} onAcildi={sec} />
            </span>
          </div>
        </div>
      </DugumMenusu>
      {acik && (
        <ul className="ek-kart-agac">
          {dugum.cocuklar.map((cocuk) => (
            <AgacSatiri key={cocuk.clientKey} dugum={cocuk} seviye={seviye + 1} agac={agac} menuOgeleriniAl={menuOgeleriniAl} />
          ))}
        </ul>
      )}
    </li>
  );
}

AgacSatiri.propTypes = {
  dugum: dugumTipi.isRequired,
  seviye: PropTypes.number.isRequired,
  agac: agacDurumuTipi.isRequired,
  /** Dugumun sag tik menusu ogeleri (useAltEkipmanMenuleri.dugumOgeleri). */
  menuOgeleriniAl: PropTypes.func.isRequired,
};
