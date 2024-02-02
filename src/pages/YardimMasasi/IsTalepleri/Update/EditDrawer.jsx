import React, { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { Button, Drawer, Space, ConfigProvider, Modal, Spin } from "antd";
import tr_TR from "antd/es/locale/tr_TR";
import AxiosInstance from "../../../../api/http";
import dayjs from "dayjs";
import MainTabs from "./components/MainTabs/MainTabs";
import Footer from "./components/Footer";
import SecondTabs from "./components/SecondTabs/SecondTabs";

export default function EditDrawer({ selectedRow, onDrawerClose, drawerVisible, onRefresh }) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(drawerVisible);

  const methods = useForm({
    defaultValues: {
      talepKodu: "",
      secilenTalepID: "",
      talepTarihi: "",
      talepSaati: "",
      kapanmaTarihi: "",
      kapanmaSaati: "",
      talepteBulunan: "",
      talepteBulunanID: "",
      lokasyonTanim: "",
      lokasyonID: "",
      departman: null,
      departmanID: "",
      irtibatTelefonu: "",
      email: "",
      iletisimSekli: null,
      iletisimSekliID: "",
      talepTipi: null,
      talepTipiID: "",
      isKategorisi: null,
      isKategorisiID: "",
      servisNedeni: null,
      servisNedeniID: "",
      atolye: "",
      oncelikTanim: "",
      oncelikID: "",
      bildirilenBina: null,
      bildirilenBinaID: "",
      bildirilenKat: null,
      bildirilenKatID: "",
      ilgiliKisi: "",
      ilgiliKisiID: "",
      konu: "",
      aciklama: "",
      makine: "",
      makineID: "",
      makineTanim: "",
      ekipman: "",
      ekipmanID: "",
      ekipmanTanim: "",
      makineDurumu: null,
      makineDurumuID: "",
      // ... Tüm default değerleriniz
    },
  });

  const { setValue, reset } = methods;

  // aşağıdaki useEffect verileri form elemanlarına set etmeden önce durum güncellemesi yapıyor ondan sonra verileri set ediyor

  useEffect(() => {
    const handleDataFetchAndUpdate = async () => {
      if (drawerVisible && selectedRow) {
        let shouldFetchData = true;

        // Eğer IST_DURUM_ID 0 ise, önce durumu güncelle
        if (selectedRow.IST_DURUM_ID === 0) {
          try {
            await AxiosInstance.post("UpdateIsTalep", {
              TB_IS_TALEP_ID: selectedRow.key,
              IST_DURUM_ID: 1, // IST_DURUM_ID'yi 1 yaparak güncelleme yap
            });
            console.log("Durum başarıyla güncellendi");
            onRefresh();
            methods.reset();
          } catch (error) {
            console.error("Durum güncellenirken hata oluştu:", error);
            shouldFetchData = false; // Hata oluşursa, veri çekme işlemine geçme
          }
        }

        // Durum güncellemesi başarılıysa veya IST_DURUM_ID zaten 0 değilse, veri çekme işlemine geç
        if (shouldFetchData) {
          setLoading(true); // Yükleme başladığında
          try {
            const response = await AxiosInstance.get(`GetIsTalepById?isTalepId=${selectedRow.key}`);
            const data = response;
            const item = data[0]; // Veri dizisinin ilk elemanını al

            // Form alanlarını set et
            setValue("secilenTalepID", item.TB_IS_TALEP_ID);
            setValue("talepKodu", item.IST_KOD);
            setValue("talepTarihi", dayjs(item.IST_ACILIS_TARIHI));
            setValue("talepSaati", dayjs(item.IST_ACILIS_SAATI));
            setValue("kapanmaTarihi", dayjs(item.IST_KAPANMA_TARIHI));
            setValue("kapanmaSaati", dayjs(item.IST_KAPANMA_SAATI));
            setValue("talepteBulunan", item.IST_TALEP_EDEN_ADI);
            setValue("secilenTalepID", item.TB_IS_TALEP_ID);
            setValue("lokasyonTanim", item.IST_BILDIREN_LOKASYON);
            setValue("lokasyonID", item.IST_BILDIREN_LOKASYON_ID);
            setValue("departman", item.IST_DEPARTMAN_ADI); // bu alan adi api'de yok
            setValue("departmanID", item.IST_DEPARTMAN_ID);
            setValue("irtibatTelefonu", item.IST_IRTIBAT_TELEFON);
            setValue("email", item.IST_MAIL_ADRES);
            setValue("iletisimSekli", item.IST_IRTIBAT);
            setValue("iletisimSekliID", item.IST_IRTIBAT_KOD_KOD_ID);
            setValue("talepTipi", item.IST_TIP_TANIM);
            setValue("talepTipiID", item.IST_TIP_KOD_ID);
            setValue("isKategorisi", item.IST_KATEGORI_TANIMI);
            setValue("isKategorisiID", item.IST_KOTEGORI_KODI_ID);
            setValue("servisNedeni", item.IST_SERVIS_NEDENI);
            setValue("servisNedeniID", item.IST_SERVIS_NEDENI_KOD_ID);
            setValue("atolye", item.IST_ATOLYE_GRUBU_TANIMI);
            setValue("oncelikTanim", item.IST_ONCELIK);
            setValue("oncelikID", item.IST_ONCELIK_ID);
            setValue("bildirilenBina", item.IST_BINA);
            setValue("bildirilenBinaID", item.IST_BILDIRILEN_BINA);
            setValue("bildirilenKat", item.IST_KAT);
            setValue("bildirilenKatID", item.IST_BILDIRILEN_KAT);
            setValue("ilgiliKisi", item.IST_TAKIP_EDEN_ADI);
            setValue("ilgiliKisiID", item.IST_IS_TAKIPCISI_ID);
            // ... Diğer setValue çağrıları

            setLoading(false); // Yükleme tamamlandığında
            setOpen(true); // İşlemler tamamlandıktan sonra drawer'ı aç
          } catch (error) {
            console.error("Veri çekilirken hata oluştu:", error);
            setLoading(false); // Hata oluştuğunda
          }
        }
      }
    };

    handleDataFetchAndUpdate();
  }, [drawerVisible, selectedRow, setValue, onRefresh, methods.reset]);

  const formatDateWithDayjs = (dateString) => {
    const formattedDate = dayjs(dateString);
    return formattedDate.isValid() ? formattedDate.format("YYYY-MM-DD") : "";
  };

  const formatTimeWithDayjs = (timeObj) => {
    const formattedTime = dayjs(timeObj);
    return formattedTime.isValid() ? formattedTime.format("HH:mm:ss") : "";
  };

  const onSubmit = (data) => {
    // Form verilerini API'nin beklediği formata dönüştür
    const Body = {
      IST_KOD: data.talepKodu,
      IST_ACILIS_TARIHI: formatDateWithDayjs(data.talepTarihi),
      IST_ACILIS_SAATI: formatTimeWithDayjs(data.talepSaati),
      IST_TALEP_EDEN_ID: data.talepteBulunanID,
      IST_BILDIREN_LOKASYON_ID: data.lokasyonID,
      IST_DEPARTMAN_ID: data.departmanID,
      IST_IRTIBAT_TELEFON: data.irtibatTelefonu,
      IST_MAIL_ADRES: data.email,
      IST_IRTIBAT_KOD_KOD_ID: data.iletisimSekliID,
      IST_TIP_KOD_ID: data.talepTipiID,
      IST_KOTEGORI_KODI_ID: data.isKategorisiID,
      IST_SERVIS_NEDENI_KOD_ID: data.servisNedeniID,
      IST_ONCELIK_ID: data.oncelikID,
      IST_BILDIRILEN_BINA: data.bildirilenBinaID,
      IST_BILDIRILEN_KAT: data.bildirilenKatID,
      IST_IS_TAKIPCISI_ID: data.ilgiliKisiID,
      IST_TANIMI: data.konu,
      IST_ACIKLAMA: data.aciklama,
      IST_MAKINE_ID: data.makineID,
      IST_EKIPMAN_ID: data.ekipmanID,
      IST_MAKINE_DURUM_KOD_ID: data.makineDurumuID,
      // Diğer alanlarınız...
    };

    // API'ye POST isteği gönder
    AxiosInstance.post("UpdateIsTalep", Body)
      .then((response) => {
        console.log("Data sent successfully:", response);
        setOpen(false);
        onRefresh();
        methods.reset();
      })
      .catch((error) => {
        console.error("Error sending data:", error);
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

  return (
    <FormProvider {...methods}>
      <ConfigProvider locale={tr_TR}>
        <Drawer
          width="1460px"
          title="İş Talebi Güncelle"
          placement="right"
          onClose={onClose}
          open={open}
          extra={
            <Space>
              <Button onClick={onClose}>İptal</Button>
              <Button
                type="submit"
                onClick={methods.handleSubmit(onSubmit)}
                style={{ backgroundColor: "#2bc770", borderColor: "#2bc770", color: "#ffffff" }}>
                Güncelle
              </Button>
            </Space>
          }>
          {loading ? (
            <Spin
              spinning={loading}
              size="large"
              style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
              {/* İçerik yüklenirken gösterilecek alan */}
            </Spin>
          ) : (
            <form onSubmit={methods.handleSubmit(onSubmit)}>
              <MainTabs />
              <SecondTabs />
              <Footer />
            </form>
          )}
        </Drawer>
      </ConfigProvider>
    </FormProvider>
  );
}
