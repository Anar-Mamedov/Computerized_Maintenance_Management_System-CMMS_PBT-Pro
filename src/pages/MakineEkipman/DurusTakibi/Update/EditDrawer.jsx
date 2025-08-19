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
      lokasyon: undefined,
      lokasyonID: undefined,
      makine: undefined,
      makineID: undefined,
      durusNedeni: undefined,
      durusNedeniID: undefined,
      planli: undefined,
      baslamaZamani: undefined,
      baslamaSaati: undefined,
      bitisZamani: undefined,
      bitisSaati: undefined,
      durusSuresiDakika: undefined,
      durusMaliyetiSaat: undefined,
      toplamMaliyet: undefined,
      proje: undefined,
      projeID: undefined,
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
          const response = await AxiosInstance.get(`FetchIsEmriDurusList?isemriID=0&durusID=${selectedRow.TB_MAKINE_DURUS_ID}`);
          const item = Array.isArray(response) ? response[0] : response; // Veri dizisinin ilk elemanını al

          if (item) {
            // Durus ve genel alanlar
            setValue("durusNedeni", item.MKD_NEDEN ?? undefined);
            setValue("durusNedeniID", item.MKD_NEDEN_KOD_ID ?? undefined);
            setValue("planli", Boolean(item.MKD_PLANLI));

            // Tarih ve saat alanları (dayjs nesneleri)
            const baslamaDate = item.MKD_BASLAMA_TARIH ? dayjs(item.MKD_BASLAMA_TARIH) : undefined;
            const bitisDate = item.MKD_BITIS_TARIH ? dayjs(item.MKD_BITIS_TARIH) : undefined;
            const baslamaTime = item.MKD_BASLAMA_SAAT ? dayjs(item.MKD_BASLAMA_SAAT, "HH:mm:ss") : baslamaDate;
            const bitisTime = item.MKD_BITIS_SAAT ? dayjs(item.MKD_BITIS_SAAT, "HH:mm:ss") : bitisDate;

            setValue("baslamaZamani", baslamaDate);
            setValue("baslamaSaati", baslamaTime);
            setValue("bitisZamani", bitisDate);
            setValue("bitisSaati", bitisTime);

            // Süre ve maliyet alanları
            setValue("durusSuresiDakika", item.MKD_SURE ?? undefined);
            setValue("durusMaliyetiSaat", item.MKD_SAAT_MALIYET ?? undefined);
            setValue("toplamMaliyet", item.MKD_TOPLAM_MALIYET ?? undefined);

            // Proje ve açıklama
            setValue("proje", (item.MKD_PROJE && item.MKD_PROJE.PRJ_TANIM) || undefined);
            setValue("projeID", item.MKD_PROJE_ID ?? (item.MKD_PROJE && item.MKD_PROJE.TB_PROJE_ID) ?? undefined);
            setValue("aciklama", item.MKD_ACIKLAMA ?? undefined);

            // Fiş içeriği (makine listesi)
            const machine = item.MKD_MAKINE || {};
            const location = item.MKD_LOKASYON || {};

            setValue("makine", machine.MKN_TANIM || "");
            setValue("makineID", machine.TB_MAKINE_ID ?? item.MKD_MAKINE_ID ?? null);
            setValue("lokasyon1", location.LOK_TANIM || "");
            setValue("lokasyon1ID", location.TB_LOKASYON_ID ?? item.MKD_LOKASYON_ID ?? null);

            const fisRow = {
              id: Date.now() + Math.random(),
              makineId: machine.TB_MAKINE_ID ?? item.MKD_MAKINE_ID ?? null,
              makineKodu: machine.MKN_KOD || "",
              makineTanimi: machine.MKN_TANIM || "",
              makineTipi: machine.MKN_TIP || "",
              makineLokasyon: machine.MKN_LOKASYON || location.LOK_TANIM || "",
              makineLokasyonID: machine.MKN_LOKASYON_ID ?? item.MKD_LOKASYON_ID ?? location.TB_LOKASYON_ID ?? null,
            };

            if (fisRow.makineId) {
              setValue("fisIcerigi", [fisRow]);
            } else {
              setValue("fisIcerigi", []);
            }

            // iş emri kontrolü

            if (item.MKD_ISEMRI_ID > 0) {
              setValue("isEmri", true);
            } else {
              setValue("isEmri", false);
            }
          }

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
      baslamaTarih: formatDateWithDayjs(data.baslamaZamani),
      baslamaSaat: formatTimeWithDayjs(data.baslamaSaati),
      bitisTarih: formatDateWithDayjs(data.bitisZamani),
      bitisSaat: formatTimeWithDayjs(data.bitisSaati),
      sure: data.durusSuresiDakika,
      saatMaliyet: data.durusMaliyetiSaat,
      toplamMaliyet: data.toplamMaliyet,
      nedenKodId: data.durusNedeniID,
      aciklama: data.aciklama,
      planli: data.planli,
      projeId: data.projeID,
      makineId: data.makineID,
      lokasyonId: data.lokasyon1ID,
    };

    // API'ye POST isteği gönder
    AxiosInstance.post("UpdateMakineDurus", Body)
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
          message.error("Güncelleme Başarısız.");
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
          width="710px"
          centered
          title={t("makineDurusGuncelle")}
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
