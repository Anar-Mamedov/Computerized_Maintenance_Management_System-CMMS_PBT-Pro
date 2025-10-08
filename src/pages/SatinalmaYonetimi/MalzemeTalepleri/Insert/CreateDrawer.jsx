import tr_TR from "antd/es/locale/tr_TR";
// import "@ant-design/v5-patch-for-react-19";
import { PlusOutlined } from "@ant-design/icons";
import { Button, Space, ConfigProvider, Modal, message } from "antd";
import React, { useEffect, useState } from "react";
import { t } from "i18next";
import MainTabs from "./components/MainTabs/MainTabs";
import { useForm, FormProvider } from "react-hook-form";
import dayjs from "dayjs";
import AxiosInstance from "../../../../api/http.jsx";
import Footer from "../Footer";
import SecondTabs from "./components/SecondTabs/SecondTabs.jsx";
// import SecondTabs from "./components/secondTabs/secondTabs";

export default function CreateModal({ selectedLokasyonId, onRefresh }) {
  const [open, setOpen] = useState(false);
  const [periyodikBakim, setPeriyodikBakim] = useState("");

  const getFisNo = async () => {
    try {
      const response = await AxiosInstance.get("ModulKoduGetir?modulKodu=SFS_TALEP_FIS_NO");
      if (response) {
        setValue("fisNo", response);
      }
    } catch (error) {
      console.error("Error fetching fisNo:", error);
      message.error("Fiş numarası alınamadı!");
    }
  };

  const showModal = () => {
    setOpen(true);
  };

  useEffect(() => {
    if (open) {
      getFisNo();
      setValue("tarih", dayjs());
      setValue("saat", dayjs());

      // Reset the fisIcerigi with a timeout to avoid focus errors
      setTimeout(() => {
        setValue("fisIcerigi", []);
      }, 0);
    }
  }, [open]);

  const onClose = () => {
    Modal.confirm({
      title: "İptal etmek istediğinden emin misin?",
      content: "Kaydedilmemiş değişiklikler kaybolacaktır.",
      okText: "Evet",
      cancelText: "Hayır",
      onOk: () => {
        // First close the modal to avoid focus errors
        setOpen(false);

        // Then reset the form with a slight delay
        setTimeout(() => {
          methods.reset({
            fisNo: null,
            firma: null,
            firmaID: null,
            makineID: null,
            makine: null,
            tarih: null,
            saat: null,
            islemTipi: null,
            islemTipiID: null,
            girisDeposu: null,
            girisDeposuID: null,
            lokasyon: null,
            lokasyonID: null,
            siparisNo: null,
            siparisNoID: null,
            proje: null,
            projeID: null,
            totalAraToplam: null,
            totalIndirim: null,
            totalKdvToplam: null,
            totalGenelToplam: null,
            aciklama: null,
            ozelAlan1: null,
            ozelAlan2: null,
            ozelAlan3: null,
            ozelAlan4: null,
            ozelAlan5: null,
            ozelAlan6: null,
            ozelAlan7: null,
            ozelAlan8: null,
            ozelAlan9: null,
            ozelAlan9ID: null,
            ozelAlan10: null,
            ozelAlan10ID: null,
            ozelAlan11: null,
            ozelAlan12: null,
            fisIcerigi: [],
          });
        }, 100);
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
      fisNo: null,
      firma: null,
      firmaID: null,
      makineID: null,
      makine: null,
      tarih: null,
      saat: null,
      islemTipi: null,
      islemTipiID: null,
      girisDeposu: null,
      girisDeposuID: null,
      lokasyon: null,
      lokasyonID: null,
      siparisNo: null,
      siparisNoID: null,
      proje: null,
      projeID: null,
      totalAraToplam: null,
      totalIndirim: null,
      totalKdvToplam: null,
      totalGenelToplam: null,
      aciklama: null,
      ozelAlan1: null,
      ozelAlan2: null,
      ozelAlan3: null,
      ozelAlan4: null,
      ozelAlan5: null,
      ozelAlan6: null,
      ozelAlan7: null,
      ozelAlan8: null,
      ozelAlan9: null,
      ozelAlan9ID: null,
      ozelAlan10: null,
      ozelAlan10ID: null,
      ozelAlan11: null,
      ozelAlan12: null,
      fisIcerigi: [],
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

  //* export
  const onSubmit = (data) => {

    if (!data?.fisIcerigi || data.fisIcerigi.length === 0) {
    message.warning("Fiş içeriği boş, lütfen en az bir malzeme ekleyiniz.");
    return;
  }

  const Body = {
    fisId: Number(data.fisId) || 0,
    fisNo: data.fisNo || "",
    firmaId: Number(data.firmaID) || -1,
    projeId: Number(data.projeID) || -1,
    projeName: data.proje || "",
    tarih: formatDateWithDayjs(data.tarih),
    saat: formatTimeWithDayjs(data.saat),
    baslik: data.baslik || "",
    talepEdenPersonelId: Number(data.talepEdenPersonelId) || -1,
    talepEden: data.talepEden || "",
    talepEdilen: data.talepEdilen || "",
    talepEdilenKisiId: Number(data.talepEdilenKisiId) || -1,
    talepNedenKodId: Number(data.talepNedenKodId) || -1,
    talepNeden: data.talepNeden || "",
    bolumKodId: Number(data.bolumKodId) || -1,
    bolumName: data.bolumName || "",
    atolyeId: Number(data.atolyeID) || -1,
    atolyeName: data.atolye || "",
    teslimYeriKodId: Number(data.teslimYeriKodId) || -1,
    teslimYeriName: data.teslimYeriName || "",
    referans: data.referans || "",
    islemTipiKodId: Number(data.islemTipiID) || -1,
    girisDepoSiraNo: Number(data.girisDeposuID) || -1,
    cikisDepoSiraNo: Number(data.cikisDeposuID) || -1,
    talepdurumId: Number(data.talepdurumId) || 1,
    talepOncelikId: Number(data.talepOncelikId) || -1,
    talepOncelikName: data.talepOncelikName || "",
    talepDurumName: data.talepDurumName || "",
    lokasyonId: Number(data.lokasyonID) || -1,
    lokasyonName: data.lokasyon || "",
    araToplam: Number(data.totalAraToplam) || 0,
    indirimliToplam: Number(data.totalIndirim) || 0,
    kdvToplam: Number(data.totalKdvToplam) || 0,
    genelToplam: Number(data.totalGenelToplam) || 0,
    aciklama: data.aciklama || "",
    ozelAlan1: data.ozelAlan1 || "",
    ozelAlan2: data.ozelAlan2 || "",
    ozelAlan3: data.ozelAlan3 || "",
    ozelAlan4: data.ozelAlan4 || "",
    ozelAlan5: data.ozelAlan5 || "",
    ozelAlan6: data.ozelAlan6 || "",
    ozelAlan7: data.ozelAlan7 || "",
    ozelAlan8: data.ozelAlan8 || "",
    ozelAlan9: data.ozelAlan9 || "",
    ozelAlan10: data.ozelAlan10 || "",
    ozelAlanKodId11: Number(data.ozelAlan11ID) || -1,
    ozelAlanKodId12: Number(data.ozelAlan12ID) || -1,
    OzelAlankodId13: Number(data.ozelAlan13ID) || -1,
    OzelAlankodId14: Number(data.ozelAlan14ID) || -1,
    OzelAlankodId15: Number(data.ozelAlan15ID) || -1,
    OzelAlan11: data.ozelAlan11 || "",
    OzelAlan12: data.ozelAlan12 || "",
    OzelAlan13: data.ozelAlan13 || "",
    OzelAlan14: data.ozelAlan14 || "",
    OzelAlan15: data.ozelAlan15 || "",
    OzelAlan16: data.ozelAlan16 || "",
    OzelAlan17: data.ozelAlan17 || "",
    OzelAlan18: data.ozelAlan18 || "",
    OzelAlan19: data.ozelAlan19 || "",
    OzelAlan20: data.ozelAlan20 || "",
    gc: data.gc || "G",
    fisTip: data.fisTip || "MALZEME",
    materialMovements: data.fisIcerigi?.map((item) => ({
      siraNo: Number(item.siraNo) || 0,
      fisId: Number(data.fisId) || 0,
      malzemeKod: item.malzemeKodu || "",
      malzemeName: item.malzemeTanimi || "",
      malzemeId: Number(item.malzemeId) || -1,
      malDurumID: Number(item.malDurumID) || -1,
      malDurumName: data.talepDurumName || "",
      malKarsilamaSekli: item.malKarsilamaSekli || "",
      talepMiktar: Number(item.talepMiktar) || 0,
      gelenMiktar: Number(item.gelenMiktar) || 0,
      kalanMiktar: Number(item.kalanMiktar) || 0,
      satinalmaMiktar: Number(item.satinalmaMiktar) || 0,
      iptalMiktar: Number(item.iptalMiktar) || 0,
      stokKullanimMiktar: Number(item.stokKullanimMiktar) || 0,
      birimKodId: Number(item.birimKodId) || -1,
      birimName: item.birim || "",
      makineId: Number(item.makineId) || -1,
      makineName: item.makineName || "",
      aciklama: item.aciklama || "",
      isDeleted: false,
    })) || [],
  };

  AxiosInstance.post("UpsertMalzemeTalep", Body)
    .then((response) => {
      console.log("Data sent successfully:", response);
      if (response.status_code === 200 || response.status_code === 201) {
        message.success("Ekleme Başarılı.");
        setOpen(false);
        onRefresh();
        setTimeout(() => methods.reset(), 100);
      } else if (response.data.statusCode === 401) {
        message.error("Bu işlemi yapmaya yetkiniz bulunmamaktadır.");
      } else {
        message.error("Ekleme Başarısız.");
      }
    })
    .catch((error) => {
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
          {t("ekle")}
        </Button>
        <Modal
          width="1300px"
          centered
          title={t("Malzeme Talepleri (Yeni Kayıt)")}
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
              <SecondTabs modalOpen={open} />
              {/*<Footer />*/}
            </div>
          </form>
        </Modal>
      </ConfigProvider>
    </FormProvider>
  );
}
