import trTR from "antd/es/locale/tr_TR";
import enUS from "antd/es/locale/en_US";
import ruRU from "antd/es/locale/ru_RU";
import azAZ from "antd/es/locale/az_AZ";
import { PlusOutlined } from "@ant-design/icons";
import { Button, Drawer, Space, ConfigProvider, Modal, message, Typography } from "antd";
import React, { useEffect, useState } from "react";
import MainTabs from "./components/MainTabs/MainTabs";
import { useForm, FormProvider } from "react-hook-form";
import PropTypes from "prop-types";
import dayjs from "dayjs";
import AxiosInstance from "../../../../api/http";
/* import Footer from "../Footer"; */
import { t } from "i18next";
import Tabs from "./components/Tabs/Tabs";

const { Text } = Typography;

export default function CreateDrawer({ onRefresh }) {
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

  //* export
  const methods = useForm({
    defaultValues: {
      makineKodu: "",
      makineTanimi: "",
      location: null,
      locationID: "",
      MakineTipi: null,
      MakineTipiID: "",
      Kategori: null,
      KategoriID: "",
      MakineMarka: null,
      MakineMarkaID: "",
      MakineModel: null,
      MakineModelID: "",
      makineOperator: null,
      makineOperatorID: "",
      MakineDurum: null,
      MakineDurumID: "",
      makineSeriNO: "",
      masterMakineTanimi: "",
      masterMakineID: "",
      makineTakvimTanimi: "",
      makineTakvimID: "",
      uretici: "",
      uretimYili: "",
      makineGarantiBitisTarihi: "",
      makineDurusBirimMaliyeti: "",
      makinePlanCalismaSuresi: "",
      makineAktif: false,
      makineKalibrasyon: false,
      kritikMakine: false,
      makineGucKaynagi: false,
      makineIsBildirimi: false,
      makineYakitKullanim: false,
      makineOtonomBakim: false,
      // detay bilgi sekmesi
      makineMasrafMerkeziTanim: "",
      makineMasrafMerkeziID: "",
      makineAtolyeTanim: "",
      makineAtolyeID: "",
      makineBakimGrubu: null,
      makineBakimGrubuID: "",
      makineArizaGrubu: null,
      makineArizaGrubuID: "",
      makineServisSaglayici: null,
      makineServisSaglayiciID: "",
      makineServisSekli: null,
      makineServisSekliID: "",
      makineTeknikSeviyesi: null,
      makineTeknikSeviyesiID: "",
      makineFizikselDurumu: null,
      makineFizikselDurumuID: "",
      makineOncelik: "",
      makineOncelikID: "",
      makineRiskPuani: "",
      makineKurulumTarihi: "",
      MakineIsletimSistemi: null,
      MakineIsletimSistemiID: "",
      makineIPNo: "",
      MakineAgirlik: "",
      MakineAgirlikBirim: null,
      MakineAgirlikBirimID: "",
      MakineHacim: "",
      MakineHacimBirim: null,
      MakineHacimBirimID: "",
      MakineKapasite: "",
      MakineKapasiteBirim: null,
      MakineKapasiteBirimID: "",
      MakineElektrikTuketim: "",
      MakineElektrikTuketimBirim: null,
      MakineElektrikTuketimBirimID: "",
      makineVoltaj: "",
      makineGuc: "",
      makineFaz: "",
      makineValfTipi: null,
      makineValfTipiID: "",
      makineValfBoyutu: null,
      makineValfBoyutuID: "",
      makineGirisBoyutu: null,
      makineGirisBoyutuID: "",
      makineCikisBoyutu: null,
      makineCikisBoyutuID: "",
      makineKonnektor: null,
      makineKonnektorID: "",
      makineBasinc: null,
      makineBasincID: "",
      MakineBasincMiktar: "",
      MakineBasincMiktarBirim: null,
      MakineBasincMiktarBirimID: "",
      makineDevirSayisi: "",
      makineMotorGucu: "",
      makineSilindirSayisi: "",
      // finansal bilgiler sekmesi
      makineSatinalmaFirma: "",
      makineSatinalmaFirmaID: "",
      makineSatinalmaTarihi: "",
      satinalmaFiyati: "",
      satinalmaFaturaNo: "",
      makineSatinalmaFaturaTarihi: "",
      satinalmaFaturaTutar: "",
      makineKrediKrediMiktari: "",
      makineKrediKrediOrani: "",
      makineKrediBaslamaTarihi: "",
      makineKrediBitisTarihi: "",
      amortismanHesapTarihi: "",
      amortismanDefterDegeri: "",
      amortismanFaydaliOmur: "",
      amortismanTutari: "",
      amortismanNetAktifDegeri: "",
      amortismanKalanSure: "",
      makineKiralik: "",
      makineFirma: "",
      makineFirmaID: "",
      makineKiraBaslangicTarihi: "",
      makineKiraBitisTarihi: "",
      MakineKiraSuresi: "",
      MakineKiraSuresiBirim: null,
      MakineKiraSuresiBirimID: "",
      kiraTutari: "",
      kiraAciklama: "",
      makineSatıldı: "",
      makineSatisNedeni: "",
      makineSatisTarihi: "",
      makineSatisYeri: "",
      satisTutari: "",
      makineSatisAciklama: "",
      // Yakit Bilgileri sekmesi
      makineYakitTipi: "",
      makineYakitTipiID: "",
      YakitDepoHacmi: "",
      makineYakitSayacTakibi: "",
      makineYakitSayacGuncellemesi: "",
      ongorulenMin: "",
      ongorulenMax: "",
      gerceklesen: "",
      // Özel Alanlar sekmesi
      ozelAlan_1: "",
      ozelAlan_2: "",
      ozelAlan_3: "",
      ozelAlan_4: "",
      ozelAlan_5: "",
      ozelAlan_6: "",
      ozelAlan_7: "",
      ozelAlan_8: "",
      ozelAlan_9: "",
      ozelAlan_10: "",
      ozelAlan_11: null,
      ozelAlan_11_ID: "",
      ozelAlan_12: null,
      ozelAlan_12_ID: "",
      ozelAlan_13: null,
      ozelAlan_13_ID: "",
      ozelAlan_14: null,
      ozelAlan_14_ID: "",
      ozelAlan_15: null,
      ozelAlan_15_ID: "",
      ozelAlan_16: "",
      ozelAlan_17: "",
      ozelAlan_18: "",
      ozelAlan_19: "",
      ozelAlan_20: "",
      // Notlar sekmesi
      makineGenelNot: "",
      makineGuvenlikNotu: "",
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

  const { setValue, reset, watch } = methods;

  //* export
  const onSubmit = (data) => {
    const Body = {
      MKN_KOD: data.makineKodu,
      MKN_TANIM: data.makineTanimi,
      // :data.location,
      MKN_LOKASYON_ID: data.locationID,
      // :data.MakineTipi,
      MKN_TIP_KOD_ID: data.MakineTipiID,
      // :data.Kategori,
      MKN_KATEGORI_KOD_ID: data.KategoriID,
      // :data.MakineMarka,
      MKN_MARKA_KOD_ID: data.MakineMarkaID,
      // :data.MakineModel,
      MKN_MODEL_KOD_ID: data.MakineModelID,
      // :data.makineOperator,
      MKN_OPERATOR_PERSONEL_ID: data.makineOperatorID, // ??
      // :data.MakineDurum,
      MKN_DURUM_KOD_ID: data.MakineDurumID,
      MKN_SERI_NO: data.makineSeriNO,
      // :data.masterMakineTanimi,
      MKN_MASTER_ID: data.masterMakineID,
      // :data.makineTakvimTanimi,
      MKN_TAKVIM_ID: data.makineTakvimID,
      MKN_URETICI: data.uretici,
      MKN_URETIM_YILI: data.uretimYili,
      MKN_GARANTI_BITIS: formatDateWithDayjs(data.makineGarantiBitisTarihi),
      MKN_DURUS_MALIYET: data.makineDurusBirimMaliyeti,
      MKN_YILLIK_PLANLANAN_CALISMA_SURESI: data.makinePlanCalismaSuresi,
      MKN_AKTIF: data.makineAktif,
      MKN_KALIBRASYON_VAR: data.makineKalibrasyon,
      MKN_KRITIK_MAKINE: data.kritikMakine,
      MKN_GUC_KAYNAGI: data.makineGucKaynagi,
      MKN_IS_TALEP: data.makineIsBildirimi, // ??
      MKN_YAKIT_KULLANIM: data.makineYakitKullanim,
      MKN_OTONOM_BAKIM: data.makineOtonomBakim,
      // detay bilgi sekmesi
      // :data.makineMasrafMerkeziTanim,
      MKN_MASRAF_MERKEZ_KOD_ID: data.makineMasrafMerkeziID,
      // :data.makineAtolyeTanim,
      MKN_ATOLYE_ID: data.makineAtolyeID,
      // :data.makineBakimGrubu,
      MKN_BAKIM_GRUP_ID: data.makineBakimGrubuID,
      // :data.makineArizaGrubu,
      MKN_ARIZA_GRUP_ID: data.makineArizaGrubuID,
      // :data.makineServisSaglayici,
      MKN_SERVIS_SAGLAYICI_KOD_ID: data.makineServisSaglayiciID,
      // :data.makineServisSekli,
      MKN_SERVIS_SEKLI_KOD_ID: data.makineServisSekliID,
      // :data.makineTeknikSeviyesi,
      MKN_TEKNIK_SERVIS_KOD_ID: data.makineTeknikSeviyesiID,
      // :data.makineFizikselDurumu,
      MKN_FIZIKSEL_DURUM_KOD_ID: data.makineFizikselDurumuID,
      // :data.makineOncelik,
      MKN_ONCELIK_ID: data.makineOncelikID,
      MKN_RISK_PUAN: data.makineRiskPuani,
      MKN_KURULUM_TARIH: formatDateWithDayjs(data.makineKurulumTarihi),
      // :data.MakineIsletimSistemi,
      MKN_ISLETIM_SISTEMI_KOD_ID: data.MakineIsletimSistemiID,
      MKN_IP_NO: data.makineIPNo,
      MKN_AGIRLIK: data.MakineAgirlik,
      // :data.MakineAgirlikBirim,
      MKN_AGIRLIK_BIRIM_KOD_ID: data.MakineAgirlikBirimID,
      MKN_HACIM: data.MakineHacim,
      // :data.MakineHacimBirim,
      MKN_HACIM_BIRIM_KOD_ID: data.MakineHacimBirimID,
      MKN_KAPASITE: data.MakineKapasite,
      // :data.MakineKapasiteBirim,
      MKN_KAPASITE_BIRIM_KOD_ID: data.MakineKapasiteBirimID,
      MKN_ELEKTRIK_TUKETIM: data.MakineElektrikTuketim,
      // :data.MakineElektrikTuketimBirim,
      MKN_ELEKTRIK_TUKETIM_BIRIM_KOD_ID: data.MakineElektrikTuketimBirimID,
      MKN_VOLTAJ: data.makineVoltaj,
      MKN_GUC: data.makineGuc, // ??
      MKN_FAZ: data.makineFaz,
      // :data.makineValfTipi,
      MKN_VALF_TIP_KOD_ID: data.makineValfTipiID,
      // :data.makineValfBoyutu,
      MKN_VALF_BOYUT_KOD_ID: data.makineValfBoyutuID,
      // :data.makineGirisBoyutu,
      MKN_GIRIS_BOYUT_KOD_ID: data.makineGirisBoyutuID,
      // :data.makineCikisBoyutu,
      MKN_CIKIS_BOYUT_KOD_ID: data.makineCikisBoyutuID,
      // :data.makineKonnektor,
      MKN_KONNEKTOR_KOD_ID: data.makineKonnektorID,
      // :data.makineBasinc,
      MKN_BASINC_KOD_ID: data.makineBasincID,
      MKN_BASINC_MIKTAR: data.MakineBasincMiktar,
      // :data.MakineBasincMiktarBirim,
      MKN_BASINC_BIRIM_KOD_ID: data.MakineBasincMiktarBirimID,
      MKN_DEVIR: data.makineDevirSayisi,
      MKN_TEKNIK_MOTOR_GUCU: data.makineMotorGucu,
      MKN_TEKNIK_SILINDIR_SAYISI: data.makineSilindirSayisi,
      // finansal bilgiler sekmesi
      // :data.makineSatinalmaFirma,
      MKN_ALIS_FIRMA_ID: data.makineSatinalmaFirmaID,
      MKN_ALIS_TARIH: formatDateWithDayjs(data.makineSatinalmaTarihi),
      MKN_ALIS_FIYAT: data.satinalmaFiyati,
      MKN_FATURA_NO: data.satinalmaFaturaNo,
      MKN_FATURA_TARIH: formatDateWithDayjs(data.makineSatinalmaFaturaTarihi),
      MKN_FATURA_TUTAR: data.satinalmaFaturaTutar,
      MKN_KREDI_MIKTARI: data.makineKrediKrediMiktari,
      KREDI_ORANI: data.makineKrediKrediOrani,
      MKN_KREDI_BASLAMA_TARIHI: formatDateWithDayjs(data.makineKrediBaslamaTarihi),
      MKN_KREDI_BITIS_TARIHI: formatDateWithDayjs(data.makineKrediBitisTarihi),
      // :data.amortismanHesapTarihi, // ??
      // :data.amortismanDefterDegeri, // ??
      // :data.amortismanFaydaliOmur, // ??
      // :data.amortismanTutari, // ??
      // :data.amortismanNetAktifDegeri, // ??
      // :data.amortismanKalanSure, // ??
      MKN_KIRA: data.makineKiralik,
      // :data.makineFirma,
      MKN_KIRA_FIRMA_ID: data.makineFirmaID,
      MKN_KIRA_BASLANGIC_TARIH: formatDateWithDayjs(data.makineKiraBaslangicTarihi),
      MKN_KIRA_BITIS_TARIH: formatDateWithDayjs(data.makineKiraBitisTarihi),
      MKN_KIRA_SURE: data.MakineKiraSuresi,
      MKN_KIRA_PERIYOD: data.MakineKiraSuresiBirim ? data.MakineKiraSuresiBirim.label : null, // ??
      // :data.MakineKiraSuresiBirimID,
      MKN_KIRA_TUTAR: data.kiraTutari,
      MKN_KIRA_ACIKLAMA: data.kiraAciklama,
      MKN_SATIS: data.makineSatıldı,
      MKN_SATIS_NEDEN: data.makineSatisNedeni,
      MKN_SATIS_TARIH: formatDateWithDayjs(data.makineSatisTarihi),
      MKN_SATIS_YER: data.makineSatisYeri,
      MKN_SATIS_FIYAT: data.satisTutari,
      MKN_SATIS_ACIKLAMA: data.makineSatisAciklama,
      // Yakit Bilgileri sekmesi
      // :data.makineYakitTipi,
      MKN_YAKIT_TIP_ID: data.makineYakitTipiID, // ??
      MKN_YAKIT_DEPO_HACMI: data.YakitDepoHacmi,
      MKN_YAKIT_SAYAC_TAKIP: data.makineYakitSayacTakibi,
      MKN_YAKIT_SAYAC_GUNCELLE: data.makineYakitSayacGuncellemesi,
      MKN_YAKIT_ONGORULEN_MIN: data.ongorulenMin,
      MKN_YAKIT_ONGORULEN_MAX: data.ongorulenMax,
      MKN_YAKIT_GERCEKLESEN: data.gerceklesen,
      // Özel Alanlar sekmesi
      MKN_OZEL_ALAN_1: data.ozelAlan_1,
      MKN_OZEL_ALAN_2: data.ozelAlan_2,
      MKN_OZEL_ALAN_3: data.ozelAlan_3,
      MKN_OZEL_ALAN_4: data.ozelAlan_4,
      MKN_OZEL_ALAN_5: data.ozelAlan_5,
      MKN_OZEL_ALAN_6: data.ozelAlan_6,
      MKN_OZEL_ALAN_7: data.ozelAlan_7,
      MKN_OZEL_ALAN_8: data.ozelAlan_8,
      MKN_OZEL_ALAN_9: data.ozelAlan_9,
      MKN_OZEL_ALAN_10: data.ozelAlan_10,
      // :data.ozelAlan_11,
      MKN_OZEL_ALAN_11_KOD_ID: data.ozelAlan_11_ID,
      // :data.ozelAlan_12,
      MKN_OZEL_ALAN_12_KOD_ID: data.ozelAlan_12_ID,
      // :data.ozelAlan_13,
      MKN_OZEL_ALAN_13_KOD_ID: data.ozelAlan_13_ID,
      // :data.ozelAlan_14,
      MKN_OZEL_ALAN_14_KOD_ID: data.ozelAlan_14_ID,
      // :data.ozelAlan_15,
      MKN_OZEL_ALAN_15_KOD_ID: data.ozelAlan_15_ID,
      MKN_OZEL_ALAN_16: data.ozelAlan_16,
      MKN_OZEL_ALAN_17: data.ozelAlan_17,
      MKN_OZEL_ALAN_18: data.ozelAlan_18,
      MKN_OZEL_ALAN_19: data.ozelAlan_19,
      MKN_OZEL_ALAN_20: data.ozelAlan_20,
      // Notlar sekmesi
      MKN_GUVENLIK_NOT: data.makineGenelNot,
      MKN_GENEL_NOT: data.makineGuvenlikNotu,
      MKN_WEB: true,
      // add more fields as needed
    };

    // AxiosInstance.post("/api/endpoint", { Body }).then((response) => {
    // handle response
    // });

    AxiosInstance.post("AddMakine", Body)
      .then((response) => {
        // Handle successful response here, e.g.:
        console.log("Data sent successfully:", response);
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
    console.log({ Body });
  };

  // İş Emri No değerini her drawer açıldığında güncellemek için
  useEffect(() => {
    if (open) {
      AxiosInstance.get("MakineKodGetir") // Replace with your actual API endpoint
        .then((response) => {
          // Assuming the response contains the new work order number in 'response.Tanim'
          setValue("makineKodu", response);
        })
        .catch((error) => {
          console.error("Error fetching new work order number:", error);
        });
    }
  }, [open, setValue]);

  // İş Emri No değerini her drawer açıldığında güncellemek için son

  return (
    <FormProvider {...methods}>
      <ConfigProvider
        locale={(() => {
          const localeMap = { tr: trTR, en: enUS, ru: ruRU, az: azAZ };
          const currentLang = (localStorage.getItem("i18nextLng") || "tr").split("-")[0];
          return localeMap[currentLang] || enUS;
        })()}
      >
        <Button
          type="primary"
          onClick={showDrawer}
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <PlusOutlined />
          Ekle
        </Button>
        <Drawer
          width="1200px"
          title={
            <div style={{ display: "flex", alignItems: "flex-start", flexDirection: "column" }}>
              <Text type="secondary" style={{ fontWeight: "300", fontSize: "12px" }}>
                PBT PRO / {t("makineSicilKarti")}
              </Text>
              <Text>{watch("makineKodu")}</Text>
            </div>
          }
          placement={"right"}
          onClose={onClose}
          open={open}
          styles={{
            content: { backgroundColor: "#f5f5f5" },
            body: { backgroundColor: "#f5f5f5" },
            header: { backgroundColor: "#ffffff" },
          }}
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
                Kaydet
              </Button>
            </Space>
          }
        >
          <form onSubmit={methods.handleSubmit(onSubmit)} style={{ width: "100%", boxSizing: "border-box" }}>
            <MainTabs />
            {/* <SecondTabs /> */}
            <Tabs />
            {/*  <Footer /> */}
          </form>
        </Drawer>
      </ConfigProvider>
    </FormProvider>
  );
}

CreateDrawer.propTypes = {
  onRefresh: PropTypes.func.isRequired,
};
