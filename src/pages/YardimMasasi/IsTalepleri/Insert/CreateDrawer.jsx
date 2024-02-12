import React, { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { Button, Drawer, Space, ConfigProvider, Modal } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import tr_TR from "antd/es/locale/tr_TR";
import AxiosInstance from "../../../../api/http";
import MainTabs from "./components/MainTabs/MainTabs";
import SecondTabs from "./components/SecondTabs/SecondTabs";
import Footer from "../Footer";
import dayjs from "dayjs";

export default function CreateDrawer({ onRefresh }) {
  const [open, setOpen] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  // API'den gelen zorunluluk bilgilerini simüle eden bir örnek
  const [fieldRequirements, setFieldRequirements] = React.useState({
    // Varsayılan olarak zorunlu değil
    // Diğer alanlar için de benzer şekilde...
  });

  useEffect(() => {
    if (open) {
      // Çekmece açıldığında gerekli işlemi yap
      // Örneğin, MainTabs'a bir prop olarak geçir
      AxiosInstance.get("ModulKoduGetir?modulKodu=IST_KOD") // Replace with your actual API endpoint
        .then((response) => {
          // Assuming the response contains the new work order number in 'response.Tanim'
          setValue("talepKodu", response);
        })
        .catch((error) => {
          console.error("Error fetching new work order number:", error);
        });
    }
  }, [open]);

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
    },
  });

  const { setValue, reset } = methods;

  useEffect(() => {
    const handleDataFetchAndUpdate = async () => {
      if (open) {
        try {
          const response = await AxiosInstance.get(`IsTalepParametre`);
          const data = response;
          const item = data[0]; // Veri dizisinin ilk elemanını al

          // Form alanlarını set et
          setValue("oncelikTanim", item.ISP_ONCELIK_TEXT);
          setValue("oncelikID", item.ISP_ONCELIK_ID);
          setValue("talepTipi", item.ISP_VARSAYILAN_IS_TIPI_TEXT);
          setValue("talepTipiID", item.ISP_VARSAYILAN_IS_TIPI);
          setIsDisabled(item.ISP_DUZENLEME_TARIH_DEGISIMI);
          setFieldRequirements({
            lokasyonTanim: item.ISP_LOKASYON,
            irtibatTelefonu: item.ISP_IRTIBAT_TEL,
            email: item.ISP_MAIL,
            departman: item.ISP_DEPARTMAN,
            iletisimSekli: item.ISP_ILETISIM_SEKLI,
            talepTipi: item.ISP_BILDIRIM_TIPI,
            isKategorisi: item.ISP_IS_KATEGORI,
            servisNedeni: item.ISP_SERVIS_NEDEN,
            oncelikTanim: item.ISP_ONCELIK,
            bildirilenBina: item.ISP_BINA,
            bildirilenKat: item.ISP_KAT,
            ilgiliKisi: item.ISP_IS_TAKIPCI,
            konu: item.ISP_KONU,
            aciklama: item.ISP_ACIKLAMA,
            makine: item.ISP_MAKINE_KOD,
            ekipman: item.ISP_EKIPMAN_KOD,
            makineDurumu: item.ISP_ZOR_MAKINE_DURUM_KOD_ID,
            // Diğer alanlar için de benzer şekilde...
          });
        } catch (error) {
          console.error("Veri çekilirken hata oluştu:", error);
        }
      }
    };

    handleDataFetchAndUpdate();
  }, [open, setValue, methods.reset]);

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
      IST_DURUM_ID: 0,
      // Diğer alanlarınız...
    };

    // API'ye POST isteği gönder
    AxiosInstance.post("AddIsTalep", Body)
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

  const showDrawer = () => setOpen(true);

  const onClose = () => {
    Modal.confirm({
      title: "İptal etmek istediğinden emin misin?",
      content: "Kaydedilmemiş değişiklikler kaybolacaktır.",
      okText: "Evet",
      cancelText: "Hayır",
      onOk: () => {
        setOpen(false);
        methods.reset();
      },
    });
  };

  return (
    <FormProvider {...methods}>
      <ConfigProvider locale={tr_TR}>
        <Button type="primary" onClick={showDrawer} style={{ display: "flex", alignItems: "center" }}>
          <PlusOutlined />
          Ekle
        </Button>
        <Drawer
          width="1460px"
          title={
            <div style={{ display: "flex", gap: "30px", alignItems: "center" }}>
              <div>İş Talebi Ekle</div>
              <div
                style={{
                  color: "white",
                  backgroundColor: "blue",
                  textAlign: "center",
                  borderRadius: "10px",
                  padding: "4px 30px",
                  fontWeight: "300",
                  fontSize: "14px",
                }}>
                Açik
              </div>
            </div>
          }
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
                Kaydet
              </Button>
            </Space>
          }>
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            <MainTabs drawerOpen={open} isDisabled={isDisabled} fieldRequirements={fieldRequirements} />
            <SecondTabs />
            <Footer />
          </form>
        </Drawer>
      </ConfigProvider>
    </FormProvider>
  );
}
