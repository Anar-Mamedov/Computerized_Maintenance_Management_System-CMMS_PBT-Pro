import React, { useEffect, useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { Button, Drawer, Space, ConfigProvider, Modal, Spin, message, Tag } from 'antd';
import tr_TR from 'antd/es/locale/tr_TR';
import AxiosInstance from '../../../../api/http';
import MainTabs from './components/MainTabs/MainTabs';
import Footer from './components/Footer';
import SecondTabs from './components/SecondTabs/SecondTabs';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

export default function EditDrawer({ selectedRow, onDrawerClose, drawerVisible, onRefresh }) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(drawerVisible);
  const [disabled, setDisabled] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  // API'den gelen zorunluluk bilgilerini simüle eden bir örnek
  const [fieldRequirements, setFieldRequirements] = React.useState({
    // Varsayılan olarak zorunlu değil
    // Diğer alanlar için de benzer şekilde...
  });

  const methods = useForm({
    defaultValues: {
      talepKodu: '',
      secilenTalepID: '',
      talepTarihi: '',
      talepSaati: '',
      kapanmaTarihi: '',
      kapanmaSaati: '',
      talepteBulunan: '',
      talepteBulunanID: '',
      lokasyonTanim: '',
      lokasyonID: '',
      departman: null,
      departmanID: '',
      irtibatTelefonu: '',
      email: '',
      iletisimSekli: null,
      iletisimSekliID: '',
      talepTipi: null,
      talepTipiID: '',
      isKategorisi: null,
      isKategorisiID: '',
      servisNedeni: null,
      servisNedeniID: '',
      atolye: '',
      oncelikTanim: '',
      oncelikID: '',
      bildirilenBina: null,
      bildirilenBinaID: '',
      bildirilenKat: null,
      bildirilenKatID: '',
      ilgiliKisi: '',
      ilgiliKisiID: '',
      konu: '',
      aciklama: '',
      makine: '',
      makineID: '',
      makineTanim: '',
      ekipman: '',
      ekipmanID: '',
      ekipmanTanim: '',
      makineDurumu: null,
      makineDurumuID: '',
      isEmriTipi: null,
      isEmriTipiID: '',
      planlananBaslamaTarihi: '',
      planlananBaslamaSaati: '',
      planlananBitisTarihi: '',
      planlananBitisSaati: '',
      isEmriNo: '',
      isEmriNoID: '',
      baslamaTarihi: '',
      baslamaSaati: '',
      bitisTarihi: '',
      bitisSaati: '',
      not: '',
      sonuc: '',
      degerlendirme: '',

      // ... Tüm default değerleriniz
    },
  });

  const { setValue, reset } = methods;

  useEffect(() => {
    const handleDataFetchAndUpdate = async () => {
      if (open) {
        try {
          const response = await AxiosInstance.get(`IsTalepParametre`);
          const data = response;
          const item = data[0]; // Veri dizisinin ilk elemanını al

          // Form alanlarını set et
          setValue('oncelikTanim', item.ISP_ONCELIK_TEXT);
          setValue('oncelikID', item.ISP_ONCELIK_ID);
          setValue('talepTipi', item.ISP_VARSAYILAN_IS_TIPI_TEXT);
          setValue('talepTipiID', item.ISP_VARSAYILAN_IS_TIPI);
          setIsDisabled(item.ISP_DUZENLEME_TARIH_DEGISIMI);
          setFieldRequirements({
            lokasyonTanim: item.ISP_LOKASYON,
            irtibatTelefonu: item.ISP_IRTIBAT_TEL,
            email: item.ISP_MAIL,
            departman: item.ISP_DEPARTMAN,
            iletisimSekli: item.ISP_ILETISIM_SEKLI,
            talepTipi: item.ISP_BILDIRIM_TIPI,
            isKategorisi: item.ISP_IS_KATEGORI,
            servisNedeni: item.ISP_SERVIS_NEDEN,
            oncelikTanim: item.ISP_ONCELIK,
            bildirilenBina: item.ISP_BINA,
            bildirilenKat: item.ISP_KAT,
            ilgiliKisi: item.ISP_IS_TAKIPCI,
            konu: item.ISP_KONU,
            aciklama: item.ISP_ACIKLAMA,
            makine: item.ISP_MAKINE_KOD,
            ekipman: item.ISP_EKIPMAN_KOD,
            makineDurumu: item.ISP_ZOR_MAKINE_DURUM_KOD_ID,
            isEmriTipi: item.ISP_ZOR_ISEMRI_TIPI_ID,
            planlananBaslamaTarihi: item.ISP_PLANLANAN_BASLAMA_TARIH,
            planlananBitisTarihi: item.ISP_PLANLANAN_BITIS_TARIH,
            // Diğer alanlar için de benzer şekilde...
          });
        } catch (error) {
          console.error('Veri çekilirken hata oluştu:', error);
        }
      }
    };

    handleDataFetchAndUpdate();
  }, [open, setValue, methods.reset]);

  // aşağıdaki useEffect verileri form elemanlarına set etmeden önce durum güncellemesi yapıyor ondan sonra verileri set ediyor

  useEffect(() => {
    const handleDataFetchAndUpdate = async () => {
      if (drawerVisible && selectedRow) {
        let shouldFetchData = true;

        // Eğer IST_DURUM_ID 0 ise, önce durumu güncelle
        if (selectedRow.IST_DURUM_ID === 0) {
          try {
            await AxiosInstance.post('UpdateIsTalep', {
              TB_IS_TALEP_ID: selectedRow.key,
              IST_DURUM_ID: 1, // IST_DURUM_ID'yi 1 yaparak güncelleme yap
            });
            console.log('Durum başarıyla güncellendi');
            onRefresh();
            methods.reset();
          } catch (error) {
            console.error('Durum güncellenirken hata oluştu:', error);
            shouldFetchData = false; // Hata oluşursa, veri çekme işlemine geçme
          }
        }

        // Durum güncellemesi başarılıysa veya IST_DURUM_ID zaten 0 değilse, veri çekme işlemine geç
        if (shouldFetchData) {
          setLoading(true); // Yükleme başladığında
          try {
            const response = await AxiosInstance.get(`GetIsTalepById?isTalepId=${selectedRow.key}`);
            const data = response;
            const item = data[0]; // Veri dizisinin ilk elemanını al

            // Form alanlarını set et
            setValue('secilenTalepID', item.TB_IS_TALEP_ID);
            setValue('talepKodu', item.IST_KOD);
            setValue('talepTarihi', dayjs(item.IST_ACILIS_TARIHI));
            setValue('talepSaati', dayjs(item.IST_ACILIS_SAATI, 'HH:mm:ss')); // Saat değerini doğru formatla set et
            setValue('kapanmaTarihi', item.IST_KAPAMA_TARIHI ? (dayjs(item.IST_KAPAMA_TARIHI).isValid() ? dayjs(item.IST_KAPAMA_TARIHI) : null) : null);
            setValue('kapanmaSaati', item.IST_KAPAMA_SAATI ? (dayjs(item.IST_KAPAMA_SAATI, 'HH:mm:ss').isValid() ? dayjs(item.IST_KAPAMA_SAATI, 'HH:mm:ss') : null) : null);

            setValue('talepteBulunan', item.IST_TALEP_EDEN_ADI);
            setValue('talepteBulunanID', item.IST_TALEP_EDEN_ID);
            setValue('secilenTalepID', item.TB_IS_TALEP_ID);
            setValue('lokasyonTanim', item.IST_BILDIREN_LOKASYON);
            setValue('lokasyonID', item.IST_BILDIREN_LOKASYON_ID);
            setValue('departman', item.IST_DEPARTMAN); // bu alan adi api'de yok
            setValue('departmanID', item.IST_DEPARTMAN_ID);
            setValue('irtibatTelefonu', item.IST_IRTIBAT_TELEFON);
            setValue('email', item.IST_MAIL_ADRES);
            setValue('iletisimSekli', item.IST_IRTIBAT);
            setValue('iletisimSekliID', item.IST_IRTIBAT_KOD_KOD_ID);
            setValue('talepTipi', item.IST_TIP_TANIM);
            setValue('talepTipiID', item.IST_TIP_KOD_ID);
            setValue('isKategorisi', item.IST_KATEGORI_TANIMI);
            setValue('isKategorisiID', item.IST_KOTEGORI_KODI_ID);
            setValue('servisNedeni', item.IST_SERVIS_NEDENI);
            setValue('servisNedeniID', item.IST_SERVIS_NEDENI_KOD_ID);
            setValue('atolye', item.IST_ATOLYE_GRUBU_TANIMI);
            setValue('oncelikTanim', item.IST_ONCELIK);
            setValue('oncelikID', item.IST_ONCELIK_ID);
            setValue('bildirilenBina', item.IST_BINA);
            setValue('bildirilenBinaID', item.IST_BILDIRILEN_BINA);
            setValue('bildirilenKat', item.IST_KAT);
            setValue('bildirilenKatID', item.IST_BILDIRILEN_KAT);
            setValue('ilgiliKisi', item.IST_TAKIP_EDEN_ADI);
            setValue('ilgiliKisiID', item.IST_IS_TAKIPCISI_ID);
            setValue('konu', item.IST_TANIMI);
            setValue('aciklama', item.IST_ACIKLAMA);
            setValue('makine', item.IST_MAKINE_KOD);
            setValue('makineID', item.IST_MAKINE_ID);
            setValue('makineTanim', item.IST_MAKINE_TANIM);
            setValue('ekipman', item.IST_EKIPMAN_KOD);
            setValue('ekipmanID', item.IST_EKIPMAN_ID);
            setValue('ekipmanTanim', item.IST_EKIPMAN_TANIM);
            setValue('makineDurumu', item.IST_MAKINE_DURUM);
            setValue('makineDurumuID', item.IST_MAKINE_DURUM_KOD_ID);
            setValue('isEmriTipi', item.ISEMRI_TIPI);
            setValue('isEmriTipiID', item.IST_ISEMRI_TIP_ID);

            setValue(
              'planlananBaslamaTarihi',
              item.IST_PLANLANAN_BASLAMA_TARIHI ? (dayjs(item.IST_PLANLANAN_BASLAMA_TARIHI).isValid() ? dayjs(item.IST_PLANLANAN_BASLAMA_TARIHI) : null) : null
            );
            setValue(
              'planlananBaslamaSaati',
              item.IST_PLANLANAN_BASLAMA_SAATI ? (dayjs(item.IST_PLANLANAN_BASLAMA_SAATI, 'HH:mm:ss').isValid() ? dayjs(item.IST_PLANLANAN_BASLAMA_SAATI, 'HH:mm:ss') : null) : null
            );

            setValue(
              'planlananBitisTarihi',
              item.IST_PLANLANAN_BITIS_TARIHI ? (dayjs(item.IST_PLANLANAN_BITIS_TARIHI).isValid() ? dayjs(item.IST_PLANLANAN_BITIS_TARIHI) : null) : null
            );
            setValue(
              'planlananBitisSaati',
              item.IST_PLANLANAN_BITIS_SAATI ? (dayjs(item.IST_PLANLANAN_BITIS_SAATI, 'HH:mm:ss').isValid() ? dayjs(item.IST_PLANLANAN_BITIS_SAATI, 'HH:mm:ss') : null) : null
            );

            setValue('isEmriNo', item.IST_ISEMRI_NO);
            setValue('isEmriNoID', item.IST_ISEMRI_ID);

            setValue('baslamaTarihi', item.IST_BASLAMA_TARIHI ? (dayjs(item.IST_BASLAMA_TARIHI).isValid() ? dayjs(item.IST_BASLAMA_TARIHI) : null) : null);
            setValue('baslamaSaati', item.IST_BASLAMA_SAATI ? (dayjs(item.IST_BASLAMA_SAATI, 'HH:mm:ss').isValid() ? dayjs(item.IST_BASLAMA_SAATI, 'HH:mm:ss') : null) : null);

            setValue('bitisTarihi', item.IST_BITIS_TARIHI ? (dayjs(item.IST_BITIS_TARIHI).isValid() ? dayjs(item.IST_BITIS_TARIHI) : null) : null);
            setValue('bitisSaati', item.IST_BITIS_SAATI ? (dayjs(item.IST_BITIS_SAATI, 'HH:mm:ss').isValid() ? dayjs(item.IST_BITIS_SAATI, 'HH:mm:ss') : null) : null);

            setValue('not', item.IST_NOT);
            setValue('sonuc', item.IST_SONUC);
            setValue('degerlendirme', item.IST_ON_DEGERLENDIRME);
            // ... Diğer setValue çağrıları

            setLoading(false); // Yükleme tamamlandığında
            setOpen(true); // İşlemler tamamlandıktan sonra drawer'ı aç
          } catch (error) {
            console.error('Veri çekilirken hata oluştu:', error);
            setLoading(false); // Hata oluştuğunda
            if (navigator.onLine) {
              // İnternet bağlantısı var
              message.error('Hata Mesajı: ' + error.message);
            } else {
              // İnternet bağlantısı yok
              message.error('Internet Bağlantısı Mevcut Değil.');
            }
          }
        }
      }
    };

    handleDataFetchAndUpdate();
  }, [drawerVisible, selectedRow, setValue, onRefresh, methods.reset]);

  const formatDateWithDayjs = (dateString) => {
    const formattedDate = dayjs(dateString);
    return formattedDate.isValid() ? formattedDate.format('YYYY-MM-DD') : '';
  };

  const formatTimeWithDayjs = (timeObj) => {
    const formattedTime = dayjs(timeObj);
    return formattedTime.isValid() ? formattedTime.format('HH:mm:ss') : '';
  };

  const onSubmit = (data) => {
    // Form verilerini API'nin beklediği formata dönüştür
    const Body = {
      TB_IS_TALEP_ID: data.secilenTalepID,
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
      IST_ISEMRI_TIP_ID: data.isEmriTipiID,
      IST_PLANLANAN_BASLAMA_TARIHI: formatDateWithDayjs(data.planlananBaslamaTarihi),
      IST_PLANLANAN_BASLAMA_SAATI: formatTimeWithDayjs(data.planlananBaslamaSaati),
      IST_PLANLANAN_BITIS_TARIHI: formatDateWithDayjs(data.planlananBitisTarihi),
      IST_PLANLANAN_BITIS_SAATI: formatTimeWithDayjs(data.planlananBitisSaati),
      IST_ISEMRI_ID: data.isEmriNoID,
      IST_BASLAMA_TARIHI: formatDateWithDayjs(data.baslamaTarihi),
      IST_BASLAMA_SAATI: formatTimeWithDayjs(data.baslamaSaati),
      IST_BITIS_TARIHI: formatDateWithDayjs(data.bitisTarihi),
      IST_BITIS_SAATI: formatTimeWithDayjs(data.bitisSaati),
      IST_NOT: data.not,
      IST_SONUC: data.sonuc,
      IST_ON_DEGERLENDIRME: data.degerlendirme,
      // Diğer alanlarınız...
    };

    // API'ye POST isteği gönder
    AxiosInstance.post('UpdateIsTalep', Body)
      .then((response) => {
        console.log('Data sent successfully:', response);
        if (response.status_code === 200 || response.status_code === 201) {
          message.success('Ekleme Başarılı.');
          setOpen(false);
          onRefresh();
          methods.reset();
          onDrawerClose();
        } else if (response.status_code === 401) {
          message.error('Bu işlemi yapmaya yetkiniz bulunmamaktadır.');
        } else {
          message.error('Ekleme Başarısız.');
        }
      })
      .catch((error) => {
        // Handle errors here, e.g.:
        console.error('Error sending data:', error);

        if (navigator.onLine) {
          // İnternet bağlantısı var
          message.error('Hata Mesajı: ' + error.message);
        } else {
          // İnternet bağlantısı yok
          message.error('Internet Bağlantısı Mevcut Değil.');
        }
      });
    console.log({ Body });
  };

  const onClose = () => {
    Modal.confirm({
      title: 'İptal etmek istediğinden emin misin?',
      content: 'Kaydedilmemiş değişiklikler kaybolacaktır.',
      okText: 'Evet',
      cancelText: 'Hayır',
      onOk: () => {
        setOpen(false);
        reset();
        onDrawerClose();
      },
    });
  };

  // kayıdın durum id sine göre o o ekrana tıklandığında gözüken bütün form elemanlarını disablede edip etmeme işlemi

  useEffect(() => {
    // Örneğin, durum ID'si 4 (Kapandı) veya 5 (İptal Edildi) olduğunda formu disabled yap
    if (selectedRow?.IST_DURUM_ID === 3 || selectedRow?.IST_DURUM_ID === 4 || selectedRow?.IST_DURUM_ID === 5) {
      setDisabled(true);
    } else {
      setDisabled(false);
    }
  }, [selectedRow]);

  // kayıdın durum id sine göre o o ekrana tıklandığında gözüken bütün form elemanlarını disablede edip etmeme işlemi sonu

  // açılan kayıdın durumunu apiden gelen id ye göre drawerin yukarısında gösteriyor

  const StatusTitle = ({ statusId }) => {
    const getStatusProps = (statusId) => {
      switch (statusId) {
        case 0:
          return { message: 'Açık', color: '#1890ff' }; // Ant Design 'blue'
        case 1:
          return { message: 'Bekliyor', color: '#ff5e00' };
        case 2:
          return { message: 'Planlandı', color: '#ffe600' };
        case 3:
          return { message: 'Devam Ediyor', color: '#00d300' };
        case 4:
          return { message: 'Kapandı', color: '#575757' };
        case 5:
          return { message: 'İptal Edildi', color: '#d10000' };
        default:
          return { message: 'Bilinmiyor', color: 'gray' };
      }
    };

    const hexToRGBA = (hex, opacity) => {
      // Hex kodunu R, G, B değerlerine dönüştür
      let r = parseInt(hex.slice(1, 3), 16),
        g = parseInt(hex.slice(3, 5), 16),
        b = parseInt(hex.slice(5, 7), 16);

      // RGBA formatında string döndür
      return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    };

    const { message, color } = getStatusProps(statusId);

    return (
      <div style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
        <div>İş Talebi Güncelle</div>
        <Tag
          style={{
            textAlign: 'center',
            backgroundColor: hexToRGBA(color, 0.1),
            border: `1.2px solid ${hexToRGBA(color, 0.7)}`,
            color: color,
          }}
        >
          {message}
        </Tag>
      </div>
    );
  };

  // açılan kayıdın durumunu apiden gelen id ye göre drawerin yukarısında gösteriyor sonu

  return (
    <FormProvider {...methods}>
      <ConfigProvider locale={tr_TR}>
        <Drawer
          width="1600px"
          title={<StatusTitle statusId={selectedRow ? selectedRow.IST_DURUM_ID : null} />}
          placement="right"
          onClose={onClose}
          open={open}
          extra={
            <Space>
              <Button onClick={onClose}>İptal</Button>
              <Button
                disabled={disabled}
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
          {loading ? (
            <Spin
              spinning={loading}
              size="large"
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
              }}
            >
              {/* İçerik yüklenirken gösterilecek alan */}
            </Spin>
          ) : (
            <form onSubmit={methods.handleSubmit(onSubmit)}>
              <MainTabs disabled={disabled} isDisabled={isDisabled} fieldRequirements={fieldRequirements} />
              <SecondTabs disabled={disabled} fieldRequirements={fieldRequirements} />
              <Footer />
            </form>
          )}
        </Drawer>
      </ConfigProvider>
    </FormProvider>
  );
}
