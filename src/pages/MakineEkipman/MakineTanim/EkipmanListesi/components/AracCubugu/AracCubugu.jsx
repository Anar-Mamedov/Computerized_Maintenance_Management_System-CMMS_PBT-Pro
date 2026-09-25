import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { LuSlidersHorizontal } from "react-icons/lu";
import AramaKutusu from "./AramaKutusu";
import GorunumSecici from "./GorunumSecici";
import SayfaMenusu from "./SayfaMenusu";
import IslemlerMenusu from "../islemler/IslemlerMenusu";
import CreateDrawer from "../../../CreateDrawer";
import LokasyonTablo from "../../../../../../utils/components/LokasyonTablo";
import KodFilterSelectbox from "../../../../../../utils/components/KodFilterSelectbox";
import AktifPasifHepsiSelect from "../../../../../../utils/components/AktifPasifHepsiSelect";
import { KOD_GRUPLARI } from "../../constants";

/** Filtre cekmecesinde dolu alan sayisi; eski cekmecedeki gibi her filtre satiri bir sayilir. */
const gelismisFiltreSayisi = (filtreler) =>
  [filtreler.markaIds, filtreler.modelIds, filtreler.atolyeIds, filtreler.durumIds, filtreler.makineIds].filter((liste) => liste.length > 0).length +
  (filtreler.bakimDurumu ? 1 : 0) +
  (typeof filtreler.arizali === "boolean" ? 1 : 0);

export default function AracCubugu({
  filtreler,
  isAktif,
  arama,
  seciliSatirlar,
  gorunum,
  onGorunumDegistir,
  excelHazirlaniyor,
  onFiltreDegistir,
  onKayitDurumuDegistir,
  onAramaDegistir,
  onGelismisFiltreler,
  onIslem,
  onExcel,
  onKolonAyarlari,
  onEkipmanEklendi,
}) {
  const { t } = useTranslation();
  const gelismisSayisi = gelismisFiltreSayisi(filtreler);
  // Global LokasyonTablo secilen lokasyonlarin adini form alanina yazar.
  const lokasyonFormu = useForm({ defaultValues: { lokasyonTanim: "" } });
  const { setValue } = lokasyonFormu;
  const lokasyonSecili = filtreler.lokasyonIds.length > 0;

  // Secim disaridan (cip, "Tumunu temizle") kaldirilinca LokasyonTablo girisini kendisi bosaltmaz.
  useEffect(() => {
    if (!lokasyonSecili) setValue("lokasyonTanim", "");
  }, [lokasyonSecili, setValue]);

  return (
    <div className="flex flex-wrap items-center gap-2">
      <SayfaMenusu excelHazirlaniyor={excelHazirlaniyor} onExcel={onExcel} onKolonAyarlari={onKolonAyarlari} />

      <div className="min-w-[160px] flex-1 sm:max-w-xs">
        <AramaKutusu arama={arama} onAramaDegistir={onAramaDegistir} />
      </div>

      {/* Filtreler global bilesenlerdir. Genis ekranda kesilmez (sigmazsa sagdaki grup alt satira gecer); dar ekranda yatay kayar. */}
      <div className="flex max-w-full items-center gap-2 overflow-x-auto pb-0.5 lg:shrink-0 lg:overflow-visible lg:pb-0">
        <FormProvider {...lokasyonFormu}>
          <div className="ek-filtre-kontrolu w-[200px] shrink-0">
            <LokasyonTablo
              multiple
              workshopSelectedId={filtreler.lokasyonIds}
              lokasyonFieldName="lokasyonTanim"
              lokasyonIdFieldName="lokasyonIds"
              placeholder={t("lokasyon")}
              onSubmit={(secilenler) => onFiltreDegistir({ lokasyonIds: secilenler.map((lokasyon) => lokasyon.key) })}
              onClear={() => onFiltreDegistir({ lokasyonIds: [] })}
            />
          </div>
        </FormProvider>
        <div className="ek-filtre-kontrolu w-[180px] shrink-0">
          <KodFilterSelectbox kodGrubu={KOD_GRUPLARI.makineTipi} placeholder={t("makineTipi")} value={filtreler.makineTipIds} onChange={(makineTipIds) => onFiltreDegistir({ makineTipIds })} />
        </div>
        <div className="ek-filtre-kontrolu w-[160px] shrink-0">
          <KodFilterSelectbox kodGrubu={KOD_GRUPLARI.kategori} placeholder={t("kategori")} value={filtreler.kategoriIds} onChange={(kategoriIds) => onFiltreDegistir({ kategoriIds })} />
        </div>
        <AktifPasifHepsiSelect
          className="ek-kayit-durumu shrink-0"
          style={{ width: 120 }}
          aria-label={t("ekipmanListesi.kayitDurumu")}
          value={isAktif}
          onChange={onKayitDurumuDegistir}
        />
        <button type="button" className="ek-btn" aria-label={t("ekipmanListesi.gelismisFiltreler")} onClick={onGelismisFiltreler}>
          <LuSlidersHorizontal size={16} className="text-(--ek-subtle)" />
          {t("filtreler")}
          {gelismisSayisi > 0 && <span className="ek-sayac ek-sayac--aktif">{gelismisSayisi}</span>}
        </button>
      </div>

      <div className="ml-auto flex shrink-0 items-center gap-2">
        <GorunumSecici gorunum={gorunum} onGorunumDegistir={onGorunumDegistir} />
        <IslemlerMenusu seciliSatirlar={seciliSatirlar} onIslem={onIslem} />
        <div className="ek-ekle">
          <CreateDrawer onRefresh={onEkipmanEklendi} />
        </div>
      </div>
    </div>
  );
}

AracCubugu.propTypes = {
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
  }).isRequired,
  isAktif: PropTypes.number.isRequired,
  arama: PropTypes.string.isRequired,
  seciliSatirlar: PropTypes.arrayOf(PropTypes.object).isRequired,
  gorunum: PropTypes.oneOf(["liste", "kartlar"]).isRequired,
  onGorunumDegistir: PropTypes.func.isRequired,
  excelHazirlaniyor: PropTypes.bool.isRequired,
  onFiltreDegistir: PropTypes.func.isRequired,
  onKayitDurumuDegistir: PropTypes.func.isRequired,
  onAramaDegistir: PropTypes.func.isRequired,
  onGelismisFiltreler: PropTypes.func.isRequired,
  onIslem: PropTypes.func.isRequired,
  onExcel: PropTypes.func.isRequired,
  onKolonAyarlari: PropTypes.func.isRequired,
  onEkipmanEklendi: PropTypes.func.isRequired,
};
