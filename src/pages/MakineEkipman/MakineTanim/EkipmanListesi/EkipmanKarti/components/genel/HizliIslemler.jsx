import React, { useMemo, useRef, useState } from "react";
import PropTypes from "prop-types";
import { message } from "antd";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { LuAlertTriangle, LuArrowLeftRight, LuClipboardList, LuGauge, LuHistory, LuPauseCircle } from "react-icons/lu";
import TransferModali from "./TransferModali";
import MakineSayacGirisModali from "../sayac/MakineSayacGirisModali";
import IsEmriEkleCekmecesi from "../../../../../../BakımVeArizaYonetimi/IsEmri/Insert/CreateDrawer";
import DurusEkleModali from "../../../../../DurusTakibi/Insert/CreateDrawer";
import TarihceTablo from "../../../../components/ContextMenu/components/Tarihçe/Tarihce";
import { getIsEmriTipleri, listeyiAl } from "../../ekipmanKartiService";

const ISLEMLER = [
  { key: "isEmri", Ikon: LuClipboardList, etiketKey: "ekipmanKarti.genel.isEmriAc" },
  { key: "ariza", Ikon: LuAlertTriangle, etiketKey: "ekipmanKarti.genel.arizaBildir" },
  { key: "sayac", Ikon: LuGauge, etiketKey: "ekipmanKarti.genel.sayacGir" },
  { key: "transfer", Ikon: LuArrowLeftRight, etiketKey: "ekipmanKarti.genel.transferEt" },
  { key: "durus", Ikon: LuPauseCircle, etiketKey: "ekipmanKarti.genel.durusBaslat" },
  { key: "tarihce", Ikon: LuHistory, etiketKey: "ekipmanKarti.genel.ekipmanTarihcesi" },
];

/**
 * Hizli Islemler: ilgili PBT PRO ekranlarini bu ekipman secili olarak acar.
 * Is emri / ariza -> Is Emri Ekle cekmecesi (arizada ariza tipli is emri tipi secili), duruş -> Duruş Takibi ekleme penceresi,
 * sayac -> makinenin varsayilan sayacina okuma girisi, tarihce -> mevcut Ekipman Tarihcesi.
 */
export default function HizliIslemler({ makineId, makineKaydi, onVeriDegisti }) {
  const { t } = useTranslation();
  const { getValues, setValue } = useFormContext();
  const [acikIslem, setAcikIslem] = useState(null);
  const [arizaTipi, setArizaTipi] = useState(null);
  const arizaTipiAraniyorRef = useRef(false);

  const isEmriDegerleri = useMemo(
    () => ({
      makine: makineKaydi.MKN_KOD,
      makineID: makineKaydi.TB_MAKINE_ID,
      makineTanim: makineKaydi.MKN_TANIM,
      lokasyonID: makineKaydi.MKN_LOKASYON_ID,
      lokasyonTanim: makineKaydi.MKN_LOKASYON,
      tamLokasyonTanim: makineKaydi.MKN_LOKASYON_TUM_YOL,
      makineDurumu: makineKaydi.MKN_DURUM,
      makineDurumuID: makineKaydi.MKN_DURUM_KOD_ID,
    }),
    [makineKaydi]
  );

  const arizaDegerleri = useMemo(() => (arizaTipi ? { ...isEmriDegerleri, isEmriTipiID: arizaTipi.TB_ISEMRI_TIP_ID } : isEmriDegerleri), [arizaTipi, isEmriDegerleri]);

  const durusMakineleri = useMemo(
    () => [
      {
        id: makineKaydi.TB_MAKINE_ID,
        makineId: makineKaydi.TB_MAKINE_ID,
        makineKodu: makineKaydi.MKN_KOD,
        makineTanimi: makineKaydi.MKN_TANIM,
        makineTipi: makineKaydi.MKN_TIP,
        makineLokasyon: makineKaydi.MKN_LOKASYON,
        makineLokasyonID: makineKaydi.MKN_LOKASYON_ID,
      },
    ],
    [makineKaydi]
  );

  const tarihceSatirlari = useMemo(() => [makineKaydi], [makineKaydi]);

  // Ariza bildiriminde is emri, ariza tipli (IMT_TIP_ARIZA) is emri tipiyle acilir; tanimli degilse varsayilan tip kullanilir.
  const arizaBildir = async () => {
    if (arizaTipiAraniyorRef.current) return;
    arizaTipiAraniyorRef.current = true;
    try {
      const tip = listeyiAl(await getIsEmriTipleri()).find((kayit) => Number(kayit.IMT_TIP_ARIZA) > 0 && kayit.IMT_AKTIF !== false);
      if (!tip) message.warning(t("ekipmanKarti.genel.arizaTipiYok"));
      setArizaTipi(tip ?? null);
      setAcikIslem("ariza");
    } catch (hata) {
      console.error("Is emri tipleri alinamadi:", hata);
      message.error(t("ekipmanKarti.islemBasarisiz"));
    } finally {
      arizaTipiAraniyorRef.current = false;
    }
  };

  const islemiAc = (anahtar) => {
    if (anahtar === "ariza") {
      arizaBildir();
      return;
    }
    setAcikIslem(anahtar);
  };

  const kapat = () => setAcikIslem(null);

  return (
    <>
      <div className="grid grid-cols-1 gap-x-4 gap-y-0.5 sm:grid-cols-2">
        {ISLEMLER.map(({ key, Ikon, etiketKey }) => (
          <button key={key} type="button" className="ek-kart-hizli" onClick={() => islemiAc(key)}>
            <Ikon size={14} />
            <span className="leading-tight">{t(etiketKey)}</span>
          </button>
        ))}
      </div>

      {(acikIslem === "isEmri" || acikIslem === "ariza") && (
        <IsEmriEkleCekmecesi acik onKapat={kapat} onRefresh={onVeriDegisti} varsayilanDegerler={acikIslem === "ariza" ? arizaDegerleri : isEmriDegerleri} />
      )}
      {acikIslem === "durus" && <DurusEkleModali acik onKapat={kapat} onRefresh={onVeriDegisti} varsayilanMakineler={durusMakineleri} />}
      {acikIslem === "tarihce" && <TarihceTablo selectedRows={tarihceSatirlari} open onClose={kapat} />}
      <MakineSayacGirisModali acik={acikIslem === "sayac"} makineId={makineId} lokasyonId={getValues("lokasyonID")} onKapat={kapat} onKaydedildi={onVeriDegisti} />
      <TransferModali
        acik={acikIslem === "transfer"}
        mevcutLokasyon={getValues("lokasyon")}
        onKapat={kapat}
        onUygula={({ lokasyon, lokasyonID }) => {
          setValue("lokasyon", lokasyon, { shouldDirty: true });
          setValue("lokasyonID", lokasyonID, { shouldDirty: true });
          message.info(t("ekipmanKarti.genel.transferUygulandi"));
        }}
      />
    </>
  );
}

HizliIslemler.propTypes = {
  makineId: PropTypes.number.isRequired,
  makineKaydi: PropTypes.shape({
    TB_MAKINE_ID: PropTypes.number,
    MKN_KOD: PropTypes.string,
    MKN_TANIM: PropTypes.string,
    MKN_TIP: PropTypes.string,
    MKN_LOKASYON: PropTypes.string,
    MKN_LOKASYON_ID: PropTypes.number,
    MKN_LOKASYON_TUM_YOL: PropTypes.string,
    MKN_DURUM: PropTypes.string,
    MKN_DURUM_KOD_ID: PropTypes.number,
  }).isRequired,
  onVeriDegisti: PropTypes.func.isRequired,
};
