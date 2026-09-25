import React, { useState } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import OnayModali from "./OnayModali";
import { siraylaCalistir, sonucuBildir } from "./topluCalistir";
import { toggleEkipmanAktif } from "../../ekipmanService";

const aktifMi = (satir) => satir.MKN_AKTIF !== false;

/**
 * Pasife Al / Aktif Yap. Secilenlerin hepsi pasifse aktif yapilir, aksi halde pasife alinir.
 * ToggleAktif durumu tersine cevirdigi icin yalnizca hedef durumda olmayan kayitlar gonderilir.
 */
export default function AktiflikModali({ satirlar, onKapat, onTamamlandi }) {
  const { t } = useTranslation();
  const [yukleniyor, setYukleniyor] = useState(false);
  const hedefAktif = satirlar.every((satir) => !aktifMi(satir));
  const degisecekler = satirlar.filter((satir) => aktifMi(satir) !== hedefAktif);
  const onek = hedefAktif ? "ekipmanListesi.aktiflik.aktifYap" : "ekipmanListesi.aktiflik.pasifeAl";

  const onayla = async () => {
    setYukleniyor(true);
    const basarili = await siraylaCalistir(degisecekler, (satir) => toggleEkipmanAktif(satir.TB_MAKINE_ID));
    setYukleniyor(false);
    sonucuBildir(basarili, degisecekler.length, t);
    if (basarili > 0) onTamamlandi();
  };

  return (
    <OnayModali
      acik
      baslik={t(`${onek}Baslik`)}
      soru={t(`${onek}Soru`)}
      aciklama={t(`${onek}Aciklama`)}
      onayMetni={t(onek)}
      yukleniyor={yukleniyor}
      onOnay={onayla}
      onVazgec={onKapat}
    />
  );
}

AktiflikModali.propTypes = {
  satirlar: PropTypes.arrayOf(PropTypes.shape({ TB_MAKINE_ID: PropTypes.number, MKN_AKTIF: PropTypes.bool })).isRequired,
  onKapat: PropTypes.func.isRequired,
  onTamamlandi: PropTypes.func.isRequired,
};
