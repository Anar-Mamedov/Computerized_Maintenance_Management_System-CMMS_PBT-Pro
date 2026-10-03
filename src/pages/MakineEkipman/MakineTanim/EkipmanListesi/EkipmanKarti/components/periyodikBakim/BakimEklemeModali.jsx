import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Spin, message } from "antd";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import FullDatePicker from "../../../../../../../utils/components/FullDatePicker";
import NumberInput from "../../../../../../../utils/components/NumberInput";
import KartModali from "../ortak/KartModali";
import ModalDugmeleri from "../ortak/ModalDugmeleri";
import Alan from "../ortak/Alan";
import BilgiKutusu from "../ortak/BilgiKutusu";
import { basariliMi } from "../../../ekipmanService";
import { ekleMakineBakimi, getBakimTanimi, hataMesaji, kaydiAl, yanitHatasi } from "../../ekipmanKartiService";
import { apiTarihi, bosIse, sayiYaDaNull } from "../../yardimcilar";

const VARSAYILAN_DEGERLER = { sonUygulamaTarihi: null, hatirlatmaGun: null, sonUygulamaSayac: null, hatirlatmaSayac: null };

/**
 * Bakim tanimindaki izleme sekli. tipId eski ekleme ekraniyla ayni: tarih + sayac 0, yalniz sayac 1, yalniz tarih 2.
 * Tanim alinamazsa ya da iki isaret de yoksa (eski ekrandaki varsayilan tipId 0) iki alan grubu da gosterilir.
 */
const izlemeSekli = (tanim) => {
  const tarih = Boolean(tanim?.PBK_TARIH_BAZLI_IZLE);
  const sayac = Boolean(tanim?.PBK_SAYAC_BAZLI_IZLE);
  if (tarih === sayac) return { tarih: true, sayac: true, tipId: 0 };
  return { tarih, sayac, tipId: sayac ? 1 : 2 };
};

/** Yeni Kayit 2. adim: secilen bakimi makineye ekler (PBakimMakineAdd). Sira bilgisi baslikta gosterilir. */
export default function BakimEklemeModali({ makineId, bakim, sira, toplam, onKapat, onKaydedildi }) {
  const { t } = useTranslation();
  const [izleme, setIzleme] = useState(null);
  const [kaydediliyor, setKaydediliyor] = useState(false);
  const methods = useForm({ defaultValues: VARSAYILAN_DEGERLER });

  useEffect(() => {
    let iptal = false;
    const yukle = async () => {
      try {
        const tanim = kaydiAl(await getBakimTanimi(bakim.TB_PERIYODIK_BAKIM_ID));
        if (!iptal) setIzleme(izlemeSekli(tanim));
      } catch (hata) {
        if (iptal) return;
        console.error("Bakim tanimi alinamadi:", hata);
        message.error(hataMesaji(hata, t("ekipmanKarti.bakim.detayAlinamadi")));
        setIzleme(izlemeSekli(null));
      }
    };
    yukle();
    return () => {
      iptal = true;
    };
  }, [bakim, t]);

  const kaydet = async (degerler) => {
    setKaydediliyor(true);
    try {
      const govde = {
        PBM_PERIYODIK_BAKIM_ID: bakim.TB_PERIYODIK_BAKIM_ID,
        PBM_MAKINE_ID: makineId,
        // -1: makinenin varsayilan sayaci (eski ekranla ayni)
        PBM_SAYAC_ID: -1,
        PBM_SON_UYGULAMA_TARIH: apiTarihi(degerler.sonUygulamaTarihi),
        PBM_SON_UYGULAMA_SAYAC: sayiYaDaNull(degerler.sonUygulamaSayac),
        PBM_HATIRLAT_TARIH: sayiYaDaNull(degerler.hatirlatmaGun),
        PBM_HATIRLAT_SAYAC: sayiYaDaNull(degerler.hatirlatmaSayac),
      };
      const yanit = await ekleMakineBakimi(govde, izleme.tipId);
      if (!basariliMi(yanit)) {
        message.error(yanitHatasi(yanit, t));
        return;
      }
      message.success(t("ekipmanKarti.kaydedildi"));
      onKaydedildi();
    } catch (hata) {
      console.error("Bakim eklenemedi:", hata);
      message.error(hataMesaji(hata, t("ekipmanKarti.islemBasarisiz")));
    } finally {
      setKaydediliyor(false);
    }
  };

  return (
    <KartModali
      acik
      baslik={t("ekipmanKarti.bakim.ekleSiraBaslik", { sira, toplam })}
      onKapat={onKapat}
      kapatilabilir={!kaydediliyor}
      altBilgi={<ModalDugmeleri onKapat={onKapat} onKaydet={methods.handleSubmit(kaydet)} kaydediliyor={kaydediliyor} kaydetDevreDisi={!izleme} />}
    >
      <Spin spinning={!izleme}>
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            <BilgiKutusu etiket={t("ekipmanKarti.bakim.bakimKodu")}>{bosIse(bakim.PBK_KOD)}</BilgiKutusu>
            <BilgiKutusu etiket={t("ekipmanKarti.bakim.periyot")}>{bosIse(bakim.PERIYOT_ACIKLAMA)}</BilgiKutusu>
            <BilgiKutusu etiket={t("ekipmanKarti.bakim.bakimTanimi")} className="sm:col-span-2">
              {bosIse(bakim.PBK_TANIM)}
            </BilgiKutusu>
          </div>
          {izleme && (
            <FormProvider {...methods}>
              <div className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
                {izleme.tarih && (
                  <>
                    <Alan etiket={t("ekipmanKarti.bakim.sonUygulamaTarihi")}>
                      <FullDatePicker name1="sonUygulamaTarihi" />
                    </Alan>
                    <Alan etiket={t("ekipmanKarti.bakim.hatirlatmaGun")}>
                      <NumberInput name1="hatirlatmaGun" minNumber={0} />
                    </Alan>
                  </>
                )}
                {izleme.sayac && (
                  <>
                    <Alan etiket={t("ekipmanKarti.bakim.sonUygulamaSayaci")}>
                      <NumberInput name1="sonUygulamaSayac" minNumber={0} />
                    </Alan>
                    <Alan etiket={t("ekipmanKarti.bakim.hatirlatmaSayacOnce")}>
                      <NumberInput name1="hatirlatmaSayac" minNumber={0} />
                    </Alan>
                  </>
                )}
              </div>
            </FormProvider>
          )}
        </div>
      </Spin>
    </KartModali>
  );
}

BakimEklemeModali.propTypes = {
  makineId: PropTypes.number.isRequired,
  bakim: PropTypes.object.isRequired,
  sira: PropTypes.number.isRequired,
  toplam: PropTypes.number.isRequired,
  onKapat: PropTypes.func.isRequired,
  onKaydedildi: PropTypes.func.isRequired,
};
