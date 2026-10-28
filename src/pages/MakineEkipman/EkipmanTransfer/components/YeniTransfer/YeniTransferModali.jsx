import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Button, Modal, Spin, Steps, message } from "antd";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";
import TransferBilgileri from "./TransferBilgileri";
import EkipmanSecimi from "./EkipmanSecimi";
import TransferOzeti from "./TransferOzeti";
import useTransferDetayi, { ekipmanSatirlariniHazirla } from "../../useTransferDetayi";
import { getSiradakiTransferNo, getTransfer, hataMesaji, kaydetTransfer, onayaGonder } from "../../transferService";
import { KAYIT_TARIH_BICIMI } from "../../sabitler";
import { kirp } from "../../yardimcilar";

const BOS_FORM = { kaynakLokasyon: "", kaynakLokasyonID: null, hedefLokasyon: "", hedefLokasyonID: null, planlananTarih: null, transferNedeni: "", aciklama: "" };
const ADIMLAR = ["ekipmanTransfer.adim.bilgiler", "ekipmanTransfer.adim.ekipmanSecimi", "ekipmanTransfer.adim.ozet"];

/**
 * Yeni transfer / taslak duzenleme sihirbazi: 1) Transfer Bilgileri, 2) Ekipman Secimi (Kaydet = Create / Update, taslak),
 * 3) Ozet (Onaya Gonder = SubmitForApproval). `duzenlenecekId` verilirse taslak GetById ile doldurulur.
 * Kapanirken kayit yapildiysa `onKapat(true)` cagrilir; liste yenilenir.
 */
