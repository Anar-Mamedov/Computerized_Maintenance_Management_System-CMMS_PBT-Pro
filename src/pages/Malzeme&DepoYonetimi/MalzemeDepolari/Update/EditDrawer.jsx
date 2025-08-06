import tr_TR from "antd/es/locale/tr_TR";
// import "@ant-design/v5-patch-for-react-19";
import { PlusOutlined } from "@ant-design/icons";
import { Button, Drawer, Space, ConfigProvider, Modal, message, Spin } from "antd";
import React, { useEffect, useState, useTransition } from "react";
import MainTabs from "./components/MainTabs/MainTabs";
import secondTabs from "./components/SecondTabs/SecondTabs";
import { useForm, Controller, useFormContext, FormProvider } from "react-hook-form";
import dayjs from "dayjs";
import AxiosInstance from "../../../../api/http.jsx";
import Footer from "../Footer";
import SecondTabs from "./components/SecondTabs/SecondTabs";
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
      depoID: undefined,
      depoNo: undefined,
      depoTanimi: undefined,
      personel: undefined,
      personelID: undefined,
      aktif: true,
      lokasyon: undefined,
      lokasyonID: undefined,
      atolye: undefined,
      atolyeID: undefined,
      telefon: undefined,
      fax: undefined,
      email: undefined,
      adres: undefined,
      ozelAlan1: undefined,
      ozelAlan2: undefined,
      ozelAlan3: undefined,
      ozelAlan4: undefined,
      ozelAlan5: undefined,
      ozelAlan6: undefined,
      ozelAlan6ID: undefined,
      ozelAlan7: undefined,
      ozelAlan7ID: undefined,
      ozelAlan8: undefined,
      ozelAlan8ID: undefined,
      ozelAlan9: undefined,
      ozelAlan10: undefined,
      aciklama: undefined,
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
          const response = await AxiosInstance.get(`GetDepoById?id=${selectedRow.key}`);
          const item = response; // API response'unun data kısmını al

          // Form alanlarını API response'una göre set et
          setValue("depoID", item.TB_DEPO_ID);
          setValue("depoNo", item.DEP_KOD);
          setValue("depoTanimi", item.DEP_TANIM);
          setValue("personel", item.PRS_ISIM);
          setValue("personelID", item.DEP_SORUMLU_PERSONEL_ID);
          setValue("aktif", item.DEP_AKTIF);
          setValue("lokasyon", item.LOK_TANIM);
          setValue("lokasyonID", item.DEP_LOKASYON_ID);
          setValue("atolye", item.ATL_TANIM);
          setValue("atolyeID", item.DEP_ATOLYE_ID);
          setValue("telefon", item.DEP_TEL);
          setValue("fax", item.DEP_FAX);
          setValue("email", item.DEP_EMAIL);
          setValue("adres", item.DEP_ADRES);
          setValue("aciklama", item.DEP_ACIKLAMA);
          setValue("ozelAlan1", item.DEP_OZEL_ALAN_1);
          setValue("ozelAlan2", item.DEP_OZEL_ALAN_2);
          setValue("ozelAlan3", item.DEP_OZEL_ALAN_3);
          setValue("ozelAlan4", item.DEP_OZEL_ALAN_4);
          setValue("ozelAlan5", item.DEP_OZEL_ALAN_5);
          setValue("ozelAlan6", item.DEP_OZEL_ALAN_6);
          setValue("ozelAlan6ID", item.DEP_OZEL_ALAN_6_KOD_ID);
          setValue("ozelAlan7", item.DEP_OZEL_ALAN_7);
          setValue("ozelAlan7ID", item.DEP_OZEL_ALAN_7_KOD_ID);
          setValue("ozelAlan8", item.DEP_OZEL_ALAN_8);
          setValue("ozelAlan8ID", item.DEP_OZEL_ALAN_8_KOD_ID);
          setValue("ozelAlan9", item.DEP_OZEL_ALAN_9);
          setValue("ozelAlan10", item.DEP_OZEL_ALAN_10);
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
    // Form verilerini API'nin beklediği formata dönüştür
    const Body = {
      DEP_STOK_ID: Number(data.depoID),
      DEP_KOD: String(data.depoNo),
      DEP_TANIM: String(data.depoTanimi),
      DEP_AKTIF: data.aktif ? true : false,
      DEP_LOKASYON_ID: Number(data.lokasyonID),
      DEP_ATOLYE_ID: Number(data.atolyeID),
      DEP_MODUL_NO: 0,
      DEP_KAPASITE: 0,
      DEP_KRITIK_MIKTAR: 0,
      DEP_MIKTAR: 0,
      DEP_STOK_BIRIM: "string",
      DEP_ACIKLAMA: String(data.aciklama),
      DEP_SORUMLU_PERSONEL_ID: Number(data.personelID),
      DEP_OZEL_ALAN_1: String(data.ozelAlan1),
      DEP_OZEL_ALAN_2: String(data.ozelAlan2),
      DEP_OZEL_ALAN_3: String(data.ozelAlan3),
      DEP_OZEL_ALAN_4: String(data.ozelAlan4),
      DEP_OZEL_ALAN_5: String(data.ozelAlan5),
      DEP_OZEL_ALAN_6_KOD_ID: Number(data.ozelAlan6ID),
      DEP_OZEL_ALAN_7_KOD_ID: Number(data.ozelAlan7ID),
      DEP_OZEL_ALAN_8_KOD_ID: Number(data.ozelAlan8ID),
      DEP_OZEL_ALAN_9: Number(data.ozelAlan9),
      DEP_OZEL_ALAN_10: Number(data.ozelAlan10),
      PRS_ISIM: "string",
      ATL_TANIM: "string",
      LOK_TANIM: "string",
      DEP_OZEL_ALAN_6: String(data.ozelAlan6),
      DEP_OZEL_ALAN_7: String(data.ozelAlan7),
      DEP_OZEL_ALAN_8: String(data.ozelAlan8),
      DEP_FAX: String(data.fax),
      DEP_TEL: String(data.tel),
      DEP_EMAIL: String(data.email),
      DEP_ADRES: String(data.adres),
    };

    // API'ye POST isteği gönder
    AxiosInstance.post("UpdateDepo", Body)
      .then((response) => {
        console.log("Data sent successfully:", response);
        if (response.status_code === 200 || response.status_code === 201 || response.status_code === 202) {
          message.success("Güncelleme Başarılı.");
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
          width="900px"
          centered
          title={t("depoGuncelleme")}
          open={drawerVisible}
          onCancel={onClose}
          footer={
            <Space>
              <Button onClick={onClose}>İptal</Button>
              <Button
                type="submit"
                onClick={methods.handleSubmit(onSubmit)}
                style={{
                  backgroundColor: "#2bc770",
                  borderColor: "#2bc770",
                  color: "#ffffff",
                }}
              >
                Güncelle
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
                <MainTabs />
                <SecondTabs selectedRowID={selectedRow?.key} />
                {/*<Footer />*/}
              </div>
            </form>
          )}
        </Modal>
      </ConfigProvider>
    </FormProvider>
  );
}
