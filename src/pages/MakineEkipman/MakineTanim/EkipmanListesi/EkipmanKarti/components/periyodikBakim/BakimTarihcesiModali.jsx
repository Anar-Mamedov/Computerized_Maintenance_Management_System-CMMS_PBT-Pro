import React, { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { message } from "antd";
import { useTranslation } from "react-i18next";
import LocalizedDateText from "../../../../../../../utils/components/LocalizedDateText";
import KartModali from "../ortak/KartModali";
import KartTablosu from "../ortak/KartTablosu";
import ModalDugmeleri from "../ortak/ModalDugmeleri";
import Rozet from "../ortak/Rozet";
import { getPeriyodikBakimTarihcesi, hataMesaji, listeyiAl } from "../../ekipmanKartiService";
import { anahtarEkle, bosIse, buyukHarf, sayiMetni } from "../../yardimcilar";

// PBL_GECIKME_DURUM_ICON: 1 zamaninda, 2 gecikmis.
const gecikmeRozeti = (durum, t) => {
  if (Number(durum) === 1) return <Rozet ton="basari">{t("ekipmanKarti.bakim.zamaninda")}</Rozet>;
  if (Number(durum) === 2) return <Rozet ton="hata">{t("ekipmanKarti.bakim.gecikmis")}</Rozet>;
  return "—";
};

const tarihceKolonlari = (t, dil) => {
  const baslik = (anahtar) => buyukHarf(t(anahtar), dil);
  const tarih = (deger) => <LocalizedDateText value={deger} fallback="—" />;
  const sayi = (deger) => bosIse(sayiMetni(deger, dil));
  const sayisal = { align: "right", className: "tabular-nums", render: sayi };

  return [
    { key: "bakim", title: baslik("ekipmanKarti.bakim.periyodikBakim"), dataIndex: "PERIYODIKBAKIM", width: 180, ellipsis: true, render: (deger) => bosIse(deger) },
    { key: "planlanan", title: baslik("ekipmanKarti.bakim.planlanan"), dataIndex: "PBL_PLANLANAN_TARIH", width: 105, render: tarih },
    { key: "gerceklesen", title: baslik("ekipmanKarti.bakim.gerceklesen"), dataIndex: "PBL_GERCEKLESEN_TARIH", width: 105, render: tarih },
    { key: "gunFarki", title: baslik("ekipmanKarti.bakim.gunFarki"), dataIndex: "PBL_GUN_FARK", width: 85, ...sayisal },
    { key: "uygulamaSayaci", title: baslik("ekipmanKarti.bakim.uygulamaSayaci"), dataIndex: "PBL_SON_UYGULAMA_SAYAC", width: 115, ...sayisal },
    { key: "hedefSayac", title: baslik("ekipmanKarti.bakim.hedefSayac"), dataIndex: "PBL_HEDEF_SAYAC", width: 105, ...sayisal },
    { key: "sayacFarki", title: baslik("ekipmanKarti.bakim.sayacFarki"), dataIndex: "PBL_FARK_SAYAC", width: 95, ...sayisal },
    { key: "isEmri", title: baslik("ekipmanKarti.bakim.isEmri"), dataIndex: "PBL_ISEMRI_NO", width: 115, ellipsis: true, render: (deger) => bosIse(deger) },
    { key: "kapanis", title: baslik("ekipmanKarti.bakim.kapanis"), dataIndex: "PBL_BITIS_TARIH", width: 105, render: tarih },
    { key: "durum", title: baslik("ekipmanKarti.bakim.durum"), dataIndex: "PBL_GECIKME_DURUM_ICON", width: 105, render: (deger) => gecikmeRozeti(deger, t) },
    { key: "aciklama", title: baslik("ekipmanKarti.aciklama"), dataIndex: "PBL_ACIKLAMA", ellipsis: true, render: (deger) => bosIse(deger) },
  ];
};

/** Periyodik bakim tarihcesi: tek bakim seciliyse yalniz o bakimin, degilse makinenin tum bakimlarinin kayitlari. */
export default function BakimTarihcesiModali({ makineId, kayit, onKapat }) {
  const { t, i18n } = useTranslation();
  const [kayitlar, setKayitlar] = useState([]);
  const [yukleniyor, setYukleniyor] = useState(true);
  const pbakimId = kayit?.TB_PERIYODIK_BAKIM_ID;

  useEffect(() => {
    let iptal = false;
    const yukle = async () => {
      try {
        const yanit = await getPeriyodikBakimTarihcesi({ makineId, pbakimId });
        if (!iptal) setKayitlar(anahtarEkle(listeyiAl(yanit), "TB_PERIYODIK_BAKIM_LOG_ID"));
      } catch (hata) {
        if (iptal) return;
        console.error("Periyodik bakim tarihcesi alinamadi:", hata);
        message.error(hataMesaji(hata, t("ekipmanKarti.listeAlinamadi")));
      } finally {
        if (!iptal) setYukleniyor(false);
      }
    };
    yukle();
    return () => {
      iptal = true;
    };
  }, [makineId, pbakimId, t]);

  const kolonlar = useMemo(() => tarihceKolonlari(t, i18n.language), [t, i18n.language]);

  return (
    <KartModali acik genislik={960} baslik={t("ekipmanKarti.bakim.tarihce")} altBaslik={kayit?.PBK_TANIM} onKapat={onKapat} altBilgi={<ModalDugmeleri onKapat={onKapat} />}>
      <KartTablosu ic rowKey="clientKey" columns={kolonlar} dataSource={kayitlar} loading={yukleniyor} scroll={{ x: 1300 }} />
    </KartModali>
  );
}

BakimTarihcesiModali.propTypes = {
  makineId: PropTypes.number.isRequired,
  kayit: PropTypes.object,
  onKapat: PropTypes.func.isRequired,
};
