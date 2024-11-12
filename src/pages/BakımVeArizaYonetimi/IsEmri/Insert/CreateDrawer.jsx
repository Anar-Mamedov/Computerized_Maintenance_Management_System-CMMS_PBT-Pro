import React, { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { Button, Drawer, Space, ConfigProvider, Modal, message, Alert, Spin } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import tr_TR from "antd/es/locale/tr_TR";
import AxiosInstance from "../../../../api/http";
import MainTabs from "./components/MainTabs/MainTabs";
import SecondTabs from "./components/SecondTabs/SecondTabs";
import Footer from "../Footer";
import dayjs from "dayjs";

export default function CreateDrawer({ onRefresh }) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  // API'den gelen zorunluluk bilgilerini simüle eden bir örnek
  const [fieldRequirements, setFieldRequirements] = React.useState({
    // Varsayılan olarak zorunlu değil
    // Diğer alanlar için de benzer şekilde...
  });

  useEffect(() => {
    if (open) {
      // Çekmece açıldığında gerekli işlemi yap
      // Örneğin, MainTabs'a bir prop olarak geçir
      setLoading(true);
      AxiosInstance.get("ModulKoduGetir?modulKodu=ISM_ISEMRI_NO") // Replace with your actual API endpoint
        .then((response) => {
          // Assuming the response contains the new work order number in 'response.Tanim'
          setValue("isEmriNo", response);
          // setTimeout(() => {
          //   setLoading(false);
          // }, 100);
        })
        .catch((error) => {
          console.error("Error fetching new work order number:", error);
          if (navigator.onLine) {
            // İnternet bağlantısı var
            message.error("Hata Mesajı: " + error.message);
          } else {
            // İnternet bağlantısı yok
            message.error("Internet Bağlantısı Mevcut Değil.");
          }
        });
    }
  }, [open]);

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
    },
  });

  const { setValue, reset, watch } = methods;

  const isEmriNo = watch("isEmriNo");

  // isEmriNo durumunu izleyen bir useEffect
  useEffect(() => {
    if (isEmriNo !== "") {
      setLoading(false);
    }
  }, [isEmriNo]);

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

  useEffect(() => {
    const handleDefaultRequirementsFetch = async () => {
      if (open) {
        try {
          const response = await AxiosInstance.get(`IsEmriTip`);

          // "IMT_VARSAYILAN": true olan objeyi bul
          const defaultItem = response.find((item) => item.IMT_VARSAYILAN === true);

          if (defaultItem) {
            setValue("prosedurTab", defaultItem.IMT_CAGRILACAK_PROSEDUR);
            // varsayılan iş emri tipini set et
            setValue("isEmriTipID", defaultItem.TB_ISEMRI_TIP_ID);
            setValue("isEmriTipi", defaultItem.IMT_TANIM);
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
  }, [open, setValue, methods.reset]);

  // iş emri tipine göre zorunlu alanları belirleme son

  // API'den varsayılan değerleri çekip set etme

  useEffect(() => {
    const handleDataFetchAndUpdate = async () => {
      if (open) {
        try {
          const response = await AxiosInstance.get(`IsEmriEkleVarsiylanlar`);
          const data = response.is_emri_varsayilanlar; // API cevabındaki ilgili veriye erişim
          // Veriyi işle ve form alanlarını güncelle
          data.forEach((item) => {
            switch (item.TABLO_TANIMI) {
              /* case "IS_EMRI_DURUM_VARSAYILAN":
                // Örneğin, sipariş durumu için
                setValue("isEmriDurum", item.TANIM);
                setValue("isEmriDurumID", item.ID);
                break; */
              /* case "IS_EMRI_TIP_VARSAYILAN":
                // Örneğin, iş emri tipi için
                setValue("isEmriTipi", item.TANIM);
                setValue("isEmriTipiID", item.ID);
                break; */
              case "SERVIS_ONCELIK":
                // Örneğin, servis önceliği için
                setValue("oncelikTanim", item.TANIM);
                setValue("oncelikID", item.ID);
                break;
              default:
                // Diğer durumlar için bir işlem yapılabilir veya loglanabilir
                console.log("Tanımsız TABLO_TANIMI:", item.TABLO_TANIMI);
            }
          });
        } catch (error) {
          console.error("Veri çekilirken hata oluştu:", error);
        }
      }
    };

    handleDataFetchAndUpdate();
  }, [open, setValue, methods.reset]);

  // API'den varsayılan değerleri çekip set etme son

  useEffect(() => {
    if (open) {
      AxiosInstance.get("KodList?grup=32801")
        .then((response) => {
          const defaultItem = response.find((item) => item.KOD_ISM_DURUM_VARSAYILAN === true);
          if (defaultItem) {
            setValue("isEmriDurumID", defaultItem.TB_KOD_ID);
            setValue("isEmriDurum", defaultItem.KOD_TANIM);
          }
        })
        .catch((error) => {
          console.error("Error fetching IsEmriTip:", error);
          if (navigator.onLine) {
            message.error("Hata Mesajı: " + error.message);
          } else {
            message.error("Internet Bağlantısı Mevcut Değil.");
          }
        });
    }
  }, [open]);

  const formatDateWithDayjs = (dateString) => {
    const formattedDate = dayjs(dateString);
    return formattedDate.isValid() ? formattedDate.format("YYYY-MM-DD") : "";
  };

  const formatTimeWithDayjs = (timeObj) => {
    const formattedTime = dayjs(timeObj);
    return formattedTime.isValid() ? formattedTime.format("HH:mm:ss") : "";
  };

  const calismaSaat = watch("calismaSaat");

  useEffect(() => {
    if (disabled == false) {
      if (calismaSaat < 0) {
        setDisabled(true);
      } else {
        setDisabled(false);
      }
    }
  }, [calismaSaat]);

  const onSubmit = (data) => {
    // Form verilerini API'nin beklediği formata dönüştür
    const Body = {
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
      ISM_IS_SONUC: data.aciklama,
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
      ISM_MALIYET_KDV: data.maliyet,
      ISM_GARANTI_KAPSAMINDA: data.garantiKapsami,
      ISM_WEB: true,
      // Diğer alanlarınız...
    };

    // API'ye POST isteği gönder
    AxiosInstance.post("IsEmri?isWeb=true", Body)
      .then((response) => {
        console.log("Data sent successfully:", response);
        if (response.status_code === 200 || response.status_code === 201) {
          message.success("İşlem Başarılı.");
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

  const showDrawer = () => setOpen(true);

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
    });
  };

  return (
    <FormProvider {...methods}>
      <ConfigProvider locale={tr_TR}>
        <Button type="primary" onClick={showDrawer} style={{ display: "flex", alignItems: "center" }}>
          <PlusOutlined />
          Ekle
        </Button>
        <Drawer
          width="1460px"
          title={
            <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
              <div>İş Emri Ekle</div>
              <Alert
                style={{ fontWeight: 500 }}
                message="[Malzeme, Kontrol Listesi, Personel ve Diğer Detayları İş Emrini Kaydettikten Sonra Girebilirsiniz.]"
                // description="This is some important information."
                type="info"
                showIcon
              />
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
                Kaydet
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
              <MainTabs drawerOpen={open} isDisabled={isDisabled} fieldRequirements={fieldRequirements} />
              <SecondTabs fieldRequirements={fieldRequirements} />
              <Footer />
            </form>
          )}
        </Drawer>
      </ConfigProvider>
    </FormProvider>
  );
}
