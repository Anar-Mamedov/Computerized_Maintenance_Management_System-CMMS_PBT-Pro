import React, { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { Button, Drawer, Space, ConfigProvider, Modal, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import tr_TR from "antd/es/locale/tr_TR";
import AxiosInstance from "../../../../api/http";
import MainTabs from "./components/MainTabs/MainTabs";
import Footer from "../Footer";

export default function CreateDrawer({ onRefresh }) {
  const [open, setOpen] = useState(false);

  const methods = useForm({
    defaultValues: {
      carKod: "",
      carTanim: "",
      carAdres: "",
      carSehir: "",
      carIlce: "",
      carTel1: "",
      carEmail: "",
      carVergiDaire: "",
      carVergiNo: "",
      carTedarikci: false,  // boolean
      carMusteri: false,    // boolean
      carNakliyeci: false,  // boolean
      carServis: false,     // boolean
      carSube: false,       // boolean
      carDiger: false,      // boolean
    },
  });

  const { setValue, reset, handleSubmit, watch } = methods;

  const onSubmit = (data) => {
  // Form verilerini API'nin beklediği formata dönüştür
    const Body = {
      CAR_KOD: data.carKod,
      CAR_TANIM: data.carTanim,
      CAR_ADRES: data.carAdres,
      CAR_SEHIR: data.carSehir,
      CAR_ILCE: data.carIlce,
      CAR_TEL1: data.carTel1,
      CAR_EMAIL: data.carEmail,
      CAR_VERGI_DAIRE: data.carVergiDaire,
      CAR_VERGI_NO: data.carVergiNo,
      CAR_TEDARIKCI: data.carTedarikci,   // boolean
      CAR_MUSTERI: data.carMusteri,       // boolean
      CAR_NAKLIYECI: data.carNakliyeci,   // boolean
      CAR_SERVIS: data.carServis,         // boolean
      CAR_SUBE: data.carSube,             // boolean
      CAR_DIGER: data.carDiger,           // boolean
    };

    // API'ye POST isteği gönder
    AxiosInstance.post("AddTedarikci", Body)
      .then((response) => {
        if (response.status_code === 200 || response.status_code === 201) {
          message.success("Ekleme Başarılı.");
          setOpen(false);
          onRefresh();
          methods.reset();
        } else if (response.status_code === 401) {
          message.error("Bu işlemi yapmaya yetkiniz bulunmamaktadır.");
        } else {
          message.error("Ekleme Başarısız.");
        }
      })
      .catch((error) => {
        console.error("Error sending data:", error);
        message.error("Başarısız Olundu.");
      });
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

  useEffect(() => {
    if (open) {
      // Çekmece açıldığında gerekli işlemi yap
      // Örneğin, MainTabs'a bir prop olarak geçir
      // setLoading(true);
      AxiosInstance.get("ModulKoduGetir?modulKodu=PRS_PERSONEL_KOD") // Replace with your actual API endpoint
        .then((response) => {
          // Assuming the response contains the new work order number in 'response.Tanim'
          setValue("", response);
          // setTimeout(() => {
          //   setLoading(false);
          // }, 100);
        })
        .catch((error) => {
          console.error("Error fetching new work order number:", error);
          if (navigator.onLine) {
            // İnternet bağlantısı var
            message.error("Hata Mesajı: " + error.message);
          } else {
            // İnternet bağlantısı yok
            message.error("Internet Bağlantısı Mevcut Değil.");
          }
        });
    }
  }, [open]);

  return (
    <FormProvider {...methods}>
      <ConfigProvider locale={tr_TR}>
        <Button type="primary" onClick={showDrawer} style={{ display: "flex", alignItems: "center" }}>
          <PlusOutlined />
          Ekle
        </Button>
        <Drawer
          width="550px"
          title="Tedarikçi Firma Tanımı"
          placement="right"
          onClose={onClose}
          open={open}
          extra={
            <Space>
              <Button onClick={onClose}>İptal</Button>
              <Button type="submit" onClick={methods.handleSubmit(onSubmit)} style={{ backgroundColor: "#2bc770", borderColor: "#2bc770", color: "#ffffff" }}>
                Kaydet
              </Button>
            </Space>
          }
        >
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            <MainTabs />
            <Footer />
          </form>
        </Drawer>
      </ConfigProvider>
    </FormProvider>
  );
}
