import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Radio, Select, message } from "antd";
import { Controller, FormProvider, useForm, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { LuInfo } from "react-icons/lu";
import KartModali from "../ortak/KartModali";
import ModalDugmeleri from "../ortak/ModalDugmeleri";
import Alan from "../ortak/Alan";
import BilgiKutusu from "../ortak/BilgiKutusu";
import Textarea from "../../../../../../../utils/components/Form/Textarea";
import { basariliMi } from "../../../ekipmanService";
import { cikartAltEkipman, getDepolar, hataMesaji, listeyiAl, yanitHatasi } from "../../ekipmanKartiService";
import { metinYaDaNull } from "../../yardimcilar";
import { DUGUM, dugumTipi, ekipmanEtiketi, tumDugumler } from "./altEkipmanYardimcilari";

const STOK = "STOK";
const HURDA = "HURDA";

// GetDepolar'in alan adlari swagger'da tanimli degil; depo tablosundaki adlar (TB_DEPO_ID, DEP_KOD, DEP_TANIM) ve yaygin karsiliklari kabul edilir.
const depoSecenegi = (depo) => {
  const id = Number(depo.TB_DEPO_ID ?? depo.DEPO_ID ?? depo.DepoId ?? depo.Id ?? depo.ID);
  const kod = depo.DEP_KOD ?? depo.DepoKod ?? depo.Kod ?? depo.KOD ?? "";
  const tanim = depo.DEP_TANIM ?? depo.DepoTanim ?? depo.Tanim ?? depo.TANIM ?? "";
  return { value: id, label: [kod, tanim].filter(Boolean).join(" - ") || String(id) };
};

/**
 * Ekipmani Cikart: secili alt ekipman makineden sokulur. Hedef tur "STOK" ise secilen depoya alinir (depolar GetDepolar),
 * "HURDA" ise hurdaya ayrilir. Altindaki alt ekipmanlar da backend tarafinda birlikte sokulur.
 */
export default function CikartModali({ ekipman, onKapat, onTamamlandi }) {
  const { t } = useTranslation();
  const [kaydediliyor, setKaydediliyor] = useState(false);
  const [depolar, setDepolar] = useState([]);
  const [depolarYukleniyor, setDepolarYukleniyor] = useState(false);
  const methods = useForm({ defaultValues: { hedefTur: STOK, hedefDepoId: null, aciklama: "" } });
  const hedefTur = useWatch({ control: methods.control, name: "hedefTur" });
  const stokMu = hedefTur === STOK;
  const etiket = ekipmanEtiketi(ekipman);
  const altEkipmanSayisi = tumDugumler(ekipman.cocuklar).filter((dugum) => dugum.tip === DUGUM.EKIPMAN).length;
  const islemMetni = t(stokMu ? "ekipmanKarti.altEkipman.stogaAl" : "ekipmanKarti.altEkipman.hurdayaAyir");

  useEffect(() => {
    let iptal = false;
    setDepolarYukleniyor(true);
    getDepolar()
      .then((yanit) => {
        if (!iptal)
          setDepolar(
            listeyiAl(yanit)
              .map(depoSecenegi)
              .filter((secenek) => Number.isFinite(secenek.value))
          );
      })
      .catch((hata) => {
        if (iptal) return;
        console.error("Depolar alinamadi:", hata);
        message.error(hataMesaji(hata, t("ekipmanKarti.listeAlinamadi")));
      })
      .finally(() => {
        if (!iptal) setDepolarYukleniyor(false);
      });
    return () => {
      iptal = true;
    };
  }, [t]);

  const kaydet = async (veri) => {
    const stoga = veri.hedefTur === STOK;
    setKaydediliyor(true);
    try {
      const yanit = await cikartAltEkipman({
        TB_EKIPMAN_ID: ekipman.id,
        HEDEF_TUR: veri.hedefTur,
        HEDEF_DEPO_ID: stoga ? veri.hedefDepoId : null,
        ACIKLAMA: metinYaDaNull(veri.aciklama),
      });
      if (!basariliMi(yanit)) {
        message.error(yanitHatasi(yanit, t));
        return;
      }
      message.success(t(stoga ? "ekipmanKarti.altEkipman.stogaAlindi" : "ekipmanKarti.altEkipman.hurdayaAyrildi"));
      onTamamlandi();
    } catch (hata) {
      console.error("Alt ekipman cikartilamadi:", hata);
      message.error(hataMesaji(hata, t("ekipmanKarti.islemBasarisiz")));
    } finally {
      setKaydediliyor(false);
    }
  };

  const gecersiz = () => message.warning(t("ekipmanKarti.altEkipman.hedefDepoSecin"));

  return (
    <FormProvider {...methods}>
      <KartModali
        acik
        baslik={t("ekipmanKarti.altEkipman.ekipmanCikart")}
        onKapat={onKapat}
        kapatilabilir={!kaydediliyor}
        altBilgi={<ModalDugmeleri onKapat={onKapat} onKaydet={methods.handleSubmit(kaydet, gecersiz)} kaydediliyor={kaydediliyor} kaydetMetni={islemMetni} tehlikeli={!stokMu} />}
      >
        <div className="space-y-4">
          <BilgiKutusu etiket={t("ekipmanKarti.altEkipman.seciliEkipman")} title={etiket}>
            {etiket}
          </BilgiKutusu>
          <Alan etiket={t("ekipmanKarti.altEkipman.hedefTur")} zorunlu>
            <Controller
              name="hedefTur"
              control={methods.control}
              render={({ field }) => (
                <Radio.Group
                  value={field.value}
                  onChange={(olay) => field.onChange(olay.target.value)}
                  optionType="button"
                  buttonStyle="solid"
                  options={[
                    { value: STOK, label: t("ekipmanKarti.altEkipman.stogaAl") },
                    { value: HURDA, label: t("ekipmanKarti.altEkipman.hurdayaAyir") },
                  ]}
                />
              )}
            />
          </Alan>
          {stokMu && (
            <Alan etiket={t("ekipmanKarti.altEkipman.hedefDepo")} zorunlu>
              <Controller
                name="hedefDepoId"
                control={methods.control}
                rules={{ validate: (deger, degerler) => degerler.hedefTur !== STOK || Boolean(deger) }}
                render={({ field, fieldState }) => (
                  <Select
                    value={field.value ?? undefined}
                    onChange={field.onChange}
                    options={depolar}
                    loading={depolarYukleniyor}
                    showSearch
                    optionFilterProp="label"
                    placeholder={t("ekipmanKarti.secimYapiniz")}
                    status={fieldState.error ? "error" : ""}
                    className="w-full"
                  />
                )}
              />
            </Alan>
          )}
          <Alan etiket={t("ekipmanKarti.aciklama")}>
            <Textarea name="aciklama" />
          </Alan>
          {altEkipmanSayisi > 0 && (
            <div className="ek-kart-not">
              <LuInfo size={14} />
              <span>{t("ekipmanKarti.altEkipman.altEkipmanlarDaSokulur", { sayi: altEkipmanSayisi })}</span>
            </div>
          )}
          {!stokMu && (
            <div className="ek-kart-not">
              <LuInfo size={14} />
              <span>{t("ekipmanKarti.altEkipman.hurdaNotu")}</span>
            </div>
          )}
        </div>
      </KartModali>
    </FormProvider>
  );
}

CikartModali.propTypes = {
  /** Cikartilacak ekipman dugumu (agaciKur). */
  ekipman: dugumTipi.isRequired,
  onKapat: PropTypes.func.isRequired,
  /** Islem basarili olunca (mesaj gosterildikten sonra) cagrilir. */
  onTamamlandi: PropTypes.func.isRequired,
};
