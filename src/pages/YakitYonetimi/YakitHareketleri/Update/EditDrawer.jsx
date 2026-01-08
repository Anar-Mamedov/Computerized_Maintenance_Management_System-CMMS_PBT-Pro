import tr_TR from "antd/es/locale/tr_TR";
import { PlusOutlined } from "@ant-design/icons";
import { Button, Modal, Space, ConfigProvider, message, Spin } from "antd";
import React, { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import dayjs from "dayjs";
import AxiosInstance from "../../../../api/http.jsx";
import MainTabs from "./components/MainTabs/MainTabs.jsx";
import SecondTabs from "./components/SecondTabs/SecondTabs.jsx";
import { t } from "i18next";

export default function EditModal({ selectedRow, onDrawerClose, drawerVisible, onRefresh }) {
  const [loading, setLoading] = useState(false);

  const methods = useForm({
    defaultValues: {
      fisNo: "",
      firmaId: -1,
      projeId: 1,
      projeName: "",
      talepTarihi: null,
      saat: null,
      baslik: "",
      talepEdenPersonelId: null,
      talepEden: "",
      talepEdilen: "",
      talepEdilenKisiId: null,
      talepNedenKodId: null,
      talepNeden: "",
      bolumKodId: -1,
      bolumName: null,
      atolyeId: -1,
      atolyeName: "",
      teslimYeriKodId: null,
      teslimYeriName: null,
      referans: "",
      islemTipiKodId: -1,
      girisDepoSiraNo: -1,
      cikisDepoSiraNo: -1,
      talepdurumId: 1,
      talepOncelikId: null,
      talepOncelikName: null,
      talepDurumName: "AÇIK",
      lokasyonId: -1,
      lokasyonName: null,
      araToplam: 0,
      indirimliToplam: 0,
      kdvToplam: 0,
      genelToplam: 0,
      aciklama: "",
      fisTip: "MALZEME",
      gc: "G",
      fisIcerigi: [],
    },
  });

  const { setValue, reset, watch } = methods;

  const talepdurumId = watch("talepdurumId");

  useEffect(() => {
  const fetchData = async () => {
    if (drawerVisible && selectedRow) {
      setLoading(true);
      try {
        const response = await AxiosInstance.get(`GetMalzemeTalepById?fisId=${selectedRow.key}`);
        const item = response;

        // Form alanlarını set et
        setValue("fisNo", item.fisNo);
        setValue("firmaId", item.firmaId);
        setValue("projeID", item.projeId);
        setValue("proje", item.projeName);
        setValue("talepTarihi", item.tarih ? dayjs(item.tarih) : null);
        setValue("saat", item.saat ? dayjs(item.saat, "HH:mm:ss") : null);
        setValue("baslik", item.baslik);
        setValue("talepEdenPersonelId", item.talepEdenPersonelId);
        setValue("talepEden", item.talepEden);
        setValue("talepEdilen", item.talepEdilen);
        setValue("talepEdilenKisiId", item.talepEdilenKisiId);
        setValue("talepNedenKodId", item.talepNedenKodId);
        setValue("talepNeden", item.talepNeden);
        setValue("bolumNameID", item.bolumKodId);
        setValue("bolumName", item.bolumName);
        setValue("atolyeID", item.atolyeId);
        setValue("atolyeTanim", item.atolyeName);
        setValue("teslimYeriNameID", item.teslimYeriKodId);
        setValue("teslimYeriName", item.teslimYeriName);
        setValue("referans", item.referans);
        setValue("islemTipiKodId", item.islemTipiKodId);
        setValue("girisDepoSiraNo", item.girisDepoSiraNo);
        setValue("cikisDepoSiraNo", item.cikisDepoSiraNo);
        setValue("talepdurumId", item.talepdurumId);
        setValue("talepOncelikNameID", item.talepOncelikId);
        setValue("talepOncelikName", item.talepOncelikName);
        setValue("talepDurumName", item.talepDurumName);
        setValue("lokasyonID", item.lokasyonId);
        setValue("lokasyonName", item.lokasyonName);
        setValue("araToplam", item.araToplam);
        setValue("indirimliToplam", item.indirimliToplam);
        setValue("kdvToplam", item.kdvToplam);
        setValue("genelToplam", item.genelToplam);
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
        setValue("ozelAlanKodId11", item.ozelAlanKodId11);
        setValue("ozelAlanKodId12", item.ozelAlanKodId12);
        setValue("ozelAlanKodId13", item.OzelAlankodId13);
        setValue("ozelAlanKodId14", item.OzelAlankodId14);
        setValue("ozelAlanKodId15", item.OzelAlankodId15);
        setValue("ozelAlan11", item.OzelAlan11);
        setValue("ozelAlan12", item.OzelAlan12);
        setValue("ozelAlan13", item.OzelAlan13);
        setValue("ozelAlan14", item.OzelAlan14);
        setValue("ozelAlan15", item.OzelAlan15);
        setValue("ozelAlan16", item.OzelAlan16);
        setValue("ozelAlan17", item.OzelAlan17);
        setValue("ozelAlan18", item.OzelAlan18);
        setValue("ozelAlan19", item.OzelAlan19);
        setValue("ozelAlan20", item.OzelAlan20);

        // materialMovements array'ini fisIcerigi olarak set et
        const materialMovements = item.materialMovements?.map((mat) => ({
          siraNo: mat.siraNo,
          fisId: mat.fisId,
          malzemeKod: mat.malzemeKod,
          malzemeName: mat.malzemeName,
          malzemeId: mat.malzemeId,
          malDurumID: mat.malDurumID,
          malDurumName: item.talepDurumName,
          malKarsilamaSekli: mat.malKarsilamaSekli,
          talepMiktar: mat.talepMiktar,
          gelenMiktar: mat.gelenMiktar,
          kalanMiktar: mat.kalanMiktar,
          satinalmaMiktar: mat.satinalmaMiktar,
          iptalMiktar: mat.iptalMiktar,
          stokKullanimMiktar: mat.stokKullanimMiktar,
          birimKodId: mat.birimKodId,
          birimName: mat.birimName,
          makineId: mat.makineId,
          makineName: mat.makineName,
          aciklama: mat.aciklama,
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

  const formatDateWithDayjs = (dateString) => {
      const formattedDate = dayjs(dateString);
      return formattedDate.isValid() ? formattedDate.format("YYYY-MM-DD") : "";
    };
  
    const formatTimeWithDayjs = (timeObj) => {
      const formattedTime = dayjs(timeObj);
      return formattedTime.isValid() ? formattedTime.format("HH:mm:ss") : "";
    };

  const onSubmit = (data) => {
  const fisId = selectedRow?.key || 0;

  const payload = {
    ...data,
    fisId, // insert/update ayrımı için
    fisNo: data.fisNo || "",
    firmaId: Number(data.firmaID) || -1,
    projeId: Number(data.projeID) || -1,
    projeName: data.proje || "",
    tarih: formatDateWithDayjs(data.talepTarihi),
    saat: formatTimeWithDayjs(data.saat),
    baslik: data.baslik || "",
    talepEdenPersonelId: Number(data.talepEdenPersonelId) || -1,
    talepEden: data.talepEden || "",
    talepEdilen: data.talepEdilen || "",
    talepEdilenKisiId: Number(data.talepEdilenKisiId) || -1,
    talepNedenKodId: Number(data.talepNedenKodId) || -1,
    talepNeden: data.talepNeden || "",
    bolumKodId: Number(data.bolumNameID) || -1,
    bolumName: data.bolumName || "",
    atolyeId: Number(data.atolyeID) || -1,
    atolyeName: data.atolye || "",
    teslimYeriKodId: Number(data.teslimYeriNameID) || -1,
    teslimYeriName: data.teslimYeriName || "",
    referans: data.referans || "",
    islemTipiKodId: Number(data.islemTipiID) || -1,
    girisDepoSiraNo: Number(data.girisDeposuID) || -1,
    cikisDepoSiraNo: Number(data.cikisDeposuID) || -1,
    talepdurumId: Number(data.talepdurumId) || 1,
    talepOncelikId: Number(data.talepOncelikNameID) || -1,
    talepOncelikName: data.talepOncelikName || "",
    talepDurumName: data.talepDurumName || "",
    lokasyonId: Number(data.lokasyonID) || -1,
    lokasyonName: data.lokasyon || "",
    araToplam: Number(data.totalAraToplam) || 0,
    indirimliToplam: Number(data.totalIndirim) || 0,
    kdvToplam: Number(data.totalKdvToplam) || 0,
    genelToplam: Number(data.totalGenelToplam) || 0,
    aciklama: data.aciklama || "",
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
    ozelAlanKodId11: Number(data.ozelAlan11ID) || -1,
    ozelAlanKodId12: Number(data.ozelAlan12ID) || -1,
    OzelAlankodId13: Number(data.ozelAlan13ID) || -1,
    OzelAlankodId14: Number(data.ozelAlan14ID) || -1,
    OzelAlankodId15: Number(data.ozelAlan15ID) || -1,
    OzelAlan11: data.ozelAlan11 || "",
    OzelAlan12: data.ozelAlan12 || "",
    OzelAlan13: data.ozelAlan13 || "",
    OzelAlan14: data.ozelAlan14 || "",
    OzelAlan15: data.ozelAlan15 || "",
    OzelAlan16: data.ozelAlan16 || "",
    OzelAlan17: data.ozelAlan17 || "",
    OzelAlan18: data.ozelAlan18 || "",
    OzelAlan19: data.ozelAlan19 || "",
    OzelAlan20: data.ozelAlan20 || "",
    gc: data.gc || "G",
    fisTip: data.fisTip || "MALZEME",
    materialMovements: data.fisIcerigi?.map((item) => ({
      siraNo: Number(item.siraNo) || 0,
      fisId: Number(data.fisId) || 0,
      malzemeKod: item.malzemeKodu || "",
      malzemeName: item.malzemeTanimi || "",
      malzemeId: Number(item.malzemeId) || -1,
      malDurumID: Number(item.malDurumID) || -1,
      malDurumName: data.talepDurumName || "",
      malKarsilamaSekli: item.malKarsilamaSekli || "",
      talepMiktar: Number(item.talepMiktar) || 0,
      gelenMiktar: Number(item.gelenMiktar) || 0,
      kalanMiktar: Number(item.kalanMiktar) || 0,
      satinalmaMiktar: Number(item.satinalmaMiktar) || 0,
      iptalMiktar: Number(item.iptalMiktar) || 0,
      stokKullanimMiktar: Number(item.stokKullanimMiktar) || 0,
      birimKodId: Number(item.birimKodId) || -1,
      birimName: item.birim || "",
      makineId: Number(item.makineId) || -1,
      makineName: item.makineName || "",
      aciklama: item.aciklama || "",
      isDeleted: item.isDeleted || false,
    })) || [],
  };

  AxiosInstance.post("UpsertMalzemeTalep", payload)
    .then((res) => {
      // Eğer res.data undefined ise direkt res kullan
      const { status_code, message: apiMessage, fisId: returnedFisId } = res?.data || res;

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
          title={t("malzemeTalebiGuncelle")}
          open={drawerVisible}
          onCancel={onClose}
          footer={
            <Space>
              <Button onClick={onClose}>İptal</Button>
              <Button
                type="primary"
                onClick={methods.handleSubmit(onSubmit)}
                style={{ backgroundColor: "#2bc770", borderColor: "#2bc770", color: "#fff" }}
                disabled={talepdurumId !== 1}
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
              <MainTabs disabled={talepdurumId !== 1} />
              <SecondTabs selectedRowID={selectedRow?.key} disabled={talepdurumId !== 1} />
            </form>
          )}
        </Modal>
      </ConfigProvider>
    </FormProvider>
  );
}