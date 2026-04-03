import React, { useEffect, useState } from "react";
import { Modal, Form, Input, InputNumber, Checkbox, Row, Col, Button, Typography, Spin, message } from "antd";
import { FormProvider, useForm } from "react-hook-form";
import AxiosInstance from "../../../../../../../../api/http";
import KodIDSelectbox from "../../../../../../../../utils/components/KodIDSelectbox";

const { TextArea } = Input;
const { Title, Text } = Typography;

const Profil = ({ open, onClose, updateData, onRefresh }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [isFormTouched, setIsFormTouched] = useState(false);

  const methods = useForm();

  useEffect(() => {
    if (open) {
      setIsFormTouched(false);
      if (updateData?.TB_AP_ID) {
        fetchProfilDetail(updateData.TB_AP_ID);
      } else {
        form.resetFields();
        methods.reset();
      }
    }
  }, [open, updateData, form, methods]);

  const fetchProfilDetail = (id) => {
    setLoading(true);
    AxiosInstance.get(`GetAmortismanProfilById?id=${id}`)
      .then((res) => {
        if (res && !res.has_error && res.data) {
          const item = res.data;

          // 1. Ant Design Formu setle
          form.setFieldsValue(item);

          // 2. React Hook Form (KodIDSelectbox) setle
          // DİKKAT: KodIDSelectbox içindeki mantık gereği `${name1}ID` şeklinde setliyoruz.
          
          methods.setValue("AmacText", item.AmacText);
          methods.setValue("AmacTextID", item.AmacKodId); // KodIDSelectbox bunu bekliyor

          methods.setValue("YontemText", item.YontemText);
          methods.setValue("YontemTextID", item.YontemKodId);

          methods.setValue("HurdaDegerYontemText", item.HurdaDegerYontemText);
          methods.setValue("HurdaDegerYontemTextID", item.HurdaDegerYontemKodId);

          methods.setValue("YasHesaplamaText", item.YasHesaplamaText);
          methods.setValue("YasHesaplamaTextID", item.YasHesaplamaKodId);

          methods.setValue("BaslangicKuralText", item.BaslangicKuralText);
          methods.setValue("BaslangicKuralTextID", item.BaslangicKuralKodId);

          methods.setValue("AsgariDegerKuralText", item.AsgariDegerKuralText);
          methods.setValue("AsgariDegerKuralTextID", item.AsgariDegerKuralKodId);

          methods.setValue("HesaplamaBazText", item.HesaplamaBazText);
          methods.setValue("HesaplamaBazTextID", item.HesaplamaBazKodId);
          
          methods.setValue("ParaBirimiText", item.ParaBirimiText);
          methods.setValue("ParaBirimiTextID", item.ParaBirimiKodId);
        }
      })
      .catch((err) => {
        console.error("Detay hatası:", err);
        message.error("Profil detayları yüklenemedi.");
      })
      .finally(() => setLoading(false));
  };

  const onFinish = (values) => {
    setLoading(true);
    const methodsValues = methods.getValues();

    const payload = {
      TB_AP_ID: updateData?.TB_AP_ID || 0,
      Varsayilan: values.Varsayilan || false,
      Kod: values.Kod,
      Ad: values.Ad,
      Aciklama: values.Aciklama || "",
      SalvageOrani: values.SalvageOrani || 0,
      ScrapKatsayisi: values.ScrapKatsayisi || 0,
      FizikselOmur: values.FizikselOmur || 0,
      
      // KodIDSelectbox'tan gelen verileri alırken `${name1}ID` ismini kullanıyoruz
      AmacKodId: methodsValues.AmacTextID || null,
      YontemKodId: methodsValues.YontemTextID || null,
      HurdaDegerYontemKodId: methodsValues.HurdaDegerYontemTextID || null,
      YasHesaplamaKodId: methodsValues.YasHesaplamaTextID || null,
      BaslangicKuralKodId: methodsValues.BaslangicKuralTextID || null,
      AsgariDegerKuralKodId: methodsValues.AsgariDegerKuralTextID || null,
      HesaplamaBazKodId: methodsValues.HesaplamaBazTextID || null,
      ParaBirimiKodId: methodsValues.ParaBirimiTextID || null,
    };

    AxiosInstance.post("AddUpdateAmortismanProfil", payload)
      .then((res) => {
        const responseData = res?.data || res;
        if (responseData && responseData.has_error) {
          message.error(responseData.status || "Bir hata oluştu.");
        } else {
          message.success("İşlem başarılı.");
          onRefresh();
          onClose();
        }
      })
      .catch((err) => {
        message.error("Bağlantı hatası.");
      })
      .finally(() => setLoading(false));
  };

  const handleCancel = () => {
    if (isFormTouched) {
      Modal.confirm({
        title: "İptal etmek istediğinize emin misiniz?",
        content: "Kaydedilmemiş değişiklikler kaybolacaktır.",
        okText: "Evet",
        cancelText: "Hayır",
        centered: true,
        onOk: () => {
          form.resetFields();
          methods.reset();
          onClose();
        },
      });
    } else {
      onClose();
    }
  };

  return (
    <Modal
      open={open}
      onCancel={handleCancel}
      footer={null}
      width={800}
      centered
      destroyOnClose
      styles={{ body: { maxHeight: 'calc(100vh - 200px)', overflowY: 'auto', paddingRight: '8px' } }}
      title={
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '95%' }}>
          <Title level={4} style={{ margin: 0 }}>{updateData ? "Profil Güncelleme" : "Yeni Profil"}</Title>
        </div>
      }
    >
      <Spin spinning={loading}>
        <FormProvider {...methods}>
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            initialValues={{ Varsayilan: false }}
            style={{ marginTop: '20px' }}
            onValuesChange={() => setIsFormTouched(true)}
          >
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
              <Form.Item name="Varsayilan" valuePropName="checked" noStyle>
                <Checkbox>Varsayılan</Checkbox>
              </Form.Item>
            </div>

            {/* --- GENEL BİLGİLER --- */}
            <div style={{ padding: '16px', border: '1px solid #f0f0f0', borderRadius: '8px', marginBottom: '16px' }}>
              <Text strong style={{ display: 'block', marginBottom: '12px' }}>Genel Bilgiler</Text>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="Profil adı" name="Ad" rules={[{ required: true, message: 'Zorunlu alan!' }]}>
                    <Input placeholder="Örn: Transfer Değeri Profili" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Profil kodu" name="Kod">
                    <Input placeholder="AMR-TRF-001" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Amaç">
                    <KodIDSelectbox name1="AmacText" kodID={14360} placeholder="Amaç Seçiniz" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Yöntem">
                    <KodIDSelectbox name1="YontemText" kodID={14361} placeholder="Yöntem Seçiniz" />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item label="Açıklama" name="Aciklama">
                    <TextArea rows={3} />
                  </Form.Item>
                </Col>
              </Row>
            </div>

            {/* --- HESAP PARAMETRELERİ --- */}
            <div style={{ padding: '16px', border: '1px solid #f0f0f0', borderRadius: '8px', marginBottom: '16px' }}>
              <Text strong style={{ display: 'block', marginBottom: '12px' }}>Hesap parametreleri</Text>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="Salvage oranı (%)" name="SalvageOrani">
                    <InputNumber style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Scrap katsayısı (USD / kg)" name="ScrapKatsayisi">
                    <InputNumber style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Fiziksel ömür varsayılanı (yıl)" name="FizikselOmur">
                    <InputNumber style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Kalıntı / hurda değer yöntemi">
                    <KodIDSelectbox name1="HurdaDegerYontemText" kodID={14362} placeholder="Seçiniz" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Para Birimi">
                    <KodIDSelectbox name1="ParaBirimiText" kodID={14367} placeholder="Seçiniz" />
                  </Form.Item>
                </Col>
              </Row>
            </div>

            {/* --- UYGULAMA KURALLARI --- */}
            <div style={{ padding: '16px', border: '1px solid #f0f0f0', borderRadius: '8px' }}>
              <Text strong style={{ display: 'block', marginBottom: '12px' }}>Uygulama kuralları</Text>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="Yaş hesaplama tipi">
                    <KodIDSelectbox name1="YasHesaplamaText" kodID={14363} placeholder="Seçiniz" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Başlangıç tarihi kuralı">
                    <KodIDSelectbox name1="BaslangicKuralText" kodID={14364} placeholder="Seçiniz" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Asgari net değer kuralı">
                    <KodIDSelectbox name1="AsgariDegerKuralText" kodID={14365} placeholder="Seçiniz" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Hesaplama Bazı">
                    <KodIDSelectbox name1="HesaplamaBazText" kodID={14366} placeholder="Seçiniz" />
                  </Form.Item>
                </Col>
              </Row>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px', gap: '8px' }}>
              <Button onClick={handleCancel}>Vazgeç</Button>
              <Button 
                type="primary" 
                loading={loading}
                onClick={() => form.submit()} 
                style={{ backgroundColor: "#2bc770", borderColor: "#2bc770" }}
              >
                {updateData ? "Güncelle" : "Kaydet"}
              </Button>
            </div>
          </Form>
        </FormProvider>
      </Spin>
    </Modal>
  );
};

export default Profil;