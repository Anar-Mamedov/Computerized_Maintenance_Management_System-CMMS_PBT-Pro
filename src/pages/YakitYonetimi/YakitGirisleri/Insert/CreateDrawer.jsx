import tr_TR from "antd/es/locale/tr_TR";
import { PlusOutlined } from "@ant-design/icons";
import { Button, Space, ConfigProvider, Drawer, Modal, message } from "antd";
import React, { useState } from "react";
import { t } from "i18next";
import { useForm, FormProvider } from "react-hook-form";
import AxiosInstance from "../../../../api/http.jsx";
import SecondTabs from "./components/SecondTabs/SecondTabs.jsx";
import dayjs from "dayjs";

export default function CreateDrawer({ onRefresh }) {
  const [open, setOpen] = useState(false);

  const methods = useForm({
    defaultValues: {
      TB_YAKIT_HRK_ID: 0,
      MakineId: null,
      Tarih: dayjs(),
      Saat: dayjs(),
      SonKm: 0,
      AlinanKm: 0,
      FarkKm: 0,
      Miktar: 0,
      Fiyat: 0,
      Tutar: 0,
      StokKullanim: false,
      FullDepo: false,
      YakitTipId: null,
      YakitTankId: null,
      IstasyonKodId: null,
      LokasyonId: null,
      PersonelId: null,
      FirmaId: null,
      FaturaFisNo: "",
      Aciklama: "",
      // Validasyon ve dinamik UI için yardımcı state'ler
      _maxKapasite: 0,
      _sayacZorunlu: false,
      _sayacBirimi: "KM"
    },
  });

  const { reset, handleSubmit } = methods;

  const showDrawer = () => setOpen(true);

  const onClose = () => {
    Modal.confirm({
      title: t("İptal etmek istediğinden emin misin?"),
      content: t("Kaydedilmemiş değişiklikler kaybolacaktır."),
      okText: t("Evet"),
      cancelText: t("Hayır"),
      onOk: () => {
        setOpen(false);
        reset();
      },
    });
  };

  const onSubmit = (data) => {
    // Body'i tamamen senin JSON yapına göre kuruyoruz
    const Body = {
      TB_YAKIT_HRK_ID: Number(data.TB_YAKIT_HRK_ID) || 0,
      MakineId: Number(data.MakineId) || null,
      Tarih: data.Tarih ? dayjs(data.Tarih).format("YYYY-MM-DDT00:00:00") : null,
      Saat: data.Saat ? dayjs(data.Saat).format("HH:mm:ss") : null,
      SonKm: Number(data.SonKm) || 0,
      AlinanKm: Number(data.AlinanKm) || 0,
      FarkKm: Number(data.AlinanKm) - Number(data.SonKm),
      Miktar: Number(data.Miktar) || 0,
      Fiyat: Number(data.Fiyat) || 0,
      Tutar: Number(data.Tutar) || 0,
      KdvTutar: Number(data.KdvTutar) || 0,
      IndirimOran: Number(data.IndirimOran) || 0,
      IndirimTutar: Number(data.IndirimTutar) || 0,
      StokKullanim: data.StokKullanim,
      FullDepo: data.FullDepo,
      YakitTipId: Number(data.YakitTipId) || null,
      YakitTankId: data.StokKullanim ? (Number(data.YakitTankId) || null) : null,
      IstasyonKodId: !data.StokKullanim ? (Number(data.IstasyonKodId) || null) : null,
      LokasyonId: Number(data.LokasyonId) || null,
      ProjeId: Number(data.ProjeId) || null,
      MasrafMerkeziId: Number(data.MasrafMerkeziId) || null,
      PersonelId: Number(data.PersonelId) || null,
      FirmaId: Number(data.FirmaId) || null,
      VardiyaId: Number(data.VardiyaId) || null,
      FaturaFisNo: data.FaturaFisNo,
      FaturaTarihi: data.FaturaTarihi,
      Aciklama: data.Aciklama,
    };

    // NOT: Tank güncellemiyorsan endpoint ismini "AddUpdateAracYakit" gibi bir şeyle değiştirmen gerekebilir.
    AxiosInstance.post("AddUpdateAracYakit", Body)
      .then((response) => {
        if (!response.has_error) {
          message.success(t("Kayıt Başarılı."));
          setOpen(false);
          reset();
          if (onRefresh) onRefresh();
        } else {
          message.error(response.status || t("Kayıt Başarısız."));
        }
      })
      .catch(() => message.error(t("Sunucu hatası.")));
  };

  return (
    <FormProvider {...methods}>
      <ConfigProvider locale={tr_TR}>
        <Button type="primary" onClick={showDrawer} icon={<PlusOutlined />}>
          {t("ekle")}
        </Button>

        <Drawer
          width="1200px"
          title={t("Yeni Yakıt Girişi")}
          onClose={onClose}
          open={open}
          destroyOnClose
          extra={
            <Space>
              <Button onClick={onClose}>{t("iptal")}</Button>
              <Button type="primary" onClick={handleSubmit(onSubmit)} style={{ backgroundColor: "#2bc770" }}>
                {t("kaydet")}
              </Button>
            </Space>
          }
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            <SecondTabs />
          </form>
        </Drawer>
      </ConfigProvider>
    </FormProvider>
  );
}