import tr_TR from "antd/es/locale/tr_TR";
import { PlusOutlined } from "@ant-design/icons";
import { Button, Drawer, Space, ConfigProvider, Modal } from "antd";
import React, { useEffect, useState, useTransition } from "react";
import MainTabs from "./components/MainTabs/MainTabs";
import secondTabs from "./components/SecondTabs/SecondTabs";
import { useForm, Controller, useFormContext, FormProvider, set } from "react-hook-form";
import dayjs from "dayjs";
import AxiosInstance from "../../../../api/http";
import Footer from "../Footer";
import SecondTabs from "./components/SecondTabs/SecondTabs";

export default function EditDrawer({ selectedRow, onDrawerClose, drawerVisible, onRefresh }) {
  const [, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const showDrawer = () => {
    setOpen(true);
  };

  const showConfirmationModal = () => {
    Modal.confirm({
      title: "İptal etmek istediğinden emin misin?",
      content: "Kaydedilmemiş değişiklikler kaybolacaktır.",
      okText: "Evet",
      cancelText: "Hayır",
      onOk: () => {
        onDrawerClose(); // Close the drawer
        onRefresh();
        reset();
      },
      onCancel: () => {
        // Do nothing, continue from where the user left off
      },
    });
  };

  const onClose = () => {
    // Kullanıcı "İptal" düğmesine tıkladığında Modal'ı göster
    showConfirmationModal();
  };

  // Drawer'ın kapatılma olayını ele al
  const handleDrawerClose = () => {
    // Kullanıcı çarpı işaretine veya dış alana tıkladığında Modal'ı göster
    showConfirmationModal();
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
      LokasyonTipi: null,
      LokasyonTipiID: "",
      lokasyonBina: null,
      LokasyonBinaID: "",
      lokasyonMasrafMerkezi: "",
      lokasyonMasrafMerkeziID: "",
      LokasyonKat: null,
      LokasyonKatID: "",
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
      TB_LOKASYON_ID: data.selectedLokasyonId,
      LOK_TANIM: data.lokasyonTanimi,
      LOK_ANA_LOKASYON_ID: data.anaLokasyonID,
      LOK_TIP_ID: data.LokasyonTipiID,
      LOK_MASRAF_MERKEZ_KOD_ID: data.lokasyonMasrafMerkeziID,
      LOK_PERSONEL_ID: data.lokasyonYoneticiID,
      LOK_EMAIL: data.lokasyonEmail,
      LOK_ACIKLAMA: data.lokasyonAciklama,
      LOK_BINA_KOD_ID: data.LokasyonBinaID,
      LOK_KAT_KOD_ID: data.LokasyonKatID,
      LOK_AKTIF: data.lokasyonAktif,
      LOK_MALZEME_DEPO_ID: data.lokasyonDepoID,
      LOK_OLUSTURAN_ID: 24,
      // add more fields as needed
    };

    // AxiosInstance.post("/api/endpoint", { Body }).then((response) => {
    // handle response
    // });

    AxiosInstance.post("UpdateLokasyon", Body)
      .then((response) => {
        // Handle successful response here, e.g.:
        console.log("Data sent successfully:", response);
        onDrawerClose(); // Close the drawer
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
    if (drawerVisible && selectedRow) {
      // console.log("selectedRow", selectedRow);
      // startTransition(() => {
      // Object.keys(selectedRow).forEach((key) => {
      //   console.log(key, selectedRow[key]);
      //   setValue(key, selectedRow[key]);
      setValue("selectedLokasyonId", selectedRow.key);
      setValue("lokasyonTanimi", selectedRow.LOK_TANIM);
      setValue("lokasyonAktif", selectedRow.LOK_AKTIF);
      setValue("LokasyonTipi", selectedRow.LOK_TIP);
      setValue("LokasyonTipiID", selectedRow.LOK_TIP_ID);
      setValue("LokasyonBina", selectedRow.LOK_BINA);
      setValue("LokasyonBinaID", selectedRow.LOK_BINA_KOD_ID);
      setValue("lokasyonMasrafMerkeziTanim", selectedRow.LOK_MASRAF_MERKEZ);
      setValue("lokasyonMasrafMerkeziID", selectedRow.LOK_MASRAF_MERKEZ_KOD_ID);
      setValue("LokasyonKat", selectedRow.LOK_KAT);
      setValue("LokasyonKatID", selectedRow.LOK_KAT_KOD_ID);
      setValue("lokasyonYoneticiTanim", selectedRow.LOK_PERSONEL);
      setValue("lokasyonYoneticiID", selectedRow.LOK_PERSONEL_ID);
      setValue("lokasyonDepoTanim", selectedRow.LOK_DEPO);
      setValue("lokasyonDepoID", selectedRow.LOK_MALZEME_DEPO_ID);
      setValue("anaLokasyonTanim", selectedRow.LOK_ANA_LOKASYON); // ? Ana lokasyonun adı lazim
      setValue("anaLokasyonID", selectedRow.LOK_ANA_LOKASYON_ID);
      setValue("lokasyonEmail", selectedRow.LOK_EMAIL);
      setValue("lokasyonAciklama", selectedRow.LOK_ACIKLAMA);

      // add more fields as needed

      // });
      // });
    }
  }, [selectedRow, setValue, drawerVisible]);

  useEffect(() => {
    if (!drawerVisible) {
      reset(); // Drawer kapandığında formu sıfırla
    }
  }, [drawerVisible, reset]);

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <ConfigProvider locale={tr_TR}>
          {/* <Button
            type="primary"
            onClick={showDrawer}
            style={{
              display: "flex",
              alignItems: "center",
            }}>
            <PlusOutlined />
            Ekle
          </Button> */}
          <Drawer
            width="950px"
            title="Kayıdı Güncelle"
            placement={"right"}
            onClose={handleDrawerClose}
            open={drawerVisible}
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
                  Güncelle
                </Button>
              </Space>
            }>
            {/* <MainTabs /> */}
            <SecondTabs />
            <Footer />
          </Drawer>
        </ConfigProvider>
      </form>
    </FormProvider>
  );
}
