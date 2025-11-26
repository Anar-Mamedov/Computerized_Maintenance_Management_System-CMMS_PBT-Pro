import tr_TR from "antd/es/locale/tr_TR";
import { Button, Modal, Space, ConfigProvider, message, Spin } from "antd";
import React, { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import dayjs from "dayjs";
import AxiosInstance from "../../../../../../../../../api/http.jsx";
import MainTabs from "./components/MainTabs/MainTabs.jsx";
import SecondTabs from "./components/SecondTabs/SecondTabs.jsx";
import { t } from "i18next";

export default function EditModal({ teklifId, open, onCloseModal, fisId }) {
  const [loading, setLoading] = useState(false);
  const [siparisler, setSiparisler] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);

  const methods = useForm({
    defaultValues: {
      siparisId: 0,
      teklifId: 0,
      talepID: fisId,
      talepKod: "",
      siparisKodu: "",
      siparisTarihi: null,
      teslimTarihi: null,
      firmaId: 0,
      firmaName: "",
      indirimToplam: 0,
      araToplam: 0,
      kdvToplam: 0,
      yuvarlamaToplami: 0,
      genelToplam: 0,
      baslik: "",
      aciklama: "",
      depoId: 0,
      depoName: "",
      lokasyonId: 0,
      lokasyonName: "",
      atolyeId: 0,
      atolyeName: "",
      materialMovements: [],
    },
  });

  const { setValue, reset } = methods;

  // API'den siparişleri çek ve state'e at
  useEffect(() => {
    if (!teklifId || !open) return;

    const fetchData = async () => {
  setLoading(true);
  try {
    const response = await AxiosInstance.get(
      `PrepareSatinalmaSiparisFromTeklif?teklifId=${teklifId}`
    );

    // response.data yoksa response direkt json olabilir
    const item = response.data || response;

    const siparisListesi = item.siparisler || [];

    if (siparisListesi.length === 0) {
      message.info("Bu teklife ait sipariş bulunamadı.");
      onCloseModal();
      return;
    }

    setSiparisler(siparisListesi);
    setActiveIndex(0); // İlk siparişi göster
    loadSiparisToForm(siparisListesi[0]);
    setLoading(false);
  } catch (err) {
    console.error(err);
    message.error("Veri yüklenirken bir hata oluştu.");
    setLoading(false);
  }
};

    fetchData();
  }, [teklifId, open]);

  // Form'a sipariş verilerini yükleyen fonksiyon
  const loadSiparisToForm = (siparis) => {
    setValue("siparisId", siparis.siparisId);
    setValue("teklifId", siparis.teklifId);
    setValue("talepID", fisId);
    setValue("talepKod", siparis.talepNo);
    setValue("siparisKodu", siparis.siparisKodu);
    setValue("siparisTarihi", siparis.siparisTarihi ? dayjs(siparis.siparisTarihi) : null);
    setValue("teslimTarihi", siparis.teslimTarihi ? dayjs(siparis.teslimTarihi) : null);
    setValue("firmaID", siparis.firmaId);
    setValue("firma", siparis.firmaName);
    setValue("indirimToplam", siparis.indirimToplam);
    setValue("araToplam", siparis.araToplam);
    setValue("kdvToplam", siparis.kdvToplam);
    setValue("yuvarlamaToplami", siparis.yuvarlamaToplami);
    setValue("genelToplam", siparis.genelToplam);
    setValue("baslik", siparis.baslik);
    setValue("aciklama", siparis.aciklama);
    setValue("depoId", siparis.depoId);
    setValue("depoName", siparis.depoName);
    setValue("lokasyonID", siparis.lokasyonId);
    setValue("lokasyonName", siparis.lokasyonName);
    setValue("atolyeID", siparis.atolyeId);
    setValue("atolyeTanim", siparis.atolyeName);

    const fisIcerigi = (siparis.materialMovements || []).map((mat) => ({
      ...mat,
      kdvDahil: Boolean(mat.kdvDahil),
      isDeleted: Boolean(mat.isDeleted),
    }));
    setValue("fisIcerigi", fisIcerigi);
  };

  const formatDateWithDayjs = (dateString) => {
    const formattedDate = dayjs(dateString);
    return formattedDate.isValid() ? formattedDate.format("YYYY-MM-DD") : "";
  };

  const formatTimeWithDayjs = (timeObj) => {
    const formattedTime = dayjs(timeObj);
    return formattedTime.isValid() ? formattedTime.format("HH:mm:ss") : "";
  };

  // Kaydetme işlemi
  const onSubmit = (data) => {
  const payload = {
    siparisId: 0, // Yeni kayıt
    teklifId: Number(data.teklifId) || 0,
    siparisKodu: data.siparisKodu || "",
    siparisTarihi: formatDateWithDayjs(data.siparisTarihi),
    teslimTarihi: formatDateWithDayjs(data.teslimTarihi),
    firmaId: Number(data.firmaID) || -1,
    siparisVerenId: Number(data.talepEdenPersonelId) || -1,
    odemeSekliKodId: Number(data.odemeSekliKodId) || -1,
    referansNo: data.referansNo || "",
    teslimYeriKodId: Number(data.teslimYeriKodId) || -1,
    projeId: Number(data.projeID) || -1,
    oncelikId: Number(data.talepOncelikId) || -1,
    sevkKodId: Number(data.sevkKodId) || -1,
    sevkAdresiId: Number(data.sevkAdresiId) || -1,
    nakliyeKodu: data.nakliyeKodu || "",
    indirimToplam: Number(data.indirimToplam) || 0,
    araToplam: Number(data.araToplam) || 0,
    kdvToplam: Number(data.kdvToplam) || 0,
    yuvarlamaToplami: Number(data.yuvarlamaToplami) || 0,
    genelToplam: Number(data.genelToplam) || 0,
    baslik: data.baslik || "",
    aciklama: data.aciklama || "",
    durumId: 1,
    depoId: Number(data.depoID) || -1,
    evrakNo: data.evrakNo || "",
    lokasyonId: Number(data.lokasyonID) || -1,
    adres1: data.adres1 || "",
    adres2: data.adres2 || "",
    postaKodu: data.postaKodu || "",
    sehir: data.sehir || "",
    ulke: data.ulke || "",
    sinifId: Number(data.sinifId) || -1,
    sinifName: data.sinifName || "",
    sozlesmeId: Number(data.sozlesmeId) || -1,
    atolyeId: Number(data.atolyeID) || -1,
    masrafMerkeziId: Number(data.masrafMerkeziID) || -1,
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
    ozelAlanKodId11: Number(data.ozelAlanKodId11) || -1,
    ozelAlanKodId12: Number(data.ozelAlanKodId12) || -1,
    ozelAlanKodId13: Number(data.ozelAlanKodId13) || -1,
    ozelAlanKodId14: Number(data.ozelAlanKodId14) || -1,
    ozelAlanKodId15: Number(data.ozelAlanKodId15) || -1,
    ozelAlan16: data.ozelAlan16 || "",
    ozelAlan17: data.ozelAlan17 || "",
    ozelAlan18: data.ozelAlan18 || "",
    ozelAlan19: data.ozelAlan19 || "",
    ozelAlan20: data.ozelAlan20 || "",
    materialMovements: (data.fisIcerigi || []).map((item) => ({
      detayId: Number(item.detayId) || 0,
      siparisId: Number(data.siparisId) || 0,
      stokId: Number(item.stokId) || -1,
      miktar: Number(item.miktar) || 0,
      birimFiyat: Number(item.birimFiyat) || 0,
      kdvOran: Number(item.kdvOran) || 0,
      kdvTutar: Number(item.kdvTutar) || 0,
      otvOran: Number(item.otvOran) || 0,
      otvTutar: Number(item.otvTutar) || 0,
      indirimOran: Number(item.indirimOran) || 0,
      indirimTutar: Number(item.indirimTutar) || 0,
      kdvDahil: item.kdvDahil === true ? "D" : item.kdvDahil === false ? "H" : "",
      araToplam: Number(item.araToplam) || 0,
      toplam: Number(item.toplam) || 0,
      anaBirimMiktar: Number(item.anaBirimMiktar) || 0,
      fisGridKonum: Number(item.fisGridKonum) || 0,
      birimKodId: Number(item.birimKodId) || -1,
      talepId: Number(item.talepId) || -1,
      sinifId: Number(item.sinifId) || -1,
      teklifFiyatId: Number(item.teklifFiyatId) || -1,
      girenMiktar: Number(item.girenMiktar) || 0,
      kalanMiktar: Number(item.kalanMiktar) || 0,
      alternatifStokId: Number(item.alternatifStokId) || -1,
      aciklama: item.aciklama || "",
      isDeleted: item.isDeleted || false,
    })),
  };

  AxiosInstance.post(`UpsertSatinalmaSiparis?TalepID=${fisId}`, payload)
    .then((res) => {
      const { status_code, message: apiMessage } = res?.data || res;
      if ([200, 201, 202].includes(status_code)) {
        message.success(apiMessage || "Kayıt Başarılı.");

      if (activeIndex < siparisler.length - 1) {
      const nextIndex = activeIndex + 1;

        setActiveIndex(nextIndex);
        loadSiparisToForm(siparisler[nextIndex]); // Yeni siparişi forma yükle

        return; // Modalı kapatma!
      }

        reset();
        onCloseModal(); // Modal'ı kapatıyoruz
      } else if (status_code === 401) {
        message.error("Bu işlemi yapmaya yetkiniz bulunmamaktadır.");
      } else {
        message.error(apiMessage || "Kayıt Başarısız.");
      }
    })
    .catch((err) => {
      console.error("Error:", err);
      message.error("Hata: " + err.message);
    });
};

  const onClose = () => {
    Modal.confirm({
      title: "İptal etmek istediğinize emin misiniz?",
      content: "Kaydedilmemiş değişiklikler kaybolacaktır.",
      okText: "Evet",
      cancelText: "Hayır",
      onOk: () => {
        reset();
        onCloseModal();
      },
    });
  };

  return (
    <FormProvider {...methods}>
      <ConfigProvider locale={tr_TR}>
        <Modal
          width={1300}
          centered
          title={`${t("Satınalma Siparişi Ekle")} (${siparisler.length > 0 ? activeIndex + 1 : 0}/${siparisler.length})`}
          open={open}
          onCancel={onClose}
          footer={
            <Space>
              <Button onClick={onClose}>İptal</Button>
              <Button
                type="primary"
                onClick={methods.handleSubmit(onSubmit)}
                style={{ backgroundColor: "#2bc770", borderColor: "#2bc770", color: "#fff" }}
              >
                Kaydet
              </Button>
            </Space>
          }
        >
          {loading ? (
            <div style={{ height: "calc(100vh - 150px)", display: "flex", justifyContent: "center", alignItems: "center" }}>
              <Spin size="large" spinning={loading} />
            </div>
          ) : (
            <form onSubmit={methods.handleSubmit(onSubmit)}>
              <MainTabs />
              <SecondTabs teklifId={teklifId} />
            </form>
          )}
        </Modal>
      </ConfigProvider>
    </FormProvider>
  );
}