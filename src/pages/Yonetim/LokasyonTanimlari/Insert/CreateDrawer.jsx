import tr_TR from "antd/es/locale/tr_TR";
import { PlusOutlined } from "@ant-design/icons";
import { Button, Drawer, Space, ConfigProvider, Modal } from "antd";
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
      anaLokasyonTanim: "",
      anaLokasyonID: 0,
      selectedLokasyonId: "",
      lokasyonTanimi: "",
      lokasyonAktif: true,
      lokasyonTipi: "",
      lokasyonTipiID: "",
      lokasyonBina: null,
      lokasyonMasrafMerkezi: "",
      LokasyonMasrafMerkeziID: "",
      lokasyonKat: null,
      lokasyonKatID: "",
      lokasyonYoneticiTanim: "",
      lokasyonYoneticiID: "",
      lokasyonDepoTanim: "",
      lokasyonDepoID: "",
      lokasyonEmail: "",
      lokasyonAciklama: "",
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
      LOK_TANIM: data.lokasyonTanimi,
      LOK_ANA_LOKASYON_ID: data.anaLokasyonID,
      LOK_TIP_ID: data.lokasyonTipiID,
      LOK_MASRAF_MERKEZ_KOD_ID: data.LokasyonMasrafMerkeziID,
      LOK_PERSONEL_ID: data.lokasyonYoneticiID,
      LOK_EMAIL: data.lokasyonEmail,
      LOK_ACIKLAMA: data.lokasyonAciklama,
      LOK_BINA_KOD_ID: data.lokasyonBina,
      LOK_KAT_KOD_ID: data.lokasyonKatID,
      LOK_AKTIF: data.lokasyonAktif,
      LOK_MALZEME_DEPO_ID: data.lokasyonDepoID,
      LOK_OLUSTURAN_ID: 24,
      // add more fields as needed
    };

    // AxiosInstance.post("/api/endpoint", { Body }).then((response) => {
    // handle response
    // });

    AxiosInstance.post("addLokasyon", Body)
      .then((response) => {
        // Handle successful response here, e.g.:
        console.log("Data sent successfully:", response);
        setOpen(false);
        onRefresh();
        reset();
      })
      .catch((error) => {
        // Handle errors here, e.g.:
        console.error("Error sending data:", error);
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
            }}>
            <PlusOutlined />
            Ekle
          </Button>
          <Drawer
            width="950px"
            title="Yeni Kayıt Ekle"
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
                  }}>
                  Kaydet
                </Button>
              </Space>
            }>
            <MainTabs />
            {/* <SecondTabs /> */}
            <Footer />
          </Drawer>
        </ConfigProvider>
      </form>
    </FormProvider>
  );
}
