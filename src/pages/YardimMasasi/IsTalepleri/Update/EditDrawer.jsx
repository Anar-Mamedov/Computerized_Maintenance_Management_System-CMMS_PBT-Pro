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
      talepKodu: "",
      secilenTalepID: "",
      talepTarihi: "",
      talepSaati: "",
      kapanmaTarihi: "",
      kapanmaSaati: "",
      talepteBulunan: "",
      talepteBulunanID: "",
      lokasyonTanim: "",
      lokasyonID: "",
      departman: null,
      departmanID: "",
      irtibatTelefonu: "",
      email: "",
      iletisimSekli: null,
      iletisimSekliID: "",
      talepTipi: null,
      talepTipiID: "",
      isKategorisi: null,
      isKategorisiID: "",
      servisNedeni: null,
      servisNedeniID: "",
      atolye: "",
      oncelikTanim: "",
      oncelikID: "",
      bildirilenBina: null,
      bildirilenBinaID: "",
      bildirilenKat: null,
      bildirilenKatID: "",
      ilgiliKisi: "",
      ilgiliKisiID: "",
      konu: "",
      aciklama: "",
      makine: "",
      makineID: "",
      makineTanim: "",
      ekipman: "",
      ekipmanID: "",
      ekipmanTanim: "",
      makineDurumu: null,
      makineDurumuID: "",
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
      setValue("mezuniyetTarihi", selectedRow.PRS_MEZUNIYET_TARIH ? dayjs(selectedRow.PRS_MEZUNIYET_TARIH) : null);
      setValue("iseBaslamaTarihi", selectedRow.PRS_ISE_BASLAMA ? dayjs(selectedRow.PRS_ISE_BASLAMA) : null);
      setValue("istenAyrilmaTarihi", selectedRow.PRS_AYRILMATARIH ? dayjs(selectedRow.PRS_AYRILMATARIH) : null);
      setValue("ucretTipiID", selectedRow.PRS_UCRET_TIPI);
      setValue("iscilikUcreti", selectedRow.PRS_BIRIM_UCRET);
      setValue("fazlaMesaiUcreti", selectedRow.PRS_FAZLA_MESAI);
      // kimlik bilgileri sekmesi
      setValue("tcKimlikNo", selectedRow.PRS_TCKIMLIK_NO);
      setValue("seriNo", selectedRow.PRS_KIMLIK_SERINO);
      setValue("babaAdi", selectedRow.PRS_BABA_ADI);
      setValue("anaAdi", selectedRow.PRS_ANA_ADI);
      setValue("dogumYeri", selectedRow.PRS_DOGUM_YERI);
      setValue("dini", selectedRow.PRS_DINI);
      setValue("kayitNo", selectedRow.PRS_KIMLIK_KAYIT_NO);
      setValue("dogumTarihi", selectedRow.PRS_DOGUM_TARIH ? dayjs(selectedRow.PRS_DOGUM_TARIH) : null);
      setValue("medeniHalID", selectedRow.PRS_MEDENI_HALI);
      setValue("kayitliOlduguIl", selectedRow.PRS_KAYITLI_OLDUGU_IL);
      setValue("kayitliOlduguIlce", selectedRow.PRS_KAYITLI_OLDUGU_ILCE);
      setValue("mahalleKoy", selectedRow.PRS_MAHALLE_KOY);
      setValue("ciltNo", selectedRow.PRS_KIMLIK_CILT_NO);
      setValue("aileSiraNo", selectedRow.PRS_KIMLIK_AILE_SIRA_NO);
      setValue("siraNo", selectedRow.PRS_KIMLIK_SIRA_NO);
      setValue("verildigiYer", selectedRow.PRS_KIMLIK_VERILDIGI_YER);
      setValue("verilisNedeni", selectedRow.PRS_KIMLIK_VERILIS_NEDENI);
      setValue(
        "verilisTarihi",
        selectedRow.PRS_KIMLIK_VERILIS_TARIH ? dayjs(selectedRow.PRS_KIMLIK_VERILIS_TARIH) : null
      );
      // Ehliyet Bilgileri sekmesi
      setValue("ehliyetID", selectedRow.PRS_EHLIYET);
      setValue("sinifi", selectedRow.PRS_EHLIYET_SINIF);
      setValue("ehliyetVerildigiIlIlce", selectedRow.PRS_EHLIYET_VERILDIGI_IL_ILCE);
      setValue("belgeNo", selectedRow.PRS_EHLIYETNO);
      setValue(
        "belgeTarihi",
        selectedRow.PRS_EHLIYET_BELGE_TARIHI ? dayjs(selectedRow.PRS_EHLIYET_BELGE_TARIHI) : null
      );
      setValue("ehliyetSeriNo", selectedRow.PRS_EHLIYET_SERI_NO);
      setValue("kullandigiCihazProtezler", selectedRow.PRS_EHLIYET_KULLANDIGI_CIHAZ_PROTEZ);
      setValue("cezaPuani", selectedRow.PRS_CEZAPUAN);
      // Özel Alanlar sekmesi
      setValue("ozelAlan1", selectedRow.PRS_OZEL_ALAN_1);
      setValue("ozelAlan2", selectedRow.PRS_OZEL_ALAN_2);
      setValue("ozelAlan3", selectedRow.PRS_OZEL_ALAN_3);
      setValue("ozelAlan4", selectedRow.PRS_OZEL_ALAN_4);
      setValue("ozelAlan5", selectedRow.PRS_OZEL_ALAN_5);
      setValue("ozelAlan6", selectedRow.PRS_OZEL_ALAN_6);
      setValue("ozelAlan6ID", selectedRow.PRS_OZEL_ALAN_6_KOD_ID);
      setValue("ozelAlan7", selectedRow.PRS_OZEL_ALAN_7);
      setValue("ozelAlan7ID", selectedRow.PRS_OZEL_ALAN_7_KOD_ID);
      setValue("ozelAlan8", selectedRow.PRS_OZEL_ALAN_8);
      setValue("ozelAlan8ID", selectedRow.PRS_OZEL_ALAN_8_KOD_ID);
      setValue("ozelAlan9", selectedRow.PRS_OZEL_ALAN_9);
      setValue("ozelAlan10", selectedRow.PRS_OZEL_ALAN_10);
      // Açıklama Sekmesi
      setValue("aciklama", selectedRow.PRS_ACIKLAMA);
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
      IST_KOD: data.talepKodu,
      IST_ACILIS_TARIHI: formatDateWithDayjs(data.talepTarihi),
      IST_ACILIS_SAATI: formatTimeWithDayjs(data.talepSaati),
      IST_TALEP_EDEN_ID: data.talepteBulunanID,
      IST_BILDIREN_LOKASYON_ID: data.lokasyonID,
      IST_DEPARTMAN_ID: data.departmanID,
      IST_IRTIBAT_TELEFON: data.irtibatTelefonu,
      IST_MAIL_ADRES: data.email,
      IST_IRTIBAT_KOD_KOD_ID: data.iletisimSekliID,
      IST_TIP_KOD_ID: data.talepTipiID,
      IST_KOTEGORI_KODI_ID: data.isKategorisiID,
      IST_SERVIS_NEDENI_KOD_ID: data.servisNedeniID,
      IST_ONCELIK_ID: data.oncelikID,
      IST_BILDIRILEN_BINA: data.bildirilenBinaID,
      IST_BILDIRILEN_KAT: data.bildirilenKatID,
      IST_IS_TAKIPCISI_ID: data.ilgiliKisiID,
      IST_TANIMI: data.konu,
      IST_ACIKLAMA: data.aciklama,
      IST_MAKINE_ID: data.makineID,
      IST_EKIPMAN_ID: data.ekipmanID,
      IST_MAKINE_DURUM_KOD_ID: data.makineDurumuID,
      // Diğer alanlarınız...
    };

    // API'ye POST isteği gönder
    AxiosInstance.post("UpdateIsTalep", Body)
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

  useEffect(() => {
    if (drawerVisible && selectedRow && selectedRow.IST_DURUM_ID === 0) {
      // IST_DURUM_ID 0 ise otomatik olarak isteği yap
      const Body = {
        TB_IS_TALEP_ID: selectedRow.key,
        // Diğer alanlar...
      };

      AxiosInstance.post("UpdateIsTalep", { IST_DURUM_ID: 1, ...Body }) // IST_DURUM_ID'yi 1 yaparak güncelleme yapabilirsiniz
        .then((response) => {
          console.log("Data sent successfully:", response);
          onRefresh();
          methods.reset();
        })
        .catch((error) => {
          console.error("Error sending data:", error);
        });
    }
  }, [drawerVisible, selectedRow]);

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
