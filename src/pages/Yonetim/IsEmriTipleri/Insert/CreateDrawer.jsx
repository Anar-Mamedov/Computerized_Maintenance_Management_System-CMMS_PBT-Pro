import tr_TR from 'antd/es/locale/tr_TR';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Drawer, Space, ConfigProvider, Modal, message, Input, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import { useForm, Controller, useFormContext, FormProvider } from 'react-hook-form';
import dayjs from 'dayjs';
import AxiosInstance from '../../../../api/http';
import Footer from '../Footer';
// import SecondTabs from "./components/secondTabs/secondTabs";

const { Text, Link } = Typography;

export default function CreateDrawer({ selectedLokasyonId, onRefresh }) {
  const [open, setOpen] = useState(false);
  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    Modal.confirm({
      title: 'İptal etmek istediğinden emin misin?',
      content: 'Kaydedilmemiş değişiklikler kaybolacaktır.',
      okText: 'Evet',
      cancelText: 'Hayır',
      onOk: () => {
        setOpen(false);
        methods.reset();
      },
      onCancel: () => {
        // Do nothing, continue from where the user left off
      },
    });
  };

  //* export
  const methods = useForm({
    defaultValues: {
      yenIseEmriTipiAdi: '',
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

  const { setValue, reset, control, watch } = methods;

  const name = watch('yenIseEmriTipiAdi');

  //* export
  const onSubmit = (data) => {
    // AxiosInstance.post("/api/endpoint", { Body }).then((response) => {
    // handle response
    // });

    AxiosInstance.get(`AddIsEmriTipi?isEmriTipiKey=${name}`)
      .then((response) => {
        // Handle successful response here, e.g.:
        console.log('Data sent successfully:', response);
        if (response.status_code === 200 || response.status_code === 201) {
          message.success('Ekleme Başarılı.');
          setOpen(false);
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
  };

  return (
    <FormProvider {...methods}>
      <ConfigProvider locale={tr_TR}>
        <Button
          type="primary"
          onClick={showDrawer}
          style={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <PlusOutlined />
          Ekle
        </Button>
        <Drawer
          width="550px"
          title="İş Emri Tipi Ekle"
          placement={'right'}
          onClose={onClose}
          open={open}
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
                Kaydet
              </Button>
            </Space>
          }
        >
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Text style={{ fontSize: '14px', fontWeight: '600' }}>İş Emri Tipi Adı:</Text>
              <Controller
                name="yenIseEmriTipiAdi"
                control={control}
                rules={{ required: 'Alan Boş Bırakılamaz!' }}
                render={({ field, fieldState: { error } }) => (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', width: '300px' }}>
                    <Input
                      {...field}
                      status={error ? 'error' : ''}
                      type="text" // Set the type to "text" for name input
                    />
                    {error && <div style={{ color: 'red' }}>{error.message}</div>}
                  </div>
                )}
              />
            </div>
            <Footer />
          </form>
        </Drawer>
      </ConfigProvider>
    </FormProvider>
  );
}
