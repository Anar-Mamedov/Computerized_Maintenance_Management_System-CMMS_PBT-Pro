import tr_TR from "antd/es/locale/tr_TR";
import { PlusOutlined } from "@ant-design/icons";
import { Button, Drawer, Space, ConfigProvider, Modal, message } from "antd";
import React, { useEffect, useState } from "react";
import MainTabs from "./components/MainTabs/MainTabs";
import { useForm, Controller, useFormContext, FormProvider } from "react-hook-form";
import dayjs from "dayjs";
import AxiosInstance from "../../../../api/http";
import Footer from "../Footer";
// import SecondTabs from "./components/secondTabs/secondTabs";

export default function CreateDrawer({ selectedLokasyonId, onRefresh }) {
  const [open, setOpen] = useState(false);
  const showDrawer = () => {
    setOpen(true);
  };

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
      onCancel: () => {
        // Do nothing, continue from where the user left off
      },
    });
  };

  // back-end'e gönderilecek veriler

  const handleClick = () => {
    const values = methods.getValues();
    console.log(onSubmit(values));
  };

  //* export
  const methods = useForm({
    defaultValues: {
      bakimKodu: "",
      secilenBakimID: "",
      bakimTanimi: "",
      bakimAktif: true,
      bakimTipi: null,
      bakimTipiID: "",
      bakimGrubu: null,
      bakimGrubuID: "",
      bakimNedeni: null,
      bakimNedeniID: "",
      oncelikTanim: "",
      oncelikID: "",
      talimatTanim: "",
      talimatID: "",
      atolyeTanim: "",
      atolyeID: "",
      firmaTanim: "",
      firmaID: "",
      lokasyonTanim: "",
      lokasyonID: "",
      calismaSuresi: "",
      durusSuresi: "",
      personelSayisi: "",
      otonomBakim: false,
      periyot: "",
      periyotID: "",
      periyotLabel: "",
      periyotSiklik: "",
    },
  });

  const formatDateWithDayjs = (dateString) => {
    const formattedDate = dayjs(dateString);
    return formattedDate.isValid() ? formattedDate.format("YYYY-MM-DD") : "";
  };

  const formatTimeWithDayjs = (timeObj) => {
    const formattedTime = dayjs(timeObj);
    return formattedTime.isValid() ? formattedTime.format("HH:mm:ss") : "";
  };

  const { setValue, reset } = methods;

  //* export
  const onSubmit = (data) => {
    const Body = {
      IST_KOD: data.bakimKodu,
      IST_TANIM: data.bakimTanimi,
      IST_TIP_KOD_ID: data.bakimTipiID,
      IST_GRUP_KOD_ID: data.bakimGrubuID,
      IST_NEDEN_KOD_ID: data.bakimNedeniID,
      IST_ONCELIK_ID: data.oncelikID,
      IST_TALIMAT_ID: data.talimatID,
      IST_ATOLYE_ID: data.atolyeID,
      IST_FIRMA_ID: data.firmaID,
      IST_LOKASYON_ID: data.lokasyonID,
      IST_CALISMA_SURE: data.calismaSuresi,
      IST_DURUS_SURE: data.durusSuresi,
      IST_PERSONEL_SAYI: data.personelSayisi,
      IST_OTONOM_BAKIM: data.otonomBakim,
      IST_UYARI_SIKLIGI: data.periyotSiklik,
      IST_UYARI_PERIYOT: data.periyotID,
      IST_AKTIF: data.bakimAktif,
      // add more fields as needed
    };

    // AxiosInstance.post("/api/endpoint", { Body }).then((response) => {
    // handle response
    // });

    AxiosInstance.post("AddBakim", Body)
      .then((response) => {
        // Handle successful response here, e.g.:
        console.log("Data sent successfully:", response);
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
        // Handle errors here, e.g.:
        console.error("Error sending data:", error);
        message.error("Başarısız Olundu.");
      });
    console.log({ Body });
  };

  useEffect(() => {
    // Eğer selectedLokasyonId varsa ve geçerli bir değerse, formun default değerini güncelle
    if (selectedLokasyonId !== undefined && selectedLokasyonId !== null) {
      methods.reset({
        ...methods.getValues(),
        selectedLokasyonId: selectedLokasyonId,
      });
    }
  }, [selectedLokasyonId, methods]);

  useEffect(() => {
    if (open) {
      // Çekmece açıldığında gerekli işlemi yap
      // Örneğin, MainTabs'a bir prop olarak geçir
      // setLoading(true);
      AxiosInstance.get("ModulKoduGetir?modulKodu=") // Replace with your actual API endpoint
        .then((response) => {
          // Assuming the response contains the new work order number in 'response.Tanim'
          setValue("bakimKodu", response);
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
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <ConfigProvider locale={tr_TR}>
          <Button
            type="primary"
            onClick={showDrawer}
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <PlusOutlined />
            Ekle
          </Button>
          <Drawer
            width="550px"
            title="Bakım Tanımı Ekle"
            placement={"right"}
            onClose={onClose}
            open={open}
            extra={
              <Space>
                <Button onClick={onClose}>İptal</Button>
                <Button
                  type="submit"
                  onClick={handleClick}
                  style={{
                    backgroundColor: "#2bc770",
                    borderColor: "#2bc770",
                    color: "#ffffff",
                  }}
                >
                  Kaydet
                </Button>
              </Space>
            }
          >
            <MainTabs />
            {/* <SecondTabs /> */}
            <Footer />
          </Drawer>
        </ConfigProvider>
      </form>
    </FormProvider>
  );
}
