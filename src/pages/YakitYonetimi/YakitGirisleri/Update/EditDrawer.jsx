import tr_TR from "antd/es/locale/tr_TR";
import enUS from "antd/es/locale/en_US";
import ruRU from "antd/es/locale/ru_RU";
import azAZ from "antd/es/locale/az_AZ";
import { Button, Drawer, Space, ConfigProvider, Modal, message, Spin } from "antd";
import React, { useEffect, useState, useTransition } from "react";
import { useForm, FormProvider } from "react-hook-form";
import AxiosInstance from "../../../../api/http.jsx";
import Tablar from "./components/Tablar.jsx";
import { t } from "i18next";
import { InfoCircleOutlined } from "@ant-design/icons";

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
  const [analizVisible, setAnalizVisible] = useState(false);

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
      kapasite: 0,          // KAPASITE
      mevcutMiktar: 0,      // MIKTAR
      kritikMiktar: 0,      // KRITIK_MIKTAR
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
      const kayitId = selectedRow.key || selectedRow.TB_YAKIT_HRK_ID;
      if (!kayitId) return;

      setLoading(true);
      try {
        const response = await AxiosInstance.get(`GetAracYakitById?id=${kayitId}`);
        
        // API yanıtı { has_error: false, data: { ... } } şeklinde olduğu için:
        const item = response.data.data || response.data; 

        if (item) {
          // Temel Bilgiler
          setValue("TB_YAKIT_HRK_ID", item.TB_YAKIT_HRK_ID);
          setValue("MakineId", item.MakineId);
          setValue("Tarih", item.Tarih);
          setValue("Saat", item.Saat);
          setValue("SonKm", item.SonKm);
          setValue("AlinanKm", item.AlinanKm);
          setValue("FarkKm", item.FarkKm);
          setValue("Miktar", item.Miktar);
          setValue("Fiyat", item.Fiyat);
          setValue("Tutar", item.Tutar);
          setValue("KdvTutar", item.KdvTutar);
          setValue("IndirimOran", item.IndirimOran);
          setValue("IndirimTutar", item.IndirimTutar);
          setValue("StokKullanim", item.StokKullanim);
          setValue("FullDepo", item.FullDepo);
          setValue("YakitTipId", item.YakitTipId);
          setValue("YakitTankId", item.YakitTankId);
          setValue("IstasyonKodId", item.IstasyonKodId);
          setValue("LokasyonId", item.LokasyonId);
          setValue("ProjeId", item.ProjeId);
          setValue("MasrafMerkeziId", item.MasrafMerkeziId);
          setValue("PersonelId", item.PersonelId);
          setValue("FirmaId", item.FirmaId);
          setValue("VardiyaId", item.VardiyaId);
          setValue("FaturaFisNo", item.FaturaFisNo);
          setValue("FaturaTarihi", item.FaturaTarihi);
          setValue("Aciklama", item.Aciklama);
        }
      } catch (error) {
        console.error("Veri çekilirken hata oluştu:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  handleDataFetchAndUpdate();
}, [drawerVisible, selectedRow, setValue]);

  // --- KAYDETME İŞLEMİ (POST - AddUpdateYakitTank) ---
  const onSubmit = (data) => {
    // Body'i tamamen senin JSON yapına göre kuruyoruz
    const Body = {
      TB_YAKIT_HRK_ID: Number(data.TB_YAKIT_HRK_ID) || 0,
      MakineId: Number(data.MakineId) || null,
      Tarih: data.Tarih,
      Saat: data.Saat,
      SonKm: Number(data.SonKm) || 0,
      AlinanKm: Number(data.AlinanKm) || 0,
      FarkKm: Number(data.FarkKm) || 0,
      Miktar: Number(data.Miktar) || 0,
      Fiyat: Number(data.Fiyat) || 0,
      Tutar: Number(data.Tutar) || 0,
      KdvTutar: Number(data.KdvTutar) || 0,
      IndirimOran: Number(data.IndirimOran) || 0,
      IndirimTutar: Number(data.IndirimTutar) || 0,
      StokKullanim: data.StokKullanim,
      FullDepo: data.FullDepo,
      YakitTipId: Number(data.YakitTipId) || null,
      YakitTankId: data.StokKullanim ? (Number(data.YakitTankId) || null) : null,
      IstasyonKodId: !data.StokKullanim ? (Number(data.IstasyonKodId) || null) : null,
      LokasyonId: Number(data.LokasyonId) || null,
      ProjeId: Number(data.ProjeId) || null,
      MasrafMerkeziId: Number(data.MasrafMerkeziId) || null,
      PersonelId: Number(data.PersonelId) || null,
      FirmaId: Number(data.FirmaId) || null,
      VardiyaId: Number(data.VardiyaId) || null,
      FaturaFisNo: data.FaturaFisNo,
      FaturaTarihi: data.FaturaTarihi,
      Aciklama: data.Aciklama,
    };

    // NOT: Tank güncellemiyorsan endpoint ismini "AddUpdateAracYakit" gibi bir şeyle değiştirmen gerekebilir.
    AxiosInstance.post("/AddUpdateAracYakit", Body)
      .then((response) => {
        if (response.status_code === 200 || response.status_code === 201) {
          message.success("İşlem Başarılı.");
          onDrawerClose();
          onRefresh();
        } else {
          message.error(response.status || "İşlem Başarısız.");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
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
          width="1200px"
          title={t("Yakıt Girişi Güncelleme")}
          onClose={onClose}
          open={drawerVisible}
          extra={extraButton}
        >
          <Spin spinning={loading}>
            <form onSubmit={methods.handleSubmit(onSubmit)}>
              <Tablar selectedRowID={selectedRow?.key || selectedRow?.TB_DEPO_ID} />
            </form>
          </Spin>
        </Drawer>
      </ConfigProvider>
    </FormProvider>
  );
}