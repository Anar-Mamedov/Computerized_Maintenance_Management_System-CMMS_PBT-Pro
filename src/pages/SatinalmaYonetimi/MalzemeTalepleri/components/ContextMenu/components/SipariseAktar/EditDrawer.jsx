import tr_TR from "antd/es/locale/tr_TR";
import { PlusOutlined } from "@ant-design/icons";
import { Button, Modal, Space, ConfigProvider, message, Spin } from "antd";
import React, { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import dayjs from "dayjs";
import AxiosInstance from "../../../../../../../api/http.jsx";
import MainTabs from "./components/MainTabs/MainTabs.jsx";
import SecondTabs from "./components/SecondTabs/SecondTabs.jsx";
import { t } from "i18next";

export default function EditModal({ selectedRow, onDrawerClose, onRefresh }) {
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);

  const methods = useForm({
  defaultValues: {
    siparisId: 0,
    teklifId: 0,
    talepID: 0,
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
    materialMovements: [], // Satır detayları burada olacak
  },
});

const { setValue, reset, watch } = methods;

  const handleModalToggle = async () => {
  if (!selectedRow) {
    message.warning("Lütfen önce bir satır seçin.");
    return;
  }

  setIsModalVisible(true);
  setLoading(true);

  try {
    const response = await AxiosInstance.get(`PrepareSatinalmaSiparisFromTalep?fisId=${selectedRow.key}`);
    const item = response.data; // JSON'daki data alanını kullan

    // Form alanlarını set et
    setValue("siparisId", item.siparisId);
    setValue("teklifId", item.teklifId);
    setValue("talepID", item.talepID);
    setValue("talepKod", item.talepKod);
    setValue("siparisKodu", item.siparisKodu);
    setValue("siparisTarihi", item.siparisTarihi ? dayjs(item.siparisTarihi) : null);
    setValue("teslimTarihi", item.teslimTarihi ? dayjs(item.teslimTarihi) : null);
    setValue("firmaId", item.firmaId);
    setValue("firmaName", item.firmaName);
    setValue("indirimToplam", item.indirimToplam);
    setValue("araToplam", item.araToplam);
    setValue("kdvToplam", item.kdvToplam);
    setValue("yuvarlamaToplami", item.yuvarlamaToplami);
    setValue("genelToplam", item.genelToplam);
    setValue("baslik", item.baslik);
    setValue("aciklama", item.aciklama);
    setValue("depoId", item.depoId);
    setValue("depoName", item.depoName);
    setValue("lokasyonID", item.lokasyonId);
    setValue("lokasyonName", item.lokasyonName);
    setValue("atolyeID", item.atolyeId);
    setValue("atolyeTanim", item.atolyeName);

    // materialMovements array'ini fisIcerigi olarak set et
    const fisIcerigi = (item.materialMovements || []).map((mat) => ({
      detayId: mat.detayId,
      siparisId: mat.siparisId,
      stokId: mat.stokId,
      stokKod: mat.stokKod,
      stokName: mat.stokName,
      miktar: mat.miktar,
      anaBirimMiktar: mat.anaBirimMiktar,
      birimFiyat: mat.birimFiyat,
      kdvOran: mat.kdvOran,
      kdvTutar: mat.kdvTutar,
      otvOran: mat.otvOran,
      otvTutar: mat.otvTutar,
      indirimOran: mat.indirimOran,
      indirimTutar: mat.indirimTutar,
      kdvDahil: Boolean(mat.kdvDahil),
      araToplam: mat.araToplam,
      toplam: mat.toplam,
      fisGridKonum: mat.fisGridKonum,
      birimKodId: mat.birimKodId,
      birimName: mat.birimName,
      talepId: mat.talepId,
      sinifId: mat.sinifId,
      sinifName: mat.sinifName,
      marka: mat.marka,
      teklifFiyatId: mat.teklifFiyatId,
      girenMiktar: mat.girenMiktar,
      kalanMiktar: mat.kalanMiktar,
      alternatifStokId: mat.alternatifStokId,
      aciklama: mat.aciklama,
      isDeleted: Boolean(mat.isDeleted),
    }));

    setValue("fisIcerigi", fisIcerigi);

    setLoading(false);
  } catch (err) {
    console.error(err);
    message.error("Veri yüklenirken bir hata oluştu.");
    setLoading(false);
  }
};

  const formatDateWithDayjs = (dateString) => {
      const formattedDate = dayjs(dateString);
      return formattedDate.isValid() ? formattedDate.format("YYYY-MM-DD") : "";
    };
  
    const formatTimeWithDayjs = (timeObj) => {
      const formattedTime = dayjs(timeObj);
      return formattedTime.isValid() ? formattedTime.format("HH:mm:ss") : "";
    };

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
      kdvDahil: item.kdvDahil || "",
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

  AxiosInstance.post(`UpsertSatinalmaSiparis?TalepID=${data.talepID}`, payload)
    .then((res) => {
      const { status_code, message: apiMessage } = res?.data || res;
      if ([200, 201, 202].includes(status_code)) {
        message.success(apiMessage || "Kayıt Başarılı.");
        onRefresh();
        reset();
        setIsModalVisible(false); // Modal'ı kapatıyoruz
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
      // drawer'ı kapat
      setIsModalVisible(false);
    },
  });
};

  return (
    <FormProvider {...methods}>
      <ConfigProvider locale={tr_TR}>
        <Button
          style={{ display: "flex", padding: "0px 0px", alignItems: "center", justifyContent: "flex-start" }}
          onClick={handleModalToggle}
          type="text"
        >
          Siparişe Aktar
        </Button>
        <Modal
          width={1300}
          centered
          title={t("Satınalma Siparişi Ekle")}
          open={isModalVisible}
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
              <SecondTabs selectedRowID={selectedRow?.key} />
            </form>
          )}
        </Modal>
      </ConfigProvider>
    </FormProvider>
  );
}