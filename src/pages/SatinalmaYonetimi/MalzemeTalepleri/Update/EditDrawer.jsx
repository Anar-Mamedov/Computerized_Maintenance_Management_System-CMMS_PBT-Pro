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
      fisNo: "",
      firmaId: -1,
      projeId: 1,
      projeName: "",
      tarih: null,
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
        setValue("projeId", item.projeId);
        setValue("projeName", item.projeName);
        setValue("tarih", item.tarih ? dayjs(item.tarih) : null);
        setValue("saat", item.saat ? dayjs(item.saat, "HH:mm:ss") : null);
        setValue("baslik", item.baslik);
        setValue("talepEdenPersonelId", item.talepEdenPersonelId);
        setValue("talepEden", item.talepEden);
        setValue("talepEdilen", item.talepEdilen);
        setValue("talepEdilenKisiId", item.talepEdilenKisiId);
        setValue("talepNedenKodId", item.talepNedenKodId);
        setValue("talepNeden", item.talepNeden);
        setValue("bolumKodId", item.bolumKodId);
        setValue("bolumName", item.bolumName);
        setValue("atolyeId", item.atolyeId);
        setValue("atolyeTanim", item.atolyeName);
        setValue("teslimYeriKodId", item.teslimYeriKodId);
        setValue("teslimYeriName", item.teslimYeriName);
        setValue("referans", item.referans);
        setValue("islemTipiKodId", item.islemTipiKodId);
        setValue("girisDepoSiraNo", item.girisDepoSiraNo);
        setValue("cikisDepoSiraNo", item.cikisDepoSiraNo);
        setValue("talepdurumId", item.talepdurumId);
        setValue("talepOncelikId", item.talepOncelikId);
        setValue("talepOncelikName", item.talepOncelikName);
        setValue("talepDurumName", item.talepDurumName);
        setValue("lokasyonId", item.lokasyonId);
        setValue("lokasyonName", item.lokasyonName);
        setValue("araToplam", item.araToplam);
        setValue("indirimliToplam", item.indirimliToplam);
        setValue("kdvToplam", item.kdvToplam);
        setValue("genelToplam", item.genelToplam);
        setValue("aciklama", item.aciklama);

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

  const formatDate = (date) => (date ? dayjs(date).format("YYYY-MM-DD") : "");
  const formatTime = (time) => (time ? dayjs(time).format("HH:mm:ss") : "");

  const onSubmit = (data) => {
  const fisId = selectedRow?.key || 0;

  const payload = {
    ...data,
    fisId, // insert/update ayrımı için
    tarih: formatDate(data.tarih),
    saat: formatTime(data.saat),
    materialMovements: data.fisIcerigi?.map((item) => ({
      ...item,
      siraNo: Number(item.siraNo) || 0,
      fisId: fisId, // her item için de aynı fisId
      malzemeId: Number(item.malzemeId) || 0,
      talepMiktar: Number(item.talepMiktar) || 0,
      gelenMiktar: Number(item.gelenMiktar) || 0,
      kalanMiktar: Number(item.kalanMiktar) || 0,
      satinalmaMiktar: Number(item.satinalmaMiktar) || 0,
      iptalMiktar: Number(item.iptalMiktar) || 0,
      stokKullanimMiktar: Number(item.stokKullanimMiktar) || 0,
      birimKodId: Number(item.birimKodId) || 0,
      makineId: Number(item.makineId) || 0,
      isDeleted: Boolean(item.isDeleted) || false,
    })),
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
              <MainTabs />
              <SecondTabs selectedRowID={selectedRow?.key} />
            </form>
          )}
        </Modal>
      </ConfigProvider>
    </FormProvider>
  );
}