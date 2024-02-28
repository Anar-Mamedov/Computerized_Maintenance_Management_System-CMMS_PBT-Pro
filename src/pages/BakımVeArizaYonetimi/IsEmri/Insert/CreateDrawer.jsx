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
      AxiosInstance.get("ModulKoduGetir?modulKodu=ISM_ISEMRI_NO") // Replace with your actual API endpoint
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

  const { setValue, reset, watch } = methods;

  // iş emri tipine göre zorunlu alanları belirleme

  // iş emri tipi selectboxundaki seçeneklere göre zorunlu alanları belirleme

  const selectedOption = watch("selectedOption"); // `selectedOption` form alanını izle

  useEffect(() => {
    if (selectedOption) {
      // `selectedOption` içindeki değerleri `fieldRequirements` durumuna aktar
      setValue("prosedurTab", selectedOption.IMT_CAGRILACAK_PROSEDUR);
      setFieldRequirements({
        lokasyonTanim: selectedOption.IMT_LOKASYON,
        makine: selectedOption.IMT_MAKINE,
        ekipman: selectedOption.IMT_EKIPMAN,
        makineDurumu: selectedOption.IMT_MAKINE_DURUM,
        sayac: selectedOption.IMT_SAYAC_DEGERI,
        prosedur: selectedOption.IMT_PROSEDUR,
        prosedurTipi: selectedOption.IMT_IS_TIP,
        prosedurNedeni: selectedOption.IMT_IS_NEDEN,
        konu: selectedOption.IMT_KONU,
        oncelikTanim: selectedOption.IMT_ONCELIK,
        atolyeTanim: selectedOption.IMT_ATOLYE,
        takvimTanim: selectedOption.IMT_TAKVIM,
        talimatTanim: selectedOption.IMT_TALIMAT,
        // Diğer alanlar...
      });
    }
  }, [selectedOption, setFieldRequirements]);

  // iş emri tipi selectboxundaki seçeneklere göre zorunlu alanları belirleme son.

  useEffect(() => {
    const handleDefaultRequirementsFetch = async () => {
      if (open) {
        try {
          const response = await AxiosInstance.get(`IsEmriTip`);
          const data = response; // API'den gelen veriyi al

          // "IMT_VARSAYILAN": true olan objeyi bul
          const defaultItem = data.find((item) => item.IMT_VARSAYILAN === true);

          if (defaultItem) {
            setValue("prosedurTab", defaultItem.IMT_CAGRILACAK_PROSEDUR);
            // Eğer varsayılan obje bulunursa, form alanlarını set et
            setFieldRequirements({
              lokasyonTanim: defaultItem.IMT_LOKASYON,
              makine: defaultItem.IMT_MAKINE,
              ekipman: defaultItem.IMT_EKIPMAN,
              makineDurumu: defaultItem.IMT_MAKINE_DURUM,
              sayac: defaultItem.IMT_SAYAC_DEGERI,
              prosedur: defaultItem.IMT_PROSEDUR,
              prosedurTipi: defaultItem.IMT_IS_TIP,
              prosedurNedeni: defaultItem.IMT_IS_NEDEN,
              konu: defaultItem.IMT_KONU,
              oncelikTanim: defaultItem.IMT_ONCELIK,
              atolyeTanim: defaultItem.IMT_ATOLYE,
              takvimTanim: defaultItem.IMT_TAKVIM,
              talimatTanim: defaultItem.IMT_TALIMAT,
              // Burada defaultItem içerisindeki diğer alanlar için de benzer şekilde atama yapılabilir
              // Örneğin:
              // irtibatTelefonu: defaultItem.ISP_IRTIBAT_TEL,
              // email: defaultItem.ISP_MAIL,
              // Not: Yukarıdaki örnekteki alan isimleri API cevabınızda mevcut değil,
              // bu yüzden gerçek alan isimlerinizi kullanmanız gerekecek.
            });
          }
        } catch (error) {
          console.error("Veri çekilirken hata oluştu:", error);
        }
      }
    };

    handleDefaultRequirementsFetch();
  }, [open, setValue, methods.reset]);

  // iş emri tipine göre zorunlu alanları belirleme son

  useEffect(() => {
    const handleDataFetchAndUpdate = async () => {
      if (open) {
        try {
          const response = await AxiosInstance.get(`IsEmriEkleVarsiylanlar`);
          const data = response.is_emri_varsayilanlar; // API cevabındaki ilgili veriye erişim
          // Veriyi işle ve form alanlarını güncelle
          data.forEach((item) => {
            switch (item.TABLO_TANIMI) {
              case "IS_EMRI_DURUM_VARSAYILAN":
                // Örneğin, sipariş durumu için
                setValue("isEmriDurum", item.TANIM);
                setValue("isEmriDurumID", item.ID);
                break;
              case "IS_EMRI_TIP_VARSAYILAN":
                // Örneğin, iş emri tipi için
                setValue("isEmriTipi", item.TANIM);
                setValue("isEmriTipiID", item.ID);
                break;
              case "SERVIS_ONCELIK":
                // Örneğin, servis önceliği için
                setValue("oncelikTanim", item.TANIM);
                setValue("oncelikID", item.ID);
                break;
              default:
                // Diğer durumlar için bir işlem yapılabilir veya loglanabilir
                console.log("Tanımsız TABLO_TANIMI:", item.TABLO_TANIMI);
            }
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
              <div>İş Emri Ekle</div>
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
            <SecondTabs fieldRequirements={fieldRequirements} />
            <Footer />
          </form>
        </Drawer>
      </ConfigProvider>
    </FormProvider>
  );
}
