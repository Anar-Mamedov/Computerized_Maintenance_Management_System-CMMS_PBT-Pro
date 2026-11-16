import React, { useMemo } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import StoktanEkleModali from "./StoktanEkleModali";
import YeniEkipmanModali from "./YeniEkipmanModali";
import GrupModali from "./GrupModali";
import MalzemeModali from "./MalzemeModali";
import DugumSilModali from "./DugumSilModali";
import CikartModali from "./CikartModali";
import TarihceModali from "./TarihceModali";
import RevizyonModali from "./RevizyonModali";
import { dugumTipi, hedefTipi } from "./altEkipmanYardimcilari";
import QRCodeGenerator from "../../../../../../../utils/components/QRCodeGenerator";
import EditDrawer from "../../../../../EkipmanVeritabani/Update/EditDrawer";

/**
 * Alt Ekipmanlar sekmesinin acik penceresi (ayni anda yalnizca biri). modal: { tur, dugum?, hedef?, tarihceTuru? }.
 * "grup" ve "malzeme" dugum verilince duzenler, hedef verilince ekler. Basarili islemden sonra onTamamlandi cagrilir.
 */
export default function AltEkipmanModallari({ makineId, modal, onKapat, onTamamlandi }) {
  const { t } = useTranslation();
  // EditDrawer secili satiri effect bagimliligi olarak kullanir; her render'da yeni nesne verilmez.
  const duzenlenecekSatir = useMemo(() => (modal?.tur === "ekipmanDuzenle" ? { key: modal.dugum.id } : null), [modal]);

  if (!modal) return null;
  const { tur, dugum, hedef } = modal;

  switch (tur) {
    case "grup":
      return <GrupModali makineId={makineId} hedef={hedef} grup={dugum} onKapat={onKapat} onKaydedildi={onTamamlandi} />;
    case "malzeme":
      return <MalzemeModali makineId={makineId} hedef={hedef} malzeme={dugum} onKapat={onKapat} onKaydedildi={onTamamlandi} />;
    case "stoktanEkle":
      return <StoktanEkleModali makineId={makineId} hedef={hedef} onKapat={onKapat} onEklendi={onTamamlandi} />;
    case "yeniEkipman":
      return <YeniEkipmanModali makineId={makineId} hedef={hedef} onKapat={onKapat} onEklendi={onTamamlandi} />;
    case "sil":
      return <DugumSilModali dugum={dugum} onKapat={onKapat} onSilindi={onTamamlandi} />;
    case "cikart":
      return <CikartModali ekipman={dugum} onKapat={onKapat} onTamamlandi={onTamamlandi} />;
    case "tarihce":
      return <TarihceModali tur={modal.tarihceTuru} ekipman={dugum} onKapat={onKapat} />;
    case "revizyon":
      return <RevizyonModali ekipman={dugum} onKapat={onKapat} onKaydedildi={onTamamlandi} />;
    case "barkod":
      return (
        <QRCodeGenerator visible onClose={onKapat} value={`TB_EKIPMAN_ID: ${dugum.id}`} fileName={`QR-${dugum.EKP_KOD ?? ""}`} title={t("ekipmanKarti.altEkipman.barkodEtiketi")} />
      );
    case "ekipmanDuzenle":
      // Mevcut Ekipman Veritabani cekmecesi: kaydedince onRefresh'i cagirir (basarida onDrawerClose'u cagirmaz).
      return <EditDrawer selectedRow={duzenlenecekSatir} drawerVisible onDrawerClose={onKapat} onRefresh={onTamamlandi} />;
    default:
      return null;
  }
}

AltEkipmanModallari.propTypes = {
  makineId: PropTypes.number.isRequired,
  modal: PropTypes.shape({
    tur: PropTypes.string.isRequired,
    dugum: dugumTipi,
    hedef: hedefTipi,
    tarihceTuru: PropTypes.oneOf(["dolasim", "revizyon"]),
  }),
  onKapat: PropTypes.func.isRequired,
  onTamamlandi: PropTypes.func.isRequired,
};
