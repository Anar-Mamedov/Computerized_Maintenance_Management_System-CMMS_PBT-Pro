import React, { useState } from "react";
import PropTypes from "prop-types";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import AracListeBolumu from "./AracListeBolumu";
import SigortaModali from "./SigortaModali";
import KalanGunRozeti from "./KalanGunRozeti";
import { SolukHucre, TarihHucresi } from "./TabloHucreleri";
import useKartListesi from "../../useKartListesi";
import { getAracSigortalari, listeyiAl } from "../../ekipmanKartiService";
import { anahtarEkle, bosIse, buyukHarf, sayiMetni } from "../../yardimcilar";

const sigortalariHazirla = (yanit) => anahtarEkle(listeyiAl(yanit), "TB_ARAC_SIGORTA_ID");

/** Aracin sigorta policeleri. Liste alt sekme ilk acildiginda yuklenir; satira tiklayinca duzenleme modali acilir. */
export default function Sigortalar({ makineId }) {
  const { t, i18n } = useTranslation();
  const { getValues } = useFormContext();
  const { kayitlar, yukleniyor, yenile } = useKartListesi(getAracSigortalari, makineId, sigortalariHazirla);
  // null: modal kapali, 0: yeni kayit, digerleri: duzenlenen kaydin ID'si
  const [modalKayitId, setModalKayitId] = useState(null);
  const dil = i18n.language;

  const kolonlar = [
    { key: "tip", title: buyukHarf(t("ekipmanKarti.arac.tip"), dil), dataIndex: "ASG_SIGORTA", width: 96, ellipsis: true, render: (deger) => bosIse(deger) },
    { key: "sirket", title: buyukHarf(t("ekipmanKarti.arac.sirket"), dil), dataIndex: "ASG_FIRMA", ellipsis: true, render: (deger) => bosIse(deger) },
    {
      key: "policeNo",
      title: buyukHarf(t("ekipmanKarti.arac.policeNo"), dil),
      dataIndex: "ASG_POLICE_NO",
      width: 160,
      responsive: ["sm"],
      ellipsis: true,
      render: (deger) => <SolukHucre deger={deger} />,
    },
    {
      key: "baslangic",
      title: buyukHarf(t("ekipmanKarti.arac.baslangic"), dil),
      dataIndex: "ASG_BASLANGIC_TARIH",
      width: 112,
      responsive: ["lg"],
      render: (deger) => <TarihHucresi deger={deger} />,
    },
    { key: "bitis", title: buyukHarf(t("ekipmanKarti.arac.bitis"), dil), dataIndex: "ASG_TARIH", width: 112, render: (deger) => <TarihHucresi deger={deger} /> },
    {
      key: "kalan",
      title: buyukHarf(t("ekipmanKarti.arac.kalan"), dil),
      dataIndex: "KALAN_GUN",
      width: 128,
      responsive: ["xl"],
      render: (gun) => <KalanGunRozeti gun={gun} kisa bos={<SolukHucre />} />,
    },
    {
      key: "tutar",
      title: buyukHarf(t("ekipmanKarti.arac.tutar"), dil),
      dataIndex: "ASG_TUTAR",
      width: 96,
      align: "right",
      responsive: ["xl"],
      className: "tabular-nums",
      render: (deger) => bosIse(sayiMetni(deger, dil)),
    },
  ];

  const kaydedildi = () => {
    setModalKayitId(null);
    yenile();
  };

  return (
    <>
      <AracListeBolumu
        baslik={t("ekipmanKarti.arac.sigortalar")}
        altBaslik={t("ekipmanKarti.arac.sigortalarAciklama")}
        yeniMetni={t("ekipmanKarti.arac.yeniSigorta")}
        kolonlar={kolonlar}
        kayitlar={kayitlar}
        yukleniyor={yukleniyor}
        onYeni={() => setModalKayitId(0)}
        onSatirTikla={(kayit) => setModalKayitId(Number(kayit.TB_ARAC_SIGORTA_ID) || 0)}
      />
      {modalKayitId !== null && (
        <SigortaModali kayitId={modalKayitId} makineId={makineId} aracId={Number(getValues("aracId")) || 0} onKapat={() => setModalKayitId(null)} onKaydedildi={kaydedildi} />
      )}
    </>
  );
}

Sigortalar.propTypes = {
  makineId: PropTypes.number.isRequired,
};
