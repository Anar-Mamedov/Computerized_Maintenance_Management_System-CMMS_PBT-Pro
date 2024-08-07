import React, { useCallback, useEffect, useState } from 'react';
import { Button, Modal, Input, Typography, Tabs, message, Spin } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import AxiosInstance from '../../../../../../../../../api/http';
import { Controller, useForm, FormProvider, set } from 'react-hook-form';
import MainTabs from './MainTabs/MainTabs';
import EditTabs from './SecondTabs/EditTabs';
import dayjs from 'dayjs';
import { useAppContext } from '../../../../../../../../../AppContext';

export default function CreateModal({ workshopSelectedId, onSubmit, onRefresh, secilenPersonelID, selectedRow, isEmriTipiID }) {
  const { isModalVisible, setIsModalVisible } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [selectedData, setSelectedData] = useState({});

  // message
  const [messageApi, contextHolder] = message.useMessage();
  // message end
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
      // Add other default values here
    },
  });

  const { setValue, reset, handleSubmit } = methods;

  useEffect(() => {
    if (!isModalVisible) {
      methods.reset(); // `reset` doğrudan `methods` üzerinden çağrılıyor
    }
  }, [isModalVisible, methods]);

  const formatDateWithDayjs = (dateString) => {
    const formattedDate = dayjs(dateString);
    return formattedDate.isValid() ? formattedDate.format('YYYY-MM-DD') : '';
  };

  const formatTimeWithDayjs = (timeObj) => {
    const formattedTime = dayjs(timeObj);
    return formattedTime.isValid() ? formattedTime.format('HH:mm:ss') : '';
  };

  // Aşğaıdaki form elemanlarını eklemek üçün API ye gönderilme işlemi

  const onSubmited = (data) => {
    setLoading(true);
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

    // Body nesnesi içinde cagrilacakProsedurID'yi kullanma
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
    };
    AxiosInstance.post('UpdateIsEmriTipi', Body)
      .then((response) => {
        console.log('Data sent successfully:', response);
        reset();
        setIsModalVisible(false); // Sadece başarılı olursa modalı kapat
        setLoading(false);
        // onRefresh();
        // İsteğin başarılı olduğunu kontrol et
        if (response.status_code === 200 || response.status_code === 201) {
          message.success('Ekleme Başarılı.');
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
        setLoading(false);
      });

    console.log({ Body });
  };

  const handleModalToggle = () => {
    setIsModalVisible((prev) => {
      if (prev) {
        // Modal şu anda açık, kapatacağız
        reset();
        setSelectedData(null); // Modal kapanırken selectedData'yı null yap
      }
      return !prev;
    });
  };

  // Aşğaıdaki form elemanlarını eklemek üçün API ye gönderilme işlemi sonu

  const handleSelectedRow = (selectedRowData) => {
    methods.reset();
    // Burada, tıklanan satırın verisini işleyebilirsiniz.
    // Örneğin, form alanlarını doldurmak veya başka bir işlem yapmak için kullanabilirsiniz.
    setTimeout(() => {
      console.log('Seçilen satır:', selectedRowData);
      setSelectedData(selectedRowData);
      setValue('secilenID', selectedRowData.key);
      setValue('isEmriTipiTanim', selectedRowData.IMT_TANIM);
      setValue('varsayilanIsEmriTipi', selectedRowData.IMT_VARSAYILAN);
      setValue('isEmriTipiRenk', selectedRowData.IMT_RENK_WEB_VERSION);
      setValue('aktifIsEmriTipi', selectedRowData.IMT_AKTIF);
      setValue('tipGroup', selectedRowData.IMT_TIP_GRUP);
      setValue('lokasyon', selectedRowData.IMT_LOKASYON);
      setValue('makine', selectedRowData.IMT_MAKINE);
      setValue('ekipman', selectedRowData.IMT_EKIPMAN);
      setValue('makineDurum', selectedRowData.IMT_MAKINE_DURUM);
      setValue('sayacDegeri', selectedRowData.IMT_SAYAC_DEGERI);
      setValue('prosedur', selectedRowData.IMT_PROSEDUR);
      setValue('isTipi', selectedRowData.IMT_IS_TIP);
      setValue('isNedeni', selectedRowData.IMT_IS_NEDEN);
      setValue('konu', selectedRowData.IMT_KONU);
      setValue('oncelik', selectedRowData.IMT_ONCELIK);
      setValue('atolye', selectedRowData.IMT_ATOLYE);
      setValue('takvim', selectedRowData.IMT_TAKVIM);
      setValue('talimat', selectedRowData.IMT_TALIMAT);
      setValue('planlananBaslangicTarihi', selectedRowData.IMT_PLAN_TARIH);
      setValue('planlananBitisTarihi', selectedRowData.IMT_PLAN_BITIS);
      setValue('masrafMerkezi', selectedRowData.IMT_MASRAF_MERKEZ);
      setValue('proje', selectedRowData.IMT_PROJE);
      setValue('referansNo', selectedRowData.IMT_REFERANS_NO);
      setValue('firma', selectedRowData.IMT_FIRMA);
      setValue('sozlesme', selectedRowData.IMT_SOZLESME);
      setValue('evrakNo', selectedRowData.IMT_EVRAK_NO);
      setValue('evrakTarihi', selectedRowData.IMT_EVRAK_TARIHI);
      setValue('maliyet', selectedRowData.IMT_MALIYET);
      setValue('notlar', selectedRowData.IMT_NOTLAR);
      // sekmeleri göster ve zorunlu olanları belirle
      setValue('detayBilgiler', selectedRowData.IMT_DETAY_TAB);
      setValue('kontrolListesiTab', selectedRowData.IMT_KONTROL_TAB);
      setValue('kontrolListesiTabZorunlu', selectedRowData.IMT_KONTROL_TAB_ZORUNLU);
      setValue('personelTab', selectedRowData.IMT_PERSONEL_TAB);
      setValue('personelTabZorunlu', selectedRowData.IMT_PERSONEL_TAB_ZORUNLU);
      setValue('malzemelerTab', selectedRowData.IMT_MALZEME_TAB);
      setValue('malzemelerTabZorunlu', selectedRowData.IMT_MALZEME_TAB_ZORUNLU);
      setValue('duruslarTab', selectedRowData.IMT_DURUS_TAB);
      setValue('duruslarTabZorunlu', selectedRowData.IMT_DURUS_TAB_ZORUNLU);
      setValue('sureBilgileriTab', selectedRowData.IMT_SURE_TAB);
      setValue('maliyetlerTab', selectedRowData.IMT_MALIYET_TAB);
      setValue('maliyetlerTabZorunlu', selectedRowData.IMT_TOPLAM_MALIYET_ZORUNLU);
      setValue('ekipmanIslemleriTab', selectedRowData.IMT_EKIPMAN_TAB);
      setValue('ekipmanIslemleriTabZorunlu', selectedRowData.IMT_EKIPMAN_TAB_ZORUNLU);
      setValue('olcumDegerleriTab', selectedRowData.IMT_OLCUM_TAB);
      setValue('olcumDegerleriTabZorunlu', selectedRowData.IMT_OLCUM_TAB_ZORUNLU);
      setValue('ozelAlanlarTab', selectedRowData.IMT_OZEL_ALAN_TAB);
      setValue('aracGereclerTab', selectedRowData.IMT_ARAC_GEREC_TAB);
      setValue('aracGereclerTabZorunlu', selectedRowData.IMT_ARAC_GEREC_TAB_ZORUNLU);
      setValue('notlarTab', selectedRowData.IMT_NOTLAR_TAB);
      // kapama zorunlu alanları
      setValue('kapamaZamani', selectedRowData.IMT_KAPANMA_ZAMANI);
      setValue('makineDurumuKapama', selectedRowData.IMT_MAKINE_DURUM_KAPAT);
      setValue('bakimPuaniKapama', selectedRowData.IMT_BAKIM_PUAN);
      setValue('personelCalismaSuresiKapama', selectedRowData.IMT_PERSONEL_SURE);
      setValue('makineKapama', selectedRowData.IMT_MAKINE_KAPAT);
      setValue('ekipmanKapama', selectedRowData.IMT_EKIPMAN_KAPAT);
      setValue('sayacDegeriKapama', selectedRowData.IMT_SAYAC_DEGER_KAPAT);
      setValue('prosedurKapama', selectedRowData.IMT_PROSEDUR_KAPAT);
      setValue('isTipiKapama', selectedRowData.IMT_IS_TIPI_KAPAT);
      setValue('okunanSayacKapama', selectedRowData.IMT_OKUNAN_SAYAC);
      setValue('isNedeniKapama', selectedRowData.IMT_IS_NEDENI_KAPAT);
      setValue('konuKapama', selectedRowData.IMT_KONU_KAPAT);
      setValue('oncelikKapama', selectedRowData.IMT_ONCELIK_KAPAT);
      setValue('atolyeKapama', selectedRowData.IMT_ATOLYE_KAPAT);
      setValue('firmaKapama', selectedRowData.IMT_FIRMA_KAPAT);
      setValue('sozlesmeKapama', selectedRowData.IMT_SOZLESME_KAPAT);
      setValue('projeKapama', selectedRowData.IMT_PROJE_KAPAT);
      setValue('referansNoKapama', selectedRowData.IMT_REFNO_KAPAT);
      setValue('ozelAlan1Kapama', selectedRowData.IMT_OZEL_ALAN_1);
      setValue('ozelAlan2Kapama', selectedRowData.IMT_OZEL_ALAN_2);
      setValue('ozelAlan3Kapama', selectedRowData.IMT_OZEL_ALAN_3);
      setValue('ozelAlan4Kapama', selectedRowData.IMT_OZEL_ALAN_4);
      setValue('ozelAlan5Kapama', selectedRowData.IMT_OZEL_ALAN_5);
      setValue('ozelAlan6Kapama', selectedRowData.IMT_OZEL_ALAN_6);
      setValue('ozelAlan7Kapama', selectedRowData.IMT_OZEL_ALAN_7);
      setValue('ozelAlan8Kapama', selectedRowData.IMT_OZEL_ALAN_8);
      setValue('ozelAlan9Kapama', selectedRowData.IMT_OZEL_ALAN_9);
      setValue('ozelAlan10Kapama', selectedRowData.IMT_OZEL_ALAN_10);
      setValue('ozelAlan11Kapama', selectedRowData.IMT_OZEL_ALAN_11);
      setValue('ozelAlan12Kapama', selectedRowData.IMT_OZEL_ALAN_12);
      setValue('ozelAlan13Kapama', selectedRowData.IMT_OZEL_ALAN_13);
      setValue('ozelAlan14Kapama', selectedRowData.IMT_OZEL_ALAN_14);
      setValue('ozelAlan15Kapama', selectedRowData.IMT_OZEL_ALAN_15);
      setValue('ozelAlan16Kapama', selectedRowData.IMT_OZEL_ALAN_16);
      setValue('ozelAlan17Kapama', selectedRowData.IMT_OZEL_ALAN_17);
      setValue('ozelAlan18Kapama', selectedRowData.IMT_OZEL_ALAN_18);
      setValue('ozelAlan19Kapama', selectedRowData.IMT_OZEL_ALAN_19);
      setValue('ozelAlan20Kapama', selectedRowData.IMT_OZEL_ALAN_20);
      setValue('aciklamaKapama', selectedRowData.IMT_ACIKLAMA_KAPAT);
      setValue('notlarKapama', selectedRowData.IMT_NOTLAR_KAPAT);
      // Çağrılacak Prosedür
      setValue('cagrilacakProsedurID', selectedRowData.IMT_CAGRILACAK_PROSEDUR);
    }, 200);
  };

  return (
    <FormProvider {...methods}>
      {contextHolder}

      <div>
        <div style={{ display: 'flex', width: '100%', justifyContent: 'flex-end' }}>
          <Button
            style={{
              width: '32px',
              height: '32px',
              padding: '0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onClick={handleModalToggle}
          >
            <PlusOutlined />
          </Button>
        </div>

        <Modal centered width="1000px" title="İş Emri Tipi" open={isModalVisible} onOk={methods.handleSubmit(onSubmited)} onCancel={handleModalToggle} destroyOnClose>
          <Spin spinning={loading}>
            <div style={{ display: 'flex', gap: '10px' }}>
              <MainTabs onSelectedRow={handleSelectedRow} isEmriTipiID={isEmriTipiID} />
              <form onSubmit={methods.handleSubmit(onSubmited)}>
                {/* Koşullu renderlama burada yapılıyor */}
                {/* {selectedData && Object.keys(selectedData).length > 0 && <EditTabs selectedRow={selectedData} />} */}
                <EditTabs selectedRow={selectedData} />
              </form>
            </div>
          </Spin>
        </Modal>
      </div>
    </FormProvider>
  );
}
