import tr_TR from "antd/es/locale/tr_TR";
import { PlusOutlined } from "@ant-design/icons";
import { Button, Modal, Space, ConfigProvider, message, Spin } from "antd";
import React, { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import dayjs from "dayjs";
import AxiosInstance from "../../../../api/http.jsx";
import MainTabs from "./components/MainTabs/MainTabs";
import SecondTabs from "./components/SecondTabs/SecondTabs";
import { t } from "i18next";

export default function EditModal({ selectedRow, onDrawerClose, drawerVisible, onRefresh }) {
  const [loading, setLoading] = useState(false);

  const methods = useForm({
  defaultValues: {
    siparisId: 0,
    teklifId: 0,
    siparisKodu: "",
    siparisTarihi: null,   // tarih alanları için null bırakabilirsin
    teslimTarihi: null,
    firmaId: 0,
    siparisVerenId: 0,
    odemeSekliKodId: 0,
    referansNo: "",
    teslimYeriKodId: 0,
    projeId: 0,
    oncelikId: 0,
    sevkKodId: 0,
    sevkAdresiId: 0,
    nakliyeKodu: "",
    indirimToplam: 0,
    araToplam: 0,
    kdvToplam: 0,
    yuvarlamaToplami: 0,
    genelToplam: 0,
    baslik: "",
    aciklama: "",
    durumId: 0,
    depoId: 0,
    evrakNo: "",
    lokasyonId: 0,
    adres1: "",
    adres2: "",
    postaKodu: "",
    sehir: "",
    ulke: "",
    sinifId: 0,
    sinifName: "",
    sozlesmeId: 0,
    atolyeId: 0,
    masrafMerkeziId: 0,
    duzenlemeTarih: null,
    duzenlemeSaat: "",
    ozelAlan1: "",
    ozelAlan2: "",
    ozelAlan3: "",
    ozelAlan4: "",
    ozelAlan5: "",
    ozelAlan6: "",
    ozelAlan7: "",
    ozelAlan8: "",
    ozelAlan9: "",
    ozelAlan10: "",
    ozelAlanKodId11: 0,
    ozelAlanKodId12: 0,
    ozelAlanKodId13: 0,
    ozelAlanKodId14: 0,
    ozelAlanKodId15: 0,
    ozelAlan16: "",
    ozelAlan17: "",
    ozelAlan18: "",
    ozelAlan19: "",
    ozelAlan20: "",
    materialMovements: [], // Satır detayları burada olacak
  },
});

const { setValue, reset, watch } = methods;

const durumId = watch("durumId");

  useEffect(() => {
  const fetchData = async () => {
    if (drawerVisible && selectedRow) {
      setLoading(true);
      try {
        const response = await AxiosInstance.get(`GetSatinalmaSiparisById?siparisId=${selectedRow.key}`);

        const item = response.data;

        // Form alanlarını set et
        setValue("siparisId", item.siparisId);
        setValue("teklifId", item.teklifId);
        setValue("siparisKodu", item.siparisKodu);
        setValue("siparisTarihi", item.siparisTarihi ? dayjs(item.siparisTarihi) : null);
        setValue("teslimTarihi", item.teslimTarihi ? dayjs(item.teslimTarihi) : null);
        setValue("firmaId", item.firmaId);
        setValue("firmaName", item.firmaName);
        setValue("talepEdenPersonelId", item.siparisVerenId);
        setValue("siparisVerenName", item.siparisVerenName);
        setValue("odemeSekliNameID", item.odemeSekliKodId);
        setValue("odemeSekliName", item.odemeSekliName);
        setValue("referansNo", item.referansNo);
        setValue("teslimYeriNameID", item.teslimYeriKodId);
        setValue("teslimYeriName", item.teslimYeriName);
        setValue("projeId", item.projeId);
        setValue("projeName", item.projeName);
        setValue("oncelikNameID", item.oncelikId);
        setValue("oncelikName", item.oncelikName);
        setValue("sevkNameID", item.sevkKodId);
        setValue("sevkName", item.sevkName);
        setValue("sevkAdresiId", item.sevkAdresiId);
        setValue("nakliyeKodu", item.nakliyeKodu);
        setValue("indirimToplam", item.indirimToplam);
        setValue("araToplam", item.araToplam);
        setValue("kdvToplam", item.kdvToplam);
        setValue("yuvarlamaToplami", item.yuvarlamaToplami);
        setValue("genelToplam", item.genelToplam);
        setValue("baslik", item.baslik);
        setValue("aciklama", item.aciklama);
        setValue("durumId", item.durumId);
        setValue("durumName", item.durumName);
        setValue("depoNameID", item.depoId);
        setValue("depoName", item.depoName);
        setValue("evrakNo", item.evrakNo);
        setValue("lokasyonID", item.lokasyonId);
        setValue("lokasyonName", item.lokasyonName);
        setValue("adres1", item.adres1);
        setValue("adres2", item.adres2);
        setValue("postaKodu", item.postaKodu);
        setValue("sehir", item.sehir);
        setValue("ulke", item.ulke);
        setValue("sinifId", item.sinifId);
        setValue("sinifName", item.sinifName);
        setValue("sozlesmeId", item.sozlesmeId);
        setValue("atolyeID", item.atolyeID);
        setValue("atolyeTanim", item.atolyeName);
        setValue("masrafMerkeziID", item.masrafMerkeziId);
        setValue("masrafMerkeziName", item.masrafMerkeziName);
        setValue("parabirimiId", item.parabirimiId);
        setValue("parabirimiKur", item.parabirimiKur);
        setValue("dovizliToplam", item.dovizliToplam);
        setValue("duzenlemeTarih", item.duzenlemeTarih ? dayjs(item.duzenlemeTarih) : null);
        setValue("duzenlemeSaat", item.duzenlemeSaat ? dayjs(item.duzenlemeSaat, "HH:mm:ss") : null);
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
        setValue("ozelAlanKodId11", item.ozelAlanKodId11);
        setValue("ozelAlanKodId12", item.ozelAlanKodId12);
        setValue("ozelAlanKodId13", item.ozelAlanKodId13);
        setValue("ozelAlanKodId14", item.ozelAlanKodId14);
        setValue("ozelAlanKodId15", item.ozelAlanKodId15);
        setValue("ozelAlan16", item.ozelAlan16);
        setValue("ozelAlan17", item.ozelAlan17);
        setValue("ozelAlan18", item.ozelAlan18);
        setValue("ozelAlan19", item.ozelAlan19);
        setValue("ozelAlan20", item.ozelAlan20);

        // materialMovements array'ini fisIcerigi olarak set et
        const materialMovements =
          item.materialMovements?.map((mat) => ({
            detayId: mat.detayId,
            siparisId: mat.siparisId,
            stokId: mat.stokId,
            stokKod: mat.stokKod,
            stokName: mat.stokName,
            miktar: mat.miktar,
            birimFiyat: mat.birimFiyat,
            kdvOran: mat.kdvOran,
            kdvTutar: mat.kdvTutar,
            otvOran: mat.otvOran,
            otvTutar: mat.otvTutar,
            indirimOran: mat.indirimOran,
            indirimTutar: mat.indirimTutar,
            kdvDahil: mat.kdvDahil,
            araToplam: mat.araToplam,
            toplam: mat.toplam,
            anaBirimMiktar: mat.anaBirimMiktar,
            fisGridKonum: mat.fisGridKonum,
            birimKodId: mat.birimKodId,
            birimName: mat.birimName,
            talepId: mat.talepId,
            sinifId: mat.sinifId,
            sinifName: mat.sinifName,
            teklifFiyatId: mat.teklifFiyatId,
            girenMiktar: mat.girenMiktar,
            kalanMiktar: mat.kalanMiktar,
            alternatifStokId: mat.alternatifStokId,
            aciklama: mat.aciklama,
            isDeleted: mat.isDeleted,
          })) || [];

        setValue("fisIcerigi", materialMovements);

        setLoading(false);
      } catch (error) {
        console.error("Veri çekilirken hata oluştu:", error);
        setLoading(false);
      }
    }
  };

  fetchData();
}, [drawerVisible, selectedRow, setValue]);

  const formatDate = (date) => (date ? dayjs(date).format("YYYY-MM-DD") : "");
  const formatTime = (time) => (time ? dayjs(time).format("HH:mm:ss") : "");

  const onSubmit = (data) => {
  const siparisId = selectedRow?.key || 0;

  const currentTime = new Date();
  const currentTimeString = currentTime.toLocaleTimeString("tr-TR", { hour12: false });

  const payload = {
    siparisId,
    teklifId: Number(data.teklifId) || 0,
    siparisKodu: data.siparisKodu || "",
    siparisTarihi: data.siparisTarihi || null,
    teslimTarihi: data.teslimTarihi || null,
    firmaId: Number(data.firmaNameID) || 0,
    siparisVerenId: Number(data.talepEdenPersonelId) || 0,
    odemeSekliKodId: Number(data.odemeSekliNameID) || 0,
    referansNo: data.referansNo || "",
    teslimYeriKodId: Number(data.teslimYeriNameID) || 0,
    projeId: Number(data.projeId) || 0,
    oncelikId: Number(data.oncelikNameID) || 0,
    sevkKodId: Number(data.sevkNameID) || 0,
    sevkAdresiId: Number(data.sevkAdresiId) || 0,
    nakliyeKodu: data.nakliyeKodu || "",
    indirimToplam: Number(data.indirimToplam) || 0,
    araToplam: Number(data.araToplam) || 0,
    kdvToplam: Number(data.kdvToplam) || 0,
    yuvarlamaToplami: Number(data.yuvarlamaToplami) || 0,
    genelToplam: Number(data.genelToplam) || 0,
    baslik: data.baslik || "",
    aciklama: data.aciklama || "",
    durumId: Number(data.durumId) || 0,
    depoId: Number(data.depoNameID) || 0,
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
    duzenlemeTarih: data.duzenlemeTarih || null,
    duzenlemeSaat: currentTimeString,
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
      siparisId,
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
    })),
  };

  AxiosInstance.post("UpsertSatinalmaSiparis", payload)
    .then((res) => {
      const { status_code, message: apiMessage, siparisId: returnedsiparisId } = res?.data || res;

      if ([200, 201, 202].includes(status_code)) {
        message.success(apiMessage || "Güncelleme Başarılı.");
        onRefresh();
        reset();
        onDrawerClose();
      } else if (status_code === 401) {
        message.error("Bu işlemi yapmaya yetkiniz bulunmamaktadır.");
      } else {
        message.error(apiMessage || "Güncelleme Başarısız.");
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
        onDrawerClose();
      },
    });
  };

  return (
    <FormProvider {...methods}>
      <ConfigProvider locale={tr_TR}>
        <Modal
          width={1300}
          centered
          title={t("Satınalma Siparişi Güncelle")}
          open={drawerVisible}
          onCancel={onClose}
          footer={
            <Space>
              <Button onClick={onClose}>İptal</Button>
              <Button
                type="primary"
                onClick={methods.handleSubmit(onSubmit)}
                style={{ backgroundColor: "#2bc770", borderColor: "#2bc770", color: "#fff" }}
                disabled={durumId !== 1}
              >
                Güncelle
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
              <MainTabs disabled={durumId !== 1} />
              <SecondTabs selectedRowID={selectedRow?.key} disabled={durumId !== 1} />
            </form>
          )}
        </Modal>
      </ConfigProvider>
    </FormProvider>
  );
}