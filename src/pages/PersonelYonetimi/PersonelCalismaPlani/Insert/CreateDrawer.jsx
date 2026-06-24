import tr_TR from "antd/es/locale/tr_TR";
import { PlusOutlined } from "@ant-design/icons";
import { Button, Space, ConfigProvider, Modal, message } from "antd";
import React, { useEffect, useState } from "react";
import { t } from "i18next";
import MainTabs from "./components/MainTabs/MainTabs";
import { useForm, FormProvider } from "react-hook-form";
import AxiosInstance from "../../../../api/http.jsx";
// import Footer from "../Footer"; // Eğer footer'da özel bir şey yoksa gerek kalmamış olabilir.

export default function CreateModal({ onRefresh }) {
  const [open, setOpen] = useState(false);

  // Form tanımları ve varsayılan değerler (Senin JSON formatına göre)
  const methods = useForm({
    defaultValues: {
      TB_STOK_ID: 0,
      YAKIT_KOD: "",
      YAKIT_TANIM: "",
      TIP_ID: null,
      BIRIM_ID: null,
      GRUP_ID: null,
      GIRIS_FIYAT: 0,
      CIKIS_FIYAT: 0,
      AKTIF: true,
    },
  });

  const { setValue, reset, handleSubmit } = methods;

  // Yakıt kodunu (Sıradaki numarayı) getiren fonksiyon
  const getFisNo = async () => {
    try {
      const response = await AxiosInstance.get("ModulKoduGetir?modulKodu=YTK_KOD");
      if (response) {
        setValue("yakitKod", response);
      }
    } catch (error) {
      console.error("Error fetching yakitKod:", error);
      message.error("Kod numarası alınamadı!");
    }
  };

  const showModal = () => {
    setOpen(true);
  };

  useEffect(() => {
    if (open) {
      getFisNo();
      // Yeni kayıt olduğu için ID sıfırlanmalı
      setValue("TB_STOK_ID", 0);
      setValue("AKTIF", true);
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
            TB_STOK_ID: 0,
            YAKIT_KOD: "",
            YAKIT_TANIM: "",
            TIP_ID: null,
            BIRIM_ID: null,
            GRUP_ID: null,
            GIRIS_FIYAT: 0,
            CIKIS_FIYAT: 0,
            AKTIF: true,
          });
        }, 100);
      },
    });
  };

  const onSubmit = (data) => {
    // JSON formatına uygun Body hazırlığı
    const Body = {
      TB_STOK_ID: Number(data.TB_STOK_ID) || 0,
      YAKIT_KOD: data.yakitKod || "",
      YAKIT_TANIM: data.yakitTanim || "",
      TIP_ID: Number(data.yakitTipId) || 0,
      BIRIM_ID: Number(data.birimId) || 0,
      GRUP_ID: Number(data.grupId) || 0,
      GIRIS_FIYAT: Number(data.GIRIS_FIYAT) || 0,
      CIKIS_FIYAT: Number(data.CIKIS_FIYAT) || 0,
      AKTIF: data.aktif ?? true,
    };

    // Endpoint ismini senin API'daki doğru isimle güncellemelisin (Örn: UpsertYakit)
    AxiosInstance.post("AddUpdateYakit", Body)
      .then((response) => {
        if (response.status_code === 200 || response.status_code === 201) {
          message.success("Kayıt Başarılı.");
          setOpen(false);
          if (onRefresh) onRefresh();
          setTimeout(() => methods.reset(), 100);
        } else if (response.data?.statusCode === 401) {
          message.error("Bu işlemi yapmaya yetkiniz bulunmamaktadır.");
        } else {
          message.error("Kayıt Başarısız.");
        }
      })
      .catch((error) => {
        console.error("Error sending data:", error);
        message.error("Bir hata oluştu.");
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
          width="1300px"
          centered
          title={t("Yakıt Tanımı (Yeni Kayıt)")}
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
            </div>
          </form>
        </Modal>
      </ConfigProvider>
    </FormProvider>
  );
}
