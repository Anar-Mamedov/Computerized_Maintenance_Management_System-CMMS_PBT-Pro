import React, { useState } from "react";
import PropTypes from "prop-types";
import { message } from "antd";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import KartModali from "../ortak/KartModali";
import ModalDugmeleri from "../ortak/ModalDugmeleri";
import Alan from "../ortak/Alan";
import TextInput from "../../../../../../../utils/components/Form/TextInput";
import Textarea from "../../../../../../../utils/components/Form/Textarea";
import NumberInput from "../../../../../../../utils/components/NumberInput";
import HedefBilgisi from "./HedefBilgisi";
import StokKartiAlani from "./StokKartiAlani";
import { basariliMi } from "../../../ekipmanService";
import { ekleEkipmanMalzemesi, guncelleEkipmanMalzemesi, hataMesaji, yanitHatasi } from "../../ekipmanKartiService";
import { metinYaDaNull, sayiYaDaNull } from "../../yardimcilar";
import { DUGUM, dugumAdi, dugumTipi, hedefTipi } from "./altEkipmanYardimcilari";

/**
 * AddEkipmanMalzeme'nin hedef alanlari (backend rehberi): RefId her zaman gider; ekipman hedefinde EkipmanId, grup hedefinde
 * GrupId de verilir. Makine kokunde RefId makine ID'si, RefGrup "MAKINE"dir.
 */
const hedefAlanlari = (hedef, makineId) => {
  if (hedef.tip === DUGUM.EKIPMAN) return { RefId: hedef.id, EkipmanId: hedef.id, MakineId: makineId };
  if (hedef.tip === DUGUM.GRUP) return { RefId: hedef.id, GrupId: hedef.id, MakineId: makineId };
  return { RefId: makineId, RefGrup: "MAKINE", MakineId: makineId };
};

const varsayilanDegerler = (malzeme) => ({
  stokId: malzeme?.EML_STOK_ID ?? null,
  stokKodu: malzeme?.EML_STOK_KOD ?? "",
  stokTanim: malzeme ? dugumAdi(malzeme) : "",
  miktar: malzeme ? sayiYaDaNull(malzeme.EML_MIKTAR) : 1,
  figurNo: malzeme?.EML_FIGURE_NO ?? "",
  aciklama: malzeme?.EML_ACIKLAMA ?? "",
});

/**
 * Malzeme & yedek parca ekleme ve duzenleme. Malzeme stoksuz (serbest tanim) ya da bir stok kartiyla (StokId) eklenir;
 * stok kartina bagliyken tanim stoktan gelir. `malzeme` verilirse duzenlenir; verilmezse `hedef`in (secili grup / ekipman
 * ya da makine) altina eklenir.
 */
export default function MalzemeModali({ makineId, hedef, malzeme, onKapat, onKaydedildi }) {
  const { t } = useTranslation();
  const duzenleme = Boolean(malzeme);
  const [kaydediliyor, setKaydediliyor] = useState(false);
  const methods = useForm({ defaultValues: varsayilanDegerler(malzeme) });
  const stokBagli = Boolean(useWatch({ control: methods.control, name: "stokId" }));

  const kaydet = async (veri) => {
    const alanlar = {
      StokTanim: veri.stokTanim.trim(),
      Miktar: sayiYaDaNull(veri.miktar),
      FigureNo: metinYaDaNull(veri.figurNo),
      Aciklama: metinYaDaNull(veri.aciklama),
    };
    setKaydediliyor(true);
    try {
      const yanit = duzenleme
        ? await guncelleEkipmanMalzemesi({ TB_EKIPMAN_MALZEME_ID: malzeme.id, ...alanlar })
        : await ekleEkipmanMalzemesi({ ...hedefAlanlari(hedef, makineId), StokId: veri.stokId ?? null, ...alanlar });
      if (!basariliMi(yanit)) {
        message.error(yanitHatasi(yanit, t));
        return;
      }
      message.success(t(duzenleme ? "ekipmanKarti.altEkipman.malzemeGuncellendi" : "ekipmanKarti.altEkipman.malzemeEklendi"));
      onKaydedildi();
    } catch (hata) {
      console.error("Ekipman malzemesi kaydedilemedi:", hata);
      message.error(hataMesaji(hata, t("ekipmanKarti.islemBasarisiz")));
    } finally {
      setKaydediliyor(false);
    }
  };

  return (
    <FormProvider {...methods}>
      <KartModali
        acik
        baslik={t(duzenleme ? "ekipmanKarti.altEkipman.malzemeDuzenle" : "ekipmanKarti.altEkipman.malzemeEkle")}
        onKapat={onKapat}
        kapatilabilir={!kaydediliyor}
        altBilgi={<ModalDugmeleri onKapat={onKapat} onKaydet={methods.handleSubmit(kaydet)} kaydediliyor={kaydediliyor} />}
      >
        <div className="space-y-4">
          {!duzenleme && <HedefBilgisi hedef={hedef} />}
          <Alan etiket={t("ekipmanKarti.altEkipman.stokKarti")}>
            <StokKartiAlani degistirilebilir={!duzenleme} />
          </Alan>
          <Alan etiket={t("ekipmanKarti.altEkipman.malzemeTanimi")} zorunlu>
            <TextInput name="stokTanim" required readonly={stokBagli} />
          </Alan>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Alan etiket={t("ekipmanKarti.altEkipman.miktar")} zorunlu>
              <NumberInput name1="miktar" isRequired minNumber={0} />
            </Alan>
            <Alan etiket={t("ekipmanKarti.altEkipman.figurNo")}>
              <TextInput name="figurNo" />
            </Alan>
          </div>
          <Alan etiket={t("ekipmanKarti.aciklama")}>
            <Textarea name="aciklama" />
          </Alan>
        </div>
      </KartModali>
    </FormProvider>
  );
}

MalzemeModali.propTypes = {
  makineId: PropTypes.number.isRequired,
  /** Yeni malzemenin baglanacagi yer; duzenlemede kullanilmaz. */
  hedef: hedefTipi,
  /** Duzenlenecek malzeme dugumu; yoksa yeni malzeme eklenir. */
  malzeme: dugumTipi,
  onKapat: PropTypes.func.isRequired,
  /** Kayit basarili olunca (mesaj gosterildikten sonra) cagrilir. */
  onKaydedildi: PropTypes.func.isRequired,
};
