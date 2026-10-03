import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Spin, message } from "antd";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import KartModali from "../ortak/KartModali";
import ModalDugmeleri from "../ortak/ModalDugmeleri";
import OnayModali from "../ortak/OnayModali";
import { basariliMi } from "../../../ekipmanService";
import { hataMesaji, kaydiAl, yanitHatasi } from "../../ekipmanKartiService";

/**
 * Sigorta / kaza / ceza modallarinin ortak kabugu: kendi formu (FormProvider), duzenlemede kaydin yuklenmesi,
 * kaydet (ekle / guncelle) ve sil. Form alanlari cocuk olarak verilir ve bu formu kullanir.
 * Modal her acilista yeniden olusturulur (ust bilesen yalnizca acikken cizer); `kayitId` 0 ise yeni kayittir.
 * servis: { getir(id), ekle(govde), guncelle(govde), sil(id) }; bilesen disinda tanimli sabit nesne olmali.
 */
export default function AracKayitModali({ kayitId, baslik, altBaslik, genislik, bosDegerler, servis, formDegerleri, govde, onKapat, onKaydedildi, children }) {
  const { t } = useTranslation();
  const methods = useForm({ defaultValues: bosDegerler });
  const { reset, handleSubmit } = methods;
  const duzenleme = Boolean(kayitId);
  const [yukleniyor, setYukleniyor] = useState(duzenleme);
  // Duzenlemede kayit yuklenemediyse kaydet / sil kapali kalir (bos formla kaydin ustune yazilmasin).
  const [hazir, setHazir] = useState(!duzenleme);
  const [kaydediliyor, setKaydediliyor] = useState(false);
  const [siliniyor, setSiliniyor] = useState(false);
  const [silOnayAcik, setSilOnayAcik] = useState(false);

  useEffect(() => {
    if (!kayitId) return undefined;

    let iptal = false;
    const yukle = async () => {
      setYukleniyor(true);
      try {
        const yanit = await servis.getir(kayitId);
        if (iptal) return;
        const kayit = basariliMi(yanit) ? kaydiAl(yanit) : null;
        if (!kayit) {
          message.error(yanit?.message || t("ekipmanKarti.arac.kayitAlinamadi"));
          return;
        }
        reset(formDegerleri(kayit));
        setHazir(true);
      } catch (hata) {
        if (iptal) return;
        console.error("Arac kaydi alinamadi:", hata);
        message.error(hataMesaji(hata, t("ekipmanKarti.arac.kayitAlinamadi")));
      } finally {
        if (!iptal) setYukleniyor(false);
      }
    };

    yukle();
    return () => {
      iptal = true;
    };
  }, [kayitId, servis, formDegerleri, reset, t]);

  const kaydet = handleSubmit(async (veri) => {
    setKaydediliyor(true);
    try {
      const istekGovdesi = govde(veri);
      const yanit = await (duzenleme ? servis.guncelle(istekGovdesi) : servis.ekle(istekGovdesi));
      if (!basariliMi(yanit)) {
        message.error(yanitHatasi(yanit, t));
        return;
      }
      message.success(t("ekipmanKarti.kaydedildi"));
      onKaydedildi();
    } catch (hata) {
      console.error("Arac kaydi kaydedilemedi:", hata);
      message.error(hataMesaji(hata, t("ekipmanKarti.islemBasarisiz")));
    } finally {
      setKaydediliyor(false);
    }
  });

  const sil = async () => {
    setSiliniyor(true);
    try {
      const yanit = await servis.sil(kayitId);
      if (!basariliMi(yanit)) {
        message.error(yanitHatasi(yanit, t));
        return;
      }
      message.success(t("ekipmanKarti.silindi"));
      onKaydedildi();
    } catch (hata) {
      console.error("Arac kaydi silinemedi:", hata);
      message.error(hataMesaji(hata, t("ekipmanKarti.islemBasarisiz")));
    } finally {
      setSiliniyor(false);
    }
  };

  const mesgul = kaydediliyor || siliniyor;

  return (
    <>
      <KartModali
        acik
        baslik={baslik}
        altBaslik={altBaslik}
        genislik={genislik}
        onKapat={onKapat}
        kapatilabilir={!mesgul}
        altBilgi={
          <>
            {duzenleme && (
              <button type="button" className="ek-kart-btn ek-kart-btn--hata-metni mr-auto" onClick={() => setSilOnayAcik(true)} disabled={!hazir || mesgul}>
                {t("ekipmanKarti.sil")}
              </button>
            )}
            <ModalDugmeleri onKapat={onKapat} onKaydet={kaydet} kaydediliyor={kaydediliyor} kaydetDevreDisi={!hazir || siliniyor} />
          </>
        }
      >
        <Spin spinning={yukleniyor}>
          <FormProvider {...methods}>{children}</FormProvider>
        </Spin>
      </KartModali>

      <OnayModali
        acik={silOnayAcik}
        baslik={t("ekipmanKarti.silOnayBaslik")}
        mesaj={t("ekipmanKarti.silOnayMesaj")}
        onayMetni={t("ekipmanKarti.sil")}
        tehlikeli
        yukleniyor={siliniyor}
        onOnay={sil}
        onKapat={() => setSilOnayAcik(false)}
      />
    </>
  );
}

AracKayitModali.propTypes = {
  /** 0: yeni kayit, digerleri: duzenlenen kaydin backend ID'si */
  kayitId: PropTypes.number.isRequired,
  baslik: PropTypes.node.isRequired,
  altBaslik: PropTypes.node,
  genislik: PropTypes.number,
  bosDegerler: PropTypes.object.isRequired,
  servis: PropTypes.shape({
    getir: PropTypes.func.isRequired,
    ekle: PropTypes.func.isRequired,
    guncelle: PropTypes.func.isRequired,
    sil: PropTypes.func.isRequired,
  }).isRequired,
  /** API kaydi -> form degerleri */
  formDegerleri: PropTypes.func.isRequired,
  /** form degerleri -> kaydet govdesi */
  govde: PropTypes.func.isRequired,
  onKapat: PropTypes.func.isRequired,
  /** kayit eklendi / guncellendi / silindi */
  onKaydedildi: PropTypes.func.isRequired,
  children: PropTypes.node,
};
