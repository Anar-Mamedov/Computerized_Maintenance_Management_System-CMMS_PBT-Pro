import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import LocalizedDateText from "../../../../../../../utils/components/LocalizedDateText";
import KartModali from "../ortak/KartModali";
import ModalDugmeleri from "../ortak/ModalDugmeleri";
import Rozet from "../ortak/Rozet";
import BilgiKutusu from "../ortak/BilgiKutusu";
import { bosIse, sayiMetni } from "../../yardimcilar";
import { doluMu, kalanMetinleri } from "./bakimYardimcilari";

/** Satira tiklaninca acilan ozet (API cagirmaz, liste satirini gosterir). "Duzenle" duzenleme modalina gecer. */
export default function BakimDetayModali({ kayit, onKapat, onDuzenle }) {
  const { t, i18n } = useTranslation();
  const { ana, diger } = kalanMetinleri(kayit, t, i18n.language);
  const hatirlatma = doluMu(kayit.PBM_HATIRLAT_TARIH) ? t("ekipmanKarti.bakim.gunOnce", { gun: sayiMetni(kayit.PBM_HATIRLAT_TARIH, i18n.language) }) : null;

  return (
    <KartModali
      acik
      baslik={t("ekipmanKarti.bakim.detayBaslik")}
      altBaslik={t("ekipmanKarti.bakim.detayAltBaslik")}
      onKapat={onKapat}
      altBilgi={<ModalDugmeleri onKapat={onKapat} onKaydet={onDuzenle} kaydetMetni={t("ekipmanKarti.bakim.duzenle")} />}
    >
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm font-semibold">{bosIse(kayit.PBK_TANIM)}</p>
          {kayit.PERIYOT_ACIKLAMA && <Rozet ton="notr">{kayit.PERIYOT_ACIKLAMA}</Rozet>}
          {kayit.IS_EMRI_NO && <Rozet ton="uyari">{t("ekipmanKarti.bakim.acikIsEmri")}</Rozet>}
        </div>
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          <BilgiKutusu etiket={t("ekipmanKarti.bakim.sonUygulama")}>
            <LocalizedDateText value={kayit.SON_UYGULAMA_TARIH} fallback="—" />
          </BilgiKutusu>
          <BilgiKutusu etiket={t("ekipmanKarti.bakim.sonraki")}>
            <LocalizedDateText value={kayit.HEDEF_TARIH} fallback="—" />
          </BilgiKutusu>
          <BilgiKutusu etiket={t("ekipmanKarti.bakim.periyot")}>{bosIse(kayit.PERIYOT_ACIKLAMA)}</BilgiKutusu>
          <BilgiKutusu etiket={t("ekipmanKarti.bakim.bakimKodu")}>{bosIse(kayit.PBK_KOD)}</BilgiKutusu>
          <BilgiKutusu etiket={t("ekipmanKarti.bakim.kalan")}>{bosIse([ana, diger].filter(Boolean).join(" "))}</BilgiKutusu>
          <BilgiKutusu etiket={t("ekipmanKarti.bakim.hatirlatma")}>{bosIse(hatirlatma)}</BilgiKutusu>
          <BilgiKutusu etiket={t("ekipmanKarti.bakim.isEmri")}>{bosIse(kayit.IS_EMRI_NO)}</BilgiKutusu>
        </div>
      </div>
    </KartModali>
  );
}

BakimDetayModali.propTypes = {
  kayit: PropTypes.object.isRequired,
  onKapat: PropTypes.func.isRequired,
  onDuzenle: PropTypes.func.isRequired,
};
