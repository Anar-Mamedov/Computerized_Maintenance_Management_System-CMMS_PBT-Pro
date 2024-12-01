import React, { useState, useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Spin, Button, message } from "antd";
import AxiosInstance from "../../../../../api/http";
import Forms from "./components/Forms";
import dayjs from "dayjs";
import { t } from "i18next";

function Araclar() {
  const [loading, setLoading] = useState(true);

  const methods = useForm({
    defaultValues: {
      kilometreGuncelle: "1",
      formatliPlakaGirisi: null,
      ayrac: null,
      konumTakibi: null,
      aracKartiOzelAlanlar: null,
      harcalamalarMaliyetler: null,
      aracGelirleri: null,
      dorseYonetimi: null,
      servisKayitlari: null,
      kilometreGirisi: null,
      havaBasinci: null,
      disDerinligi: null,
    },
  });

  const { setValue, reset, watch } = methods;

  // API'den gelen verileri form alanlarına set etme
  const fetchData = async () => {
    try {
      const response = await AxiosInstance.get(`CommonSettings/GetSettingByType?type=2`);
      const item = response.data;
      if (item) {
        setValue("kilometreGuncelle", item.kilometreGuncelleme);
        setValue("formatliPlakaGirisi", item.formatliPlaka);
        setValue("ayrac", item.plakaAyrac);
        setValue("konumTakibi", item.konumTakibi);
        setValue("aracKartiOzelAlanlar", item.aracOzelAlanElleGirsin);
        setValue("harcalamalarMaliyetler", item.aracHarcamaMaliyetEkle);
        setValue("aracGelirleri", item.aracGelirleriEkle);
        setValue("dorseYonetimi", item.dorseYonetimi);
        setValue("servisKayitlari", item.servisKayitlariMlzTakip);
        setValue("kilometreGirisi", item.seferKilometreGirisiZorunlu);
        setValue("havaBasinci", item.lastikHavaBasinci);
        setValue("disDerinligi", item.lastikDisDerinligi);
      }
    } catch (error) {
      console.error("Veri çekilirken hata oluştu:", error);
      setLoading(false); // Hata oluştuğunda
    } finally {
      setLoading(false); // Her durumda
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatDateWithDayjs = (dateString) => {
    const formattedDate = dayjs(dateString);
    return formattedDate.isValid() ? formattedDate.format("YYYY-MM-DD") : "";
  };

  const formatTimeWithDayjs = (timeObj) => {
    const formattedTime = dayjs(timeObj);
    return formattedTime.isValid() ? formattedTime.format("HH:mm:ss") : "";
  };

  const onSubmit = async (data) => {
    // Form verilerini API'nin beklediği formata dönüştür
    const Body = {
      siraNo: 1,
      kilometreGuncelleme: data.kilometreGuncelle,
      formatliPlaka: data.formatliPlakaGirisi,
      plakaAyrac: data.ayrac,
      konumTakibi: data.konumTakibi,
      aracOzelAlanElleGirsin: data.aracKartiOzelAlanlar,
      aracHarcamaMaliyetEkle: data.harcalamalarMaliyetler,
      aracGelirleriEkle: data.aracGelirleri,
      dorseYonetimi: data.dorseYonetimi,
      servisKayitlariMlzTakip: data.servisKayitlari,
      seferKilometreGirisiZorunlu: data.kilometreGirisi,
      lastikHavaBasinci: data.havaBasinci,
      lastikDisDerinligi: data.disDerinligi,
    };

    setLoading(true);

    // API'ye POST isteği gönder
    try {
      const response = await AxiosInstance.post("CommonSettings/UpdateSettingByType?type=2", Body);
      console.log("Data sent successfully:", response);

      if (response.data.statusCode === 200 || response.data.statusCode === 201 || response.data.statusCode === 202) {
        message.success("Güncelleme Başarılı.");
        /* setOpen(false);
           onRefresh(); 
           onDrawerClose();
        */
        methods.reset();
      } else if (response.data.statusCode === 401) {
        message.error("Bu işlemi yapmaya yetkiniz bulunmamaktadır.");
      } else {
        message.error("Ekleme Başarısız.");
      }
    } catch (error) {
      console.error("Error sending data:", error);
      if (navigator.onLine) {
        // İnternet bağlantısı var
        message.error("Hata Mesajı: " + error.message);
      } else {
        // İnternet bağlantısı yok
        message.error("Internet Bağlantısı Mevcut Değil.");
      }
    } finally {
      setLoading(false);
      fetchData();
    }
    console.log({ Body });
  };
  return (
    <FormProvider {...methods}>
      <div style={{ maxHeight: "calc(100vh - 100px)", overflowY: "auto" }}>
        {loading ? (
          <div style={{ overflow: "auto", height: "calc(100vh - 150px)" }}>
            <Spin
              spinning={loading}
              size="large"
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {/* İçerik yüklenirken gösterilecek alan */}
            </Spin>
          </div>
        ) : (
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            <div style={{ display: "flex", flexDirection: "column", gap: "15px", paddingBottom: "10px" }}>
              <Forms />
              <Button
                type="submit"
                onClick={methods.handleSubmit(onSubmit)}
                style={{
                  backgroundColor: "#2bc770",
                  borderColor: "#2bc770",
                  color: "#ffffff",
                }}
              >
                {t("guncelle")}
              </Button>
            </div>
          </form>
        )}
      </div>
    </FormProvider>
  );
}

export default Araclar;
