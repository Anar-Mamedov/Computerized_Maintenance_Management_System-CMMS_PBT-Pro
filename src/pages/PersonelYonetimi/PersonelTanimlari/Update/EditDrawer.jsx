import tr_TR from "antd/es/locale/tr_TR";
import { PlusOutlined } from "@ant-design/icons";
import { Button, Drawer, Space, ConfigProvider, Modal } from "antd";
import React, { useEffect, useState, useTransition } from "react";
import MainTabs from "./components/MainTabs/MainTabs";
import { useForm, Controller, useFormContext, FormProvider, set } from "react-hook-form";
import dayjs from "dayjs";
import AxiosInstance from "../../../../api/http";
import Footer from "./components/Footer";
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
      TB_PERSONEL_ID: data.secilenPersonelID,
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

    AxiosInstance.post("UpdateVardiya", Body)
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
      setValue("secilenPersonelID", selectedRow.key);
      setValue("personelKodu", selectedRow.PRS_PERSONEL_KOD);
      setValue("personelAktif", selectedRow.PRS_AKTIF);
      setValue("personelAdi", selectedRow.PRS_ISIM);
      setValue("personelTipi", selectedRow.PRS_TIP);
      setValue("personelTipiID", selectedRow.PRS_PERSONEL_TIP_KOD_ID);
      setValue("departman", selectedRow.PRS_DEPARTMAN);
      setValue("departmanID", selectedRow.PRS_DEPARTMAN_ID);
      setValue("atolyeTanim", selectedRow.PRS_ATOLYE);
      setValue("atolyeID", selectedRow.PRS_ATOLYE_ID);
      setValue("lokasyonTanim", selectedRow.PRS_LOKASYON);
      setValue("lokasyonID", selectedRow.PRS_LOKASYON_ID);
      setValue("unvan", selectedRow.PRS_UNVAN);
      setValue("gorevi", selectedRow.PRS_GOREV);
      setValue("goreviID", selectedRow.PRS_GOREV_KOD_ID);
      setValue("taseronTanim", selectedRow.PRS_FIRMA);
      setValue("taseronID", selectedRow.PRS_FIRMA_ID);
      setValue("idariAmiriTanim", selectedRow.PRS_IDARI_PERSONEL_YAZI);
      setValue("idariAmiriID", selectedRow.PRS_IDARI_PERSONEL_ID);
      setValue("masrafMerkeziTanim", selectedRow.PRS_MASRAF_MERKEZI);
      setValue("masrafMerkeziID", selectedRow.PRS_MASRAF_MERKEZI_ID);
      setValue("teknisyen", selectedRow.PRS_TEKNISYEN);
      setValue("operator", selectedRow.PRS_OPERATOR);
      setValue("bakim", selectedRow.PRS_BAKIM);
      setValue("santiye", selectedRow.PRS_SANTIYE);
      setValue("surucu", selectedRow.PRS_SURUCU);
      setValue("diger", selectedRow.PRS_DIGER);

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
            width="1460px"
            title="Personel Tanımını Güncelle"
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
            <SecondTabs />
            <Footer />
          </Drawer>
        </ConfigProvider>
      </form>
    </FormProvider>
  );
}
