import React, { useEffect, useState } from "react";
import { Typography, Input, Spin, message, Divider, Pagination, Tag, Button } from "antd";
import { useFormContext } from "react-hook-form";
import AxiosInstance from "../../../../../../api/http.jsx";
import { t } from "i18next";

const { Text } = Typography;

function Yetkiler() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // Current page
  const itemsPerPage = 10; // Items per page
  const [searchTerm, setSearchTerm] = useState(""); // Search term

  const { watch } = useFormContext();

  const userID = watch("siraNo");

  const customYetkiTanimlari = {
    2: t("yakitIslemleri"),
    3: t("makineAktarimi"),
    4: t("malzemeAktarimi"),
    5: t("malzemeHareketleriAktarimi"),
    1001: t("makineTanimlari"),
    1002: t("ekipmanVeritabani"),
    1003: t("lokasyonTanimlari"),
    1004: t("sayacGuncelleme"),
    1005: t("aracIslemleri"),
    1006: t("calismaTakvimleri"),
    1007: t("sigortaTakibi"),
    1008: t("garantiTakibi"),
    1009: t("amortismanTakibi"),
    1010: t("makineCalismaListesi"),
    1011: t("projeTanimlari"),
    1012: t("makinePuantajlari"),
    1013: t("calismaDeErleri"),
    1014: t("projeTeklifleri"),
    1015: t("cageKodlari"),
    1016: t("makineTransferIslemleri"),
    1017: t("transferOnayYetkisi"),
    1020: t("ekipmanDepolari"),
    1021: t("makineDurusTakibi"),
    1501: t("makineAnalizi"),
    1502: t("arizaAnalizi"),
    1503: t("durusAnalizi"),
    1504: t("aracListeleri"),
    1505: t("aracKontrolAnalizleri"),
    1506: t("makineMaliyetAnalizleri"),
    1507: t("makineYakitAnalizleri"),
    1508: t("makineCalismaAnalizleri"),
    1509: t("makineEnCoklarAnalizleri"),
    1510: t("otonomBakimAnalizi"),
    2001: t("bakimKartlari"),
    2002: t("arizaTanimlari"),
    2003: t("isEmirleri"),
    2004: t("periyodikBakimPlanlari"),
    2005: t("otomatikIsEmirleri"),
    2006: t("planlamaTakvimi"),
    2007: t("talimatlar"),
    2008: t("cZumKataloglari"),
    2009: t("aracGerecler"),
    2010: t("isEmriDuzenlemeTarihi"),
    2011: t("isEmriKapatma"),
    2014: t("isEmriBaslamaTarihi"),
    2015: t("isEmriBitisTarihi"),
    2501: t("isEmirleriAnalizi"),
    2502: t("bakimArizaMaliyetAnalizi"),
    2503: t("periyodikBakimAnalizi"),
    2504: t("enCoklarAnalizi"),
    2505: t("bakimOnarimSurecleriAnalizi"),
    2506: t("aylaraGReBakimArizaMaliyetleri"),
    2507: t("isEmriMalzemeKullanimlariAnalizi"),
    2508: t("personelIscilikAnalizi"),
    3001: t("projeTakipKartlari"),
    3002: t("makineCalismaListesi"),
    3003: t("personelPuantajlari"),
    3004: t("taseronHakedisleri"),
    3005: t("harcamalar"),
    3006: t("projeTanimlari"),
    3007: t("malzemeTalepleri"),
    3008: t("sayacGuncelleme"),
    3009: t("yakitIslemleri"),
    3010: t("santiyeFaaliyetRaporu"),
    3011: t("taseronHakedisRaporu"),
    3012: t("projeTakibi"),
    3013: t("personelAvansIslemleri"),
    3020: t("taseronSZlesmeleri"),
    3021: t("taseronCalismalari"),
    3501: t("projeAnalizleri"),
    3502: t("projeGerlirGiderAnalizi"),
    3503: t("santiyeFaliyetAnalizi"),
    3504: t("hakedisAnalizi"),
    3505: t("projeMalzemeKullanimi"),
    3506: t("harcamaAnalizi"),
    3507: t("yakitKullanimAnalizi"),
    3508: t("calismaSureleriAnalizi"),
    3509: t("gunlukFaliyetAnalizi"),
    3510: t("maliyetRaporu"),
    3511: t("harcamaRaporu"),
    4001: t("malzemeTanimlari"),
    4002: t("malzemeDepolari"),
    4003: t("malzemeGirisFisi"),
    4004: t("malzemeCikisFisi"),
    4005: t("malzemeTransferFisi"),
    4006: t("stokSayimlari"),
    4007: t("hizliMaliyetlendirme"),
    4501: t("malzemeDepoAnalizleri"),
    4502: t("malzemeStokEnvanteri"),
    4503: t("malzemeKullanimlariAnalizi"),
    4504: t("malzemeFiyatListesi"),
    4505: t("malzemeFiyatlariAnalizi"),
    4506: t("malzemeHareketleriAnalizi"),
    4507: t("malzemeMaliyetleriAnalizi"),
    4508: t("malzemeStokEnvanteriAnalizi"),
    4509: t("malzemeTalepleriAnalizi"),
    4510: t("malzemeTransferiOnayIslemleri"),
    5001: t("malzemeTalepleri"),
    5003: t("satinalmaSiparisleri"),
    5004: t("satinalmaYNetimi"),
    5005: t("tedarikciFirmalar"),
    5006: t("satinalmaSZlesmeleri"),
    5007: t("malzemeIhtiyaclari"),
    5008: t("onayIslemleri"),
    5009: t("genelTanimlar"),
    5501: t("malzemeTalepleriAnalizi"),
    5502: t("siparisAnalizi"),
    5503: t("tedarikciAnalizi"),
    5504: t("fiyatAnalizi"),
    5505: t("malzemeFiyatAnalizi"),
    5506: t("talepKarsilamaAnalizi"),
    6000: t("yakitTanimlari"),
    6001: t("yakitTanklari"),
    6002: t("yakitGirisFisi"),
    6003: t("yakitCikisFisi"),
    6004: t("yakitTransferFisi"),
    6005: t("yakitIslemleri"),
    6006: t("hizliYakitGirisi"),
    6501: t("yakitHareketleri"),
    6502: t("aylikYakitGiderleri"),
    6503: t("aylikOrtalamaYakitTuketimleri"),
    6504: t("ortalamaYakitTuketimleri"),
    6505: t("toplamYakitSarfiyatlarimakine"),
    6506: t("toplamYakitSarfiyatlaripersonel"),
    6507: t("makineYakitAnalizi"),
    6508: t("yakitTuketimleriAnalizi"),
    6509: t("karsilastirmaliYakitAnalizi"),
    6510: t("yakitFisleriAnalizi"),
    6511: t("yakitTransferiOnayIslemleri"),
    7001: t("lastikIslemleri"),
    7002: t("lastikEnvanteri"),
    7003: t("lastikTanimlari"),
    7004: t("lastikMarkaModelleri"),
    7005: t("lastikDepoGirisFisi"),
    7006: t("lastikDepoCikisFisi"),
    7007: t("lastikDepoTransferFisi"),
    7008: t("lastikDepolari"),
    7053: t("lastikPerformanslari"),
    7501: t("lastikHareketleri"),
    7502: t("aracLastikleriAnalizi"),
    8001: t("firmaTanimlari"),
    8002: t("sZlesmeYNetimi"),
    8003: t("taseronHakedisleri"),
    8501: t("sZlesmeAnalizleri"),
    9001: t("personelTanimlari"),
    9002: t("atLyeTanimlari"),
    9003: t("personelPuantajlari"),
    9005: t("zimmetTeslimFisi"),
    9006: t("zimmetIadeFisi"),
    9007: t("personelIzinGirisleri"),
    9008: t("personelNBetGirisleri"),
    9009: t("personelCalismaNdeEr"),
    9501: t("personelIsEmirleriAnalizi"),
    9502: t("personelPerformanslari"),
    9503: t("personelPuantajlariAnalizi"),
    9504: t("personelKazanclariAnalizi"),
    9505: t("personelIzinleriAnalizi"),
    9506: t("personelZimmetTakibi"),
    9507: t("personelAnalizi"),
    9508: t("personelCalismaPlani"),
    10001: t("isTalepleri"),
    10002: t("yeniIsTalebi"),
    10003: t("isTalepKullanicilari"),
    10501: t("isTalepleriAnalizi"),
    10502: t("isTalepleriSurecAnalizi"),
    11001: t("kalibreEdilecekCihazlar"),
    11002: t("LcumAletleri"),
    11003: t("kalibrasyonIslemleri"),
    11004: t("kalibrasyonTakvimi"),
    11005: t("kalibrasyonGrafiI"),
    11501: t("kalibrasyonAnalizi"),
    20001: t("raporYNeticisi"),
    20002: t("formYNeticisi"),
    20003: t("dokumanYNeticisi"),
    30001: t("kontrolPaneli"),
    30002: t("kodYNetimi"),
    30003: t("parametreler"),
    30004: t("programKisayolTuslari"),
    30005: t("otomatikKodlar"),
    30006: t("servisNcelikSeviyeleri"),
    30007: t("isEmriTipleri"),
    30008: t("ilkAyarlaraGeriDN"),
    30009: t("ajanda"),
    30010: t("baslangicMerkezi"),
    30011: t("hatirlaticiAyarlari"),
    30012: t("masrafMerkezleri"),
    30013: t("veritabaniYNetimPaneli"),
    30014: t("vardiyaTanimlari"),
    30015: t("dVizTanimlari"),
    30016: t("guvenlikIziYNeticisi"),
    30018: t("onaylayicilar"),
    30019: t("projeTanimlari"),
    30020: t("gelirMerkezleri"),
    30021: t("fisTipleri"),
    50001: t("cariHesaplar"),
    50002: t("cekler"),
    50003: t("bankalar"),
    50004: t("kasalar"),
    50005: t("gelirlerGiderler"),
    50006: t("harcamalar"),
    50007: t("personelHesaplari"),
    50020: t("cariHesapIslemleri"),
    50021: t("cekIslemleri"),
    50022: t("bankaIslemleri"),
    50023: t("kasaIslemleri"),
    50024: t("gelirGiderIslemleri"),
    50025: t("harcamaIslemleri"),
    50026: t("personelIslemleri"),
    50027: t("faturaIslemleri"),
    50040: t("vadeliIslemler"),
    50041: t("hatirlatmalar"),
    50042: t("taksitIslemleri"),
    50043: t("bankaKrediTanimlari"),
    50045: t("faturaOnaylari"),
    50101: t("cariIslemAnalizleri"),
    50102: t("cekHareketleriAnalizi"),
    50103: t("bankaAnalizleri"),
    50104: t("kasaAnalizleri"),
    50105: t("gelirGiderAnalizi"),
    50106: t("harcamaAnalizleri"),
    50107: t("alisSatisAnalizleri"),
    // Other permission codes and definitions...
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await AxiosInstance.get(`GetKullaniciYetkiById?id=${userID}`);
      if (response) {
        const formattedData = response.map((item) => {
          return {
            ...item,
            key: item.KYT_YETKI_KOD,
            yetkiTanim: customYetkiTanimlari[item.KYT_YETKI_KOD] || item.YTK_TANIM || "",
            gor: item.KYT_GOR,
            ekle: item.KYT_EKLE,
            sil: item.KYT_SIL,
            degistir: item.KYT_DEGISTIR,
          };
        });
        setData(formattedData);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error in API request:", error);
      setLoading(false);
      if (navigator.onLine) {
        message.error("Hata Mesajı: " + error.message);
      } else {
        message.error("Internet Bağlantısı Mevcut Değil.");
      }
    }
  };

  useEffect(() => {
    if (userID) {
      fetchData();
    }
  }, [userID]);

  // Reset current page when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Filter data based on search term
  const filteredData = data.filter((item) => (item.yetkiTanim || "").toLowerCase().includes(searchTerm.toLowerCase()));

  // Calculate items for current page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentData = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  // Compute whether all permissions are granted or removed
  const allPermissionsGranted = data.length > 0 && data.every((item) => item.gor && item.ekle && item.sil && item.degistir);

  const allPermissionsRemoved = data.length > 0 && data.every((item) => !item.gor && !item.ekle && !item.sil && !item.degistir);

  // Function to handle toggling permissions
  const handleToggle = (key, field) => {
    // Find the item to update
    const itemToUpdate = data.find((item) => item.key === key);
    if (!itemToUpdate) return;

    const newValue = !itemToUpdate[field];
    let updatedItem = { ...itemToUpdate, [field]: newValue };

    // If 'gor' permission is set to false, set other permissions to false
    if (field === "gor" && newValue === false) {
      updatedItem = {
        ...updatedItem,
        ekle: false,
        sil: false,
        degistir: false,
      };
    }

    // Optimistically update state
    setData((prevData) => prevData.map((item) => (item.key === key ? updatedItem : item)));

    // API request body
    const body = {
      KYT_KULLANICI_ID: userID,
      KYT_YETKI_KOD: updatedItem.key,
      KYT_EKLE: updatedItem.ekle,
      KYT_GOR: updatedItem.gor,
      KYT_SIL: updatedItem.sil,
      KYT_DEGISTIR: updatedItem.degistir,
    };

    // Make API call
    AxiosInstance.post("UpdateKullaniciYetki", body)
      .then((response) => {
        message.success(t("izinBasariylaGuncellendi"));
      })
      .catch((error) => {
        message.error(t("izinGuncellenirkenBirHataOlustu"));
        console.error(error);
        // Revert changes in case of error
        setData((prevData) => prevData.map((item) => (item.key === key ? itemToUpdate : item)));
      });
  };

  // Function to grant all permissions
  const handleGrantAllPermissions = () => {
    // Optimistically update state
    const updatedData = data.map((item) => ({
      ...item,
      gor: true,
      ekle: true,
      sil: true,
      degistir: true,
    }));
    setData(updatedData);

    // Make API calls for each item
    updatedData.forEach((item) => {
      const body = {
        KYT_KULLANICI_ID: userID,
        KYT_YETKI_KOD: item.key,
        KYT_EKLE: item.ekle,
        KYT_GOR: item.gor,
        KYT_SIL: item.sil,
        KYT_DEGISTIR: item.degistir,
      };

      AxiosInstance.post("UpdateKullaniciYetki", body).catch((error) => {
        console.error(error);
        message.error(t("izinGuncellenirkenBirHataOlustu"));
      });
    });

    message.success(t("tumIzinlerVerildi"));
  };

  // Function to remove all permissions
  const handleRemoveAllPermissions = () => {
    // Optimistically update state
    const updatedData = data.map((item) => ({
      ...item,
      gor: false,
      ekle: false,
      sil: false,
      degistir: false,
    }));
    setData(updatedData);

    // Make API calls for each item
    updatedData.forEach((item) => {
      const body = {
        KYT_KULLANICI_ID: userID,
        KYT_YETKI_KOD: item.key,
        KYT_EKLE: item.ekle,
        KYT_GOR: item.gor,
        KYT_SIL: item.sil,
        KYT_DEGISTIR: item.degistir,
      };

      AxiosInstance.post("UpdateKullaniciYetki", body).catch((error) => {
        console.error(error);
        message.error(t("izinGuncellenirkenBirHataOlustu"));
      });
    });

    message.success(t("tumIzinlerKaldirildi"));
  };

  // Permission labels and colors
  const permissionLabels = {
    ekle: t("ekle"),
    sil: t("sil"),
    degistir: t("degistir"),
    gor: t("gor"),
  };

  const permissionColors = {
    ekle: "success", // green
    sil: "error", // red
    degistir: "processing", // blue
    gor: "warning", // orange
  };

  return (
    <div>
      {loading ? (
        <div style={{ minHeight: "50px" }}>
          <Spin style={{ marginTop: "40px" }} />
        </div>
      ) : (
        <>
          {/* Search Input and Buttons */}
          <div style={{ display: "flex", alignItems: "center", marginBottom: "10px", justifyContent: "space-between" }}>
            <Input placeholder={t("aramaYap")} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ width: "200px" }} />
            <div>
              <Button color="primary" variant="solid" onClick={handleGrantAllPermissions} disabled={allPermissionsGranted} style={{ marginLeft: "10px" }}>
                {t("tumIzinleriVer")}
              </Button>
              <Button color="danger" variant="solid" onClick={handleRemoveAllPermissions} disabled={allPermissionsRemoved} style={{ marginLeft: "10px" }}>
                {t("tumIzinleriKaldir")}
              </Button>
            </div>
          </div>

          {currentData.map((item) => {
            return (
              <div key={item.key} style={{ height: "40px" }}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Text>{item.yetkiTanim}</Text>
                  <div>
                    {Object.keys(permissionLabels).map((permission) => {
                      const isDisabled = !item.gor && permission !== "gor";
                      return (
                        <Tag
                          key={permission}
                          color={item[permission] ? permissionColors[permission] : "default"}
                          onClick={() => {
                            if (!isDisabled) {
                              handleToggle(item.key, permission);
                            }
                          }}
                          style={{
                            cursor: isDisabled ? "not-allowed" : "pointer",
                            marginRight: "5px",
                            opacity: isDisabled ? 0.5 : 1,
                          }}
                        >
                          {permissionLabels[permission]}
                        </Tag>
                      );
                    })}
                  </div>
                </div>
                <Divider style={{ margin: "10px 0" }} />
              </div>
            );
          })}
          <Pagination
            current={currentPage}
            align="end"
            total={filteredData.length}
            pageSize={itemsPerPage}
            onChange={(page) => setCurrentPage(page)}
            style={{ marginTop: "20px" }}
          />
        </>
      )}
    </div>
  );
}

export default Yetkiler;
