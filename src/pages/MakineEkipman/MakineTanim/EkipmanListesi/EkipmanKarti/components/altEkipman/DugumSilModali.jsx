import React, { useState } from "react";
import PropTypes from "prop-types";
import { message } from "antd";
import { useTranslation } from "react-i18next";
import OnayModali from "../ortak/OnayModali";
import { basariliMi } from "../../../ekipmanService";
import { hataMesaji, silEkipmanGrubu, silEkipmanMalzemesi, yanitHatasi } from "../../ekipmanKartiService";
import { DUGUM, dugumEtiketi, dugumTipi } from "./altEkipmanYardimcilari";

// Silinebilen dugumler: grup (altinda kayit yoksa) ve malzeme. Ekipman silinmez, makineden cikartilir.
const AYARLAR = {
  [DUGUM.GRUP]: { sil: silEkipmanGrubu, baslikKey: "grupSil", mesajKey: "grupSilOnay", basariKey: "grupSilindi" },
  [DUGUM.MALZEME]: { sil: silEkipmanMalzemesi, baslikKey: "malzemeSil", mesajKey: "malzemeSilOnay", basariKey: "malzemeSilindi" },
};

/** Grup ya da malzeme silme onayi. Grubun altinda kayit varsa backend'in aciklama mesaji gosterilir. */
export default function DugumSilModali({ dugum, onKapat, onSilindi }) {
  const { t } = useTranslation();
  const [siliniyor, setSiliniyor] = useState(false);
  const ayar = AYARLAR[dugum.tip];
  const anahtar = (son) => `ekipmanKarti.altEkipman.${son}`;

  const onayla = async () => {
    setSiliniyor(true);
    try {
      const yanit = await ayar.sil(dugum.id);
      if (!basariliMi(yanit)) {
        message.error(yanitHatasi(yanit, t));
        return;
      }
      message.success(t(anahtar(ayar.basariKey)));
      onSilindi();
    } catch (hata) {
      console.error("Alt ekipman agaci kaydi silinemedi:", hata);
      message.error(hataMesaji(hata, t("ekipmanKarti.islemBasarisiz")));
    } finally {
      setSiliniyor(false);
    }
  };

  return (
    <OnayModali
      acik
      baslik={t(anahtar(ayar.baslikKey))}
      mesaj={t(anahtar(ayar.mesajKey), { ad: dugumEtiketi(dugum) })}
      onayMetni={t("ekipmanKarti.sil")}
      tehlikeli
      yukleniyor={siliniyor}
      onOnay={onayla}
      onKapat={onKapat}
    />
  );
}

DugumSilModali.propTypes = {
  /** Silinecek grup ya da malzeme dugumu. */
  dugum: dugumTipi.isRequired,
  onKapat: PropTypes.func.isRequired,
  /** Silme basarili olunca (mesaj gosterildikten sonra) cagrilir. */
  onSilindi: PropTypes.func.isRequired,
};
