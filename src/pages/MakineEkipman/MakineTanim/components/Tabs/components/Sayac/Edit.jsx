import React, { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { Button, Space, ConfigProvider, Modal, Spin, message, Typography } from "antd";
import tr_TR from "antd/es/locale/tr_TR";
import AxiosInstance from "../../../../../../../api/http";
import MainTabs from "./components/MainTabs/MainTabs.jsx";
import Tabs from "./components/Tabs/Tabs.jsx";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { t } from "i18next";
import "./Edit.css";

const { Text } = Typography;

dayjs.extend(customParseFormat);

export default function Edit({ selectedRow, onDrawerClose, drawerVisible, onRefresh }) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(drawerVisible);

  const methods = useForm({
    defaultValues: {
      sayacTanim: null,
      sayacVarsayilan: null,
      sayacAktif: null,
      sayacTipi: null,
      sayacTipiID: null,
      sayacBirimi: null,
      sayacBirimiID: null,
      sayacDegeri: null,
      sanalSayac: null,
      baslangicTarihi: null,
      baslangicDegeri: null,
      artisDegeri: null,
      aciklama: null,
      yok: null,
      okunanDeger: null,
      artisDeger: null,
    },
  });

  const { reset, watch } = methods;

  const parseDateValue = (value, format) => {
    if (!value) {
      return null;
    }
    const rawValue = typeof value === "number" ? String(value) : value;
    const parsed = format ? dayjs(rawValue, format) : dayjs(rawValue);
    return parsed.isValid() ? parsed : null;
  };

  // aşağıdaki useEffect verileri form elemanlarına set etmeden önce durum güncellemesi yapıyor ondan sonra verileri set ediyor

  useEffect(() => {
    const handleDataFetchAndUpdate = async () => {
      if (drawerVisible && selectedRow) {
        setOpen(true); // İşlemler tamamlandıktan sonra drawer'ı aç
        setLoading(true); // Yükleme başladığında
        try {
          const response = await AxiosInstance.get(`GetSayac?SayacID=${selectedRow.key}`);
          const item = response?.data ?? {};

          const formValues = {
            sayacTanim: item.MES_TANIM ?? "",
            sayacVarsayilan: Boolean(item.MES_VARSAYILAN),
            sayacAktif: Boolean(item.MES_AKTIF),
            sayacTipi: item.MES_TIP_KOD_ID ?? null,
            sayacTipiID: item.MES_TIP_KOD_ID ?? null,
            sayacBirimi: item.MES_BIRIM_KOD_ID ?? null,
            sayacBirimiID: item.MES_BIRIM_KOD_ID ?? null,
            sayacDegeri: item.MES_GUNCEL_DEGER ?? null,
            sanalSayac: Boolean(item.MES_SANAL_SAYAC),
            baslangicTarihi: parseDateValue(item.MES_SANAL_SAYAC_BASLANGIC_TARIH ?? item.MES_BASLANGIC_TARIH),
            baslangicDegeri: item.MES_BASLANGIC_DEGER ?? null,
            artisDegeri: item.MES_SANAL_SAYAC_ARTIS ?? item.MES_TAHMINI_ARTIS_DEGER ?? null,
            aciklama: item.MES_ACIKLAMA ?? "",
            yok: item.MES_GUNCELLEME_SEKLI === 0,
            okunanDeger: item.MES_GUNCELLEME_SEKLI === 1,
            artisDeger: item.MES_GUNCELLEME_SEKLI === 2,
          };

          reset(formValues);
        } catch (error) {
          console.error("Veri çekilirken hata oluştu:", error);
        } finally {
          setLoading(false); // Yükleme tamamlandığında veya hata oluştuğunda
        }
      }
    };

    handleDataFetchAndUpdate();
  }, [drawerVisible, selectedRow, onRefresh, reset]);

  const formatDateWithDayjs = (dateString) => {
    const formattedDate = dayjs(dateString);
    return formattedDate.isValid() ? formattedDate.format("YYYY-MM-DD") : "";
  };

  const formatYearWithDayjs = (dateValue) => {
    const formattedDate = dayjs(dateValue);
    return formattedDate.isValid() ? formattedDate.format("YYYY") : "";
  };

  const toNumberOrNull = (value, fallback = null) => {
    if (value === null || value === undefined || value === "") {
      return fallback;
    }
    const numeric = Number(value);
    return Number.isNaN(numeric) ? fallback : numeric;
  };

  const valueOrFallback = (value, fallback = null) => (value === null || value === undefined ? fallback : value);

  const toIsoStringOrNull = (value) => {
    if (!value) {
      return null;
    }
    if (dayjs.isDayjs(value)) {
      return value.isValid() ? value.toISOString() : null;
    }
    const parsed = dayjs(value);
    return parsed.isValid() ? parsed.toISOString() : null;
  };

  const onSubmit = (data) => {
    const body = {
      TB_SAYAC_ID: toNumberOrNull(selectedRow?.TB_SAYAC_ID, 0),
      MES_TANIM: valueOrFallback(data.sayacTanim, ""),
      MES_REF_ID: toNumberOrNull(selectedRow?.MES_REF_ID ?? selectedRow?.MES_MAKINE_ID, 0),
      MES_REF_GRUP: valueOrFallback(selectedRow?.MES_REF_GRUP, "MAKINE"),
      MES_BIRIM_KOD_ID: toNumberOrNull(data.sayacBirimiID ?? selectedRow?.MES_BIRIM_KOD_ID, 0),
      MES_TIP_KOD_ID: toNumberOrNull(data.sayacTipiID ?? selectedRow?.MES_TIP_KOD_ID, 0),
      MES_ACIKLAMA: valueOrFallback(data.aciklama, ""),
      MES_TAHMINI_ARTIS_DEGER: toNumberOrNull(data.artisDegeri ?? selectedRow?.MES_TAHMINI_ARTIS_DEGER, 0),
      MES_SANAL_SAYAC_BASLANGIC_TARIH: data.sanalSayac ? toIsoStringOrNull(data.baslangicTarihi ?? selectedRow?.MES_SANAL_SAYAC_BASLANGIC_TARIH) : null,
      MES_MAKINE_ID: toNumberOrNull(selectedRow?.MES_MAKINE_ID ?? selectedRow?.MES_REF_ID, 0),
      /*  MES_OZEL_ALAN_1: valueOrFallback(selectedRow?.MES_OZEL_ALAN_1, null),
      MES_OZEL_ALAN_2: valueOrFallback(selectedRow?.MES_OZEL_ALAN_2, null),
      MES_OZEL_ALAN_3: valueOrFallback(selectedRow?.MES_OZEL_ALAN_3, null),
      MES_OZEL_ALAN_4: valueOrFallback(selectedRow?.MES_OZEL_ALAN_4, null),
      MES_OZEL_ALAN_5: valueOrFallback(selectedRow?.MES_OZEL_ALAN_5, null),
      MES_OZEL_ALAN_6: valueOrFallback(selectedRow?.MES_OZEL_ALAN_6, null),
      MES_OZEL_ALAN_7: valueOrFallback(selectedRow?.MES_OZEL_ALAN_7, null),
      MES_OZEL_ALAN_8: valueOrFallback(selectedRow?.MES_OZEL_ALAN_8, null),
      MES_OZEL_ALAN_9: valueOrFallback(selectedRow?.MES_OZEL_ALAN_9, null),
      MES_OZEL_ALAN_10: valueOrFallback(selectedRow?.MES_OZEL_ALAN_10, null), */
    };

    AxiosInstance.post("SayacUpsert", body)
      .then((response) => {
        console.log("Data sent successfully:", response);
        if (response.status_code === 200 || response.status_code === 201) {
          message.success("Ekleme Başarılı.");
          setOpen(false);
          onRefresh();
          reset();
          onDrawerClose();
        } else if (response.status_code === 401) {
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
    console.log({ body });
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
          destroyOnClose
          width={972}
          className="sayac-edit-modal"
          title={
            <div className="flex items-start flex-col">
              <Text type="secondary" className="font-light text-[12px]">
                PBT PRO / {t("sayacDuzenle")}
              </Text>
              <Text>{watch("sayacTanim")}</Text>
            </div>
          }
          onCancel={onClose}
          open={open}
          footer={
            <Space>
              <Button onClick={onClose}>İptal</Button>
              <Button type="submit" onClick={methods.handleSubmit(onSubmit)} style={{ backgroundColor: "#2bc770", borderColor: "#2bc770", color: "#ffffff" }}>
                Güncelle
              </Button>
            </Space>
          }
        >
          {loading ? (
            <Spin spinning={loading} size="large" style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "400px" }} />
          ) : (
            <form onSubmit={methods.handleSubmit(onSubmit)}>
              <MainTabs />
              <Tabs />
            </form>
          )}
        </Modal>
      </ConfigProvider>
    </FormProvider>
  );
}
