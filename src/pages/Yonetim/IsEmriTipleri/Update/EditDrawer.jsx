import tr_TR from 'antd/es/locale/tr_TR';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Drawer, Space, ConfigProvider, Modal, message } from 'antd';
import React, { useEffect, useState, useTransition } from 'react';
import { useForm, Controller, useFormContext, FormProvider, set } from 'react-hook-form';
import dayjs from 'dayjs';
import AxiosInstance from '../../../../api/http';
import Footer from './components/Footer';
import EditTabs from './components/SecondTabs1/EditTabs.jsx';

export default function EditDrawer({ selectedRow, onDrawerClose, drawerVisible, onRefresh }) {
  const [, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const showDrawer = () => {
    setOpen(true);
  };

  const showConfirmationModal = () => {
    Modal.confirm({
      title: 'İptal etmek istediğinden emin misin?',
      content: 'Kaydedilmemiş değişiklikler kaybolacaktır.',
      okText: 'Evet',
      cancelText: 'Hayır',
      onOk: () => {
        onDrawerClose(); // Close the drawer
        // onRefresh();
        reset();
      },
      onCancel: () => {
        // Do nothing, continue from where the user left off
      },
    });
  };

  const onClose = () => {
    // Kullanıcı "İptal" düğmesine tıkladığında Modal'ı göster
    showConfirmationModal();
  };

  // Drawer'ın kapatılma olayını ele al
  const handleDrawerClose = () => {
    // Kullanıcı çarpı işaretine veya dış alana tıkladığında Modal'ı göster
    showConfirmationModal();
  };

  //* export
  const methods = useForm({
    defaultValues: {
      isEmriTipiTanim: '',
      secilenID: '',
      varsayilanIsEmriTipi: false,
      isEmriTipiRenk: '#ffffff',
      aktifIsEmriTipi: false,
      tipGroup: 1,
      lokasyon: true,
      makine: false,
      ekipman: false,
      makineDurum: false,
      sayacDegeri: false,
      prosedur: false,
      isTipi: false,
      isNedeni: false,
      konu: false,
      oncelik: false,
      atolye: false,
      takvim: false,
      talimat: false,
      planlananBaslangicTarihi: false,
      planlananBitisTarihi: false,
      masrafMerkezi: false,
      proje: false,
      referansNo: false,
      firma: false,
      sozlesme: false,
      evrakNo: false,
      evrakTarihi: false,
      maliyet: false,
      notlar: false,
      // sekmeleri göster ve zorunlu olanları belirle
      detayBilgiler: true,
      kontrolListesiTab: false,
      kontrolListesiTabZorunlu: false,
      personelTab: false,
      personelTabZorunlu: false,
      malzemelerTab: false,
      malzemelerTabZorunlu: false,
      duruslarTab: false,
      duruslarTabZorunlu: false,
      sureBilgileriTab: false,
      maliyetlerTab: false,
      maliyetlerTabZorunlu: false,
      ekipmanIslemleriTab: false,
      ekipmanIslemleriTabZorunlu: false,
      olcumDegerleriTab: false,
      olcumDegerleriTabZorunlu: false,
      ozelAlanlarTab: false,
      aracGereclerTab: false,
      aracGereclerTabZorunlu: false,
      notlarTab: false,
      // kapama zorunlu alanları
      kapamaZamani: false,
      makineDurumuKapama: false,
      bakimPuaniKapama: false,
      personelCalismaSuresiKapama: false,
      makineKapama: false,
      ekipmanKapama: false,
      sayacDegeriKapama: false,
      prosedurKapama: false,
      isTipiKapama: false,
      okunanSayacKapama: false,
      isNedeniKapama: false,
      konuKapama: false,
      oncelikKapama: false,
      atolyeKapama: false,
      firmaKapama: false,
      sozlesmeKapama: false,
      projeKapama: false,
      referansNoKapama: false,
      ozelAlan1Kapama: false,
      ozelAlan2Kapama: false,
      ozelAlan3Kapama: false,
      ozelAlan4Kapama: false,
      ozelAlan5Kapama: false,
      ozelAlan6Kapama: false,
      ozelAlan7Kapama: false,
      ozelAlan8Kapama: false,
      ozelAlan9Kapama: false,
      ozelAlan10Kapama: false,
      ozelAlan11Kapama: false,
      ozelAlan12Kapama: false,
      ozelAlan13Kapama: false,
      ozelAlan14Kapama: false,
      ozelAlan15Kapama: false,
      ozelAlan16Kapama: false,
      ozelAlan17Kapama: false,
      ozelAlan18Kapama: false,
      ozelAlan19Kapama: false,
      ozelAlan20Kapama: false,
      aciklamaKapama: false,
      notlarKapama: false,
      // Çağrılacak Prosedür
      cagrilacakProsedur: null,
      cagrilacakProsedurID: '',
      cagrilacakProsedurLabel: '',
      // add more fields as needed
    },
  });

  const formatDateWithDayjs = (dateString) => {
    const formattedDate = dayjs(dateString);
    return formattedDate.isValid() ? formattedDate.format('YYYY-MM-DD') : '';
  };

  const formatTimeWithDayjs = (timeObj) => {
    const formattedTime = dayjs(timeObj);
    return formattedTime.isValid() ? formattedTime.format('HH:mm:ss') : '';
  };

  const { setValue, reset } = methods;

  //* export
  const onSubmit = (data) => {
    // Başlangıçta kullanıcı tarafından seçilen cagrilacakProsedurID değerini al
    let cagrilacakProsedurID = data.cagrilacakProsedurID;

    // tipGroup değerine göre cagrilacakProsedurID'yi ayarlama
    switch (data.tipGroup) {
      case 1:
        cagrilacakProsedurID = 1;
        break;
      case 2:
        cagrilacakProsedurID = 2;
        break;
      case 3: // tipGroup 3 için de cagrilacakProsedurID 2 olacak
        cagrilacakProsedurID = 2;
        break;
      case 4: // tipGroup 4 ise cagrilacakProsedurID'yi 0 olarak ayarla
        cagrilacakProsedurID = 0;
        break;
      case 5:
        // tipGroup 5 ve cagrilacakProsedurID boş veya tanımsız ise, 0 olarak ayarla
        if (!cagrilacakProsedurID) {
          cagrilacakProsedurID = 0;
        }
        break;
      default:
        // Diğer durumlar için özel bir işlem yapılmasına gerek yok
        break;
    }

    const Body = {
      IMT_TANIM: data.isEmriTipiTanim,
      TB_ISEMRI_TIP_ID: data.secilenID,
      IMT_VARSAYILAN: data.varsayilanIsEmriTipi,
      IMT_RENK_WEB_VERSION: data.isEmriTipiRenk,
      IMT_AKTIF: data.aktifIsEmriTipi,
      IMT_TIP_GRUP: data.tipGroup,
      // Çağrılacak Prosedür
      IMT_CAGRILACAK_PROSEDUR: cagrilacakProsedurID,
      // Çağrılacak Prosedür son
      IMT_LOKASYON: true,
      IMT_MAKINE: data.makine,
      IMT_EKIPMAN: data.ekipman,
      IMT_MAKINE_DURUM: data.makineDurum,
      IMT_SAYAC_DEGERI: data.sayacDegeri,
      IMT_PROSEDUR: data.prosedur,
      IMT_IS_TIP: data.isTipi,
      IMT_IS_NEDEN: data.isNedeni,
      IMT_KONU: data.konu,
      IMT_ONCELIK: data.oncelik,
      IMT_ATOLYE: data.atolye,
      IMT_TAKVIM: data.takvim,
      IMT_TALIMAT: data.talimat,
      IMT_PLAN_TARIH: data.planlananBaslangicTarihi,
      IMT_PLAN_BITIS: data.planlananBitisTarihi,
      IMT_MASRAF_MERKEZ: data.masrafMerkezi,
      IMT_PROJE: data.proje,
      IMT_REFERANS_NO: data.referansNo,
      IMT_FIRMA: data.firma,
      IMT_SOZLESME: data.sozlesme,
      IMT_EVRAK_NO: data.evrakNo,
      IMT_EVRAK_TARIHI: data.evrakTarihi,
      IMT_MALIYET: data.maliyet,
      IMT_NOTLAR: data.notlar,
      // sekmeleri göster ve zorunlu olanları belirle
      IMT_DETAY_TAB: true,
      IMT_KONTROL_TAB: data.kontrolListesiTab,
      IMT_KONTROL_TAB_ZORUNLU: data.kontrolListesiTabZorunlu,
      IMT_PERSONEL_TAB: data.personelTab,
      IMT_PERSONEL_TAB_ZORUNLU: data.personelTabZorunlu,
      IMT_MALZEME_TAB: data.malzemelerTab,
      IMT_MALZEME_TAB_ZORUNLU: data.malzemelerTabZorunlu,
      IMT_DURUS_TAB: data.duruslarTab,
      IMT_DURUS_TAB_ZORUNLU: data.duruslarTabZorunlu,
      IMT_SURE_TAB: data.sureBilgileriTab,
      IMT_MALIYET_TAB: data.maliyetlerTab,
      IMT_TOPLAM_MALIYET_ZORUNLU: data.maliyetlerTabZorunlu,
      IMT_EKIPMAN_TAB: data.ekipmanIslemleriTab,
      IMT_EKIPMAN_TAB_ZORUNLU: data.ekipmanIslemleriTabZorunlu,
      IMT_OLCUM_TAB: data.olcumDegerleriTab,
      IMT_OLCUM_TAB_ZORUNLU: data.olcumDegerleriTabZorunlu,
      IMT_OZEL_ALAN_TAB: data.ozelAlanlarTab,
      IMT_ARAC_GEREC_TAB: data.aracGereclerTab,
      IMT_ARAC_GEREC_TAB_ZORUNLU: data.aracGereclerTabZorunlu,
      IMT_NOTLAR_TAB: data.notlarTab,
      // kapama zorunlu alanları
      IMT_KAPANMA_ZAMANI: data.kapamaZamani,
      IMT_MAKINE_DURUM_KAPAT: data.makineDurumuKapama,
      IMT_BAKIM_PUAN: data.bakimPuaniKapama,
      IMT_PERSONEL_SURE: data.personelCalismaSuresiKapama,
      IMT_MAKINE_KAPAT: data.makineKapama,
      IMT_EKIPMAN_KAPAT: data.ekipmanKapama,
      IMT_SAYAC_DEGER_KAPAT: data.sayacDegeriKapama,
      IMT_PROSEDUR_KAPAT: data.prosedurKapama,
      IMT_IS_TIPI_KAPAT: data.isTipiKapama,
      IMT_OKUNAN_SAYAC: data.okunanSayacKapama,
      IMT_IS_NEDENI_KAPAT: data.isNedeniKapama,
      IMT_KONU_KAPAT: data.konuKapama,
      IMT_ONCELIK_KAPAT: data.oncelikKapama,
      IMT_ATOLYE_KAPAT: data.atolyeKapama,
      IMT_FIRMA_KAPAT: data.firmaKapama,
      IMT_SOZLESME_KAPAT: data.sozlesmeKapama,
      IMT_PROJE_KAPAT: data.projeKapama,
      IMT_REFNO_KAPAT: data.referansNoKapama,
      IMT_OZEL_ALAN_1: data.ozelAlan1Kapama,
      IMT_OZEL_ALAN_2: data.ozelAlan2Kapama,
      IMT_OZEL_ALAN_3: data.ozelAlan3Kapama,
      IMT_OZEL_ALAN_4: data.ozelAlan4Kapama,
      IMT_OZEL_ALAN_5: data.ozelAlan5Kapama,
      IMT_OZEL_ALAN_6: data.ozelAlan6Kapama,
      IMT_OZEL_ALAN_7: data.ozelAlan7Kapama,
      IMT_OZEL_ALAN_8: data.ozelAlan8Kapama,
      IMT_OZEL_ALAN_9: data.ozelAlan9Kapama,
      IMT_OZEL_ALAN_10: data.ozelAlan10Kapama,
      IMT_OZEL_ALAN_11: data.ozelAlan11Kapama,
      IMT_OZEL_ALAN_12: data.ozelAlan12Kapama,
      IMT_OZEL_ALAN_13: data.ozelAlan13Kapama,
      IMT_OZEL_ALAN_14: data.ozelAlan14Kapama,
      IMT_OZEL_ALAN_15: data.ozelAlan15Kapama,
      IMT_OZEL_ALAN_16: data.ozelAlan16Kapama,
      IMT_OZEL_ALAN_17: data.ozelAlan17Kapama,
      IMT_OZEL_ALAN_18: data.ozelAlan18Kapama,
      IMT_OZEL_ALAN_19: data.ozelAlan19Kapama,
      IMT_OZEL_ALAN_20: data.ozelAlan20Kapama,
      IMT_ACIKLAMA_KAPAT: data.aciklamaKapama,
      IMT_NOTLAR_KAPAT: data.notlarKapama,
      // add more fields as needed
    };

    // AxiosInstance.post("/api/endpoint", { Body }).then((response) => {
    // handle response
    // });

    AxiosInstance.post('UpdateIsEmriTipi', Body)
      .then((response) => {
        // Handle successful response here, e.g.:
        console.log('Data sent successfully:', response);
        if (response.status_code === 200 || response.status_code === 201) {
          message.success('Ekleme Başarılı.');
          onDrawerClose(); // Close the drawer
          onRefresh();
          methods.reset();
        } else if (response.status_code === 401) {
          message.error('Bu işlemi yapmaya yetkiniz bulunmamaktadır.');
        } else {
          message.error('Ekleme Başarısız.');
        }
      })
      .catch((error) => {
        // Handle errors here, e.g.:
        console.error('Error sending data:', error);
        message.error('Başarısız Olundu.');
      });
    console.log({ Body });
  };

  useEffect(() => {
    if (drawerVisible && selectedRow) {
      // console.log("selectedRow", selectedRow);
      // startTransition(() => {
      // Object.keys(selectedRow).forEach((key) => {
      //   console.log(key, selectedRow[key]);
      //   setValue(key, selectedRow[key]);
      setValue('secilenID', selectedRow.key);
      setValue('isEmriTipiTanim', selectedRow.IMT_TANIM);
      setValue('varsayilanIsEmriTipi', selectedRow.IMT_VARSAYILAN);
      setValue('isEmriTipiRenk', selectedRow.IMT_RENK_WEB_VERSION);
      setValue('aktifIsEmriTipi', selectedRow.IMT_AKTIF);
      setValue('tipGroup', selectedRow.IMT_TIP_GRUP);
      setValue('lokasyon', selectedRow.IMT_LOKASYON);
      setValue('makine', selectedRow.IMT_MAKINE);
      setValue('ekipman', selectedRow.IMT_EKIPMAN);
      setValue('makineDurum', selectedRow.IMT_MAKINE_DURUM);
      setValue('sayacDegeri', selectedRow.IMT_SAYAC_DEGERI);
      setValue('prosedur', selectedRow.IMT_PROSEDUR);
      setValue('isTipi', selectedRow.IMT_IS_TIP);
      setValue('isNedeni', selectedRow.IMT_IS_NEDEN);
      setValue('konu', selectedRow.IMT_KONU);
      setValue('oncelik', selectedRow.IMT_ONCELIK);
      setValue('atolye', selectedRow.IMT_ATOLYE);
      setValue('takvim', selectedRow.IMT_TAKVIM);
      setValue('talimat', selectedRow.IMT_TALIMAT);
      setValue('planlananBaslangicTarihi', selectedRow.IMT_PLAN_TARIH);
      setValue('planlananBitisTarihi', selectedRow.IMT_PLAN_BITIS);
      setValue('masrafMerkezi', selectedRow.IMT_MASRAF_MERKEZ);
      setValue('proje', selectedRow.IMT_PROJE);
      setValue('referansNo', selectedRow.IMT_REFERANS_NO);
      setValue('firma', selectedRow.IMT_FIRMA);
      setValue('sozlesme', selectedRow.IMT_SOZLESME);
      setValue('evrakNo', selectedRow.IMT_EVRAK_NO);
      setValue('evrakTarihi', selectedRow.IMT_EVRAK_TARIHI);
      setValue('maliyet', selectedRow.IMT_MALIYET);
      setValue('notlar', selectedRow.IMT_NOTLAR);
      // sekmeleri göster ve zorunlu olanları belirle
      setValue('detayBilgiler', selectedRow.IMT_DETAY_TAB);
      setValue('kontrolListesiTab', selectedRow.IMT_KONTROL_TAB);
      setValue('kontrolListesiTabZorunlu', selectedRow.IMT_KONTROL_TAB_ZORUNLU);
      setValue('personelTab', selectedRow.IMT_PERSONEL_TAB);
      setValue('personelTabZorunlu', selectedRow.IMT_PERSONEL_TAB_ZORUNLU);
      setValue('malzemelerTab', selectedRow.IMT_MALZEME_TAB);
      setValue('malzemelerTabZorunlu', selectedRow.IMT_MALZEME_TAB_ZORUNLU);
      setValue('duruslarTab', selectedRow.IMT_DURUS_TAB);
      setValue('duruslarTabZorunlu', selectedRow.IMT_DURUS_TAB_ZORUNLU);
      setValue('sureBilgileriTab', selectedRow.IMT_SURE_TAB);
      setValue('maliyetlerTab', selectedRow.IMT_MALIYET_TAB);
      setValue('maliyetlerTabZorunlu', selectedRow.IMT_TOPLAM_MALIYET_ZORUNLU);
      setValue('ekipmanIslemleriTab', selectedRow.IMT_EKIPMAN_TAB);
      setValue('ekipmanIslemleriTabZorunlu', selectedRow.IMT_EKIPMAN_TAB_ZORUNLU);
      setValue('olcumDegerleriTab', selectedRow.IMT_OLCUM_TAB);
      setValue('olcumDegerleriTabZorunlu', selectedRow.IMT_OLCUM_TAB_ZORUNLU);
      setValue('ozelAlanlarTab', selectedRow.IMT_OZEL_ALAN_TAB);
      setValue('aracGereclerTab', selectedRow.IMT_ARAC_GEREC_TAB);
      setValue('aracGereclerTabZorunlu', selectedRow.IMT_ARAC_GEREC_TAB_ZORUNLU);
      setValue('notlarTab', selectedRow.IMT_NOTLAR_TAB);
      // kapama zorunlu alanları
      setValue('kapamaZamani', selectedRow.IMT_KAPANMA_ZAMANI);
      setValue('makineDurumuKapama', selectedRow.IMT_MAKINE_DURUM_KAPAT);
      setValue('bakimPuaniKapama', selectedRow.IMT_BAKIM_PUAN);
      setValue('personelCalismaSuresiKapama', selectedRow.IMT_PERSONEL_SURE);
      setValue('makineKapama', selectedRow.IMT_MAKINE_KAPAT);
      setValue('ekipmanKapama', selectedRow.IMT_EKIPMAN_KAPAT);
      setValue('sayacDegeriKapama', selectedRow.IMT_SAYAC_DEGER_KAPAT);
      setValue('prosedurKapama', selectedRow.IMT_PROSEDUR_KAPAT);
      setValue('isTipiKapama', selectedRow.IMT_IS_TIPI_KAPAT);
      setValue('okunanSayacKapama', selectedRow.IMT_OKUNAN_SAYAC);
      setValue('isNedeniKapama', selectedRow.IMT_IS_NEDENI_KAPAT);
      setValue('konuKapama', selectedRow.IMT_KONU_KAPAT);
      setValue('oncelikKapama', selectedRow.IMT_ONCELIK_KAPAT);
      setValue('atolyeKapama', selectedRow.IMT_ATOLYE_KAPAT);
      setValue('firmaKapama', selectedRow.IMT_FIRMA_KAPAT);
      setValue('sozlesmeKapama', selectedRow.IMT_SOZLESME_KAPAT);
      setValue('projeKapama', selectedRow.IMT_PROJE_KAPAT);
      setValue('referansNoKapama', selectedRow.IMT_REFNO_KAPAT);
      setValue('ozelAlan1Kapama', selectedRow.IMT_OZEL_ALAN_1);
      setValue('ozelAlan2Kapama', selectedRow.IMT_OZEL_ALAN_2);
      setValue('ozelAlan3Kapama', selectedRow.IMT_OZEL_ALAN_3);
      setValue('ozelAlan4Kapama', selectedRow.IMT_OZEL_ALAN_4);
      setValue('ozelAlan5Kapama', selectedRow.IMT_OZEL_ALAN_5);
      setValue('ozelAlan6Kapama', selectedRow.IMT_OZEL_ALAN_6);
      setValue('ozelAlan7Kapama', selectedRow.IMT_OZEL_ALAN_7);
      setValue('ozelAlan8Kapama', selectedRow.IMT_OZEL_ALAN_8);
      setValue('ozelAlan9Kapama', selectedRow.IMT_OZEL_ALAN_9);
      setValue('ozelAlan10Kapama', selectedRow.IMT_OZEL_ALAN_10);
      setValue('ozelAlan11Kapama', selectedRow.IMT_OZEL_ALAN_11);
      setValue('ozelAlan12Kapama', selectedRow.IMT_OZEL_ALAN_12);
      setValue('ozelAlan13Kapama', selectedRow.IMT_OZEL_ALAN_13);
      setValue('ozelAlan14Kapama', selectedRow.IMT_OZEL_ALAN_14);
      setValue('ozelAlan15Kapama', selectedRow.IMT_OZEL_ALAN_15);
      setValue('ozelAlan16Kapama', selectedRow.IMT_OZEL_ALAN_16);
      setValue('ozelAlan17Kapama', selectedRow.IMT_OZEL_ALAN_17);
      setValue('ozelAlan18Kapama', selectedRow.IMT_OZEL_ALAN_18);
      setValue('ozelAlan19Kapama', selectedRow.IMT_OZEL_ALAN_19);
      setValue('ozelAlan20Kapama', selectedRow.IMT_OZEL_ALAN_20);
      setValue('aciklamaKapama', selectedRow.IMT_ACIKLAMA_KAPAT);
      setValue('notlarKapama', selectedRow.IMT_NOTLAR_KAPAT);
      // Çağrılacak Prosedür
      setValue('cagrilacakProsedurID', selectedRow.IMT_CAGRILACAK_PROSEDUR);

      // add more fields as needed

      // });
      // });
    }
  }, [selectedRow, setValue, drawerVisible]);

  useEffect(() => {
    if (!drawerVisible) {
      reset(); // Drawer kapandığında formu sıfırla
    }
  }, [drawerVisible, reset]);

  return (
    <FormProvider {...methods}>
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
          width="700px"
          title="İş Emri Tipi Güncelle"
          placement={'right'}
          onClose={handleDrawerClose}
          open={drawerVisible}
          extra={
            <Space>
              <Button onClick={onClose}>İptal</Button>
              <Button
                type="submit"
                onClick={methods.handleSubmit(onSubmit)}
                style={{
                  backgroundColor: '#2bc770',
                  borderColor: '#2bc770',
                  color: '#ffffff',
                }}
              >
                Güncelle
              </Button>
            </Space>
          }
        >
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            <EditTabs />
            <Footer />
          </form>
        </Drawer>
      </ConfigProvider>
    </FormProvider>
  );
}
