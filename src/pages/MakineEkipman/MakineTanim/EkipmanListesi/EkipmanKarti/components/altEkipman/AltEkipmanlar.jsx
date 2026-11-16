import React, { useMemo, useState } from "react";
import PropTypes from "prop-types";
import { Spin } from "antd";
import { useTranslation } from "react-i18next";
import { LuRefreshCw } from "react-icons/lu";
import IslemMenusu from "../ortak/IslemMenusu";
import AltEkipmanGrubu from "./AltEkipmanGrubu";
import AltEkipmanModallari from "./AltEkipmanModallari";
import useAltEkipmanAgaci from "./useAltEkipmanAgaci";
import useAltEkipmanMenuleri from "./useAltEkipmanMenuleri";
import { DIGER_BOLUMU, agaciKur, bolumlereAyir, tumDugumler } from "./altEkipmanYardimcilari";

// Islemden sonra secim kaldirilir: dugum artik agacta yok (silindi ya da makineden cikartildi).
const SECIMI_KALDIRAN_ISLEMLER = ["sil", "cikart"];

/**
 * Alt Ekipmanlar sekmesi: makinenin gruplari, alt ekipmanlari ve malzemeleri agac olarak listelenir (masaustu uygulamasiyla
 * ayni kurallar). Makineye bagli gruplar bolum basligidir; gruba bagli olmayan kayitlar "Diger" bolumundedir.
 * "Ekle" yeni kaydi secili grup / ekipmanin altina, secim yoksa makineye baglar. Satirin sag tik ve "⋮" menusu
 * tipine gore degisir (useAltEkipmanMenuleri). Basarili her degisiklikten sonra liste yenilenir ve karta bildirilir.
 */
export default function AltEkipmanlar({ makineId, veri, aktif, onVeriDegisti }) {
  const { t } = useTranslation();
  const agac = useAltEkipmanAgaci();
  // Acik pencere: { tur, dugum?, hedef?, tarihceTuru? }; ayni anda yalnizca biri acik olur.
  const [modal, setModal] = useState(null);
  const { hedefAl, ekleSecenekleri, dugumOgeleri } = useAltEkipmanMenuleri(setModal);

  const kokler = useMemo(() => agaciKur(veri.kayitlar), [veri.kayitlar]);
  const bolumler = useMemo(() => bolumlereAyir(kokler), [kokler]);
  const dugumler = useMemo(() => tumDugumler(kokler), [kokler]);
  const seciliDugum = dugumler.find((dugum) => dugum.anahtar === agac.seciliAnahtar) ?? null;

  const kapat = () => setModal(null);

  const tamamlandi = () => {
    if (modal?.hedef?.anahtar) agac.ac(modal.hedef.anahtar);
    if (SECIMI_KALDIRAN_ISLEMLER.includes(modal?.tur)) agac.sec(null);
    setModal(null);
    veri.yenile();
    onVeriDegisti();
  };

  const ekleOgesi = { key: "ekle", etiket: t("ekipmanKarti.altEkipman.ekle"), altOgeler: ekleSecenekleri(hedefAl(seciliDugum)) };

  const genelOgeler = [
    {
      key: "listeAc",
      etiket: t("ekipmanKarti.altEkipman.listeAc"),
      onClick: () => agac.hepsiniAc(dugumler.filter((dugum) => dugum.cocuklar.length).map((dugum) => dugum.anahtar)),
    },
    { key: "listeKapat", etiket: t("ekipmanKarti.altEkipman.listeKapat"), onClick: () => agac.hepsiniKapat(bolumler.map((bolum) => bolum.anahtar)) },
    { tip: "ayrac" },
    // Rehberde F5 secili dugumu duzenler; secim yokken F5 listeyi yeniler (iki ogede ayni anda F5 gorunmez).
    {
      key: "yenile",
      etiket: t("ekipmanKarti.yenile"),
      kisayol: seciliDugum ? undefined : "F5",
      ikon: <LuRefreshCw size={14} className="ek-kart-menu__ikon--basari" />,
      onClick: veri.yenile,
    },
  ];

  // Secili dugumun islemleri ustte; secim yoksa yalnizca yonlendirme metni ve genel islemler.
  const ogeler = seciliDugum
    ? [...dugumOgeleri(seciliDugum), { tip: "ayrac" }, ...genelOgeler]
    : [{ key: "secimYok", etiket: t("ekipmanKarti.altEkipman.islemIcinSecin"), devreDisi: true }, { tip: "ayrac" }, ...genelOgeler];

  const icerigiCiz = () => {
    if (veri.yukleniyor) {
      return (
        <div className="flex justify-center py-12">
          <Spin />
        </div>
      );
    }
    if (!bolumler.length) {
      return (
        <div className="ek-kart-bos">
          <p className="m-0 text-sm font-medium">{t("ekipmanKarti.altEkipman.bosBaslik")}</p>
          <p className="ek-kart-soluk m-0 mt-1 text-xs">{t("ekipmanKarti.altEkipman.bosAciklama")}</p>
        </div>
      );
    }
    return (
      <div className="space-y-3">
        {bolumler.map((bolum) => (
          <AltEkipmanGrubu key={bolum.grup?.clientKey ?? DIGER_BOLUMU} bolum={bolum} agac={agac} menuOgeleriniAl={dugumOgeleri} />
        ))}
      </div>
    );
  };

  return (
    <>
      <div className="space-y-4">
        <div className="flex justify-end">
          <IslemMenusu ogeler={ogeler} ekle={ekleOgesi} aktif={aktif && !modal} />
        </div>
        {icerigiCiz()}
      </div>

      <AltEkipmanModallari makineId={makineId} modal={modal} onKapat={kapat} onTamamlandi={tamamlandi} />
    </>
  );
}

AltEkipmanlar.propTypes = {
  makineId: PropTypes.number.isRequired,
  /** Makinenin alt ekipman agaci, duz liste (useSekmeVerileri); kayitlarda clientKey vardir. */
  veri: PropTypes.shape({
    kayitlar: PropTypes.arrayOf(PropTypes.object).isRequired,
    yukleniyor: PropTypes.bool.isRequired,
    yenile: PropTypes.func.isRequired,
  }).isRequired,
  aktif: PropTypes.bool.isRequired,
  onVeriDegisti: PropTypes.func.isRequired,
};
