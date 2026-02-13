import tr_TR from "antd/es/locale/tr_TR";
import enUS from "antd/es/locale/en_US";
import ruRU from "antd/es/locale/ru_RU";
import azAZ from "antd/es/locale/az_AZ";
import { Button, Drawer, Space, ConfigProvider, Modal, message, Spin } from "antd";
import React, { useEffect, useState, useTransition } from "react";
import MainTabs from "./components/MainTabs/MainTabs";
import { useForm, FormProvider } from "react-hook-form";
import AxiosInstance from "../../../../api/http.jsx";
import Tablar from "./components/Tablar.jsx";
import { t } from "i18next";

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
      // --- TANK (DEPO) BİLGİLERİ ---
      kod: null,            // DEP_KOD
      tanim: null,          // DEP_TANIM
      aktif: true,          // AKTIF
      lokasyonID: null,     // LOKASYON_ID
      lokasyonTanim: null,  // (Selectbox için text)
      yakitTipID: null,     // YAKIT_TIP_ID
      yakitTipTanim: null,  // (Selectbox için text)
      kapasite: null,       // KAPASITE
      kritikMiktar: null,   // KRITIK_MIKTAR
      kritikUyar: false,    // KRITIK_UYAR (Checkbox)
      telefon: null,        // TELEFON
      aciklama: null,       // ACIKLAMA
    },
  });

  const { setValue, reset, handleSubmit } = methods;

  // --- VERİ ÇEKME İŞLEMİ (GET) ---
  useEffect(() => {
    const handleDataFetchAndUpdate = async () => {
      if (drawerVisible && selectedRow) {
        
        // Tabloda ID kolonu hangisi ise onu alıyoruz
        const kayitId = selectedRow.key || selectedRow.TB_DEPO_ID; 
        if (!kayitId) return;

        setLoading(true);
        try {
          // NOT: Dokümanda GET endpoint yoktu, standart olarak bu isimde olduğunu varsayarak yazdım.
          // Eğer farklıysa burayı düzeltmelisin: örn. `GetYakitTankById`
          const response = await AxiosInstance.get(`GetYakitTankById?id=${kayitId}`);
          const item = response; 

          if (item) {
            setValue("kod", item.DEP_KOD);
            setValue("tanim", item.DEP_TANIM);
            setValue("aktif", item.AKTIF);
            setValue("personelID", item.SORUMLU_PERSONEL_ID);
            setValue("personelTanim", item.SORUMLU_PERSONEL_AD);
            setValue("lokasyonID", item.LOKASYON_ID);
            setValue("lokasyonTanim", item.LOKASYON_AD);
            setValue("yakitTipID", item.YAKIT_TIP_ID);
            setValue("yakitTipTanim", item.YAKIT_TIP_AD);
            setValue("kapasite", item.KAPASITE);
            setValue("mevcutMiktar", item.MEVCUT_MIKTAR);
            setValue("dolulukOrani", item.DOLULUK_ORANI);
            setValue("kritikMiktar", item.KRITIK_MIKTAR);
            setValue("kritikUyar", item.KRITIK_UYAR);
            setValue("telefon", item.TELEFON);
            setValue("fax", item.FAX);
            setValue("email", item.EMAIL);
            setValue("adres", item.ADRES);
            setValue("aciklama", item.ACIKLAMA);
          }

          setLoading(false);
        } catch (error) {
          console.error("Veri çekilirken hata oluştu:", error);
          setLoading(false);
        }
      }
    };

    handleDataFetchAndUpdate();
  }, [drawerVisible, selectedRow, setValue]);

  // --- KAYDETME İŞLEMİ (POST - AddUpdateYakitTank) ---
  const onSubmit = (data) => {
    // ID varsa Update (örneğin 18), yoksa Insert (0)
    const kayitId = selectedRow?.key || selectedRow?.TB_DEPO_ID || 0;

    // Dokümana uygun JSON Body
    const Body = {
      TB_DEPO_ID: Number(kayitId),          // 0: Yeni Kayıt, >0: Güncelleme
      DEP_KOD: data.kod,
      DEP_TANIM: data.tanim,
      AKTIF: data.aktif,                    // true/false
      LOKASYON_ID: Number(data.lokasyonID) || 0,
      YAKIT_TIP_ID: Number(data.yakitTipID) || 0,
      KAPASITE: Number(data.kapasite) || 0,
      KRITIK_MIKTAR: Number(data.kritikMiktar) || 0,
      KRITIK_UYAR: data.kritikUyar,         // true/false
      TELEFON: data.telefon,
      ACIKLAMA: data.aciklama
    };

    AxiosInstance.post("/api/AddUpdateYakitTank", Body)
      .then((response) => {
        // Backend standart dönüşü: status_code
        if (response.status_code === 200 || response.status_code === 201) {
          message.success("İşlem Başarılı.");
          onDrawerClose();
          onRefresh(); // Tabloyu yenile
        } else if (response.status_code === 401) {
          message.error("Bu işlemi yapmaya yetkiniz bulunmamaktadır.");
        } else {
          message.error(response.status || "İşlem Başarısız.");
        }
      })
      .catch((error) => {
        console.error("Error sending data:", error);
        message.error("Sunucu hatası oluştu.");
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
          <Drawer
            width="600px"
            title={t("Tank Güncelleme")}
            onClose={onClose} 
            open={drawerVisible} 
            extra={extraButton}
          >
            <form onSubmit={methods.handleSubmit(onSubmit)}>
              <MainTabs modalOpen={open} />
              <Tablar selectedRowID={selectedRow?.key || selectedRow?.TB_DEPO_ID} />
            </form>
          </Drawer>
        </ConfigProvider>
      </FormProvider>
    );
}