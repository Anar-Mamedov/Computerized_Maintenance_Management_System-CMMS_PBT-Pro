import React, { useMemo, useState } from "react";
import PropTypes from "prop-types";
import { Grid, message } from "antd";
import { useTranslation } from "react-i18next";
import { LuCalendarClock, LuCalendarX, LuClipboardList, LuHistory, LuPencil, LuPlus, LuRefreshCw, LuSettings2, LuTrash2 } from "react-icons/lu";
import IslemMenusu from "../ortak/IslemMenusu";
import KartTablosu from "../ortak/KartTablosu";
import ListeOzellikleriModali from "../ortak/ListeOzellikleriModali";
import useGorunurKolonlar from "../ortak/useGorunurKolonlar";
import BakimModallari from "./BakimModallari";
import { bakimKolonlari } from "./bakimKolonlari";
import { satirSinifi } from "./bakimYardimcilari";
import IsEmriCekmecesi from "../../../../../../BakımVeArizaYonetimi/IsEmri/Update/EditDrawer";

const SECIM_KOLONU = 40;
const BAKIM_KOLONU_ASGARI = 120;

/**
 * Kartin "Periyodik Bakimlar" sekmesi. Liste cekmecede yuklenir (`veri`); sekme istek atmaz,
 * degisiklikten sonra `veri.yenile()` ve `onVeriDegisti()` cagrilir. Satira tiklama detay modalini acar.
 */
