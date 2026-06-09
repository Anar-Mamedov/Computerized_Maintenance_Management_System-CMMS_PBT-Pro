import React, { createContext, useContext, useState, useEffect } from "react";
import AxiosInstance from "./api/http";
import i18n from "./utils/i18n";

// Context'i oluştur
const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

let activeRequest = null;

export const AppProvider = ({ children }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null); // Yeni durum
  const [userData1, setUserData1] = useState(null);
  const [isButtonClicked, setIsButtonClicked] = useState(false);
  
  const [activeCurrency, setActiveCurrency] = useState(null);

  const fetchActiveCurrency = async () => {
    if (activeRequest) {
      try {
        const response = await activeRequest;
        const currencyData = response?.data || response;
        setActiveCurrency(currencyData);
      } catch (err) {
        // Ignored here, handled by the main initiator try-catch block
      }
      return;
    }

    try {
      activeRequest = AxiosInstance.get("GetActiveCurrencyInfo");
      const response = await activeRequest;
      const currencyData = response?.data || response;
      setActiveCurrency(currencyData);

      if (currencyData) {
        // Use user's currency if active, fallback to program currency, fallback to Lira.
        // If the currency system is not active, output an empty symbol.
        const activeSymbol = currencyData.KurSistemiAktif
          ? (currencyData.KullaniciParaBirimi?.Symbol || currencyData.ProgramParaBirimi?.Symbol || "₺")
          : "";

        ["tr", "en", "az", "ru"].forEach((lng) => {
          i18n.addResource(lng, "translation", "paraBirimi", activeSymbol);
        });
      }
    } catch (error) {
      console.error("Error fetching active currency info:", error);
    } finally {
      activeRequest = null;
    }
  };

  useEffect(() => {
    fetchActiveCurrency();

    const handleFocus = () => {
      fetchActiveCurrency();
    };

    window.addEventListener("focus", handleFocus);
    return () => {
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  // Rapor için eklenmiş state'ler
  const [reportLoading, setReportLoading] = useState(false);
  const [reportData, setReportData] = useState({
    initialColumns: [],
    columns: [],
    tableData: [],
    originalData: [],
    columnFilters: {},
    selectedRow: null,
    kullaniciRaporu: {},
    filters: [],
    requestInProgress: false, // API isteği takibi için yeni flag
  });

  // Report verilerini güncellemek için fonksiyon
  const updateReportData = (newData) => {
    setReportData((prev) => ({
      ...prev,
      ...newData,
    }));
  };

  // Paylaşılacak değerler
  const value = {
    isModalVisible,
    setIsModalVisible,
    isLoading,
    setIsLoading,
    selectedOption, // Eklenen yeni durum
    setSelectedOption, // Yeni durumu güncelleyecek fonksiyon
    userData1,
    setUserData1,
    isButtonClicked,
    setIsButtonClicked,

    // Rapor için eklenen state ve fonksiyonlar
    reportLoading,
    setReportLoading,
    reportData,
    updateReportData,
    activeCurrency,
    fetchActiveCurrency,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
