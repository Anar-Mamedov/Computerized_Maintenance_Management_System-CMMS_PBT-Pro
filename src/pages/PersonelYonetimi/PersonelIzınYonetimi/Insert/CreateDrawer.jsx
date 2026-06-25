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
      TB_PERSONEL_IZIN_ID: 0,
      PIZ_PERSONEL_ID: null,
      PIZ_IZIN_TANIM_ID: null,
      PIZ_BASLAMA_TARIHI: "",
      PIZ_BITIS_TARIHI: "",
      PIZ_SURE: 0,
      PIZ_ACIKLAMA: "",
      PIZ_LOKASYON_ID: null,
      PIZ_PROJE_ID: null,
      PIZ_KOD: "", 
    },
  });

  const { setValue, reset, handleSubmit } = methods;

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    Modal.confirm({
      title: "İptal etmek istediğinden emin misin?",
      content: "Kaydedilmemiş değişiklikler kaybolacaktır.",
      okText: "Evet",
      cancelText: "Hayır",
      onOk: () => {
        setOpen(false);
        setTimeout(() => {
          reset();
        }, 300);
      },
    });
  };

  const onSubmit = (data) => {
    const Body = {
      TB_PERSONEL_IZIN_ID: 0,
      PIZ_PERSONEL_ID: data.PIZ_PERSONEL_ID ? Number(data.PIZ_PERSONEL_ID) : null,
      PIZ_IZIN_TANIM_ID: Number(data.PIZ_IZIN_TANIM_ID) || null,
      PIZ_BASLAMA_TARIHI: data.PIZ_BASLAMA_TARIHI || "",
      PIZ_BITIS_TARIHI: data.PIZ_BITIS_TARIHI || "",
      PIZ_SURE: Number(data.PIZ_SURE) || 0,
      PIZ_ACIKLAMA: data.PIZ_ACIKLAMA || "",
      PIZ_LOKASYON_ID: data.PIZ_LOKASYON_ID ? Number(data.PIZ_LOKASYON_ID) : null,
      PIZ_PROJE_ID: data.PIZ_PROJE_ID ? Number(data.PIZ_PROJE_ID) : null,
    };

    AxiosInstance.post("AddUpdatePersonelIzin", Body)
      .then((response) => {
        if (response && response.has_error === false) {
          message.success(response.status || "İzin kaydı başarıyla oluşturuldu.");
          setOpen(false);
          if (onRefresh) onRefresh();
          setTimeout(() => reset(), 300);
        } else if (response && response.has_error === true) {
          message.error(response.status || "Hatalı işlem.");
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
          width="1000px"
          title={t("Personel İzin Girişi")}
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