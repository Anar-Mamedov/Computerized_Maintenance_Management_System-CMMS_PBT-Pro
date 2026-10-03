import React, { useState } from "react";
import PropTypes from "prop-types";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import AracListeBolumu from "./AracListeBolumu";
import CezaModali from "./CezaModali";
import { SolukHucre, TarihHucresi } from "./TabloHucreleri";
import Rozet from "../ortak/Rozet";
import useKartListesi from "../../useKartListesi";
import { getAracCezalari, listeyiAl } from "../../ekipmanKartiService";
import { anahtarEkle, bosIse, buyukHarf, metinYaDaNull, sayiMetni } from "../../yardimcilar";

const cezalariHazirla = (yanit) => anahtarEkle(listeyiAl(yanit), "TB_ARAC_CEZA_ID");

// Odenmis ceza basari, digerleri uyari rozetiyle gosterilir; backend'in durum metni (CZA_DURUM) varsa o yazilir.
const odemeDurumuHucresi = (kayit, t) => {
  const odendi = Boolean(kayit.CZA_ODEME);
  const varsayilanMetin = odendi ? t("ekipmanKarti.arac.odendi") : t("ekipmanKarti.arac.bekliyor");
  return <Rozet ton={odendi ? "basari" : "uyari"}>{metinYaDaNull(kayit.CZA_DURUM) ?? varsayilanMetin}</Rozet>;
};

/** Aracin ceza kayitlari. Liste alt sekme ilk acildiginda yuklenir; satira tiklayinca duzenleme modali acilir. */
export default function Cezalar({ makineId }) {
  const { t, i18n } = useTranslation();
  const { getValues } = useFormContext();
  const { kayitlar, yukleniyor, yenile } = useKartListesi(getAracCezalari, makineId, cezalariHazirla);
  // null: modal kapali, 0: yeni kayit, digerleri: duzenlenen kaydin ID'si
  const [modalKayitId, setModalKayitId] = useState(null);
  const dil = i18n.language;

  const kolonlar = [
    { key: "cezaNo", title: buyukHarf(t("ekipmanKarti.arac.cezaNo"), dil), dataIndex: "CZA_BELGE_NO", width: 112, ellipsis: true, render: (deger) => bosIse(deger) },
    { key: "tarih", title: buyukHarf(t("ekipmanKarti.tarih"), dil), dataIndex: "CZA_TARIH", width: 112, render: (deger) => <TarihHucresi deger={deger} /> },
    { key: "yer", title: buyukHarf(t("ekipmanKarti.arac.yer"), dil), dataIndex: "CZA_LOKASYON", ellipsis: true, render: (deger) => bosIse(deger) },
    {
      key: "surucu",
      title: buyukHarf(t("ekipmanKarti.arac.surucu"), dil),
      dataIndex: "CZA_SURUCU",
      responsive: ["xl"],
      ellipsis: true,
      render: (deger) => <SolukHucre deger={deger} />,
    },
    {
      key: "tutar",
      title: buyukHarf(t("ekipmanKarti.arac.tutar"), dil),
      width: 96,
      align: "right",
      className: "tabular-nums",
      render: (_, kayit) => bosIse(sayiMetni(kayit.CZA_TOPLAM_TUTAR ?? kayit.CZA_TUTAR, dil)),
    },
    { key: "durum", title: buyukHarf(t("ekipmanKarti.arac.durum"), dil), width: 96, render: (_, kayit) => odemeDurumuHucresi(kayit, t) },
  ];

  const kaydedildi = () => {
    setModalKayitId(null);
    yenile();
  };

  return (
    <>
      <AracListeBolumu
        baslik={t("ekipmanKarti.arac.cezalar")}
        altBaslik={t("ekipmanKarti.arac.cezalarAciklama")}
        yeniMetni={t("ekipmanKarti.arac.yeniCeza")}
        kolonlar={kolonlar}
        kayitlar={kayitlar}
        yukleniyor={yukleniyor}
        onYeni={() => setModalKayitId(0)}
        onSatirTikla={(kayit) => setModalKayitId(Number(kayit.TB_ARAC_CEZA_ID) || 0)}
      />
      {modalKayitId !== null && (
        <CezaModali kayitId={modalKayitId} makineId={makineId} aracId={Number(getValues("aracId")) || 0} onKapat={() => setModalKayitId(null)} onKaydedildi={kaydedildi} />
      )}
    </>
  );
}

Cezalar.propTypes = {
  makineId: PropTypes.number.isRequired,
};
