import tr_TR from "antd/es/locale/tr_TR";
import enUS from "antd/es/locale/en_US";
import ruRU from "antd/es/locale/ru_RU";
import azAZ from "antd/es/locale/az_AZ";
import { Button, Drawer, Space, ConfigProvider, Modal, message, Spin } from "antd";
import React, { useEffect, useState, useTransition } from "react";
import MainTabs from "./components/MainTabs/MainTabs.jsx";
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
      // --- MainTabs Bileşeni İsimlendirmeleri İle Birebir Eşitlendi ---
      PIZ_PERSONEL_ID: null,
      PersonelAd: null,
      PersonelKod: null,
      DepartmanTanim: null,
      PIZ_IZIN_TANIM_ID: null,
      PIZ_BASLAMA_TARIHI: null,
      PIZ_BITIS_TARIHI: null,
      PIZ_ISE_BASLAMA_TARIHI: null,
      PIZ_SURE: null,
      PIZ_ACIKLAMA: null,
      PIZ_LOKASYON_ID: null,
      LokasyonTanim: null,
      PIZ_PROJE_ID: null,
      ProjeTanim: null,
      ONCEKI_IZIN_TARIHI: null,
      ONCEKI_IZIN_NEDENI: null,
      ONCEKI_IZIN_SURESI: null,
    },
  });

  const { setValue, reset, handleSubmit } = methods;

  // --- VERİ ÇEKME İŞLEMİ (GET) ---
  useEffect(() => {
  const handleDataFetchAndUpdate = async () => {
    if (drawerVisible && selectedRow) {
      const kayitId = selectedRow.key || selectedRow.TB_PERSONEL_IZIN_ID || selectedRow.IzinId; 
      if (!kayitId) return;

      setLoading(true);
      try {
        const response = await AxiosInstance.get(`GetPersonelIzinById?id=${kayitId}`);
        
        if (response && response.has_error === false && response.data) {
          const item = response.data; 

          // 1. Standart Form State ve Sayısal ID Atamaları
          setValue("PIZ_PERSONEL_ID", item.PIZ_PERSONEL_ID);
          setValue("PIZ_IZIN_TANIM_ID", item.PIZ_IZIN_TANIM_ID);
          setValue("PIZ_BASLAMA_TARIHI", item.PIZ_BASLAMA_TARIHI);
          setValue("PIZ_BITIS_TARIHI", item.PIZ_BITIS_TARIHI);
          setValue("PIZ_SURE", item.PIZ_SURE);
          setValue("PIZ_ACIKLAMA", item.PIZ_ACIKLAMA);
          setValue("PIZ_LOKASYON_ID", item.PIZ_LOKASYON_ID);
          setValue("PIZ_PROJE_ID", item.PIZ_PROJE_ID);

          // 2. PERSONEL SEÇİMİ (Kritik Nokta)
          // PersonelTablo component'i name1="PIZ_PERSONEL_" prop'u yüzünden 
          // direkt bu ismi input fieldName olarak kullanıyor:
          setValue("PIZ_PERSONEL_", item.PersonelAd); 

          // 3. LOKASYON SEÇİMİ (Zaten çalışıyordu)
          setValue("LOKASYON", item.LokasyonTanim); 

          // 4. PROJE SEÇİMİ (Kritik Nokta)
          // ProjeTablo component'i name1="PIZ_PROJE" prop'u yüzünden 
          // direkt bu ismi input fieldName olarak kullanıyor:
          setValue("PIZ_PROJE", item.ProjeTanim);

          // 5. Formda İhtiyaç Duyulabilecek Diğer Yan Değerler (Disabled alanlar vs.)
          setValue("PersonelAd", item.PersonelAd);
          setValue("PersonelKod", item.PersonelKod);
          setValue("DepartmanTanim", item.DepartmanTanim);
          setValue("LokasyonTanim", item.LokasyonTanim);
          setValue("ProjeTanim", item.ProjeTanim);

          // 6. Önceki İzin Geçmişi Bilgileri
          setValue("ONCEKI_IZIN_TARIHI", item.ONCEKI_IZIN_TARIHI || "");
          setValue("ONCEKI_IZIN_NEDENI", item.ONCEKI_IZIN_NEDENI || "");
          setValue("ONCEKI_IZIN_SURESI", item.ONCEKI_IZIN_SURESI || "");
        } else {
          message.error("İzin detayları yüklenemedi.");
        }
        setLoading(false);
      } catch (error) {
        console.error("Veri çekilirken hata oluştu:", error);
        message.error("Veri çekilirken bir hata oluştu.");
        setLoading(false);
      }
    }
  };

  handleDataFetchAndUpdate();
}, [drawerVisible, selectedRow, setValue]);

  // --- KAYDETME İŞLEMİ (POST) ---
  const onSubmit = (formData) => {
    const kayitId = selectedRow?.key || selectedRow?.TB_PERSONEL_IZIN_ID || selectedRow?.IzinId || 0;

    // Gönderilen veriler form objesinden çekiliyor (formData)
    const Body = {
      TB_PERSONEL_IZIN_ID: Number(kayitId),
      PIZ_PERSONEL_ID: formData.PIZ_PERSONEL_ID ? Number(formData.PIZ_PERSONEL_ID) : null,
      PIZ_IZIN_TANIM_ID: formData.PIZ_IZIN_TANIM_ID ? Number(formData.PIZ_IZIN_TANIM_ID) : null,
      PIZ_BASLAMA_TARIHI: formData.PIZ_BASLAMA_TARIHI ? formData.PIZ_BASLAMA_TARIHI.substring(0, 10) : null,
      PIZ_BITIS_TARIHI: formData.PIZ_BITIS_TARIHI ? formData.PIZ_BITIS_TARIHI.substring(0, 10) : null,
      PIZ_SURE: Number(formData.PIZ_SURE) || 0,
      PIZ_ACIKLAMA: formData.PIZ_ACIKLAMA,
      PIZ_LOKASYON_ID: formData.PIZ_LOKASYON_ID ? Number(formData.PIZ_LOKASYON_ID) : null,
      PIZ_PROJE_ID: formData.PIZ_PROJE_ID ? Number(formData.PIZ_PROJE_ID) : null
    };

    AxiosInstance.post("AddUpdatePersonelIzin", Body)
      .then((response) => {
        if (response && response.has_error === false) {
          message.success(response.status || "İşlem Başarılı.");
          onDrawerClose();
          onRefresh();
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
        onClick={handleSubmit(onSubmit)}
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
          width="1000px"
          title={t("İzin Güncelleme")}
          onClose={onClose}
          open={drawerVisible}
          extra={extraButton}
        >
          <Spin spinning={loading}>
            {/* Form submit tetikleyicisi düzeltildi */}
            <form onSubmit={handleSubmit(onSubmit)}>
              <MainTabs />
              <Tablar modalOpen={drawerVisible} />
            </form>
          </Spin>
        </Drawer>
      </ConfigProvider>
    </FormProvider>
  );
}