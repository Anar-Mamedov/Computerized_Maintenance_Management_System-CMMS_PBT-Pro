import React, { useEffect, useState, useRef } from "react";
import { message, notification, Spin } from "antd";
import Kullanici from "./components/Kullanici";
import Bildirim from "./components/Bildirim";
import FirmaLogo from "./components/FirmaLogo.jsx";
import Hatirlatici from "./components/Hatirlatici.jsx";
import AxiosInstance from "../../api/http.jsx";
import SearchComponent from "./components/SearchComponent.jsx";
import LanguageSelectbox from "../components/Language/LanguageSelectbox.jsx";
import dayjs from "dayjs";
import { useAppContext } from "../../AppContext.jsx";
import RaporModal1 from "../Rapor&Formlar/RaporYonetimi/RaporTabs/components/RaporModal/RaporModal1.jsx";

export default function Header() {
  const [hatirlaticiData, setHatirlaticiData] = useState(null);
  const [otomatikIsEmirleriListe, setOtomatikIsEmirleriListe] = useState(null);
  const [parametreler, setParametreler] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [reportResponse, setReportResponse] = useState([]);
  const [raporModalVisible, setRaporModalVisible] = useState(false);
  const [kullaniciData, setKullaniciData] = useState(null);

  // Add a ref to track API call status
  const apiCallInProgressRef = useRef(false);

  // Context'ten rapor verileri için gerekli state ve fonksiyonları al
  const { reportData, updateReportData, setReportLoading } = useAppContext();

  // Kullanıcı bilgilerini getiren API isteği
  useEffect(() => {
    const fetchKullaniciData = async () => {
      try {
        // localStorage'dan userKey'i al ve içindeki userId'yi çıkar
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        const userId = user.userId;

        if (userId) {
          const response = await AxiosInstance.get(`GetKullaniciById?id=${userId}`);
          setKullaniciData(response);

          // Response içerisinde KLL_ROL_ID kontrolü
          if (response && response.KLL_ROL_ID > 0) {
            // KLL_ROL_ID değeri varsa, GetKullaniciYetkiById endpoint'ine istek at
            try {
              const yetkiResponse = await AxiosInstance.get(`GetKullaniciYetkiById?id=${response.KLL_ROL_ID}`);
              localStorage.setItem("userAuthorization", JSON.stringify(yetkiResponse));
              // İhtiyaca göre bu veriyi state'e kaydedebilirsiniz
            } catch (yetkiError) {
              console.error("Kullanıcı yetki bilgileri alınırken hata oluştu:", yetkiError);
            }
          } else if (response && response.KLL_ROL_ID == 0) {
            try {
              const yetkiResponse = await AxiosInstance.get(`GetKullaniciYetkiById?id=${userId}`);
              localStorage.setItem("userAuthorization", JSON.stringify(yetkiResponse));
            } catch (yetkiError) {
              console.error("Kullanıcı yetki bilgileri alınırken hata oluştu:", yetkiError);
            }
          }
        }
      } catch (error) {
        console.error("Kullanıcı bilgileri alınırken hata oluştu:", error);
      }
    };

    fetchKullaniciData();
  }, []);

  useEffect(() => {
    const checkInternetConnection = () => {
      if (!navigator.onLine) {
        message.error("Ağ bağlantınız kesildi", 5); // 3 saniye sonra kaybolur
      }
    };

    // Her 30 saniyede bir internet bağlantısını kontrol et
    const interval = setInterval(checkInternetConnection, 15000);

    // Component unmount edildiğinde interval'ı temizle
    return () => clearInterval(interval);
  }, []);

  /*   useEffect(() => {
    const checkInternetConnection1 = async () => {
      const timeout = new Promise((_, reject) => setTimeout(() => reject(new Error("Request timed out")), 2000));

      try {
        const response = await Promise.race([fetch("https://www.google.com", { mode: "no-cors" }), timeout]);
        if (response) {
          // Veribaglanti();
          // message.success("İnternet bağlantısi sağlandı", 5); // 3 saniye sonra kaybolur
        }
      } catch (error) {
        message.error("İnternet bağlantınız kesildi", 5); // 3 saniye sonra kaybolur
      }
    };

    const intervalId = setInterval(checkInternetConnection1, 15000); // 15 saniye = 15000 ms

    // Cleanup function to clear the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []); */

  const Veribaglanti = async () => {
    const timeout = new Promise((_, reject) => setTimeout(() => reject(new Error("Request timed out")), 2000));
    try {
      const response = await Promise.race([AxiosInstance.get("VeritabaniBaglantiKontrol"), timeout]);
    } catch (error) {
      message.error("Sunucu bağlantınız kesildi", 5); // 3 saniye sonra kaybolur
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const lan = localStorage.getItem("i18nextLng") || "tr";
        const response = await AxiosInstance.get(`GetHatirlaticilar?dil=${lan}`);
        setHatirlaticiData(response);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [open]);

  /**
   * RaporModal fonksiyonunu buraya taşıdık
   * Context'teki rapor verilerini güncelleyen fonksiyon
   */
  const fetchReportLists = async () => {
    const { selectedRow, kullaniciRaporu, filters } = reportData;

    // Eğer gerekli veriler yoksa, işleme devam etme
    if (!selectedRow || !filters || filters.length === 0) {
      return;
    }

    // API isteği parametrelerini kaydedelim, bu sayede modal kapansa bile
    // kullanabiliriz
    const requestParams = {
      reportRow: { ...selectedRow },
      isUserReport: kullaniciRaporu === true,
      reportFilters: { ...filters[0] },
    };

    setReportLoading(true);
    const lan = localStorage.getItem("i18nextLng") || "tr";

    try {
      // İşlem başlangıcında bildirim göster - sadece kullanıcı raporu ise
      if (kullaniciRaporu === true) {
        notification.info({
          message: "Rapor Hazırlanıyor",
          description: (
            <div>
              Rapor hazırlanıyor, lütfen bekleyin... <Spin size="small" />
            </div>
          ),
          duration: 0,
          placement: "bottomLeft",
          key: "reportNotification",
        });
      }

      const response = await AxiosInstance.post(`GetReportDetail?KullaniciRaporu=${kullaniciRaporu}`, {
        id: selectedRow.key,
        lan: lan,
        // ...filters[0],
        LokasyonID: filters[0].LokasyonID,
        AtolyeID: filters[0].AtolyeID,
        BaslamaTarih: filters[0].BaslamaTarih,
        BitisTarih: filters[0].BitisTarih,
      });

      const { headers, list } = response;
      if (headers && headers.length > 0) {
        // Map headers to columns
        const cols = headers.map((header) => {
          // Calculate width based on header length
          const headerLength = header.title.length;
          const width = Math.max(headerLength * 10, 150);

          return {
            title: header.title,
            dataIndex: header.dataIndex,
            key: header.dataIndex,
            visible: header.visible,
            width,
            isDate: header.isDate,
            isYear: header.isYear,
            isHour: header.isHour,
            isNumber: header.isNumber,
            // varsa default filter değerleri:
            isFilter: header.isFilter,
            isFilter1: header.isFilter1,
          };
        });

        // Default filters oluştur
        const defaultFilters = {};
        cols.forEach((col) => {
          const val1 = col.isFilter?.trim() || "";
          const val2 = col.isFilter1?.trim() || "";
          if (val1 !== "" || val2 !== "") {
            defaultFilters[col.dataIndex] = [val1, val2];
          }
        });

        // Context'teki verileri güncelle
        updateReportData({
          initialColumns: cols,
          columns: cols,
          tableData: list,
          originalData: list,
          columnFilters: defaultFilters,
          filters: requestParams.reportFilters,
          reportName: requestParams.reportRow.RPR_TANIM || requestParams.reportRow.key,
          totalRecords: list.length,
        });

        // requestParams nesnesindeki değerleri kullanarak, modal kapansa bile
        // sessionStorage yerine state'e kaydedelim
        if (requestParams.isUserReport) {
          try {
            const reportData = {
              headers: cols,
              list: list,
              timestamp: new Date().toISOString(),
              filters: requestParams.reportFilters,
              totalRecords: list.length,
              reportName: requestParams.reportRow.RPR_TANIM || requestParams.reportRow.key,
            };

            // State'e kaydet
            setReportResponse((prevResponses) => [...prevResponses, reportData]);
            console.log("apiden gelen rapor verileri:", response);

            // İşlem tamamlandığında bildirim göster ve raporu açmak için link ver
            notification.success({
              message: "Rapor Hazır",
              description: (
                <div style={{ display: "flex", flexDirection: "column" }}>
                  Rapor başarıyla hazırlandı.{" "}
                  <a
                    onClick={() => {
                      // Rapor verisini context'e zaten yüklediğimizden,
                      // sadece modal'ı açmamız yeterli
                      setRaporModalVisible(true);
                    }}
                  >
                    {reportData.reportName} - {reportData.totalRecords} kayıt
                  </a>
                </div>
              ),
              duration: 0, // Sonsuz süre için 0 değeri kullanılır
              key: "reportNotification", // Aynı bildirim için benzersiz bir anahtar
              placement: "bottomLeft",
            });

            console.log(`Rapor verileri state'e kaydedildi: ${reportData.reportName}`);
          } catch (error) {
            console.warn("Rapor verileri işlenirken bir hata oluştu:", error.message);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching report detail:", error);
      notification.error({
        message: "Hata",
        description: "Rapor verileri yüklenirken bir hata oluştu.",
        duration: 5,
      });
    } finally {
      setReportLoading(false);
    }
  };

  // Rapor verilerindeki filters veya selectedRow değiştiğinde fetch işlemini çalıştır
  useEffect(() => {
    // Criteria for running the API call
    const shouldFetchData = reportData.filters.length > 0 && reportData.selectedRow && !reportData.requestInProgress && !apiCallInProgressRef.current;

    if (shouldFetchData) {
      // Set both flags to prevent duplicate calls
      apiCallInProgressRef.current = true;
      updateReportData({ requestInProgress: true });

      fetchReportLists()
        .catch((error) => {
          console.error("Error fetching report data:", error);
        })
        .finally(() => {
          // Clear both flags when done
          apiCallInProgressRef.current = false;
          updateReportData({ requestInProgress: false });
        });
    }
  }, [reportData.filters, reportData.selectedRow]);

  return (
    <>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          padding: "10px 10px",
          width: "100%",
          justifyContent: "speace-between",
          gap: "10px",
        }}
      >
        <FirmaLogo />
        <LanguageSelectbox />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            padding: "10px 10px",
            width: "100%",
            justifyContent: "flex-end",
            gap: "10px",
          }}
        >
          <SearchComponent />
          <Hatirlatici hatirlaticiData={hatirlaticiData} loading={loading} open={open} setOpen={setOpen} />
          <Bildirim reportResponse={reportResponse} setRaporModalVisible={setRaporModalVisible} updateReportData={updateReportData} />
          <Kullanici />
        </div>
      </div>

      {/* Rapor Modal bileşeni */}
      {raporModalVisible && (
        <RaporModal1
          selectedRow={reportData.selectedRow}
          drawerVisible={raporModalVisible}
          onDrawerClose={() => setRaporModalVisible(false)}
          // Modal'a özel prop ekleyelim - yeni API isteği yapılmaması için
          dataAlreadyLoaded={true}
        />
      )}
    </>
  );
}
