import tr_TR from "antd/es/locale/tr_TR";
import { PlusOutlined } from "@ant-design/icons";
import { Button, Space, ConfigProvider, Modal, message } from "antd";
import React, { useEffect, useState } from "react";
import { t } from "i18next";
import MainTabs from "./components/MainTabs/MainTabs";
import SecondTabs from "./components/SecondTabs/SecondTabs.jsx";
import { useForm, FormProvider } from "react-hook-form";
import AxiosInstance from "../../../../api/http.jsx";

export default function CreateModal({ onRefresh }) {
  const [open, setOpen] = useState(false);

  // Form tanımları ve varsayılan değerler (Yeni JSON formatına göre)
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

  // Yakıt kodunu getiren fonksiyon
  // Not: ModulKodu parametresini tank için uygun olanla (örn: 'TNK_KOD' veya 'DEP_KOD') değiştirebilirsin.
  const getFisNo = async () => {
    try {
      const response = await AxiosInstance.get("ModulKoduGetir?modulKodu=TAN_KOD");
      if (response) {
        setValue("DEP_KOD", response); // API'den dönen kodu DEP_KOD alanına set ediyoruz
      }
    } catch (error) {
      console.error("Error fetching DEP_KOD:", error);
      message.error("Kod numarası alınamadı!");
    }
  };

  const showModal = () => {
    setOpen(true);
  };

  useEffect(() => {
    if (open) {
      getFisNo();
      // Yeni kayıt olduğu için ID 0 olmalı
      setValue("TB_DEPO_ID", 0);
      setValue("AKTIF", true);
      setValue("KRITIK_UYAR", true); // Varsayılan true istenmiş olabilir
    }
  }, [open]);

  const onClose = () => {
    Modal.confirm({
      title: "İptal etmek istediğinden emin misin?",
      content: "Kaydedilmemiş değişiklikler kaybolacaktır.",
      okText: "Evet",
      cancelText: "Hayır",
      onOk: () => {
        setOpen(false);
        // Formu sıfırla
        setTimeout(() => {
          reset({
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
          });
        }, 100);
      },
    });
  };

  const onSubmit = (data) => {
    // JSON formatına uygun Body hazırlığı
    const Body = {
      TB_DEPO_ID: 0, // Yeni kayıt için her zaman 0
      DEP_KOD: data.DEP_KOD || "",
      DEP_TANIM: data.DEP_TANIM || "",
      AKTIF: data.AKTIF ?? true,
      LOKASYON_ID: Number(data.LOKASYON_ID) || 0,
      YAKIT_TIP_ID: Number(data.yakitTipKodId) || 0,
      KAPASITE: Number(data.KAPASITE) || 0,
      KRITIK_MIKTAR: Number(data.KRITIK_MIKTAR) || 0,
      KRITIK_UYAR: data.KRITIK_UYAR ?? false,
      TELEFON: data.TELEFON || "",
      ACIKLAMA: data.ACIKLAMA || "",
    };

    // Yeni Endpoint: AddUpdateYakitTank
    AxiosInstance.post("AddUpdateYakitTank", Body)
      .then((response) => {
        // Başarılı Durum (200 veya 201)
        if (!response.has_error && (response.status_code === 200 || response.status_code === 201)) {
          message.success(response.status || "Kayıt Başarılı.");
          setOpen(false);
          if (onRefresh) onRefresh();
          setTimeout(() => methods.reset(), 100);
        } 
        // Validasyon Hatası (Örn: Aynı Kod Var - 400)
        else if (response.has_error && response.status_code === 400) {
          message.error(response.status || "Hatalı işlem.");
        } 
        // Yetki Hatası
        else if (response.status_code === 401) {
          message.error("Bu işlemi yapmaya yetkiniz bulunmamaktadır.");
        } 
        // Genel Hata
        else {
          message.error("Kayıt Başarısız.");
        }
      })
      .catch((error) => {
        console.error("Error sending data:", error);
        message.error("Sunucu ile iletişim hatası oluştu.");
      });

    console.log({ Body });
  };

  return (
    <FormProvider {...methods}>
      <ConfigProvider locale={tr_TR}>
        <Button
          type="primary"
          onClick={showModal}
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <PlusOutlined />
          {t("ekle")}
        </Button>
        <Modal
          width="600px"
          centered
          title={t("Yakıt Tankı (Yeni Kayıt)")}
          destroyOnClose
          open={open}
          onCancel={onClose}
          footer={
            <Space>
              <Button onClick={onClose}>{t("iptal")}</Button>
              <Button
                type="submit"
                onClick={methods.handleSubmit(onSubmit)}
                style={{
                  backgroundColor: "#2bc770",
                  borderColor: "#2bc770",
                  color: "#ffffff",
                }}
              >
                {t("kaydet")}
              </Button>
            </Space>
          }
        >
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            <div>
              <MainTabs modalOpen={open} />
              <SecondTabs modalOpen={open} />
            </div>
          </form>
        </Modal>
      </ConfigProvider>
    </FormProvider>
  );
}