export default function PeriyodikBakimlar({ makineId, veri, aktif, onVeriDegisti }) {
  const { t, i18n } = useTranslation();
  const ekranlar = Grid.useBreakpoint();
  const [seciliAnahtarlar, setSeciliAnahtarlar] = useState([]);
  const [modal, setModal] = useState(null);
  // Is emri cekmecesi ID'yi selectedRow.key'den okur; nesne state'te durur ki her cizimde yeniden yuklenmesin.
  const [isEmriSatiri, setIsEmriSatiri] = useState(null);

  const kolonlar = useMemo(() => bakimKolonlari({ t, dil: i18n.language, onIsEmriAc: (kayit) => setIsEmriSatiri({ key: kayit.IS_EMRI_ID }) }), [t, i18n.language]);
  const { gorunurKolonlar, gizliAnahtarlar, gizliAnahtarlariDegistir } = useGorunurKolonlar("ekipmanKarti.bakim.kolonlar", kolonlar);
  const secililer = useMemo(() => veri.kayitlar.filter((kayit) => seciliAnahtarlar.includes(kayit.clientKey)), [veri.kayitlar, seciliAnahtarlar]);

  // Sabit genislikli kolonlar sigmazsa tablo yatay kayar; Bakim kolonu en az BAKIM_KOLONU_ASGARI genislikte kalir.
  const tabloGenisligi = gorunurKolonlar
    .filter((kolon) => !kolon.responsive || kolon.responsive.some((nokta) => ekranlar[nokta]))
    .reduce((toplam, kolon) => toplam + (kolon.width ?? BAKIM_KOLONU_ASGARI), SECIM_KOLONU);

  const yenile = () => {
    setSeciliAnahtarlar([]);
    veri.yenile();
  };

  const islemTamamlandi = () => {
    setModal(null);
    yenile();
    onVeriDegisti();
  };

  const isEmriGuncellendi = () => {
    veri.yenile();
    onVeriDegisti();
  };

  const tekKayitla = (islem) => () => {
    if (secililer.length !== 1) {
      message.warning(t("ekipmanKarti.tekKayitSecin"));
      return;
    }
    islem(secililer[0]);
  };

  const seciliKayitlarla = (tur) => () => {
    if (!secililer.length) {
      message.warning(t("ekipmanKarti.enAzBirKayitSecin"));
      return;
    }
    setModal({ tur, kayitlar: secililer });
  };

  const isEmriOlustur = (kayit) => {
    if (kayit.IS_EMRI_NO) {
      message.warning(t("ekipmanKarti.bakim.acikIsEmriVar", { no: kayit.IS_EMRI_NO }));
      return;
    }
    setModal({ tur: "isEmri", kayit });
  };

  const ogeler = [
    { key: "yeni", etiket: t("ekipmanKarti.yeniKayit"), kisayol: "F4", ikon: <LuPlus size={14} />, onClick: () => setModal({ tur: "ekle" }) },
    { key: "incele", etiket: t("ekipmanKarti.incele"), kisayol: "F7", ikon: <LuPencil size={14} />, onClick: tekKayitla((kayit) => setModal({ tur: "duzenle", kayit })) },
    { key: "sil", etiket: t("ekipmanKarti.sil"), kisayol: "F9", ikon: <LuTrash2 size={14} />, tehlikeli: true, onClick: seciliKayitlarla("sil") },
    { tip: "ayrac" },
    { key: "planla", etiket: t("ekipmanKarti.bakim.ileriTarihePlanla"), ikon: <LuCalendarClock size={14} />, onClick: seciliKayitlarla("planla") },
    { key: "iptal", etiket: t("ekipmanKarti.bakim.bakimIptali"), ikon: <LuCalendarX size={14} />, onClick: seciliKayitlarla("iptal") },
    { key: "isEmri", etiket: t("ekipmanKarti.bakim.isEmriOlustur"), ikon: <LuClipboardList size={14} />, onClick: tekKayitla(isEmriOlustur) },
    {
      key: "tarihce",
      etiket: t("ekipmanKarti.bakim.tarihce"),
      ikon: <LuHistory size={14} />,
      onClick: () => setModal({ tur: "tarihce", kayit: secililer.length === 1 ? secililer[0] : null }),
    },
    { tip: "ayrac" },
    { key: "yenile", etiket: t("ekipmanKarti.yenile"), kisayol: "F5", ikon: <LuRefreshCw size={14} className="ek-kart-menu__ikon--basari" />, onClick: yenile },
    { key: "kolonlar", etiket: t("ekipmanKarti.listeOzellikleri"), ikon: <LuSettings2 size={14} />, onClick: () => setModal({ tur: "kolonlar" }) },
  ];

  const satirOzellikleri = (kayit) => ({
    onClick: (olay) => {
      // onay kutusu hucresine tiklamak yalnizca secimi degistirir
      if (olay.target.closest(".ant-table-selection-column")) return;
      setModal({ tur: "detay", kayit });
    },
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <IslemMenusu ogeler={ogeler} aktif={aktif && !modal && !isEmriSatiri} />
      </div>
      <KartTablosu
        className="[&_td]:align-top"
        rowKey="clientKey"
        columns={gorunurKolonlar}
        dataSource={veri.kayitlar}
        loading={veri.yukleniyor}
        scroll={{ x: tabloGenisligi }}
        rowSelection={{ columnWidth: SECIM_KOLONU, selectedRowKeys: seciliAnahtarlar, onChange: (anahtarlar) => setSeciliAnahtarlar(anahtarlar) }}
        rowClassName={satirSinifi}
        onRow={satirOzellikleri}
      />

      <BakimModallari modal={modal} makineId={makineId} onDegistir={setModal} onKapat={() => setModal(null)} onTamamlandi={islemTamamlandi} />
      <ListeOzellikleriModali
        acik={modal?.tur === "kolonlar"}
        kolonlar={kolonlar}
        gizliAnahtarlar={gizliAnahtarlar}
        onDegistir={gizliAnahtarlariDegistir}
        onKapat={() => setModal(null)}
      />
      {isEmriSatiri && <IsEmriCekmecesi selectedRow={isEmriSatiri} drawerVisible onDrawerClose={() => setIsEmriSatiri(null)} onRefresh={isEmriGuncellendi} />}
    </div>
  );
}

PeriyodikBakimlar.propTypes = {
  makineId: PropTypes.number.isRequired,
  veri: PropTypes.shape({
    kayitlar: PropTypes.arrayOf(PropTypes.object).isRequired,
    yukleniyor: PropTypes.bool.isRequired,
    yenile: PropTypes.func.isRequired,
  }).isRequired,
  aktif: PropTypes.bool.isRequired,
  onVeriDegisti: PropTypes.func.isRequired,
};
