import tr_TR from "antd/es/locale/tr_TR";
import {
  Button,
  Drawer,
  Space,
  ConfigProvider,
  Modal,
  message,
  Spin,
} from "antd";
// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState, useTransition } from "react";
import { useForm, FormProvider } from "react-hook-form";
import dayjs from "dayjs";
import AxiosInstance from "../../../../api/http";
import Footer from "./components/Footer";
import SecondTabs from "./components/SecondTabs/SecondTabs";
import MainTabs1 from "./components/MainTabs/MainTabs1";

export default function EditDrawer({
  selectedRow,
  onDrawerClose,
  drawerVisible,
  onRefresh,
}) {
  const [startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
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
      tarihSayacBakim: "a",
      activeTab: "HAFTA",
      ayGroup: 1,
      ayinGunleriSelect: [],
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
  const onSubmit = async (data) => {
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

    try {
      const response = await AxiosInstance.post("UpdateBakim", Body);
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
    } catch (error) {
      // Handle errors here, e.g.:
      console.error("Error sending data:", error);
      message.error("Başarısız Olundu.");
    }
    console.log({ Body });
  };

  useEffect(() => {
    const handleDataFetchAndUpdate = async () => {
      if (drawerVisible && selectedRow) {
        setOpen(true); // İşlemler tamamlandıktan sonra drawer'ı aç
        setLoading(true); // Yükleme başladığında
        try {
          const response = await AxiosInstance.get(
            `PeriyodikBakimDetayByBakim?BakimId=${selectedRow.key}`
          );
          const item = response[0]; // Veri dizisinin ilk elemanını al
          // Form alanlarını set et
          // console.log("selectedRow", selectedRow);
          // startTransition(() => {
          // Object.keys(selectedRow).forEach((key) => {
          //   console.log(key, selectedRow[key]);
          //   setValue(key, selectedRow[key]);
          setValue("secilenBakimID", item.key);
          setValue("bakimKodu", item.PBK_KOD);
          setValue("bakimTanimi", item.PBK_TANIM);
          setValue("bakimAktif", item.PBK_AKTIF);
          setValue("bakimTipi", item.PBK_TIP);
          setValue("bakimTipiID", item.PBK_TIP_KOD_ID);
          setValue("bakimGrubu", item.PBK_GRUP);
          setValue("bakimGrubuID", item.PBK_GRUP_KOD_ID);
          setValue("bakimNedeni", item.PBK_NEDEN);
          setValue("bakimNedeniID", item.PBK_NEDEN_KOD_ID);
          setValue("oncelikTanim", item.PBK_ONCELIK);
          setValue("oncelikID", item.PBK_ONCELIK_ID);
          setValue("talimatTanim", item.PBK_TALIMAT);
          setValue("talimatID", item.PBK_TALIMAT_ID);
          setValue("atolyeTanim", item.PBK_ATOLYE);
          setValue("atolyeID", item.PBK_ATOLYE_ID);
          setValue("firmaTanim", item.PBK_FIRMA);
          setValue("firmaID", item.PBK_FIRMA_ID);
          setValue("lokasyonTanim", item.PBK_LOKASYON);
          setValue("lokasyonID", item.PBK_LOKASYON_ID);
          setValue("calismaSuresi", item.PBK_CALISMA_SURE);
          setValue("durusSuresi", item.PBK_DURUS_SURE);
          setValue("personelSayisi", item.PBK_PERSONEL_SAYI);
          setValue("otonomBakim", item.PBK_OTONOM_BAKIM);
          setValue("periyotID", item.PBK_UYARI_PERIYOT);
          setValue("periyotSiklik", item.PBK_UYARI_SIKLIGI);
          setValue("maliyetlerMalzeme", item.PBK_MALZEME_MALIYET);
          setValue("maliyetlerIscilik", item.PBK_ISCILIK_MALIYET);
          setValue("maliyetlerGenelGider", item.PBK_GENEL_GIDER_MALIYET);
          setValue("maliyetlerToplam", item.PBK_TOPLAM_MALIYET);
          setValue("lojistikSuresi", item.PBK_SURE_LOJISTIK);
          setValue("seyahetSuresi", item.PBK_SURE_SEYAHAT);
          setValue("onaySuresi", item.PBK_SURE_ONAY);
          setValue("beklemeSuresi", item.PBK_SURE_BEKLEME);
          setValue("digerSuresi", item.PBK_SURE_DIGER);
          setValue("ozelAlan1", item.PBK_OZEL_ALAN_1);
          setValue("ozelAlan2", item.PBK_OZEL_ALAN_2);
          setValue("ozelAlan3", item.PBK_OZEL_ALAN_3);
          setValue("ozelAlan4", item.PBK_OZEL_ALAN_4);
          setValue("ozelAlan5", item.PBK_OZEL_ALAN_5);
          setValue("ozelAlan6", item.PBK_OZEL_ALAN_6);
          setValue("ozelAlan6ID", item.PBK_OZEL_ALAN_6_KOD_ID);
          setValue("ozelAlan7", item.PBK_OZEL_ALAN_7);
          setValue("ozelAlan7ID", item.PBK_OZEL_ALAN_7_KOD_ID);
          setValue("ozelAlan8", item.PBK_OZEL_ALAN_8);
          setValue("ozelAlan8ID", item.PBK_OZEL_ALAN_8_KOD_ID);
          setValue("ozelAlan9", item.PBK_OZEL_ALAN_9);
          setValue("ozelAlan10", item.PBK_OZEL_ALAN_10);
          setValue("aciklama", item.PBK_ACIKLAMA);

          // add more fields as needed

          // });
          // });
          setLoading(false); // Yükleme tamamlandığında
        } catch (error) {
          console.error("Veri çekilirken hata oluştu:", error);
          setLoading(false); // Hata oluştuğunda
        }
      }
    };

    handleDataFetchAndUpdate();
  }, [selectedRow, setValue, drawerVisible]);

  useEffect(() => {
    if (!drawerVisible) {
      reset(); // Drawer kapandığında formu sıfırla
    }
  }, [drawerVisible, reset]);

  return (
    <FormProvider {...methods}>
      <ConfigProvider locale={tr_TR}>
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
                onClick={methods.handleSubmit(onSubmit)}
                style={{
                  backgroundColor: "#2bc770",
                  borderColor: "#2bc770",
                  color: "#ffffff",
                }}
              >
                Güncelle
              </Button>
            </Space>
          }
        >
          {loading ? (
            <Spin
              spinning={loading}
              size="large"
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "100vh",
              }}
            >
              {/* İçerik yüklenirken gösterilecek alan */}
            </Spin>
          ) : (
            <form onSubmit={methods.handleSubmit(onSubmit)}>
              <MainTabs1 />
              <SecondTabs />
              <Footer />
            </form>
          )}
        </Drawer>
      </ConfigProvider>
    </FormProvider>
  );
}
