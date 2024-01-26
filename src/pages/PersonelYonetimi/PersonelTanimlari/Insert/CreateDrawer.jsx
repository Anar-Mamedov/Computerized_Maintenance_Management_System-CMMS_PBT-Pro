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
      // add more fields as needed
    };

    // AxiosInstance.post("/api/endpoint", { Body }).then((response) => {
    // handle response
    // });

    AxiosInstance.post("AddPersonel", Body)
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
            width="550px"
            title="Personel Tanımı Ekle"
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
