import React, { useMemo, useState } from "react";
import PropTypes from "prop-types";
import { message } from "antd";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { LuGauge, LuHistory, LuPencil, LuPlus, LuRefreshCw, LuRotateCcw, LuSettings2, LuStar, LuTrash2 } from "react-icons/lu";
import IslemMenusu from "../ortak/IslemMenusu";
import KartTablosu from "../ortak/KartTablosu";
import OnayModali from "../ortak/OnayModali";
import ListeOzellikleriModali from "../ortak/ListeOzellikleriModali";
import useGorunurKolonlar from "../ortak/useGorunurKolonlar";
import SayacTanimModali from "./SayacTanimModali";
import SayacHareketleriModali from "./SayacHareketleriModali";
import SayacOkumaModali from "./SayacOkumaModali";
import SayacSifirlamaModali from "./SayacSifirlamaModali";
import useSayacKolonlari from "./useSayacKolonlari";
import { bayrak, sayacOzeti } from "./sayacYardimcilari";
import { basariliMi } from "../../../ekipmanService";
import { hataMesaji, silSayac, varsayilanYapSayac, yanitHatasi } from "../../ekipmanKartiService";

const IKON_BOYUTU = 14;

/**
 * Sayaclar sekmesi. Liste cekmecede yuklenir (`veri`); sekme tekrar istek atmaz, degisiklikten sonra
 * `veri.yenile()` ve `onVeriDegisti()` cagirir. Satira tiklamak "Degistir" modalini acar.
 */
