import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { LuCheck } from "react-icons/lu";

// Isaretlenebilir nitelikler (tasarimdaki sira). "Arac" isaretliyken Arac sekmesi, "Yakit Kullanir" isaretliyken Yakit sekmesi gorunur.
const OZELLIKLER = [
  { alan: "makineAktif", etiketKey: "ekipmanKarti.genel.ozellik.aktif" },
  { alan: "makineKalibrasyon", etiketKey: "ekipmanKarti.genel.ozellik.kalibrasyon" },
  { alan: "kritikMakine", etiketKey: "ekipmanKarti.genel.ozellik.kritik" },
  { alan: "makineGucKaynagi", etiketKey: "ekipmanKarti.genel.ozellik.gucKaynagi" },
  { alan: "makineIsBildirimi", etiketKey: "ekipmanKarti.genel.ozellik.isBildirimi" },
  { alan: "makineOtonomBakim", etiketKey: "ekipmanKarti.genel.ozellik.otonomBakim" },
  { alan: "makineYakitKullanim", etiketKey: "ekipmanKarti.genel.ozellik.yakitKullanir" },
  { alan: "arac", etiketKey: "ekipmanKarti.genel.ozellik.arac" },
];

/** Durum & Ozellikler: tiklayinca isaretlenen kutucuklu dugmeler. */
export default function DurumOzellikler() {
  const { t } = useTranslation();
  const { control } = useFormContext();

  return (
    <div className="grid grid-cols-2 gap-2">
      {OZELLIKLER.map(({ alan, etiketKey }) => (
        <Controller
          key={alan}
          name={alan}
          control={control}
          render={({ field }) => (
            <button
              type="button"
              aria-pressed={Boolean(field.value)}
              className={`ek-kart-ozellik ${field.value ? "ek-kart-ozellik--secili" : ""}`}
              onClick={() => field.onChange(!field.value)}
            >
              <span className="ek-kart-ozellik__kutu">
                <LuCheck size={12} />
              </span>
              <span className="leading-tight">{t(etiketKey)}</span>
            </button>
          )}
        />
      ))}
    </div>
  );
}
