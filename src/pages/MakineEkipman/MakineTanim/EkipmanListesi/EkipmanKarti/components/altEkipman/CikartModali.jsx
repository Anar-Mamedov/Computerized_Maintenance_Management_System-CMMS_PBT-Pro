import React, { useState } from "react";
import PropTypes from "prop-types";
import { message } from "antd";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { LuInfo } from "react-icons/lu";
import KartModali from "../ortak/KartModali";
import ModalDugmeleri from "../ortak/ModalDugmeleri";
import Alan from "../ortak/Alan";
import BilgiKutusu from "../ortak/BilgiKutusu";
import DepoTablo from "../../../../../../../utils/components/DepoTablo";
import Textarea from "../../../../../../../utils/components/Form/Textarea";
import { basariliMi } from "../../../ekipmanService";
import { cikartAltEkipman, hataMesaji, yanitHatasi } from "../../ekipmanKartiService";
import { metinYaDaNull } from "../../yardimcilar";
import { ekipmanEtiketi } from "./altEkipmanYardimcilari";

/** Cikart: secili alt ekipman makineden sokulur; "STOK" ise hedef depoya alinir, "HURDA" ise hurdaya ayrilir. */
export default function CikartModali({ secim, islemTipi, onKapat, onTamamlandi }) {
  const { t } = useTranslation();
  const [kaydediliyor, setKaydediliyor] = useState(false);
  const methods = useForm({ defaultValues: { hedefDepo: "", hedefDepoID: "", aciklama: "" } });
  const stokMu = islemTipi === "STOK";
  const baslik = t(stokMu ? "ekipmanKarti.altEkipman.stogaAl" : "ekipmanKarti.altEkipman.hurdayaAyir");
  const etiket = ekipmanEtiketi(secim.kayit);

  const kaydet = async (veri) => {
    setKaydediliyor(true);
    try {
      const yanit = await cikartAltEkipman({
        EkipmanID: secim.kayit.TB_EKIPMAN_ID,
        UstEkipmanID: secim.ustEkipmanId,
        DepoID: stokMu ? Number(veri.hedefDepoID) || 0 : 0,
        IslemTipi: islemTipi,
        Aciklama: metinYaDaNull(veri.aciklama),
      });
      if (!basariliMi(yanit)) {
        message.error(yanitHatasi(yanit, t));
        return;
      }
      message.success(t(stokMu ? "ekipmanKarti.altEkipman.stogaAlindi" : "ekipmanKarti.altEkipman.hurdayaAyrildi"));
      onTamamlandi();
    } catch (hata) {
      console.error("Alt ekipman cikartilamadi:", hata);
      message.error(hataMesaji(hata, t("ekipmanKarti.islemBasarisiz")));
    } finally {
      setKaydediliyor(false);
    }
  };

  // DepoTablo zorunluluk hatasini yalnizca kirmizi cerceveyle gosterir; mesaj burada verilir.
  const gecersiz = () => message.warning(t("ekipmanKarti.altEkipman.hedefDepoSecin"));

  return (
    <FormProvider {...methods}>
      <KartModali
        acik
        baslik={baslik}
        onKapat={onKapat}
        kapatilabilir={!kaydediliyor}
        altBilgi={<ModalDugmeleri onKapat={onKapat} onKaydet={methods.handleSubmit(kaydet, gecersiz)} kaydediliyor={kaydediliyor} kaydetMetni={baslik} tehlikeli={!stokMu} />}
      >
        <div className="space-y-4">
          <BilgiKutusu etiket={t("ekipmanKarti.altEkipman.seciliEkipman")} title={etiket}>
            {etiket}
          </BilgiKutusu>
          {stokMu && (
            <Alan etiket={t("ekipmanKarti.altEkipman.hedefDepo")} zorunlu>
              <DepoTablo name1="hedefDepo" isRequired placeholder={t("ekipmanKarti.secimYapiniz")} />
            </Alan>
          )}
          <Alan etiket={t("ekipmanKarti.aciklama")}>
            <Textarea name="aciklama" />
          </Alan>
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
  /** Agactaki secim: kayit ve ust ekipmanin TB_EKIPMAN_ID'si (kok seviyede 0). */
  secim: PropTypes.shape({
    kayit: PropTypes.object.isRequired,
    ustEkipmanId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  }).isRequired,
  islemTipi: PropTypes.oneOf(["STOK", "HURDA"]).isRequired,
  onKapat: PropTypes.func.isRequired,
  /** Islem basarili olunca (mesaj gosterildikten sonra) cagrilir. */
  onTamamlandi: PropTypes.func.isRequired,
};
