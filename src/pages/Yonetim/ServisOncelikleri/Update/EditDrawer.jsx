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
        const response = await AxiosInstance.get(`GetServisOncelikById?id=${selectedRow.key}`);
        
        // API yapına göre veriyi al (response.data.data)
        const item = response.data?.data || response.data || response;

        if (item) {
          // Form alanlarını API'den gelen JSON isimlerine göre doldur
          setValue("TB_SERVIS_ONCELIK_ID", item.TB_SERVIS_ONCELIK_ID);
          setValue("Kod", item.Kod);
          setValue("Tanim", item.Tanim);
          setValue("IkonIndexId", item.IkonIndexId);
          setValue("Aktif", item.Aktif);
          setValue("Varsayilan", item.Varsayilan);
          setValue("CozumGun", item.CozumGun);
          setValue("CozumSaat", item.CozumSaat);
          setValue("CozumDakika", item.CozumDakika);
          setValue("GecikmeDakika", item.GecikmeDakika);
          setValue("KritikDakika", item.KritikDakika);
        }
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
    TB_SERVIS_ONCELIK_ID: selectedRow?.key || 0,
    Kod: data.Kod,
    Tanim: data.Tanim,
    IkonIndexId: data.IkonIndexId || 0,
    Varsayilan: data.Varsayilan,
    Aktif: data.Aktif,
    CozumGun: Number(data.CozumGun) || 0,
    CozumSaat: Number(data.CozumSaat) || 0,
    CozumDakika: Number(data.CozumDakika) || 0,
    GecikmeDakika: Number(data.GecikmeDakika) || 0,
    KritikDakika: Number(data.KritikDakika) || 0,
    GecikmeRenk: null,
    KritikRenk: null
  };

  AxiosInstance.post("AddUpdateServisOncelik", Body)
    .then((response) => {
      const status = response.status_code || response.status;
      
      if (status === 200 || status === 201) {
        message.success("Güncelleme Başarılı.");
        onDrawerClose();
        onRefresh();
        reset();
      } else {
        message.error("Güncelleme Başarısız.");
      }
    })
    .catch((error) => {
      console.error("Güncelleme Hatası:", error);
      message.error("Güncelleme sırasında bir hata oluştu.");
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
