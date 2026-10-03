import React, { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { Input, Pagination, message } from "antd";
import { useTranslation } from "react-i18next";
import { LuSearch } from "react-icons/lu";
import KartModali from "../ortak/KartModali";
import KartTablosu from "../ortak/KartTablosu";
import ModalDugmeleri from "../ortak/ModalDugmeleri";
import useDebounce from "../../../../../../../hooks/useDebounce";
import { basariliMi } from "../../../ekipmanService";
import { ekleAltEkipman, getBostaEkipmanlar, hataMesaji, listeyiAl, yanitHatasi } from "../../ekipmanKartiService";
import { anahtarEkle, bosIse, buyukHarf, sayiMetni } from "../../yardimcilar";

const SAYFA_BOYUTU = 10;

const KOLONLAR = [
  { alan: "EKP_KOD", baslikKey: "ekipmanKarti.altEkipman.kolon.ekipmanKodu", genislik: 130 },
  { alan: "EKP_TANIM", baslikKey: "ekipmanKarti.altEkipman.kolon.tanim", genislik: 220 },
  { alan: "EKP_TIP", baslikKey: "ekipmanKarti.altEkipman.kolon.tip", genislik: 130 },
  { alan: "EKP_DURUM", baslikKey: "ekipmanKarti.altEkipman.kolon.durum", genislik: 120 },
  { alan: "EKP_MARKA", baslikKey: "ekipmanKarti.altEkipman.kolon.marka", genislik: 120 },
  { alan: "EKP_MODEL", baslikKey: "ekipmanKarti.altEkipman.kolon.model", genislik: 120 },
  { alan: "EKP_SERI_NO", baslikKey: "ekipmanKarti.altEkipman.kolon.seriNo", genislik: 130 },
  { alan: "EKP_DEPO", baslikKey: "ekipmanKarti.altEkipman.kolon.depo", genislik: 130 },
];

/** Stoktan Ekle: makineye takilmamis (bosta) ekipmanlardan coklu secim yapilip makineye eklenir. Secim sayfalar arasinda korunur. */
export default function StoktanEkleModali({ makineId, onKapat, onEklendi }) {
  const { t, i18n } = useTranslation();
  const [arama, setArama] = useState("");
  const gecikmeliArama = useDebounce(arama, 400);
  const [parametre, setParametre] = useState("");
  const [sayfa, setSayfa] = useState(1);
  const [kayitlar, setKayitlar] = useState([]);
  const [toplam, setToplam] = useState(0);
  const [yukleniyor, setYukleniyor] = useState(false);
  const [seciliIdler, setSeciliIdler] = useState([]);
  const [kaydediliyor, setKaydediliyor] = useState(false);

  // Yazma bitince arama uygulanir ve ilk sayfaya donulur (render sirasinda; tek istek atilir).
  const yeniParametre = gecikmeliArama.trim();
  if (yeniParametre !== parametre) {
    setParametre(yeniParametre);
    setSayfa(1);
  }

  useEffect(() => {
    let iptal = false;
    const yukle = async () => {
      setYukleniyor(true);
      try {
        const yanit = await getBostaEkipmanlar({ parametre, sayfa, sayfaBoyutu: SAYFA_BOYUTU });
        if (iptal) return;
        setKayitlar(anahtarEkle(listeyiAl(yanit), "TB_EKIPMAN_ID"));
        setToplam(Number(yanit?.kayit_sayisi) || 0);
      } catch (hata) {
        if (iptal) return;
        console.error("Bostaki ekipmanlar alinamadi:", hata);
        setKayitlar([]);
        setToplam(0);
        message.error(hataMesaji(hata, t("ekipmanKarti.listeAlinamadi")));
      } finally {
        if (!iptal) setYukleniyor(false);
      }
    };

    yukle();
    return () => {
      iptal = true;
    };
  }, [parametre, sayfa, t]);

  const kolonlar = useMemo(
    () =>
      KOLONLAR.map(({ alan, baslikKey, genislik }) => ({
        key: alan,
        dataIndex: alan,
        title: buyukHarf(t(baslikKey), i18n.language),
        width: genislik,
        ellipsis: true,
        render: (deger) => bosIse(deger),
      })),
    [t, i18n.language]
  );

  // Tablo satir anahtari clientKey'dir; secim ise TB_EKIPMAN_ID ile tutulur.
  const seciliAnahtarlar = kayitlar.filter((kayit) => seciliIdler.includes(kayit.TB_EKIPMAN_ID)).map((kayit) => kayit.clientKey);

  // Bu sayfadaki secimler yenisiyle degistirilir, diger sayfalarda secilenler korunur.
  const secimDegisti = (_anahtarlar, seciliSatirlar) => {
    const sayfadakiIdler = kayitlar.map((kayit) => kayit.TB_EKIPMAN_ID);
    const sayfadaSecilenler = seciliSatirlar.map((satir) => satir.TB_EKIPMAN_ID);
    setSeciliIdler((onceki) => [...new Set([...onceki.filter((id) => !sayfadakiIdler.includes(id)), ...sayfadaSecilenler])]);
  };

  const kaydet = async () => {
    setKaydediliyor(true);
    try {
      const yanit = await ekleAltEkipman(makineId, seciliIdler);
      if (!basariliMi(yanit)) {
        message.error(yanitHatasi(yanit, t));
        return;
      }
      message.success(t("ekipmanKarti.altEkipman.eklendi"));
      onEklendi();
    } catch (hata) {
      console.error("Alt ekipman eklenemedi:", hata);
      message.error(hataMesaji(hata, t("ekipmanKarti.islemBasarisiz")));
    } finally {
      setKaydediliyor(false);
    }
  };

  return (
    <KartModali
      acik
      baslik={t("ekipmanKarti.altEkipman.stoktanEkleBaslik")}
      altBaslik={t("ekipmanKarti.altEkipman.stoktanEkleAciklama")}
      genislik={960}
      onKapat={onKapat}
      kapatilabilir={!kaydediliyor}
      altBilgi={
        <ModalDugmeleri
          onKapat={onKapat}
          onKaydet={kaydet}
          kaydediliyor={kaydediliyor}
          kaydetMetni={t("ekipmanKarti.altEkipman.ekleSayili", { sayi: sayiMetni(seciliIdler.length, i18n.language) })}
          kaydetDevreDisi={!seciliIdler.length}
        />
      }
    >
      <div className="space-y-3">
        <div className="w-full sm:w-80">
          <Input
            allowClear
            value={arama}
            onChange={(olay) => setArama(olay.target.value)}
            placeholder={t("ekipmanKarti.altEkipman.aramaYerTutucu")}
            prefix={<LuSearch size={16} className="ek-kart-soluk" />}
          />
        </div>
        <KartTablosu
          ic
          rowKey="clientKey"
          columns={kolonlar}
          dataSource={kayitlar}
          loading={yukleniyor}
          scroll={{ x: 1100 }}
          rowSelection={{ selectedRowKeys: seciliAnahtarlar, onChange: secimDegisti }}
        />
        <div className="flex justify-end">
          <Pagination size="small" hideOnSinglePage showSizeChanger={false} current={sayfa} pageSize={SAYFA_BOYUTU} total={toplam} onChange={(yeniSayfa) => setSayfa(yeniSayfa)} />
        </div>
      </div>
    </KartModali>
  );
}

StoktanEkleModali.propTypes = {
  makineId: PropTypes.number.isRequired,
  onKapat: PropTypes.func.isRequired,
  /** Ekleme basarili olunca (mesaj gosterildikten sonra) cagrilir. */
  onEklendi: PropTypes.func.isRequired,
};
