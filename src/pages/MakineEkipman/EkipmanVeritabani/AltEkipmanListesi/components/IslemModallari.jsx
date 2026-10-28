import React, { useMemo } from "react";
import PropTypes from "prop-types";
import CreateDrawer from "../../Insert/CreateDrawer";
import EditDrawer from "../../Update/EditDrawer";
import StoktanEkleModali from "../../../MakineTanim/EkipmanListesi/EkipmanKarti/components/altEkipman/StoktanEkleModali";
import CikartModali from "../../../MakineTanim/EkipmanListesi/EkipmanKarti/components/altEkipman/CikartModali";
// Ekipman Karti modallarinin stilleri (KartModali .ek-sicil siniflari) bu dosyadadir.
import "../../../MakineTanim/EkipmanListesi/EkipmanKarti/ekipmanKarti.css";

/**
 * Mevcut islemlerin baglantisi: yeni alt ekipman ve duzenleme bu ekranin eski cekmeceleri, stoktan baglama ve
 * cikartma (stoga al / hurdaya ayir) Ekipman Karti'nin alt ekipman modallaridir. Modallar eski alan adlarini
 * (TB_EKIPMAN_ID, EKP_KOD, EKP_TANIM) bekledigi icin kayit burada eslenir.
 */
export default function IslemModallari({ islem, onKapat, onTamamlandi }) {
  const anahtar = islem?.anahtar;
  const kayit = islem?.kayit;
  // EditDrawer her `selectedRow` degisiminde kaydi yeniden okur; nesne sabit tutulur.
  const duzenlenecek = useMemo(() => (anahtar === "detay" && kayit ? { key: kayit.id } : null), [anahtar, kayit]);

  return (
    <>
      <CreateDrawer isVisible={anahtar === "yeniAltEkipman"} onDrawerClose={onKapat} onRefresh={onTamamlandi} />
      <EditDrawer selectedRow={duzenlenecek} drawerVisible={Boolean(duzenlenecek)} onDrawerClose={onKapat} onRefresh={onTamamlandi} />
      {anahtar === "stoktanBagla" && Number(kayit?.machineId) > 0 && <StoktanEkleModali makineId={Number(kayit.machineId)} onKapat={onKapat} onEklendi={onTamamlandi} />}
      {(anahtar === "stogaAl" || anahtar === "hurdayaAyir") && kayit && (
        <CikartModali
          secim={{ kayit: { TB_EKIPMAN_ID: kayit.id, EKP_KOD: kayit.code, EKP_TANIM: kayit.name }, ustEkipmanId: Number(kayit.parentId) || 0 }}
          islemTipi={anahtar === "stogaAl" ? "STOK" : "HURDA"}
          onKapat={onKapat}
          onTamamlandi={onTamamlandi}
        />
      )}
    </>
  );
}

IslemModallari.propTypes = {
  islem: PropTypes.shape({ anahtar: PropTypes.string.isRequired, kayit: PropTypes.object }),
  onKapat: PropTypes.func.isRequired,
  onTamamlandi: PropTypes.func.isRequired,
};
