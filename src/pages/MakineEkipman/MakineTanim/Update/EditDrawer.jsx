import React, { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { Button, Drawer, Space, ConfigProvider, Modal, Spin, message } from "antd";
import tr_TR from "antd/es/locale/tr_TR";
import AxiosInstance from "../../../../api/http";
import MainTabs from "./components/MainTabs/MainTabs";
import Footer from "./components/Footer";
import SecondTabs from "./components/secondTabs/secondTabs";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);

export default function EditDrawer({ selectedRow, onDrawerClose, drawerVisible, onRefresh }) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(drawerVisible);

  const methods = useForm({
    defaultValues: {
      secilenMakineID: "",
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
      makineAktif: "true",
      makineKalibrasyon: "",
      kritikMakine: "",
      makineGucKaynagi: "",
      makineIsBildirimi: "",
      makineYakitKullanim: "",
      makineOtonomBakim: "",
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

  const { setValue, reset, watch } = methods;

  // aşağıdaki useEffect verileri form elemanlarına set etmeden önce durum güncellemesi yapıyor ondan sonra verileri set ediyor

  useEffect(() => {
    const handleDataFetchAndUpdate = async () => {
      if (drawerVisible && selectedRow) {
        setOpen(true); // İşlemler tamamlandıktan sonra drawer'ı aç
        setLoading(true); // Yükleme başladığında
        try {
          const response = await AxiosInstance.get(`GetMakineById?makineId=${selectedRow.key}`);
          const data = response;
          const item = data[0]; // Veri dizisinin ilk elemanını al
          // Form alanlarını set et
          setValue("secilenMakineID", item.TB_MAKINE_ID);
          setValue("makineKodu", item.MKN_KOD);
          setValue("makineTanimi", item.MKN_TANIM);
          setValue("location", item.MKN_LOKASYON);
          setValue("locationID", item.MKN_LOKASYON_ID);
          setValue("MakineTipi", item.MKN_TIP);
          setValue("MakineTipiID", item.MKN_TIP_KOD_ID);
          setValue("Kategori", item.MKN_KATEGORI);
          setValue("KategoriID", item.MKN_KATEGORI_KOD_ID);
          setValue("MakineMarka", item.MKN_MARKA);
          setValue("MakineMarkaID", item.MKN_MARKA_KOD_ID);
          const timeoutId = setTimeout(() => {
            setValue("MakineModel", item.MKN_MODEL);
            setValue("MakineModelID", item.MKN_MODEL_KOD_ID);
          }, 500); // Delay of 500 milliseconds
          setValue("makineOperator", item.MKN_OPERATOR);
          setValue("makineOperatorID", item.MKN_OPERATOR_PERSONEL_ID);
          setValue("MakineDurum", item.MKN_DURUM);
          setValue("MakineDurumID", item.MKN_DURUM_KOD_ID);
          setValue("makineSeriNO", item.MKN_SERI_NO);
          setValue("masterMakineTanimi", item.MKN_MASTER_MAKINE_TANIM);
          setValue("masterMakineID", item.MKN_MASTER_ID);
          setValue("makineTakvimTanimi", item.MKN_TAKVIM);
          setValue("makineTakvimID", item.MKN_TAKVIM_ID);
          setValue("uretici", item.MKN_URETICI);
          setValue("uretimYili", item.MKN_URETIM_YILI);
          setValue(
            "makineGarantiBitisTarihi",
            item.MKN_GARANTI_BITIS && dayjs(item.MKN_GARANTI_BITIS).isValid() ? dayjs(item.MKN_GARANTI_BITIS) : ""
          );
          setValue(
            "time",
            item.editTime && dayjs(item.editTime, "HH:mm:ss").isValid() ? dayjs(item.editTime, "HH:mm:ss") : null
          );
          setValue("makineDurusBirimMaliyeti", item.MKN_DURUS_MALIYET);
          setValue("makinePlanCalismaSuresi", item.MKN_YILLIK_PLANLANAN_CALISMA_SURESI);
          setValue("makineAktif", item.MKN_AKTIF);
          setValue("makineKalibrasyon", item.MKN_KALIBRASYON_VAR);
          setValue("kritikMakine", item.MKN_KRITIK_MAKINE);
          setValue("makineGucKaynagi", item.MKN_GUC_KAYNAGI);
          setValue("makineIsBildirimi", item.MKN_IS_TALEP);
          setValue("makineYakitKullanim", item.MKN_YAKIT_KULLANIM);
          setValue("makineOtonomBakim", item.MKN_OTONOM_BAKIM);
          // detay bilgi sekmesi
          setValue("makineMasrafMerkeziTanim", item.MKN_MASRAF_MERKEZ);
          setValue("makineMasrafMerkeziID", item.MKN_MASRAF_MERKEZ_KOD_ID);
          setValue("makineAtolyeTanim", item.MKN_ATOLYE);
          setValue("makineAtolyeID", item.MKN_ATOLYE_ID);
          setValue("makineBakimGrubu", item.MKN_BAKIM_GRUP);
          setValue("makineBakimGrubuID", item.MKN_BAKIM_GRUP_ID);
          setValue("makineArizaGrubu", item.MKN_ARIZA_GRUP);
          setValue("makineArizaGrubuID", item.MKN_ARIZA_GRUP_ID);
          setValue("makineServisSaglayici", item.MKN_SERVIS_SAGLAYICI);
          setValue("makineServisSaglayiciID", item.MKN_SERVIS_SAGLAYICI_KOD_ID);
          setValue("makineServisSekli", item.MKN_SERVIS_SEKLI);
          setValue("makineServisSekliID", item.MKN_SERVIS_SEKLI_KOD_ID);
          setValue("makineTeknikSeviyesi", item.MKN_TEKNIK_SERVIS);
          setValue("makineTeknikSeviyesiID", item.MKN_TEKNIK_SERVIS_KOD_ID);
          setValue("makineFizikselDurumu", item.MKN_FIZIKSEL_DURUM);
          setValue("makineFizikselDurumuID", item.MKN_FIZIKSEL_DURUM_KOD_ID);
          setValue("makineOncelik", item.MKN_ONCELIK);
          setValue("makineOncelikID", item.MKN_ONCELIK_ID);
          setValue("makineRiskPuani", item.MKN_RISK_PUAN);
          setValue(
            "makineKurulumTarihi",
            item.MKN_KURULUM_TARIH && dayjs(item.MKN_KURULUM_TARIH).isValid() ? dayjs(item.MKN_KURULUM_TARIH) : ""
          );
          setValue("MakineIsletimSistemi", item.MKN_ISLETIM_SISTEMI);
          setValue("MakineIsletimSistemiID", item.MKN_ISLETIM_SISTEMI_KOD_ID);
          setValue("makineIPNo", item.MKN_IP_NO);
          setValue("MakineAgirlik", item.MKN_AGIRLIK);
          setValue("MakineAgirlikBirim", item.MKN_AGIRLIK_BIRIM);
          setValue("MakineAgirlikBirimID", item.MKN_AGIRLIK_BIRIM_KOD_ID);
          setValue("MakineHacim", item.MKN_HACIM);
          setValue("MakineHacimBirim", item.MKN_HACIM_BIRIM);
          setValue("MakineHacimBirimID", item.MKN_HACIM_BIRIM_KOD_ID);
          setValue("MakineKapasite", item.MKN_KAPASITE);
          setValue("MakineKapasiteBirim", item.MKN_KAPASITE_BIRIM);
          setValue("MakineKapasiteBirimID", item.MKN_KAPASITE_BIRIM_KOD_ID);
          setValue("MakineElektrikTuketim", item.MKN_ELEKTRIK_TUKETIM);
          setValue("MakineElektrikTuketimBirim", item.MKN_ELEKTRIK_TUKETIM_BIRIM);
          setValue("MakineElektrikTuketimBirimID", item.MKN_ELEKTRIK_TUKETIM_BIRIM_KOD_ID);
          setValue("makineVoltaj", item.MKN_VOLTAJ);
          setValue("makineGuc", item.MKN_GUC);
          setValue("makineFaz", item.MKN_FAZ);
          setValue("makineValfTipi", item.MKN_VALF_TIPI);
          setValue("makineValfTipiID", item.MKN_VALF_TIP_KOD_ID);
          setValue("makineValfBoyutu", item.MKN_VALF_BOYUT);
          setValue("makineValfBoyutuID", item.MKN_VALF_BOYUT_KOD_ID);
          setValue("makineGirisBoyutu", item.MKN_GIRIS_BOYUT);
          setValue("makineGirisBoyutuID", item.MKN_GIRIS_BOYUT_KOD_ID);
          setValue("makineCikisBoyutu", item.MKN_CIKIS_BOYUT);
          setValue("makineCikisBoyutuID", item.MKN_CIKIS_BOYUT_KOD_ID);
          setValue("makineKonnektor", item.MKN_KONNEKTOR);
          setValue("makineKonnektorID", item.MKN_KONNEKTOR_KOD_ID);
          setValue("makineBasinc", item.MKN_BASINC);
          setValue("makineBasincID", item.MKN_BASINC_KOD_ID);
          setValue("MakineBasincMiktar", item.MKN_BASINC_MIKTAR);
          setValue("MakineBasincMiktarBirim", item.MKN_BASINC_BIRIM);
          setValue("MakineBasincMiktarBirimID", item.MKN_BASINC_BIRIM_KOD_ID);
          setValue("makineDevirSayisi", item.MKN_DEVIR);
          setValue("makineMotorGucu", item.MKN_TEKNIK_MOTOR_GUCU);
          setValue("makineSilindirSayisi", item.MKN_TEKNIK_SILINDIR_SAYISI);
          // finansal bilgiler sekmesi
          setValue("makineSatinalmaFirma", item.MKN_ALIS_FIRMA);
          setValue("makineSatinalmaFirmaID", item.MKN_ALIS_FIRMA_ID);
          setValue(
            "makineSatinalmaTarihi",
            item.MKN_ALIS_TARIH && dayjs(item.MKN_ALIS_TARIH).isValid() ? dayjs(item.MKN_ALIS_TARIH) : ""
          );
          setValue("satinalmaFiyati", item.MKN_ALIS_FIYAT);
          setValue("satinalmaFaturaNo", item.MKN_FATURA_NO);
          setValue(
            "makineSatinalmaFaturaTarihi",
            item.MKN_FATURA_TARIH && dayjs(item.MKN_FATURA_TARIH).isValid() ? dayjs(item.MKN_FATURA_TARIH) : ""
          );
          setValue("satinalmaFaturaTutar", item.MKN_FATURA_TUTAR);
          setValue("makineKrediKrediMiktari", item.MKN_KREDI_MIKTARI);
          setValue("makineKrediKrediOrani", item.KREDI_ORANI);
          setValue(
            "makineKrediBaslamaTarihi",
            item.MKN_KREDI_BASLAMA_TARIHI && dayjs(item.MKN_KREDI_BASLAMA_TARIHI).isValid()
              ? dayjs(item.MKN_KREDI_BASLAMA_TARIHI)
              : ""
          );
          setValue(
            "makineKrediBitisTarihi",
            item.MKN_KREDI_BITIS_TARIHI && dayjs(item.MKN_KREDI_BITIS_TARIHI).isValid()
              ? dayjs(item.MKN_KREDI_BITIS_TARIHI)
              : ""
          );
          // setValue(
          //   "amortismanHesapTarihi",
          //   item.MKN_AMORTISMAN_HESAP_TARIHI && dayjs(item.MKN_AMORTISMAN_HESAP_TARIHI).isValid()
          //     ? dayjs(item.MKN_AMORTISMAN_HESAP_TARIHI)
          //     : ""
          // );
          // setValue("amortismanDefterDegeri", item.MKN_AMORTISMAN_DEFTER_DEGERI);
          // setValue("amortismanFaydaliOmur", item.MKN_AMORTISMAN_FAYDALI_OMUR);
          // setValue("amortismanTutari", item.MKN_AMORTISMAN_TUTARI);
          // setValue("amortismanNetAktifDegeri", item.MKN_AMORTISMAN_NET_AKTIF_DEGERI);
          // setValue("amortismanKalanSure", item.MKN_AMORTISMAN_KALAN_SURE);
          setValue("makineKiralik", item.MKN_KIRA);
          setValue("makineFirma", item.MKN_KIRA_FIRMA);
          setValue("makineFirmaID", item.MKN_KIRA_FIRMA_ID);
          setValue(
            "makineKiraBaslangicTarihi",
            item.MKN_KIRA_BASLANGIC_TARIH && dayjs(item.MKN_KIRA_BASLANGIC_TARIH).isValid()
              ? dayjs(item.MKN_KIRA_BASLANGIC_TARIH)
              : ""
          );
          setValue(
            "makineKiraBitisTarihi",
            item.MKN_KIRA_BITIS_TARIH && dayjs(item.MKN_KIRA_BITIS_TARIH).isValid()
              ? dayjs(item.MKN_KIRA_BITIS_TARIH)
              : ""
          );
          setValue("MakineKiraSuresi", item.MKN_KIRA_SURE);
          setValue("MakineKiraSuresiBirim", item.MKN_KIRA_PERIYOD);
          setValue("MakineKiraSuresiBirimID", item.MKN_KIRA_SURE_BIRIM_KOD_ID);
          setValue("kiraTutari", item.MKN_KIRA_TUTAR);
          setValue("kiraAciklama", item.MKN_KIRA_ACIKLAMA);
          setValue("makineSatıldı", item.MKN_SATIS);
          setValue("makineSatisNedeni", item.MKN_SATIS_NEDEN);
          setValue(
            "makineSatisTarihi",
            item.MKN_SATIS_TARIH && dayjs(item.MKN_SATIS_TARIH).isValid() ? dayjs(item.MKN_SATIS_TARIH) : ""
          );
          setValue("makineSatisYeri", item.MKN_SATIS_YER);
          setValue("satisTutari", item.MKN_SATIS_FIYAT);
          setValue("makineSatisAciklama", item.MKN_SATIS_ACIKLAMA);
          // Yakit Bilgileri sekmesi
          // setValue("makineYakitTipi", item.MKN_YAKIT_TIP);
          // setValue("makineYakitTipiID", item.MKN_YAKIT_TIP_ID);
          // setValue("YakitDepoHacmi", item.MKN_YAKIT_DEPO_HACMI);
          // setValue("makineYakitSayacTakibi", item.MKN_YAKIT_SAYAC_TAKIP);
          // setValue("makineYakitSayacGuncellemesi", item.MKN_YAKIT_SAYAC_GUNCELLE);
          // setValue("ongorulenMin", item.MKN_YAKIT_ONGORULEN_MIN);
          // setValue("ongorulenMax", item.MKN_YAKIT_ONGORULEN_MAX);
          // setValue("gerceklesen", item.MKN_YAKIT_GERCEKLESEN);
          // Özel Alanlar sekmesi
          setValue("ozelAlan_1", item.MKN_OZEL_ALAN_1);
          setValue("ozelAlan_2", item.MKN_OZEL_ALAN_2);
          setValue("ozelAlan_3", item.MKN_OZEL_ALAN_3);
          setValue("ozelAlan_4", item.MKN_OZEL_ALAN_4);
          setValue("ozelAlan_5", item.MKN_OZEL_ALAN_5);
          setValue("ozelAlan_6", item.MKN_OZEL_ALAN_6);
          setValue("ozelAlan_7", item.MKN_OZEL_ALAN_7);
          setValue("ozelAlan_8", item.MKN_OZEL_ALAN_8);
          setValue("ozelAlan_9", item.MKN_OZEL_ALAN_9);
          setValue("ozelAlan_10", item.MKN_OZEL_ALAN_10);
          setValue("ozelAlan_11", item.MKN_OZEL_ALAN_11);
          setValue("ozelAlan_11_ID", item.MKN_OZEL_ALAN_11_KOD_ID);
          setValue("ozelAlan_12", item.MKN_OZEL_ALAN_12);
          setValue("ozelAlan_12_ID", item.MKN_OZEL_ALAN_12_KOD_ID);
          setValue("ozelAlan_13", item.MKN_OZEL_ALAN_13);
          setValue("ozelAlan_13_ID", item.MKN_OZEL_ALAN_13_KOD_ID);
          setValue("ozelAlan_14", item.MKN_OZEL_ALAN_14);
          setValue("ozelAlan_14_ID", item.MKN_OZEL_ALAN_14_KOD_ID);
          setValue("ozelAlan_15", item.MKN_OZEL_ALAN_15);
          setValue("ozelAlan_15_ID", item.MKN_OZEL_ALAN_15_KOD_ID);
          setValue("ozelAlan_16", item.MKN_OZEL_ALAN_16);
          setValue("ozelAlan_17", item.MKN_OZEL_ALAN_17);
          setValue("ozelAlan_18", item.MKN_OZEL_ALAN_18);
          setValue("ozelAlan_19", item.MKN_OZEL_ALAN_19);
          setValue("ozelAlan_20", item.MKN_OZEL_ALAN_20);
          // Notlar sekmesi
          setValue("makineGenelNot", item.MKN_GUVENLIK_NOT);
          setValue("makineGuvenlikNotu", item.MKN_GENEL_NOT);
          // add more fields as needed
          // Cleanup function to clear timeout if the component unmounts
          setLoading(false); // Yükleme tamamlandığında

          return () => clearTimeout(timeoutId);

          // ... Diğer setValue çağrıları
        } catch (error) {
          console.error("Veri çekilirken hata oluştu:", error);
          setLoading(false); // Hata oluştuğunda
        }
      }
    };

    handleDataFetchAndUpdate();
  }, [drawerVisible, selectedRow, setValue, onRefresh, methods.reset]);

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
      TB_MAKINE_ID: data.secilenMakineID, // ??
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
      // Diğer alanlarınız...
    };

    // API'ye POST isteği gönder
    AxiosInstance.post("UpdateMakine", Body)
      .then((response) => {
        console.log("Data sent successfully:", response);
        if (response.status_code === 200 || response.status_code === 201) {
          message.success("Ekleme Başarılı.");
          setOpen(false);
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
          destroyOnClose
          width="1660px"
          title={
            <div style={{ display: "flex", gap: "30px", alignItems: "center" }}>
              <div>Makine Güncelle</div>
            </div>
          }
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
          {loading ? (
            <Spin
              spinning={loading}
              size="large"
              style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
              {/* İçerik yüklenirken gösterilecek alan */}
            </Spin>
          ) : (
            <form onSubmit={methods.handleSubmit(onSubmit)}>
              <MainTabs />
              <SecondTabs />
              <Footer />
            </form>
          )}
        </Drawer>
      </ConfigProvider>
    </FormProvider>
  );
}
