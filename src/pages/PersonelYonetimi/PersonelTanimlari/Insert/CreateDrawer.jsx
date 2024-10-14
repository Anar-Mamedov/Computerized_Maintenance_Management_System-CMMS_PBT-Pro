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
      personelKodu: "",
      secilenPersonelID: "",
      personelAktif: true,
      personelAdi: "",
      personelTipi: null,
      personelTipiID: "",
      departman: null,
      departmanID: "",
      atolyeTanim: "",
      atolyeID: "",
      lokasyonTanim: "",
      lokasyonID: "",
      unvan: "",
      gorevi: null,
      goreviID: "",
      taseronTanim: "",
      taseronID: "",
      idariAmiriTanim: "",
      idariAmiriID: "",
      masrafMerkeziTanim: "",
      masrafMerkeziID: "",
      teknisyen: "",
      operator: "",
      bakim: "",
      santiye: "",
      surucu: "",
      diger: "",
    },
  });

  const { setValue, reset, handleSubmit, watch } = methods;

  const onSubmit = (data) => {
    // Form verilerini API'nin beklediği formata dönüştür
    const Body = {
      PRS_PERSONEL_KOD: data.personelKodu,
      PRS_ISIM: data.personelAdi,
      PRS_PERSONEL_TIP_KOD_ID: data.personelTipiID,
      PRS_DEPARTMAN_ID: data.departmanID,
      PRS_LOKASYON_ID: data.lokasyonID,
      PRS_ATOLYE_ID: data.atolyeID,
      PRS_UNVAN: data.unvan,
      PRS_GOREV_KOD_ID: data.goreviID,
      PRS_FIRMA_ID: data.taseronID,
      PRS_IDARI_PERSONEL_ID: data.idariAmiriID,
      PRS_MASRAF_MERKEZI_ID: data.masrafMerkeziID,
      PRS_AKTIF: data.personelAktif,
      PRS_TEKNISYEN: data.teknisyen,
      PRS_SURUCU: data.surucu,
      PRS_OPERATOR: data.operator,
      PRS_BAKIM: data.bakim,
      PRS_DIGER: data.diger,
      PRS_SANTIYE: data.santiye,
      // Diğer alanlarınız...
    };

    // API'ye POST isteği gönder
    AxiosInstance.post("AddPersonel", Body)
      .then((response) => {
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
          setValue("personelKodu", response);
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
          title="Personel Tanımı Ekle"
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
