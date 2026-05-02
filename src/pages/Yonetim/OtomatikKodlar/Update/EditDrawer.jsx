import tr_TR from "antd/es/locale/tr_TR";
import { PlusOutlined } from "@ant-design/icons";
import { Button, Drawer, Space, ConfigProvider, Modal, message } from "antd";
import React, { useEffect, useState, useTransition } from "react";
import MainTabs from "./components/MainTabs/MainTabs";
import { useForm, Controller, useFormContext, FormProvider, set } from "react-hook-form";
import dayjs from "dayjs";
import AxiosInstance from "../../../../api/http";
import Footer from "../Footer";
// import SecondTabs from "./components/SecondTabs/SecondTabs";

export default function EditDrawer({ selectedRow, onDrawerClose, drawerVisible, onRefresh }) {
  // Loading state tanımı eksikti, eklendi
  const [loading, setLoading] = useState(false);

  const methods = useForm({
    defaultValues: {
      Tanim: "",
      OnEk: "",
      Numara: "",
      HaneSayisi: "",
      AlanKilit: false,
      Aktif: false,
      Aciklama: "",
    },
  });

  const { setValue, reset, handleSubmit } = methods;

  useEffect(() => {
    const fetchData = async () => {
      // Sadece drawer açıldığında ve seçili satır olduğunda çalışır
      if (drawerVisible && selectedRow) {
        setLoading(true);
        try {
          const response = await AxiosInstance.get(`GetNumaratorById?id=${selectedRow.key}`);
          const item = response.data || response; // Axios konfigürasyonunuza göre response.data gerekebilir

          // Form alanlarını doldur
          setValue("Tanim", item.Tanim);
          setValue("OnEk", item.OnEk);
          setValue("Numara", item.Numara);
          setValue("HaneSayisi", item.HaneSayisi);
          setValue("Aktif", item.Aktif);
          setValue("AlanKilit", item.AlanKilit);
          setValue("Aciklama", item.Aciklama);
        } catch (error) {
          console.error("Veri çekilirken hata oluştu:", error);
          message.error("Veriler yüklenemedi.");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [drawerVisible, selectedRow, setValue]);

  // Form gönderimi
  const onSubmit = (data) => {
    const Body = {
      // data.secilenNumaratorId yerine doğrudan selectedRow'dan gelen ID'yi kullanıyoruz
      TB_NUMARATOR_ID: selectedRow?.key, 
      Tanim: data.Tanim,
      OnEk: data.OnEk,
      Numara: data.Numara,
      HaneSayisi: data.HaneSayisi,
      Aktif: data.Aktif,
      AlanKilit: data.AlanKilit,
      Aciklama: data.Aciklama,
    };

    AxiosInstance.post("UpdateNumarator", Body)
      .then((response) => {
        // API response yapınıza göre kontrol edin (Genelde response.status veya response.data.status_code)
        if (response.status_code === 200 || response.status_code === 201 || response.status === 200) {
          message.success("Güncelleme Başarılı.");
          onDrawerClose();
          onRefresh();
          reset();
        } else {
          message.error("Güncelleme Başarısız.");
        }
      })
      .catch((error) => {
        console.error("Error sending data:", error);
        message.error("Bir hata oluştu.");
      });
  };

  const showConfirmationModal = () => {
    Modal.confirm({
      title: "İptal etmek istediğinden emin misin?",
      content: "Kaydedilmemiş değişiklikler kaybolacaktır.",
      okText: "Evet",
      cancelText: "Hayır",
      onOk: () => {
        onDrawerClose();
        reset();
      },
    });
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <ConfigProvider locale={tr_TR}>
          {/* <Button
            type="primary"
            onClick={showDrawer}
            style={{
              display: "flex",
              alignItems: "center",
            }}>
            <PlusOutlined />
            Ekle
          </Button> */}
          <Drawer
            width="550px"
            title="Kayıdı Güncelle"
            placement={"right"}
            onClose={showConfirmationModal}
            open={drawerVisible}
            extra={
              <Space>
                <Button onClick={showConfirmationModal}>İptal</Button>
                <Button
                  type="submit"
                  onClick={handleSubmit(onSubmit)}
                  style={{
                    backgroundColor: "#2bc770",
                    borderColor: "#2bc770",
                    color: "#ffffff",
                  }}>
                  Güncelle
                </Button>
              </Space>
            }>
            <MainTabs />
            {/* <SecondTabs /> */}
            <Footer />
          </Drawer>
        </ConfigProvider>
      </form>
    </FormProvider>
  );
}
