import tr_TR from "antd/es/locale/tr_TR";
// import "@ant-design/v5-patch-for-react-19";
import { PlusOutlined } from "@ant-design/icons";
import { Button, Drawer, Space, ConfigProvider, Modal, message, Spin } from "antd";
import React, { useEffect, useState, useTransition } from "react";
import MainTabs from "./components/MainTabs/MainTabs";
import secondTabs from "./components/SecondTabs/SecondTabs";
import { useForm, Controller, useFormContext, FormProvider } from "react-hook-form";
import dayjs from "dayjs";
import AxiosInstance from "../../../../api/http.jsx";
import Footer from "../Footer";
import SecondTabs from "./components/SecondTabs/SecondTabs";
import { t } from "i18next";

export default function EditModal({ selectedRow, onDrawerClose, drawerVisible, onRefresh }) {
  const [, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const showModal = () => {
    setOpen(true);
  };
  const [loading, setLoading] = useState(false);

  const methods = useForm({
    defaultValues: {
      fisNo: null,
      firma: null,
      firmaID: null,
      makineID: null,
      makine: null,
      plaka: null,
      plakaID: null,
      masrafMerkezi: null,
      masrafMerkeziID: null,
      tarih: null,
      saat: null,
      islemTipi: null,
      islemTipiID: null,
      proje: null,
      projeID: null,
      girisDeposu: null,
      girisDeposuID: null,
      lokasyon: null,
      lokasyonID: null,
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

  const { setValue, reset, watch } = methods;

  const refreshTable = watch("refreshTable");

  // API'den gelen verileri form alanlarına set etme

  useEffect(() => {
    const handleDataFetchAndUpdate = async () => {
      if (drawerVisible && selectedRow) {
        setOpen(true); // İşlemler tamamlandıktan sonra drawer'ı aç
        setLoading(true); // Yükleme başladığında
        try {
          const response = await AxiosInstance.get(`GetMalzemeFisById?fisId=${selectedRow.key}`);
          const item = response; // Veri dizisinin ilk elemanını al
          // Form alanlarını set et
          setValue("mlzFisId", item.mlzFisId);
          setValue("fisNo", item.fisNo);
          setValue("firma", item.firmaName);
          setValue("firmaID", item.firmaId);
          setValue("makine", item.aracName);
          setValue("makineID", item.aracId);
          setValue("masrafMerkezi", item.masrafmerkezName);
          setValue("masrafMerkeziID", item.masrafmerkezID);
          setValue("tarih", item.tarih ? (dayjs(item.tarih).isValid() ? dayjs(item.tarih) : null) : null);
          setValue("saat", item.saat ? (dayjs(item.saat, "HH:mm:ss").isValid() ? dayjs(item.saat, "HH:mm:ss") : null) : null);
          setValue("islemTipi", item.islemTipiName);
          setValue("islemTipiID", item.islemTipiKodId);
          setValue("proje", item.projeName);
          setValue("projeID", item.projeId);
          setValue("girisDeposu", item.girisDepoName);
          setValue("girisDeposuID", item.girisDepoSiraNo);
          setValue("siparisNoID", item.siparisID);
          setValue("siparisNo", item.siparisKodu);
          setValue("lokasyon", item.lokasyonName);
          setValue("lokasyonID", item.lokasyonId);
          setTimeout(() => setValue("totalAraToplam", item.araToplam), 200);
          setTimeout(() => setValue("totalIndirim", item.indirimliToplam), 200);
          setTimeout(() => setValue("totalKdvToplam", item.kdvToplam), 200);
          setTimeout(() => setValue("totalGenelToplam", item.genelToplam), 200);
          setValue("aciklama", item.aciklama);
          setValue("ozelAlan1", item.ozelAlan1);
          setValue("ozelAlan2", item.ozelAlan2);
          setValue("ozelAlan3", item.ozelAlan3);
          setValue("ozelAlan4", item.ozelAlan4);
          setValue("ozelAlan5", item.ozelAlan5);
          setValue("ozelAlan6", item.ozelAlan6);
          setValue("ozelAlan7", item.ozelAlan7);
          setValue("ozelAlan8", item.ozelAlan8);
          setValue("ozelAlan9", item.ozelAlan9);
          setValue("ozelAlan10", item.ozelAlan10);
          setValue("ozelAlan11", item.OzelAlan11);
          setValue("ozelAlan11ID", item.ozelAlanKodId11);
          setValue("ozelAlan12", item.OzelAlan12);
          setValue("ozelAlan12ID", item.ozelAlanKodId12);
          setValue("ozelAlan13", item.OzelAlan13);
          setValue("ozelAlan13ID", item.OzelAlankodId13);
          setValue("ozelAlan14", item.OzelAlan14);
          setValue("ozelAlan14ID", item.OzelAlankodId14);
          setValue("ozelAlan15", item.OzelAlan15);
          setValue("ozelAlan15ID", item.OzelAlankodId15);
          setValue("ozelAlan16", item.OzelAlan16);
          setValue("ozelAlan17", item.OzelAlan17);
          setValue("ozelAlan18", item.OzelAlan18);
          setValue("ozelAlan19", item.OzelAlan19);
          setValue("ozelAlan20", item.OzelAlan20);
          setValue(
            "fisIcerigi",
            item.materialMovements?.map((movement) => ({
              key: movement.siraNo,
              siraNo: movement.siraNo,
              malzemeId: movement.malzemeId,
              malzemeKodu: movement.malzemeKod,
              malzemeTanimi: movement.malzemeName,
              malzemeTipi: movement.malzemeTip,
              birimKodId: movement.birimKodId,
              birim: movement.birimName,
              miktar: movement.miktar,
              fiyat: movement.fiyat,
              araToplam: movement.araToplam,
              indirimOrani: movement.indirimOran,
              indirimTutari: movement.indirim,
              kdvOrani: movement.kdvOran,
              kdvDahilHaric: movement.kdvDahilHaric === "D",
              kdvTutar: movement.kdvTutar,
              toplam: movement.toplam,
              malzemePlakaId: movement.mlzAracId,
              malzemePlaka: movement.mlzAracName,
              malzemeLokasyonID: movement.lokasyonId,
              malzemeLokasyon: movement.lokasyonName,
              masrafMerkeziID: movement.masrafmerkezi,
              masrafMerkezi: movement.masrafmerkeziName,
              aciklama: movement.aciklama,
              isPriceChanged: movement.isPriceChanged || false,
              isDeleted: false,
            })) || []
          );

          setLoading(false); // Yükleme tamamlandığında
        } catch (error) {
          console.error("Veri çekilirken hata oluştu:", error);
          setLoading(false); // Hata oluştuğunda
        }
      }
    };

    handleDataFetchAndUpdate();
  }, [drawerVisible, selectedRow, setValue, onRefresh, methods.reset, AxiosInstance]);

  const formatDateWithDayjs = (dateString) => {
    const formattedDate = dayjs(dateString);
    return formattedDate.isValid() ? formattedDate.format("YYYY-MM-DD") : "";
  };

  const formatTimeWithDayjs = (timeObj) => {
    const formattedTime = dayjs(timeObj);
    return formattedTime.isValid() ? formattedTime.format("HH:mm:ss") : "";
  };

  const onSubmit = (data) => {
    // Form verilerini API'nin beklediği formata dönüştür
    const Body = {
      mlzFisId: data.mlzFisId,
      fisNo: data.fisNo,
      aracId: data.makineID || -1,
      // firma: data.firma,
      firmaId: Number(data.firmaID) || -1,
      // plaka: data.plaka,
      tarih: formatDateWithDayjs(data.tarih),
      saat: formatTimeWithDayjs(data.saat),
      // islemTipi: data.islemTipi,
      islemTipiKodId: Number(data.islemTipiID) || -1,
      projeId: Number(data.projeID) || -1,
      // girisDeposu: data.girisDeposu,
      girisDepoSiraNo: Number(data.girisDeposuID) || -1,
      // lokasyon: data.lokasyon,
      lokasyonId: Number(data.lokasyonID) || -1,
      masrafmerkezID: Number(data.masrafMerkeziID) || -1,
      siparisID: Number(data.siparisNoID) || -1,
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
          siraNo: item.key ? Number(item.key) : 0,
          tarih: formatDateWithDayjs(data.tarih),
          firmaId: Number(data.firmaID),
          girisDepoSiraNo: Number(data.girisDeposuID),
          isPriceChanged: item.isPriceChanged || false,
          isDeleted: item.isDeleted || false,
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
          // plaka: item.malzemePlaka,
          mlzAracId: Number(item.malzemePlakaId),
          // lokasyon: item.malzemeLokasyon,
          lokasyonId: Number(item.malzemeLokasyonID),
          masrafmerkezi: Number(item.masrafMerkeziID),
          aciklama: item.aciklama,
          gc: "G",
          fisTip: "MALZEME",
        })) || [],
    };

    // API'ye POST isteği gönder
    AxiosInstance.post("UpsertMalzemeFisWithItems", Body)
      .then((response) => {
        console.log("Data sent successfully:", response);
        if (response.status_code === 200 || response.status_code === 201 || response.status_code === 202) {
          message.success("Güncelleme Başarılı.");
          setOpen(false);
          onRefresh();
          methods.reset();
          onDrawerClose();
        } else if (response.status_code === 401) {
          message.error("Bu işlemi yapmaya yetkiniz bulunmamaktadır.");
        } else {
          message.error("Güncelleme Başarısız.");
        }
      })
      .catch((error) => {
        // Handle errors here, e.g.:
        console.error("Error sending data:", error);
        if (navigator.onLine) {
          // İnternet bağlantısı var
          message.error("Hata Mesajı: " + error.message);
        } else {
          // İnternet bağlantısı yok
          message.error("Internet Bağlantısı Mevcut Değil.");
        }
      });
    console.log({ Body });
  };

  const onClose = () => {
    Modal.confirm({
      title: "İptal etmek istediğinden emin misin?",
      content: "Kaydedilmemiş değişiklikler kaybolacaktır.",
      okText: "Evet",
      cancelText: "Hayır",
      onOk: () => {
        setOpen(false);
        reset();
        onDrawerClose();
      },
    });
  };

  return (
    <FormProvider {...methods}>
      <ConfigProvider locale={tr_TR}>
        <Modal
          width="1340px"
          centered
          title={t("girisFisiGuncelle")}
          open={drawerVisible}
          onCancel={onClose}
          footer={
            <Space>
              <Button onClick={onClose}>İptal</Button>
              <Button
                type="submit"
                onClick={methods.handleSubmit(onSubmit)}
                style={{
                  backgroundColor: "#2bc770",
                  borderColor: "#2bc770",
                  color: "#ffffff",
                }}
              >
                Güncelle
              </Button>
            </Space>
          }
        >
          {loading ? (
            <div style={{ overflow: "auto", height: "calc(100vh - 150px)" }}>
              <Spin
                spinning={loading}
                size="large"
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {/* İçerik yüklenirken gösterilecek alan */}
              </Spin>
            </div>
          ) : (
            <form onSubmit={methods.handleSubmit(onSubmit)}>
              <div>
                <MainTabs />
                <SecondTabs selectedRowID={selectedRow?.key} />
                {/*<Footer />*/}
              </div>
            </form>
          )}
        </Modal>
      </ConfigProvider>
    </FormProvider>
  );
}
