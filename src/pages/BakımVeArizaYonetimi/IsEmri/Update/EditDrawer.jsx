import React, { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { Button, Drawer, Space, ConfigProvider, Modal, Spin, message, Alert } from "antd";
import { QrcodeOutlined } from "@ant-design/icons";
import tr_TR from "antd/es/locale/tr_TR";
import AxiosInstance from "../../../../api/http";
import MainTabs from "./components/MainTabs/MainTabs";
import Footer from "./components/Footer";
import SecondTabs from "./components/SecondTabs/SecondTabs";
import CloseForms from "./components/SecondTabs/components/KapamaBilgileri/Forms";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { t } from "i18next";
import QRCodeGenerator from "../../../../utils/components/QRCodeGenerator";

dayjs.extend(customParseFormat);

export default function EditDrawer({ selectedRow, onDrawerClose, drawerVisible, onRefresh }) {
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [open, setOpen] = useState(drawerVisible);
  const [disabled, setDisabled] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [onayCheck, setOnayCheck] = useState(false);
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [assignmentRequestKey, setAssignmentRequestKey] = useState(0);
  const [closeModalOpen, setCloseModalOpen] = useState(false);
  const [closeModalDisabled, setCloseModalDisabled] = useState(false);
  const [closeErrorMessage, setCloseErrorMessage] = useState("");
  const [closeErrorMessageShow, setCloseErrorMessageShow] = useState(false);
  // API'den gelen zorunluluk bilgilerini simüle eden bir örnek
  const [fieldRequirements, setFieldRequirements] = React.useState({
    // Varsayılan olarak zorunlu değil
    // Diğer alanlar için de benzer şekilde...
  });

  const methods = useForm({
    defaultValues: {
      kapali: false,
      isEmriNo: "",
      secilenIsEmriID: "",
      duzenlenmeTarihi: "",
      duzenlenmeSaati: "",
      isEmriDurum: "",
      isEmriDurumID: "",
      bagliIsEmriTanim: "",
      bagliIsEmriID: "",
      lokasyonTanim: "",
      lokasyonID: "",
      tamLokasyonTanim: "",
      makine: "",
      makineID: "",
      makineTanim: "",
      garantiBitis: "",
      ekipman: "",
      ekipmanID: "",
      ekipmanTanim: "",
      sayac: "",
      isEmriTipi: null,
      isEmriTipiID: "",
      makineDurumu: null,
      makineDurumuID: "",
      // Detay Bilgiler
      prosedur: "",
      prosedurID: "",
      konu: "",
      oncelikTanim: "",
      oncelikID: "",
      atolyeTanim: "",
      atolyeID: "",
      talimatTanim: "",
      talimatID: "",
      disServisAciklama: "",
      masrafMerkezi: "",
      masrafMerkeziID: "",
      proje: "",
      projeID: "",
      tamamlanmaOranı: "",
      planlananBaslama: "",
      planlananBaslamaSaati: "",
      planlananBitis: "",
      planlananBitisSaati: "",
      baslamaZamani: "",
      baslamaZamaniSaati: "",
      bitisZamani: "",
      bitisZamaniSaati: "",
      calismaSaat: "",
      calismaDakika: "",
      firma: "",
      firmaID: "",
      sozlesme: "",
      sozlesmeID: "",
      evrakNo: "",
      evrakTarihi: "",
      maliyet: "",
      garantiKapsami: "",
      prosedurTipi: null,
      prosedurTipiID: "",
      prosedurNedeni: null,
      prosedurNedeniID: "",
      // Süre Bilgileri tabı
      lojistikSuresi: 0,
      seyahatSuresi: 0,
      onaySuresi: 0,
      beklemeSuresi: 0,
      digerSuresi: 0,
      mudahaleSuresi: 0,
      calismaSuresi: 0,
      toplamIsSuresi: 0,
      // Maliyetler tabı
      malzemeMaliyetiGercek: 0,
      malzemeMaliyetiOngorulen: 0,
      iscilikMaliyetiGercek: 0,
      iscilikMaliyetiOngorulen: 0,
      disServisMaliyetiOngorulen: 0,
      genelGiderlerGercek: 0,
      genelGiderlerOngorulen: 0,
      indirimGercek: 0,
      indirimOngorulen: 0,
      kdvGercek: 0,
      kdvOngorulen: 0,
      toplamMaliyetGercek: 0,
      toplamMaliyetOngorulen: 0,
      // Özel alanlar
      ozelAlan1: "",
      ozelAlan2: "",
      ozelAlan3: "",
      ozelAlan4: "",
      ozelAlan5: "",
      ozelAlan6: "",
      ozelAlan7: "",
      ozelAlan8: "",
      ozelAlan9: "",
      ozelAlan10: "",
      ozelAlan11: null,
      ozelAlan12: null,
      ozelAlan13: null,
      ozelAlan14: null,
      ozelAlan15: null,
      ozelAlan16: "",
      ozelAlan17: "",
      ozelAlan18: "",
      ozelAlan19: "",
      ozelAlan20: "",
      // Notlar
      notlar: "",
      kontrolSonucNotu: "",
      //Açıklama
      isEmriAciklama: "",
      // ... Tüm default değerleriniz
    },
  });

  const { setValue, reset, watch } = methods;

  // iş emri tipine göre zorunlu alanları belirleme

  // iş emri tipi selectboxundaki seçeneklere göre zorunlu alanları belirleme

  const selectedOption = watch("selectedOption"); // `selectedOption` form alanını izle

  useEffect(() => {
    if (selectedOption) {
      // `selectedOption` içindeki değerleri `fieldRequirements` durumuna aktar
      setValue("prosedurTab", selectedOption.IMT_CAGRILACAK_PROSEDUR);
      setFieldRequirements({
        lokasyonTanim: selectedOption.IMT_LOKASYON,
        makine: selectedOption.IMT_MAKINE,
        ekipman: selectedOption.IMT_EKIPMAN,
        makineDurumu: selectedOption.IMT_MAKINE_DURUM,
        sayac: selectedOption.IMT_SAYAC_DEGERI,
        prosedur: selectedOption.IMT_PROSEDUR,
        prosedurTipi: selectedOption.IMT_IS_TIP,
        prosedurNedeni: selectedOption.IMT_IS_NEDEN,
        konu: selectedOption.IMT_KONU,
        oncelikTanim: selectedOption.IMT_ONCELIK,
        atolyeTanim: selectedOption.IMT_ATOLYE,
        takvimTanim: selectedOption.IMT_TAKVIM,
        talimatTanim: selectedOption.IMT_TALIMAT,
        masrafMerkezi: selectedOption.IMT_MASRAF_MERKEZ,
        proje: selectedOption.IMT_PROJE,
        referansNo: selectedOption.IMT_REFERANS_NO,
        planlananBaslama: selectedOption.IMT_PLAN_TARIH,
        planlananBitis: selectedOption.IMT_PLAN_BITIS,
        firma: selectedOption.IMT_FIRMA,
        sozlesme: selectedOption.IMT_SOZLESME,
        evrakNo: selectedOption.IMT_EVRAK_NO,
        evrakTarihi: selectedOption.IMT_EVRAK_TARIHI,
        maliyet: selectedOption.IMT_MALIYET,
        toplamMaliyetGercek: selectedOption.IMT_TOPLAM_MALIYET_ZORUNLU,
        // Tab gösterim durumları
        IMT_DETAY_TAB: selectedOption.IMT_DETAY_TAB,
        IMT_KONTROL_TAB: selectedOption.IMT_KONTROL_TAB,
        IMT_PERSONEL_TAB: selectedOption.IMT_PERSONEL_TAB,
        IMT_MALZEME_TAB: selectedOption.IMT_MALZEME_TAB,
        IMT_DURUS_TAB: selectedOption.IMT_DURUS_TAB,
        IMT_SURE_TAB: selectedOption.IMT_SURE_TAB,
        IMT_MALIYET_TAB: selectedOption.IMT_MALIYET_TAB,
        IMT_OLCUM_TAB: selectedOption.IMT_OLCUM_TAB,
        IMT_ARAC_GEREC_TAB: selectedOption.IMT_ARAC_GEREC_TAB,
        IMT_OZEL_ALAN_TAB: selectedOption.IMT_OZEL_ALAN_TAB,
        IMT_NOTLAR_TAB: selectedOption.IMT_NOTLAR_TAB,
        // Diğer alanlar...
      });
    }
  }, [selectedOption, setFieldRequirements]);

  // iş emri tipi selectboxundaki seçeneklere göre zorunlu alanları belirleme son.

  const varsayilanIsEmriTipID = watch("isEmriTipiID");

  useEffect(() => {
    const handleDefaultRequirementsFetch = async () => {
      if (open) {
        try {
          const response = await AxiosInstance.get(`IsEmriTip`);
          const data = response; // API'den gelen veriyi al

          // "IMT_VARSAYILAN": true olan objeyi bul
          const defaultItem = data.find((item) => item.TB_ISEMRI_TIP_ID === varsayilanIsEmriTipID);

          if (defaultItem) {
            setValue("prosedurTab", defaultItem.IMT_CAGRILACAK_PROSEDUR);
            // Eğer varsayılan obje bulunursa, form alanlarını set et
            setFieldRequirements({
              lokasyonTanim: defaultItem.IMT_LOKASYON,
              makine: defaultItem.IMT_MAKINE,
              ekipman: defaultItem.IMT_EKIPMAN,
              makineDurumu: defaultItem.IMT_MAKINE_DURUM,
              sayac: defaultItem.IMT_SAYAC_DEGERI,
              prosedur: defaultItem.IMT_PROSEDUR,
              prosedurTipi: defaultItem.IMT_IS_TIP,
              prosedurNedeni: defaultItem.IMT_IS_NEDEN,
              konu: defaultItem.IMT_KONU,
              oncelikTanim: defaultItem.IMT_ONCELIK,
              atolyeTanim: defaultItem.IMT_ATOLYE,
              takvimTanim: defaultItem.IMT_TAKVIM,
              talimatTanim: defaultItem.IMT_TALIMAT,
              masrafMerkezi: defaultItem.IMT_MASRAF_MERKEZ,
              proje: defaultItem.IMT_PROJE,
              referansNo: defaultItem.IMT_REFERANS_NO,
              planlananBaslama: defaultItem.IMT_PLAN_TARIH,
              planlananBitis: defaultItem.IMT_PLAN_BITIS,
              firma: defaultItem.IMT_FIRMA,
              sozlesme: defaultItem.IMT_SOZLESME,
              evrakNo: defaultItem.IMT_EVRAK_NO,
              evrakTarihi: defaultItem.IMT_EVRAK_TARIHI,
              maliyet: defaultItem.IMT_MALIYET,
              toplamMaliyetGercek: defaultItem.IMT_TOPLAM_MALIYET_ZORUNLU,
              // Tab gösterim durumları
              IMT_DETAY_TAB: defaultItem.IMT_DETAY_TAB,
              IMT_KONTROL_TAB: defaultItem.IMT_KONTROL_TAB,
              IMT_PERSONEL_TAB: defaultItem.IMT_PERSONEL_TAB,
              IMT_MALZEME_TAB: defaultItem.IMT_MALZEME_TAB,
              IMT_DURUS_TAB: defaultItem.IMT_DURUS_TAB,
              IMT_SURE_TAB: defaultItem.IMT_SURE_TAB,
              IMT_MALIYET_TAB: defaultItem.IMT_MALIYET_TAB,
              IMT_OLCUM_TAB: defaultItem.IMT_OLCUM_TAB,
              IMT_ARAC_GEREC_TAB: defaultItem.IMT_ARAC_GEREC_TAB,
              IMT_OZEL_ALAN_TAB: defaultItem.IMT_OZEL_ALAN_TAB,
              IMT_NOTLAR_TAB: defaultItem.IMT_NOTLAR_TAB,
              // Burada defaultItem içerisindeki diğer alanlar için de benzer şekilde atama yapılabilir
              // Örneğin:
              // irtibatTelefonu: defaultItem.ISP_IRTIBAT_TEL,
              // email: defaultItem.ISP_MAIL,
              // Not: Yukarıdaki örnekteki alan isimleri API cevabınızda mevcut değil,
              // bu yüzden gerçek alan isimlerinizi kullanmanız gerekecek.
            });
          }
        } catch (error) {
          console.error("Veri çekilirken hata oluştu:", error);
        }
      }
    };

    handleDefaultRequirementsFetch();
  }, [open, setValue, methods.reset, varsayilanIsEmriTipID]);

  // iş emri tipine göre zorunlu alanları belirleme son

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await AxiosInstance.post(`GetOnayCheck?TB_ONAY_ID=1`); // API URL'niz
        if (response[0].ONY_AKTIF === 1) {
          setOnayCheck(true);
        } else {
          setOnayCheck(false);
        }
      } catch (error) {
        console.error("API isteğinde hata oluştu:", error);
      }
    };

    fetchData();
  }, []);

  // aşağıdaki useEffect verileri form elemanlarına set etmeden önce durum güncellemesi yapıyor ondan sonra verileri set ediyor

  useEffect(() => {
    const handleDataFetchAndUpdate = async () => {
      if (drawerVisible && selectedRow) {
        setOpen(true); // İşlemler tamamlandıktan sonra drawer'ı aç
        setLoading(true); // Yükleme başladığında
        try {
          const response = await AxiosInstance.get(`GetIsEmriById?isEmriId=${selectedRow.key}`);
          const item = response[0]; // Veri dizisinin ilk elemanını al
          // Form alanlarını set et
          setValue("secilenIsEmriID", item.TB_ISEMRI_ID);
          setValue("kapali", item.KAPALI);
          setValue("onayDurum", item.ISM_ONAY_DURUM);

          setValue("isEmriNo", item.ISEMRI_NO);
          setValue("duzenlenmeTarihi", item.DUZENLEME_TARIH ? (dayjs(item.DUZENLEME_TARIH).isValid() ? dayjs(item.DUZENLEME_TARIH) : null) : null);
          setValue("duzenlenmeSaati", item.DUZENLEME_SAAT ? (dayjs(item.DUZENLEME_SAAT, "HH:mm:ss").isValid() ? dayjs(item.DUZENLEME_SAAT, "HH:mm:ss") : null) : null);
          setValue("isEmriTipi", item.ISEMRI_TIP);
          setValue("isEmriTipiID", item.ISM_TIP_ID);
          setValue("isEmriDurum", item.DURUM);
          setValue("isEmriDurumID", item.ISM_DURUM_KOD_ID);
          setValue("bagliIsEmriTanim", item.ISM_BAGLI_ISEMRI_NO);
          setValue("bagliIsEmriID", item.ISM_BAGLI_ISEMRI_ID);
          setValue("lokasyonTanim", item.LOKASYON);
          setValue("lokasyonID", item.ISM_LOKASYON_ID);
          setValue("tamLokasyonTanim", item.TAM_LOKASYON);
          setValue("makine", item.MAKINE_KODU);
          setValue("makineID", item.ISM_MAKINE_ID);
          setValue("makineTanim", item.MAKINE_TANIMI);
          setValue("garantiBitis", item.ISM_GARANTI_BITIS);
          setValue("ekipman", item.ISM_EKIPMAN_KOD);
          setValue("ekipmanID", item.ISM_EKIPMAN_ID);
          setValue("ekipmanTanim", item.EKIPMAN);
          setValue("makineDurumu", item.MAKINE_DURUM);
          setValue("makineDurumuID", item.ISM_MAKINE_DURUM_KOD_ID);
          setValue("sayac", item.GUNCEL_SAYAC_DEGER);

          // detay Bilgiler alanları

          setValue("prosedur", item.ISM_PROSEDUR_KOD);
          setValue("prosedurID", item.ISM_REF_ID);
          setValue("konu", item.KONU);
          setValue("prosedurTipi", item.IS_TIPI);
          setValue("prosedurTipiID", item.ISM_TIP_KOD_ID);
          setValue("prosedurNedeni", item.IS_NEDENI);
          setValue("prosedurNedeniID", item.ISM_NEDEN_KOD_ID);
          setValue("oncelikTanim", item.ONCELIK);
          setValue("oncelikID", item.ISM_ONCELIK_ID);
          setValue("atolyeTanim", item.ATOLYE);
          setValue("atolyeID", item.ISM_ATOLYE_ID);
          setValue("talimatTanim", item.TALIMAT);
          setValue("talimatID", item.ISM_TALIMAT_ID);
          setValue("masrafMerkezi", item.MASRAF_MERKEZI);
          setValue("masrafMerkeziID", item.ISM_MASRAF_MERKEZ_ID);
          setValue("proje", item.ISM_PROJE);
          setValue("projeID", item.ISM_PROJE_ID);
          setValue("tamamlanmaOranı", item.TAMAMLANMA);
          setValue("planlananBaslama", item.PLAN_BASLAMA_TARIH ? (dayjs(item.PLAN_BASLAMA_TARIH).isValid() ? dayjs(item.PLAN_BASLAMA_TARIH) : null) : null);
          setValue(
            "planlananBaslamaSaati",
            item.PLAN_BASLAMA_SAAT ? (dayjs(item.PLAN_BASLAMA_SAAT, "HH:mm:ss").isValid() ? dayjs(item.PLAN_BASLAMA_SAAT, "HH:mm:ss") : null) : null
          );
          setValue("planlananBitis", item.PLAN_BITIS_TARIH ? (dayjs(item.PLAN_BITIS_TARIH).isValid() ? dayjs(item.PLAN_BITIS_TARIH) : null) : null);
          setValue("planlananBitisSaati", item.PLAN_BITIS_SAAT ? (dayjs(item.PLAN_BITIS_SAAT, "HH:mm:ss").isValid() ? dayjs(item.PLAN_BITIS_SAAT, "HH:mm:ss") : null) : null);
          setValue("baslamaZamani", item.BASLAMA_TARIH ? (dayjs(item.BASLAMA_TARIH).isValid() ? dayjs(item.BASLAMA_TARIH) : null) : null);
          setValue("baslamaZamaniSaati", item.BASLAMA_SAAT ? (dayjs(item.BASLAMA_SAAT, "HH:mm:ss").isValid() ? dayjs(item.BASLAMA_SAAT, "HH:mm:ss") : null) : null);
          setValue("bitisZamani", item.ISM_BITIS_TARIH ? (dayjs(item.ISM_BITIS_TARIH).isValid() ? dayjs(item.ISM_BITIS_TARIH) : null) : null);
          setValue("bitisZamaniSaati", item.ISM_BITIS_SAAT ? (dayjs(item.ISM_BITIS_SAAT, "HH:mm:ss").isValid() ? dayjs(item.ISM_BITIS_SAAT, "HH:mm:ss") : null) : null);

          // IS_SURESI'ni saat ve dakikaya çevirme
          const totalMinutes = item.IS_SURESI;
          const hours = Math.floor(totalMinutes / 60);
          const minutes = totalMinutes % 60;

          // Saat ve dakika değerlerini form alanlarına set etme
          setValue("calismaSaat", hours);
          setValue("calismaDakika", minutes);

          setValue("firma", item.FRIMA);
          setValue("firmaID", item.ISM_FIRMA_ID);
          setValue("sozlesme", item.ISM_SOZLESME_TANIM);
          setValue("sozlesmeID", item.ISM_FIRMA_SOZLESME_ID);
          setValue("evrakNo", item.ISM_EVRAK_NO);
          setValue("evrakTarihi", item.ISM_EVRAK_TARIHI ? (dayjs(item.ISM_EVRAK_TARIHI).isValid() ? dayjs(item.ISM_EVRAK_TARIHI) : null) : null);
          setValue("maliyet", item.ISM_MALIYET_DISSERVIS);
          setValue("garantiKapsami", item.GARANTI);
          setValue("disServisAciklama", item.ISM_DISSERVIS_ACIKLAMA);

          // Süre Bilgileri tabı
          setValue("lojistikSuresi", item.ISM_SURE_MUDAHALE_LOJISTIK);
          setValue("seyahatSuresi", item.ISM_SURE_MUDAHALE_SEYAHAT);
          setValue("onaySuresi", item.ISM_SURE_MUDAHALE_ONAY);
          setValue("beklemeSuresi", item.ISM_SURE_BEKLEME);
          setValue("digerSuresi", item.ISM_SURE_MUDAHALE_DIGER);
          setValue("mudahaleSuresi", item.ISM_SURE_PLAN_MUDAHALE);
          setValue("calismaSuresi", item.IS_SURESI);
          setValue("toplamIsSuresi", item.ISM_SURE_TOPLAM);

          // Maliyetler tabı
          setValue("malzemeMaliyetiGercek", item.ISM_MALIYET_MLZ);
          setValue("malzemeMaliyetiOngorulen", item.ISM_MALIYET_MLZ_O);
          setValue("iscilikMaliyetiGercek", item.ISM_MALIYET_PERSONEL);
          setValue("iscilikMaliyetiOngorulen", item.ISM_MALIYET_ISC_O);
          setValue("disServisMaliyetiOngorulen", item.ISM_MALIYET_DISSERVIS_O);
          setValue("genelGiderlerGercek", item.ISM_MALIYET_DIGER);
          setValue("genelGiderlerOngorulen", item.ISM_MALIYET_GENELGIDER_O);
          setValue("indirimGercek", item.ISM_MALIYET_INDIRIM);
          setValue("indirimOngorulen", item.ISM_MALIYET_INDIRIM_O);
          setValue("kdvGercek", item.ISM_MALIYET_KDV);
          setValue("kdvOngorulen", item.ISM_MALIYET_KDV_O);
          setValue("toplamMaliyetGercek", item.ISM_MALIYET_TOPLAM);
          setValue("toplamMaliyetOngorulen", item.ISM_MALIYET_TOPLAM_O);

          // Özel alanlar
          setValue("ozelAlan1", item.OZEL_ALAN_1);
          setValue("ozelAlan2", item.OZEL_ALAN_2);
          setValue("ozelAlan3", item.OZEL_ALAN_3);
          setValue("ozelAlan4", item.OZEL_ALAN_4);
          setValue("ozelAlan5", item.OZEL_ALAN_5);
          setValue("ozelAlan6", item.OZEL_ALAN_6);
          setValue("ozelAlan7", item.OZEL_ALAN_7);
          setValue("ozelAlan8", item.OZEL_ALAN_8);
          setValue("ozelAlan9", item.OZEL_ALAN_9);
          setValue("ozelAlan10", item.OZEL_ALAN_10);
          setValue("ozelAlan11", item.OZEL_ALAN_11);
          setValue("ozelAlan11ID", item.ISM_OZEL_ALAN_11_KOD_ID);
          setValue("ozelAlan12", item.OZEL_ALAN_12);
          setValue("ozelAlan12ID", item.ISM_OZEL_ALAN_12_KOD_ID);
          setValue("ozelAlan13", item.OZEL_ALAN_13);
          setValue("ozelAlan13ID", item.ISM_OZEL_ALAN_13_KOD_ID);
          setValue("ozelAlan14", item.OZEL_ALAN_14);
          setValue("ozelAlan14ID", item.ISM_OZEL_ALAN_14_KOD_ID);
          setValue("ozelAlan15", item.OZEL_ALAN_15);
          setValue("ozelAlan15ID", item.ISM_OZEL_ALAN_15_KOD_ID);
          setValue("ozelAlan16", item.OZEL_ALAN_16);
          setValue("ozelAlan17", item.OZEL_ALAN_17);
          setValue("ozelAlan18", item.OZEL_ALAN_18);
          setValue("ozelAlan19", item.OZEL_ALAN_19);
          setValue("ozelAlan20", item.OZEL_ALAN_20);

          // Notlar
          setValue("notlar", item.ISM_IC_NOT);

          // Açıklama
          setValue("isEmriAciklama", item.ISM_ACIKLAMA);

          // kapalı iş emri kapama bilgileri
          setValue("kapamaAciklama", item.ISM_SONUC);
          setValue("kontrolSonucNotu", item.ISM_SONUC);
          setValue("kapamaSonucID", item.ISM_SONUC_KOD_ID);
          setValue("kapamaMakineDurumuID", item.ISM_KAPAT_MAKINE_DURUM_KOD_ID);
          setValue("kapamaMakineDurumu", item.ISM_KAPAT_MAKINE_DURUM);
          setValue("kapamaBakimPuani", item.ISM_PUAN);
          setValue("kapamaBitisTarihi", item.ISM_BITIS_TARIH ? (dayjs(item.ISM_BITIS_TARIH).isValid() ? dayjs(item.ISM_BITIS_TARIH) : null) : null);
          setValue("kapamaBitisSaati", item.ISM_BITIS_SAAT ? (dayjs(item.ISM_BITIS_SAAT, "HH:mm:ss").isValid() ? dayjs(item.ISM_BITIS_SAAT, "HH:mm:ss") : null) : null);

          setValue("kapamaBaslamaTarihi", item.BASLAMA_TARIH ? (dayjs(item.BASLAMA_TARIH).isValid() ? dayjs(item.BASLAMA_TARIH) : null) : null);
          setValue("kapamaBaslamaSaati", item.BASLAMA_SAAT ? (dayjs(item.BASLAMA_SAAT, "HH:mm:ss").isValid() ? dayjs(item.BASLAMA_SAAT, "HH:mm:ss") : null) : null);

          setValue("kapatmaTarihi", item.KAPANIS_TARIHI ? (dayjs(item.KAPANIS_TARIHI).isValid() ? dayjs(item.KAPANIS_TARIHI) : null) : null);
          setValue("kapatmaSaati", item.KAPANIS_SAATI ? (dayjs(item.KAPANIS_SAATI, "HH:mm:ss").isValid() ? dayjs(item.KAPANIS_SAATI, "HH:mm:ss") : null) : null);
          // ... Diğer setValue çağrıları

          setLoading(false); // Yükleme tamamlandığında
        } catch (error) {
          console.error("Veri çekilirken hata oluştu:", error);
          setLoading(false); // Hata oluştuğunda
        }
      }
    };

    handleDataFetchAndUpdate();
  }, [drawerVisible, selectedRow, setValue, methods.reset, setDisabled]);

  const formatDateWithDayjs = (dateString) => {
    const formattedDate = dayjs(dateString);
    return formattedDate.isValid() ? formattedDate.format("YYYY-MM-DD") : "";
  };

  const formatTimeWithDayjs = (timeObj) => {
    const formattedTime = dayjs(timeObj);
    return formattedTime.isValid() ? formattedTime.format("HH:mm:ss") : "";
  };

  const idToWordMap = {
    1: t("isEmriKapatma.alan.prosedur"),
    2: t("isEmriKapatma.alan.makine"),
    3: t("isEmriKapatma.alan.konu"),
    4: t("isEmriKapatma.alan.tipi"),
    5: t("isEmriKapatma.alan.proje"),
    6: t("isEmriKapatma.alan.oncelik"),
    7: t("isEmriKapatma.alan.atolye"),
    8: t("isEmriKapatma.alan.sayac"),
    9: t("isEmriKapatma.alan.aciklama"),
    10: t("isEmriKapatma.alan.sozlesme"),
    11: t("isEmriKapatma.alan.kapatmaMakineDurumu"),
    12: t("isEmriKapatma.alan.firma"),
    13: t("isEmriKapatma.alan.puan"),
    14: t("isEmriKapatma.alan.ekipman"),
    15: t("isEmriKapatma.alan.nedeni"),
    16: t("isEmriKapatma.alan.referansNo"),
    17: t("isEmriKapatma.alan.makineDurumu"),
  };

  const showRequestError = (error) => {
    console.error("Error sending data:", error);
    if (navigator.onLine) {
      message.error("Hata Mesajı: " + error.message);
    } else {
      message.error("Internet Bağlantısı Mevcut Değil.");
    }
  };

  const closeDrawerAndReset = () => {
    setOpen(false);
    setCloseModalOpen(false);
    setCloseModalDisabled(false);
    setCloseErrorMessage("");
    setCloseErrorMessageShow(false);
    setAssignmentRequestKey(0);
    onRefresh();
    methods.reset();
    onDrawerClose();
  };

  const calismaSaat = watch("calismaSaat");
  const onayDurum = watch("onayDurum");
  const kapali = watch("kapali");

  useEffect(() => {
    if (kapali == true) {
      setDisabled(true);
    } else if (kapali == false) {
      if (calismaSaat < 0) {
        setDisabled(true);
      } else if (onayCheck === true) {
        if (onayDurum === 1) {
          setDisabled(true);
        }
      } else {
        setDisabled(false);
      }
    }
  }, [calismaSaat, kapali, onayDurum, onayCheck]);

  const buildUpdateBody = (data) => ({
    TB_ISEMRI_ID: data.secilenIsEmriID,
    ISM_ISEMRI_NO: data.isEmriNo,
    ISM_DUZENLEME_TARIH: formatDateWithDayjs(data.duzenlenmeTarihi),
    ISM_DUZENLEME_SAAT: formatTimeWithDayjs(data.duzenlenmeSaati),
    ISM_TIP_ID: data.isEmriTipiID,
    ISM_DURUM_KOD_ID: data.isEmriDurumID,
    ISM_BAGLI_ISEMRI_ID: data.bagliIsEmriID,
    ISM_LOKASYON_ID: data.lokasyonID,
    ISM_MAKINE_ID: data.makineID,
    ISM_EKIPMAN_ID: data.ekipmanID,
    ISM_MAKINE_DURUM_KOD_ID: data.makineDurumuID,
    ISM_SAYAC_DEGER: data.sayac,
    // Detay Bilgiler alanlari
    ISM_REF_ID: data.prosedurID,
    ISM_KONU: data.konu,
    ISM_TIP_KOD_ID: data.prosedurTipiID,
    ISM_NEDEN_KOD_ID: data.prosedurNedeniID,
    ISM_ONCELIK_ID: data.oncelikID,
    ISM_ATOLYE_ID: data.atolyeID,
    ISM_TALIMAT_ID: data.talimatID,
    ISM_MASRAF_MERKEZ_ID: data.masrafMerkeziID,
    ISM_PROJE_ID: data.projeID,
    ISM_TAMAMLANMA_ORAN: data.tamamlanmaOranı === "" ? 0 : data.tamamlanmaOranı,
    ISM_PLAN_BASLAMA_TARIH: formatDateWithDayjs(data.planlananBaslama),
    ISM_PLAN_BASLAMA_SAAT: formatTimeWithDayjs(data.planlananBaslamaSaati),
    ISM_PLAN_BITIS_TARIH: formatDateWithDayjs(data.planlananBitis),
    ISM_PLAN_BITIS_SAAT: formatTimeWithDayjs(data.planlananBitisSaati),
    ISM_BASLAMA_TARIH: formatDateWithDayjs(data.baslamaZamani),
    ISM_BASLAMA_SAAT: formatTimeWithDayjs(data.baslamaZamaniSaati),
    ISM_BITIS_TARIH: formatDateWithDayjs(data.bitisZamani),
    ISM_BITIS_SAAT: formatTimeWithDayjs(data.bitisZamaniSaati),
    ISM_SURE_CALISMA: data.calismaSaat * 60 + data.calismaDakika,
    ISM_FIRMA_ID: data.firmaID,
    ISM_FIRMA_SOZLESME_ID: data.sozlesmeID,
    ISM_EVRAK_NO: data.evrakNo,
    ISM_EVRAK_TARIHI: formatDateWithDayjs(data.evrakTarihi),
    // ISM_MALIYET_DISSERVIS: data.maliyet,
    ISM_GARANTI_KAPSAMINDA: data.garantiKapsami,
    ISM_DISSERVIS_ACIKLAMA: data.disServisAciklama,
    // Süre Bilgileri tabı
    ISM_SURE_MUDAHALE_LOJISTIK: data.lojistikSuresi,
    ISM_SURE_MUDAHALE_SEYAHAT: data.seyahatSuresi,
    ISM_SURE_MUDAHALE_ONAY: data.onaySuresi,
    ISM_SURE_BEKLEME: data.beklemeSuresi,
    ISM_SURE_MUDAHALE_DIGER: data.digerSuresi,
    ISM_SURE_PLAN_MUDAHALE: data.mudahaleSuresi,
    // IS_SURESI: data.calismaSuresi,
    ISM_SURE_TOPLAM: data.toplamIsSuresi,
    // Maliyetler tabı
    ISM_MALIYET_MLZ: data.malzemeMaliyetiGercek,
    ISM_MALIYET_PERSONEL: data.iscilikMaliyetiGercek,
    ISM_MALIYET_DISSERVIS: data.maliyet,
    ISM_MALIYET_DIGER: data.genelGiderlerGercek,
    ISM_MALIYET_INDIRIM: data.indirimGercek,
    ISM_MALIYET_KDV: data.kdvGercek,
    ISM_MALIYET_TOPLAM: data.toplamMaliyetGercek,
    // Özel alanlar
    ISM_OZEL_ALAN_1: data.ozelAlan1,
    ISM_OZEL_ALAN_2: data.ozelAlan2,
    ISM_OZEL_ALAN_3: data.ozelAlan3,
    ISM_OZEL_ALAN_4: data.ozelAlan4,
    ISM_OZEL_ALAN_5: data.ozelAlan5,
    ISM_OZEL_ALAN_6: data.ozelAlan6,
    ISM_OZEL_ALAN_7: data.ozelAlan7,
    ISM_OZEL_ALAN_8: data.ozelAlan8,
    ISM_OZEL_ALAN_9: data.ozelAlan9,
    ISM_OZEL_ALAN_10: data.ozelAlan10,
    ISM_OZEL_ALAN_11_KOD_ID: data.ozelAlan11ID,
    ISM_OZEL_ALAN_12_KOD_ID: data.ozelAlan12ID,
    ISM_OZEL_ALAN_13_KOD_ID: data.ozelAlan13ID,
    ISM_OZEL_ALAN_14_KOD_ID: data.ozelAlan14ID,
    ISM_OZEL_ALAN_15_KOD_ID: data.ozelAlan15ID,
    ISM_OZEL_ALAN_16: data.ozelAlan16,
    ISM_OZEL_ALAN_17: data.ozelAlan17,
    ISM_OZEL_ALAN_18: data.ozelAlan18,
    ISM_OZEL_ALAN_19: data.ozelAlan19,
    ISM_OZEL_ALAN_20: data.ozelAlan20,
    // Notlar
    ISM_MAKINE_GUVENLIK_NOTU: data.notlar,
    ISM_SONUC: data.kontrolSonucNotu,
    //Açıklama
    ISM_ACIKLAMA: data.isEmriAciklama,
    // Diğer alanlarınız...
  });

  const updateIsEmri = async (data, { closeAfterSuccess = true, showSuccessMessage = true } = {}) => {
    const body = buildUpdateBody(data);
    try {
      const response = await AxiosInstance.post("UpdateIsEmri", body);
      if (response.status_code === 200 || response.status_code === 201) {
        if (showSuccessMessage) {
          message.success("İşlem Başarılı.");
        }
        if (closeAfterSuccess) {
          closeDrawerAndReset();
        }
        return true;
      }
      if (response.status_code === 401) {
        message.error("Bu işlemi yapmaya yetkiniz bulunmamaktadır.");
      } else {
        message.error("İşlem Başarısız.");
      }
      return false;
    } catch (error) {
      showRequestError(error);
      return false;
    }
  };

  const checkRequiredFieldsBeforeClose = async (isEmriId, { showMessages = true } = {}) => {
    try {
      const response = await AxiosInstance.get(`CheckIsmFieldsForClose?isEmriId=${isEmriId}`);
      if (response?.Durum === true) {
        return { canClose: true, errorMessage: "" };
      }

      let errorMessage = "";
      if (response?.TextArray?.length) {
        errorMessage += `${response.TextArray.join(",\n")}, `;
        if (showMessages) {
          message.error(
            t("isEmriKapatma.ozelAlanEksikMesaj", {
              fields: response.TextArray.join(",\n"),
            })
          );
        }
      }
      if (response?.Idlist?.length) {
        const words = response.Idlist.map((id) => idToWordMap[id] || t("isEmriKapatma.alan.bilinmeyenId"));
        errorMessage += `${words.join(",\n")}, `;
        if (showMessages) {
          message.error(
            t("isEmriKapatma.genelAlanEksikMesaj", {
              fields: words.join(",\n"),
            })
          );
        }
      }
      if (response?.IsmIsNotPersonelTimeSet === true) {
        errorMessage += "Ekli Personele Süre Atanmamış";
        if (showMessages) {
          message.error(t("isEmriKapatma.personelSureEksikMesaj"));
        }
      }
      return { canClose: false, errorMessage: errorMessage.trim() };
    } catch (error) {
      showRequestError(error);
      return { canClose: false, errorMessage: "" };
    }
  };

  const buildCloseBody = (data, isEmriId) => {
    const closeDate = data.kapatmaTarihi || dayjs();
    const closeTime = data.kapatmaSaati || dayjs();
    const startDate = data.kapamaBaslamaTarihi || data.baslamaZamani;
    const startTime = data.kapamaBaslamaSaati || data.baslamaZamaniSaati;
    const endDate = data.kapamaBitisTarihi || data.bitisZamani;
    const endTime = data.kapamaBitisSaati || data.bitisZamaniSaati;
    const workHour = data.kapamaCalismaSaat ?? data.calismaSaat ?? 0;
    const workMinute = data.kapamaCalismaDakika ?? data.calismaDakika ?? 0;

    return [
      {
        TB_ISEMRI_ID: isEmriId,
        ISM_BASLAMA_TARIH: formatDateWithDayjs(startDate),
        ISM_BASLAMA_SAAT: formatTimeWithDayjs(startTime),
        ISM_BITIS_TARIH: formatDateWithDayjs(endDate),
        ISM_BITIS_SAAT: formatTimeWithDayjs(endTime),
        ISM_SURE_CALISMA: workHour * 60 + workMinute,
        ISM_SONUC_KOD_ID: data.kapamaSonucID,
        ISM_KAPANMA_YDK_TARIH: formatDateWithDayjs(closeDate),
        ISM_KAPANMA_YDK_SAAT: formatTimeWithDayjs(closeTime),
        ISM_PUAN: data.kapamaBakimPuani,
        ISM_KAPAT_MAKINE_DURUM_KOD_ID: data.kapamaMakineDurumuID,
        ISM_SONUC: data.kontrolSonucNotu ?? data.kapamaAciklama,
      },
    ];
  };

  const closeIsEmri = async (data) => {
    const isEmriId = data.secilenIsEmriID || selectedRow?.key;
    if (!isEmriId) {
      message.error("İş emri bulunamadı.");
      return { success: false, errorMessage: "" };
    }

    const validationResult = await checkRequiredFieldsBeforeClose(isEmriId);
    if (!validationResult.canClose) {
      return { success: false, errorMessage: validationResult.errorMessage };
    }

    const body = buildCloseBody(data, isEmriId);
    try {
      const response = await AxiosInstance.post("IsEmriKapat", body);
      if (response.status_code === 200 || response.status_code === 201) {
        return { success: true, errorMessage: "" };
      }
      if (response.status_code === 401) {
        message.error("Bu işlemi yapmaya yetkiniz bulunmamaktadır.");
      } else {
        message.error("İş emri kapatma işlemi başarısız.");
      }
      return { success: false, errorMessage: "" };
    } catch (error) {
      showRequestError(error);
      return { success: false, errorMessage: "" };
    }
  };

  const onSubmit = async (data) => {
    setActionLoading(true);
    try {
      await updateIsEmri(data);
    } finally {
      setActionLoading(false);
    }
  };

  const onSubmitAndClose = async (data) => {
    setActionLoading(true);
    try {
      setCloseErrorMessage("");
      setCloseErrorMessageShow(false);
      setCloseModalDisabled(false);
      const updated = await updateIsEmri(data, { closeAfterSuccess: false, showSuccessMessage: false });
      if (!updated) {
        return;
      }

      const closeResult = await closeIsEmri(data);
      if (!closeResult.success) {
        if (closeResult.errorMessage) {
          setCloseErrorMessage(closeResult.errorMessage);
          setCloseErrorMessageShow(true);
          setCloseModalDisabled(true);
        }
        return;
      }

      message.success("İş Emri Güncellendi ve Kapatıldı.");
      closeDrawerAndReset();
    } finally {
      setActionLoading(false);
    }
  };

  const onClose = () => {
    Modal.confirm({
      title: "İptal etmek istediğinden emin misin?",
      content: "Kaydedilmemiş değişiklikler kaybolacaktır.",
      okText: "Evet",
      cancelText: "Hayır",
      onOk: () => {
        setOpen(false);
        setAssignmentRequestKey(0);
        reset();
        onDrawerClose();
      },
    });
  };

  const handleCloseModalToggle = async () => {
    if (closeModalOpen) {
      setCloseModalOpen(false);
      setCloseModalDisabled(false);
      setCloseErrorMessage("");
      setCloseErrorMessageShow(false);
      return;
    }

    const isEmriId = methods.getValues("secilenIsEmriID") || selectedRow?.key;
    setCloseModalDisabled(false);
    setCloseErrorMessage("");
    setCloseErrorMessageShow(false);

    if (isEmriId) {
      const validationResult = await checkRequiredFieldsBeforeClose(isEmriId, { showMessages: false });
      if (!validationResult.canClose) {
        setCloseModalDisabled(true);
        setCloseErrorMessage(validationResult.errorMessage);
        setCloseErrorMessageShow(true);
      }
    }

    setCloseModalOpen(true);
  };

  const handlePrintWorkOrderForm = () => {
    const baseURL = localStorage.getItem("baseURL");
    const isEmriId = selectedRow?.key || methods.getValues("secilenIsEmriID");

    if (!baseURL || !isEmriId) {
      message.error("İş emri formu açılamadı.");
      return;
    }

    window.open(`${baseURL}/FormRapor/GetFormByType?id=${isEmriId}&tipId=1`, "_blank");
  };

  return (
    <FormProvider {...methods}>
      <ConfigProvider locale={tr_TR}>
        <Drawer
          destroyOnClose
          width="1560px"
          title={
            <div style={{ display: "flex", gap: "30px", alignItems: "center" }}>
              <div>İş Emri Güncelle</div>
            </div>
          }
          placement="right"
          onClose={onClose}
          open={open}
          extra={
            <Space>
              <Button icon={<QrcodeOutlined />} disabled={actionLoading} onClick={() => setQrModalOpen(true)}>
                {t("qrKod")}
              </Button>
              <Button
                disabled={actionLoading}
                onClick={handlePrintWorkOrderForm}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  backgroundColor: "#f8fafc",
                  borderColor: "#d9e0ea",
                  color: "#4b5563",
                }}
              >
                <span style={{ fontSize: "14px", lineHeight: 1 }}>🖨</span>
                Yazdır
              </Button>
              <Button
                disabled={actionLoading}
                onClick={() => setAssignmentRequestKey((prevKey) => prevKey + 1)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  backgroundColor: "#f8fafc",
                  borderColor: "#d9e0ea",
                  color: "#4b5563",
                }}
              >
                <span style={{ fontSize: "14px", lineHeight: 1 }}>👷</span>
                Atama
              </Button>
              <Button danger disabled={disabled || actionLoading} loading={actionLoading} onClick={handleCloseModalToggle}>
                Kapat
              </Button>
              <Button onClick={onClose}>İptal</Button>
              <Button
                disabled={disabled || actionLoading}
                loading={actionLoading}
                type="submit"
                onClick={methods.handleSubmit(onSubmit)}
                style={{
                  backgroundColor: disabled || actionLoading ? "#d9d9d9" : "#2bc770",
                  borderColor: disabled || actionLoading ? "#d9d9d9" : "#2bc770",
                  color: disabled || actionLoading ? "black" : "#ffffff",
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
              <MainTabs disabled={disabled} isDisabled={isDisabled} fieldRequirements={fieldRequirements} />
              <SecondTabs disabled={disabled} fieldRequirements={fieldRequirements} assignmentRequestKey={assignmentRequestKey} />
              <Footer />
            </form>
          )}
        </Drawer>

        <QRCodeGenerator
          visible={qrModalOpen}
          onClose={() => setQrModalOpen(false)}
          value={`TB_ISEMRI_ID: ${watch("secilenIsEmriID") || selectedRow?.key || ""}`}
          fileName={`QR-${watch("isEmriNo") || selectedRow?.key || "IsEmri"}`}
          title="İş Emri QR Kodu"
        />

        <Modal
          title={`İş Emri Kapatma - (${watch("isEmriNo") || selectedRow?.ISEMRI_NO || ""})`}
          centered
          destroyOnClose={false}
          width={990}
          zIndex={2100}
          open={closeModalOpen}
          onCancel={handleCloseModalToggle}
          footer={[
            <div key="footer" style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
              <div style={{ width: "100%" }}>
                {closeErrorMessageShow ? (
                  <Alert
                    style={{ fontWeight: 500, color: "red", textAlign: "left" }}
                    message={`İş emrinde doldurulması gerekli zorunlu alanlar bulunmaktadır. (${closeErrorMessage})`}
                    type="error"
                    showIcon
                  />
                ) : null}
              </div>
              <div style={{ display: "flex", gap: "10px", marginLeft: "10px" }}>
                <Button key="cancel" onClick={handleCloseModalToggle}>
                  İptal
                </Button>
                <Button
                  key="submit"
                  type="primary"
                  disabled={closeModalDisabled || actionLoading}
                  loading={actionLoading}
                  onClick={methods.handleSubmit(onSubmitAndClose)}
                >
                  Tamam
                </Button>
              </div>
            </div>,
          ]}
        >
          <CloseForms isModalOpen={closeModalOpen} selectedRows={selectedRow ? [selectedRow] : []} />
        </Modal>
      </ConfigProvider>
    </FormProvider>
  );
}
