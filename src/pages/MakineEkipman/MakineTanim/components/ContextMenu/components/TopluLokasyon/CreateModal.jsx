import React, { useCallback, useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { Button, Modal, message } from "antd";
import { useTranslation } from "react-i18next";
import AxiosInstance from "../../../../../../../api/http";
import { useForm, FormProvider } from "react-hook-form";
import MainTabs from "./MainTabs/MainTabs.jsx";
import dayjs from "dayjs";

const BOS_FORM = { tarih: null, saat: null, eskiLokasyon: "", eskiLokasyonID: null, lokasyonTanim: "", lokasyonID: "", proje: "", projeID: "", aciklama: "" };

// Yanit govdesindeki 401 (has_error + status_code 401) yetki eksigidir (EKIPMAN_TRANSFER = 1016).
const yetkisizMi = (yanit) => yanit?.status_code === 401;

/**
 * Toplu / tekli lokasyon degisimi (BULK_LOCATION_CHANGE_FRONTEND_GUIDE.md). Secili ekipmanlar `selectedRows` ile gelir.
 * Tek ekipmanda Eski Lokasyon gosterilir: once tablo satirindaki lokasyonla, ardindan Ekipman/TopluLokasyonBilgi yanitiyla
 * doldurulur; coklu secimde gizlenir (backend her ekipmanin eski lokasyonunu kendisi bulur). Kayit Ekipman/TopluLokasyonGuncelle.
 * open/onClose verilirse modal disaridan (Ekipman Listesi islem menusu) acilir ve kendi dugmesi gosterilmez.
 */
export default function CreateModal({ selectedRows = [], onRefresh, refreshTableData, open, onClose }) {
  const { t } = useTranslation();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [kaydediliyor, setKaydediliyor] = useState(false);
  const kontrollu = open !== undefined;
  const methods = useForm({ defaultValues: BOS_FORM });
  const { setValue, reset, handleSubmit, getValues } = methods;

  const makineIds = selectedRows.map((satir) => Number(satir.TB_MAKINE_ID ?? satir.key)).filter(Boolean);
  const tekSecim = makineIds.length === 1;
  const makineAnahtari = makineIds.join(",");

  const kapat = useCallback(() => {
    setIsModalVisible(false);
    onClose?.();
  }, [onClose]);

  // Pencere her acilista bugunun tarih/saatiyle ve (tek secimde) satirdaki lokasyonla kurulur; bilgi ucu yetkiyi denetler,
  // sunucu tarih/saatini ve guncel eski lokasyonu verir. Uc yanit vermezse satirdaki degerler kalir.
  const acilisiHazirla = useCallback(async () => {
    const satir = selectedRows[0];
    reset({
      ...BOS_FORM,
      tarih: dayjs(),
      saat: dayjs(),
      eskiLokasyon: tekSecim ? satir?.MKN_LOKASYON || "" : "",
      eskiLokasyonID: tekSecim ? satir?.MKN_LOKASYON_ID ?? null : null,
    });

    try {
      const yanit = await AxiosInstance.post("Ekipman/TopluLokasyonBilgi", { makineIds: makineAnahtari.split(",").map(Number) });
      if (yetkisizMi(yanit)) {
        message.error(t("topluLokasyon.yetkiYok"));
        kapat();
        return;
      }
      const bilgi = yanit?.data;
      if (!bilgi) return;
      if (bilgi.Tarih) setValue("tarih", dayjs(bilgi.Tarih));
      if (bilgi.Tarih && bilgi.Saat) setValue("saat", dayjs(`${bilgi.Tarih} ${bilgi.Saat}`));
      if (bilgi.ShowEskiLokasyon) {
        setValue("eskiLokasyon", bilgi.EskiLokasyon || getValues("eskiLokasyon"));
        setValue("eskiLokasyonID", bilgi.EskiLokasyonId ?? getValues("eskiLokasyonID"));
      }
      if (bilgi.ProjeId) {
        setValue("proje", bilgi.ProjeTanim || "");
        setValue("projeID", bilgi.ProjeId);
      }
    } catch (error) {
      console.error("Toplu lokasyon bilgisi alınamadı:", error);
    }
  }, [getValues, kapat, makineAnahtari, reset, selectedRows, setValue, t, tekSecim]);

  const onSubmited = async (data) => {
    setKaydediliyor(true);
    try {
      const yanit = await AxiosInstance.post("Ekipman/TopluLokasyonGuncelle", {
        makineIds,
        tarih: data.tarih ? dayjs(data.tarih).format("YYYY-MM-DD") : null,
        saat: data.saat ? dayjs(data.saat).format("HH:mm") : null,
        eskiLokasyonId: tekSecim ? Number(data.eskiLokasyonID) || null : null,
        yeniLokasyonId: Number(data.lokasyonID),
        nakilSekliKodId: null,
        projeId: Number(data.projeID) || null,
        aciklama: data.aciklama || "",
      });

      if (yetkisizMi(yanit)) {
        message.error(t("topluLokasyon.yetkiYok"));
      } else if (yanit && yanit.has_error === false) {
        message.success(yanit.message || t("topluLokasyon.guncellendi", { sayi: yanit.guncellenen_adet ?? makineIds.length }));
        kapat();
        (onRefresh || refreshTableData)?.();
      } else {
        message.error(yanit?.message || yanit?.error || t("hataOlustu"));
      }
    } catch (error) {
      console.error("Toplu lokasyon güncellenemedi:", error);
      message.error(error?.response?.data?.message || t("hataOlustu"));
    } finally {
      setKaydediliyor(false);
    }
  };

  const handleModalToggle = () => {
    if (kontrollu) {
      onClose?.();
      return;
    }
    if (!isModalVisible) acilisiHazirla();
    setIsModalVisible((prev) => !prev);
  };

  // Form yalnizca pencere acilirken kurulur. Ust bilesen her cizimde yeni onClose verebildigi icin hazirlama fonksiyonu
  // ref'ten cagrilir; aksi halde kullanici yazarken form sifirlanirdi.
  const acilisiHazirlaRef = useRef(acilisiHazirla);
  useEffect(() => {
    acilisiHazirlaRef.current = acilisiHazirla;
  });

  useEffect(() => {
    if (!kontrollu) return;
    setIsModalVisible(open);
    if (open) acilisiHazirlaRef.current();
  }, [kontrollu, open]);

  return (
    <FormProvider {...methods}>
      <div>
        {!kontrollu && (
          <div style={{ display: "flex", width: "100%", justifyContent: "flex-end" }}>
            <Button style={{ paddingLeft: "0px" }} type="submit" onClick={handleModalToggle}>
              Toplu Lokasyon Düzenle
            </Button>
          </div>
        )}

        <Modal
          width="800px"
          title="Toplu Lokasyon Değişimi"
          open={isModalVisible}
          confirmLoading={kaydediliyor}
          onOk={handleSubmit(onSubmited)}
          onCancel={handleModalToggle}
          destroyOnClose
        >
          <form onSubmit={handleSubmit(onSubmited)}>
            <MainTabs eskiLokasyonGoster={tekSecim} />
          </form>
        </Modal>
      </div>
    </FormProvider>
  );
}

CreateModal.propTypes = {
  /** Secili ekipman satirlari (TB_MAKINE_ID, tek secimde MKN_LOKASYON / MKN_LOKASYON_ID). */
  selectedRows: PropTypes.arrayOf(PropTypes.object),
  onRefresh: PropTypes.func,
  /** Eski ekipman tablosunun (hatirlatici modu) yenileme fonksiyonu; onRefresh yoksa kullanilir. */
  refreshTableData: PropTypes.func,
  open: PropTypes.bool,
  onClose: PropTypes.func,
};