export default function YeniTransferModali({ acik, duzenlenecekId, onKapat, onTamamlandi }) {
  const { t } = useTranslation();
  const form = useForm({ defaultValues: BOS_FORM });
  const { getValues, handleSubmit, reset, setError, watch } = form;
  const { detay, yukleniyor } = useTransferDetayi(duzenlenecekId, acik);
  const [adim, setAdim] = useState(0);
  // Secilen ekipmanlarin backend ID'leri ve secimin yapildigi kaynak santiye.
  const [secilenIdler, setSecilenIdler] = useState([]);
  const [secimKaynagi, setSecimKaynagi] = useState(null);
  const [kayitli, setKayitli] = useState(null);
  const [kaydedildi, setKaydedildi] = useState(false);
  const [ozet, setOzet] = useState(null);
  const [siradakiNo, setSiradakiNo] = useState("");
  const [kaydediliyor, setKaydediliyor] = useState(false);
  const [gonderiliyor, setGonderiliyor] = useState(false);

  // Her acilista sihirbaz bastan kurulur; yeni kayitta sira numarasi baslik icin alinir.
  useEffect(() => {
    if (!acik) return undefined;
    reset(BOS_FORM);
    setAdim(0);
    setSecilenIdler([]);
    setSecimKaynagi(null);
    setKayitli(null);
    setKaydedildi(false);
    setOzet(null);
    setSiradakiNo("");
    if (duzenlenecekId) return undefined;

    let iptal = false;
    getSiradakiTransferNo()
      .then((yanit) => {
        if (!iptal) setSiradakiNo(yanit.transferNo || "");
      })
      .catch((hata) => console.error("Sıradaki transfer numarası alınamadı:", hata));
    return () => {
      iptal = true;
    };
  }, [acik, duzenlenecekId, reset]);

  // Taslak duzenlenirken form ve secim kayittaki degerlerle doldurulur.
  useEffect(() => {
    if (!detay) return;
    reset({
      kaynakLokasyon: detay.sourceLocationName || "",
      kaynakLokasyonID: detay.sourceLocationId ?? null,
      hedefLokasyon: detay.targetLocationName || "",
      hedefLokasyonID: detay.targetLocationId ?? null,
      planlananTarih: detay.plannedDate ? dayjs(detay.plannedDate) : null,
      transferNedeni: detay.transferReason || "",
      aciklama: detay.description || "",
    });
    setSecilenIdler(detay.equipments.map((satir) => satir.equipmentId));
    setSecimKaynagi(detay.sourceLocationId ?? null);
    setKayitli({ transferId: detay.transferId, transferNo: detay.transferNo });
  }, [detay, reset]);

  const devam = handleSubmit((degerler) => {
    const kaynak = Number(degerler.kaynakLokasyonID);
    if (kaynak === Number(degerler.hedefLokasyonID)) {
      setError("hedefLokasyon", { message: t("ekipmanTransfer.ayniSantiyeHatasi") });
      return;
    }
    // Kaynak santiye degistiyse onceki santiyeden yapilan secim gecersizdir.
    if (kaynak !== secimKaynagi) {
      setSecilenIdler([]);
      setSecimKaynagi(kaynak);
    }
    setAdim(1);
  });

  const kaydet = async () => {
    const degerler = getValues();
    setKaydediliyor(true);
    try {
      const yanit = await kaydetTransfer({
        ...(kayitli ? { transferId: kayitli.transferId } : {}),
        sourceLocationId: Number(degerler.kaynakLokasyonID),
        targetLocationId: Number(degerler.hedefLokasyonID),
        plannedDate: degerler.planlananTarih.format(KAYIT_TARIH_BICIMI),
        transferReason: kirp(degerler.transferNedeni),
        description: kirp(degerler.aciklama),
        equipmentIds: secilenIdler,
        submitForApproval: false,
      });
      const transferId = yanit.transferId ?? yanit.data?.transferId ?? kayitli?.transferId;
      // Dokumana gore ozet `data` icinde doner; donmezse fis ayrica okunur.
      const veri = yanit.data ?? (await getTransfer(transferId)).data;
      setKayitli({ transferId, transferNo: veri?.transferNo ?? yanit.transferNo });
      setKaydedildi(true);
      setOzet({ ...veri, equipments: ekipmanSatirlariniHazirla(veri?.equipments) });
      setAdim(2);
    } catch (hata) {
      console.error("Transfer kaydedilemedi:", hata);
      message.error(hataMesaji(hata));
    } finally {
      setKaydediliyor(false);
    }
  };

  const onayaGonderTiklandi = async () => {
    setGonderiliyor(true);
    try {
      await onayaGonder(kayitli.transferId);
      message.success(t("ekipmanTransfer.mesaj.onayaGonderildi", { no: kayitli.transferNo }));
      onTamamlandi();
    } catch (hata) {
      console.error("Onaya gönderilemedi:", hata);
      message.error(hataMesaji(hata));
    } finally {
      setGonderiliyor(false);
    }
  };

  const kapat = () => onKapat(kaydedildi);
  const baslikNo = kayitli?.transferNo || (adim > 0 ? siradakiNo : "");
  const mesgul = kaydediliyor || gonderiliyor;

  const altBilgi =
    adim === 0 ? (
      <div className="et-sihirbaz-alt">
        <span />
        <div className="et-dugme-grubu">
          <Button onClick={kapat}>{t("vazgec")}</Button>
          <Button type="primary" onClick={devam} disabled={yukleniyor}>
            {t("ekipmanTransfer.devamEkipmanSec")}
          </Button>
        </div>
      </div>
    ) : adim === 2 ? (
      <div className="et-sihirbaz-alt">
        <Button onClick={() => setAdim(1)} disabled={mesgul}>
          {t("ekipmanTransfer.ekipmanSecimineDon")}
        </Button>
        <div className="et-dugme-grubu">
          <Button onClick={kapat} disabled={mesgul}>
            {t("ekipmanTransfer.listeyeDon")}
          </Button>
          <Button type="primary" loading={gonderiliyor} onClick={onayaGonderTiklandi}>
            {t("ekipmanTransfer.menu.onayaGonder")}
          </Button>
        </div>
      </div>
    ) : null;

  return (
    <Modal
      open={acik}
      title={baslikNo ? t("ekipmanTransfer.transferBasligi", { no: baslikNo }) : t("ekipmanTransfer.yeniTransfer")}
      width={920}
      centered
      destroyOnClose
      maskClosable={false}
      closable={!mesgul}
      onCancel={kapat}
      footer={altBilgi}
    >
      <FormProvider {...form}>
        <Spin spinning={yukleniyor}>
          {/* Yalnizca onceki adimlara tiklanarak donulebilir; ileri gecis dugmelerle yapilir. */}
          <Steps
            className="et-adimlar"
            size="small"
            current={adim}
            onChange={(hedef) => {
              if (hedef < adim && !mesgul) setAdim(hedef);
            }}
            items={ADIMLAR.map((anahtar, index) => ({ title: t(anahtar), disabled: index > adim }))}
          />
          {adim === 0 && <TransferBilgileri />}
          {adim === 1 && (
            <EkipmanSecimi
              kaynakLokasyonID={watch("kaynakLokasyonID")}
              kaynakLokasyonAdi={watch("kaynakLokasyon")}
              secilenIdler={secilenIdler}
              onSecimDegistir={setSecilenIdler}
              onKaydet={kaydet}
              kaydediliyor={kaydediliyor}
            />
          )}
          {adim === 2 && ozet && <TransferOzeti ozet={ozet} />}
        </Spin>
      </FormProvider>
    </Modal>
  );
}

YeniTransferModali.propTypes = {
  acik: PropTypes.bool.isRequired,
  duzenlenecekId: PropTypes.number,
  onKapat: PropTypes.func.isRequired,
  onTamamlandi: PropTypes.func.isRequired,
};
