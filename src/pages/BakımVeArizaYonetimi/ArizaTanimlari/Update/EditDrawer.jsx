import React, { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { Button, Drawer, Space, ConfigProvider, Modal } from "antd";
import tr_TR from "antd/es/locale/tr_TR";
import AxiosInstance from "../../../../api/http";
import dayjs from "dayjs";
import MainTabs from "./components/MainTabs/MainTabs";
import Footer from "./components/Footer";
import SecondTabs from "./components/SecondTabs/SecondTabs";

export default function EditDrawer({ selectedRow, onDrawerClose, drawerVisible, onRefresh }) {
  const [open, setOpen] = useState(drawerVisible);

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
      // ... Tüm default değerleriniz
    },
  });

  const { setValue, reset } = methods;

  useEffect(() => {
    setOpen(drawerVisible);
    if (drawerVisible && selectedRow) {
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
      setValue("otonomBakim", selectedRow.IST_UYAR);
      // setValue("periyotID", selectedRow.IST_UYARI_PERIYOT);
      setValue("periyotSiklik", selectedRow.IST_UYARI_SIKLIGI);
      setValue("maliyetlerMalzeme", selectedRow.IST_MALZEME_MALIYET);
      setValue("maliyetlerIscilik", selectedRow.IST_ISCILIK_MALIYET);
      setValue("maliyetlerGenelGider", selectedRow.IST_GENEL_GIDER_MALIYET);
      setTimeout(() => {
        setValue("maliyetlerToplam", selectedRow.IST_TOPLAM_MALIYET);
      }, 500);
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
    }
  }, [selectedRow, setValue, drawerVisible]);

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
      IST_UYAR: data.otonomBakim,
      IST_UYARI_SIKLIGI: data.periyotSiklik,
      // IST_UYARI_PERIYOT: data.periyotID,
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
      // Diğer alanlarınız...
    };

    // API'ye POST isteği gönder
    AxiosInstance.post("UpdateAriza", Body)
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
          title="Arıza Güncelle"
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
