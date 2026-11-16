import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { LuChevronDown, LuChevronRight } from "react-icons/lu";
import AgacSatiri from "./AgacSatiri";
import DugumIkonu from "./DugumIkonu";
import DugumMenusu from "./DugumMenusu";
import DugumMenuDugmesi from "./DugumMenuDugmesi";
import { agacDurumuTipi, dugumAdi, dugumEtiketi, dugumTipi } from "./altEkipmanYardimcilari";
import { buyukHarf, sayiMetni } from "../../yardimcilar";

const BOS_GRUP_STILI = { padding: "12px 16px" };
// "Diger" basliginda menu dugmesi yoktur; kayit sayilari hizali kalsin diye ayni genislikte bosluk birakilir.
const DUGME_YERI_STILI = { width: 24 };

/**
 * Agacin bir bolumu: makineye bagli bir grup ya da gruba bagli olmayan kayitlar ("Diger"). Basliga tiklayinca acilir / kapanir.
 * Grup basligi da bir dugumdur: kutucukla secilir, sag tik ya da sondaki "…" grubun islem menusunu acar.
 */
export default function AltEkipmanGrubu({ bolum, agac, menuOgeleriniAl }) {
  const { t, i18n } = useTranslation();
  const { grup } = bolum;
  const acik = !agac.kapaliBolumler.includes(bolum.anahtar);
  const secili = Boolean(grup) && agac.seciliAnahtar === grup.anahtar;
  const baslik = grup ? dugumAdi(grup) : t("ekipmanKarti.altEkipman.tipsiz");
  const menuOgeleri = () => menuOgeleriniAl(grup);
  const sec = () => agac.sec(grup.anahtar);

  const acKapat = () => agac.bolumuAcKapat(bolum.anahtar);
  const tusaBasildi = (olay) => {
    if (olay.key !== "Enter" && olay.key !== " ") return;
    olay.preventDefault();
    acKapat();
  };

  const baslikSatiri = (
    <div
      role="button"
      tabIndex={0}
      aria-expanded={acik}
      className={`ek-kart-grup-basligi ${secili ? "ek-kart-agac__satir--secili" : ""}`}
      onClick={acKapat}
      onKeyDown={tusaBasildi}
    >
      <span className="flex min-w-0 items-center gap-2">
        {acik ? <LuChevronDown size={16} className="ek-kart-soluk shrink-0" /> : <LuChevronRight size={16} className="ek-kart-soluk shrink-0" />}
        {grup && (
          <>
            <input
              type="checkbox"
              checked={secili}
              aria-label={baslik}
              onChange={() => agac.secimiDegistir(grup.anahtar)}
              onClick={(olay) => olay.stopPropagation()}
              onKeyDown={(olay) => olay.stopPropagation()}
            />
            <DugumIkonu tip={grup.tip} />
          </>
        )}
        <span className="truncate text-xs font-semibold tracking-wide" title={grup ? dugumEtiketi(grup) : undefined}>
          {buyukHarf(baslik, i18n.language)}
        </span>
      </span>
      <span className="flex shrink-0 items-center gap-2">
        <span className="ek-kart-soluk text-xs">{t("ekipmanKarti.altEkipman.kayitSayisi", { sayi: sayiMetni(bolum.dugumler.length, i18n.language) })}</span>
        {grup ? <DugumMenuDugmesi ogeleriAl={menuOgeleri} onAcildi={sec} /> : <span style={DUGME_YERI_STILI} />}
      </span>
    </div>
  );

  const govde = bolum.dugumler.length ? (
    <ul className="ek-kart-agac">
      {bolum.dugumler.map((dugum) => (
        <AgacSatiri key={dugum.clientKey} dugum={dugum} seviye={0} agac={agac} menuOgeleriniAl={menuOgeleriniAl} />
      ))}
    </ul>
  ) : (
    <p className="ek-kart-agac ek-kart-soluk text-xs" style={BOS_GRUP_STILI}>
      {t("ekipmanKarti.altEkipman.grupBos")}
    </p>
  );

  return (
    <section className="ek-kart-bolum overflow-hidden">
      {grup ? (
        <DugumMenusu ogeleriAl={menuOgeleri} onAcildi={sec}>
          {baslikSatiri}
        </DugumMenusu>
      ) : (
        baslikSatiri
      )}
      {acik && govde}
    </section>
  );
}

AltEkipmanGrubu.propTypes = {
  bolum: PropTypes.shape({
    anahtar: PropTypes.string.isRequired,
    /** Kok grup dugumu; "Diger" bolumunde null. */
    grup: dugumTipi,
    dugumler: PropTypes.arrayOf(dugumTipi).isRequired,
  }).isRequired,
  agac: agacDurumuTipi.isRequired,
  /** Dugumun sag tik menusu ogeleri (useAltEkipmanMenuleri.dugumOgeleri). */
  menuOgeleriniAl: PropTypes.func.isRequired,
};
