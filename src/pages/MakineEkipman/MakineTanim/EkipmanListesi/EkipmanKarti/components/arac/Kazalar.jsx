import React, { useState } from "react";
import PropTypes from "prop-types";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import AracListeBolumu from "./AracListeBolumu";
import KazaModali from "./KazaModali";
import { SolukHucre, TarihHucresi } from "./TabloHucreleri";
import Rozet from "../ortak/Rozet";
import useKartListesi from "../../useKartListesi";
import { getAracKazalari, listeyiAl } from "../../ekipmanKartiService";
import { anahtarEkle, bosIse, buyukHarf, metinYaDaNull } from "../../yardimcilar";
import { KAZA_DURUMU, kazaDurumEtiketi } from "./aracFormAlanlari";

const kazalariHazirla = (yanit) => anahtarEkle(listeyiAl(yanit), "TB_ARAC_KAZA_ID");

// Acik kaza uyari, kapali ve digerleri notr rozetle gosterilir.
const durumHucresi = (durum, t) => {
  const metin = metinYaDaNull(durum);
  if (!metin) return <SolukHucre />;
  return <Rozet ton={metin === KAZA_DURUMU.acik ? "uyari" : "notr"}>{kazaDurumEtiketi(metin, t)}</Rozet>;
};

/** Aracin kaza kayitlari. Liste alt sekme ilk acildiginda yuklenir; satira tiklayinca duzenleme modali acilir. */
export default function Kazalar({ makineId }) {
  const { t, i18n } = useTranslation();
  const { getValues } = useFormContext();
  const { kayitlar, yukleniyor, yenile } = useKartListesi(getAracKazalari, makineId, kazalariHazirla);
  // null: modal kapali, 0: yeni kayit, digerleri: duzenlenen kaydin ID'si
  const [modalKayitId, setModalKayitId] = useState(null);
  const dil = i18n.language;

  const kolonlar = [
    { key: "kayit", title: buyukHarf(t("ekipmanKarti.arac.kayit"), dil), dataIndex: "KZA_BELGE_NO", width: 96, ellipsis: true, render: (deger) => bosIse(deger) },
    { key: "tarih", title: buyukHarf(t("ekipmanKarti.tarih"), dil), dataIndex: "KZA_TARIH", width: 112, render: (deger) => <TarihHucresi deger={deger} /> },
    { key: "lokasyon", title: buyukHarf(t("ekipmanKarti.arac.lokasyon"), dil), dataIndex: "KZA_LOKSYON", ellipsis: true, render: (deger) => bosIse(deger) },
    {
      key: "surucu",
      title: buyukHarf(t("ekipmanKarti.arac.surucu"), dil),
      dataIndex: "KZA_SURUCU",
      responsive: ["xl"],
      ellipsis: true,
      render: (deger) => <SolukHucre deger={deger} />,
    },
    {
      key: "siddet",
      title: buyukHarf(t("ekipmanKarti.arac.siddet"), dil),
      dataIndex: "KZA_KAZA_TURU",
      width: 96,
      responsive: ["sm"],
      ellipsis: true,
      render: (deger) => <SolukHucre deger={deger} />,
    },
    { key: "durum", title: buyukHarf(t("ekipmanKarti.arac.durum"), dil), dataIndex: "KZA_DURUM", width: 96, render: (durum) => durumHucresi(durum, t) },
  ];

  const kaydedildi = () => {
    setModalKayitId(null);
    yenile();
  };

  return (
    <>
      <AracListeBolumu
        baslik={t("ekipmanKarti.arac.kazalar")}
        altBaslik={t("ekipmanKarti.arac.kazalarAciklama")}
        yeniMetni={t("ekipmanKarti.arac.yeniKaza")}
        kolonlar={kolonlar}
        kayitlar={kayitlar}
        yukleniyor={yukleniyor}
        onYeni={() => setModalKayitId(0)}
        onSatirTikla={(kayit) => setModalKayitId(Number(kayit.TB_ARAC_KAZA_ID) || 0)}
      />
      {modalKayitId !== null && (
        <KazaModali kayitId={modalKayitId} makineId={makineId} aracId={Number(getValues("aracId")) || 0} onKapat={() => setModalKayitId(null)} onKaydedildi={kaydedildi} />
      )}
    </>
  );
}

Kazalar.propTypes = {
  makineId: PropTypes.number.isRequired,
};
