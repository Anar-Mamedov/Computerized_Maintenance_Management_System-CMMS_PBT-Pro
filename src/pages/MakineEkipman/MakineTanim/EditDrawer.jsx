import React, { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { Button, Drawer, Space, ConfigProvider, Modal, Spin, message, Typography } from "antd";
import tr_TR from "antd/es/locale/tr_TR";
import AxiosInstance from "../../../api/http";
import MainTabs from "./components/MainTabs/MainTabs";
import Tabs from "./components/Tabs/Tabs";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { t } from "i18next";

const { Text } = Typography;

dayjs.extend(customParseFormat);

export default function EditDrawer({ selectedRow, onDrawerClose, drawerVisible, onRefresh }) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(drawerVisible);

  const methods = useForm({
    defaultValues: {
      secilenMakineID: null,
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

  const { setValue, reset, watch } = methods;

  const parseDateValue = (value, format) => {
    if (!value) {
      return null;
    }
    const rawValue = typeof value === "number" ? String(value) : value;
    const parsed = format ? dayjs(rawValue, format) : dayjs(rawValue);
    return parsed.isValid() ? parsed : null;
  };

  // aşağıdaki useEffect verileri form elemanlarına set etmeden önce durum güncellemesi yapıyor ondan sonra verileri set ediyor

  useEffect(() => {
    const handleDataFetchAndUpdate = async () => {
      if (drawerVisible && selectedRow) {
        setOpen(true); // İşlemler tamamlandıktan sonra drawer'ı aç
        setLoading(true); // Yükleme başladığında
        try {
          const response = await AxiosInstance.get(`GetMakineById?makineId=${selectedRow.key}`);
          const data = Array.isArray(response) ? response : response?.data ?? [];
          if (!data.length) {
            message.warning("Makine bilgisi bulunamadı.");
            setLoading(false);
            return;
          }
          const item = data[0]; // Veri dizisinin ilk elemanını al
          const normalizeBoolean = (value) => Boolean(value);
          const trimIfString = (value) => {
            if (typeof value !== "string") {
              return value ?? null;
            }
            const trimmed = value.trim();
            return trimmed.length ? trimmed : null;
          };
          // Form alanlarını set et
          setValue("secilenMakineID", item.TB_MAKINE_ID ?? null);
          setValue("makineKodu", trimIfString(item.MKN_KOD));
          setValue("makineTanimi", trimIfString(item.MKN_TANIM));
          setValue("lokasyon", trimIfString(item.MKN_LOKASYON));
          setValue("lokasyonID", item.MKN_LOKASYON_ID ?? null);
          setValue("makineTipi", trimIfString(item.MKN_TIP));
          setValue("makineTipiID", item.MKN_TIP_KOD_ID ?? null);
          setValue("kategori", trimIfString(item.MKN_KATEGORI));
          setValue("kategoriID", item.MKN_KATEGORI_KOD_ID ?? null);
          setValue("marka", trimIfString(item.MKN_MARKA));
          setValue("markaID", item.MKN_MARKA_KOD_ID ?? null);
          const timeoutId = setTimeout(() => {
            setValue("model", trimIfString(item.MKN_MODEL));
            setValue("modelID", item.MKN_MODEL_KOD_ID ?? null);
          }, 500); // Delay of 500 milliseconds
          setValue("operator", trimIfString(item.MKN_OPERATOR));
          setValue("operatorID", item.MKN_OPERATOR_PERSONEL_ID ?? null);
          setValue("operasyonDurumu", trimIfString(item.MKN_DURUM));
          setValue("operasyonDurumuID", item.MKN_DURUM_KOD_ID ?? null);
          setValue("seriNo", trimIfString(item.MKN_SERI_NO));
          setValue("masterMakine", trimIfString(item.MKN_MASTER_MAKINE_TANIM));
          setValue("masterMakineID", item.MKN_MASTER_ID ?? null);
          setValue("takvim", trimIfString(item.MKN_TAKVIM));
          setValue("takvimID", item.MKN_TAKVIM_ID ?? null);
          setValue("uretici", trimIfString(item.MKN_URETICI));
          setValue("uretimYili", parseDateValue(item.MKN_URETIM_YILI, "YYYY"));
          setValue("garantiBitisTarihi", parseDateValue(item.MKN_GARANTI_BITIS));
          // setValue("time", parseDateValue(item.editTime, "HH:mm:ss"));
          setValue("durusBirimMaliyeti", item.MKN_DURUS_MALIYET ?? null);
          setValue("planCalismaSuresi", item.MKN_YILLIK_PLANLANAN_CALISMA_SURESI ?? null);
          setValue("makineAktif", normalizeBoolean(item.MKN_AKTIF));
          setValue("makineKalibrasyon", normalizeBoolean(item.MKN_KALIBRASYON_VAR));
          setValue("kritikMakine", normalizeBoolean(item.MKN_KRITIK_MAKINE));
          setValue("makineGucKaynagi", normalizeBoolean(item.MKN_GUC_KAYNAGI));
          setValue("makineIsBildirimi", normalizeBoolean(item.MKN_IS_TALEP));
          // setValue("makineYakitKullanim", item.MKN_YAKIT_KULLANIM);
          setValue("makineOtonomBakim", normalizeBoolean(item.MKN_OTONOM_BAKIM));
          // detay bilgi sekmesi
          setValue("masrafMerkeziDetay", trimIfString(item.MKN_MASRAF_MERKEZ));
          setValue("masrafMerkeziIDDetay", item.MKN_MASRAF_MERKEZ_KOD_ID ?? null);
          setValue("atolyeTanim", trimIfString(item.MKN_ATOLYE));
          setValue("atolyeID", item.MKN_ATOLYE_ID ?? null);
          setValue("bakimGrubu", trimIfString(item.MKN_BAKIM_GRUP));
          setValue("bakimGrubuID", item.MKN_BAKIM_GRUP_ID ?? null);
          setValue("arizaGrubu", trimIfString(item.MKN_ARIZA_GRUP));
          setValue("arizaGrubuID", item.MKN_ARIZA_GRUP_ID ?? null);
          setValue("servisSaglayici", trimIfString(item.MKN_SERVIS_SAGLAYICI));
          setValue("servisSaglayiciID", item.MKN_SERVIS_SAGLAYICI_KOD_ID ?? null);
          setValue("servisSekli", trimIfString(item.MKN_SERVIS_SEKLI));
          setValue("servisSekliID", item.MKN_SERVIS_SEKLI_KOD_ID ?? null);
          setValue("teknikSeviyesi", trimIfString(item.MKN_TEKNIK_SERVIS));
          setValue("teknikSeviyesiID", item.MKN_TEKNIK_SERVIS_KOD_ID ?? null);
          setValue("fizikselDurumu", trimIfString(item.MKN_FIZIKSEL_DURUM));
          setValue("fizikselDurumuID", item.MKN_FIZIKSEL_DURUM_KOD_ID ?? null);
          setValue("oncelikDetay", trimIfString(item.MKN_ONCELIK));
          setValue("oncelikIDDetay", item.MKN_ONCELIK_ID ?? null);
          setValue("riskPuani", trimIfString(item.MKN_RISK_PUAN));
          setValue("kurulumTarihi", parseDateValue(item.MKN_KURULUM_TARIH));
          setValue("isletimSistemi", trimIfString(item.MKN_ISLETIM_SISTEMI));
          setValue("isletimSistemiID", item.MKN_ISLETIM_SISTEMI_KOD_ID ?? null);
          setValue("ipNo", trimIfString(item.MKN_IP_NO));
          setValue("agirlik", item.MKN_AGIRLIK ?? null);
          setValue("agirlikBirim", trimIfString(item.MKN_AGIRLIK_BIRIM));
          setValue("agirlikBirimID", item.MKN_AGIRLIK_BIRIM_KOD_ID ?? null);
          setValue("hacim", item.MKN_HACIM ?? null);
          setValue("hacimBirim", trimIfString(item.MKN_HACIM_BIRIM));
          setValue("hacimBirimID", item.MKN_HACIM_BIRIM_KOD_ID ?? null);
          setValue("kapasite", trimIfString(item.MKN_KAPASITE));
          setValue("kapasiteBirim", trimIfString(item.MKN_KAPASITE_BIRIM));
          setValue("kapasiteBirimID", item.MKN_KAPASITE_BIRIM_KOD_ID ?? null);
          setValue("elektrikTuketimi", trimIfString(item.MKN_ELEKTRIK_TUKETIM));
          setValue("elektrikTuketimiBirim", trimIfString(item.MKN_ELEKTRIK_TUKETIM_BIRIM));
          setValue("elektrikTuketimiBirimID", item.MKN_ELEKTRIK_TUKETIM_BIRIM_KOD_ID ?? null);
          setValue("voltaj", trimIfString(item.MKN_VOLTAJ));
          setValue("guc", trimIfString(item.MKN_GUC));
          setValue("faz", trimIfString(item.MKN_FAZ));
          setValue("valfTipi", trimIfString(item.MKN_VALF_TIPI));
          setValue("valfTipiID", item.MKN_VALF_TIP_KOD_ID ?? null);
          setValue("valfBoyutu", trimIfString(item.MKN_VALF_BOYUT));
          setValue("valfBoyutuID", item.MKN_VALF_BOYUT_KOD_ID ?? null);
          setValue("girisBoyutu", trimIfString(item.MKN_GIRIS_BOYUT));
          setValue("girisBoyutuID", item.MKN_GIRIS_BOYUT_KOD_ID ?? null);
          setValue("cikisBoyutu", trimIfString(item.MKN_CIKIS_BOYUT));
          setValue("cikisBoyutuID", item.MKN_CIKIS_BOYUT_KOD_ID ?? null);
          setValue("konnektor", trimIfString(item.MKN_KONNEKTOR));
          setValue("konnektorID", item.MKN_KONNEKTOR_KOD_ID ?? null);
          setValue("makineBasinc", trimIfString(item.MKN_BASINC));
          setValue("makineBasincID", item.MKN_BASINC_KOD_ID ?? null);
          setValue("basincMiktar", item.MKN_BASINC_MIKTAR ?? null);
          setValue("basincMiktarBirim", trimIfString(item.MKN_BASINC_BIRIM));
          setValue("basincMiktarBirimID", item.MKN_BASINC_BIRIM_KOD_ID ?? null);
          setValue("devirSayisi", item.MKN_DEVIR ?? null);
          setValue("motorGucu", trimIfString(item.MKN_TEKNIK_MOTOR_GUCU));
          setValue("silindirSayisi", trimIfString(item.MKN_TEKNIK_SILINDIR_SAYISI));
          // finansal bilgiler sekmesi
          setValue("satinalmaFirma", trimIfString(item.MKN_ALIS_FIRMA));
          setValue("satinalmaFirmaID", item.MKN_ALIS_FIRMA_ID ?? null);
          setValue("satinalmaTarihi", parseDateValue(item.MKN_ALIS_TARIH));
          setValue("satinalmaFiyati", item.MKN_ALIS_FIYAT ?? null);
          setValue("faturaNo", trimIfString(item.MKN_FATURA_NO));
          setValue("faturaTarihi", parseDateValue(item.MKN_FATURA_TARIH));
          setValue("faturaTutari", item.MKN_FATURA_TUTAR ?? null);
          setValue("krediMiktari", item.MKN_KREDI_MIKTARI ?? null);
          setValue("krediOrani", item.KREDI_ORANI ?? null);
          setValue("krediBaslamaTarihi", parseDateValue(item.MKN_KREDI_BASLAMA_TARIHI));
          setValue("krediBitisTarihi", parseDateValue(item.MKN_KREDI_BITIS_TARIHI));
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
          setValue("kiralik", normalizeBoolean(item.MKN_KIRA));
          setValue("kiralikFirma", trimIfString(item.MKN_KIRA_FIRMA));
          setValue("kiralikFirmaID", item.MKN_KIRA_FIRMA_ID ?? null);
          setValue("kiraBaslangicTarihi", parseDateValue(item.MKN_KIRA_BASLANGIC_TARIH));
          setValue("kiraBitisTarihi", parseDateValue(item.MKN_KIRA_BITIS_TARIH));
          setValue("kiraSuresi", item.MKN_KIRA_SURE ?? null);
          setValue("kiraSuresiBirim", trimIfString(item.MKN_KIRA_PERIYOD));
          setValue("kiraSuresiBirimID", item.MKN_KIRA_SURE_BIRIM_KOD_ID ?? null);
          setValue("kiraTutari", item.MKN_KIRA_TUTAR ?? null);
          setValue("kiraAciklama", trimIfString(item.MKN_KIRA_ACIKLAMA));
          setValue("satildi", normalizeBoolean(item.MKN_SATIS));
          setValue("satisNedeni", trimIfString(item.MKN_SATIS_NEDEN));
          setValue("satisTarihi", parseDateValue(item.MKN_SATIS_TARIH));
          setValue("satisYeri", trimIfString(item.MKN_SATIS_YER));
          setValue("satisTutari", item.MKN_SATIS_FIYAT ?? null);
          setValue("satisAciklama", trimIfString(item.MKN_SATIS_ACIKLAMA));
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
          setValue("ozelAlan1", trimIfString(item.MKN_OZEL_ALAN_1));
          setValue("ozelAlan2", trimIfString(item.MKN_OZEL_ALAN_2));
          setValue("ozelAlan3", trimIfString(item.MKN_OZEL_ALAN_3));
          setValue("ozelAlan4", trimIfString(item.MKN_OZEL_ALAN_4));
          setValue("ozelAlan5", trimIfString(item.MKN_OZEL_ALAN_5));
          setValue("ozelAlan6", trimIfString(item.MKN_OZEL_ALAN_6));
          setValue("ozelAlan7", trimIfString(item.MKN_OZEL_ALAN_7));
          setValue("ozelAlan8", trimIfString(item.MKN_OZEL_ALAN_8));
          setValue("ozelAlan9", trimIfString(item.MKN_OZEL_ALAN_9));
          setValue("ozelAlan10", trimIfString(item.MKN_OZEL_ALAN_10));
          setValue("ozelAlan11", trimIfString(item.MKN_OZEL_ALAN_11));
          setValue("ozelAlan11ID", item.MKN_OZEL_ALAN_11_KOD_ID ?? null);
          setValue("ozelAlan12", trimIfString(item.MKN_OZEL_ALAN_12));
          setValue("ozelAlan12ID", item.MKN_OZEL_ALAN_12_KOD_ID ?? null);
          setValue("ozelAlan13", trimIfString(item.MKN_OZEL_ALAN_13));
          setValue("ozelAlan13ID", item.MKN_OZEL_ALAN_13_KOD_ID ?? null);
          setValue("ozelAlan14", trimIfString(item.MKN_OZEL_ALAN_14));
          setValue("ozelAlan14ID", item.MKN_OZEL_ALAN_14_KOD_ID ?? null);
          setValue("ozelAlan15", trimIfString(item.MKN_OZEL_ALAN_15));
          setValue("ozelAlan15ID", item.MKN_OZEL_ALAN_15_KOD_ID ?? null);
          setValue("ozelAlan16", trimIfString(item.MKN_OZEL_ALAN_16));
          setValue("ozelAlan17", trimIfString(item.MKN_OZEL_ALAN_17));
          setValue("ozelAlan18", trimIfString(item.MKN_OZEL_ALAN_18));
          setValue("ozelAlan19", trimIfString(item.MKN_OZEL_ALAN_19));
          setValue("ozelAlan20", trimIfString(item.MKN_OZEL_ALAN_20));
          // Notlar sekmesi
          setValue("makineGenelNot", trimIfString(item.MKN_GENEL_NOT));
          setValue("makineGuvenlikNotu", trimIfString(item.MKN_GUVENLIK_NOT));
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

  const formatYearWithDayjs = (dateValue) => {
    const formattedDate = dayjs(dateValue);
    return formattedDate.isValid() ? formattedDate.format("YYYY") : "";
  };

  const onSubmit = (data) => {
    // Form verilerini API'nin beklediği formata dönüştür
    const Body = {
      TB_MAKINE_ID: data.secilenMakineID,
      MKN_KOD: data.makineKodu,
      MKN_TANIM: data.makineTanimi,
      MKN_LOKASYON_ID: data.lokasyonID,
      MKN_TIP_KOD_ID: data.makineTipiID,
      MKN_KATEGORI_KOD_ID: data.kategoriID,
      MKN_MARKA_KOD_ID: data.markaID,
      MKN_MODEL_KOD_ID: data.modelID,
      MKN_OPERATOR_PERSONEL_ID: data.operatorID,
      MKN_DURUM_KOD_ID: data.operasyonDurumuID,
      MKN_SERI_NO: data.seriNo,
      MKN_MASTER_ID: data.masterMakineID,
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
      MKN_IS_TALEP: data.makineIsBildirimi,
      // MKN_YAKIT_KULLANIM: data.makineYakitKullanim,
      MKN_OTONOM_BAKIM: data.makineOtonomBakim,
      MKN_MASRAF_MERKEZ_KOD_ID: data.masrafMerkeziIDDetay,
      MKN_ATOLYE_ID: data.atolyeID,
      MKN_BAKIM_GRUP_ID: data.bakimGrubuID,
      MKN_ARIZA_GRUP_ID: data.arizaGrubuID,
      MKN_SERVIS_SAGLAYICI_KOD_ID: data.servisSaglayiciID,
      MKN_SERVIS_SEKLI_KOD_ID: data.servisSekliID,
      MKN_TEKNIK_SERVIS_KOD_ID: data.teknikSeviyesiID,
      MKN_FIZIKSEL_DURUM_KOD_ID: data.fizikselDurumuID,
      MKN_ONCELIK_ID: data.oncelikIDDetay,
      MKN_RISK_PUAN: data.riskPuani,
      MKN_KURULUM_TARIH: formatDateWithDayjs(data.kurulumTarihi),
      MKN_ISLETIM_SISTEMI_KOD_ID: data.isletimSistemiID,
      MKN_IP_NO: data.ipNo,
      MKN_AGIRLIK: data.agirlik,
      MKN_AGIRLIK_BIRIM_KOD_ID: data.agirlikBirimID,
      MKN_HACIM: data.hacim,
      MKN_HACIM_BIRIM_KOD_ID: data.hacimBirimID,
      MKN_KAPASITE: data.kapasite,
      MKN_KAPASITE_BIRIM_KOD_ID: data.kapasiteBirimID,
      MKN_ELEKTRIK_TUKETIM: data.elektrikTuketimi,
      MKN_ELEKTRIK_TUKETIM_BIRIM_KOD_ID: data.elektrikTuketimiBirimID,
      MKN_VOLTAJ: data.voltaj,
      MKN_GUC: data.guc,
      MKN_FAZ: data.faz,
      MKN_VALF_TIP_KOD_ID: data.valfTipiID,
      MKN_VALF_BOYUT_KOD_ID: data.valfBoyutuID,
      MKN_GIRIS_BOYUT_KOD_ID: data.girisBoyutuID,
      MKN_CIKIS_BOYUT_KOD_ID: data.cikisBoyutuID,
      MKN_KONNEKTOR_KOD_ID: data.konnektorID,
      MKN_BASINC_KOD_ID: data.makineBasincID,
      MKN_BASINC_MIKTAR: data.basincMiktar,
      MKN_BASINC_BIRIM_KOD_ID: data.basincMiktarBirimID,
      MKN_DEVIR: data.devirSayisi,
      MKN_TEKNIK_MOTOR_GUCU: data.motorGucu,
      MKN_TEKNIK_SILINDIR_SAYISI: data.silindirSayisi,
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
      MKN_KIRA: data.kiralik,
      MKN_KIRA_FIRMA_ID: data.kiralikFirmaID,
      MKN_KIRA_BASLANGIC_TARIH: formatDateWithDayjs(data.kiraBaslangicTarihi),
      MKN_KIRA_BITIS_TARIH: formatDateWithDayjs(data.kiraBitisTarihi),
      MKN_KIRA_SURE: data.kiraSuresi,
      MKN_KIRA_PERIYOD: data.kiraSuresiBirim ? data.kiraSuresiBirim.label ?? data.kiraSuresiBirim : null,
      MKN_KIRA_SURE_BIRIM_KOD_ID: data.kiraSuresiBirimID,
      MKN_KIRA_TUTAR: data.kiraTutari,
      MKN_KIRA_ACIKLAMA: data.kiraAciklama,
      MKN_SATIS: data.satildi,
      MKN_SATIS_NEDEN: data.satisNedeni,
      MKN_SATIS_TARIH: formatDateWithDayjs(data.satisTarihi),
      MKN_SATIS_YER: data.satisYeri,
      MKN_SATIS_FIYAT: data.satisTutari,
      MKN_SATIS_ACIKLAMA: data.satisAciklama,
      // Yakit Bilgileri sekmesi
      // MKN_YAKIT_TIP_ID: data.makineYakitTipiID,
      // MKN_YAKIT_DEPO_HACMI: data.YakitDepoHacmi,
      // MKN_YAKIT_SAYAC_TAKIP: data.makineYakitSayacTakibi,
      // MKN_YAKIT_SAYAC_GUNCELLE: data.makineYakitSayacGuncellemesi,
      // MKN_YAKIT_ONGORULEN_MIN: data.ongorulenMin,
      // MKN_YAKIT_ONGORULEN_MAX: data.ongorulenMax,
      // MKN_YAKIT_GERCEKLESEN: data.gerceklesen,
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
      // :data.ozelAlan11,
      MKN_OZEL_ALAN_11_KOD_ID: data.ozelAlan11ID,
      // :data.ozelAlan12,
      MKN_OZEL_ALAN_12_KOD_ID: data.ozelAlan12ID,
      // :data.ozelAlan13,
      MKN_OZEL_ALAN_13_KOD_ID: data.ozelAlan13ID,
      // :data.ozelAlan14,
      MKN_OZEL_ALAN_14_KOD_ID: data.ozelAlan14ID,
      // :data.ozelAlan15,
      MKN_OZEL_ALAN_15_KOD_ID: data.ozelAlan15ID,
      MKN_OZEL_ALAN_16: data.ozelAlan16,
      MKN_OZEL_ALAN_17: data.ozelAlan17,
      MKN_OZEL_ALAN_18: data.ozelAlan18,
      MKN_OZEL_ALAN_19: data.ozelAlan19,
      MKN_OZEL_ALAN_20: data.ozelAlan20,
      MKN_GUVENLIK_NOT: data.makineGuvenlikNotu,
      MKN_GENEL_NOT: data.makineGenelNot,
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
          onDrawerClose();
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
          width="1200px"
          title={
            <div className="flex items-start flex-col">
              <Text type="secondary" className="font-light text-[12px]">
                PBT PRO / {t("ekipmanSicilKarti")}
              </Text>
              <Text>{watch("makineKodu")}</Text>
            </div>
          }
          placement="right"
          onClose={onClose}
          open={open}
          rootClassName="[&_.ant-drawer-content]:bg-[#f5f5f5] [&_.ant-drawer-body]:bg-[#f5f5f5] [&_.ant-drawer-header]:bg-white"
          extra={
            <Space>
              <Button onClick={onClose}>İptal</Button>
              <Button type="submit" onClick={methods.handleSubmit(onSubmit)} style={{ backgroundColor: "#2bc770", borderColor: "#2bc770", color: "#ffffff" }}>
                Güncelle
              </Button>
            </Space>
          }
        >
          {loading ? (
            <Spin spinning={loading} size="large" style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
              {/* İçerik yüklenirken gösterilecek alan */}
            </Spin>
          ) : (
            <form onSubmit={methods.handleSubmit(onSubmit)}>
              <MainTabs />
              <Tabs update={true} />
            </form>
          )}
        </Drawer>
      </ConfigProvider>
    </FormProvider>
  );
}
