import tr_TR from "antd/es/locale/tr_TR";
import { PlusOutlined } from "@ant-design/icons";
import { Button, Space, ConfigProvider, Modal, message } from "antd";
import React, { useEffect, useState } from "react";
import MainTabs from "./components/MainTabs/MainTabs";
import { useForm, FormProvider } from "react-hook-form";
import dayjs from "dayjs";
import AxiosInstance from "../../../../api/http.jsx";
import { t } from "i18next";

export default function CreateModal({ selectedLokasyonId, onRefresh, onOpenEdit }) {
  const [open, setOpen] = useState(false);
  const [periyodikBakim, setPeriyodikBakim] = useState("");
  const showModal = () => {
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
        methods.reset();
      },
      onCancel: () => {
        // Do nothing, continue from where the user left off
      },
    });
  };

  // back-end'e gönderilecek veriler

  //* export
  const methods = useForm({
    defaultValues: {
      malzemeKod: null,
      tanim: null,
      tip: null,
      tipID: null,
      birim: null,
      birimID: null,
      grup: null,
      grupID: null,
      lokasyonTanim: null,
      lokasyonID: null,
      ureticiKodu: null,
      sinifTanim: null,
      sinifID: null,
      MakineMarka: null,
      MakineMarkaID: null,
      MakineModel: null,
      MakineModelID: null,
      atolyeTanim: null,
      atolyeID: null,
      aktif: true,
      yedekParca: false,
      sarfMalzeme: false,
      stoksuzMalzeme: false,
      kritikMalzeme: false,
      yag: false,
      filtre: false,
    },
  });

  const formatDateWithDayjs = (dateString) => {
    const formattedDate = dayjs(dateString);
    return formattedDate.isValid() ? formattedDate.format("YYYY-MM-DD") : "";
  };

  const formatTimeWithDayjs = (timeObj) => {
    const formattedTime = dayjs(timeObj);
    return formattedTime.isValid() ? formattedTime.format("HH:mm:ss") : "";
  };

  const { setValue, reset, watch } = methods;

  useEffect(() => {
    if (open) {
      // Çekmece açıldığında gerekli işlemi yap
      // Örneğin, MainTabs'a bir prop olarak geçir
      AxiosInstance.get("ModulKoduGetir?modulKodu=STK_KOD") // Replace with your actual API endpoint
        .then((response) => {
          // Assuming the response contains the new work order number in 'response.Tanim'
          setValue("malzemeKod", response);
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

  //* export
  const onSubmit = (data) => {
    const Body = {
      STK_KOD: data.malzemeKod,
      STK_TANIM: data.tanim,
      STK_TIP_KOD_ID: data.tipID,
      STK_GRUP_KOD_ID: data.grupID,
      STK_LOKASYON_ID: data.lokasyonID,
      STK_BIRIM_KOD_ID: data.birimID,
      STK_URETICI_KOD: data.ureticiKodu,
      STK_SINIF_ID: data.sinifID,
      STK_MARKA_KOD_ID: data.MakineMarkaID,
      STK_MODEL_KOD_ID: data.MakineModelID,
      STK_ATOLYE_ID: data.atolyeID,
      STK_MODUL_NO: 1,
      STK_AKTIF: data.aktif,
      STK_YEDEK_PARCA: data.yedekParca,
      STK_SARF_MALZEME: data.sarfMalzeme,
      STK_STOKSUZ_MALZEME: data.stoksuzMalzeme,
      STK_KRITIK_MALZEME: data.kritikMalzeme,
      STK_YAG: data.yag,
      STK_FILTRE: data.filtre,
      STK_GIRIS_FIYAT_SEKLI: "2",
      STK_GIRIS_FIYAT_DEGERI: 0,
      STK_CIKIS_FIYAT_DEGERI: 0,
      STK_CIKIS_FIYAT_SEKLI: "2",
      STK_KDV_DH: "H",
      STK_KDV_ORAN: 0,
      STK_OTV_ORAN: 0,
      STK_GARANTI_SURE: null,
      STK_GARANTI_SURE_BIRIM_ID: -1,
      STK_RAF_OMRU: null,
      STK_RAF_OMRU_BIRIM_ID: -1,
      STK_MASRAF_MERKEZI_ID: -1,
      STK_GELIR_ID: -1,
      STK_GIDER_ID: -1,
    };

    AxiosInstance.post("AddStok", Body)
      .then((response) => {
        // Handle successful response here, e.g.:
        console.log("Data sent successfully:", response);

        if (response.status_code === 200 || response.status_code === 201) {
          message.success("İşlem Başarılı.");
          setOpen(false);
          onRefresh?.();
          reset();
          if (response?.TB_STOK_ID && onOpenEdit) {
            onOpenEdit(response.TB_STOK_ID);
          }
        } else if (response.status_code === 401) {
          message.error("Bu işlemi yapmaya yetkiniz bulunmamaktadır.");
        } else {
          message.error("İşlem Başarısız.");
        }
      })
      .catch((error) => {
        // Handle errors here, e.g.:
        console.error("Error sending data:", error);
        message.error("Başarısız Olundu.");
      });
    console.log({ Body });
  };

  useEffect(() => {
    // Eğer selectedLokasyonId varsa ve geçerli bir değerse, formun default değerini güncelle
    if (selectedLokasyonId !== undefined && selectedLokasyonId !== null) {
      methods.reset({
        ...methods.getValues(),
        selectedLokasyonId: selectedLokasyonId,
      });
    }
  }, [selectedLokasyonId, methods]);

  const periyodikBilgisi = watch("periyodikBilgisi");

  useEffect(() => {
    if (periyodikBilgisi === true) {
      setPeriyodikBakim("[Periyodik Bakım]");
    } else {
      setPeriyodikBakim("");
    }
  }, [periyodikBilgisi]);

  return (
    <FormProvider {...methods}>
      <ConfigProvider locale={tr_TR}>
        <Button
          type="primary"
          onClick={showModal}
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <PlusOutlined />
          Ekle
        </Button>
        <Modal
          width={1200}
          centered
          title={t("malzemeEkleme")}
          destroyOnClose
          open={open}
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
                {t("kaydet")}
              </Button>
            </Space>
          }
        >
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            <div>
              <MainTabs modalOpen={open} />
            </div>
          </form>
        </Modal>
      </ConfigProvider>
    </FormProvider>
  );
}
