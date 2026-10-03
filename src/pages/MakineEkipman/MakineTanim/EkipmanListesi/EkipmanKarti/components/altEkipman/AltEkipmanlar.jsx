import React, { useMemo, useState } from "react";
import PropTypes from "prop-types";
import { Spin, message } from "antd";
import { useTranslation } from "react-i18next";
import { LuPrinter, LuRefreshCw } from "react-icons/lu";
import IslemMenusu from "../ortak/IslemMenusu";
import AltEkipmanGrubu from "./AltEkipmanGrubu";
import StoktanEkleModali from "./StoktanEkleModali";
import CikartModali from "./CikartModali";
import TarihceModali from "./TarihceModali";
import RevizyonModali from "./RevizyonModali";
import useAltEkipmanAgaci from "./useAltEkipmanAgaci";
import { gruplaraAyir } from "./altEkipmanYardimcilari";
import QRCodeGenerator from "../../../../../../../utils/components/QRCodeGenerator";
import CreateDrawer from "../../../../../EkipmanVeritabani/Insert/CreateDrawer";
import EditDrawer from "../../../../../EkipmanVeritabani/Update/EditDrawer";

/**
 * Alt Ekipmanlar sekmesi: makineye bagli alt ekipmanlar tiplerine gore gruplanmis agac olarak listelenir.
 * Kok liste cekmeceden gelir (veri); alt seviyeler satir ilk acildiginda cekilir. Basarili her degisiklikten
 * sonra agac sifirlanir, liste yenilenir ve karta veri degisti bildirilir.
 */
