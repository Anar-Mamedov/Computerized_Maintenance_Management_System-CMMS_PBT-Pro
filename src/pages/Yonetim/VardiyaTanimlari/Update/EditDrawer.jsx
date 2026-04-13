import tr_TR from "antd/es/locale/tr_TR";
import { Button, Drawer, Space, ConfigProvider, Modal, message, Spin } from "antd";
import React, { useEffect, useState } from "react";
import MainTabs from "./components/MainTabs/MainTabs";
import { useForm, FormProvider } from "react-hook-form";
import dayjs from "dayjs";
import AxiosInstance from "../../../../api/http";
import Footer from "../Footer";

export default function EditDrawer({ selectedRow, onDrawerClose, drawerVisible, onRefresh }) {
  const [loading, setLoading] = useState(false);

  const methods = useForm({
    defaultValues: {
      VardiyaTanimi: "",
      TB_VARDIYA_ID: 0,
      BaslamaSaati: dayjs("00:00", "HH:mm"),
      BitisSaati: dayjs("00:00", "HH:mm"),
      MolaSuresi: 0,
      VardiyaTipiKodId: null,
      LokasyonId: null,
      ProjeId: null,
      Varsayilan: false,
      Renk: "#ffae00",
      Aciklama: "",
    },
  });

  const { setValue, reset, handleSubmit } = methods;

  // Drawer açıldığında veriyi API'den çek
  useEffect(() => {
    const fetchData = async () => {
      if (drawerVisible && selectedRow) {
        setLoading(true);
        try {
          const response = await AxiosInstance.get(`GetVardiyaById?id=${selectedRow.key}`);
          const item = response.data || response; // API yapınıza göre düzenleyin

          // Form alanlarını doldur
          setValue("TB_VARDIYA_ID", item.TB_VARDIYA_ID || selectedRow.key);
          setValue("VardiyaTanimi", item.VardiyaTanimi);
          setValue("BaslamaSaati", item.BaslamaSaati ? dayjs(`1970-01-01T${item.BaslamaSaati}`) : null);
          setValue("BitisSaati", item.BitisSaati ? dayjs(`1970-01-01T${item.BitisSaati}`) : null);
          setValue("MolaSuresi", item.MolaSuresi);
          setValue("LokasyonId", item.LokasyonId);
          setValue("LokasyonText", item.LokasyonText);
          setValue("ProjeId", item.ProjeId);
          setValue("ProjeText", item.ProjeText);
          setValue("VardiyaTipiKodId", item.VardiyaTipiKodId);
          setValue("VardiyaTipiText", item.VardiyaTipiText);
          setValue("Varsayilan", item.Varsayilan);
          setValue("Renk", item.Renk);
          setValue("Aciklama", item.Aciklama);
        } catch (error) {
          console.error("Veri çekme hatası:", error);
          message.error("Veriler yüklenirken bir hata oluştu.");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [drawerVisible, selectedRow, setValue]);

  const onSubmit = (data) => {
    const Body = {
      TB_VARDIYA_ID: Number(data.TB_VARDIYA_ID),
      VardiyaTanimi: data.VardiyaTanimi,
      BaslamaSaati: data.BaslamaSaati ? dayjs(data.BaslamaSaati).format("HH:mm") : "00:00",
      BitisSaati: data.BitisSaati ? dayjs(data.BitisSaati).format("HH:mm") : "00:00",
      MolaSuresi: Number(data.MolaSuresi) || 0,
      LokasyonId: Number(data.LokasyonId) || null,
      ProjeId: Number(data.ProjeId) || null,
      VardiyaTipiKodId: Number(data.VardiyaTipiKodId) || null,
      Varsayilan: Boolean(data.Varsayilan),
      Renk: typeof data.Renk === "object" && data.Renk !== null 
      ? (data.Renk.toHexString ? data.Renk.toHexString() : "#ffae00") 
      : data.Renk,
      Aciklama: data.Aciklama,
    };

    AxiosInstance.post("AddUpdateVardiya", Body)
      .then((res) => {
        const response = res.data || res;
        if ([200, 201].includes(response.status_code)) {
          message.success(response.message || "Güncelleme Başarılı.");
          onRefresh();
          onDrawerClose();
          reset();
        } else {
          message.error(response.message || "İşlem başarısız.");
        }
      })
      .catch((err) => {
        console.error("Update error:", err);
        message.error("Bir hata oluştu.");
      });
  };

  const onCancel = () => {
    Modal.confirm({
      title: "İptal etmek istediğinize emin misiniz?",
      content: "Kaydedilmemiş değişiklikler kaybolacaktır.",
      okText: "Evet",
      cancelText: "Hayır",
      onOk: () => {
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
          title="Vardiya Güncelle"
          placement="right"
          onClose={onCancel}
          open={drawerVisible}
          extra={
            <Space>
              <Button onClick={onCancel}>İptal</Button>
              <Button
                type="primary"
                onClick={handleSubmit(onSubmit)}
                style={{ backgroundColor: "#2bc770", borderColor: "#2bc770", color: "#fff" }}
              >
                Güncelle
              </Button>
            </Space>
          }
        >
          {loading ? (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
              <Spin size="large" />
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)}>
              <MainTabs />
              <Footer />
            </form>
          )}
        </Drawer>
      </ConfigProvider>
    </FormProvider>
  );
}