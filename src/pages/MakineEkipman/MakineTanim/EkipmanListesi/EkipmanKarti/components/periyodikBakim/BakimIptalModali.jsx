import React, { useState } from "react";
import PropTypes from "prop-types";
import { message } from "antd";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { LuInfo } from "react-icons/lu";
import KodIDSelectbox from "../../../../../../../utils/components/KodIDSelectbox";
import Textarea from "../../../../../../../utils/components/Form/Textarea";
import KartModali from "../ortak/KartModali";
import ModalDugmeleri from "../ortak/ModalDugmeleri";
import Alan from "../ortak/Alan";
import SeciliBakimOzeti from "./SeciliBakimOzeti";
import { basariliMi } from "../../../ekipmanService";
import { hataMesaji, iptalEtMakineBakimi, yanitHatasi } from "../../ekipmanKartiService";
import { metinYaDaNull } from "../../yardimcilar";

const IPTAL_NEDENI_KOD_GRUBU = 32913;

/** Secili bakimlarin mevcut periyodunu iptal eder (sonraki tarih bir sonraki doneme oteler); tek istek, dizi govde. */
export default function BakimIptalModali({ makineId, kayitlar, onKapat, onTamamlandi }) {
  const { t } = useTranslation();
  const [kaydediliyor, setKaydediliyor] = useState(false);
  const methods = useForm({ defaultValues: { iptalNedeni: null, iptalNedeniID: null, aciklama: "" } });

  const iptalEt = async (degerler) => {
    setKaydediliyor(true);
    try {
      // Hedef tarih, iptal edilen periyodu belirtir; API'den geldigi gibi geri gonderilir.
      const govde = kayitlar.map((kayit) => ({
        PBM_MAKINE_ID: makineId,
        PBM_PERIYODIK_BAKIM_ID: kayit.TB_PERIYODIK_BAKIM_ID,
        PBM_HEDEF_TARIH: kayit.HEDEF_TARIH,
        PBI_IPTAL_NEDEN_KOD_ID: Number(degerler.iptalNedeniID),
        PBI_ACIKLAMA: metinYaDaNull(degerler.aciklama),
      }));
      const yanit = await iptalEtMakineBakimi(govde);
      if (!basariliMi(yanit)) {
        message.error(yanitHatasi(yanit, t));
        return;
      }
      message.success(t("ekipmanKarti.islemBasarili"));
      onTamamlandi();
    } catch (hata) {
      console.error("Bakim iptal edilemedi:", hata);
      message.error(hataMesaji(hata, t("ekipmanKarti.islemBasarisiz")));
    } finally {
      setKaydediliyor(false);
    }
  };

  return (
    <KartModali
      acik
      baslik={t("ekipmanKarti.bakim.bakimIptali")}
      onKapat={onKapat}
      kapatilabilir={!kaydediliyor}
      altBilgi={
        <ModalDugmeleri onKapat={onKapat} onKaydet={methods.handleSubmit(iptalEt)} kaydediliyor={kaydediliyor} kaydetMetni={t("ekipmanKarti.bakim.bakimiIptalEt")} tehlikeli />
      }
    >
      <div className="space-y-4">
        <SeciliBakimOzeti kayitlar={kayitlar} />
        <div className="ek-kart-not">
          <LuInfo size={14} />
          <span>{t("ekipmanKarti.bakim.iptalNotu")}</span>
        </div>
        <FormProvider {...methods}>
          <div className="grid grid-cols-1 gap-y-4">
            <Alan etiket={t("ekipmanKarti.bakim.iptalNedeni")} zorunlu>
              <KodIDSelectbox name1="iptalNedeni" kodID={IPTAL_NEDENI_KOD_GRUBU} isRequired placeholder={t("ekipmanKarti.secimYapiniz")} />
            </Alan>
            <Alan etiket={t("ekipmanKarti.aciklama")}>
              <Textarea name="aciklama" />
            </Alan>
          </div>
        </FormProvider>
      </div>
    </KartModali>
  );
}

BakimIptalModali.propTypes = {
  makineId: PropTypes.number.isRequired,
  kayitlar: PropTypes.arrayOf(PropTypes.object).isRequired,
  onKapat: PropTypes.func.isRequired,
  onTamamlandi: PropTypes.func.isRequired,
};
