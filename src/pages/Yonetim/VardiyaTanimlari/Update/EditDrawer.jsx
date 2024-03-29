import tr_TR from "antd/es/locale/tr_TR";
import { PlusOutlined } from "@ant-design/icons";
import { Button, Drawer, Space, ConfigProvider, Modal, message } from "antd";
import React, { useEffect, useState, useTransition } from "react";
import MainTabs from "./components/MainTabs/MainTabs";
import { useForm, Controller, useFormContext, FormProvider, set } from "react-hook-form";
import dayjs from "dayjs";
import AxiosInstance from "../../../../api/http";
import Footer from "../Footer";
// import SecondTabs from "./components/SecondTabs/SecondTabs";

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
      vardiyaTanimi: "",
      secilenVardiyaID: "",
      vardiyaBaslangicSaati: dayjs("08:00", "HH:mm"),
      vardiyaBitisSaati: dayjs("18:00", "HH:mm"),
      vardiyaTipi: null,
      vardiyaTipiID: "",
      lokasyonTanim: "",
      lokasyonID: "",
      vardiyaProjeTanim: "",
      vardiyaProjeID: "",
      varsayilanVardiya: false,
      gosterimRengi: "#ffae00",
      vardiyaAciklama: "",
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
      TB_VARDIYA_ID: data.secilenVardiyaID,
      VAR_TANIM: data.vardiyaTanimi,
      VAR_VARDIYA_TIPI_KOD_ID: data.vardiyaTipiID,
      VAR_LOKASYON_ID: data.lokasyonID,
      VAR_PROJE_ID: data.vardiyaProjeID,
      VAR_VARSAYILAN: data.varsayilanVardiya,
      // VAR_RENK: data.gosterimRengi,
      VAR_ACIKLAMA: data.vardiyaAciklama,
      VAR_BASLAMA_SAATI: formatTimeWithDayjs(data.vardiyaBaslangicSaati),
      VAR_BITIS_SAATI: formatTimeWithDayjs(data.vardiyaBitisSaati),

      // add more fields as needed
    };

    // AxiosInstance.post("/api/endpoint", { Body }).then((response) => {
    // handle response
    // });

    AxiosInstance.post("UpdateVardiya", Body)
      .then((response) => {
        // Handle successful response here, e.g.:
        console.log("Data sent successfully:", response);
        if (response.status_code === 200 || response.status_code === 201) {
          message.success("Ekleme Başarılı.");
          onDrawerClose(); // Close the drawer
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
    console.log({ Body });
  };

  useEffect(() => {
    if (drawerVisible && selectedRow) {
      // console.log("selectedRow", selectedRow);
      // startTransition(() => {
      // Object.keys(selectedRow).forEach((key) => {
      //   console.log(key, selectedRow[key]);
      //   setValue(key, selectedRow[key]);
      setValue("secilenVardiyaID", selectedRow.key);
      setValue("vardiyaTanimi", selectedRow.VAR_TANIM);
      setValue("vardiyaBaslangicSaati", dayjs(`1970-01-01T${selectedRow.VAR_BASLAMA_SAATI}`));
      setValue("vardiyaBitisSaati", dayjs(`1970-01-01T${selectedRow.VAR_BITIS_SAATI}`));
      setValue("vardiyaTipi", selectedRow.VAR_VARDIYA_TIPI);
      setValue("vardiyaTipiID", selectedRow.VAR_VARDIYA_TIPI_KOD_ID);
      setValue("lokasyonTanim", selectedRow.VAR_LOKASYON);
      setValue("lokasyonID", selectedRow.VAR_LOKASYON_ID);
      setValue("vardiyaProjeTanim", selectedRow.VAR_PROJE);
      setValue("vardiyaProjeID", selectedRow.VAR_PROJE_ID);
      setValue("varsayilanVardiya", selectedRow.VAR_VARSAYILAN);
      setValue("gosterimRengi", selectedRow.VAR_RENK);
      setValue("vardiyaAciklama", selectedRow.VAR_ACIKLAMA);
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
            width="550px"
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
            <MainTabs />
            {/* <SecondTabs /> */}
            <Footer />
          </Drawer>
        </ConfigProvider>
      </form>
    </FormProvider>
  );
}
