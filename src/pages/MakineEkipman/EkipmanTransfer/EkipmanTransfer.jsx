import React, { useCallback, useState } from "react";
import { Button, Grid, Modal, Pagination, message, theme } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import KpiKartlari from "./components/KpiKartlari";
import FiltreCubugu from "./components/FiltreCubugu";
import TransferTablosu from "./components/TransferTablosu";
import TransferFisiModali from "./components/TransferFisiModali";
import TarihceModali from "./components/TarihceModali";
import SevkiyatModali from "./components/SevkiyatModali";
import TeslimAlModali from "./components/TeslimAlModali";
import YeniTransferModali from "./components/YeniTransfer/YeniTransferModali";
import useTransferListesi from "./useTransferListesi";
import { hataMesaji, onayaGonder, onaylaTransfer, silTransfer } from "./transferService";
import { SAYFA_BOYUTLARI } from "./sabitler";
import { formatNumberWithSeparators } from "../../../utils/numberLocale";
import "./ekipmanTransfer.css";

const KAPALI_SIHIRBAZ = { acik: false, duzenlenecekId: undefined };

/** Yalnizca onay sorusu sorulan islemler (form acmaz). */
const ONAYLI_ISLEMLER = {
  onayaGonder: { baslikKey: "ekipmanTransfer.menu.onayaGonder", soruKey: "ekipmanTransfer.onay.onayaGonderSoru", basariKey: "ekipmanTransfer.mesaj.onayaGonderildi", istek: onayaGonder },
  onayla: { baslikKey: "ekipmanTransfer.menu.onayla", soruKey: "ekipmanTransfer.onay.onaylaSoru", basariKey: "ekipmanTransfer.mesaj.onaylandi", istek: onaylaTransfer },
  sil: { baslikKey: "sil", soruKey: "ekipmanTransfer.onay.silSoru", basariKey: "ekipmanTransfer.mesaj.silindi", istek: silTransfer, tehlikeli: true },
};

/** Ekipman Transferi ekrani (tasarim: Transferler, API: EquipmentTransfer/*). */
export default function EkipmanTransfer() {
  const { t, i18n } = useTranslation();
  const { token } = theme.useToken();
  const [modal, modalBaglami] = Modal.useModal();
  const liste = useTransferListesi();
  const { yenile } = liste;
  // Genis ekranda ust bolum sabit kalir, yalnizca tablo govdesi kayar; dar ekranda sayfanin tamami kayar.
  const govdeKayar = Boolean(Grid.useBreakpoint().lg);

  const [fisId, setFisId] = useState(null);
  const [tarihceId, setTarihceId] = useState(null);
  const [sevkiyatTransferi, setSevkiyatTransferi] = useState(null);
  const [teslimTransferi, setTeslimTransferi] = useState(null);
  const [sihirbaz, setSihirbaz] = useState(KAPALI_SIHIRBAZ);

  const onayliIslem = useCallback(
    (anahtar, satir) => {
      const { baslikKey, soruKey, basariKey, istek, tehlikeli } = ONAYLI_ISLEMLER[anahtar];
      modal.confirm({
        title: t(baslikKey),
        content: t(soruKey, { no: satir.transferNo }),
        okText: t("evet"),
        cancelText: t("hayir"),
        okButtonProps: { danger: tehlikeli },
        onOk: async () => {
          try {
            await istek(satir.transferId);
            message.success(t(basariKey, { no: satir.transferNo }));
            yenile();
          } catch (hata) {
            console.error(`Transfer işlemi (${anahtar}) yapılamadı:`, hata);
            message.error(hataMesaji(hata));
          }
        },
      });
    },
    [modal, t, yenile]
  );

  const islemYap = useCallback(
    (anahtar, satir) => {
      if (anahtar === "fis") setFisId(satir.transferId);
      if (anahtar === "tarihce") setTarihceId(satir.transferId);
      if (anahtar === "duzenle") setSihirbaz({ acik: true, duzenlenecekId: satir.transferId });
      if (anahtar === "sevkiyat") setSevkiyatTransferi(satir);
      if (anahtar === "teslimAl") setTeslimTransferi(satir);
      if (ONAYLI_ISLEMLER[anahtar]) onayliIslem(anahtar, satir);
    },
    [onayliIslem]
  );

  const islemTamamlandi = () => {
    setSevkiyatTransferi(null);
    setTeslimTransferi(null);
    setSihirbaz(KAPALI_SIHIRBAZ);
    yenile();
  };

  const sihirbazKapandi = (kaydedildi) => {
    setSihirbaz(KAPALI_SIHIRBAZ);
    if (kaydedildi) yenile();
  };

  return (
    <div className={`ekipman-transfer ${govdeKayar ? "ekipman-transfer--sabit" : "ekipman-transfer--kayan"}`} style={{ "--et-brand": token.colorPrimary }}>
      <div className="et-baslik">
        <h1>{t("ekipmanTransfer.baslik")}</h1>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setSihirbaz({ acik: true, duzenlenecekId: undefined })}>
          {t("ekipmanTransfer.yeniTransfer")}
        </Button>
      </div>

      <KpiKartlari kpi={liste.kpi} />
      <FiltreCubugu onUygula={liste.filtreleriUygula} />

      <div className="et-kart et-liste-karti">
        <TransferTablosu satirlar={liste.satirlar} yukleniyor={liste.yukleniyor} siralama={liste.siralama} onSirala={liste.siralamayiDegistir} onIslem={islemYap} govdeKayar={govdeKayar} />
        <div className="et-sayfalama">
          <span className="et-soluk">{t("ekipmanTransfer.toplamKayit", { sayi: formatNumberWithSeparators(liste.toplam, i18n.language) })}</span>
          <Pagination
            size="small"
            current={liste.sayfa}
            pageSize={liste.sayfaBoyutu}
            total={liste.toplam}
            showSizeChanger
            pageSizeOptions={SAYFA_BOYUTLARI}
            onChange={liste.sayfaDegistir}
          />
        </div>
      </div>

      <TransferFisiModali transferId={fisId} onKapat={() => setFisId(null)} />
      <TarihceModali transferId={tarihceId} onKapat={() => setTarihceId(null)} />
      <SevkiyatModali transfer={sevkiyatTransferi} onKapat={() => setSevkiyatTransferi(null)} onTamamlandi={islemTamamlandi} />
      <TeslimAlModali transfer={teslimTransferi} onKapat={() => setTeslimTransferi(null)} onTamamlandi={islemTamamlandi} />
      <YeniTransferModali acik={sihirbaz.acik} duzenlenecekId={sihirbaz.duzenlenecekId} onKapat={sihirbazKapandi} onTamamlandi={islemTamamlandi} />
      {modalBaglami}
    </div>
  );
}
