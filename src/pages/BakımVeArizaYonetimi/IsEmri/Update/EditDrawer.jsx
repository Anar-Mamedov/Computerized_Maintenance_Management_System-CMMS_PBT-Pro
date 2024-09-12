import React, { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { Button, Drawer, Space, ConfigProvider, Modal, Spin, message } from "antd";
import tr_TR from "antd/es/locale/tr_TR";
import AxiosInstance from "../../../../api/http";
import MainTabs from "./components/MainTabs/MainTabs";
import Footer from "./components/Footer";
import SecondTabs from "./components/SecondTabs/SecondTabs";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

export default function EditDrawer({ selectedRow, onDrawerClose, drawerVisible, onRefresh }) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(drawerVisible);
  const [disabled, setDisabled] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [onayCheck, setOnayCheck] = useState(false);
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
      takvimTanim: "",
      takvimID: "",
      talimatTanim: "",
      talimatID: "",
      isTalebiKodu: "",
      talepEden: "",
      isTalebiTarihi: "",
      isTalebiSaati: "",
      isTalebiAciklama: "",
      masrafMerkezi: "",
      masrafMerkeziID: "",
      proje: "",
      projeID: "",
      referansNo: "",
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
          setDisabled(item.KAPALI);
          if (onayCheck === true) {
            if (item.ISM_ONAY_DURUM === 1 || item.ISM_ONAY_DURUM === 2) {
              setDisabled(true);
              setValue("kapali", true);
            }
          }
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
          setValue("takvimTanim", item.TAKVIM);
          setValue("takvimID", item.ISM_TAKVIM_ID);
          setValue("talimatTanim", item.TALIMAT);
          setValue("talimatID", item.ISM_TALIMAT_ID);
          setValue("secilenTalepID", item.ISM_IS_TALEP_ID);
          setValue("isTalebiKodu", item.IS_TALEP_NO);
          setValue("talepEden", item.IS_TALEP_EDEN);
          setValue("isTalebiTarihi", item.ISM_IS_TARIH ? (dayjs(item.ISM_IS_TARIH).isValid() ? dayjs(item.ISM_IS_TARIH) : null) : null);
          setValue("isTalebiSaati", item.ISM_IS_SAAT ? (dayjs(item.ISM_IS_SAAT, "HH:mm:ss").isValid() ? dayjs(item.ISM_IS_SAAT, "HH:mm:ss") : null) : null);
          setValue("isTalebiAciklama", item.ISM_IS_SONUC);
          setValue("masrafMerkezi", item.MASRAF_MERKEZI);
          setValue("masrafMerkeziID", item.ISM_MASRAF_MERKEZ_ID);
          setValue("proje", item.ISM_PROJE);
          setValue("projeID", item.ISM_PROJE_ID);
          setValue("referansNo", item.ISM_REFERANS_NO);
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
  }, [drawerVisible, selectedRow, setValue, onRefresh, methods.reset, AxiosInstance, setDisabled, onayCheck]);

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
      ISM_TAKVIM_ID: data.takvimID,
      ISM_TALIMAT_ID: data.talimatID,
      ISM_IS_SONUC: data.isTalebiAciklama,
      ISM_MASRAF_MERKEZ_ID: data.masrafMerkeziID,
      ISM_PROJE_ID: data.projeID,
      ISM_REFERANS_NO: data.referansNo,
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
      //Açıklama
      ISM_ACIKLAMA: data.isEmriAciklama,
      // Diğer alanlarınız...
    };

    // API'ye POST isteği gönder
    AxiosInstance.post("UpdateIsEmri", Body)
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
        if (navigator.onLine) {
          // İnternet bağlantısı var
          message.error("Hata Mesajı: " + error.message);
        } else {
          // İnternet bağlantısı yok
          message.error("Internet Bağlantısı Mevcut Değil.");
        }
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
              <Button onClick={onClose}>İptal</Button>
              <Button
                disabled={disabled}
                type="submit"
                onClick={methods.handleSubmit(onSubmit)}
                style={{
                  backgroundColor: disabled ? "#d9d9d9" : "#2bc770",
                  borderColor: disabled ? "#d9d9d9" : "#2bc770",
                  color: disabled ? "black" : "#ffffff",
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
              <SecondTabs disabled={disabled} fieldRequirements={fieldRequirements} />
              <Footer />
            </form>
          )}
        </Drawer>
      </ConfigProvider>
    </FormProvider>
  );
}
