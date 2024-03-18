import tr_TR from "antd/es/locale/tr_TR";
import { PlusOutlined } from "@ant-design/icons";
import { Button, Drawer, Space, ConfigProvider, Modal, message } from "antd";
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
      periyotSiklik: "",
      maliyetlerMalzeme: "",
      maliyetlerIscilik: "",
      maliyetlerGenelGider: "",
      maliyetlerToplam: "",
      lojistikSuresi: "",
      seyahetSuresi: "",
      onaySuresi: "",
      beklemeSuresi: "",
      digerSuresi: "",
      ozelAlan1: "",
      ozelAlan2: "",
      ozelAlan3: "",
      ozelAlan4: "",
      ozelAlan5: "",
      ozelAlan6: null,
      ozelAlan6ID: "",
      ozelAlan7: null,
      ozelAlan7ID: "",
      ozelAlan8: null,
      ozelAlan8ID: "",
      ozelAlan9: "",
      ozelAlan10: "",
      aciklama: "",
      periyotID: "",
      periyotLabel: "",
      // add more fields as needed
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
      TB_IS_TANIM_ID: data.secilenBakimID,
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
      IST_OTONOM_BAKIM: data.otonomBakim,
      IST_UYARI_SIKLIGI: data.periyotSiklik,
      IST_UYARI_PERIYOT: data.periyot,
      IST_AKTIF: data.bakimAktif,
      IST_MALZEME_MALIYET: data.maliyetlerMalzeme,
      IST_ISCILIK_MALIYET: data.maliyetlerIscilik,
      IST_GENEL_GIDER_MALIYET: data.maliyetlerGenelGider,
      IST_TOPLAM_MALIYET: data.maliyetlerToplam,
      IST_SURE_LOJISTIK: data.lojistikSuresi,
      IST_SURE_SEYAHAT: data.seyahetSuresi,
      IST_SURE_ONAY: data.onaySuresi,
      IST_SURE_BEKLEME: data.beklemeSuresi,
      IST_SURE_DIGER: data.digerSuresi,
      IST_OZEL_ALAN_1: data.ozelAlan1,
      IST_OZEL_ALAN_2: data.ozelAlan2,
      IST_OZEL_ALAN_3: data.ozelAlan3,
      IST_OZEL_ALAN_4: data.ozelAlan4,
      IST_OZEL_ALAN_5: data.ozelAlan5,
      IST_OZEL_ALAN_6_KOD_ID: data.ozelAlan6ID,
      IST_OZEL_ALAN_7_KOD_ID: data.ozelAlan7ID,
      IST_OZEL_ALAN_8_KOD_ID: data.ozelAlan8ID,
      IST_OZEL_ALAN_9: data.ozelAlan9,
      IST_OZEL_ALAN_10: data.ozelAlan10,
      IST_ACIKLAMA: data.aciklama,
      // add more fields as needed
    };

    // AxiosInstance.post("/api/endpoint", { Body }).then((response) => {
    // handle response
    // });

    AxiosInstance.post("UpdateBakim", Body)
      .then((response) => {
        // Handle successful response here, e.g.:
        console.log("Data sent successfully:", response);
        if (response.status_code === 200 || response.status_code === 201) {
          message.success("Ekleme Başarılı.");
          onDrawerClose(); // Close the drawer
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
    if (drawerVisible && selectedRow) {
      // console.log("selectedRow", selectedRow);
      // startTransition(() => {
      // Object.keys(selectedRow).forEach((key) => {
      //   console.log(key, selectedRow[key]);
      //   setValue(key, selectedRow[key]);
      setValue("secilenBakimID", selectedRow.key);
      setValue("bakimKodu", selectedRow.IST_KOD);
      setValue("bakimTanimi", selectedRow.IST_TANIM);
      setValue("bakimAktif", selectedRow.IST_AKTIF);
      setValue("bakimTipi", selectedRow.IST_TIP);
      setValue("bakimTipiID", selectedRow.IST_TIP_KOD_ID);
      setValue("bakimGrubu", selectedRow.IST_GRUP);
      setValue("bakimGrubuID", selectedRow.IST_GRUP_KOD_ID);
      setValue("bakimNedeni", selectedRow.IST_NEDEN);
      setValue("bakimNedeniID", selectedRow.IST_NEDEN_KOD_ID);
      setValue("oncelikTanim", selectedRow.IST_ONCELIK);
      setValue("oncelikID", selectedRow.IST_ONCELIK_ID);
      setValue("talimatTanim", selectedRow.IST_TALIMAT);
      setValue("talimatID", selectedRow.IST_TALIMAT_ID);
      setValue("atolyeTanim", selectedRow.IST_ATOLYE);
      setValue("atolyeID", selectedRow.IST_ATOLYE_ID);
      setValue("firmaTanim", selectedRow.IST_FIRMA);
      setValue("firmaID", selectedRow.IST_FIRMA_ID);
      setValue("lokasyonTanim", selectedRow.IST_LOKASYON);
      setValue("lokasyonID", selectedRow.IST_LOKASYON_ID);
      setValue("calismaSuresi", selectedRow.IST_CALISMA_SURE);
      setValue("durusSuresi", selectedRow.IST_DURUS_SURE);
      setValue("personelSayisi", selectedRow.IST_PERSONEL_SAYI);
      setValue("otonomBakim", selectedRow.IST_OTONOM_BAKIM);
      setValue("periyotID", selectedRow.IST_UYARI_PERIYOT);
      setValue("periyotSiklik", selectedRow.IST_UYARI_SIKLIGI);
      setValue("maliyetlerMalzeme", selectedRow.IST_MALZEME_MALIYET);
      setValue("maliyetlerIscilik", selectedRow.IST_ISCILIK_MALIYET);
      setValue("maliyetlerGenelGider", selectedRow.IST_GENEL_GIDER_MALIYET);
      setValue("maliyetlerToplam", selectedRow.IST_TOPLAM_MALIYET);
      setValue("lojistikSuresi", selectedRow.IST_SURE_LOJISTIK);
      setValue("seyahetSuresi", selectedRow.IST_SURE_SEYAHAT);
      setValue("onaySuresi", selectedRow.IST_SURE_ONAY);
      setValue("beklemeSuresi", selectedRow.IST_SURE_BEKLEME);
      setValue("digerSuresi", selectedRow.IST_SURE_DIGER);
      setValue("ozelAlan1", selectedRow.IST_OZEL_ALAN_1);
      setValue("ozelAlan2", selectedRow.IST_OZEL_ALAN_2);
      setValue("ozelAlan3", selectedRow.IST_OZEL_ALAN_3);
      setValue("ozelAlan4", selectedRow.IST_OZEL_ALAN_4);
      setValue("ozelAlan5", selectedRow.IST_OZEL_ALAN_5);
      setValue("ozelAlan6", selectedRow.IST_OZEL_ALAN_6);
      setValue("ozelAlan6ID", selectedRow.IST_OZEL_ALAN_6_KOD_ID);
      setValue("ozelAlan7", selectedRow.IST_OZEL_ALAN_7);
      setValue("ozelAlan7ID", selectedRow.IST_OZEL_ALAN_7_KOD_ID);
      setValue("ozelAlan8", selectedRow.IST_OZEL_ALAN_8);
      setValue("ozelAlan8ID", selectedRow.IST_OZEL_ALAN_8_KOD_ID);
      setValue("ozelAlan9", selectedRow.IST_OZEL_ALAN_9);
      setValue("ozelAlan10", selectedRow.IST_OZEL_ALAN_10);
      setValue("aciklama", selectedRow.IST_ACIKLAMA);

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
            title="Bakim Tanımını Güncelle"
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
