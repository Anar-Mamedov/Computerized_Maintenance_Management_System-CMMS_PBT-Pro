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

  // Add a ref to track API call status
  const apiCallInProgressRef = useRef(false);

  // Context'ten rapor verileri için gerekli state ve fonksiyonları al
  const { reportData, updateReportData, setReportLoading } = useAppContext();

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
        const response = await AxiosInstance.get("PbakimYaklasanSureSayi");
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
   * 1) Parametreleri çekme
   */
  useEffect(() => {
    const fetchParametreler = async () => {
      try {
        // GetPeriyodikBakimAyar endpoint'ine istek atıyoruz
        const response = await AxiosInstance.get("GetPeriyodikBakimAyar");
        // Dönen response'un array olduğunu varsayıyoruz (örneğinizde array döndüğü belirtilmişti)
        if (response && Array.isArray(response)) {
          setParametreler(response);
        }
      } catch (error) {
        console.error("Parametreleri çekerken hata oluştu:", error);
      }
    };

    fetchParametreler();
  }, []);

  /**
   * 2) Parametreler geldikten sonra kontrol et
   *    - "320143" (true/false)
   *    - "320144" (kaç gün eklenecek)
   */
  useEffect(() => {
    if (parametreler.length > 0) {
      // 320143 kodlu parametre
      const param320143 = parametreler.find((item) => item.PRM_KOD === "320143");
      // 320144 kodlu parametre
      const param320144 = parametreler.find((item) => item.PRM_KOD === "320144");

      // "320143" -> "true" ise otomatik bakım oluşturma devreye girecek
      if (param320143?.PRM_DEGER === "true") {
        // "320144" kodlu parametrenin değeri integer'a dönüştürülüyor
        const kacGun = parseInt(param320144?.PRM_DEGER) || 0; // değeri yoksa 0 alır

        // şimdi otomatik iş emirleri listesini fetch'liyoruz
        fetchDataOtomatikIsEmirleriListe(kacGun);
      } else {
        // "320143" -> "false" ise hiçbir şey yapmadan devam edebilirsiniz.
        // Eğer bu durumda listeyi de sıfırlamak isterseniz buraya setOtomatikIsEmirleriListe(null) koyabilirsiniz.
      }
    }
  }, [parametreler]);

  /**
   * 3) Otomatik iş emirleri listesini çek
   *    - kacGun kadar ileriki tarihleri TARIH1 ve TARIH2'ye ekliyoruz
   */
  const fetchDataOtomatikIsEmirleriListe = async (daysToAdd = 0) => {
    setOtomatikIsEmirleriListe(null); // Clear the state
    const body = {
      TARIH1: dayjs().add(daysToAdd, "day").format("YYYY-MM-DD"),
      TARIH2: dayjs().add(daysToAdd, "day").format("YYYY-MM-DD"),
    };
    try {
      const response = await AxiosInstance.post(`PBakimTarihGetList`, body);
      setOtomatikIsEmirleriListe(response);
    } catch (error) {
      console.error(error);
    }
  };

  /**
   * 4) Liste geldikten sonra otomatik iş emri oluşturma logic
   */
  const handleAutoCreateWorkOrder = async () => {
    let isError = false;
    // Ensure that the list exists and has items
    if (otomatikIsEmirleriListe && otomatikIsEmirleriListe.length > 0) {
      // Seçili satırlar üzerinde döngü yaparak her birini API ye gönder
      for (const row of otomatikIsEmirleriListe) {
        try {
          const body = {
            PBakimId: row.BakimKodu,
            MakineId: row.MakineKodu,
            Tarih: row.HedefTarihi,
          };
          // API isteğini gönder
          const response = await AxiosInstance.post(`IsEmriOlustur`, body);
          // console.log("İşlem başarılı:", response);

          if (response.status_code === 200 || response.status_code === 201) {
            isError = false;
          } else {
            isError = true;
          }
        } catch (error) {
          isError = true;
          console.error("Silme işlemi sırasında hata oluştu:", error);
        }
      }

      // Tüm Api işlemlerinden sonra eğer hata oluşmamışsa listeyi sıfırla
      if (!isError) {
        setOtomatikIsEmirleriListe(null);
      }
    }
  };

  /**
   * 5) otomatikIsEmirleriListe dolunca (null değil ve length>0) otomatik iş emri oluştur
   */
  useEffect(() => {
    if (otomatikIsEmirleriListe && otomatikIsEmirleriListe.length > 0) {
      handleAutoCreateWorkOrder();
      // console.log(otomatikIsEmirleriListe);
    }
  }, [otomatikIsEmirleriListe]);

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
