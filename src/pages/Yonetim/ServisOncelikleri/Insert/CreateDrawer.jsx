import tr_TR from "antd/es/locale/tr_TR";
import { PlusOutlined } from "@ant-design/icons";
import { Button, Drawer, Space, ConfigProvider, Modal, message } from "antd";
import React, { useEffect, useState } from "react";
import MainTabs from "./components/MainTabs/MainTabs";
import { useForm, FormProvider } from "react-hook-form";
import AxiosInstance from "../../../../api/http";

export default function CreateDrawer({ onRefresh }) {
  const [open, setOpen] = useState(false);

  const methods = useForm({
    defaultValues: {
      oncelikKodu: "",
      oncelikTanimi: "",
      bayrak: "", // İkon seçimi/indexi için
      aktifDurum: false,
      varsayilan: false,
      gun: null,
      saat: null,
      dakika: null,
      gecikmeSeviyesi: null,
      kritikSeviye: null,
    },
  });

  const { reset, handleSubmit } = methods;

  const showDrawer = () => {
    setOpen(true);
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
      },
    });
  };

  const onSubmit = (data) => {
    // API'nin beklediği JSON formatı
    const Body = {
      TB_SERVIS_ONCELIK_ID: 0, // Yeni kayıt olduğu için 0
      Kod: data.oncelikKodu,
      Tanim: data.oncelikTanimi,
      IkonIndexId: data.bayrak || 0, // Eğer ID geliyorsa onu gönderiyoruz
      Varsayilan: data.varsayilan,
      Aktif: data.aktifDurum,
      CozumGun: Number(data.gun),
      CozumSaat: Number(data.saat),
      CozumDakika: Number(data.dakika),
      GecikmeDakika: Number(data.gecikmeSeviyesi),
      KritikDakika: Number(data.kritikSeviye),
      GecikmeRenk: null,
      KritikRenk: null,
    };

    AxiosInstance.post("AddUpdateServisOncelik", Body)
      .then((response) => {
        // Status code kontrolü (bazı API'ler doğrudan response döner, bazıları response.data)
        const status = response.status_code || response.status;
        
        if (status === 200 || status === 201) {
          message.success("Ekleme Başarılı.");
          setOpen(false);
          onRefresh();
          reset();
        } else {
          message.error("Ekleme Başarısız.");
        }
      })
      .catch((error) => {
        console.error("API Hatası:", error);
        message.error("Bir hata oluştu.");
      });
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <ConfigProvider locale={tr_TR}>
          <Button
            type="primary"
            onClick={showDrawer}
            style={{ display: "flex", alignItems: "center" }}
          >
            <PlusOutlined />
            Ekle
          </Button>
          
          <Drawer
            width="550px"
            title="Yeni Kayıt Ekle"
            placement="right"
            onClose={onClose}
            open={open}
            extra={
              <Space>
                <Button onClick={onClose}>İptal</Button>
                <Button
                  onClick={handleSubmit(onSubmit)}
                  style={{
                    backgroundColor: "#2bc770",
                    borderColor: "#2bc770",
                    color: "#ffffff",
                  }}
                >
                  Kaydet
                </Button>
              </Space>
            }
          >
            <MainTabs />
          </Drawer>
        </ConfigProvider>
      </form>
    </FormProvider>
  );
}