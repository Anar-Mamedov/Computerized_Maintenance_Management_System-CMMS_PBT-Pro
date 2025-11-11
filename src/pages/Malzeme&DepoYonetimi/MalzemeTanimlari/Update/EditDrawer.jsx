import tr_TR from "antd/es/locale/tr_TR";
import enUS from "antd/es/locale/en_US";
import ruRU from "antd/es/locale/ru_RU";
import azAZ from "antd/es/locale/az_AZ";
import { PlusOutlined } from "@ant-design/icons";
import { Button, Drawer, Space, ConfigProvider, Modal, message, Spin } from "antd";
import React, { useEffect, useState, useTransition } from "react";
import MainTabs from "./components/MainTabs/MainTabs";
import { useForm, Controller, useFormContext, FormProvider } from "react-hook-form";
import dayjs from "dayjs";
import AxiosInstance from "../../../../api/http.jsx";
import Tablar from "./components/Tablar.jsx";
import { t } from "i18next";

// Add locale mapping
const localeMap = {
  tr: tr_TR,
  en: enUS,
  ru: ruRU,
  az: azAZ,
};

export default function EditDrawer({ selectedRow, onDrawerClose, drawerVisible, onRefresh }) {
  const [, startTransition] = useTransition();
  const [currentLocale, setCurrentLocale] = useState(tr_TR);
  const [loading, setLoading] = useState(false);

  const methods = useForm({
    defaultValues: {
      malzemeKod: null,
      tanim: null,
      tip: null,
      tipID: null,
      birim: null,
      birimID: null,
      grup: null,
      grupID: null,
      lokasyonTanim: null,
      lokasyonID: null,
      ureticiKodu: null,
      sinifTanim: null,
      sinifID: null,
      MakineMarka: null,
      MakineMarkaID: null,
      MakineModel: null,
      MakineModelID: null,
      atolyeTanim: null,
      atolyeID: null,
      aktif: true,
      yedekParca: false,
      sarfMalzeme: false,
      stoksuzMalzeme: false,
      kritikMalzeme: false,
      yag: false,
      filtre: false,
      // genel bilgiler
      girisFiyatTuru: null,
      girisFiyati: null,
      cikisFiyatTuru: null,
      cikisFiyati: null,
      kdv: null,
      kdvSekli: null,
      otv: null,
      garantiDeger: null,
      garantiPeriyot: null,
      rafOmruDeger: null,
      rafOmruPeriyot: null,
      masrafMerkeziTanim: null,
      masrafMerkeziID: null,
      tehlikeliMalzeme: false,
      envanterdeGosterme: false,
      seriNumaralaiTakip: false,
      fifoUygula: false,
      minStokMiktari: null,
      maxStokMiktari: null,
      siparisMiktari: null,
      girenMiktar: null,
      cikanMiktar: null,
      stokMiktar: null,
      talepMiktar: null,
      // ozel Alanlar
      ozelAlan1: null,
      ozelAlan2: null,
      ozelAlan3: null,
      ozelAlan4: null,
      ozelAlan5: null,
      ozelAlan6: null,
      ozelAlan7: null,
      ozelAlan8: null,
      ozelAlan9: null,
      ozelAlan10: null,
      ozelAlan11: null,
      ozelAlan11ID: null,
      ozelAlan12: null,
      ozelAlan12ID: null,
      ozelAlan13: null,
      ozelAlan13ID: null,
      ozelAlan14: null,
      ozelAlan14ID: null,
      ozelAlan15: null,
      ozelAlan15ID: null,
      ozelAlan16: null,
      ozelAlan17: null,
      ozelAlan18: null,
      ozelAlan19: null,
      ozelAlan20: null,
      // Aciklama
      aciklama: null,
    },
  });

  const { setValue, reset, watch } = methods;

  const refreshTable = watch("refreshTable");

  // API'den gelen verileri form alanlarına set etme

  useEffect(() => {
    const handleDataFetchAndUpdate = async () => {
      if (drawerVisible && selectedRow) {
        setLoading(true);
        try {
          const response = await AxiosInstance.get(`GetStokById?id=${selectedRow.key}`);
          const item = response;
          setValue("malzemeKod", item.STK_KOD);
          setValue("tanim", item.STK_TANIM);
          setValue("tipID", item.STK_TIP_KOD_ID);
          setValue("tip", item.STK_TIP);
          setValue("grupID", item.STK_GRUP_KOD_ID);
          setValue("grup", item.STK_GRUP);
          setValue("lokasyonID", item.STK_LOKASYON_ID);
          setValue("lokasyonTanim", item.STK_LOKASYON);
          setValue("birimID", item.STK_BIRIM_KOD_ID);
          setValue("birim", item.STK_BIRIM);
          setValue("ureticiKodu", item.STK_URETICI_KOD);
          setValue("sinifID", item.STK_SINIF_ID);
          setValue("sinifTanim", item.STK_SINIF);
          setValue("MakineMarkaID", item.STK_MARKA_KOD_ID);
          setValue("MakineMarka", item.STK_MARKA);
          setValue("MakineModelID", item.STK_MODEL_KOD_ID);
          setValue("MakineModel", item.STK_MODEL);
          setValue("atolyeID", item.STK_ATOLYE_ID);
          setValue("atolyeTanim", item.STK_ATOLYE);
          setValue("aktif", item.STK_AKTIF);
          setValue("yedekParca", item.STK_YEDEK_PARCA);
          setValue("sarfMalzeme", item.STK_SARF_MALZEME);
          setValue("stoksuzMalzeme", item.STK_STOKSUZ_MALZEME);
          setValue("kritikMalzeme", item.STK_KRITIK_MALZEME);
          setValue("yag", item.STK_YAG);
          setValue("filtre", item.STK_FILTRE);
          setValue("kdvSekli", item.STK_KDV_DH);
          setValue("kdv", item.STK_KDV_ORAN);
          setValue("otv", item.STK_OTV_ORAN);
          setValue("girisFiyatTuru", Number(item.STK_GIRIS_FIYAT_SEKLI));
          setValue("cikisFiyatTuru", Number(item.STK_CIKIS_FIYAT_SEKLI));
          setValue("girisFiyati", item.STK_GIRIS_FIYAT_DEGERI);
          setValue("cikisFiyati", item.STK_CIKIS_FIYAT_DEGERI);
          setValue("garantiPeriyot", item.STK_GARANTI_SURE);
          setValue("garantiDeger", item.STK_GARANTI_SURE_BIRIM_ID);
          setValue("rafOmruPeriyot", item.STK_RAF_OMRU);
          setValue("rafOmruDeger", item.STK_RAF_OMRU_BIRIM_ID);
          setValue("masrafMerkeziID", item.STK_MASRAF_MERKEZI_ID);
          setValue("masrafMerkeziTanim", item.STK_MASRAF_MERKEZI); // backenden gelmiyor
          setValue("tehlikeliMalzeme", item.STK_TEHLIKELI_MALZEME);
          setValue("envanterdeGosterme", item.STK_ENVANTERDE_GOSTER);
          setValue("seriNumaralaiTakip", item.STK_SERINO_TAKIP);
          setValue("fifoUygula", item.STK_FIFO_UYGULA);
          setValue("minStokMiktari", item.STK_MIN_MIKTAR);
          setValue("maxStokMiktari", item.STK_MAX_MIKTAR);
          setValue("siparisMiktari", item.STK_SIPARIS_MIKTARI);
          setValue("girenMiktar", item.STK_GIREN_MIKTAR);
          setValue("cikanMiktar", item.STK_CIKAN_MIKTAR);
          setValue("stokMiktar", item.STK_MIKTAR);
          setValue("rezervMiktar", item.STK_REZERV_MIKTAR);
          setValue("aciklama", item.STK_ACIKLAMA);
          setValue("ozelAlan1", item.STK_OZEL_ALAN_1);
          setValue("ozelAlan2", item.STK_OZEL_ALAN_2);
          setValue("ozelAlan3", item.STK_OZEL_ALAN_3);
          setValue("ozelAlan4", item.STK_OZEL_ALAN_4);
          setValue("ozelAlan5", item.STK_OZEL_ALAN_5);
          setValue("ozelAlan6", item.STK_OZEL_ALAN_6);
          setValue("ozelAlan7", item.STK_OZEL_ALAN_7);
          setValue("ozelAlan8", item.STK_OZEL_ALAN_8);
          setValue("ozelAlan9", item.STK_OZEL_ALAN_9);
          setValue("ozelAlan10", item.STK_OZEL_ALAN_10);
          setValue("ozelAlan11ID", item.STK_OZEL_ALAN_11_KOD_ID);
          setValue("ozelAlan11", item.STK_OZEL_ALAN_11);
          setValue("ozelAlan12ID", item.STK_OZEL_ALAN_12_KOD_ID);
          setValue("ozelAlan12", item.STK_OZEL_ALAN_12);
          setValue("ozelAlan13ID", item.STK_OZEL_ALAN_13_KOD_ID);
          setValue("ozelAlan13", item.STK_OZEL_ALAN_13);
          setValue("ozelAlan14ID", item.STK_OZEL_ALAN_14_KOD_ID);
          setValue("ozelAlan14", item.STK_OZEL_ALAN_14);
          setValue("ozelAlan15ID", item.STK_OZEL_ALAN_15_KOD_ID);
          setValue("ozelAlan15", item.STK_OZEL_ALAN_15);
          setValue("ozelAlan16", item.STK_OZEL_ALAN_16);
          setValue("ozelAlan17", item.STK_OZEL_ALAN_17);
          setValue("ozelAlan18", item.STK_OZEL_ALAN_18);
          setValue("ozelAlan19", item.STK_OZEL_ALAN_19);
          setValue("ozelAlan20", item.STK_OZEL_ALAN_20);

          setLoading(false);
        } catch (error) {
          console.error("Veri çekilirken hata oluştu:", error);
          setLoading(false);
        }
      }
    };

    handleDataFetchAndUpdate();
  }, [drawerVisible, selectedRow, setValue, onRefresh, methods.reset, AxiosInstance]);

  const formatDateWithDayjs = (dateString) => {
    const formattedDate = dayjs(dateString);
    return formattedDate.isValid() ? formattedDate.format("YYYY-MM-DD") : "";
  };

  const formatTimeWithDayjs = (timeObj) => {
    const formattedTime = dayjs(timeObj);
    return formattedTime.isValid() ? formattedTime.format("HH:mm:ss") : "";
  };

  const onSubmit = (data) => {
    console.log(data.color);
    // Form verilerini API'nin beklediği formata dönüştür
    const Body = {
      TB_STOK_ID: selectedRow.key,
      STK_KOD: data.malzemeKod,
      STK_TANIM: data.tanim,
      STK_TIP_KOD_ID: data.tipID,
      STK_GRUP_KOD_ID: data.grupID,
      STK_LOKASYON_ID: data.lokasyonID,
      STK_BIRIM_KOD_ID: data.birimID,
      STK_URETICI_KOD: data.ureticiKodu,
      STK_SINIF_ID: data.sinifID,
      STK_MARKA_KOD_ID: data.MakineMarkaID,
      STK_MODEL_KOD_ID: data.MakineModelID,
      STK_ATOLYE_ID: data.atolyeID,
      STK_MODUL_NO: 1,
      STK_AKTIF: data.aktif,
      STK_YEDEK_PARCA: data.yedekParca,
      STK_SARF_MALZEME: data.sarfMalzeme,
      STK_STOKSUZ_MALZEME: data.stoksuzMalzeme,
      STK_KRITIK_MALZEME: data.kritikMalzeme,
      STK_YAG: data.yag,
      STK_FILTRE: data.filtre,
      // genel bilgiler
      STK_GIRIS_FIYAT_SEKLI: data.girisFiyatTuru,
      STK_GIRIS_FIYAT_DEGERI: data.girisFiyati,
      STK_CIKIS_FIYAT_DEGERI: data.cikisFiyati,
      STK_CIKIS_FIYAT_SEKLI: data.cikisFiyatTuru,
      STK_KDV_DH: data.kdvSekli,
      STK_KDV_ORAN: data.kdv,
      STK_OTV_ORAN: data.otv,
      STK_GARANTI_SURE: data.garantiPeriyot,
      STK_GARANTI_SURE_BIRIM_ID: data.garantiDeger,
      STK_RAF_OMRU: data.rafOmruPeriyot,
      STK_RAF_OMRU_BIRIM_ID: data.rafOmruDeger,
      STK_MASRAF_MERKEZI_ID: data.masrafMerkeziID,
      STK_GELIR_ID: -1,
      STK_GIDER_ID: -1,
      STK_TEHLIKELI_MALZEME: data.tehlikeliMalzeme,
      STK_ENVANTERDE_GOSTER: data.envanterdeGosterme,
      STK_SERINO_TAKIP: data.seriNumaralaiTakip,
      STK_FIFO_UYGULA: data.fifoUygula,
      STK_MIN_MIKTAR: data.minStokMiktari,
      STK_MAX_MIKTAR: data.maxStokMiktari,
      STK_SIPARIS_MIKTARI: data.siparisMiktari,
      STK_GIREN_MIKTAR: data.girenMiktar,
      STK_CIKAN_MIKTAR: data.cikanMiktar,
      STK_MIKTAR: data.stokMiktar,
      STK_REZERV_MIKTAR: data.rezervMiktar,
      STK_ACIKLAMA: data.aciklama,
      STK_OZEL_ALAN_1: data.ozelAlan1,
      STK_OZEL_ALAN_2: data.ozelAlan2,
      STK_OZEL_ALAN_3: data.ozelAlan3,
      STK_OZEL_ALAN_4: data.ozelAlan4,
      STK_OZEL_ALAN_5: data.ozelAlan5,
      STK_OZEL_ALAN_6: data.ozelAlan6,
      STK_OZEL_ALAN_7: data.ozelAlan7,
      STK_OZEL_ALAN_8: data.ozelAlan8,
      STK_OZEL_ALAN_9: data.ozelAlan9,
      STK_OZEL_ALAN_10: data.ozelAlan10,
      STK_OZEL_ALAN_11_KOD_ID: data.ozelAlan11ID,
      STK_OZEL_ALAN_12_KOD_ID: data.ozelAlan12ID,
      STK_OZEL_ALAN_13_KOD_ID: data.ozelAlan13ID,
      STK_OZEL_ALAN_14_KOD_ID: data.ozelAlan14ID,
      STK_OZEL_ALAN_15_KOD_ID: data.ozelAlan15ID,
      STK_OZEL_ALAN_16: data.ozelAlan16,
      STK_OZEL_ALAN_17: data.ozelAlan17,
      STK_OZEL_ALAN_18: data.ozelAlan18,
      STK_OZEL_ALAN_19: data.ozelAlan19,
      STK_OZEL_ALAN_20: data.ozelAlan20,
    };

    // API'ye POST isteği gönder
    AxiosInstance.post("UpdateStok", Body)
      .then((response) => {
        console.log("Data sent successfully:", response);
        if (response.status_code === 200 || response.status_code === 201 || response.status_code === 202) {
          const formattedDate = dayjs(response.targetDate).isValid() ? dayjs(response.targetDate).format("DD-MM-YYYY") : response.targetDate;
          if (response.targetKm !== undefined && response.targetDate !== undefined) {
            message.success(data.Plaka + " Plakalı Aracın " + " (" + data.servisTanimi + ") " + response.targetKm + " km ve " + formattedDate + " Tarihine Güncellenmiştir.");
          } else {
            message.success("Güncelleme Başarılı.");
          }
          onDrawerClose();
          onRefresh();
          methods.reset();
        } else if (response.status_code === 401) {
          message.error("Bu işlemi yapmaya yetkiniz bulunmamaktadır.");
        } else {
          message.error("Ekleme Başarısız.");
        }
      })
      .catch((error) => {
        // Handle errors here, e.g.:
        console.error("Error sending data:", error);
        if (navigator.onLine) {
          // İnternet bağlantısı var
          message.error("Hata Mesajı: " + error.message);
        } else {
          // İnternet bağlantısı yok
          message.error("Internet Bağlantısı Mevcut Değil.");
        }
      });
    console.log({ Body });
  };

  const onClose = () => {
    Modal.confirm({
      title: "İptal etmek istediğinden emin misin?",
      content: "Kaydedilmemiş değişiklikler kaybolacaktır.",
      okText: "Evet",
      cancelText: "Hayır",
      onOk: () => {
        reset();
        onDrawerClose();
      },
    });
  };

  useEffect(() => {
    // Get language from localStorage and handle hyphenated formats
    let storedLanguage = localStorage.getItem("i18nextLng") || "tr";
    if (storedLanguage.includes("-")) {
      storedLanguage = storedLanguage.split("-")[0];
    }

    // Set the appropriate locale
    setCurrentLocale(localeMap[storedLanguage] || tr_TR);
  }, []);

  const extraButton = (
    <Space>
      <Button onClick={onClose}>{t("iptal")}</Button>
      <Button
        type="submit"
        onClick={methods.handleSubmit(onSubmit)}
        style={{
          backgroundColor: "#2bc770",
          borderColor: "#2bc770",
          color: "#ffffff",
        }}
      >
        {t("guncelle")}
      </Button>
    </Space>
  );

  return (
    <FormProvider {...methods}>
      <ConfigProvider locale={currentLocale}>
        <Drawer title={t("malzemeGuncelleme")} placement="right" width="1330px" onClose={onClose} open={drawerVisible} extra={extraButton}>
          {loading ? (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
              <Spin size="large" />
            </div>
          ) : (
            <form onSubmit={methods.handleSubmit(onSubmit)}>
              <div style={{ height: "calc(100vh - 110px)", overflowY: "auto" }}>
                <MainTabs />
                <Tablar selectedRowID={selectedRow?.key} />
              </div>
            </form>
          )}
        </Drawer>
      </ConfigProvider>
    </FormProvider>
  );
}
