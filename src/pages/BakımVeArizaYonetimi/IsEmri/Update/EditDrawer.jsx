import React, { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { Button, Drawer, Space, ConfigProvider, Modal, Spin } from "antd";
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
  // API'den gelen zorunluluk bilgilerini simüle eden bir örnek
  const [fieldRequirements, setFieldRequirements] = React.useState({
    // Varsayılan olarak zorunlu değil
    // Diğer alanlar için de benzer şekilde...
  });

  const methods = useForm({
    defaultValues: {
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
      aciklama: "",
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

  // aşağıdaki useEffect verileri form elemanlarına set etmeden önce durum güncellemesi yapıyor ondan sonra verileri set ediyor

  useEffect(() => {
    const handleDataFetchAndUpdate = async () => {
      if (drawerVisible && selectedRow) {
        setOpen(true); // İşlemler tamamlandıktan sonra drawer'ı aç
        setLoading(true); // Yükleme başladığında
        try {
          const response = await AxiosInstance.get(`GetIsEmriById?isEmriId=${selectedRow.key}`);
          const data = response;
          const item = data[0]; // Veri dizisinin ilk elemanını al
          console.log(item);
          // Form alanlarını set et
          setValue("secilenIsEmriID", item.TB_ISEMRI_ID);
          setValue("isEmriNo", item.ISEMRI_NO);
          setValue(
            "duzenlenmeTarihi",
            item.DUZENLEME_TARIH ? (dayjs(item.DUZENLEME_TARIH).isValid() ? dayjs(item.DUZENLEME_TARIH) : null) : null
          );
          setValue(
            "duzenlenmeSaati",
            item.DUZENLEME_SAAT
              ? dayjs(item.DUZENLEME_SAAT, "HH:mm:ss").isValid()
                ? dayjs(item.DUZENLEME_SAAT, "HH:mm:ss")
                : null
              : null
          );
          setValue("isEmriTipi", item.ISEMRI_TIP);
          setValue("isEmriTipiID", item.ISM_TIP_ID);
          setValue("isEmriDurum", item.DURUM);
          setValue("isEmriDurumID", item.ISM_DURUM_KOD_ID);
          setValue("bagliIsEmriTanim", item.ISM_BAGLI_ISEMRI_NO);
          setValue("bagliIsEmriID", item.ISM_BAGLI_ISEMRI_ID);
          setValue("lokasyonTanim", item.LOKASYON);
          setValue("lokasyonID", item.LOKASYON_ID);
          setValue("tamLokasyonTanim", item.TAM_LOKASYON);
          setValue("makine", item.MAKINE_KODU);
          setValue("makineID", item.ISM_MAKINE_ID);
          setValue("makineTanim", item.MAKINE_TANIMI);
          setValue("garantiBitis", item.ISM_GARANTI_BITIS);
          setValue("ekipman", item.EKIP);
          setValue("ekipmanID", item.ISM_EKIPMAN_ID);
          setValue("ekipmanTanim", item.EKIPMAN);
          setValue("makineDurumu", item.MAKINE_DURUM);
          setValue("makineDurumuID", item.ISM_MAKINE_DURUM_KOD_ID);
          setValue("sayac", item.GUNCEL_SAYAC_DEGER);
          setValue("prosedur", item.ISM_PROSEDUR_KOD);
          setValue("prosedurID", item.ISM_REF_ID);
          setValue("konu", item.KONU);
          setValue("prosedurTipi", item.IS_TIPI);
          setValue("prosedurTipiID", item.ISM_TIP_KOD_ID);
          setValue("prosedurNedeni", item.IS_NEDENI);
          setValue("prosedurNedeniID", item.ISM_NEDEN_KOD_ID);

          // ... Diğer setValue çağrıları

          setLoading(false); // Yükleme tamamlandığında
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
      TB_IS_TALEP_ID: data.secilenTalepID,
      IST_KOD: data.talepKodu,
      IST_ACILIS_TARIHI: formatDateWithDayjs(data.talepTarihi),
      IST_ACILIS_SAATI: formatTimeWithDayjs(data.talepSaati),
      IST_TALEP_EDEN_ID: data.talepteBulunanID,
      IST_BILDIREN_LOKASYON_ID: data.lokasyonID,
      IST_DEPARTMAN_ID: data.departmanID,
      IST_IRTIBAT_TELEFON: data.irtibatTelefonu,
      IST_MAIL_ADRES: data.email,
      IST_IRTIBAT_KOD_KOD_ID: data.iletisimSekliID,
      IST_TIP_KOD_ID: data.talepTipiID,
      IST_KOTEGORI_KODI_ID: data.isKategorisiID,
      IST_SERVIS_NEDENI_KOD_ID: data.servisNedeniID,
      IST_ONCELIK_ID: data.oncelikID,
      IST_BILDIRILEN_BINA: data.bildirilenBinaID,
      IST_BILDIRILEN_KAT: data.bildirilenKatID,
      IST_IS_TAKIPCISI_ID: data.ilgiliKisiID,
      IST_TANIMI: data.konu,
      IST_ACIKLAMA: data.aciklama,
      IST_MAKINE_ID: data.makineID,
      IST_EKIPMAN_ID: data.ekipmanID,
      IST_MAKINE_DURUM_KOD_ID: data.makineDurumuID,
      IST_ISEMRI_TIP_ID: data.isEmriTipiID,
      IST_PLANLANAN_BASLAMA_TARIHI: formatDateWithDayjs(data.planlananBaslamaTarihi),
      IST_PLANLANAN_BASLAMA_SAATI: formatTimeWithDayjs(data.planlananBaslamaSaati),
      IST_PLANLANAN_BITIS_TARIHI: formatDateWithDayjs(data.planlananBitisTarihi),
      IST_PLANLANAN_BITIS_SAATI: formatTimeWithDayjs(data.planlananBitisSaati),
      IST_ISEMRI_ID: data.isEmriNoID,
      IST_BASLAMA_TARIHI: formatDateWithDayjs(data.baslamaTarihi),
      IST_BASLAMA_SAATI: formatTimeWithDayjs(data.baslamaSaati),
      IST_BITIS_TARIHI: formatDateWithDayjs(data.bitisTarihi),
      IST_BITIS_SAATI: formatTimeWithDayjs(data.bitisSaati),
      IST_NOT: data.not,
      IST_SONUC: data.sonuc,
      IST_ON_DEGERLENDIRME: data.degerlendirme,
      // Diğer alanlarınız...
    };

    // API'ye POST isteği gönder
    AxiosInstance.post("UpdateIsTalep", Body)
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
