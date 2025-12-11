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
import AxiosInstance from "../../../api/http";
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
      makineKodu: null,
      makineTanimi: null,
      lokasyon: null,
      lokasyonID: null,
      makineTipi: null,
      makineTipiID: null,
      kategori: null,
      kategoriID: null,
      operator: null,
      operatorID: null,
      marka: null,
      markaID: null,
      model: null,
      modelID: null,
      operasyonDurumu: null,
      operasyonDurumuID: null,
      seriNo: null,
      masterMakine: null,
      masterMakineID: null,
      takvim: null,
      takvimID: null,
      uretici: null,
      uretimYili: null,
      garantiBitisTarihi: null,
      durusBirimMaliyeti: null,
      planCalismaSuresi: null,
      makineAktif: false,
      makineKalibrasyon: false,
      kritikMakine: false,
      makineGucKaynagi: false,
      makineIsBildirimi: false,
      makineOtonomBakim: false,

      // detay bilgi sekmesi
      masrafMerkeziDetay: null,
      masrafMerkeziIDDetay: null,
      atolyeTanim: null,
      atolyeID: null,
      bakimGrubu: null,
      bakimGrubuID: null,
      arizaGrubu: null,
      arizaGrubuID: null,
      servisSaglayici: null,
      servisSaglayiciID: null,
      servisSekli: null,
      servisSekliID: null,
      teknikSeviyesi: null,
      teknikSeviyesiID: null,
      fizikselDurumu: null,
      fizikselDurumuID: null,
      oncelikDetay: null,
      oncelikIDDetay: null,
      riskPuani: null,
      kurulumTarihi: null,
      isletimSistemi: null,
      isletimSistemiID: null,
      ipNo: null,
      agirlik: null,
      agirlikBirim: null,
      agirlikBirimID: null,
      hacim: null,
      hacimBirim: null,
      hacimBirimID: null,
      kapasite: null,
      kapasiteBirim: null,
      kapasiteBirimID: null,
      elektrikTuketimi: null,
      elektrikTuketimiBirim: null,
      elektrikTuketimiBirimID: null,
      voltaj: null,
      guc: null,
      faz: null,
      valfTipi: null,
      valfTipiID: null,
      valfBoyutu: null,
      valfBoyutuID: null,
      girisBoyutu: null,
      girisBoyutuID: null,
      cikisBoyutu: null,
      cikisBoyutuID: null,
      konnektor: null,
      konnektorID: null,
      makineBasinc: null,
      makineBasincID: null,
      basincMiktar: null,
      basincMiktarBirim: null,
      basincMiktarBirimID: null,
      devirSayisi: null,
      motorGucu: null,
      silindirSayisi: null,

      // finansal bilgiler sekmesi
      satinalmaFirma: null,
      satinalmaFirmaID: null,
      faturaNo: null,
      satinalmaTarihi: null,
      faturaTarihi: null,
      satinalmaFiyati: null,
      faturaTutari: null,
      krediMiktari: null,
      krediBaslamaTarihi: null,
      krediOrani: null,
      krediBitisTarihi: null,
      kiralik: false,
      kiralikFirma: null,
      kiralikFirmaID: null,
      kiraBaslangicTarihi: null,
      kiraBitisTarihi: null,
      kiraSuresi: null,
      kiraSuresiBirim: null,
      kiraSuresiBirimID: null,
      kiraTutari: null,
      kiraAciklama: null,

      satildi: false,
      satisNedeni: null,
      satisTarihi: null,
      satisYeri: null,
      satisTutari: null,
      satisAciklama: null,

      // ozel alanlar sekmesi

      ozelAlan1: null,
      ozelAlan2: null,
      ozelAlan3: null,
      ozelAlan4: null,
      ozelAlan5: null,
      ozelAlan6: null,
      ozelAlan7: null,
      ozelAlan8: null,
      ozelAlan9: null,
      ozelAlan10: null,
      ozelAlan11: null,
      ozelAlan11ID: null,
      ozelAlan12: null,
      ozelAlan12ID: null,
      ozelAlan13: null,
      ozelAlan13ID: null,
      ozelAlan14: null,
      ozelAlan14ID: null,
      ozelAlan15: null,
      ozelAlan15ID: null,
      ozelAlan16: null,
      ozelAlan17: null,
      ozelAlan18: null,
      ozelAlan19: null,
      ozelAlan20: null,

      // notlar sekmesi
      makineGenelNot: null,
      makineGuvenlikNotu: null,
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

  const formatYearWithDayjs = (dateString) => {
    const parsedDate = dayjs(dateString);
    return parsedDate.isValid() ? parsedDate.format("YYYY") : dateString;
  };

  const { setValue, reset, watch } = methods;

  //* export
  const onSubmit = (data) => {
    const Body = {
      MKN_KOD: data.makineKodu,
      MKN_TANIM: data.makineTanimi,
      // :data.location,
      MKN_LOKASYON_ID: data.lokasyonID,
      // :data.MakineTipi,
      MKN_TIP_KOD_ID: data.makineTipiID,
      // :data.Kategori,
      MKN_KATEGORI_KOD_ID: data.kategoriID,
      // :data.MakineMarka,
      MKN_MARKA_KOD_ID: data.markaID,
      // :data.MakineModel,
      MKN_MODEL_KOD_ID: data.modelID,
      // :data.makineOperator,
      MKN_OPERATOR_PERSONEL_ID: data.operatorID, // ??
      // :data.MakineDurum,
      MKN_DURUM_KOD_ID: data.operasyonDurumuID,
      MKN_SERI_NO: data.seriNo,
      // :data.masterMakineTanimi,
      MKN_MASTER_ID: data.masterMakineID,
      // :data.makineTakvimTanimi,
      MKN_TAKVIM_ID: data.takvimID,
      MKN_URETICI: data.uretici,
      MKN_URETIM_YILI: formatYearWithDayjs(data.uretimYili),
      MKN_GARANTI_BITIS: formatDateWithDayjs(data.garantiBitisTarihi),
      MKN_DURUS_MALIYET: data.durusBirimMaliyeti,
      MKN_YILLIK_PLANLANAN_CALISMA_SURESI: data.planCalismaSuresi,
      MKN_AKTIF: data.makineAktif,
      MKN_KALIBRASYON_VAR: data.makineKalibrasyon,
      MKN_KRITIK_MAKINE: data.kritikMakine,
      MKN_GUC_KAYNAGI: data.makineGucKaynagi,
      MKN_IS_TALEP: data.makineIsBildirimi, // ??
      MKN_YAKIT_KULLANIM: data.makineYakitKullanim,
      MKN_OTONOM_BAKIM: data.makineOtonomBakim,
      // detay bilgi sekmesi
      // :data.makineMasrafMerkeziTanim,
      MKN_MASRAF_MERKEZ_KOD_ID: data.masrafMerkeziIDDetay,
      // :data.makineAtolyeTanim,
      MKN_ATOLYE_ID: data.atolyeID,
      // :data.makineBakimGrubu,
      MKN_BAKIM_GRUP_ID: data.bakimGrubuID,
      // :data.makineArizaGrubu,
      MKN_ARIZA_GRUP_ID: data.arizaGrubuID,
      // :data.makineServisSaglayici,
      MKN_SERVIS_SAGLAYICI_KOD_ID: data.servisSaglayiciID,
      // :data.makineServisSekli,
      MKN_SERVIS_SEKLI_KOD_ID: data.servisSekliID,
      // :data.makineTeknikSeviyesi,
      MKN_TEKNIK_SERVIS_KOD_ID: data.teknikSeviyesiID,
      // :data.makineFizikselDurumu,
      MKN_FIZIKSEL_DURUM_KOD_ID: data.fizikselDurumuID,
      // :data.makineOncelik,
      MKN_ONCELIK_ID: data.oncelikIDDetay,
      MKN_RISK_PUAN: data.riskPuani,
      MKN_KURULUM_TARIH: formatDateWithDayjs(data.kurulumTarihi),
      // :data.MakineIsletimSistemi,
      MKN_ISLETIM_SISTEMI_KOD_ID: data.isletimSistemiID,
      MKN_IP_NO: data.ipNo,
      MKN_AGIRLIK: data.agirlik,
      // :data.MakineAgirlikBirim,
      MKN_AGIRLIK_BIRIM_KOD_ID: data.agirlikBirimID,
      MKN_HACIM: data.hacim,
      // :data.MakineHacimBirim,
      MKN_HACIM_BIRIM_KOD_ID: data.hacimBirimID,
      MKN_KAPASITE: data.kapasite,
      // :data.MakineKapasiteBirim,
      MKN_KAPASITE_BIRIM_KOD_ID: data.kapasiteBirimID,
      MKN_ELEKTRIK_TUKETIM: data.elektrikTuketimi,
      // :data.MakineElektrikTuketimBirim,
      MKN_ELEKTRIK_TUKETIM_BIRIM_KOD_ID: data.elektrikTuketimiBirimID,
      MKN_VOLTAJ: data.voltaj,
      MKN_GUC: data.guc, // ??
      MKN_FAZ: data.faz,
      // :data.makineValfTipi,
      MKN_VALF_TIP_KOD_ID: data.valfTipiID,
      // :data.makineValfBoyutu,
      MKN_VALF_BOYUT_KOD_ID: data.valfBoyutuID,
      // :data.makineGirisBoyutu,
      MKN_GIRIS_BOYUT_KOD_ID: data.girisBoyutuID,
      // :data.makineCikisBoyutu,
      MKN_CIKIS_BOYUT_KOD_ID: data.cikisBoyutuID,
      // :data.makineKonnektor,
      MKN_KONNEKTOR_KOD_ID: data.konnektorID,
      // :data.makineBasinc,
      MKN_BASINC_KOD_ID: data.makineBasincID,
      MKN_BASINC_MIKTAR: data.basincMiktar,
      // :data.MakineBasincMiktarBirim,
      MKN_BASINC_BIRIM_KOD_ID: data.basincMiktarBirimID,
      MKN_DEVIR: data.devirSayisi,
      MKN_TEKNIK_MOTOR_GUCU: data.motorGucu,
      MKN_TEKNIK_SILINDIR_SAYISI: data.silindirSayisi,
      // finansal bilgiler sekmesi
      // :data.makineSatinalmaFirma,
      MKN_ALIS_FIRMA_ID: data.satinalmaFirmaID,
      MKN_ALIS_TARIH: formatDateWithDayjs(data.satinalmaTarihi),
      MKN_ALIS_FIYAT: data.satinalmaFiyati,
      MKN_FATURA_NO: data.faturaNo,
      MKN_FATURA_TARIH: formatDateWithDayjs(data.faturaTarihi),
      MKN_FATURA_TUTAR: data.faturaTutari,
      MKN_KREDI_MIKTARI: data.krediMiktari,
      KREDI_ORANI: data.krediOrani,
      MKN_KREDI_BASLAMA_TARIHI: formatDateWithDayjs(data.krediBaslamaTarihi),
      MKN_KREDI_BITIS_TARIHI: formatDateWithDayjs(data.krediBitisTarihi),
      // :data.amortismanHesapTarihi, // ??
      // :data.amortismanDefterDegeri, // ??
      // :data.amortismanFaydaliOmur, // ??
      // :data.amortismanTutari, // ??
      // :data.amortismanNetAktifDegeri, // ??
      // :data.amortismanKalanSure, // ??
      MKN_KIRA: data.kiralik,
      // :data.makineFirma,
      MKN_KIRA_FIRMA_ID: data.kiralikFirmaID,
      MKN_KIRA_BASLANGIC_TARIH: formatDateWithDayjs(data.kiraBaslangicTarihi),
      MKN_KIRA_BITIS_TARIH: formatDateWithDayjs(data.kiraBitisTarihi),
      MKN_KIRA_SURE: data.kiraSuresi,
      MKN_KIRA_PERIYOD: data.kiraSuresiBirim ? data.kiraSuresiBirim.label : null, // ??
      // :data.MakineKiraSuresiBirimID,
      MKN_KIRA_TUTAR: data.kiraTutari,
      MKN_KIRA_ACIKLAMA: data.kiraAciklama,
      MKN_SATIS: data.satildi,
      MKN_SATIS_NEDEN: data.satisNedeni,
      MKN_SATIS_TARIH: formatDateWithDayjs(data.satisTarihi),
      MKN_SATIS_YER: data.satisYeri,
      MKN_SATIS_FIYAT: data.satisTutari,
      MKN_SATIS_ACIKLAMA: data.satisAciklama,
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
      MKN_OZEL_ALAN_1: data.ozelAlan1,
      MKN_OZEL_ALAN_2: data.ozelAlan2,
      MKN_OZEL_ALAN_3: data.ozelAlan3,
      MKN_OZEL_ALAN_4: data.ozelAlan4,
      MKN_OZEL_ALAN_5: data.ozelAlan5,
      MKN_OZEL_ALAN_6: data.ozelAlan6,
      MKN_OZEL_ALAN_7: data.ozelAlan7,
      MKN_OZEL_ALAN_8: data.ozelAlan8,
      MKN_OZEL_ALAN_9: data.ozelAlan9,
      MKN_OZEL_ALAN_10: data.ozelAlan10,
      // :data.ozelAlan_11,
      MKN_OZEL_ALAN_11_KOD_ID: data.ozelAlan11ID,
      // :data.ozelAlan_12,
      MKN_OZEL_ALAN_12_KOD_ID: data.ozelAlan12ID,
      // :data.ozelAlan_13,
      MKN_OZEL_ALAN_13_KOD_ID: data.ozelAlan13ID,
      // :data.ozelAlan_14,
      MKN_OZEL_ALAN_14_KOD_ID: data.ozelAlan14ID,
      // :data.ozelAlan_15,
      MKN_OZEL_ALAN_15_KOD_ID: data.ozelAlan15ID,
      MKN_OZEL_ALAN_16: data.ozelAlan16,
      MKN_OZEL_ALAN_17: data.ozelAlan17,
      MKN_OZEL_ALAN_18: data.ozelAlan18,
      MKN_OZEL_ALAN_19: data.ozelAlan19,
      MKN_OZEL_ALAN_20: data.ozelAlan20,
      // Notlar sekmesi
      MKN_GUVENLIK_NOT: data.makineGuvenlikNotu,
      MKN_GENEL_NOT: data.makineGenelNot,
      /* MKN_WEB: true, */
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
        <Button type="primary" onClick={showDrawer} className="flex items-center">
          <PlusOutlined />
          Ekle
        </Button>
        <Drawer
          width="1200px"
          title={
            <div className="flex items-start flex-col">
              <Text type="secondary" className="font-light text-[12px]">
                PBT PRO / {t("ekipmanSicilKarti")}
              </Text>
              <Text>{watch("makineKodu")}</Text>
            </div>
          }
          placement={"right"}
          onClose={onClose}
          open={open}
          rootClassName="[&_.ant-drawer-content]:bg-[#f5f5f5] [&_.ant-drawer-body]:bg-[#f5f5f5] [&_.ant-drawer-header]:bg-white"
          extra={
            <Space>
              <Button onClick={onClose}>İptal</Button>
              <Button type="submit" onClick={methods.handleSubmit(onSubmit)} className="!bg-[#2bc770] !border-[#2bc770] !text-white">
                Kaydet
              </Button>
            </Space>
          }
        >
          <form onSubmit={methods.handleSubmit(onSubmit)} className="w-full box-border">
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
