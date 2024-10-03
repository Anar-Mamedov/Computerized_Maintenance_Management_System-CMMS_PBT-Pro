import tr_TR from "antd/es/locale/tr_TR";
import { Button, Drawer, Space, ConfigProvider, Modal, message, Spin } from "antd";
// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState, useTransition } from "react";
import { useForm, FormProvider } from "react-hook-form";
import dayjs from "dayjs";
import AxiosInstance from "../../../../api/http";
import Footer from "./components/Footer";
import SecondTabs from "./components/SecondTabs/SecondTabs";
import MainTabs1 from "./components/MainTabs/MainTabs1";

export default function EditDrawer({ selectedRow, onDrawerClose, drawerVisible, onRefresh }) {
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
        // onRefresh();
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
      activeTab: "GUN",
      ayGroup: 1,
      ayinGunleriSelect: [],
      baslangicGroup: 1,
      haftaninGunleri: [], // add more fields as needed
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
  const onSubmit = async (data) => {
    const Body = {
      TB_PERIYODIK_BAKIM_ID: data.secilenBakimID,
      PBK_KOD: data.bakimKodu,
      PBK_TANIM: data.bakimTanimi,
      PBK_AKTIF: data.bakimAktif,
      PBK_TIP: data.bakimTipi,
      PBK_TIP_KOD_ID: data.bakimTipiID,
      PBK_GRUP: data.bakimGrubu,
      PBK_GRUP_KOD_ID: data.bakimGrubuID,
      /*  PBK_NEDEN: data.bakimNedeni,
      PBK_NEDEN_KOD_ID: data.bakimNedeniID, */
      PBK_ONCELIK: data.oncelikTanim,
      PBK_ONCELIK_ID: data.oncelikID,
      PBK_TALIMAT: data.talimatTanim,
      PBK_TALIMAT_ID: data.talimatID,
      PBK_ATOLYE: data.atolyeTanim,
      PBK_ATOLYE_ID: data.atolyeID,
      PBK_FIRMA: data.firmaTanim,
      PBK_FIRMA_ID: data.firmaID,
      PBK_LOKASYON: data.lokasyonTanim,
      PBK_LOKASYON_ID: data.lokasyonID,
      PBK_CALISMA_SURE: data.calismaSuresi,
      PBK_DURUS_SURE: data.durusSuresi,
      PBK_PERSONEL_SAYI: data.personelSayisi,
      // PBK_OTONOM_BAKIM: data.otonomBakim,
      // PBK_UYARI_PERIYOT: data.periyotID,
      // PBK_UYARI_SIKLIGI: data.periyotSiklik,
      PBK_MALZEME_MALIYET: data.maliyetlerMalzeme,
      PBK_ISCILIK_MALIYET: data.maliyetlerIscilik,
      PBK_GENEL_GIDER_MALIYET: data.maliyetlerGenelGider,
      PBK_TOPLAM_MALIYET: data.maliyetlerToplam,
      PBK_SURE_LOJISTIK: data.lojistikSuresi,
      PBK_SURE_SEYAHAT: data.seyahetSuresi,
      PBK_SURE_ONAY: data.onaySuresi,
      PBK_SURE_BEKLEME: data.beklemeSuresi,
      PBK_SURE_DIGER: data.digerSuresi,
      PBK_OZEL_ALAN_1: data.ozelAlan1,
      PBK_OZEL_ALAN_2: data.ozelAlan2,
      PBK_OZEL_ALAN_3: data.ozelAlan3,
      PBK_OZEL_ALAN_4: data.ozelAlan4,
      PBK_OZEL_ALAN_5: data.ozelAlan5,
      PBK_OZEL_ALAN_6: data.ozelAlan6,
      PBK_OZEL_ALAN_6_KOD_ID: data.ozelAlan6ID,
      PBK_OZEL_ALAN_7_KOD_ID: data.ozelAlan7ID,
      PBK_OZEL_ALAN_8_KOD_ID: data.ozelAlan8ID,
      PBK_OZEL_ALAN_9: data.ozelAlan9,
      PBK_OZEL_ALAN_10: data.ozelAlan10,
      PBK_ACIKLAMA: data.aciklama, // Initialize other fields to null or default values
      PBK_TARIH_BAZLI_IZLE: false,
      PBK_SAYAC_BAZLI_IZLE: false,
      PBK_TARIH_YINELEME_PERIYOT: null,
      PBK_TARIH_YINELEME_SIKLIK: null,
      PBK_TARIH_AY_GUNLER: null,
      PBK_TARIH_HAFTA_GUNLER: null,
      PBK_SAYAC_YINELEME_SIKLIK: null,
      PBK_SAYAC_BIRIM: null,
      PBK_SAYAC_BIRIM_KOD_ID: null,
      PBK_TARIH_BITIS_SEKLI: null,
      PBK_TEKRAR_SAYI: null,
      PBK_BITIS_DONEM1: null,
      PBK_BITIS_DONEM2: null,
      PBK_TARIH_BITIS: null,
      PBK_TARIH_BASLANGIC_TARIHI: null, //??
    };

    // Handle tarihSayacBakim and activeTab logic
    if (data.tarihSayacBakim === "b") {
      // Both date-based and counter-based tracking
      Body.PBK_TARIH_BAZLI_IZLE = true;
      Body.PBK_SAYAC_BAZLI_IZLE = true;
    } else if (data.tarihSayacBakim === "a") {
      if (data.activeTab === "SAYAC") {
        // Only counter-based tracking
        Body.PBK_TARIH_BAZLI_IZLE = false;
        Body.PBK_SAYAC_BAZLI_IZLE = true;
      } else {
        // Only date-based tracking
        Body.PBK_TARIH_BAZLI_IZLE = true;
        Body.PBK_SAYAC_BAZLI_IZLE = false;
      }
    }

    // Set counter-based fields if applicable
    if (Body.PBK_SAYAC_BAZLI_IZLE) {
      Body.PBK_SAYAC_YINELEME_SIKLIK = data.sayacSayisi;
      Body.PBK_SAYAC_BIRIM = data.peryodikBakimBirim;
      Body.PBK_SAYAC_BIRIM_KOD_ID = data.peryodikBakimBirimID;
    }

    // Set date-based fields if applicable
    if (Body.PBK_TARIH_BAZLI_IZLE) {
      switch (data.activeTab) {
        case "GUN":
          Body.PBK_TARIH_YINELEME_PERIYOT = "GUN";
          Body.PBK_TARIH_YINELEME_SIKLIK = data.gunlukGun;
          break;
        case "HAFTA":
          Body.PBK_TARIH_YINELEME_PERIYOT = "HAFTA";
          Body.PBK_TARIH_YINELEME_SIKLIK = data.haftalik;
          Body.PBK_TARIH_HAFTA_GUNLER = data.haftaninGunleri.join(",");
          break;
        case "AY123":
          if (data.ayGroup === 1) {
            Body.PBK_TARIH_YINELEME_PERIYOT = "AY1";
            Body.PBK_TARIH_YINELEME_SIKLIK = data.herAy;
          } else if (data.ayGroup === 2) {
            Body.PBK_TARIH_YINELEME_PERIYOT = "AY2";
            Body.PBK_TARIH_YINELEME_SIKLIK = data.ayinGunleriBir;
            Body.PBK_TARIH_AY_GUNLER = data.ayinGunleriSelect.join(",");
          } else if (data.ayGroup === 3) {
            Body.PBK_TARIH_YINELEME_PERIYOT = "AY3";
            Body.PBK_TARIH_YINELEME_SIKLIK = data.ayinHafatlariBir;
            Body.PBK_TARIH_AY_GUNLER = data.ayinHaftalariSelect.join(",");
            Body.PBK_TARIH_HAFTA_GUNLER = data.ayinHaftalarininGunuSelect.join(",");
          }
          break;
        case "YIL123":
          if (data.yilGroup === 1) {
            Body.PBK_TARIH_YINELEME_PERIYOT = "YIL1";
            Body.PBK_TARIH_YINELEME_SIKLIK = data.herYil;
          } else if (data.yilGroup === 2) {
            Body.PBK_TARIH_YINELEME_PERIYOT = "YIL2";
            Body.PBK_TARIH_YINELEME_SIKLIK = data.yillikTekrarSayisi;
            Body.PBK_TARIH_AY_GUNLER = data.yilinAylariSelect + data.ayinGunleriSelect;
          }
          break;
        case "FIX":
          Body.PBK_TARIH_YINELEME_PERIYOT = "FIX";
          break;
        default:
          break;
      }
    }

    // Set PBK_TARIH_BITIS_SEKLI and related fields
    Body.PBK_TARIH_BITIS_SEKLI = data.baslangicGroup - 1; // Adjusting because baslangicGroup starts from 1

    if (Body.PBK_TARIH_BITIS_SEKLI === 1) {
      Body.PBK_TEKRAR_SAYI = data.tekrarlamaSayisi;
    } else if (Body.PBK_TARIH_BITIS_SEKLI === 2) {
      Body.PBK_BITIS_DONEM1 = data.donemBaslangicAylariSelect + data.donemBaslangicGunleriSelect;
      Body.PBK_BITIS_DONEM2 = data.donemBitisAylariSelect + data.donemBitisGunleriSelect;
    } else if (Body.PBK_TARIH_BITIS_SEKLI === 3) {
      Body.PBK_TARIH_BITIS = data.bakimBitisTarihi ? dayjs(data.bakimBitisTarihi).format("YYYY-MM-DD") : null;
    }

    // Set PBK_TARIH_BASLANGIC_TARIHI if available
    Body.PBK_TARIH_BASLANGIC_TARIHI = data.peryodikBakimBaslangicTarihi ? dayjs(data.peryodikBakimBaslangicTarihi).format("YYYY-MM-DD") : null;

    try {
      const response = await AxiosInstance.post("PeriyodikBakimKaydetGüncelle", Body);
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
          const response = await AxiosInstance.get(`PeriyodikBakimDetayByBakim?BakimId=${selectedRow.key}`);
          const item = response[0]; // Veri dizisinin ilk elemanını al
          // Form alanlarını set et
          setValue("secilenBakimID", selectedRow.key);
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
          if (item.PBK_TARIH_BAZLI_IZLE == true && item.PBK_SAYAC_BAZLI_IZLE == true) {
            setValue("tarihSayacBakim", "b");
            setValue("sayacSayisi", item.PBK_SAYAC_YINELEME_SIKLIK);
            setValue("peryodikBakimBirim", item.PBK_SAYAC_BIRIM);
            setValue("peryodikBakimBirimID", item.PBK_SAYAC_BIRIM_KOD_ID);
            if (item.PBK_TARIH_YINELEME_PERIYOT == "AY1" || item.PBK_TARIH_YINELEME_PERIYOT == "AY2" || item.PBK_TARIH_YINELEME_PERIYOT == "AY3") {
              setValue("activeTab", "AY123");
              if (item.PBK_TARIH_YINELEME_PERIYOT == "AY1") {
                setValue("ayGroup", 1);
                setValue("herAy", item.PBK_TARIH_YINELEME_SIKLIK);
              } else if (item.PBK_TARIH_YINELEME_PERIYOT == "AY2") {
                setValue("ayGroup", 2);
                setValue("ayinGunleriBir", item.PBK_TARIH_YINELEME_SIKLIK);
                let ayinGunleri = item.PBK_TARIH_AY_GUNLER.match(/.{1,2}/g);
                setValue("ayinGunleriSelect", ayinGunleri);
              } else if (item.PBK_TARIH_YINELEME_PERIYOT == "AY3") {
                setValue("ayGroup", 3);
                setValue("ayinHafatlariBir", item.PBK_TARIH_YINELEME_SIKLIK);
                let ayinGunleri = item.PBK_TARIH_AY_GUNLER.match(/.{1,2}/g);
                setValue("ayinHaftalariSelect", ayinGunleri);
                setValue("ayinHaftalarininGunuSelect", item.PBK_TARIH_HAFTA_GUNLER);
              }
            } else if (item.PBK_TARIH_YINELEME_PERIYOT == "YIL1" || item.PBK_TARIH_YINELEME_PERIYOT == "YIL2") {
              setValue("activeTab", "YIL123");
              if (item.PBK_TARIH_YINELEME_PERIYOT == "YIL1") {
                setValue("yilGroup", 1);
                setValue("herYil", item.PBK_TARIH_YINELEME_SIKLIK);
              } else if (item.PBK_TARIH_YINELEME_PERIYOT == "YIL2") {
                setValue("yilGroup", 2);
                setValue("yillikTekrarSayisi", item.PBK_TARIH_YINELEME_SIKLIK);
                let yilGunAy = item.PBK_TARIH_AY_GUNLER.toString();
                setValue("yilinAylariSelect", yilGunAy.slice(-2));
                setValue("ayinGunleriSelect", yilGunAy.slice(0, 2));
              }
            } else if (item.PBK_TARIH_YINELEME_PERIYOT == "GUN") {
              setValue("activeTab", "GUN");
              setValue("gunlukGun", item.PBK_TARIH_YINELEME_SIKLIK);
            } else if (item.PBK_TARIH_YINELEME_PERIYOT == "HAFTA") {
              setValue("activeTab", "HAFTA");
              setValue("haftalik", item.PBK_TARIH_YINELEME_SIKLIK);
              setValue("haftaninGunleri", item.PBK_TARIH_HAFTA_GUNLER);
            } else if (item.PBK_TARIH_YINELEME_PERIYOT == "FIX") {
              setValue("activeTab", "FIX");
            }
          } else if (item.PBK_TARIH_BAZLI_IZLE == true || item.PBK_SAYAC_BAZLI_IZLE == true) {
            setValue("tarihSayacBakim", "a");
            if (item.PBK_TARIH_YINELEME_PERIYOT == "AY1" || item.PBK_TARIH_YINELEME_PERIYOT == "AY2" || item.PBK_TARIH_YINELEME_PERIYOT == "AY3") {
              setValue("activeTab", "AY123");
              if (item.PBK_TARIH_YINELEME_PERIYOT == "AY1") {
                setValue("ayGroup", 1);
                setValue("herAy", item.PBK_TARIH_YINELEME_SIKLIK);
              } else if (item.PBK_TARIH_YINELEME_PERIYOT == "AY2") {
                setValue("ayGroup", 2);
                setValue("ayinGunleriBir", item.PBK_TARIH_YINELEME_SIKLIK);
                let ayinGunleri = item.PBK_TARIH_AY_GUNLER.match(/.{1,2}/g);
                setValue("ayinGunleriSelect", ayinGunleri);
              } else if (item.PBK_TARIH_YINELEME_PERIYOT == "AY3") {
                setValue("ayGroup", 3);
                setValue("ayinHafatlariBir", item.PBK_TARIH_YINELEME_SIKLIK);
                let ayinGunleri = item.PBK_TARIH_AY_GUNLER.match(/.{1,2}/g);
                setValue("ayinHaftalariSelect", ayinGunleri);
                setValue("ayinHaftalarininGunuSelect", item.PBK_TARIH_HAFTA_GUNLER);
              }
            } else if (item.PBK_TARIH_YINELEME_PERIYOT == "YIL1" || item.PBK_TARIH_YINELEME_PERIYOT == "YIL2") {
              setValue("activeTab", "YIL123");
              if (item.PBK_TARIH_YINELEME_PERIYOT == "YIL1") {
                setValue("yilGroup", 1);
                setValue("herYil", item.PBK_TARIH_YINELEME_SIKLIK);
              } else if (item.PBK_TARIH_YINELEME_PERIYOT == "YIL2") {
                setValue("yilGroup", 2);
                setValue("yillikTekrarSayisi", item.PBK_TARIH_YINELEME_SIKLIK);
                let yilGunAy = item.PBK_TARIH_AY_GUNLER.toString();
                setValue("yilinAylariSelect", yilGunAy.slice(-2));
                setValue("ayinGunleriSelect", yilGunAy.slice(0, 2));
              }
            } else if (item.PBK_TARIH_YINELEME_PERIYOT == "GUN") {
              setValue("activeTab", "GUN");
              setValue("gunlukGun", item.PBK_TARIH_YINELEME_SIKLIK);
            } else if (item.PBK_TARIH_YINELEME_PERIYOT == "HAFTA") {
              setValue("activeTab", "HAFTA");
              setValue("haftalik", item.PBK_TARIH_YINELEME_SIKLIK);
              setValue("haftaninGunleri", item.PBK_TARIH_HAFTA_GUNLER);
            } else if (item.PBK_TARIH_YINELEME_PERIYOT == "SAYAC") {
              setValue("activeTab", "SAYAC");
              setValue("sayacSayisi", item.PBK_SAYAC_YINELEME_SIKLIK);
              setValue("peryodikBakimBirim", item.PBK_SAYAC_BIRIM);
              setValue("peryodikBakimBirimID", item.PBK_SAYAC_BIRIM_KOD_ID);
            } else if (item.PBK_TARIH_YINELEME_PERIYOT == "FIX") {
              setValue("activeTab", "FIX");
            }
          }

          if (item.PBK_TARIH_BITIS_SEKLI == 0) {
            setValue("baslangicGroup", 1);
          } else if (item.PBK_TARIH_BITIS_SEKLI == 1) {
            setValue("baslangicGroup", 2);
            setValue("tekrarlamaSayisi", item.PBK_TEKRAR_SAYI);
          } else if (item.PBK_TARIH_BITIS_SEKLI == 2) {
            setValue("baslangicGroup", 3);
            let donem = item.PBK_BITIS_DONEM1.toString();
            setValue("donemBaslangicGunleriSelect", donem.slice(-2));
            setValue("donemBaslangicAylariSelect", donem.slice(0, 2));
            let bitisDonem = item.PBK_BITIS_DONEM2.toString();
            setValue("donemBitisGunleriSelect", bitisDonem.slice(-2));
            setValue("donemBitisAylariSelect", bitisDonem.slice(0, 2));
          } else if (item.PBK_TARIH_BITIS_SEKLI == 3) {
            setValue("baslangicGroup", 4);
            setValue("bakimBitisTarihi", item.PBK_TARIH_BITIS ? (dayjs(item.PBK_TARIH_BITIS).isValid() ? dayjs(item.PBK_TARIH_BITIS) : null) : null);
          }

          // add more fields as needed

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
          title="Periyodik Bakim Güncelle"
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
              {/*<SecondTabs />*/}
              <Footer />
            </form>
          )}
        </Drawer>
      </ConfigProvider>
    </FormProvider>
  );
}
