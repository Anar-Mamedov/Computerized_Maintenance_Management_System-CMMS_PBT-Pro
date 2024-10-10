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
      ekipmanKodu: null,
      secilenID: null,
      aktif: null,
      ekipmanTanimi: null,
      unvan: null,
      personelTanimi: null,
      personelID: null,
      lokasyonTanim: null,
      lokasyonID: null,
      sifre: null,
      tipi: null,
      tipiID: null,
      departman: null,
      departmanID: null,
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
          const response = await AxiosInstance.get(`GetIsTalebiKullaniciList?TB_IS_TALEBI_KULLANICI_ID=${selectedRow.key}`);
          const data = response[0];
          setValue("secilenID", data.key);
          setValue("aktif", data.ISK_AKTIF);
          setValue("ekipmanKodu", data.ISK_KOD === "" || data.ISK_KOD === 0 ? null : data.ISK_KOD);
          setValue("ekipmanTanimi", data.ISK_ISIM === "" || data.ISK_ISIM === 0 ? null : data.ISK_ISIM);
          setValue("unvan", data.ISK_UNVAN === "" || data.ISK_UNVAN === 0 ? null : data.ISK_UNVAN);
          setValue("personelTanimi", data.PERSONEL_TANIMI === "" || data.PERSONEL_TANIMI === 0 ? null : data.PERSONEL_TANIMI);
          setValue("personelID", data.ISK_PERSONEL_ID === "" || data.ISK_PERSONEL_ID === 0 ? null : data.ISK_PERSONEL_ID);
          setValue("lokasyonTanim", data.LOK_TANIM === "" || data.LOK_TANIM === 0 ? null : data.LOK_TANIM);
          setValue("lokasyonID", data.ISK_LOKASYON_ID === "" || data.ISK_LOKASYON_ID === 0 ? null : data.ISK_LOKASYON_ID);
          setValue("sifre", data.ISK_SIFRE === "" || data.ISK_SIFRE === 0 ? null : data.ISK_SIFRE);
          setValue("tipi", data.KULLANICI_TIP === "" || data.KULLANICI_TIP === 0 ? null : data.KULLANICI_TIP);
          setValue("tipiID", data.ISK_KULLANICI_TIP_KOD_ID === "" || data.ISK_KULLANICI_TIP_KOD_ID === 0 ? null : data.ISK_KULLANICI_TIP_KOD_ID);
          setValue("departman", data.DEPARTMAN === "" || data.DEPARTMAN === 0 ? null : data.DEPARTMAN);
          setValue("departmanID", data.ISK_DEPARTMAN_ID === "" || data.ISK_DEPARTMAN_ID === 0 ? null : data.ISK_DEPARTMAN_ID);
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
      TB_IS_TALEBI_KULLANICI_ID: Number(data.secilenID),
      ISK_KOD: data.ekipmanKodu,
      ISK_ISIM: data.ekipmanTanimi,
      ISK_DEPARTMAN_ID: Number(data.departmanID),
      ISK_KULLANICI_TIP_KOD_ID: Number(data.tipiID),
      ISK_UNVAN: data.unvan,
      ISK_LOKASYON_ID: Number(data.lokasyonID),
      ISK_AKTIF: data.aktif,
      ISK_SIFRE: data.sifre,
      ISK_PERSONEL_ID: Number(data.personelID),
      // Diğer alanlarınız...
    };

    // API'ye POST isteği gönder
    AxiosInstance.post(`UpdateIsTalebiKullanici`, Body)
      .then((response) => {
        console.log("Data sent successfully:", response);
        if (response.status_code === 200 || response.status_code === 201 || response.status === 201) {
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
          title="Kullanıcı Güncelle"
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
