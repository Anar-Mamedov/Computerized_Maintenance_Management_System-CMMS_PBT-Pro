import React, { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { Input, message } from "antd";
import { useTranslation } from "react-i18next";
import { LuSearch } from "react-icons/lu";
import useDebounce from "../../../../../../../hooks/useDebounce";
import KartModali from "../ortak/KartModali";
import KartTablosu from "../ortak/KartTablosu";
import ModalDugmeleri from "../ortak/ModalDugmeleri";
import { getEklenebilirBakimlar, hataMesaji, listeyiAl } from "../../ekipmanKartiService";
import { anahtarEkle, bosIse, buyukHarf } from "../../yardimcilar";

const SAYFA_BOYUTU = 10;
const bakimId = (kayit) => kayit.TB_PERIYODIK_BAKIM_ID;

/** Yeni Kayit 1. adim: makineye henuz tanimlanmamis bakimlardan coklu secim (secim sayfalar arasi korunur). */
export default function BakimSecimModali({ makineId, onKapat, onDevam }) {
  const { t, i18n } = useTranslation();
  const [arama, setArama] = useState("");
  const aranan = useDebounce(arama.trim(), 400);
  const [sorgu, setSorgu] = useState({ aranan, sayfa: 1 });
  const [kayitlar, setKayitlar] = useState([]);
  const [toplam, setToplam] = useState(0);
  const [yukleniyor, setYukleniyor] = useState(false);
  const [secililer, setSecililer] = useState([]);

  // Arama degisince ilk sayfaya donulur; cizim sirasinda ayarlandigi icin araya fazladan istek girmez.
  if (sorgu.aranan !== aranan) {
    setSorgu({ aranan, sayfa: 1 });
  }

  useEffect(() => {
    let iptal = false;
    const getir = async () => {
      setYukleniyor(true);
      try {
        const yanit = await getEklenebilirBakimlar({ makineId, sayfa: sorgu.sayfa, sayfaBoyutu: SAYFA_BOYUTU, parametre: sorgu.aranan });
        if (iptal) return;
        setKayitlar(anahtarEkle(listeyiAl(yanit), "TB_PERIYODIK_BAKIM_ID"));
        setToplam(Number(yanit?.kayit_sayisi) || 0);
      } catch (hata) {
        if (iptal) return;
        console.error("Eklenebilir bakimlar alinamadi:", hata);
        setKayitlar([]);
        setToplam(0);
        message.error(hataMesaji(hata, t("ekipmanKarti.listeAlinamadi")));
      } finally {
        if (!iptal) setYukleniyor(false);
      }
    };
    getir();
    return () => {
      iptal = true;
    };
  }, [makineId, sorgu, t]);

  const kolonlar = useMemo(() => {
    const baslik = (anahtar) => buyukHarf(t(anahtar), i18n.language);
    return [
      { key: "kod", title: baslik("ekipmanKarti.bakim.bakimKodu"), dataIndex: "PBK_KOD", width: 160, ellipsis: true, render: (deger) => bosIse(deger) },
      { key: "tanim", title: baslik("ekipmanKarti.bakim.bakimTanimi"), dataIndex: "PBK_TANIM", ellipsis: true, render: (deger) => bosIse(deger) },
      { key: "periyot", title: baslik("ekipmanKarti.bakim.periyot"), dataIndex: "PERIYOT_ACIKLAMA", width: 200, ellipsis: true, render: (deger) => bosIse(deger) },
    ];
  }, [t, i18n.language]);

  // Bu sayfadaki secim guncellenir, diger sayfalarda secilenler korunur (eslesme backend ID'si ile).
  const secimDegisti = (anahtarlar) => {
    const sayfadakiIdler = kayitlar.map(bakimId);
    const sayfadaSecilenler = kayitlar.filter((kayit) => anahtarlar.includes(kayit.clientKey));
    setSecililer((onceki) => [...onceki.filter((kayit) => !sayfadakiIdler.includes(bakimId(kayit))), ...sayfadaSecilenler]);
  };

  const seciliAnahtarlar = kayitlar.filter((kayit) => secililer.some((secili) => bakimId(secili) === bakimId(kayit))).map((kayit) => kayit.clientKey);

  return (
    <KartModali
      acik
      genislik={960}
      baslik={t("ekipmanKarti.bakim.ekleBaslik")}
      altBaslik={t("ekipmanKarti.bakim.ekleAltBaslik")}
      onKapat={onKapat}
      altBilgi={
        <ModalDugmeleri
          onKapat={onKapat}
          onKaydet={() => onDevam(secililer)}
          kaydetMetni={t("ekipmanKarti.bakim.devamEt", { sayi: secililer.length })}
          kaydetDevreDisi={!secililer.length}
        />
      }
    >
      <div className="space-y-4">
        <Input
          value={arama}
          onChange={(olay) => setArama(olay.target.value)}
          allowClear
          prefix={<LuSearch size={14} className="ek-kart-soluk" />}
          placeholder={t("ekipmanKarti.ara")}
        />
        <KartTablosu
          ic
          rowKey="clientKey"
          columns={kolonlar}
          dataSource={kayitlar}
          loading={yukleniyor}
          rowSelection={{ columnWidth: 40, selectedRowKeys: seciliAnahtarlar, onChange: secimDegisti }}
          pagination={{
            current: sorgu.sayfa,
            pageSize: SAYFA_BOYUTU,
            total: toplam,
            showSizeChanger: false,
            onChange: (sayfa) => setSorgu((onceki) => ({ ...onceki, sayfa })),
          }}
        />
      </div>
    </KartModali>
  );
}

BakimSecimModali.propTypes = {
  makineId: PropTypes.number.isRequired,
  onKapat: PropTypes.func.isRequired,
  onDevam: PropTypes.func.isRequired,
};
