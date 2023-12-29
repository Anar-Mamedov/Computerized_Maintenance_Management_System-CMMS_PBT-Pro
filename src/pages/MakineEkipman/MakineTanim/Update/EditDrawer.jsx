import tr_TR from "antd/es/locale/tr_TR";
import { PlusOutlined } from "@ant-design/icons";
import { Button, Drawer, Space, ConfigProvider, Modal } from "antd";
import React, { useEffect, useState, useTransition } from "react";
import MainTabs from "./components/MainTabs/MainTabs";
import secondTabs from "./components/secondTabs/secondTabs";
import { useForm, Controller, useFormContext, FormProvider, set } from "react-hook-form";
import dayjs from "dayjs";
import AxiosInstance from "../../../../api/http";
import Footer from "../Footer";
import SecondTabs from "./components/secondTabs/secondTabs";

export default function EditDrawer({ selectedRow, onDrawerClose, drawerVisible, onRefresh }) {
  const [, startTransition] = useTransition();
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
        onDrawerClose(); // Close the drawer
        onRefresh();
        reset();
      },
      onCancel: () => {
        // Do nothing, continue from where the user left off
      },
    });
  };

  // back-end'e gönderilecek veriler

  const handleClick = () => {
    const values = methods.getValues();
    console.log(onSubmit(values));
  };

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
      // :data.MakineKiraSuresiBirim,
      // :data.MakineKiraSuresiBirimID, // ??
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
      MKN_GUVENLIK_NOTU: data.makineGuvenlikNotu,
      // add more fields as needed
    };

    // AxiosInstance.post("/api/endpoint", { Body }).then((response) => {
    // handle response
    // });

    AxiosInstance.post("AddMakine?ID=24", Body)
      .then((response) => {
        // Handle successful response here, e.g.:
        console.log("Data sent successfully:", response);
        setOpen(false);
        onRefresh();
        reset();
      })
      .catch((error) => {
        // Handle errors here, e.g.:
        console.error("Error sending data:", error);
      });
    console.log({ Body });
  };

  // İş Emri No değerini her drawer açıldığında güncellemek için
  // useEffect(() => {
  //   if (open) {
  //     AxiosInstance.get("IsEmriKodGetir") // Replace with your actual API endpoint
  //       .then((response) => {
  //         // Assuming the response contains the new work order number in 'response.Tanim'
  //         setValue("work_order_no", response.Tanim);
  //       })
  //       .catch((error) => {
  //         console.error("Error fetching new work order number:", error);
  //       });
  //   }
  // }, [open, setValue]);

  // İş Emri No değerini her drawer açıldığında güncellemek için son

  useEffect(() => {
    if (drawerVisible && selectedRow) {
      // startTransition(() => {
      // Object.keys(selectedRow).forEach((key) => {
      //   console.log(key, selectedRow[key]);
      //   setValue(key, selectedRow[key]);
      // setValue("isEmriSelectedId", selectedRow.key);
      setValue("makineKodu", selectedRow.MKN_KOD);
      setValue("makineTanimi", selectedRow.MKN_TANIM);
      setValue("location", selectedRow.MKN_LOKASYON);
      setValue("locationID", selectedRow.MKN_LOKASYON_ID);
      setValue("MakineTipi", selectedRow.MKN_TIP);
      setValue("MakineTipiID", selectedRow.MKN_TIP_KOD_ID);
      setValue("Kategori", selectedRow.MKN_KATEGORI);
      setValue("KategoriID", selectedRow.MKN_KATEGORI_KOD_ID);
      setValue("MakineMarka", selectedRow.MKN_MARKA);
      setValue("MakineMarkaID", selectedRow.MKN_MARKA_KOD_ID);
      const timeoutId = setTimeout(() => {
        setValue("MakineModel", selectedRow.MKN_MODEL);
        setValue("MakineModelID", selectedRow.MKN_MODEL_KOD_ID);
      }, 500); // Delay of 500 milliseconds
      setValue("makineOperator", selectedRow.MKN_OPERATOR);
      setValue("makineOperatorID", selectedRow.MKN_OPERATOR_PERSONEL_ID);
      setValue("MakineDurum", selectedRow.MKN_DURUM);
      setValue("MakineDurumID", selectedRow.MKN_DURUM_KOD_ID);
      setValue("makineSeriNO", selectedRow.MKN_SERI_NO);
      setValue("masterMakineTanimi", selectedRow.MKN_MASTER_MAKINE_TANIM);
      setValue("masterMakineID", selectedRow.MKN_MASTER_ID);
      setValue("makineTakvimTanimi", selectedRow.MKN_TAKVIM);
      setValue("makineTakvimID", selectedRow.MKN_TAKVIM_ID);
      setValue("uretici", selectedRow.MKN_URETICI);
      setValue("uretimYili", selectedRow.MKN_URETIM_YILI);
      setValue(
        "makineGarantiBitisTarihi",
        selectedRow.MKN_GARANTI_BITIS && dayjs(selectedRow.MKN_GARANTI_BITIS).isValid()
          ? dayjs(selectedRow.MKN_GARANTI_BITIS)
          : ""
      );
      setValue(
        "time",
        selectedRow.editTime && dayjs(selectedRow.editTime, "HH:mm:ss").isValid()
          ? dayjs(selectedRow.editTime, "HH:mm:ss")
          : null
      );
      setValue("makineDurusBirimMaliyeti", selectedRow.MKN_DURUS_MALIYET);
      setValue("makinePlanCalismaSuresi", selectedRow.MKN_YILLIK_PLANLANAN_CALISMA_SURESI);
      setValue("makineAktif", selectedRow.MKN_AKTIF);
      setValue("makineKalibrasyon", selectedRow.MKN_KALIBRASYON_VAR);
      setValue("kritikMakine", selectedRow.MKN_KRITIK_MAKINE);
      setValue("makineGucKaynagi", selectedRow.MKN_GUC_KAYNAGI);
      setValue("makineIsBildirimi", selectedRow.MKN_IS_TALEP);
      setValue("makineYakitKullanim", selectedRow.MKN_YAKIT_KULLANIM);
      setValue("makineOtonomBakim", selectedRow.MKN_OTONOM_BAKIM);
      // detay bilgi sekmesi
      setValue("makineMasrafMerkeziTanim", selectedRow.MKN_MASRAF_MERKEZ);
      setValue("makineMasrafMerkeziID", selectedRow.MKN_MASRAF_MERKEZ_KOD_ID);
      setValue("makineAtolyeTanim", selectedRow.MKN_ATOLYE);
      setValue("makineAtolyeID", selectedRow.MKN_ATOLYE_ID);
      setValue("makineBakimGrubu", selectedRow.MKN_BAKIM_GRUP);
      setValue("makineBakimGrubuID", selectedRow.MKN_BAKIM_GRUP_ID);
      setValue("makineArizaGrubu", selectedRow.MKN_ARIZA_GRUP);
      setValue("makineArizaGrubuID", selectedRow.MKN_ARIZA_GRUP_ID);
      setValue("makineServisSaglayici", selectedRow.MKN_SERVIS_SAGLAYICI);
      setValue("makineServisSaglayiciID", selectedRow.MKN_SERVIS_SAGLAYICI_KOD_ID);
      setValue("makineServisSekli", selectedRow.MKN_SERVIS_SEKLI);
      setValue("makineServisSekliID", selectedRow.MKN_SERVIS_SEKLI_KOD_ID);
      setValue("makineTeknikSeviyesi", selectedRow.MKN_TEKNIK_SERVIS);
      setValue("makineTeknikSeviyesiID", selectedRow.MKN_TEKNIK_SERVIS_KOD_ID);
      setValue("makineFizikselDurumu", selectedRow.MKN_FIZIKSEL_DURUM);
      setValue("makineFizikselDurumuID", selectedRow.MKN_FIZIKSEL_DURUM_KOD_ID);
      setValue("makineOncelik", selectedRow.MKN_ONCELIK);
      setValue("makineOncelikID", selectedRow.MKN_ONCELIK_ID);
      setValue("makineRiskPuani", selectedRow.MKN_RISK_PUAN);
      setValue(
        "makineKurulumTarihi",
        selectedRow.MKN_KURULUM_TARIH && dayjs(selectedRow.MKN_KURULUM_TARIH).isValid()
          ? dayjs(selectedRow.MKN_KURULUM_TARIH)
          : ""
      );
      setValue("MakineIsletimSistemi", selectedRow.MKN_ISLETIM_SISTEMI);
      setValue("MakineIsletimSistemiID", selectedRow.MKN_ISLETIM_SISTEMI_KOD_ID);
      setValue("makineIPNo", selectedRow.MKN_IP_NO);
      setValue("MakineAgirlik", selectedRow.MKN_AGIRLIK);
      setValue("MakineAgirlikBirim", selectedRow.MKN_AGIRLIK_BIRIM);
      setValue("MakineAgirlikBirimID", selectedRow.MKN_AGIRLIK_BIRIM_KOD_ID);
      setValue("MakineHacim", selectedRow.MKN_HACIM);
      setValue("MakineHacimBirim", selectedRow.MKN_HACIM_BIRIM);
      setValue("MakineHacimBirimID", selectedRow.MKN_HACIM_BIRIM_KOD_ID);
      setValue("MakineKapasite", selectedRow.MKN_KAPASITE);
      setValue("MakineKapasiteBirim", selectedRow.MKN_KAPASITE_BIRIM);
      setValue("MakineKapasiteBirimID", selectedRow.MKN_KAPASITE_BIRIM_KOD_ID);
      setValue("MakineElektrikTuketim", selectedRow.MKN_ELEKTRIK_TUKETIM);
      setValue("MakineElektrikTuketimBirim", selectedRow.MKN_ELEKTRIK_TUKETIM_BIRIM);
      setValue("MakineElektrikTuketimBirimID", selectedRow.MKN_ELEKTRIK_TUKETIM_BIRIM_KOD_ID);
      setValue("makineVoltaj", selectedRow.MKN_VOLTAJ);
      setValue("makineGuc", selectedRow.MKN_GUC);
      setValue("makineFaz", selectedRow.MKN_FAZ);
      setValue("makineValfTipi", selectedRow.MKN_VALF_TIP);
      setValue("makineValfTipiID", selectedRow.MKN_VALF_TIP_KOD_ID);
      setValue("makineValfBoyutu", selectedRow.MKN_VALF_BOYUT);
      setValue("makineValfBoyutuID", selectedRow.MKN_VALF_BOYUT_KOD_ID);
      setValue("makineGirisBoyutu", selectedRow.MKN_GIRIS_BOYUT);
      setValue("makineGirisBoyutuID", selectedRow.MKN_GIRIS_BOYUT_KOD_ID);
      setValue("makineCikisBoyutu", selectedRow.MKN_CIKIS_BOYUT);
      setValue("makineCikisBoyutuID", selectedRow.MKN_CIKIS_BOYUT_KOD_ID);
      setValue("makineKonnektor", selectedRow.MKN_KONNEKTOR);
      setValue("makineKonnektorID", selectedRow.MKN_KONNEKTOR_KOD_ID);
      setValue("makineBasinc", selectedRow.MKN_BASINC);
      setValue("makineBasincID", selectedRow.MKN_BASINC_KOD_ID);
      setValue("MakineBasincMiktar", selectedRow.MKN_BASINC_MIKTAR);
      setValue("MakineBasincMiktarBirim", selectedRow.MKN_BASINC_MIKTAR_BIRIM);
      setValue("MakineBasincMiktarBirimID", selectedRow.MKN_BASINC_MIKTAR_BIRIM_KOD_ID);
      setValue("makineDevirSayisi", selectedRow.MKN_DEVIR);
      setValue("makineMotorGucu", selectedRow.MKN_TEKNIK_MOTOR_GUCU);
      setValue("makineSilindirSayisi", selectedRow.MKN_TEKNIK_SILINDIR_SAYISI);
      // finansal bilgiler sekmesi
      setValue("makineSatinalmaFirma", selectedRow.MKN_ALIS_FIRMA);
      setValue("makineSatinalmaFirmaID", selectedRow.MKN_ALIS_FIRMA_ID);
      setValue(
        "makineSatinalmaTarihi",
        selectedRow.MKN_ALIS_TARIH && dayjs(selectedRow.MKN_ALIS_TARIH).isValid()
          ? dayjs(selectedRow.MKN_ALIS_TARIH)
          : ""
      );
      setValue("satinalmaFiyati", selectedRow.MKN_ALIS_FIYAT);
      setValue("satinalmaFaturaNo", selectedRow.MKN_FATURA_NO);
      setValue(
        "makineSatinalmaFaturaTarihi",
        selectedRow.MKN_FATURA_TARIH && dayjs(selectedRow.MKN_FATURA_TARIH).isValid()
          ? dayjs(selectedRow.MKN_FATURA_TARIH)
          : ""
      );
      setValue("satinalmaFaturaTutar", selectedRow.MKN_FATURA_TUTAR);
      setValue("makineKrediKrediMiktari", selectedRow.MKN_KREDI_MIKTARI);
      setValue("makineKrediKrediOrani", selectedRow.KREDI_ORANI);
      setValue(
        "makineKrediBaslamaTarihi",
        selectedRow.MKN_KREDI_BASLAMA_TARIHI && dayjs(selectedRow.MKN_KREDI_BASLAMA_TARIHI).isValid()
          ? dayjs(selectedRow.MKN_KREDI_BASLAMA_TARIHI)
          : ""
      );
      setValue(
        "makineKrediBitisTarihi",
        selectedRow.MKN_KREDI_BITIS_TARIHI && dayjs(selectedRow.MKN_KREDI_BITIS_TARIHI).isValid()
          ? dayjs(selectedRow.MKN_KREDI_BITIS_TARIHI)
          : ""
      );
      // setValue(
      //   "amortismanHesapTarihi",
      //   selectedRow.MKN_AMORTISMAN_HESAP_TARIHI && dayjs(selectedRow.MKN_AMORTISMAN_HESAP_TARIHI).isValid()
      //     ? dayjs(selectedRow.MKN_AMORTISMAN_HESAP_TARIHI)
      //     : ""
      // );
      // setValue("amortismanDefterDegeri", selectedRow.MKN_AMORTISMAN_DEFTER_DEGERI);
      // setValue("amortismanFaydaliOmur", selectedRow.MKN_AMORTISMAN_FAYDALI_OMUR);
      // setValue("amortismanTutari", selectedRow.MKN_AMORTISMAN_TUTARI);
      // setValue("amortismanNetAktifDegeri", selectedRow.MKN_AMORTISMAN_NET_AKTIF_DEGERI);
      // setValue("amortismanKalanSure", selectedRow.MKN_AMORTISMAN_KALAN_SURE);
      setValue("makineKiralik", selectedRow.MKN_KIRA);
      setValue("makineFirma", selectedRow.MKN_KIRA_FIRMA);
      setValue("makineFirmaID", selectedRow.MKN_KIRA_FIRMA_ID);
      setValue(
        "makineKiraBaslangicTarihi",
        selectedRow.MKN_KIRA_BASLANGIC_TARIH && dayjs(selectedRow.MKN_KIRA_BASLANGIC_TARIH).isValid()
          ? dayjs(selectedRow.MKN_KIRA_BASLANGIC_TARIH)
          : ""
      );
      setValue(
        "makineKiraBitisTarihi",
        selectedRow.MKN_KIRA_BITIS_TARIH && dayjs(selectedRow.MKN_KIRA_BITIS_TARIH).isValid()
          ? dayjs(selectedRow.MKN_KIRA_BITIS_TARIH)
          : ""
      );
      setValue("MakineKiraSuresi", selectedRow.MKN_KIRA_SURE);
      setValue("MakineKiraSuresiBirim", selectedRow.MKN_KIRA_SURE_BIRIM);
      setValue("MakineKiraSuresiBirimID", selectedRow.MKN_KIRA_SURE_BIRIM_KOD_ID);
      setValue("kiraTutari", selectedRow.MKN_KIRA_TUTAR);
      setValue("kiraAciklama", selectedRow.MKN_KIRA_ACIKLAMA);
      setValue("makineSatıldı", selectedRow.MKN_SATIS);
      setValue("makineSatisNedeni", selectedRow.MKN_SATIS_NEDEN);
      setValue(
        "makineSatisTarihi",
        selectedRow.MKN_SATIS_TARIH && dayjs(selectedRow.MKN_SATIS_TARIH).isValid()
          ? dayjs(selectedRow.MKN_SATIS_TARIH)
          : ""
      );
      setValue("makineSatisYeri", selectedRow.MKN_SATIS_YER);
      setValue("satisTutari", selectedRow.MKN_SATIS_FIYAT);
      setValue("makineSatisAciklama", selectedRow.MKN_SATIS_ACIKLAMA);
      // Yakit Bilgileri sekmesi
      // setValue("makineYakitTipi", selectedRow.MKN_YAKIT_TIP);
      // setValue("makineYakitTipiID", selectedRow.MKN_YAKIT_TIP_ID);
      // setValue("YakitDepoHacmi", selectedRow.MKN_YAKIT_DEPO_HACMI);
      // setValue("makineYakitSayacTakibi", selectedRow.MKN_YAKIT_SAYAC_TAKIP);
      // setValue("makineYakitSayacGuncellemesi", selectedRow.MKN_YAKIT_SAYAC_GUNCELLE);
      // setValue("ongorulenMin", selectedRow.MKN_YAKIT_ONGORULEN_MIN);
      // setValue("ongorulenMax", selectedRow.MKN_YAKIT_ONGORULEN_MAX);
      // setValue("gerceklesen", selectedRow.MKN_YAKIT_GERCEKLESEN);
      // Özel Alanlar sekmesi
      setValue("ozelAlan_1", selectedRow.MKN_OZEL_ALAN_1);
      setValue("ozelAlan_2", selectedRow.MKN_OZEL_ALAN_2);
      setValue("ozelAlan_3", selectedRow.MKN_OZEL_ALAN_3);
      setValue("ozelAlan_4", selectedRow.MKN_OZEL_ALAN_4);
      setValue("ozelAlan_5", selectedRow.MKN_OZEL_ALAN_5);
      setValue("ozelAlan_6", selectedRow.MKN_OZEL_ALAN_6);
      setValue("ozelAlan_7", selectedRow.MKN_OZEL_ALAN_7);
      setValue("ozelAlan_8", selectedRow.MKN_OZEL_ALAN_8);
      setValue("ozelAlan_9", selectedRow.MKN_OZEL_ALAN_9);
      setValue("ozelAlan_10", selectedRow.MKN_OZEL_ALAN_10);
      setValue("ozelAlan_11", selectedRow.MKN_OZEL_ALAN_11);
      setValue("ozelAlan_11_ID", selectedRow.MKN_OZEL_ALAN_11_KOD_ID);
      setValue("ozelAlan_12", selectedRow.MKN_OZEL_ALAN_12);
      setValue("ozelAlan_12_ID", selectedRow.MKN_OZEL_ALAN_12_KOD_ID);
      setValue("ozelAlan_13", selectedRow.MKN_OZEL_ALAN_13);
      setValue("ozelAlan_13_ID", selectedRow.MKN_OZEL_ALAN_13_KOD_ID);
      setValue("ozelAlan_14", selectedRow.MKN_OZEL_ALAN_14);
      setValue("ozelAlan_14_ID", selectedRow.MKN_OZEL_ALAN_14_KOD_ID);
      setValue("ozelAlan_15", selectedRow.MKN_OZEL_ALAN_15);
      setValue("ozelAlan_15_ID", selectedRow.MKN_OZEL_ALAN_15_KOD_ID);
      setValue("ozelAlan_16", selectedRow.MKN_OZEL_ALAN_16);
      setValue("ozelAlan_17", selectedRow.MKN_OZEL_ALAN_17);
      setValue("ozelAlan_18", selectedRow.MKN_OZEL_ALAN_18);
      setValue("ozelAlan_19", selectedRow.MKN_OZEL_ALAN_19);
      setValue("ozelAlan_20", selectedRow.MKN_OZEL_ALAN_20);
      // Notlar sekmesi
      setValue("makineGenelNot", selectedRow.MKN_GUVENLIK_NOT);
      setValue("makineGuvenlikNotu", selectedRow.MKN_GUVENLIK_NOTU);
      // add more fields as needed
      // Cleanup function to clear timeout if the component unmounts
      return () => clearTimeout(timeoutId);
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
            width="1660px"
            title="Düzenleme İş Emri"
            placement={"right"}
            onClose={onDrawerClose}
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
