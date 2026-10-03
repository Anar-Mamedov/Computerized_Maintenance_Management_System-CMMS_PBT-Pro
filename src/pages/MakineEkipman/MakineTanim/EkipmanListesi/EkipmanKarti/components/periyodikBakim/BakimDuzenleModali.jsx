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
import { getMakineBakimDetayi, guncelleMakineBakimi, hataMesaji, kaydiAl, yanitHatasi } from "../../ekipmanKartiService";
import { apiTarihi, bosIse, formTarihi, sayiYaDaNull } from "../../yardimcilar";
import { doluMu, kodVeTanim, sonSayac } from "./bakimYardimcilari";

// Detayda olmayan deger icin liste satirindaki karsiligi kullanilir.
const formDegerleri = (kayit, detay) => ({
  sonUygulamaTarihi: formTarihi(detay?.PBM_SON_UYGULAMA_TARIH ?? kayit.SON_UYGULAMA_TARIH),
  hedefTarih: formTarihi(detay?.PBM_HEDEF_TARIH ?? kayit.HEDEF_TARIH),
  hatirlatmaGun: detay?.PBM_HATIRLAT_TARIH ?? kayit.PBM_HATIRLAT_TARIH ?? null,
  sonUygulamaSayac: detay?.PBM_SON_UYGULAMA_SAYAC ?? sonSayac(kayit) ?? null,
  hedefSayac: detay?.PBM_HEDEF_SAYAC ?? null,
  hatirlatmaSayac: detay?.PBM_HATIRLAT_SAYAC ?? kayit.PBM_HATIRLAT_SAYAC ?? null,
});

/** "Bakimi Incele / Degistir": makine-bakim eslesmesinin tarih, sayac ve hatirlatma degerlerini gunceller. */
export default function BakimDuzenleModali({ makineId, kayit, onKapat, onTamamlandi }) {
  const { t } = useTranslation();
  const [detay, setDetay] = useState(null);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [kaydediliyor, setKaydediliyor] = useState(false);
  const methods = useForm({ defaultValues: formDegerleri(kayit, null) });
  const { reset, handleSubmit } = methods;

  useEffect(() => {
    let iptal = false;
    const yukle = async () => {
      try {
        const bulunan = kaydiAl(await getMakineBakimDetayi(kayit.TB_PERIYODIK_BAKIM_MAKINE_ID));
        if (iptal) return;
        setDetay(bulunan);
        reset(formDegerleri(kayit, bulunan));
      } catch (hata) {
        if (iptal) return;
        console.error("Bakim detayi alinamadi:", hata);
        message.error(hataMesaji(hata, t("ekipmanKarti.bakim.detayAlinamadi")));
      } finally {
        if (!iptal) setYukleniyor(false);
      }
    };
    yukle();
    return () => {
      iptal = true;
    };
  }, [kayit, reset, t]);

  const kaydet = async (degerler) => {
    setKaydediliyor(true);
    try {
      const yanit = await guncelleMakineBakimi({
        TB_PERIYODIK_BAKIM_MAKINE_ID: kayit.TB_PERIYODIK_BAKIM_MAKINE_ID,
        PBM_MAKINE_ID: makineId,
        PBM_PERIYODIK_BAKIM_ID: kayit.TB_PERIYODIK_BAKIM_ID,
        PBM_HATIRLAT_TARIH: sayiYaDaNull(degerler.hatirlatmaGun),
        PBM_SON_UYGULAMA_TARIH: apiTarihi(degerler.sonUygulamaTarihi),
        PBM_HEDEF_TARIH: apiTarihi(degerler.hedefTarih),
        PBM_SON_UYGULAMA_SAYAC: sayiYaDaNull(degerler.sonUygulamaSayac),
        PBM_HEDEF_SAYAC: sayiYaDaNull(degerler.hedefSayac),
        PBM_HATIRLAT_SAYAC: sayiYaDaNull(degerler.hatirlatmaSayac),
      });
      if (!basariliMi(yanit)) {
        message.error(yanitHatasi(yanit, t));
        return;
      }
      message.success(t("ekipmanKarti.kaydedildi"));
      onTamamlandi();
    } catch (hata) {
      console.error("Bakim guncellenemedi:", hata);
      message.error(hataMesaji(hata, t("ekipmanKarti.islemBasarisiz")));
    } finally {
      setKaydediliyor(false);
    }
  };

  const sayacVar = doluMu(detay?.PBM_HEDEF_SAYAC) || doluMu(kayit.KALAN_SAYAC);

  return (
    <KartModali
      acik
      baslik={t("ekipmanKarti.bakim.duzenleBaslik")}
      onKapat={onKapat}
      kapatilabilir={!kaydediliyor}
      altBilgi={<ModalDugmeleri onKapat={onKapat} onKaydet={handleSubmit(kaydet)} kaydediliyor={kaydediliyor} kaydetDevreDisi={yukleniyor} />}
    >
      <Spin spinning={yukleniyor}>
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            <BilgiKutusu etiket={t("ekipmanKarti.bakim.ekipman")}>{bosIse(kodVeTanim(detay?.MKN_KOD, detay?.MKN_TANIM))}</BilgiKutusu>
            <BilgiKutusu etiket={t("ekipmanKarti.bakim.lokasyon")}>{bosIse(detay?.MKN_LOKASYON ?? detay?.PBM_LOKASYON)}</BilgiKutusu>
            <BilgiKutusu etiket={t("ekipmanKarti.bakim.bakim")} className="sm:col-span-2">
              {bosIse(kodVeTanim(detay?.PBK_KOD ?? kayit.PBK_KOD, detay?.PBK_TANIM ?? kayit.PBK_TANIM))}
            </BilgiKutusu>
          </div>
          <FormProvider {...methods}>
            <div className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
              <Alan etiket={t("ekipmanKarti.bakim.sonUygulamaTarihi")}>
                <FullDatePicker name1="sonUygulamaTarihi" />
              </Alan>
              <Alan etiket={t("ekipmanKarti.bakim.hedefTarih")}>
                <FullDatePicker name1="hedefTarih" />
              </Alan>
              <Alan etiket={t("ekipmanKarti.bakim.hatirlatmaGun")}>
                <NumberInput name1="hatirlatmaGun" minNumber={0} />
              </Alan>
              {sayacVar && (
                <>
                  <Alan etiket={t("ekipmanKarti.bakim.sonUygulamaSayaci")}>
                    <NumberInput name1="sonUygulamaSayac" minNumber={0} />
                  </Alan>
                  <Alan etiket={t("ekipmanKarti.bakim.hedefSayac")}>
                    <NumberInput name1="hedefSayac" minNumber={0} />
                  </Alan>
                  <Alan etiket={t("ekipmanKarti.bakim.hatirlatmaSayac")}>
                    <NumberInput name1="hatirlatmaSayac" minNumber={0} />
                  </Alan>
                </>
              )}
            </div>
          </FormProvider>
        </div>
      </Spin>
    </KartModali>
  );
}

BakimDuzenleModali.propTypes = {
  makineId: PropTypes.number.isRequired,
  kayit: PropTypes.object.isRequired,
  onKapat: PropTypes.func.isRequired,
  onTamamlandi: PropTypes.func.isRequired,
};
