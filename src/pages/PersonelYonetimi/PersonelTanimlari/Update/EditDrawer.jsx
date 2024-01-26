import React, { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { Button, Drawer, Space, ConfigProvider, Modal } from "antd";
import tr_TR from "antd/es/locale/tr_TR";
import AxiosInstance from "../../../../api/http";
import dayjs from "dayjs";
import MainTabs from "./components/MainTabs/MainTabs";
import Footer from "./components/Footer";
import SecondTabs from "./components/SecondTabs/SecondTabs";

export default function EditDrawer({ selectedRow, onDrawerClose, drawerVisible, onRefresh }) {
  const [open, setOpen] = useState(drawerVisible);

  const methods = useForm({
    defaultValues: {
      personelKodu: "",
      secilenPersonelID: "",
      personelAktif: true,
      personelAdi: "",
      personelTipi: null,
      personelTipiID: "",
      departman: null,
      departmanID: "",
      atolyeTanim: "",
      atolyeID: "",
      lokasyonTanim: "",
      lokasyonID: "",
      unvan: "",
      gorevi: null,
      goreviID: "",
      taseronTanim: "",
      taseronID: "",
      idariAmiriTanim: "",
      idariAmiriID: "",
      masrafMerkeziTanim: "",
      masrafMerkeziID: "",
      teknisyen: "",
      operator: "",
      bakim: "",
      santiye: "",
      surucu: "",
      diger: "",
      // iletisim Bilgileri sekmesi
      adres: "",
      sehir: "",
      postaKodu: "",
      telefon1: "",
      telefon2: "",
      dahili: "",
      email: "",
      ilce: "",
      ulke: "",
      fax: "",
      gsm: "",
      // kişisel bilgiler sekmesi
      dili: null,
      diliID: "",
      uyrugu: null,
      uyruguID: "",
      cinsiyet: null,
      cinsiyetID: "",
      cinsiyetLabel: "",
      kanGrubu: "",
      sgkNo: "",
      vergiNo: "",
      egitimDurumu: "",
      mezunOkul: "",
      mezunBolum: "",
      mezuniyetTarihi: "",
      iseBaslamaTarihi: "",
      istenAyrilmaTarihi: "",
      ucretTipi: null,
      ucretTipiID: "",
      ucretTipiLabel: "",
      iscilikUcreti: "",
      fazlaMesaiUcreti: "",
      // ... Tüm default değerleriniz
    },
  });

  const { setValue, reset } = methods;

  useEffect(() => {
    setOpen(drawerVisible);
    if (drawerVisible && selectedRow) {
      setValue("secilenPersonelID", selectedRow.key);
      setValue("personelKodu", selectedRow.PRS_PERSONEL_KOD);
      setValue("personelAktif", selectedRow.PRS_AKTIF);
      setValue("personelAdi", selectedRow.PRS_ISIM);
      setValue("personelTipi", selectedRow.PRS_TIP);
      setValue("personelTipiID", selectedRow.PRS_PERSONEL_TIP_KOD_ID);
      setValue("departman", selectedRow.PRS_DEPARTMAN);
      setValue("departmanID", selectedRow.PRS_DEPARTMAN_ID);
      setValue("atolyeTanim", selectedRow.PRS_ATOLYE);
      setValue("atolyeID", selectedRow.PRS_ATOLYE_ID);
      setValue("lokasyonTanim", selectedRow.PRS_LOKASYON);
      setValue("lokasyonID", selectedRow.PRS_LOKASYON_ID);
      setValue("unvan", selectedRow.PRS_UNVAN);
      setValue("gorevi", selectedRow.PRS_GOREV);
      setValue("goreviID", selectedRow.PRS_GOREV_KOD_ID);
      setValue("taseronTanim", selectedRow.PRS_FIRMA);
      setValue("taseronID", selectedRow.PRS_FIRMA_ID);
      setValue("idariAmiriTanim", selectedRow.PRS_IDARI_PERSONEL_YAZI);
      setValue("idariAmiriID", selectedRow.PRS_IDARI_PERSONEL_ID);
      setValue("masrafMerkeziTanim", selectedRow.PRS_MASRAF_MERKEZI);
      setValue("masrafMerkeziID", selectedRow.PRS_MASRAF_MERKEZI_ID);
      setValue("teknisyen", selectedRow.PRS_TEKNISYEN);
      setValue("operator", selectedRow.PRS_OPERATOR);
      setValue("bakim", selectedRow.PRS_BAKIM);
      setValue("santiye", selectedRow.PRS_SANTIYE);
      setValue("surucu", selectedRow.PRS_SURUCU);
      setValue("diger", selectedRow.PRS_DIGER);
      // iletisim Bilgileri sekmesi
      setValue("adres", selectedRow.PRS_ADRES);
      setValue("sehir", selectedRow.PRS_IL);
      setValue("postaKodu", selectedRow.PRS_POSTA_KOD);
      setValue("telefon1", selectedRow.PRS_TELEFON);
      setValue("telefon2", selectedRow.PRS_TELEFON1);
      setValue("dahili", selectedRow.PRS_DAHILI);
      setValue("email", selectedRow.PRS_EMAIL);
      setValue("ilce", selectedRow.PRS_ILCE);
      setValue("ulke", selectedRow.PRS_ULKE);
      setValue("fax", selectedRow.PRS_FAX);
      setValue("gsm", selectedRow.PRS_GSM);
      // kişisel bilgiler sekmesi
      setValue("dili", selectedRow.PRS_DIL);
      setValue("diliID", selectedRow.PRS_DIL_KOD_ID);
      setValue("uyrugu", selectedRow.PRS_UYRUK);
      setValue("uyruguID", selectedRow.PRS_UYRUK_KOD_ID);
      setValue("cinsiyetID", selectedRow.PRS_CINSIYET);
      setValue("kanGrubu", selectedRow.PRS_KAN_GRUP);
      setValue("sgkNo", selectedRow.PRS_SSK_NO);
      setValue("vergiNo", selectedRow.PRS_VERGI_NO);
      setValue("egitimDurumu", selectedRow.PRS_EGITIM_DURUMU);
      setValue("mezunOkul", selectedRow.PRS_MEZUN_OLDUGU_OKUL);
      setValue("mezunBolum", selectedRow.PRS_MEZUN_OLDUGU_BOLUM);
      setValue("mezuniyetTarihi", dayjs(selectedRow.PRS_MEZUNIYET_TARIH));
      setValue("iseBaslamaTarihi", dayjs(selectedRow.PRS_ISE_BASLAMA));
      setValue("istenAyrilmaTarihi", dayjs(selectedRow.PRS_AYRILMATARIH));
      setValue("ucretTipiID", selectedRow.PRS_UCRET_TIPI);
      setValue("iscilikUcreti", selectedRow.PRS_BIRIM_UCRET);
      setValue("fazlaMesaiUcreti", selectedRow.PRS_FAZLA_MESAI);
    }
  }, [selectedRow, setValue, drawerVisible]);

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
      TB_PERSONEL_ID: data.secilenPersonelID,
      PRS_PERSONEL_KOD: data.personelKodu,
      PRS_ISIM: data.personelAdi,
      PRS_PERSONEL_TIP_KOD_ID: data.personelTipiID,
      PRS_DEPARTMAN_ID: data.departmanID,
      PRS_LOKASYON_ID: data.lokasyonID,
      PRS_ATOLYE_ID: data.atolyeID,
      PRS_UNVAN: data.unvan,
      PRS_GOREV_KOD_ID: data.goreviID,
      PRS_FIRMA_ID: data.taseronID,
      PRS_IDARI_PERSONEL_ID: data.idariAmiriID,
      PRS_MASRAF_MERKEZI_ID: data.masrafMerkeziID,
      PRS_AKTIF: data.personelAktif,
      PRS_TEKNISYEN: data.teknisyen,
      PRS_SURUCU: data.surucu,
      PRS_OPERATOR: data.operator,
      PRS_BAKIM: data.bakim,
      PRS_DIGER: data.diger,
      PRS_SANTIYE: data.santiye,
      PRS_ADRES: data.adres,
      PRS_IL: data.sehir,
      PRS_POSTA_KOD: data.postaKodu,
      PRS_TELEFON: data.telefon1,
      PRS_TELEFON1: data.telefon2,
      PRS_DAHILI: data.dahili,
      PRS_EMAIL: data.email,
      PRS_ILCE: data.ilce,
      PRS_ULKE: data.ulke,
      PRS_FAX: data.fax,
      PRS_GSM: data.gsm,
      // Kişisel bilgiler sekmesi
      PRS_UYRUK_KOD_ID: data.uyruguID,
      PRS_DIL_KOD_ID: data.diliID,
      PRS_CINSIYET: data.cinsiyetID,
      PRS_KAN_GRUP: data.kanGrubu,
      PRS_SSK_NO: data.sgKNO,
      PRS_VERGI_NO: data.vergiNo,
      PRS_EGITIM_DURUMU: data.egitimDurumu,
      PRS_MEZUN_OLDUGU_OKUL: data.mezunOkul,
      PRS_MEZUN_OLDUGU_BOLUM: data.mezunBolum,
      PRS_MEZUNIYET_TARIH: formatDateWithDayjs(data.mezuniyetTarihi),
      PRS_ISE_BASLAMA: formatDateWithDayjs(data.iseBaslamaTarihi),
      PRS_AYRILMATARIH: formatDateWithDayjs(data.istenAyrilmaTarihi),
      PRS_UCRET_TIPI: data.ucretTipiID,
      PRS_BIRIM_UCRET: data.iscilikUcreti,
      PRS_FAZLA_MESAI: data.fazlaMesaiUcreti,
      // Diğer alanlarınız...
    };

    // API'ye POST isteği gönder
    AxiosInstance.post("UpdatePersonel", Body)
      .then((response) => {
        console.log("Data sent successfully:", response);
        setOpen(false);
        onRefresh();
        methods.reset();
      })
      .catch((error) => {
        console.error("Error sending data:", error);
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
          width="1460px"
          title="Personel Tanımını Güncelle"
          placement="right"
          onClose={onClose}
          open={open}
          extra={
            <Space>
              <Button onClick={onClose}>İptal</Button>
              <Button
                type="submit"
                onClick={methods.handleSubmit(onSubmit)}
                style={{ backgroundColor: "#2bc770", borderColor: "#2bc770", color: "#ffffff" }}>
                Güncelle
              </Button>
            </Space>
          }>
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            <MainTabs />
            <SecondTabs />
            <Footer />
          </form>
        </Drawer>
      </ConfigProvider>
    </FormProvider>
  );
}
