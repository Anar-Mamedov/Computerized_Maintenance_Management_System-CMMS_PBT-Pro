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

export default function EditModal({ selectedRow, onDrawerClose, drawerVisible, onRefresh }) {
  const [, startTransition] = useTransition();
  const [currentLocale, setCurrentLocale] = useState(tr_TR);
  const [open, setOpen] = useState(false);
  const showModal = () => {
    setOpen(true);
  };
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
    },
  });

  const { setValue, reset, watch } = methods;

  const refreshTable = watch("refreshTable");

  // API'den gelen verileri form alanlarına set etme

  useEffect(() => {
    const handleDataFetchAndUpdate = async () => {
      if (drawerVisible && selectedRow) {
        setOpen(true); // İşlemler tamamlandıktan sonra drawer'ı aç
        setLoading(true); // Yükleme başladığında
        try {
          const response = await AxiosInstance.get(`GetStokById?id=${selectedRow.key}`);
          const item = response; // Veri dizisinin ilk elemanını al
          // Form alanlarını set et
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
          // genel bilgiler
          setValue("kdvSekli", item.STK_KDV_DH);
          setValue("kdv", item.STK_KDV_ORAN);
          setValue("otv", item.STK_OTV_ORAN);
          setValue("girisFiyatTuru", Number(item.STK_GIRIS_FIYAT_SEKLI));
          setValue("cikisFiyatTuru", Number(item.STK_CIKIS_FIYAT_SEKLI));
          setValue("girisFiyati", item.STK_GIRIS_FIYAT_DEGERI);
          setValue("cikisFiyati", item.STK_CIKIS_FIYAT_DEGERI);
          // ... Diğer setValue çağrıları

          setLoading(false); // Yükleme tamamlandığında
        } catch (error) {
          console.error("Veri çekilirken hata oluştu:", error);
          setLoading(false); // Hata oluştuğunda
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
      STK_ID: selectedRow.key,
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
      STK_GARANTI_SURE: null,
      STK_GARANTI_SURE_BIRIM_ID: -1,
      STK_RAF_OMRU: null,
      STK_RAF_OMRU_BIRIM_ID: -1,
      STK_MASRAF_MERKEZI_ID: -1,
      STK_GELIR_ID: -1,
      STK_GIDER_ID: -1,
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
          setOpen(false);
          onRefresh();
          methods.reset();
          onDrawerClose();
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
        setOpen(false);
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

  return (
    <FormProvider {...methods}>
      <ConfigProvider locale={currentLocale}>
        <Modal
          width="1200px"
          centered
          title={t("malzemeGuncelleme")}
          open={drawerVisible}
          onCancel={onClose}
          footer={
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
          }
        >
          {loading ? (
            <div style={{ overflow: "auto", height: "calc(100vh - 150px)" }}>
              <Spin
                spinning={loading}
                size="large"
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {/* İçerik yüklenirken gösterilecek alan */}
              </Spin>
            </div>
          ) : (
            <form onSubmit={methods.handleSubmit(onSubmit)}>
              <div>
                <MainTabs />
                <Tablar selectedRowID={selectedRow?.key} />
              </div>
            </form>
          )}
        </Modal>
      </ConfigProvider>
    </FormProvider>
  );
}
