import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import KartModali from "./KartModali";
import ModalDugmeleri from "./ModalDugmeleri";

/** "Liste Ozellikleri": tablo kolonlarini gosterir / gizler. Ilk kolon (ana bilgi) her zaman gorunur kalir. */
export default function ListeOzellikleriModali({ acik, kolonlar, gizliAnahtarlar, onDegistir, onKapat }) {
  const { t } = useTranslation();

  const degistir = (anahtar, gorunur) => {
    onDegistir(gorunur ? gizliAnahtarlar.filter((gizli) => gizli !== anahtar) : [...gizliAnahtarlar, anahtar]);
  };

  return (
    <KartModali
      acik={acik}
      baslik={t("ekipmanKarti.listeOzellikleri")}
      altBaslik={t("ekipmanKarti.listeOzellikleriAciklama")}
      genislik={420}
      onKapat={onKapat}
      altBilgi={<ModalDugmeleri onKapat={onKapat} />}
    >
      <div className="grid grid-cols-1 gap-2">
        {kolonlar.map((kolon, index) => {
          const gorunur = !gizliAnahtarlar.includes(kolon.key);
          return (
            <label key={kolon.key} className={`ek-kart-secim ${index === 0 ? "ek-kart-secim--pasif" : ""}`}>
              <input type="checkbox" checked={gorunur} disabled={index === 0} onChange={(olay) => degistir(kolon.key, olay.target.checked)} />
              <span className="min-w-0 truncate">{kolon.baslikMetni}</span>
            </label>
          );
        })}
      </div>
    </KartModali>
  );
}

ListeOzellikleriModali.propTypes = {
  acik: PropTypes.bool.isRequired,
  /** { key, baslikMetni } */
  kolonlar: PropTypes.arrayOf(PropTypes.shape({ key: PropTypes.string.isRequired, baslikMetni: PropTypes.node })).isRequired,
  gizliAnahtarlar: PropTypes.arrayOf(PropTypes.string).isRequired,
  onDegistir: PropTypes.func.isRequired,
  onKapat: PropTypes.func.isRequired,
};
