import tr_TR from "antd/es/locale/tr_TR";
// import "@ant-design/v5-patch-for-react-19";
import { PlusOutlined } from "@ant-design/icons";
import { Button, Space, ConfigProvider, Modal, message } from "antd";
import React, { useEffect, useState } from "react";
import { t } from "i18next";
import MainTabs from "./components/MainTabs/MainTabs";
import { useForm, FormProvider } from "react-hook-form";
import dayjs from "dayjs";
import AxiosInstance from "../../../../api/http.jsx";
import Footer from "../Footer";
import SecondTabs from "./components/SecondTabs/SecondTabs.jsx";
// import SecondTabs from "./components/secondTabs/secondTabs";

export default function CreateModal({ selectedLokasyonId, onRefresh, numarator = false }) {
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

  useEffect(() => {
    if (open) {
      if (numarator === false) {
        getFisNo();
      }
      setValue("tarih", dayjs());
      setValue("saat", dayjs());

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

  const siparisNoID = watch("siparisNoID");

  const getDataFromSiparisInfo = async (siparisNoID) => {
    try {
      const response = await AxiosInstance.get(`PrepareMalzemeFisFromSiparis?siparisId=${siparisNoID}&Numarator=${numarator}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching siparis info:", error);
      message.error("Fiş numarası alınamadı!");
      return null;
    }
  };

  useEffect(() => {
    if (!siparisNoID) {
      return;
    }

    const fetchSiparisInfo = async () => {
      const data = await getDataFromSiparisInfo(siparisNoID);

      if (!data) {
        return;
      }
      if (numarator === true) {
        setValue("fisNo", data.fisNo);
      }
      setValue("firmaID", data.firmaId);
      setValue("firma", data.firmaName);
      setValue("makineID", data.makineID);
      setValue("makine", data.makine);
    };

    fetchSiparisInfo();
  }, [siparisNoID, numarator, setValue]);

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
      siparisNoId: Number(data.siparisNoID) || -1,
      // proje: data.proje,
      projeId: Number(data.projeID) || -1,
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
        <Modal
          width="1300px"
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
