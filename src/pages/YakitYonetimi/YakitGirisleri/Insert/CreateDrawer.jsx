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
      FaturaFisNo: "",
      Aciklama: "",
      // Validasyon için state'ler (Form içinde kullanılacak)
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
    // Kapasite Kontrolü (Frontend Validasyonu)
    if (data._maxKapasite > 0 && data.Miktar > data._maxKapasite) {
      message.error(`${t("Kapasite Aşımı!")} Maksimum: ${data._maxKapasite} L`);
      return;
    }

    // Sayaç Kontrolü
    if (data._sayacZorunlu && (!data.AlinanKm || data.AlinanKm <= data.SonKm)) {
      message.error(t("Hata: Yeni girilen değer, aracın eski sayacından büyük olmalıdır!"));
      return;
    }

    const Body = {
      ...data,
      Tarih: data.Tarih?.format("YYYY-MM-DDTHH:mm:ss"),
      Saat: data.Saat?.format("HH:mm:ss"),
      FaturaTarihi: data.Tarih?.format("YYYY-MM-DDTHH:mm:ss"), // Dokümana göre tarihle aynı set edildi
      MakineId: Number(data.MakineId),
      YakitTankId: data.StokKullanim ? Number(data.YakitTankId) : null,
      Miktar: Number(data.Miktar),
      Fiyat: Number(data.Fiyat),
      Tutar: Number(data.Tutar),
      AlinanKm: Number(data.AlinanKm),
      SonKm: Number(data.SonKm),
      FarkKm: Number(data.AlinanKm) - Number(data.SonKm)
    };

    AxiosInstance.post("AddAracYakit", Body)
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