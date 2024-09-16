import React, { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { Button, Drawer, Space, ConfigProvider, Modal, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import tr_TR from "antd/es/locale/tr_TR";
import AxiosInstance from "../../../../api/http";
import MainTabs from "./components/MainTabs/MainTabs";
import Footer from "../Footer";
import dayjs from "dayjs";

export default function CreateDrawer({ onRefresh }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const methods = useForm({
    defaultValues: {
      aktif: true,
      ekipmanKodu: null,
      ekipmanTanimi: null,
      tipi: null,
      tipiID: null,
      MakineMarka: null,
      MakineMarkaID: null,
      MakineModel: null,
      MakineModelID: null,
      durum: null,
      durumID: null,
      birim: null,
      birimID: null,
      revizyonTarihi: null,
      garantiBitisTarihi: null,
      depoTanim: null,
      depoID: null,
      seriNo: null,
    },
  });

  const { setValue, reset, watch } = methods;

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
      EKP_KOD: data.ekipmanKodu,
      EKP_TANIM: data.ekipmanTanimi,
      EKP_SERI_NO: data.seriNo,
      EKP_TIP_KOD_ID: Number(data.tipiID),
      EKP_BIRIM_KOD_ID: Number(data.birimID),
      EKP_MARKA_KOD_ID: Number(data.MakineMarkaID),
      EKP_DEPO_ID: Number(data.depoID),
      EKP_MODEL_KOD_ID: Number(data.MakineModelID),
      EKP_REVIZYON_TARIH: formatDateWithDayjs(data.revizyonTarihi),
      EKP_GARANTI_BITIS_TARIH: formatDateWithDayjs(data.garantiBitisTarihi),
      EKP_MAKINE_ID: Number(data.MakineModelID),
      EKP_DURUM_KOD_ID: Number(data.durumID),
      EKP_AKTIF: data.aktif,
    };

    // API'ye POST isteği gönder
    AxiosInstance.post("AddEkipman", Body)
      .then((response) => {
        console.log("Data sent successfully:", response);
        if (response.status_code === 200 || response.status_code === 201) {
          message.success("Ekleme Başarılı.");
          setOpen(false);
          onRefresh();
          methods.reset();
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
    console.log({ Body });
  };

  const showDrawer = () => setOpen(true);

  const onClose = () => {
    Modal.confirm({
      title: "İptal etmek istediğinden emin misin?",
      content: "Kaydedilmemiş değişiklikler kaybolacaktır.",
      okText: "Evet",
      cancelText: "Hayır",
      onOk: () => {
        setOpen(false);
        methods.reset();
      },
    });
  };

  useEffect(() => {
    if (open) {
      // Çekmece açıldığında gerekli işlemi yap
      // Örneğin, MainTabs'a bir prop olarak geçir
      // setLoading(true);
      AxiosInstance.get("ModulKoduGetir?modulKodu=EKP_KOD") // Replace with your actual API endpoint
        .then((response) => {
          // Assuming the response contains the new work order number in 'response.Tanim'
          setValue("ekipmanKodu", response);
          // setTimeout(() => {
          //   setLoading(false);
          // }, 100);
        })
        .catch((error) => {
          console.error("Error fetching new work order number:", error);
          if (navigator.onLine) {
            // İnternet bağlantısı var
            message.error("Hata Mesajı: " + error.message);
          } else {
            // İnternet bağlantısı yok
            message.error("Internet Bağlantısı Mevcut Değil.");
          }
        });
    }
  }, [open]);

  return (
    <FormProvider {...methods}>
      <ConfigProvider locale={tr_TR}>
        <Button type="primary" onClick={showDrawer} style={{ display: "flex", alignItems: "center" }}>
          <PlusOutlined />
          Ekle
        </Button>
        <Drawer
          width="550px"
          title="Ekipman Tanımı Ekle"
          placement="right"
          onClose={onClose}
          open={open}
          extra={
            <Space>
              <Button onClick={onClose}>İptal</Button>
              <Button type="submit" onClick={methods.handleSubmit(onSubmit)} style={{ backgroundColor: "#2bc770", borderColor: "#2bc770", color: "#ffffff" }}>
                Kaydet
              </Button>
            </Space>
          }
        >
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            <MainTabs />
            <Footer />
          </form>
        </Drawer>
      </ConfigProvider>
    </FormProvider>
  );
}
