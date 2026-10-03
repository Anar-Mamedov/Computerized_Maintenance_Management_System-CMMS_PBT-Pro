import React from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import Alan from "../ortak/Alan";
import Bolum from "../ortak/Bolum";
import KalanGunRozeti from "./KalanGunRozeti";
import FullDatePicker from "../../../../../../../utils/components/FullDatePicker";

/**
 * Muayene, egzoz, vergi ve sozlesme tarihleri (ana formdaki ruhsat alanlari). Ilk ucunun altinda backend'in
 * hesapladigi kalan gun rozeti (salt okunur) gosterilir; deger yoksa rozet kutusu gizlenir.
 */
export default function HatirlaticiTarihler() {
  const { t } = useTranslation();
  const { control } = useFormContext();
  const [muayeneKalanGun, egzozKalanGun, vergiKalanGun] = useWatch({ control, name: ["muayeneKalanGun", "egzozKalanGun", "vergiKalanGun"] });

  return (
    <Bolum baslik={t("ekipmanKarti.arac.hatirlaticiTarihler")} altBaslik={t("ekipmanKarti.arac.hatirlaticiTarihlerAciklama")}>
      <div className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2 xl:grid-cols-4">
        <Alan etiket={t("ekipmanKarti.arac.muayeneTarihi")}>
          <FullDatePicker name1="muayeneTarihi" />
          <div className="mt-2 empty:hidden">
            <KalanGunRozeti gun={muayeneKalanGun} />
          </div>
        </Alan>
        <Alan etiket={t("ekipmanKarti.arac.egzozTarihi")}>
          <FullDatePicker name1="egzozTarihi" />
          <div className="mt-2 empty:hidden">
            <KalanGunRozeti gun={egzozKalanGun} />
          </div>
        </Alan>
        <Alan etiket={t("ekipmanKarti.arac.vergiTarihi")}>
          <FullDatePicker name1="vergiTarihi" />
          <div className="mt-2 empty:hidden">
            <KalanGunRozeti gun={vergiKalanGun} />
          </div>
        </Alan>
        <Alan etiket={t("ekipmanKarti.arac.sozlesmeTarihi")}>
          <FullDatePicker name1="sozlesmeTarihi" />
        </Alan>
      </div>
    </Bolum>
  );
}
