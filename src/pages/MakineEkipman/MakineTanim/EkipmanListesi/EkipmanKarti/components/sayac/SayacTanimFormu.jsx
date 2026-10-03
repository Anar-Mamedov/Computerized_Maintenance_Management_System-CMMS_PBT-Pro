import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import Alan from "../ortak/Alan";
import SecimKutusu from "../ortak/SecimKutusu";
import SayacDetayBilgileri from "./SayacDetayBilgileri";
import { OZEL_ALAN_NUMARALARI } from "./sayacTanimi";
import { SAYAC_BIRIMI_KOD_GRUBU, SAYAC_TIPI_KOD_GRUBU } from "./sayacYardimcilari";
import TextInput from "../../../../../../../utils/components/Form/TextInput";
import Textarea from "../../../../../../../utils/components/Form/Textarea";
import KodIDSelectbox from "../../../../../../../utils/components/KodIDSelectbox";
import NumberInput from "../../../../../../../utils/components/NumberInput";
import DosyaUpload from "../../../../../../../utils/components/Dosya/DosyaUpload";
import ResimUpload from "../../../../../../../utils/components/Resim/ResimUpload";

const ALT_SEKMELER = [
  { key: "detay", etiketKey: "ekipmanKarti.sayac.detayBilgileri" },
  { key: "ozel", etiketKey: "ekipmanKarti.sayac.ozelAlanlar" },
  { key: "belgeler", etiketKey: "ekipmanKarti.sayac.ekliBelgeler" },
  { key: "resimler", etiketKey: "ekipmanKarti.sayac.resimler" },
  { key: "aciklama", etiketKey: "ekipmanKarti.aciklama" },
];

const ACIKLAMA_STILI = { minHeight: 160 };

/**
 * Sayac tanimi formu: ust alanlar ve alt sekmeler. Guncel deger ve varsayilan bilgisi duzenlemede pasiftir
 * (deger "Sayac Guncelleme", varsayilan "Varsayilan Yap" ile degisir). Belge / resim yalnizca kayitli sayaca eklenir.
 */
export default function SayacTanimFormu({ sayacId, kayit, altSekme, onAltSekmeDegistir }) {
  const { t } = useTranslation();
  const duzenleme = Boolean(sayacId);
  const kaydettiktenSonra = (
    <div className="ek-kart-bos">
      <p className="m-0 text-sm ek-kart-soluk">{t("ekipmanKarti.sayac.kaydettiktenSonra")}</p>
    </div>
  );

  const altSekmeIcerigi = () => {
    switch (altSekme) {
      case "ozel":
        return (
          <div className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
            {OZEL_ALAN_NUMARALARI.map((no) => (
              <Alan key={no} etiket={t("ekipmanKarti.sayac.ozelAlan", { no })}>
                <TextInput name={`ozelAlan${no}`} />
              </Alan>
            ))}
          </div>
        );
      case "belgeler":
        return duzenleme ? <DosyaUpload selectedRowID={sayacId} refGroup="SAYAC" /> : kaydettiktenSonra;
      case "resimler":
        return duzenleme ? <ResimUpload selectedRowID={sayacId} refGroup="SAYAC" /> : kaydettiktenSonra;
      case "aciklama":
        return <Textarea name="aciklama" styles={ACIKLAMA_STILI} />;
      default:
        return <SayacDetayBilgileri duzenleme={duzenleme} kayit={kayit} onResimlereGit={() => onAltSekmeDegistir("resimler")} />;
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
        <Alan etiket={t("ekipmanKarti.sayac.sayacTanimi")} zorunlu>
          <TextInput name="sayacTanim" required />
        </Alan>
        <Alan etiket={t("ekipmanKarti.sayac.sayacTipi")}>
          <KodIDSelectbox name1="sayacTipi" kodID={SAYAC_TIPI_KOD_GRUBU} isRequired={false} placeholder={t("ekipmanKarti.secimYapiniz")} />
        </Alan>
        <Alan etiket={t("ekipmanKarti.sayac.sayacBirimi")}>
          <KodIDSelectbox name1="sayacBirimi" kodID={SAYAC_BIRIMI_KOD_GRUBU} isRequired={false} placeholder={t("ekipmanKarti.secimYapiniz")} />
        </Alan>
        <Alan etiket={t("ekipmanKarti.sayac.sayacDegeri")}>
          <NumberInput name1="sayacDegeri" minNumber={0} disabled={duzenleme} />
        </Alan>
        <SecimKutusu name="sayacAktif" etiket={t("ekipmanKarti.sayac.aktif")} />
        <SecimKutusu name="sayacVarsayilan" etiket={t("ekipmanKarti.sayac.varsayilan")} disabled={duzenleme} />
      </div>

      <nav className="ek-kart-sekmeler ek-kart-sekmeler--ic" role="tablist" aria-label={t("ekipmanKarti.sayac.sayacTanimi")}>
        {ALT_SEKMELER.map((sekme) => (
          <button
            key={sekme.key}
            type="button"
            role="tab"
            aria-selected={sekme.key === altSekme}
            className={`ek-kart-sekme ${sekme.key === altSekme ? "ek-kart-sekme--aktif" : ""}`}
            onClick={() => onAltSekmeDegistir(sekme.key)}
          >
            {t(sekme.etiketKey)}
          </button>
        ))}
      </nav>

      <div role="tabpanel">{altSekmeIcerigi()}</div>
    </div>
  );
}

SayacTanimFormu.propTypes = {
  sayacId: PropTypes.number,
  kayit: PropTypes.object,
  altSekme: PropTypes.oneOf(ALT_SEKMELER.map((sekme) => sekme.key)).isRequired,
  onAltSekmeDegistir: PropTypes.func.isRequired,
};
