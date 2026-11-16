import React, { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { message } from "antd";
import { useTranslation } from "react-i18next";
import KartModali from "../ortak/KartModali";
import KartTablosu from "../ortak/KartTablosu";
import ModalDugmeleri from "../ortak/ModalDugmeleri";
import EkipmanKunyesi from "./EkipmanKunyesi";
import RevizyonModali from "./RevizyonModali";
import LocalizedDateText from "../../../../../../../utils/components/LocalizedDateText";
import { getEkipmanDolasimTarihcesi, getEkipmanRevizyonTarihcesi, hataMesaji, listeyiAl } from "../../ekipmanKartiService";
import { anahtarEkle, bosIse, buyukHarf, sayiMetni } from "../../yardimcilar";
import { ekipmanEtiketi } from "./altEkipmanYardimcilari";

const TURLER = {
  dolasim: { getir: getEkipmanDolasimTarihcesi, idAlani: "TB_EKIPMAN_HAREKET_ID", baslikKey: "ekipmanKarti.altEkipman.dolasimTarihcesi", tabloGenisligi: 1040 },
  revizyon: { getir: getEkipmanRevizyonTarihcesi, idAlani: "TB_EKIPMAN_BAKIM_ID", baslikKey: "ekipmanKarti.altEkipman.revizyonTarihcesi", tabloGenisligi: 1660 },
};

// Dolasim tarihcesi { ekipman (kunye), tarihce / list } doner; liste her iki adla da kabul edilir.
const tarihceListesi = (yanit) => (Array.isArray(yanit?.tarihce) ? yanit.tarihce : listeyiAl(yanit));
const kunyeKaydi = (yanit) => (yanit?.ekipman && typeof yanit.ekipman === "object" && !Array.isArray(yanit.ekipman) ? yanit.ekipman : null);

// "14:30:00" -> "14:30"
const saatMetni = (deger) => (deger ? String(deger).slice(0, 5) : null);

const kolonlariOlustur = (tur, t, dil) => {
  const baslik = (anahtar) => buyukHarf(t(anahtar), dil);
  const metinKolonu = (alan, baslikKey, genislik, bicimle = (deger) => deger) => ({
    key: alan,
    dataIndex: alan,
    title: baslik(baslikKey),
    width: genislik,
    ellipsis: true,
    render: (deger) => bosIse(bicimle(deger)),
  });
  const sayiKolonu = (alan, baslikKey) => ({
    key: alan,
    dataIndex: alan,
    title: baslik(baslikKey),
    width: 140,
    align: "right",
    className: "tabular-nums",
    render: (deger) => bosIse(sayiMetni(deger, dil)),
  });
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
    metinKolonu("EBO_REVISYON_NO", "ekipmanKarti.altEkipman.revizyonNo", 130),
    tarihKolonu("EBO_TARIH", "ekipmanKarti.tarih"),
    metinKolonu("EBO_SAAT", "ekipmanKarti.saat", 90, saatMetni),
    metinKolonu("EBO_KONU", "ekipmanKarti.altEkipman.konu", 180),
    metinKolonu("EBO_REFERENS_NO", "ekipmanKarti.altEkipman.referansNo", 130),
    sayiKolonu("EBO_SURE_CALISMA", "ekipmanKarti.altEkipman.calismaSuresi"),
    sayiKolonu("EBO_MALIYET", "ekipmanKarti.altEkipman.maliyet"),
    metinKolonu("EBO_DURUM", "ekipmanKarti.altEkipman.kolon.durum", 120),
    metinKolonu("EBO_PROSEDUR", "ekipmanKarti.altEkipman.prosedur", 160),
    metinKolonu("EBO_YAPAN_PERSONEL", "ekipmanKarti.altEkipman.kolon.yapanPersonel", 180),
    metinKolonu("EBO_ACIKLAMA", "ekipmanKarti.aciklama", 260),
  ];
};

/**
 * Secili alt ekipmanin dolasim (makine / depo hareketleri) ya da revizyon tarihcesi; ustte ekipman kunyesi.
 * Revizyon tarihcesinden yeni revizyon eklenebilir; kayittan sonra liste yenilenir.
 */
export default function TarihceModali({ tur, ekipman, onKapat }) {
  const { t, i18n } = useTranslation();
  const [kayitlar, setKayitlar] = useState([]);
  const [kunye, setKunye] = useState(null);
  const [yukleniyor, setYukleniyor] = useState(false);
  const [surum, setSurum] = useState(0);
  const [revizyonAcik, setRevizyonAcik] = useState(false);
  const { getir, idAlani, baslikKey, tabloGenisligi } = TURLER[tur];
  const ekipmanId = ekipman.TB_EKIPMAN_ID;
  const revizyonMu = tur === "revizyon";

  useEffect(() => {
    let iptal = false;
    const yukle = async () => {
      setYukleniyor(true);
      try {
        const yanit = await getir(ekipmanId);
        if (iptal) return;
        setKayitlar(anahtarEkle(tarihceListesi(yanit), idAlani));
        setKunye(kunyeKaydi(yanit));
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
  }, [getir, idAlani, ekipmanId, surum, t]);

  const kolonlar = useMemo(() => kolonlariOlustur(tur, t, i18n.language), [tur, t, i18n.language]);

  const revizyonKaydedildi = () => {
    setRevizyonAcik(false);
    setSurum((onceki) => onceki + 1);
  };

  return (
    <>
      <KartModali
        acik
        baslik={t(baslikKey)}
        altBaslik={ekipmanEtiketi(ekipman)}
        genislik={960}
        onKapat={onKapat}
        altBilgi={<ModalDugmeleri onKapat={onKapat} onKaydet={revizyonMu ? () => setRevizyonAcik(true) : undefined} kaydetMetni={t("ekipmanKarti.altEkipman.yeniRevizyon")} />}
      >
        <div className="space-y-4">
          <EkipmanKunyesi ekipman={{ ...ekipman, ...kunye }} />
          <KartTablosu ic rowKey="clientKey" columns={kolonlar} dataSource={kayitlar} loading={yukleniyor} scroll={{ x: tabloGenisligi }} />
        </div>
      </KartModali>
      {revizyonAcik && <RevizyonModali ekipman={ekipman} onKapat={() => setRevizyonAcik(false)} onKaydedildi={revizyonKaydedildi} />}
    </>
  );
}

TarihceModali.propTypes = {
  tur: PropTypes.oneOf(["dolasim", "revizyon"]).isRequired,
  /** Secili alt ekipman kaydi (TB_EKIPMAN_ID, EKP_KOD, EKP_TANIM, kunye alanlari). */
  ekipman: PropTypes.object.isRequired,
  onKapat: PropTypes.func.isRequired,
};
