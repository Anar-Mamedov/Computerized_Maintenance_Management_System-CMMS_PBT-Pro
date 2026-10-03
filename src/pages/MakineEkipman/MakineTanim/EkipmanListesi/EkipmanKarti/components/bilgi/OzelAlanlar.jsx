import React, { useCallback, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { LuPencil } from "react-icons/lu";
import Bolum from "../ortak/Bolum";
import KartModali from "../ortak/KartModali";
import TextInput from "../../../../../../../utils/components/Form/TextInput";
import KodIDSelectbox from "../../../../../../../utils/components/KodIDSelectbox";
import NumberInput from "../../../../../../../utils/components/NumberInput";
import OzelAlanIsimDuzenle from "../../../../../../../utils/components/OzelAlanIsimDuzenle";
import { getOzelAlanBasliklari } from "../../../ekipmanService";

const OZEL_FORM = "MAKINE";
// 1-10 metin, 11-15 kod listesi (32530-32534), 16-20 sayi alanlari (eski kartla ayni).
const ALANLAR = Array.from({ length: 20 }, (_, index) => {
  const no = index + 1;
  if (no <= 10) return { no, tur: "metin" };
  if (no <= 15) return { no, tur: "kod", kodID: 32530 + no - 11 };
  return { no, tur: "sayi" };
});

/** Ozel alan girdisi; turune gore global form bileseni. */
function OzelAlanGirdisi({ alan }) {
  const ad = `ozelAlan${alan.no}`;
  if (alan.tur === "kod") return <KodIDSelectbox name1={ad} kodID={alan.kodID} isRequired={false} placeholder="" />;
  if (alan.tur === "sayi") return <NumberInput name1={ad} />;
  return <TextInput name={ad} />;
}

OzelAlanGirdisi.propTypes = {
  alan: PropTypes.shape({ no: PropTypes.number.isRequired, tur: PropTypes.string.isRequired, kodID: PropTypes.number }).isRequired,
};

/** Ozel Alanlar sekmesi: 20 ozel alan. Basliklar OzelAlan?form=MAKINE'den gelir, kalem ikonuyla yeniden adlandirilir. */
export default function OzelAlanlar() {
  const { t } = useTranslation();
  const [basliklar, setBasliklar] = useState({});
  const [duzenlenenAlan, setDuzenlenenAlan] = useState(null);

  const basliklariGetir = useCallback(async () => {
    try {
      const yanit = await getOzelAlanBasliklari();
      setBasliklar(yanit && typeof yanit === "object" ? yanit : {});
    } catch (hata) {
      console.error("Ozel alan basliklari alinamadi:", hata);
    }
  }, []);

  useEffect(() => {
    basliklariGetir();
  }, [basliklariGetir]);

  const baslik = (no) => basliklar[`OZL_OZEL_ALAN_${no}`] || t("ekipmanKarti.ozel.alan", { no });

  return (
    <Bolum baslik={t("ekipmanKarti.ozel.baslik")} altBaslik={t("ekipmanKarti.ozel.aciklama")}>
      <div className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2 xl:grid-cols-3">
        {ALANLAR.map((alan) => (
          <div key={alan.no} className="ek-kart-alan min-w-0">
            <div className="ek-kart-etiket flex items-center gap-1">
              <span className="min-w-0 truncate">{baslik(alan.no)}</span>
              <button type="button" className="ek-kart-ikon-btn p-0.5" aria-label={t("ekipmanKarti.ozel.adiDuzenle")} onClick={() => setDuzenlenenAlan(alan.no)}>
                <LuPencil size={12} />
              </button>
            </div>
            <OzelAlanGirdisi alan={alan} />
          </div>
        ))}
      </div>

      <KartModali acik={duzenlenenAlan !== null} baslik={t("ekipmanKarti.ozel.adiDuzenle")} genislik={420} onKapat={() => setDuzenlenenAlan(null)}>
        {duzenlenenAlan !== null && (
          <OzelAlanIsimDuzenle
            labelValue={baslik(duzenlenenAlan)}
            fieldNumber={duzenlenenAlan}
            OzelForm={OZEL_FORM}
            onClose={() => setDuzenlenenAlan(null)}
            onSuccess={() => {
              setDuzenlenenAlan(null);
              basliklariGetir();
            }}
          />
        )}
      </KartModali>
    </Bolum>
  );
}
