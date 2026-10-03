import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { message } from "antd";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { basariliMi } from "../../../ekipmanService";
import { hataMesaji, kaydetMakineSayac, yanitHatasi } from "../../ekipmanKartiService";
import { apiSaati, apiTarihi, metinYaDaNull } from "../../yardimcilar";

const BOS_FORM = { girisSekli: "okunan", deger: null, tarih: null, saat: null, vardiyaID: null, aciklama: "" };

// Toplama / cikarmadaki kayan nokta artiklarini temizler (orn. 1280.1 - 1250.3).
const temizle = (sayi) => Number(sayi.toFixed(6));

/**
 * Sayac okuma formu ve kaydi (Sayac Guncelleme, Hizli Islemler > Sayac Gir).
 * sayac: { sayacId, guncelDeger, guncellemeSekli }. Form her acilista bugun / simdi ile baslar;
 * giris sekli, guncelleme sekli "artis deger" (2) ise artis, degilse okunan degerdir.
 * Okunan deger mevcut degerden kucukse kaydedilmez (deger dusurmek icin Sayac Sifirlama kullanilir).
 */
export default function useSayacOkumaFormu({ acik, makineId, lokasyonId, sayac, onBasarili }) {
  const { t } = useTranslation();
  const [kaydediliyor, setKaydediliyor] = useState(false);
  const methods = useForm({ defaultValues: BOS_FORM });
  const { reset, handleSubmit } = methods;
  const girisSekli = Number(sayac?.guncellemeSekli) === 2 ? "artis" : "okunan";

  useEffect(() => {
    if (acik) reset({ ...BOS_FORM, girisSekli, tarih: dayjs(), saat: dayjs() });
  }, [acik, girisSekli, reset]);

  const kaydet = handleSubmit(async (veri) => {
    const mevcutDeger = Number(sayac?.guncelDeger) || 0;
    const deger = Number(veri.deger);
    const okunan = veri.girisSekli === "okunan";
    if (okunan && deger < mevcutDeger) {
      message.warning(t("ekipmanKarti.sayac.okunanKucukOlamaz"));
      return;
    }

    setKaydediliyor(true);
    try {
      const yanit = await kaydetMakineSayac({
        MakineId: makineId,
        SayacId: sayac.sayacId,
        LokasyonId: Number(lokasyonId) || 0,
        VardiyaId: Number(veri.vardiyaID) || 0,
        Tarih: apiTarihi(veri.tarih),
        Saat: apiSaati(veri.saat),
        OkunanDeger: okunan ? deger : temizle(mevcutDeger + deger),
        ArtisDeger: okunan ? temizle(deger - mevcutDeger) : deger,
        Aciklama: metinYaDaNull(veri.aciklama) ?? "",
      });
      if (!basariliMi(yanit)) {
        message.error(yanitHatasi(yanit, t));
        return;
      }
      message.success(t("ekipmanKarti.sayac.okumaKaydedildi"));
      onBasarili();
    } catch (hata) {
      console.error("Sayac okumasi kaydedilemedi:", hata);
      message.error(hataMesaji(hata, t("ekipmanKarti.islemBasarisiz")));
    } finally {
      setKaydediliyor(false);
    }
  });

  return { methods, kaydediliyor, kaydet };
}
