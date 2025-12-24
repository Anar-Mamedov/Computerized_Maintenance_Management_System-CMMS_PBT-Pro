import tr_TR from "antd/es/locale/tr_TR";
// import "@ant-design/v5-patch-for-react-19";
import { PlusOutlined } from "@ant-design/icons";
import { Button, Space, ConfigProvider, Modal, message } from "antd";
import React, { useEffect, useState } from "react";
import { t } from "i18next";
import MainTabs from "./components/MainTabs/MainTabs";
import { useForm, FormProvider } from "react-hook-form";
import dayjs from "dayjs";
import "dayjs/locale/tr";
import "dayjs/locale/en";
import "dayjs/locale/az";
import "dayjs/locale/ru";
import AxiosInstance from "../../../../api/http.jsx";
import Footer from "../Footer";
import SecondTabs from "./components/SecondTabs/SecondTabs.jsx";
// import SecondTabs from "./components/secondTabs/secondTabs";

const normalizeMaterialMovements = (items) => {
  if (!Array.isArray(items)) {
    return [];
  }

  return items.map((item, index) => {
    const kdvValue = item?.kdvDahilHaric;
    const normalizedKdv = typeof kdvValue === "boolean" ? kdvValue : String(kdvValue || "H").toUpperCase() === "D";

    return {
      id: item?.siraNo ?? `${item?.malzemeId || "movement"}-${index}`,
      malzemeId: item?.malzemeId != null ? Number(item.malzemeId) : null,
      birimKodId: item?.birimKodId != null ? Number(item.birimKodId) : null,
      malzemeKodu: item?.malzemeKod ?? "",
      malzemeTanimi: item?.malzemeName ?? "",
      malzemeTipi: item?.malzemeTipi ?? "",
      miktar: Number(item?.miktar ?? 0),
      birim: item?.birimName ?? "",
      fiyat: Number(item?.fiyat ?? 0),
      araToplam: Number(item?.araToplam ?? 0),
      indirimOrani: Number(item?.indirimOran ?? 0),
      indirimTutari: Number(item?.indirim ?? 0),
      kdvOrani: Number(item?.kdvOran ?? 0),
      kdvDahilHaric: normalizedKdv,
      kdvTutar: Number(item?.kdvTutar ?? 0),
      toplam: Number(item?.toplam ?? 0),
      malzemeLokasyon: item?.lokasyonName ?? "",
      malzemeLokasyonID: item?.lokasyonId != null ? Number(item.lokasyonId) : null,
      masrafMerkezi: item?.masrafmerkeziName ?? "",
      masrafMerkeziID: item?.masrafmerkezi != null ? Number(item.masrafmerkezi) : null,
      aciklama: item?.aciklama ?? "",
      isPriceChanged: item?.isPriceChanged ?? false,
    };
  });
};

