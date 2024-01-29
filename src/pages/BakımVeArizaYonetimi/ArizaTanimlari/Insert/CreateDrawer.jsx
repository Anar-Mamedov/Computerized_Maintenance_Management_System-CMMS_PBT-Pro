import React, { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { Button, Drawer, Space, ConfigProvider, Modal } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import tr_TR from "antd/es/locale/tr_TR";
import AxiosInstance from "../../../../api/http";
import MainTabs from "./components/MainTabs/MainTabs";
import Footer from "../Footer";
import dayjs from "dayjs";

export default function CreateDrawer({ onRefresh }) {
  const [open, setOpen] = useState(false);

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

  const onSubmit = (data) => {
    // Form verilerini API'nin beklediği formata dönüştür
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
      IST_UYAR: data.otonomBakim,
      IST_UYARI_SIKLIGI: data.periyotSiklik,
      // IST_UYARI_PERIYOT: data.periyotID,
      IST_AKTIF: data.bakimAktif,
      // Diğer alanlarınız...
    };

    // API'ye POST isteği gönder
    AxiosInstance.post("AddAriza", Body)
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
          width="550px"
          title="Arıza Tanımı Ekle"
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
            <MainTabs />
            <Footer />
          </form>
        </Drawer>
      </ConfigProvider>
    </FormProvider>
  );
}
