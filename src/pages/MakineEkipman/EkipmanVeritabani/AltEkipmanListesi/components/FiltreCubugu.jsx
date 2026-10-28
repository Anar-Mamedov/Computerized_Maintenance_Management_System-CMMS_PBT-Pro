import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Button, Input } from "antd";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { LuSearch, LuSlidersHorizontal } from "react-icons/lu";
import KodFilterSelectbox from "../../../../../utils/components/KodFilterSelectbox";
import MarkaFilterSelectbox from "../../../../../utils/components/MarkaFilterSelectbox";
import DepoTablo from "../../../../../utils/components/DepoTablo";
import LokasyonTablo from "../../../../../utils/components/LokasyonTablo";
import EkipmanFilterSelectbox from "../../../../../utils/components/EkipmanFilterSelectbox";
import { formatNumberWithSeparators } from "../../../../../utils/numberLocale";
import { BAGLANTI_SEKMELERI, KOD_GRUPLARI } from "../sabitler";

const BOS_FORM = { depo: "", depoID: [], lokasyonTanim: "", lokasyonIds: [] };
// Secim kaldirilinca global bilesenler ID alanina bos dize yazar; API'ye her zaman dizi gider.
const diziyeCevir = (deger) => (Array.isArray(deger) ? deger : []);
const ayniDizi = (a, b) => a.length === b.length && a.every((deger, index) => deger === b[index]);

/**
 * Arama ve global filtre secicileri (degisince hemen uygulanir), "Filtreler" ile acilan ek alan (bagli oldugu makine)
 * ve baglanti durumuna gore hizli sekmeler. Depo ve lokasyon secicileri forma yazdigi icin degerleri izlenir.
 */
export default function FiltreCubugu({ filtreler, onFiltreDegistir, onSifirla, kpi, baglanti, onBaglantiDegistir }) {
  const { t, i18n } = useTranslation();
  const form = useForm({ defaultValues: BOS_FORM });
  const { reset, watch } = form;
  const [gelismisAcik, setGelismisAcik] = useState(false);
  const [depoID, lokasyonIds] = watch(["depoID", "lokasyonIds"]);

  // DepoTablo temizlenince geri cagirim yapmaz; secim ve temizleme forma yazilan degerden filtrelere tasinir.
  useEffect(() => {
    const yeniDepolar = diziyeCevir(depoID);
    const yeniLokasyonlar = diziyeCevir(lokasyonIds);
    if (!ayniDizi(yeniDepolar, filtreler.depoIds) || !ayniDizi(yeniLokasyonlar, filtreler.lokasyonIds)) {
      onFiltreDegistir({ depoIds: yeniDepolar, lokasyonIds: yeniLokasyonlar });
    }
  }, [depoID, lokasyonIds, filtreler.depoIds, filtreler.lokasyonIds, onFiltreDegistir]);

  const sifirla = () => {
    reset(BOS_FORM);
    onSifirla();
  };

  return (
    <FormProvider {...form}>
      <div className="ae-kart ae-filtre-karti">
        <div className="ae-filtre-cubugu">
          <div className="ae-filtre ae-filtre--arama">
            <Input
              allowClear
              prefix={<LuSearch size={14} className="ae-soluk" />}
              placeholder={t("altEkipmanVeritabani.aramaPlaceholder")}
              value={filtreler.arama}
              onChange={(olay) => onFiltreDegistir({ arama: olay.target.value })}
            />
          </div>
          <div className="ae-filtre">
            <KodFilterSelectbox
              kodGrubu={KOD_GRUPLARI.ekipmanDurumu}
              placeholder={t("altEkipmanVeritabani.kolon.ekipmanDurumu")}
              value={filtreler.durumIds}
              onChange={(durumIds) => onFiltreDegistir({ durumIds })}
            />
          </div>
          <div className="ae-filtre">
            <KodFilterSelectbox kodGrubu={KOD_GRUPLARI.ekipmanTipi} placeholder={t("altEkipmanVeritabani.kolon.ekipmanTipi")} value={filtreler.tipIds} onChange={(tipIds) => onFiltreDegistir({ tipIds })} />
          </div>
          <div className="ae-filtre">
            <MarkaFilterSelectbox value={filtreler.markaIds} onChange={(markaIds) => onFiltreDegistir({ markaIds })} />
          </div>
          <div className="ae-filtre">
            <DepoTablo multiSelect name1="depo" workshopSelectedId={filtreler.depoIds} placeholder={t("altEkipmanVeritabani.depo")} />
          </div>
          <div className="ae-filtre">
            <LokasyonTablo multiple lokasyonFieldName="lokasyonTanim" lokasyonIdFieldName="lokasyonIds" workshopSelectedId={filtreler.lokasyonIds} placeholder={t("lokasyon")} />
          </div>
          <Button type={gelismisAcik ? "primary" : "default"} icon={<LuSlidersHorizontal size={14} />} onClick={() => setGelismisAcik((acik) => !acik)}>
            {t("filtreler")}
          </Button>
        </div>

        {gelismisAcik && (
          <div className="ae-gelismis">
            <div className="ae-gelismis-alan">
              <span className="ae-kucuk ae-kalin">{t("altEkipmanVeritabani.kolon.bagliOlduguEkipman")}</span>
              <EkipmanFilterSelectbox value={filtreler.makineIds} onChange={(makineIds) => onFiltreDegistir({ makineIds })} />
            </div>
            <button type="button" className="ae-link ae-kucuk" onClick={sifirla}>
              {t("altEkipmanVeritabani.filtreleriSifirla")}
            </button>
          </div>
        )}

        <div className="ae-sekmeler" role="tablist">
          {BAGLANTI_SEKMELERI.map(({ deger, labelKey, kpiAlani }) => (
            <button key={deger} type="button" role="tab" aria-selected={baglanti === deger} className={`ae-sekme ${baglanti === deger ? "ae-sekme--aktif" : ""}`} onClick={() => onBaglantiDegistir(deger)}>
              {t(labelKey)}
              {kpi?.[kpiAlani] !== undefined && <span className="ae-sekme-sayi"> ({formatNumberWithSeparators(kpi[kpiAlani], i18n.language)})</span>}
            </button>
          ))}
        </div>
      </div>
    </FormProvider>
  );
}

FiltreCubugu.propTypes = {
  filtreler: PropTypes.shape({
    arama: PropTypes.string.isRequired,
    durumIds: PropTypes.array.isRequired,
    tipIds: PropTypes.array.isRequired,
    markaIds: PropTypes.array.isRequired,
    depoIds: PropTypes.array.isRequired,
    lokasyonIds: PropTypes.array.isRequired,
    makineIds: PropTypes.array.isRequired,
  }).isRequired,
  onFiltreDegistir: PropTypes.func.isRequired,
  onSifirla: PropTypes.func.isRequired,
  kpi: PropTypes.object,
  baglanti: PropTypes.string.isRequired,
  onBaglantiDegistir: PropTypes.func.isRequired,
};
