import React, { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { Button, Drawer, Space, ConfigProvider, Modal } from "antd";
import tr_TR from "antd/es/locale/tr_TR";
import AxiosInstance from "../../../../api/http";
import MainTabs from "./components/MainTabs/MainTabs";
import Footer from "./components/Footer";
import SecondTabs from "./components/SecondTabs/SecondTabs";

export default function EditDrawer({ selectedRow, onDrawerClose, drawerVisible, onRefresh }) {
  const [open, setOpen] = useState(drawerVisible);

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
      // ... Tüm default değerleriniz
    },
  });

  const { setValue, reset } = methods;

  useEffect(() => {
    setOpen(drawerVisible);
    if (drawerVisible && selectedRow) {
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
    }
  }, [selectedRow, setValue, drawerVisible]);

  const onSubmit = (data) => {
    // Form verilerini API'nin beklediği formata dönüştür
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
      // Diğer alanlarınız...
    };

    // API'ye POST isteği gönder
    AxiosInstance.post("UpdatePersonel", Body)
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

  const onClose = () => {
    Modal.confirm({
      title: "İptal etmek istediğinden emin misin?",
      content: "Kaydedilmemiş değişiklikler kaybolacaktır.",
      okText: "Evet",
      cancelText: "Hayır",
      onOk: () => {
        setOpen(false);
        reset();
        onDrawerClose();
      },
    });
  };

  return (
    <FormProvider {...methods}>
      <ConfigProvider locale={tr_TR}>
        <Drawer
          width="1460px"
          title="Personel Tanımını Güncelle"
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
                Güncelle
              </Button>
            </Space>
          }>
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            <MainTabs />
            <SecondTabs />
            <Footer />
          </form>
        </Drawer>
      </ConfigProvider>
    </FormProvider>
  );
}