export default function CreateModal({ selectedLokasyonId, onRefresh, numarator = false, siparisID = null }) {
  const [open, setOpen] = useState(false);
  const [periyodikBakim, setPeriyodikBakim] = useState("");

  const getFisNo = async () => {
    try {
      const response = await AxiosInstance.get("ModulKoduGetir?modulKodu=SFS_GIRIS_FIS_NO");
      if (response) {
        setValue("fisNo", response);
      }
    } catch (error) {
      console.error("Error fetching fisNo:", error);
      message.error("Fiş numarası alınamadı!");
    }
  };

  const showModal = () => {
    setOpen(true);
  };

  const getCurrentLocale = () => {
    if (typeof window === "undefined") {
      return "tr";
    }

    const storedLocale = localStorage.getItem("i18nextLng") || "tr";
    return storedLocale.split("-")[0];
  };

  const getLocalizedDate = (dateValue) => {
    const locale = getCurrentLocale();
    const parsed = dayjs(dateValue);
    return parsed.isValid() ? parsed.locale(locale) : null;
  };

  const getLocalizedTime = (dateValue, timeValue) => {
    const sanitizedTime = timeValue?.trim();

    if (!sanitizedTime) {
      return null;
    }
    const locale = getCurrentLocale();
    const input = `${dateValue || dayjs().format("YYYY-MM-DD")}T${sanitizedTime}`;
    const parsed = dayjs(input);
    return parsed.isValid() ? parsed.locale(locale) : null;
  };

  useEffect(() => {
    if (open) {
      if (numarator === false) {
        getFisNo();
      }
      const locale = getCurrentLocale();
      setValue("tarih", dayjs().locale(locale));
      setValue("saat", dayjs().locale(locale));

      // Reset the fisIcerigi with a timeout to avoid focus errors
      setTimeout(() => {
        setValue("fisIcerigi", []);
      }, 0);
    }
  }, [open]);

  const onClose = () => {
    Modal.confirm({
      title: "İptal etmek istediğinden emin misin?",
      content: "Kaydedilmemiş değişiklikler kaybolacaktır.",
      okText: "Evet",
      cancelText: "Hayır",
      onOk: () => {
        // First close the modal to avoid focus errors
        setOpen(false);

        // Then reset the form with a slight delay
        setTimeout(() => {
          methods.reset({
            fisNo: null,
            firma: null,
            firmaID: null,
            makineID: null,
            makine: null,
            tarih: null,
            saat: null,
            islemTipi: null,
            islemTipiID: null,
            girisDeposu: null,
            girisDeposuID: null,
            lokasyon: null,
            lokasyonID: null,
            siparisNo: null,
            siparisNoID: null,
            proje: null,
            projeID: null,
            totalAraToplam: null,
            totalIndirim: null,
            totalKdvToplam: null,
            totalGenelToplam: null,
            aciklama: null,
            ozelAlan1: null,
            ozelAlan2: null,
            ozelAlan3: null,
            ozelAlan4: null,
            ozelAlan5: null,
            ozelAlan6: null,
            ozelAlan7: null,
            ozelAlan8: null,
            ozelAlan9: null,
            ozelAlan9ID: null,
            ozelAlan10: null,
            ozelAlan10ID: null,
            ozelAlan11: null,
            ozelAlan12: null,
            fisIcerigi: [],
          });
        }, 100);
      },
      onCancel: () => {
        // Do nothing, continue from where the user left off
      },
    });
  };

  // back-end'e gönderilecek veriler

  //* export
  const methods = useForm({
    defaultValues: {
      fisNo: null,
      firma: null,
      firmaID: null,
      makineID: null,
      makine: null,
      tarih: null,
      saat: null,
      islemTipi: null,
      islemTipiID: null,
      girisDeposu: null,
      girisDeposuID: null,
      lokasyon: null,
      lokasyonID: null,
      siparisNo: null,
      siparisNoID: null,
      proje: null,
      projeID: null,
      totalAraToplam: null,
      totalIndirim: null,
      totalKdvToplam: null,
      totalGenelToplam: null,
      aciklama: null,
      ozelAlan1: null,
      ozelAlan2: null,
      ozelAlan3: null,
      ozelAlan4: null,
      ozelAlan5: null,
      ozelAlan6: null,
      ozelAlan7: null,
      ozelAlan8: null,
      ozelAlan9: null,
      ozelAlan9ID: null,
      ozelAlan10: null,
      ozelAlan10ID: null,
      ozelAlan11: null,
      ozelAlan12: null,
      fisIcerigi: [],
    },
  });

  const formatDateWithDayjs = (dateString) => {
    const formattedDate = dayjs(dateString);
    return formattedDate.isValid() ? formattedDate.format("YYYY-MM-DD") : "";
  };

  const formatTimeWithDayjs = (timeObj) => {
    const formattedTime = dayjs(timeObj);
    return formattedTime.isValid() ? formattedTime.format("HH:mm:ss") : "";
  };

  const { setValue, reset, watch } = methods;

  const siparisNoID = watch("siparisNoID") || siparisID;

  const getDataFromSiparisInfo = async (siparisNoID) => {
    try {
      const response = await AxiosInstance.get(`PrepareMalzemeFisFromSiparis?siparisId=${siparisNoID}&Numarator=${numarator}`);
      const payload = response?.data;

      const statusCode = response?.status_code;

      if (statusCode !== 200) {
        message.error("Sipariş bilgileri alınamadı!");
        return null;
      }

      return payload;
    } catch (error) {
      console.error("Error fetching siparis info:", error);
      message.error("Fiş numarası alınamadı!");
      return null;
    }
  };

  useEffect(() => {
    if (!siparisNoID || !open) {
      return;
    }

    const fetchSiparisInfo = async () => {
      const data = await getDataFromSiparisInfo(siparisNoID);

      if (!data) {
        return;
      }

      if (numarator === true) {
        setValue("fisNo", data.fisNo ?? null);
      }

      const currentLocale = getCurrentLocale();
      const localizedDate = getLocalizedDate(data.tarih);
      const localizedTime = getLocalizedTime(data.tarih, data.saat);

      setValue("tarih", localizedDate || dayjs().locale(currentLocale));
      setValue("saat", localizedTime || dayjs().locale(currentLocale));
      setValue("firmaID", data.firmaId ?? null);
      setValue("firma", data.firmaName ?? null);
      setValue("makineID", data.makineID ?? data.aracId ?? null);
      setValue("makine", data.makine ?? data.aracName ?? null);
      setValue("islemTipiID", data.islemTipiKodId ?? null);
      setValue("girisDeposuID", data.girisDepoSiraNo ?? null);
      setValue("girisDeposu", data.girisDepoName ?? null);
      setValue("lokasyonID", data.lokasyonId ?? null);
      setValue("lokasyon", data.lokasyonName ?? null);
      setValue("siparisNoID", data.siparisID ?? data.siparisId ?? null);
      setValue("siparisNo", data.siparisKodu ?? null);
      setValue("projeID", data.projeId ?? null);
      setValue("proje", data.projeName ?? null);
      setValue("totalAraToplam", data.araToplam ?? 0);
      setValue("totalIndirim", data.indirimliToplam ?? 0);
      setValue("totalKdvToplam", data.kdvToplam ?? 0);
      setValue("totalGenelToplam", data.genelToplam ?? 0);
      setValue("aciklama", data.aciklama ?? "");
      setValue("fisIcerigi", normalizeMaterialMovements(data.materialMovements));
    };

    fetchSiparisInfo();
  }, [siparisNoID, numarator, setValue, open]);

  //* export
  const onSubmit = (data) => {
    const Body = {
      fisNo: data.fisNo,
      aracId: data.makineID || -1,
      // firma: data.firma,
      firmaId: Number(data.firmaID) || -1,
      tarih: formatDateWithDayjs(data.tarih),
      saat: formatTimeWithDayjs(data.saat),
      // islemTipi: data.islemTipi,
      islemTipiKodId: Number(data.islemTipiID) || -1,
      // girisDeposu: data.girisDeposu,
      girisDepoSiraNo: Number(data.girisDeposuID) || -1,
      // lokasyon: data.lokasyon,
      lokasyonId: Number(data.lokasyonID) || -1,
      // siparisNo: data.siparisNo,
      siparisID: Number(data.siparisNoID) || -1,
      // proje: data.proje,
      projeId: Number(data.projeID) || -1,
      masrafmerkezID: Number(data.masrafMerkeziID) || -1,
      araToplam: Number(data.totalAraToplam),
      indirimliToplam: Number(data.totalIndirim),
      kdvToplam: Number(data.totalKdvToplam),
      genelToplam: Number(data.totalGenelToplam),
      aciklama: data.aciklama,
      ozelAlan1: data.ozelAlan1,
      ozelAlan2: data.ozelAlan2,
      ozelAlan3: data.ozelAlan3,
      ozelAlan4: data.ozelAlan4,
      ozelAlan5: data.ozelAlan5,
      ozelAlan6: data.ozelAlan6,
      ozelAlan7: data.ozelAlan7,
      ozelAlan8: data.ozelAlan8,
      ozelAlan9: data.ozelAlan9,
      ozelAlan10: data.ozelAlan10,
      ozelAlanKodId11: Number(data.ozelAlan11ID) || 0,
      ozelAlanKodId12: Number(data.ozelAlan12ID) || 0,
      ozelAlanKodId13: Number(data.ozelAlan13ID) || 0,
      ozelAlanKodId14: Number(data.ozelAlan14ID) || 0,
      ozelAlanKodId15: Number(data.ozelAlan15ID) || 0,
      ozelAlan16: Number(data.ozelAlan16) || 0,
      ozelAlan17: Number(data.ozelAlan17) || 0,
      ozelAlan18: Number(data.ozelAlan18) || 0,
      ozelAlan19: Number(data.ozelAlan19) || 0,
      ozelAlan20: Number(data.ozelAlan20) || 0,
      islemTip: "01",
      gc: "G",
      fisTip: "MALZEME",
      materialMovements:
        data.fisIcerigi?.map((item) => ({
          tarih: formatDateWithDayjs(data.tarih),
          firmaId: Number(data.firmaID),
          girisDepoSiraNo: Number(data.girisDeposuID),
          isPriceChanged: item.isPriceChanged || false,
          // malzemeKodu: item.malzemeKodu,
          // malzemeTanimi: item.malzemeTanimi,
          // malzemeTipi: item.malzemeTipi,
          malzemeId: Number(item.malzemeId),
          // birim: item.birim,
          birimKodId: Number(item.birimKodId),
          miktar: Number(item.miktar),
          fiyat: Number(item.fiyat),
          araToplam: Number(item.araToplam),
          indirimOran: Number(item.indirimOrani),
          indirim: Number(item.indirimTutari),
          kdvOran: Number(item.kdvOrani),
          kdvDahilHaric: item.kdvDahilHaric ? "D" : "H",
          kdvTutar: Number(item.kdvTutar),
          toplam: Number(item.toplam),
          // lokasyon: item.malzemeLokasyon,
          lokasyonId: Number(item.malzemeLokasyonID),
          masrafmerkezi: Number(item.masrafMerkeziID),
          aciklama: item.aciklama,
          gc: "G",
          fisTip: "MALZEME",
        })) || [],
    };

    AxiosInstance.post("UpsertMalzemeFisWithItems", Body)
      .then((response) => {
        // Handle successful response here, e.g.:
        console.log("Data sent successfully:", response);

        if (response.status_code === 200 || response.status_code === 201) {
          message.success("Ekleme Başarılı.");

          // First close the modal to avoid focus errors
          setOpen(false);
          onRefresh();

          // Then reset the form with a slight delay
          setTimeout(() => {
            methods.reset({
              fisNo: null,
              firma: null,
              firmaID: null,
              makineID: null,
              makine: null,
              tarih: null,
              saat: null,
              islemTipi: null,
              islemTipiID: null,
              girisDeposu: null,
              girisDeposuID: null,
              lokasyon: null,
              lokasyonID: null,
              siparisNo: null,
              siparisNoID: null,
              proje: null,
              projeID: null,
              totalAraToplam: null,
              totalIndirim: null,
              totalKdvToplam: null,
              totalGenelToplam: null,
              aciklama: null,
              ozelAlan1: null,
              ozelAlan2: null,
              ozelAlan3: null,
              ozelAlan4: null,
              ozelAlan5: null,
              ozelAlan6: null,
              ozelAlan7: null,
              ozelAlan8: null,
              ozelAlan9: null,
              ozelAlan9ID: null,
              ozelAlan10: null,
              ozelAlan10ID: null,
              ozelAlan11: null,
              ozelAlan12: null,
              fisIcerigi: [],
            });
          }, 100);
        } else if (response.data.statusCode === 401) {
          message.error("Bu işlemi yapmaya yetkiniz bulunmamaktadır.");
        } else {
          message.error("Ekleme Başarısız.");
        }
      })
      .catch((error) => {
        // Handle errors here, e.g.:
        console.error("Error sending data:", error);
        message.error("Başarısız Olundu.");
      });
    console.log({ Body });
  };

  useEffect(() => {
    // Eğer selectedLokasyonId varsa ve geçerli bir değerse, formun default değerini güncelle
    if (selectedLokasyonId !== undefined && selectedLokasyonId !== null) {
      methods.reset({
        ...methods.getValues(),
        selectedLokasyonId: selectedLokasyonId,
      });
    }
  }, [selectedLokasyonId, methods]);

  const periyodikBilgisi = watch("periyodikBilgisi");

  useEffect(() => {
    if (periyodikBilgisi === true) {
      setPeriyodikBakim("[Periyodik Bakım]");
    } else {
      setPeriyodikBakim("");
    }
  }, [periyodikBilgisi]);

  return (
    <FormProvider {...methods}>
      <ConfigProvider locale={tr_TR}>
        {numarator ? (
          <div
            className="menu-item-hover"
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "12px",
              cursor: "pointer",
              padding: "10px 12px",
              transition: "background-color 0.3s",
              width: "100%",
            }}
            onClick={showModal}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f5f5f5")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
          >
            <div>
              <PlusOutlined style={{ color: "#2bc770", fontSize: "18px", marginTop: "4px" }} />
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontWeight: "500", color: "#262626", fontSize: "14px", lineHeight: "1.2" }}>
                {t("fisOlustur")}
              </span>
              <span style={{ fontSize: "12px", color: "#8c8c8c", marginTop: "4px", lineHeight: "1.4" }}>
                {t("fisOlusturAciklama")}
              </span>
            </div>
          </div>
        ) : (
          <Button
            type="primary"
            onClick={showModal}
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <PlusOutlined />
            {t("ekle")}
          </Button>
        )}
        <Modal
          width="1340px"
          centered
          title={t("yeniGirisFisi")}
          destroyOnClose
          open={open}
          onCancel={onClose}
          footer={
            <Space>
              <Button onClick={onClose}>{t("iptal")}</Button>
              <Button
                type="submit"
                onClick={methods.handleSubmit(onSubmit)}
                style={{
                  backgroundColor: "#2bc770",
                  borderColor: "#2bc770",
                  color: "#ffffff",
                }}
              >
                {t("kaydet")}
              </Button>
            </Space>
          }
        >
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            <div>
              <MainTabs modalOpen={open} />
              <SecondTabs modalOpen={open} />
              {/*<Footer />*/}
            </div>
          </form>
        </Modal>
      </ConfigProvider>
    </FormProvider>
  );
}
