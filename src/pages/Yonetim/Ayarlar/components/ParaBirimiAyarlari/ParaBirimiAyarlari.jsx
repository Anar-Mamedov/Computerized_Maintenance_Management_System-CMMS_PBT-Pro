import React, { useState, useEffect } from "react";
import { FormProvider, useForm, Controller } from "react-hook-form";
import { Spin, Button, message, Switch, Select, Typography } from "antd";
import AxiosInstance from "../../../../../api/http";
import { t } from "i18next";

const { Text } = Typography;

function ParaBirimiAyarlari() {
  const [loading, setLoading] = useState(true);
  const [currencies, setCurrencies] = useState([]);
  const [rateSources, setRateSources] = useState([]);

  const methods = useForm({
    defaultValues: {
      PRM_000058: false,
      PRM_000059: null,
      PRM_000060: null,
    },
  });

  const { setValue, handleSubmit, control } = methods;

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch settings, currencies, and rate sources concurrently
      const [settingsRes, currenciesRes, rateSourcesRes] = await Promise.all([
        AxiosInstance.get("GetParaBirimiAyarlari"),
        AxiosInstance.get("GetCurrencies"),
        AxiosInstance.get("GetRateSources"),
      ]);

      // Parse Currencies
      const currenciesData = currenciesRes.data || (Array.isArray(currenciesRes) ? currenciesRes : []);
      setCurrencies(currenciesData);

      // Parse Rate Sources
      const rateSourcesData = rateSourcesRes.data || (Array.isArray(rateSourcesRes) ? rateSourcesRes : []);
      setRateSources(rateSourcesData);

      // Parse Settings
      const params = settingsRes.data?.Parametreler || settingsRes?.Parametreler || [];
      if (Array.isArray(params)) {
        const useCurrency = params.find((p) => p.PRM_KOD === "000058")?.PRM_DEGER || "Hayır";
        const programCurrency = params.find((p) => p.PRM_KOD === "000059")?.PRM_DEGER || "";
        const rateSource = params.find((p) => p.PRM_KOD === "000060")?.PRM_DEGER || "";

        setValue("PRM_000058", useCurrency === "Evet");
        setValue("PRM_000059", programCurrency ? Number(programCurrency) : null);
        setValue("PRM_000060", rateSource ? Number(rateSource) : null);
      }
    } catch (error) {
      console.error("Veri çekilirken hata oluştu:", error);
      message.error("Ayarlar yüklenirken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onSubmit = async (data) => {
    const Body = [
      { PRM_KOD: "000058", PRM_DEGER: data.PRM_000058 ? "Evet" : "Hayır" },
      { PRM_KOD: "000059", PRM_DEGER: data.PRM_000059 ? String(data.PRM_000059) : "" },
      { PRM_KOD: "000060", PRM_DEGER: data.PRM_000060 ? String(data.PRM_000060) : "" },
    ];

    setLoading(true);
    try {
      const response = await AxiosInstance.post("UpdateParaBirimiAyarlari", Body);
      if ([200, 201, 202].includes(response.status_code) || response.has_error === false) {
        message.success("Güncelleme Başarılı.");
      } else if (response.status_code === 401) {
        message.error("Bu işlemi yapmaya yetkiniz bulunmamaktadır.");
      } else {
        message.error("Güncelleme Başarısız.");
      }
    } catch (error) {
      console.error("Error sending data:", error);
      message.error("Hata Mesajı: " + error.message);
    } finally {
      setLoading(false);
      fetchData();
    }
  };

  return (
    <FormProvider {...methods}>
      <div style={{ maxHeight: "calc(100vh - 100px)", overflowY: "auto" }}>
        {loading ? (
          <div style={{ overflow: "auto", height: "333px", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
            <Spin spinning={loading} size="large" />
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)}>
            <div style={{ display: "flex", flexDirection: "column", gap: "15px", paddingBottom: "10px", width: "100%" }}>
              
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px", marginTop: "10px" }}>
                <Text style={{ fontSize: "14px", color: "#000000a4" }}>{t("paraBirimiKullanimi", { defaultValue: "Para Birimi Kullanımı" })}</Text>
                <Controller
                  name="PRM_000058"
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <Switch checked={value} onChange={onChange} />
                  )}
                />
              </div>

              <div style={{ display: "flex", gap: "15px", width: "100%" }}>
                <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-start", width: "100%", flexDirection: "column", justifyContent: "space-between", gap: "8px" }}>
                  <Text style={{ fontSize: "14px", color: "#000000a4" }}>{t("programParaBirimi", { defaultValue: "Program Para Birimi" })}</Text>
                  <Controller
                    name="PRM_000059"
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        placeholder="Para Birimi Seçiniz"
                        style={{ width: "100%" }}
                        allowClear
                        options={currencies.map((curr) => ({
                          value: curr.CurrencyId,
                          label: `${curr.Name} (${curr.Code} - ${curr.Symbol})`,
                        }))}
                      />
                    )}
                  />
                </div>

                <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-start", width: "100%", flexDirection: "column", justifyContent: "space-between", gap: "8px" }}>
                  <Text style={{ fontSize: "14px", color: "#000000a4" }}>{t("paraBirimiServisi", { defaultValue: "Para Birimi Servisi" })}</Text>
                  <Controller
                    name="PRM_000060"
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        placeholder="Kur Servisi Seçiniz"
                        style={{ width: "100%" }}
                        allowClear
                        options={rateSources.map((src) => ({
                          value: src.RateSourceId,
                          label: src.SourceGlobalName || src.SourceNativeName,
                        }))}
                      />
                    )}
                  />
                </div>
              </div>

              <Button
                type="submit"
                onClick={handleSubmit(onSubmit)}
                style={{
                  backgroundColor: "#2bc770",
                  borderColor: "#2bc770",
                  color: "#ffffff",
                  marginTop: "20px",
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

export default ParaBirimiAyarlari;
