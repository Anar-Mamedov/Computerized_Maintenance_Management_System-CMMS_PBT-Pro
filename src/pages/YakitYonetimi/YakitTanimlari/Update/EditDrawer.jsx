import tr_TR from "antd/es/locale/tr_TR";
import enUS from "antd/es/locale/en_US";
import ruRU from "antd/es/locale/ru_RU";
import azAZ from "antd/es/locale/az_AZ";
import { Button, Drawer, Space, ConfigProvider, Modal, message, Spin } from "antd";
import React, { useEffect, useState, useTransition } from "react";
import MainTabs from "./components/MainTabs/MainTabs";
import { useForm, FormProvider } from "react-hook-form";
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
      // Ana Stok Bilgileri
      malzemeKod: null,
      tanim: null,
      tip: null,
      tipID: null,
      birim: null,
      birimID: null,
      grup: null,
      grupID: null,
      aktif: true,
      
      // Miktar Bilgileri
      girenMiktar: null,
      cikanMiktar: null,
      stokMiktar: null,
      
      // Fiyat ve Vergi
      kdv: null,
      girisFiyatTuru: null,
      girisFiyati: null,
      cikisFiyatTuru: null,
      cikisFiyati: null,

      // Analiz ve Durum Bilgileri (Yeni Eklenenler)
      ilkAlisFiyati: null,
      sonAlisFiyati: null,
      ortalamaFiyat: null,
      enYuksekFiyat: null,
      enDusukFiyat: null,
      sonAlinanFirma: null,
      sonAlisTarihi: null,

      // Diğer (Eski koddan kalan ve API'de açıkça belirtilmeyenleri null bırakıyoruz veya koruyoruz)
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
      yedekParca: false,
      sarfMalzeme: false,
      stoksuzMalzeme: false,
      kritikMalzeme: false,
      yag: false,
      filtre: false,
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
      talepMiktar: null,
      stkDepo: null,
      stkDepoID: null,
      stkDepoLokasyon: null,
      stkDepoLokasyonID: null,
      aciklama: null,
      // Özel alanlar aynen kalabilir...
      ozelAlan1: null, ozelAlan2: null, ozelAlan3: null, ozelAlan4: null, ozelAlan5: null,
      ozelAlan6: null, ozelAlan7: null, ozelAlan8: null, ozelAlan9: null, ozelAlan10: null,
    },
  });

  const { setValue, reset, watch } = methods;

  // API'den gelen verileri form alanlarına set etme
  // API'den gelen verileri form alanlarına set etme
  useEffect(() => {
    const handleDataFetchAndUpdate = async () => {
      if (drawerVisible && selectedRow) {
        
        const kayitId = selectedRow.key || selectedRow.TB_STOK_ID;
        if (!kayitId) return;

        setLoading(true);
        try {
          const [yakitResponse, analizResponse] = await Promise.all([
            AxiosInstance.get(`GetYakitById?id=${kayitId}`),
            AxiosInstance.get(`GetYakitFiyatAnalizi?yakitId=${kayitId}`)
          ]);

          const item = yakitResponse; 
          const analiz = analizResponse; 

          // --- 1. ID'leri Set Et ---
          setValue("kod", item.STK_KOD);
          setValue("tanim", item.STK_TANIM);
          setValue("tipID", item.STK_TIP_KOD_ID);
          setValue("birimID", item.STK_BIRIM_KOD_ID);
          setValue("grupID", item.STK_GRUP_KOD_ID);

          // --- 2. METİNLERİ DE Set Et (SORUNUN ÇÖZÜMÜ BURADA) ---
          // Bu alanlar sayesinde Selectbox ID yerine Yazı gösterecek
          setValue("tip", item.STK_TIP);     // Örn: "BENZİN"
          setValue("birim", item.STK_BIRIM); // Örn: "LT"
          setValue("grup", item.STK_GRUP);   // Örn: "AKARYAKIT"

          setValue("girenMiktar", item.STK_GIREN_MIKTAR);
          setValue("cikanMiktar", item.STK_CIKAN_MIKTAR);
          setValue("stokMiktar", item.STK_MIKTAR);
          setValue("kdv", item.STK_KDV_ORAN);
          setValue("girisFiyatTuru", Number(item.STK_GIRIS_FIYAT_SEKLI));
          setValue("girisFiyati", item.STK_GIRIS_FIYAT_DEGERI);
          setValue("cikisFiyatTuru", Number(item.STK_CIKIS_FIYAT_SEKLI));
          setValue("cikisFiyati", item.STK_CIKIS_FIYAT_DEGERI);
          setValue("aktif", item.STK_AKTIF);

          if (analiz) {
            setValue("ilkAlisFiyati", analiz.IlkAlisFiyati);
            setValue("sonAlisFiyati", analiz.SonAlisFiyati);
            setValue("ortalamaFiyat", analiz.OrtalamaFiyat);
            setValue("enYuksekFiyat", analiz.EnYuksekFiyat);
            setValue("enDusukFiyat", analiz.EnDusukFiyat);
            setValue("sonAlinanFirma", analiz.SonAlinanFirma);
            setValue("sonAlisTarihi", analiz.SonAlisTarihi);
          }

          setLoading(false);
        } catch (error) {
          console.error("Veri çekilirken hata oluştu:", error);
          setLoading(false);
        }
      }
    };

    handleDataFetchAndUpdate();
  }, [drawerVisible, selectedRow, setValue, AxiosInstance]);

  const onSubmit = (data) => {

    const kayitId = selectedRow?.key || selectedRow?.TB_STOK_ID;
    // JSON formatına uygun Body
    const Body = {
      TB_STOK_ID: Number(kayitId),
      YAKIT_KOD: data.kod,
      YAKIT_TANIM: data.tanim,
      TIP_ID: Number(data.tipID) || 0,
      BIRIM_ID: Number(data.birimID) || 0,
      GRUP_ID: Number(data.grupID) || 0,
      GIRIS_FIYAT: Number(data.girisFiyati) || 0,
      CIKIS_FIYAT: Number(data.cikisFiyati) || 0,
      AKTIF: data.aktif,
    };

    // Update işlemi (CreateModal ile aynı endpoint olabilir, backend "Upsert" mantığıysa)
    AxiosInstance.post("AddUpdateYakit", Body)
      .then((response) => {
        if (response.status_code === 200 || response.status_code === 201) {
          message.success("Güncelleme Başarılı.");
          onDrawerClose();
          onRefresh();
        } else if (response.status_code === 401) {
          message.error("Bu işlemi yapmaya yetkiniz bulunmamaktadır.");
        } else {
          message.error("Güncelleme Başarısız.");
        }
      })
      .catch((error) => {
        console.error("Error sending data:", error);
        message.error("Bir hata oluştu.");
      });
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
    let storedLanguage = localStorage.getItem("i18nextLng") || "tr";
    if (storedLanguage.includes("-")) {
      storedLanguage = storedLanguage.split("-")[0];
    }
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
        <Drawer title={t("Yakıt Güncelleme")} placement="right" width="1200px" onClose={onClose} open={drawerVisible} extra={extraButton}>
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