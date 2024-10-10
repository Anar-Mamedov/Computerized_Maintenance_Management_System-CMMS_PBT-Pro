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
      bakimKodu: null,
      secilenBakimID: null,
      bakimTanimi: null,
      bakimAktif: true,
      bakimTipi: null,
      bakimTipiID: null,
      bakimGrubu: null,
      bakimGrubuID: null,
      bakimNedeni: null,
      bakimNedeniID: null,
      oncelikTanim: null,
      oncelikID: null,
      talimatTanim: null,
      talimatID: null,
      atolyeTanim: null,
      atolyeID: null,
      firmaTanim: null,
      firmaID: null,
      lokasyonTanim: null,
      lokasyonID: null,
      calismaSuresi: null,
      durusSuresi: null,
      personelSayisi: null,
      otonomBakim: false,
      periyot: null,
      periyotID: null,
      periyotLabel: null,
      periyotSiklik: null,
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
      PBK_KOD: data.bakimKodu,
      PBK_AKTIF: data.bakimAktif,
      PBK_TANIM: data.bakimTanimi,
      PBK_TIP_KOD_ID: Number(data.bakimTipiID),
      PBK_GRUP_KOD_ID: Number(data.bakimGrubuID),

      PBK_ONCELIK_ID: Number(data.oncelikID),
      PBK_TALIMAT_ID: Number(data.talimatID),
      PBK_ATOLYE_ID: Number(data.atolyeID),
      PBK_FIRMA_ID: Number(data.firmaID),
      PBK_LOKASYON_ID: Number(data.lokasyonID),

      PBK_CALISMA_SURE: Number(data.calismaSuresi),
      PBK_DURUS_SURE: Number(data.durusSuresi),
      PBK_PERSONEL_SAYI: Number(data.personelSayisi),

      // add more fields as needed
    };

    // AxiosInstance.post("/api/endpoint", { Body }).then((response) => {
    // handle response
    // });

    AxiosInstance.post("PBakimAdd", Body)
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
      AxiosInstance.get("ModulKoduGetir?modulKodu=PBK_KOD") // Replace with your actual API endpoint
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
          title="Periyodik Bakım Ekle"
          placement={"right"}
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
            {/* <SecondTabs /> */}
            <Footer />
          </form>
        </Drawer>
      </ConfigProvider>
    </FormProvider>
  );
}
