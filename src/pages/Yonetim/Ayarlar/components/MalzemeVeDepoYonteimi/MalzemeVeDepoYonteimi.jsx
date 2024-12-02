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
      KDVOrani: null,
      OTVOrani: null,
      stokMiktarininNegatifeDusmesi: "1",
      sayimFazlasi: "1",
      transferOnayi: false,
    },
  });

  const { setValue, reset, watch } = methods;

  // API'den gelen verileri form alanlarına set etme
  const fetchData = async () => {
    try {
      const response = await AxiosInstance.get(`GetMalzemeDepoAyar`);
      const data = response; // Verinizin yukarıda belirttiğiniz formatta olduğunu varsayıyoruz

      if (Array.isArray(data)) {
        // Her bir alan için ilgili parametreyi buluyoruz
        const kDVOrani = data.find((param) => param.PRM_KOD === "010002")?.PRM_DEGER || "";
        const oTVOrani = data.find((param) => param.PRM_KOD === "010003")?.PRM_DEGER || "";
        const stokMiktarininNegatifeDusmesi = data.find((param) => param.PRM_KOD === "010001")?.PRM_DEGER || "";
        const sayimFazlasi = data.find((param) => param.PRM_KOD === "010004")?.PRM_DEGER || "";
        const transferOnayi = data.find((param) => param.PRM_KOD === "350004")?.PRM_DEGER || "";

        // Alanlara setValue ile değerleri atıyoruz
        setValue("KDVOrani", kDVOrani);
        setValue("OTVOrani", oTVOrani);
        setValue("stokMiktarininNegatifeDusmesi", stokMiktarininNegatifeDusmesi);
        setValue("sayimFazlasi", sayimFazlasi);
        setValue("transferOnayi", transferOnayi === "true");
      }
    } catch (error) {
      console.error("Veri çekilirken hata oluştu:", error);
      setLoading(false); // Hata durumunda yükleme durumunu kapatıyoruz
    } finally {
      setLoading(false); // Her durumda yükleme durumunu kapatıyoruz
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
    // PRM_KOD'ları ve form alanlarını eşleştiren bir nesne
    const paramMapping = {
      KDVOrani: "010002",
      OTVOrani: "010003",
      stokMiktarininNegatifeDusmesi: "010001",
      sayimFazlasi: "010004",
      transferOnayi: "350004",
    };

    // Gönderilecek parametreleri dinamik olarak oluşturuyoruz
    const Body = Object.keys(paramMapping).map((key) => ({
      PRM_KOD: paramMapping[key],
      /*  PRM_DEGER: data[key], */
      PRM_DEGER: key === "OTVOrani" ? String(data[key]) : data[key],
    }));

    setLoading(true);

    try {
      const response = await AxiosInstance.post("UpdateMalzemeDepoAyar", Body);
      console.log("Data sent successfully:", response);

      if ([200, 201, 202].includes(response.status_code)) {
        message.success("Güncelleme Başarılı.");
        methods.reset();
      } else if (response.status_code === 401) {
        message.error("Bu işlemi yapmaya yetkiniz bulunmamaktadır.");
      } else {
        message.error("Güncelleme Başarısız.");
      }
    } catch (error) {
      console.error("Error sending data:", error);
      if (navigator.onLine) {
        message.error("Hata Mesajı: " + error.message);
      } else {
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
          <div style={{ overflow: "auto", height: "333px", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
            <Spin spinning={loading} size="large"></Spin>
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