export default function AltEkipmanlar({ makineId, veri, aktif, onVeriDegisti }) {
  const { t, i18n } = useTranslation();
  const agac = useAltEkipmanAgaci();
  const [kapaliGruplar, setKapaliGruplar] = useState([]);
  // Acik pencere: { tur, secim?, islemTipi?, tarihceTuru? }; ayni anda yalnizca biri acik olur.
  const [modal, setModal] = useState(null);

  const gruplar = useMemo(() => gruplaraAyir(veri.kayitlar, i18n.language), [veri.kayitlar, i18n.language]);
  const secimler = Object.values(agac.seciliKayitlar);
  const seciliKayit = modal?.secim?.kayit;
  // EditDrawer secili satiri effect bagimliligi olarak kullanir; her render'da yeni nesne verilmez.
  const duzenlenecekSatir = useMemo(() => (modal?.tur === "duzenle" ? { key: modal.secim.kayit.TB_EKIPMAN_ID } : null), [modal]);

  const kapat = () => setModal(null);

  const yenile = () => {
    agac.sifirla();
    veri.yenile();
  };

  const tamamlandi = () => {
    setModal(null);
    yenile();
    onVeriDegisti();
  };

  const tekKayitIleAc = (tur, ekBilgi = {}) => {
    if (secimler.length !== 1) {
      message.warning(t("ekipmanKarti.tekKayitSecin"));
      return;
    }
    setModal({ tur, secim: secimler[0], ...ekBilgi });
  };

  const grubuAcKapat = (anahtar) => {
    setKapaliGruplar((onceki) => (onceki.includes(anahtar) ? onceki.filter((kapali) => kapali !== anahtar) : [...onceki, anahtar]));
  };

  const ogeler = [
    {
      key: "ekle",
      etiket: t("ekipmanKarti.altEkipman.ekle"),
      altOgeler: [
        { key: "stoktanEkle", etiket: t("ekipmanKarti.altEkipman.stoktanEkle"), onClick: () => setModal({ tur: "stoktanEkle" }) },
        { key: "yeniEkipman", etiket: t("ekipmanKarti.altEkipman.yeniEkipmanStoksuz"), onClick: () => setModal({ tur: "yeniEkipman" }) },
      ],
    },
    { key: "degistir", etiket: t("ekipmanKarti.degistir"), kisayol: "F7", onClick: () => tekKayitIleAc("duzenle") },
    {
      key: "cikart",
      etiket: t("ekipmanKarti.altEkipman.cikart"),
      altOgeler: [
        { key: "stogaAl", etiket: t("ekipmanKarti.altEkipman.stogaAl"), onClick: () => tekKayitIleAc("cikart", { islemTipi: "STOK" }) },
        { key: "hurdayaAyir", etiket: t("ekipmanKarti.altEkipman.hurdayaAyir"), onClick: () => tekKayitIleAc("cikart", { islemTipi: "HURDA" }) },
      ],
    },
    { tip: "ayrac" },
    { key: "dolasimTarihcesi", etiket: t("ekipmanKarti.altEkipman.dolasimTarihcesi"), onClick: () => tekKayitIleAc("tarihce", { tarihceTuru: "dolasim" }) },
    { key: "revizyon", etiket: t("ekipmanKarti.altEkipman.revizyon"), onClick: () => tekKayitIleAc("revizyon") },
    { key: "revizyonTarihcesi", etiket: t("ekipmanKarti.altEkipman.revizyonTarihcesi"), onClick: () => tekKayitIleAc("tarihce", { tarihceTuru: "revizyon" }) },
    { tip: "ayrac" },
    { key: "barkod", etiket: t("ekipmanKarti.altEkipman.barkodEtiketi"), ikon: <LuPrinter size={14} />, onClick: () => tekKayitIleAc("barkod") },
    { tip: "ayrac" },
    { key: "listeAc", etiket: t("ekipmanKarti.altEkipman.listeAc"), onClick: () => setKapaliGruplar([]) },
    { key: "listeKapat", etiket: t("ekipmanKarti.altEkipman.listeKapat"), onClick: () => setKapaliGruplar(gruplar.map((grup) => grup.anahtar)) },
    { tip: "ayrac" },
    { key: "yenile", etiket: t("ekipmanKarti.yenile"), kisayol: "F5", ikon: <LuRefreshCw size={14} className="ek-kart-menu__ikon--basari" />, onClick: yenile },
  ];

  const icerigiCiz = () => {
    if (veri.yukleniyor) {
      return (
        <div className="flex justify-center py-12">
          <Spin />
        </div>
      );
    }
    if (!gruplar.length) {
      return (
        <div className="ek-kart-bos">
          <p className="m-0 text-sm font-medium">{t("ekipmanKarti.altEkipman.bosBaslik")}</p>
          <p className="ek-kart-soluk m-0 mt-1 text-xs">{t("ekipmanKarti.altEkipman.bosAciklama")}</p>
        </div>
      );
    }
    return (
      <div className="space-y-3">
        {gruplar.map((grup) => (
          <AltEkipmanGrubu key={grup.anahtar} grup={grup} acik={!kapaliGruplar.includes(grup.anahtar)} onAcKapat={() => grubuAcKapat(grup.anahtar)} agac={agac} />
        ))}
      </div>
    );
  };

  return (
    <>
      <div className="space-y-4">
        <div className="flex justify-end">
          <IslemMenusu ogeler={ogeler} aktif={aktif && !modal} />
        </div>
        {icerigiCiz()}
      </div>

      {modal?.tur === "stoktanEkle" && <StoktanEkleModali makineId={makineId} onKapat={kapat} onEklendi={tamamlandi} />}
      {modal?.tur === "cikart" && <CikartModali secim={modal.secim} islemTipi={modal.islemTipi} onKapat={kapat} onTamamlandi={tamamlandi} />}
      {modal?.tur === "tarihce" && <TarihceModali tur={modal.tarihceTuru} ekipman={seciliKayit} onKapat={kapat} />}
      {modal?.tur === "revizyon" && <RevizyonModali ekipman={seciliKayit} onKapat={kapat} onKaydedildi={tamamlandi} />}
      {modal?.tur === "barkod" && (
        <QRCodeGenerator
          visible
          onClose={kapat}
          value={`TB_EKIPMAN_ID: ${seciliKayit.TB_EKIPMAN_ID}`}
          fileName={`QR-${seciliKayit.EKP_KOD ?? ""}`}
          title={t("ekipmanKarti.altEkipman.barkodEtiketi")}
        />
      )}
      {/* Mevcut Ekipman Veritabani cekmeceleri: kaydedince onRefresh'i cagirirlar (EditDrawer basarida onDrawerClose'u cagirmaz). */}
      {modal?.tur === "yeniEkipman" && <CreateDrawer isVisible onDrawerClose={kapat} onRefresh={tamamlandi} />}
      {modal?.tur === "duzenle" && <EditDrawer selectedRow={duzenlenecekSatir} drawerVisible onDrawerClose={kapat} onRefresh={tamamlandi} />}
    </>
  );
}

AltEkipmanlar.propTypes = {
  makineId: PropTypes.number.isRequired,
  /** Makineye dogrudan bagli alt ekipmanlar (useSekmeVerileri); kayitlarda clientKey vardir. */
  veri: PropTypes.shape({
    kayitlar: PropTypes.arrayOf(PropTypes.object).isRequired,
    yukleniyor: PropTypes.bool.isRequired,
    yenile: PropTypes.func.isRequired,
  }).isRequired,
  aktif: PropTypes.bool.isRequired,
  onVeriDegisti: PropTypes.func.isRequired,
};
