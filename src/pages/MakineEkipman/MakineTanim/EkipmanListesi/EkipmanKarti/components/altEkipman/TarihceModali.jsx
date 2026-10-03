import React, { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { message } from "antd";
import { useTranslation } from "react-i18next";
import KartModali from "../ortak/KartModali";
import KartTablosu from "../ortak/KartTablosu";
import ModalDugmeleri from "../ortak/ModalDugmeleri";
import LocalizedDateText from "../../../../../../../utils/components/LocalizedDateText";
import { getEkipmanDolasimTarihcesi, getEkipmanRevizyonTarihcesi, hataMesaji, listeyiAl } from "../../ekipmanKartiService";
import { anahtarEkle, bosIse, buyukHarf, sayiMetni } from "../../yardimcilar";
import { ekipmanEtiketi } from "./altEkipmanYardimcilari";

const TURLER = {
  dolasim: { getir: getEkipmanDolasimTarihcesi, idAlani: "TB_EKIPMAN_HAREKET_ID", baslikKey: "ekipmanKarti.altEkipman.dolasimTarihcesi", tabloGenisligi: 1040 },
  revizyon: { getir: getEkipmanRevizyonTarihcesi, idAlani: "TB_EKIPMAN_BAKIM_ID", baslikKey: "ekipmanKarti.altEkipman.revizyonTarihcesi", tabloGenisligi: 790 },
};

const kolonlariOlustur = (tur, t, dil) => {
  const baslik = (anahtar) => buyukHarf(t(anahtar), dil);
  const metinKolonu = (alan, baslikKey, genislik) => ({ key: alan, dataIndex: alan, title: baslik(baslikKey), width: genislik, ellipsis: true, render: (deger) => bosIse(deger) });
  const tarihKolonu = (alan, baslikKey) => ({
    key: alan,
    dataIndex: alan,
    title: baslik(baslikKey),
    width: 130,
    render: (deger) => <LocalizedDateText value={deger} fallback="—" />,
  });

  if (tur === "dolasim") {
    return [
      {
        key: "makine",
        title: baslik("ekipmanKarti.altEkipman.kolon.makine"),
        width: 240,
        ellipsis: true,
        render: (_, satir) => bosIse([satir.MKN_KOD, satir.MKN_TANIM].filter(Boolean).join(" · ")),
      },
      tarihKolonu("EKH_GIRIS_TARIH", "ekipmanKarti.altEkipman.kolon.takilmaTarihi"),
      tarihKolonu("EKH_CIKIS_TARIH", "ekipmanKarti.altEkipman.kolon.sokulmeTarihi"),
      metinKolonu("EKH_GIRIS_DEPO", "ekipmanKarti.altEkipman.kolon.geldigiDepo", 160),
      metinKolonu("EKH_CIKIS_DEPO", "ekipmanKarti.altEkipman.kolon.gittigiDepo", 160),
      metinKolonu("EKH_ACIKLAMA", "ekipmanKarti.aciklama", 220),
    ];
  }

  return [
    tarihKolonu("EBO_TARIH", "ekipmanKarti.tarih"),
    metinKolonu("EBO_ACIKLAMA", "ekipmanKarti.aciklama", 320),
    metinKolonu("EBO_YAPAN_PERSONEL", "ekipmanKarti.altEkipman.kolon.yapanPersonel", 200),
    {
      key: "EBO_MALIYET",
      dataIndex: "EBO_MALIYET",
      title: baslik("ekipmanKarti.altEkipman.maliyet"),
      width: 140,
      align: "right",
      className: "tabular-nums",
      render: (deger) => bosIse(sayiMetni(deger, dil)),
    },
  ];
};

/** Secili alt ekipmanin dolasim (makine / depo hareketleri) ya da revizyon tarihcesi. */
export default function TarihceModali({ tur, ekipman, onKapat }) {
  const { t, i18n } = useTranslation();
  const [kayitlar, setKayitlar] = useState([]);
  const [yukleniyor, setYukleniyor] = useState(false);
  const { getir, idAlani, baslikKey, tabloGenisligi } = TURLER[tur];
  const ekipmanId = ekipman.TB_EKIPMAN_ID;

  useEffect(() => {
    let iptal = false;
    const yukle = async () => {
      setYukleniyor(true);
      try {
        const yanit = await getir(ekipmanId);
        if (!iptal) setKayitlar(anahtarEkle(listeyiAl(yanit), idAlani));
      } catch (hata) {
        if (iptal) return;
        console.error("Ekipman tarihcesi alinamadi:", hata);
        message.error(hataMesaji(hata, t("ekipmanKarti.listeAlinamadi")));
      } finally {
        if (!iptal) setYukleniyor(false);
      }
    };

    yukle();
    return () => {
      iptal = true;
    };
  }, [getir, idAlani, ekipmanId, t]);

  const kolonlar = useMemo(() => kolonlariOlustur(tur, t, i18n.language), [tur, t, i18n.language]);

  return (
    <KartModali acik baslik={t(baslikKey)} altBaslik={ekipmanEtiketi(ekipman)} genislik={960} onKapat={onKapat} altBilgi={<ModalDugmeleri onKapat={onKapat} />}>
      <KartTablosu ic rowKey="clientKey" columns={kolonlar} dataSource={kayitlar} loading={yukleniyor} scroll={{ x: tabloGenisligi }} />
    </KartModali>
  );
}

TarihceModali.propTypes = {
  tur: PropTypes.oneOf(["dolasim", "revizyon"]).isRequired,
  /** Secili alt ekipman kaydi (TB_EKIPMAN_ID, EKP_KOD, EKP_TANIM). */
  ekipman: PropTypes.object.isRequired,
  onKapat: PropTypes.func.isRequired,
};
