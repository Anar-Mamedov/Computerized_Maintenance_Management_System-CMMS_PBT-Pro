import React, { useEffect, useState } from "react";
import { message } from "antd";
import Kullanici from "./components/Kullanici";
import Bildirim from "./components/Bildirim";
import FirmaLogo from "./components/FirmaLogo.jsx";
import Hatirlatici from "./components/Hatirlatici.jsx";
import AxiosInstance from "../../api/http.jsx";
import SearchComponent from "./components/SearchComponent.jsx";
import LanguageSelectbox from "../components/Language/LanguageSelectbox.jsx";
import dayjs from "dayjs";

export default function Header() {
  const [hatirlaticiData, setHatirlaticiData] = useState(null);
  const [otomatikIsEmirleriListe, setOtomatikIsEmirleriListe] = useState(null);
  const [parametreler, setParametreler] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

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

  useEffect(() => {
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
  }, []);

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
          console.log("İşlem başarılı:", response);

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

  console.log(otomatikIsEmirleriListe);

  return (
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
        <Bildirim />
        <Kullanici />
      </div>
    </div>
  );
}
