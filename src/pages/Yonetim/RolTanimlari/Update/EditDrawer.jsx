import tr_TR from "antd/es/locale/tr_TR";
import { PlusOutlined } from "@ant-design/icons";
import { Button, Drawer, Space, ConfigProvider, Modal, message, Spin } from "antd";
import React, { useEffect, useState, useTransition } from "react";
import MainTabs from "./components/MainTabs/MainTabs";
import { useForm, Controller, useFormContext, FormProvider } from "react-hook-form";
import dayjs from "dayjs";
import AxiosInstance from "../../../../api/http.jsx";
import Tablar from "./components/Tablar.jsx";
import { t } from "i18next";

export default function EditModal({ selectedRow, onDrawerClose, drawerVisible, onRefresh }) {
  const [, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const showModal = () => {
    setOpen(true);
  };
  const [loading, setLoading] = useState(false);

  const methods = useForm({
    defaultValues: {
      rolSelect: null,
      mail: "",
      kullaniciKod: "",
      isim: "",
      soyisim: "",
      telefonNo: "",
      sifre: "",
      paraf: "",
      rolSelectID: null,
      color: "#ffffff",
      aktif: true,
      sistemYetkilisi: false,
      personel: null,
      personelID: null,
      siraNo: null,
    },
  });

  const { setValue, reset, watch } = methods;

  const refreshTable = watch("refreshTable");

  // API'den gelen verileri form alanlarına set etme

  useEffect(() => {
    const handleDataFetchAndUpdate = async () => {
      if (drawerVisible && selectedRow) {
        setOpen(true); // İşlemler tamamlandıktan sonra drawer'ı aç
        setLoading(true); // Yükleme başladığında
        try {
          // Form alanlarını set et
          setValue("siraNo", selectedRow.TB_KULLANICI_ID);
          setValue("kullaniciKod", selectedRow.KLL_KOD);
          /*  setValue("personelID", item.KLL_PERSONEL_ID);
          setValue("sistemYetkilisi", item.KLL_SISTEM_YETKILISI);
          setValue("personel", item.PRS_ISIM); 
          setValue("sifre", item.KLL_SIFRE);
          setValue("rolSelect", item.KLL_ROL);
          setValue("rolSelectID", item.KLL_ROL_ID);
          */
          setValue("isim", selectedRow.KLL_TANIM);
          setValue("aktif", selectedRow.KLL_AKTIF);

          // ... Diğer setValue çağrıları

          setLoading(false); // Yükleme tamamlandığında
        } catch (error) {
          console.error("Veri çekilirken hata oluştu:", error);
          setLoading(false); // Hata oluştuğunda
        }
      }
    };

    handleDataFetchAndUpdate();
  }, [drawerVisible, selectedRow, setValue, onRefresh, methods.reset, AxiosInstance]);

  const formatDateWithDayjs = (dateString) => {
    const formattedDate = dayjs(dateString);
    return formattedDate.isValid() ? formattedDate.format("YYYY-MM-DD") : "";
  };

  const formatTimeWithDayjs = (timeObj) => {
    const formattedTime = dayjs(timeObj);
    return formattedTime.isValid() ? formattedTime.format("HH:mm:ss") : "";
  };

  const onSubmit = (data) => {
    console.log(data.color);
    // Form verilerini API'nin beklediği formata dönüştür
    const Body = {
      TB_KULLANICI_ID: data.siraNo,
      // KLL_PERSONEL_ID: data.personelID,
      KLL_TANIM: data.isim,
      KLL_KOD: data.kullaniciKod,
      // KLL_SIFRE: data.sifre,
      KLL_AKTIF: data.aktif,
      /* KLL_SISTEM_YETKILISI: data.sistemYetkilisi,
      KLL_ROL_ID: data.rolSelectID, */
    };

    // API'ye POST isteği gönder
    AxiosInstance.post("UpdateRole", Body)
      .then((response) => {
        console.log("Data sent successfully:", response);
        if (response.status_code === 200 || response.status_code === 201 || response.status_code === 202) {
          const formattedDate = dayjs(response.targetDate).isValid() ? dayjs(response.targetDate).format("DD-MM-YYYY") : response.targetDate;
          if (response.targetKm !== undefined && response.targetDate !== undefined) {
            message.success(data.Plaka + " Plakalı Aracın " + " (" + data.servisTanimi + ") " + response.targetKm + " km ve " + formattedDate + " Tarihine Güncellenmiştir.");
          } else {
            message.success("Güncelleme Başarılı.");
          }
          setOpen(false);
          onRefresh();
          methods.reset();
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
        if (navigator.onLine) {
          // İnternet bağlantısı var
          message.error("Hata Mesajı: " + error.message);
        } else {
          // İnternet bağlantısı yok
          message.error("Internet Bağlantısı Mevcut Değil.");
        }
      });
    console.log({ Body });
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
          width="600px"
          centered
          title={t("rolGuncelleme")}
          open={drawerVisible}
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
                {t("guncelle")}
              </Button>
            </Space>
          }
        >
          {loading ? (
            <div style={{ overflow: "auto", height: "calc(100vh - 150px)" }}>
              <Spin
                spinning={loading}
                size="large"
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {/* İçerik yüklenirken gösterilecek alan */}
              </Spin>
            </div>
          ) : (
            <form onSubmit={methods.handleSubmit(onSubmit)}>
              <div>
                <Tablar />
              </div>
            </form>
          )}
        </Modal>
      </ConfigProvider>
    </FormProvider>
  );
}
