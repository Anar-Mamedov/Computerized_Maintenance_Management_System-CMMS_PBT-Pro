import React, { useState } from "react";
import PropTypes from "prop-types";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import SureFiltresi from "../../../../../utils/components/SureFiltresi";
import EkipmanFilterSelectbox from "../../../../../utils/components/EkipmanFilterSelectbox";
import KodFilterSelectbox from "../../../../../utils/components/KodFilterSelectbox";
import LokasyonTablo from "../../../../../utils/components/LokasyonTablo";

// KodList gruplari: makine (ekipman) tipi ve durus nedeni (durus ekleme formundaki nedenle ayni).
const EKIPMAN_TIPI_KOD_GRUBU = 32501;
const DURUS_NEDENI_KOD_GRUBU = 32300;

/**
 * Tum sekmelerde ortak filtreler (DOWNTIME_TRACKING_FRONTEND_GUIDE.md): Sure, Ekipman, Ekipman Tipi, Lokasyon,
 * Durus Nedenleri. Sure secilen araligi formun `startDate` / `endDate` alanlarina yazar: mevcut "Filtreler" cekmecesi
 * tarihleri buradan okuyup listeye ve KPI'lara gonderir, pivot / grafik istekleri de ayni alanlari kullanir.
 */
export default function OrtakFiltreler({ filtreler, onChange }) {
  const { t } = useTranslation();
  const { setValue } = useFormContext();
  const [sure, setSure] = useState({ period: "all", startDate: null, endDate: null });

  const sureDegisti = (yeniSure, aralik) => {
    setSure(yeniSure);
    setValue("startDate", aralik?.baslangic ?? null);
    setValue("endDate", aralik?.bitis ?? null);
  };

  return (
    <>
      <div style={{ width: 190 }}>
        {/* Bu ekranda "Süre" basligi yazilmaz; secim kutusu yalnizca secili degeri gosterir. */}
        <SureFiltresi value={sure} onChange={sureDegisti} baslikGoster={false} />
      </div>
      <div style={{ width: 190 }}>
        <EkipmanFilterSelectbox value={filtreler.makineIds} onChange={(makineIds) => onChange({ makineIds })} />
      </div>
      <div style={{ width: 160 }}>
        <KodFilterSelectbox
          kodGrubu={EKIPMAN_TIPI_KOD_GRUBU}
          placeholder={t("durusTakibi.filtre.ekipmanTipi")}
          value={filtreler.ekipmanTipIds}
          onChange={(ekipmanTipIds) => onChange({ ekipmanTipIds })}
        />
      </div>
      <div style={{ width: 160 }}>
        <LokasyonTablo
          multiple
          lokasyonFieldName="durusLokasyonTanim"
          lokasyonIdFieldName="durusLokasyonIds"
          workshopSelectedId={filtreler.lokasyonIds}
          placeholder={t("lokasyon")}
          onSubmit={(secilenler) => onChange({ lokasyonIds: secilenler.map((lokasyon) => lokasyon.key) })}
          onClear={() => onChange({ lokasyonIds: [] })}
        />
      </div>
      <div style={{ width: 170 }}>
        <KodFilterSelectbox kodGrubu={DURUS_NEDENI_KOD_GRUBU} placeholder={t("durusTakibi.filtre.durusNedenleri")} value={filtreler.nedenIds} onChange={(nedenIds) => onChange({ nedenIds })} />
      </div>
    </>
  );
}

OrtakFiltreler.propTypes = {
  filtreler: PropTypes.shape({
    makineIds: PropTypes.array.isRequired,
    ekipmanTipIds: PropTypes.array.isRequired,
    lokasyonIds: PropTypes.array.isRequired,
    nedenIds: PropTypes.array.isRequired,
  }).isRequired,
  onChange: PropTypes.func.isRequired,
};
