import React, { useState } from "react";
import PropTypes from "prop-types";
import { message } from "antd";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import KartModali from "../ortak/KartModali";
import ModalDugmeleri from "../ortak/ModalDugmeleri";
import Alan from "../ortak/Alan";
import TextInput from "../../../../../../../utils/components/Form/TextInput";
import HedefBilgisi from "./HedefBilgisi";
import { basariliMi } from "../../../ekipmanService";
import { ekleEkipmanGrubu, guncelleEkipmanGrubu, hataMesaji, yanitHatasi } from "../../ekipmanKartiService";
import { metinYaDaNull } from "../../yardimcilar";
import { dugumAdi, dugumKodu, dugumTipi, hedefTipi } from "./altEkipmanYardimcilari";

/**
 * Grup ekleme ve duzenleme. `grup` verilirse duzenlenir; verilmezse yeni grup `hedef`in (secili grup / ekipman ya da makine)
 * altina acilir. Grup kodu bos birakilirsa backend otomatik kod verir.
 */
export default function GrupModali({ makineId, hedef, grup, onKapat, onKaydedildi }) {
  const { t } = useTranslation();
  const duzenleme = Boolean(grup);
  const [kaydediliyor, setKaydediliyor] = useState(false);
  const methods = useForm({
    defaultValues: { grupKodu: grup ? dugumKodu(grup) : "", grupTanimi: grup ? dugumAdi(grup) : "" },
  });

  const kaydet = async (veri) => {
    const alanlar = { GrupKodu: metinYaDaNull(veri.grupKodu), GrupTanimi: veri.grupTanimi.trim() };
    setKaydediliyor(true);
    try {
      const yanit = duzenleme
        ? await guncelleEkipmanGrubu({ TB_EKIPMAN_ID: grup.id, ...alanlar })
        : await ekleEkipmanGrubu({ MakineId: makineId, ...alanlar, UstGrupId: hedef.id });
      if (!basariliMi(yanit)) {
        message.error(yanitHatasi(yanit, t));
        return;
      }
      message.success(t(duzenleme ? "ekipmanKarti.altEkipman.grupGuncellendi" : "ekipmanKarti.altEkipman.grupEklendi"));
      onKaydedildi();
    } catch (hata) {
      console.error("Ekipman grubu kaydedilemedi:", hata);
      message.error(hataMesaji(hata, t("ekipmanKarti.islemBasarisiz")));
    } finally {
      setKaydediliyor(false);
    }
  };

  return (
    <FormProvider {...methods}>
      <KartModali
        acik
        baslik={t(duzenleme ? "ekipmanKarti.altEkipman.grupDuzenle" : "ekipmanKarti.altEkipman.grupEkle")}
        onKapat={onKapat}
        kapatilabilir={!kaydediliyor}
        altBilgi={<ModalDugmeleri onKapat={onKapat} onKaydet={methods.handleSubmit(kaydet)} kaydediliyor={kaydediliyor} />}
      >
        <div className="space-y-4">
          {!duzenleme && <HedefBilgisi hedef={hedef} />}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Alan etiket={t("ekipmanKarti.altEkipman.grupKodu")}>
              <TextInput name="grupKodu" placeholder={t("ekipmanKarti.altEkipman.grupKoduYerTutucu")} />
            </Alan>
            <Alan etiket={t("ekipmanKarti.altEkipman.grupTanimi")} zorunlu>
              <TextInput name="grupTanimi" required />
            </Alan>
          </div>
        </div>
      </KartModali>
    </FormProvider>
  );
}

GrupModali.propTypes = {
  makineId: PropTypes.number.isRequired,
  /** Yeni grubun baglanacagi yer; duzenlemede kullanilmaz. */
  hedef: hedefTipi,
  /** Duzenlenecek grup dugumu; yoksa yeni grup eklenir. */
  grup: dugumTipi,
  onKapat: PropTypes.func.isRequired,
  /** Kayit basarili olunca (mesaj gosterildikten sonra) cagrilir. */
  onKaydedildi: PropTypes.func.isRequired,
};