export default function Sayaclar({ makineId, veri, aktif = false, onVeriDegisti }) {
  const { t } = useTranslation();
  const { getValues } = useFormContext();
  const { kolonlar, ozellikKolonlari } = useSayacKolonlari();
  const { gorunurKolonlar, gizliAnahtarlar, gizliAnahtarlariDegistir } = useGorunurKolonlar("ekipmanKarti.sayac.kolonlar", kolonlar);
  const [seciliAnahtarlar, setSeciliAnahtarlar] = useState([]);
  const [acikModal, setAcikModal] = useState(null);
  const [islemKaydi, setIslemKaydi] = useState(null);
  const [siliniyor, setSiliniyor] = useState(false);

  const seciliKayitlar = useMemo(() => veri.kayitlar.filter((kayit) => seciliAnahtarlar.includes(kayit.clientKey)), [veri.kayitlar, seciliAnahtarlar]);
  const islemSayaci = useMemo(() => (islemKaydi ? sayacOzeti(islemKaydi) : null), [islemKaydi]);

  // Kapanan modalin icerigi kapanma animasyonunda kaybolmasin diye islem kaydi kapatirken temizlenmez.
  const modalAc = (tip, kayit = null) => {
    setIslemKaydi(kayit);
    setAcikModal(tip);
  };
  const modaliKapat = () => setAcikModal(null);

  const tekKayit = () => {
    if (seciliKayitlar.length === 1) return seciliKayitlar[0];
    message.warning(t("ekipmanKarti.tekKayitSecin"));
    return null;
  };

  const tekKayitlaAc = (tip) => {
    const kayit = tekKayit();
    if (kayit) modalAc(tip, kayit);
  };

  const veriyiYenile = () => {
    setSeciliAnahtarlar([]);
    veri.yenile();
    onVeriDegisti();
  };

  const silmeyiIste = () => {
    if (!seciliKayitlar.length) {
      message.warning(t("ekipmanKarti.enAzBirKayitSecin"));
      return;
    }
    setAcikModal("sil");
  };

  // Secili sayaclar sirayla silinir; sonuc tek bildirimle gosterilir.
  const sil = async () => {
    setSiliniyor(true);
    let basarili = 0;
    let sonHata = t("ekipmanKarti.islemBasarisiz");
    for (const kayit of seciliKayitlar) {
      try {
        const yanit = await silSayac(kayit.TB_SAYAC_ID);
        if (basariliMi(yanit)) basarili += 1;
        else sonHata = yanitHatasi(yanit, t);
      } catch (hata) {
        console.error("Sayac silinemedi:", hata);
        sonHata = hataMesaji(hata, t("ekipmanKarti.islemBasarisiz"));
      }
    }
    setSiliniyor(false);
    setAcikModal(null);

    if (basarili === seciliKayitlar.length) message.success(t("ekipmanKarti.silindi"));
    else if (basarili > 0) message.warning(t("ekipmanKarti.sayac.kismenSilindi", { basarili, toplam: seciliKayitlar.length }));
    else message.error(sonHata);
    if (basarili > 0) veriyiYenile();
  };

  const varsayilanYap = async () => {
    const kayit = tekKayit();
    if (!kayit) return;
    if (bayrak(kayit.MES_VARSAYILAN)) {
      message.info(t("ekipmanKarti.sayac.zatenVarsayilan"));
      return;
    }
    try {
      const yanit = await varsayilanYapSayac(kayit.TB_SAYAC_ID);
      if (!basariliMi(yanit)) {
        message.error(yanitHatasi(yanit, t));
        return;
      }
      message.success(t("ekipmanKarti.sayac.varsayilanYapildi"));
      veriyiYenile();
    } catch (hata) {
      console.error("Sayac varsayilan yapilamadi:", hata);
      message.error(hataMesaji(hata, t("ekipmanKarti.islemBasarisiz")));
    }
  };

  const yenile = () => {
    setSeciliAnahtarlar([]);
    veri.yenile();
  };

  const menuOgeleri = [
    { key: "yeni", etiket: t("ekipmanKarti.yeniKayit"), kisayol: "F4", ikon: <LuPlus size={IKON_BOYUTU} />, onClick: () => modalAc("tanim") },
    { key: "degistir", etiket: t("ekipmanKarti.degistir"), kisayol: "F7", ikon: <LuPencil size={IKON_BOYUTU} />, onClick: () => tekKayitlaAc("tanim") },
    { key: "sil", etiket: t("ekipmanKarti.sil"), kisayol: "F9", ikon: <LuTrash2 size={IKON_BOYUTU} />, tehlikeli: true, onClick: silmeyiIste },
    { tip: "ayrac" },
    { key: "hareketler", etiket: t("ekipmanKarti.sayac.hareketler"), ikon: <LuHistory size={IKON_BOYUTU} />, onClick: () => tekKayitlaAc("hareketler") },
    { key: "guncelleme", etiket: t("ekipmanKarti.sayac.guncelleme"), ikon: <LuGauge size={IKON_BOYUTU} />, onClick: () => tekKayitlaAc("okuma") },
    { key: "sifirlama", etiket: t("ekipmanKarti.sayac.sifirlama"), ikon: <LuRotateCcw size={IKON_BOYUTU} />, onClick: () => tekKayitlaAc("sifirlama") },
    { key: "varsayilan", etiket: t("ekipmanKarti.sayac.varsayilanYap"), ikon: <LuStar size={IKON_BOYUTU} />, onClick: varsayilanYap },
    { tip: "ayrac" },
    { key: "yenile", etiket: t("ekipmanKarti.yenile"), kisayol: "F5", ikon: <LuRefreshCw size={IKON_BOYUTU} className="ek-kart-menu__ikon--basari" />, onClick: yenile },
    { key: "listeOzellikleri", etiket: t("ekipmanKarti.listeOzellikleri"), ikon: <LuSettings2 size={IKON_BOYUTU} />, onClick: () => setAcikModal("listeOzellikleri") },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <IslemMenusu ogeler={menuOgeleri} aktif={aktif && acikModal === null} />
      </div>
      <KartTablosu
        rowKey="clientKey"
        columns={gorunurKolonlar}
        dataSource={veri.kayitlar}
        loading={veri.yukleniyor}
        rowSelection={{ columnWidth: 36, selectedRowKeys: seciliAnahtarlar, onChange: (anahtarlar) => setSeciliAnahtarlar(anahtarlar) }}
        rowClassName="ek-kart-satir--tiklanir"
        onRow={(kayit) => ({
          // Onay kutusu hucresine tiklamak yalnizca secimi degistirir.
          onClick: (olay) => {
            if (!olay.target.closest(".ant-table-selection-column")) modalAc("tanim", kayit);
          },
        })}
      />

      <SayacTanimModali acik={acikModal === "tanim"} makineId={makineId} sayacId={islemKaydi?.TB_SAYAC_ID ?? null} onKapat={modaliKapat} onKaydedildi={veriyiYenile} />
      <OnayModali
        acik={acikModal === "sil"}
        baslik={t("ekipmanKarti.silOnayBaslik")}
        mesaj={seciliKayitlar.length > 1 ? t("ekipmanKarti.sayac.silOnayMesajCoklu", { sayi: seciliKayitlar.length }) : t("ekipmanKarti.silOnayMesaj")}
        onayMetni={t("ekipmanKarti.sil")}
        tehlikeli
        yukleniyor={siliniyor}
        onOnay={sil}
        onKapat={modaliKapat}
      />
      <SayacHareketleriModali acik={acikModal === "hareketler"} sayac={islemSayaci} onKapat={modaliKapat} />
      <SayacOkumaModali
        acik={acikModal === "okuma"}
        makineId={makineId}
        lokasyonId={getValues("lokasyonID")}
        sayac={islemSayaci}
        onKapat={modaliKapat}
        onKaydedildi={veriyiYenile}
      />
      <SayacSifirlamaModali acik={acikModal === "sifirlama"} sayac={islemSayaci} onKapat={modaliKapat} onKaydedildi={veriyiYenile} />
      <ListeOzellikleriModali
        acik={acikModal === "listeOzellikleri"}
        kolonlar={ozellikKolonlari}
        gizliAnahtarlar={gizliAnahtarlar}
        onDegistir={gizliAnahtarlariDegistir}
        onKapat={modaliKapat}
      />
    </div>
  );
}

Sayaclar.propTypes = {
  makineId: PropTypes.number.isRequired,
  veri: PropTypes.shape({
    kayitlar: PropTypes.arrayOf(PropTypes.object).isRequired,
    yukleniyor: PropTypes.bool.isRequired,
    yenile: PropTypes.func.isRequired,
  }).isRequired,
  aktif: PropTypes.bool,
  onVeriDegisti: PropTypes.func.isRequired,
};
