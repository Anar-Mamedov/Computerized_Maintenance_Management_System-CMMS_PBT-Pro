import React, { useEffect, useRef, useState } from "react";
import { Select, Typography } from "antd";
import { Controller, useFormContext } from "react-hook-form";
import { t } from "i18next";
import AxiosInstance from "../../api/http";
import { useAppContext } from "../../AppContext";
import { formatNumberWithSeparators } from "../numberLocale";

const { Text } = Typography;

/**
 * Fiş ekranlarında (Giriş / Çıkış / Transfer, Insert ve Update) ortak para birimi seçimi.
 *
 * Davranış:
 * - Kur sistemi aktifse: alan seçilebilir; varsayılan değer kullanıcının para birimi,
 *   yoksa uygulamanın (program) para birimi.
 * - Kur sistemi kapalıysa: alan disabled olur ve her zaman uygulamanın (program) para
 *   birimi gösterilir; kullanıcı değiştiremez.
 *
 * Props:
 * - modalOpen: para birimi listesinin (GetCurrencies) ne zaman çekileceğini kontrol eder.
 *   Verilmezse true kabul edilir (bileşen mount olduğunda çeker).
 * - name: react-hook-form alan adı (varsayılan "paraBirimiID").
 * - showKur: Update ekranlarındaki kur / TL karşılığı gösterimini açar.
 */
export default function ParaBirimiSecimi({ modalOpen = true, name = "paraBirimiID", showKur = false }) {
  const { control, watch, setValue } = useFormContext();
  const { activeCurrency } = useAppContext();
  const kurSistemiAktif = Boolean(activeCurrency?.KurSistemiAktif);

  const [currencies, setCurrencies] = useState([]);
  const [loadingCurrencies, setLoadingCurrencies] = useState(false);

  const paraBirimiVarsayilanSetRef = useRef(false);
  const paraBirimiIDValue = watch(name);

  // Kur gösterimi için (yalnızca showKur === true iken kullanılır)
  const currentLang = localStorage.getItem("i18nextLng") || "en";
  const paraBirimiKur = watch("paraBirimiKur");
  const genelToplamDovizli = watch("genelToplamDovizli");
  const paraBirimiSymbol = watch("paraBirimiSymbol");

  useEffect(() => {
    if (modalOpen && currencies.length === 0) {
      setLoadingCurrencies(true);
      AxiosInstance.get("GetCurrencies")
        .then((res) => {
          const currencyList = res.data || (Array.isArray(res) ? res : []);
          setCurrencies(currencyList);
        })
        .catch((err) => {
          console.error("Error fetching currencies:", err);
        })
        .finally(() => {
          setLoadingCurrencies(false);
        });
    }
  }, [modalOpen, currencies.length]);

  useEffect(() => {
    if (!activeCurrency || paraBirimiVarsayilanSetRef.current) {
      return;
    }

    // GetActiveCurrencyInfo objesinden CurrencyId çöz: önce doğrudan id alanı,
    // bulunamazsa GetCurrencies listesinden Code/Symbol ile eşleştir.
    const resolveCurrencyId = (curObj) => {
      if (!curObj) {
        return null;
      }
      const directId = curObj.CurrencyId ?? curObj.Id ?? curObj.CurrencyID ?? curObj.ParaBirimiId;
      if (directId != null) {
        return directId;
      }
      if (curObj.Code) {
        const byCode = currencies.find((c) => c.Code === curObj.Code);
        if (byCode) {
          return byCode.CurrencyId;
        }
      }
      if (curObj.Symbol) {
        const bySymbol = currencies.find((c) => c.Symbol === curObj.Symbol);
        if (bySymbol) {
          return bySymbol.CurrencyId;
        }
      }
      return null;
    };

    // Kur sistemi aktifse kullanıcının para birimi (yoksa program), kapalıysa her zaman uygulamanın (program) para birimi.
    const varsayilanParaBirimiID = kurSistemiAktif
      ? resolveCurrencyId(activeCurrency.KullaniciParaBirimi) ?? resolveCurrencyId(activeCurrency.ProgramParaBirimi)
      : resolveCurrencyId(activeCurrency.ProgramParaBirimi);
    if (varsayilanParaBirimiID != null && !paraBirimiIDValue) {
      setValue(name, varsayilanParaBirimiID);
      paraBirimiVarsayilanSetRef.current = true;
    }
  }, [kurSistemiAktif, activeCurrency, currencies, paraBirimiIDValue, setValue, name]);

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        maxWidth: "400px",
        gap: "10px",
        flexDirection: "row",
      }}
    >
      <Text style={{ display: "flex", fontSize: "14px", flexDirection: "row" }}>{t("paraBirimiSecimi")}</Text>
      <div
        style={{
          display: "flex",
          flexFlow: "column wrap",
          alignItems: "flex-start",
          width: "100%",
          maxWidth: "220px",
        }}
      >
        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              style={{ width: "100%" }}
              disabled={!kurSistemiAktif}
              allowClear
              showSearch
              optionFilterProp="label"
              loading={loadingCurrencies}
              placeholder={t("paraBirimiSecimi")}
              options={currencies.map((curr) => ({
                value: curr.CurrencyId,
                label: `${curr.Name} (${curr.Code} - ${curr.Symbol})`,
              }))}
            />
          )}
        />
        {showKur && Number(paraBirimiKur) > 0 && (
          <Text type="secondary" style={{ fontSize: "12px", marginTop: "4px" }}>
            {`${t("kur")}: 1 ${paraBirimiSymbol || ""} = ${formatNumberWithSeparators(paraBirimiKur, currentLang)}`}
            {genelToplamDovizli != null && ` | ${t("genelToplamTL")}: ${formatNumberWithSeparators(Number(genelToplamDovizli).toFixed(2), currentLang)}`}
          </Text>
        )}
      </div>
    </div>
  );
}
