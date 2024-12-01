import React, { useState, useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Spin, Button, message } from "antd";
import AxiosInstance from "../../../../../api/http";
import Forms from "./components/Forms";
import dayjs from "dayjs";
import { t } from "i18next";

function FirmaBilgileri() {
  const [loading, setLoading] = useState(true);

  const methods = useForm({
    defaultValues: {
      firmaUnvani: null,
      adress1: null,
      adress2: null,
      sehir: null,
      ilce: null,
      postaKodu: null,
      ulke: null,
      telefon: null,
      faxNo: null,
      web: null,
      email: null,
      vergiDairesi: null,
      vergiNumarasi: null,
      aciklama: null,
      gucluSifreAktif: "false",
    },
  });

  const { setValue, reset, watch } = methods;

  // API'den gelen verileri form alanlarına set etme
  const fetchData = async () => {
    try {
      const response = await AxiosInstance.get(`CommonSettings/GetSettingByType?type=1`);
      const item = response.data;
      if (item) {
        setValue("firmaUnvani", item.firmaUnvan);
        setValue("adress1", item.adres1);
        setValue("adress2", item.adres2);
        setValue("sehir", item.sehir);
        setValue("ilce", item.ilce);
        setValue("postaKodu", item.pk);
        setValue("ulke", item.ulke);
        setValue("telefon", item.telefon);
        setValue("faxNo", item.fax);
        setValue("web", item.web);
        setValue("email", item.email);
        setValue("vergiDairesi", item.vergiDaire);
        setValue("vergiNumarasi", item.vergiNo);
        setValue("aciklama", item.aciklama);
        setValue("gucluSifreAktif", item.gucluSifreAktif);
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
      firmaUnvan: data.firmaUnvani,
      adres1: data.adress1,
      adres2: data.adress2,
      sehir: data.sehir,
      ilce: data.ilce,
      pk: data.postaKodu,
      ulke: data.ulke,
      telefon: data.telefon,
      fax: data.faxNo,
      web: data.web,
      email: data.email,
      vergiDaire: data.vergiDairesi,
      vergiNo: data.vergiNumarasi,
      aciklama: data.aciklama,
      gucluSifreAktif: data.gucluSifreAktif,
    };

    setLoading(true);

    // API'ye POST isteği gönder
    try {
      const response = await AxiosInstance.post("CommonSettings/UpdateSettingByType?type=1", Body);
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

export default FirmaBilgileri;
