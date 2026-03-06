import tr_TR from "antd/es/locale/tr_TR";
import { PlusOutlined } from "@ant-design/icons";
import { Button, Space, ConfigProvider, Drawer, Modal, message } from "antd";
import React, { useEffect, useState } from "react";
import { t } from "i18next";
import MainTabs from "./components/MainTabs/MainTabs";
import SecondTabs from "./components/SecondTabs/SecondTabs.jsx";
import { useForm, FormProvider } from "react-hook-form";
import AxiosInstance from "../../../../api/http.jsx";

export default function CreateDrawer({ onRefresh }) {
  const [open, setOpen] = useState(false);

  const methods = useForm({
    defaultValues: {
      TB_DEPO_ID: 0,
      DEP_KOD: "",
      DEP_TANIM: "",
      AKTIF: true,
      LOKASYON_ID: null,
      YAKIT_TIP_ID: null,
      KAPASITE: 0,
      KRITIK_MIKTAR: 0,
      KRITIK_UYAR: true,
      TELEFON: "",
      ACIKLAMA: "",
    },
  });

  const { setValue, reset, handleSubmit } = methods;

  const getFisNo = async () => {
    try {
      const response = await AxiosInstance.get("ModulKoduGetir?modulKodu=TAN_KOD");
      if (response) {
        setValue("DEP_KOD", response);
      }
    } catch (error) {
      console.error("Error fetching DEP_KOD:", error);
      message.error("Kod numarası alınamadı!");
    }
  };

  const showDrawer = () => {
    setOpen(true);
  };

  useEffect(() => {
    if (open) {
      getFisNo();
      setValue("TB_DEPO_ID", 0);
      setValue("AKTIF", true);
      setValue("KRITIK_UYAR", true);
    }
  }, [open]);

  const onClose = () => {
    // Formda değişiklik olup olmadığını kontrol etmek istersen methods.formState.isDirty kullanabilirsin
    Modal.confirm({
      title: "İptal etmek istediğinden emin misin?",
      content: "Kaydedilmemiş değişiklikler kaybolacaktır.",
      okText: "Evet",
      cancelText: "Hayır",
      onOk: () => {
        setOpen(false);
        setTimeout(() => {
          reset(); // Varsayılan değerlere sıfırlar
        }, 300);
      },
    });
  };

  const onSubmit = (data) => {
    const Body = {
      TB_DEPO_ID: 0,
      DEP_KOD: data.DEP_KOD || "",
      DEP_TANIM: data.DEP_TANIM || "",
      AKTIF: data.AKTIF ?? true,
      LOKASYON_ID: Number(data.LOKASYON_ID) || 0,
      SORUMLU_PERSONEL_ID: Number(data.PERSONELID) || 0,
      YAKIT_TIP_ID: Number(data.yakitTipKodId) || 0,
      KAPASITE: Number(data.KAPASITE) || 0,
      KRITIK_MIKTAR: Number(data.KRITIK_MIKTAR) || 0,
      KRITIK_UYAR: data.KRITIK_UYAR ?? false,
      TELEFON: data.TELEFON || "",
      ACIKLAMA: data.ACIKLAMA || "",
    };

    AxiosInstance.post("AddUpdateYakitTank", Body)
      .then((response) => {
        if (!response.has_error && (response.status_code === 200 || response.status_code === 201)) {
          message.success(response.status || "Kayıt Başarılı.");
          setOpen(false);
          if (onRefresh) onRefresh();
          setTimeout(() => reset(), 300);
        } else if (response.has_error && response.status_code === 400) {
          message.error(response.status || "Hatalı işlem.");
        } else if (response.status_code === 401) {
          message.error("Bu işlemi yapmaya yetkiniz bulunmamaktadır.");
        } else {
          message.error("Kayıt Başarısız.");
        }
      })
      .catch((error) => {
        console.error("Error sending data:", error);
        message.error("Sunucu ile iletişim hatası oluştu.");
      });
  };

  return (
    <FormProvider {...methods}>
      <ConfigProvider locale={tr_TR}>
        <Button
          type="primary"
          onClick={showDrawer}
          style={{ display: "flex", alignItems: "center" }}
        >
          <PlusOutlined />
          {t("ekle")}
        </Button>

        <Drawer
          width="600px"
          title={t("Yakıt Tankı (Yeni Kayıt)")}
          onClose={onClose}
          open={open}
          destroyOnClose
          extra={
            <Space>
              <Button onClick={onClose}>{t("iptal")}</Button>
              <Button
                type="primary"
                onClick={handleSubmit(onSubmit)}
                style={{
                  backgroundColor: "#2bc770",
                  borderColor: "#2bc770",
                }}
              >
                {t("kaydet")}
              </Button>
            </Space>
          }
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            <MainTabs modalOpen={open} />
            <SecondTabs modalOpen={open} />
          </form>
        </Drawer>
      </ConfigProvider>
    </FormProvider>
  );
}