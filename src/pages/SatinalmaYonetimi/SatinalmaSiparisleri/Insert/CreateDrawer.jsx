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

export default function CreateModal({ selectedLokasyonId, onRefresh }) {
  const [open, setOpen] = useState(false);
  const [periyodikBakim, setPeriyodikBakim] = useState("");

  const getFisNo = async () => {
    try {
      const response = await AxiosInstance.get("ModulKoduGetir?modulKodu=SSP_SIPARIS_KODU");
      if (response) {
        setValue("siparisKodu", response);
      }
    } catch (error) {
      console.error("Error fetching siparisKodu:", error);
      message.error("Fiş numarası alınamadı!");
    }
  };

  const showModal = () => {
    setOpen(true);
  };

  useEffect(() => {
    if (open) {
      getFisNo();
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

  //* export
  const onSubmit = (data) => {
  const Body = {
    siparisId: Number(data.siparisId) || 0,
    teklifId: Number(data.teklifId) || 0,
    siparisKodu: data.siparisKodu || "",
    siparisTarihi: formatDateWithDayjs(data.siparisTarihi),
    teslimTarihi: formatDateWithDayjs(data.teslimTarihi),
    firmaId: Number(data.firmaID) || 0,
    siparisVerenId: Number(data.talepEdenPersonelId) || 0,
    odemeSekliKodId: Number(data.odemeSekliKodId) || 0,
    referansNo: data.referansNo || "",
    teslimYeriKodId: Number(data.teslimYeriKodId) || 0,
    projeId: Number(data.projeID) || 0,
    oncelikId: Number(data.talepOncelikId) || 0,
    sevkKodId: Number(data.sevkKodId) || 0,
    sevkAdresiId: Number(data.sevkAdresiId) || 0,
    nakliyeKodu: data.nakliyeKodu || "",
    indirimToplam: Number(data.indirimToplam) || 0,
    araToplam: Number(data.araToplam) || 0,
    kdvToplam: Number(data.kdvToplam) || 0,
    yuvarlamaToplami: Number(data.yuvarlamaToplami) || 0,
    genelToplam: Number(data.genelToplam) || 0,
    baslik: data.baslik || "",
    aciklama: data.aciklama || "",
    durumId: 1,
    depoId: Number(data.depoID) || 0,
    evrakNo: data.evrakNo || "",
    lokasyonId: Number(data.lokasyonID) || 0,
    adres1: data.adres1 || "",
    adres2: data.adres2 || "",
    postaKodu: data.postaKodu || "",
    sehir: data.sehir || "",
    ulke: data.ulke || "",
    sinifId: Number(data.sinifId) || 0,
    sinifName: data.sinifName || "",
    sozlesmeId: Number(data.sozlesmeId) || 0,
    atolyeId: Number(data.atolyeID) || 0,
    masrafMerkeziId: Number(data.masrafMerkeziID) || 0,
    duzenlemeTarih: formatDateWithDayjs(data.duzenlemeTarih),
    duzenlemeSaat: formatTimeWithDayjs(data.duzenlemeSaat),
    ozelAlan1: data.ozelAlan1 || "",
    ozelAlan2: data.ozelAlan2 || "",
    ozelAlan3: data.ozelAlan3 || "",
    ozelAlan4: data.ozelAlan4 || "",
    ozelAlan5: data.ozelAlan5 || "",
    ozelAlan6: data.ozelAlan6 || "",
    ozelAlan7: data.ozelAlan7 || "",
    ozelAlan8: data.ozelAlan8 || "",
    ozelAlan9: data.ozelAlan9 || "",
    ozelAlan10: data.ozelAlan10 || "",
    ozelAlanKodId11: Number(data.ozelAlanKodId11) || 0,
    ozelAlanKodId12: Number(data.ozelAlanKodId12) || 0,
    ozelAlanKodId13: Number(data.ozelAlanKodId13) || 0,
    ozelAlanKodId14: Number(data.ozelAlanKodId14) || 0,
    ozelAlanKodId15: Number(data.ozelAlanKodId15) || 0,
    ozelAlan16: data.ozelAlan16 || "",
    ozelAlan17: data.ozelAlan17 || "",
    ozelAlan18: data.ozelAlan18 || "",
    ozelAlan19: data.ozelAlan19 || "",
    ozelAlan20: data.ozelAlan20 || "",
    materialMovements: data.fisIcerigi?.map((item) => ({
      detayId: Number(item.detayId) || 0,
      siparisId: Number(data.siparisId) || 0,
      stokId: Number(item.stokId) || 0,
      miktar: Number(item.miktar) || 0,
      birimFiyat: Number(item.birimFiyat) || 0,
      kdvOran: Number(item.kdvOran) || 0,
      kdvTutar: Number(item.kdvTutar) || 0,
      otvOran: Number(item.otvOran) || 0,
      otvTutar: Number(item.otvTutar) || 0,
      indirimOran: Number(item.indirimOran) || 0,
      indirimTutar: Number(item.indirimTutar) || 0,
      kdvDahil: item.kdvDahil || "",
      araToplam: Number(item.araToplam) || 0,
      toplam: Number(item.toplam) || 0,
      anaBirimMiktar: Number(item.anaBirimMiktar) || 0,
      fisGridKonum: Number(item.fisGridKonum) || 0,
      birimKodId: Number(item.birimKodId) || 0,
      talepId: Number(item.talepId) || 0,
      sinifId: Number(item.sinifId) || 0,
      teklifFiyatId: Number(item.teklifFiyatId) || 0,
      girenMiktar: Number(item.girenMiktar) || 0,
      kalanMiktar: Number(item.kalanMiktar) || 0,
      alternatifStokId: Number(item.alternatifStokId) || 0,
      aciklama: item.aciklama || "",
      isDeleted: item.isDeleted || false,
    })) || [],
  };

  AxiosInstance.post("UpsertSatinalmaSiparis", Body)
    .then((response) => {
      if (response.status_code === 200 || response.status_code === 201) {
        message.success("Ekleme Başarılı.");
        setOpen(false);
        onRefresh();
        setTimeout(() => methods.reset(), 100);
      } else if (response.data.statusCode === 401) {
        message.error("Bu işlemi yapmaya yetkiniz bulunmamaktadır.");
      } else {
        message.error("Ekleme Başarısız.");
      }
    })
    .catch((error) => {
      console.error("Error sending data:", error);
      message.error("Başarısız Olundu.");
    });
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
          title={t("Satınalma Siparişi (Yeni Kayıt)")}
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
