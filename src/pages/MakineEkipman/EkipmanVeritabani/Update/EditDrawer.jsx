import React, { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { Button, Drawer, Space, ConfigProvider, Modal, message, Spin } from "antd";
import tr_TR from "antd/es/locale/tr_TR";
import AxiosInstance from "../../../../api/http";
import dayjs from "dayjs";
import MainTabs from "./components/MainTabs/MainTabs";
import Footer from "../Footer";

export default function EditDrawer({ selectedRow, onDrawerClose, drawerVisible, onRefresh }) {
  const [open, setOpen] = useState(drawerVisible);
  const [loading, setLoading] = useState(false);

  const methods = useForm({
    defaultValues: {
      aktif: null,
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
      // ... Tüm default değerleriniz
    },
  });

  const { setValue, reset } = methods;

  useEffect(() => {
    const fetchData = async () => {
      setOpen(drawerVisible);
      if (drawerVisible && selectedRow) {
        setLoading(true);
        try {
          const response = await AxiosInstance.get(`GetEkipmanBy?EkipmanID=${selectedRow.key}`);
          const data = response[0];
          setValue("secilenID", data.key);
          setValue("aktif", data.EKP_AKTIF);
          setValue("ekipmanKodu", data.EKP_KOD === "" || data.EKP_KOD === 0 ? null : data.EKP_KOD);
          setValue("ekipmanTanimi", data.EKP_TANIM === "" || data.EKP_TANIM === 0 ? null : data.EKP_TANIM);
          setValue("seriNo", data.EKP_SERI_NO === "" || data.EKP_SERI_NO === 0 ? null : data.EKP_SERI_NO);
          setValue("tipi", data.EKP_TIP === "" || data.EKP_TIP === 0 ? null : data.EKP_TIP);
          setValue("tipiID", data.EKP_TIP_KOD_ID === "" || data.EKP_TIP_KOD_ID === 0 ? null : data.EKP_TIP_KOD_ID);

          setValue("MakineMarka", data.EKP_MARKA === "" || data.EKP_MARKA === 0 ? null : data.EKP_MARKA);
          setValue("MakineMarkaID", data.EKP_MARKA_KOD_ID === "" || data.EKP_MARKA_KOD_ID === 0 ? null : data.EKP_MARKA_KOD_ID);
          setTimeout(() => {
            setValue("MakineModel", data.EKP_MODEL === "" || data.EKP_MODEL === 0 ? null : data.EKP_MODEL);
            setValue("MakineModelID", data.EKP_MODEL_KOD_ID === "" || data.EKP_MODEL_KOD_ID === 0 ? null : data.EKP_MODEL_KOD_ID);
          }, 200);
          setValue("durum", data.EKP_DURUM === "" || data.EKP_DURUM === 0 ? null : data.EKP_DURUM);
          setValue("durumID", data.EKP_DURUM_KOD_ID === "" || data.EKP_DURUM_KOD_ID === 0 ? null : data.EKP_DURUM_KOD_ID);
          setValue("birim", data.EKP_BIRIM === "" || data.EKP_BIRIM === 0 ? null : data.EKP_BIRIM);
          setValue("birimID", data.EKP_BIRIM_KOD_ID === "" || data.EKP_BIRIM_KOD_ID === 0 ? null : data.EKP_BIRIM_KOD_ID);
          setValue("revizyonTarihi", data.EKP_REVIZYON_TARIH ? (dayjs(data.EKP_REVIZYON_TARIH).isValid() ? dayjs(data.EKP_REVIZYON_TARIH) : null) : null);
          setValue("garantiBitisTarihi", data.EKP_GARANTI_BITIS_TARIH ? (dayjs(data.EKP_GARANTI_BITIS_TARIH).isValid() ? dayjs(data.EKP_GARANTI_BITIS_TARIH) : null) : null);
          setValue("depoTanim", data.EKP_DEPO === "" || data.EKP_DEPO === 0 ? null : data.EKP_DEPO);
          setValue("depoID", data.EKP_DEPO_ID === "" || data.EKP_DEPO_ID === 0 ? null : data.EKP_DEPO_ID);
          // Set other fields as needed
        } catch (error) {
          console.error("Error fetching data:", error);
          message.error("Veri alınamadı.");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [drawerVisible, setValue, selectedRow]);

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
      // Diğer alanlarınız...
    };

    // API'ye POST isteği gönder
    AxiosInstance.post(`UpdateEkipman?TB_EKIPMAN_ID=${selectedRow.key}`, Body)
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
        <Drawer
          width="550px"
          title="Ekipman Güncelle"
          placement="right"
          onClose={onClose}
          open={open}
          extra={
            <Space>
              <Button onClick={onClose}>İptal</Button>
              <Button type="submit" onClick={methods.handleSubmit(onSubmit)} style={{ backgroundColor: "#2bc770", borderColor: "#2bc770", color: "#ffffff" }}>
                Güncelle
              </Button>
            </Space>
          }
        >
          {loading ? (
            <Spin spinning={loading} size="large" style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }} />
          ) : (
            <form onSubmit={methods.handleSubmit(onSubmit)}>
              <MainTabs />
              <Footer />
            </form>
          )}
        </Drawer>
      </ConfigProvider>
    </FormProvider>
  );
}
