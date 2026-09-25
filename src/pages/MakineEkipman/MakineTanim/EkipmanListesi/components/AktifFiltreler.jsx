import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { LuX } from "react-icons/lu";
import { bakimDurumunuBul } from "../ekipmanMetinleri";

/** ID filtresi -> secenek listesi ve grup basligi eslemesi. */
const ID_GRUPLARI = [
  { alan: "lokasyonIds", secenekAnahtari: "lokasyon", baslikKey: "lokasyon" },
  { alan: "makineTipIds", secenekAnahtari: "makineTipi", baslikKey: "makineTipi" },
  { alan: "kategoriIds", secenekAnahtari: "kategori", baslikKey: "kategori" },
  { alan: "markaIds", secenekAnahtari: "marka", baslikKey: "marka" },
  { alan: "modelIds", secenekAnahtari: "model", baslikKey: "model" },
  { alan: "atolyeIds", secenekAnahtari: "atolye", baslikKey: "ekipmanListesi.kolon.sorumluAtolye" },
  { alan: "durumIds", secenekAnahtari: "durum", baslikKey: "durum" },
];

/** Uygulanan her filtre bir cip olarak gosterilir; cipten tek tek ya da topluca kaldirilabilir. */
export default function AktifFiltreler({ filtreler, secenekler, onFiltreDegistir, onTumunuTemizle }) {
  const { t } = useTranslation();
  const cipler = [];

  ID_GRUPLARI.forEach(({ alan, secenekAnahtari, baslikKey }) => {
    filtreler[alan].forEach((id) => {
      const secenek = (secenekler[secenekAnahtari] || []).find((oge) => oge.value === id);
      cipler.push({
        anahtar: `${alan}-${id}`,
        etiket: secenek?.label || `${t(baslikKey)} #${id}`,
        kaldir: () => onFiltreDegistir({ [alan]: filtreler[alan].filter((secili) => secili !== id) }),
      });
    });
  });

  if (filtreler.makineIds.length) {
    cipler.push({
      anahtar: "makineIds",
      etiket: t("ekipmanListesi.seciliEkipmanlar", { adet: filtreler.makineIds.length }),
      kaldir: () => onFiltreDegistir({ makineIds: [] }),
    });
  }

  const bakim = bakimDurumunuBul(filtreler.bakimDurumu);
  if (bakim) {
    cipler.push({
      anahtar: "bakimDurumu",
      etiket: `${t("ekipmanListesi.kolon.periyodikBakim")}: ${t(bakim.labelKey)}`,
      kaldir: () => onFiltreDegistir({ bakimDurumu: null }),
    });
  }

  if (typeof filtreler.arizali === "boolean") {
    cipler.push({
      anahtar: "arizali",
      etiket: filtreler.arizali ? t("ekipmanListesi.aktifArizaVar") : t("ekipmanListesi.aktifArizaYok"),
      kaldir: () => onFiltreDegistir({ arizali: null }),
    });
  }

  if (filtreler.acikIsEmri === true) {
    cipler.push({
      anahtar: "acikIsEmri",
      etiket: t("ekipmanListesi.acikIsEmriVar"),
      kaldir: () => onFiltreDegistir({ acikIsEmri: null }),
    });
  }

  if (cipler.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {cipler.map((cip) => (
        <span key={cip.anahtar} className="ek-cip">
          {cip.etiket}
          <button type="button" aria-label={t("ekipmanListesi.filtreyiKaldir", { ad: cip.etiket })} onClick={cip.kaldir}>
            <LuX size={12} />
          </button>
        </span>
      ))}
      <button type="button" className="ek-link ml-1" onClick={onTumunuTemizle}>
        {t("ekipmanListesi.tumunuTemizle")}
      </button>
    </div>
  );
}

AktifFiltreler.propTypes = {
  filtreler: PropTypes.shape({
    lokasyonIds: PropTypes.array.isRequired,
    makineTipIds: PropTypes.array.isRequired,
    kategoriIds: PropTypes.array.isRequired,
    markaIds: PropTypes.array.isRequired,
    modelIds: PropTypes.array.isRequired,
    atolyeIds: PropTypes.array.isRequired,
    durumIds: PropTypes.array.isRequired,
    makineIds: PropTypes.array.isRequired,
    bakimDurumu: PropTypes.string,
    arizali: PropTypes.bool,
    acikIsEmri: PropTypes.bool,
  }).isRequired,
  secenekler: PropTypes.object.isRequired,
  onFiltreDegistir: PropTypes.func.isRequired,
  onTumunuTemizle: PropTypes.func.isRequired,
};
