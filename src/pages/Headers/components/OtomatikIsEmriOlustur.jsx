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
