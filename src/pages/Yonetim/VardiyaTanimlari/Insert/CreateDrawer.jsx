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
  };

  //* export
  const methods = useForm({
    defaultValues: {
      VardiyaTanimi: "",
      BaslamaSaati: dayjs("00:00", "HH:mm"),
      BitisSaati: dayjs("00:00", "HH:mm"),
      MolaSuresi: 0,
      VardiyaTipiKodId: null,
      LokasyonId: null,
      ProjeId: null,
      Varsayilan: false,
      Renk: "#ffae00",
      Aciklama: "",
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
      TB_VARDIYA_ID: 0,
      VardiyaTanimi: data.VardiyaTanimi,
      BaslamaSaati: data.BaslamaSaati ? dayjs(data.BaslamaSaati).format("HH:mm") : "00:00",
      BitisSaati: data.BitisSaati ? dayjs(data.BitisSaati).format("HH:mm") : "00:00",
      MolaSuresi: Number(data.MolaSuresi) || 0,
      LokasyonId: Number(data.LokasyonId) || null,
      ProjeId: Number(data.ProjeId) || null,
      VardiyaTipiKodId: Number(data.VardiyaTipiKodId) || null,
      Varsayilan: Boolean(data.Varsayilan),
      Renk: typeof data.Renk === "object" && data.Renk !== null 
      ? (data.Renk.toHexString ? data.Renk.toHexString() : "#ffae00") 
      : data.Renk,
      Aciklama: data.Aciklama,
    };

    // AxiosInstance.post("/api/endpoint", { Body }).then((response) => {
    // handle response
    // });

    AxiosInstance.post("AddUpdateVardiya", Body)
      .then((response) => {
        // Handle successful response here, e.g.:
        if (response.status_code === 200 || response.status_code === 201) {
          message.success("Ekleme Başarılı.");
          setOpen(false);
          onRefresh();
          reset();
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
