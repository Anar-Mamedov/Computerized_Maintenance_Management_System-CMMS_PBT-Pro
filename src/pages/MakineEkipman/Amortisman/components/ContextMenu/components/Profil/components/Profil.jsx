import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Select, InputNumber, Checkbox, Row, Col, Button, Typography, Spin, message } from "antd";
import { FormProvider, useForm } from "react-hook-form"; // react-hook-form'dan bunları ekledik
import AxiosInstance from "../../../../../../../../api/http";
import KodIDSelectbox from "../../../../../../../../utils/components/KodIDSelectbox";

const { TextArea } = Input;
const { Title, Text } = Typography;

const Profil = ({ open, onClose, updateData, onRefresh }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [isFormTouched, setIsFormTouched] = useState(false);

  // KodIDSelectbox'ın içindeki react-hook-form yapısını beslemek için:
  const methods = useForm(); 

  useEffect(() => {
    if (open) {
      setIsFormTouched(false);
      if (updateData?.TB_AP_ID) {
        fetchProfilDetail(updateData.TB_AP_ID);
      } else {
        form.resetFields();
        methods.reset(); // react-hook-form'u sıfırla
      }
    }
  }, [open, updateData, form, methods]);

  const fetchProfilDetail = (id) => {
  setLoading(true);
  AxiosInstance.get(`GetAmortismanProfilById?id=${id}`)
    .then((res) => {
      if (res && !res.has_error && res.data) {
        const item = res.data;

        // Ant Design Formu (Düz inputlar için)
        form.setFieldsValue(item);

        // KodIDSelectbox'lar için React Hook Form (methods) setleme işlemleri
        // name1: Tanım (Görünen), name1 + "ID": KodID (Arka plan)

        // Amaç
        methods.setValue("AmacText", item.AmacText); // Selectbox içinde "Muhasebe" yazar
        methods.setValue("AmacKodId", item.AmacKodId); // Arka planda 5525 tutar

        // Yöntem
        methods.setValue("YontemText", item.YontemText);
        methods.setValue("YontemKodId", item.YontemKodId);

        // Kalıntı / Hurda Değer Yöntemi
        methods.setValue("HurdaDegerYontemText", item.HurdaDegerYontemText);
        methods.setValue("HurdaDegerYontemKodId", item.HurdaDegerYontemKodId);

        // Yaş Hesaplama Tipi
        methods.setValue("YasHesaplamaText", item.YasHesaplamaText);
        methods.setValue("YasHesaplamaKodId", item.YasHesaplamaKodId);

        // Başlangıç Tarihi Kuralı
        methods.setValue("BaslangicKuralText", item.BaslangicKuralText);
        methods.setValue("BaslangicKuralKodId", item.BaslangicKuralKodId);

        // Asgari Net Değer Kuralı
        methods.setValue("AsgariDegerKuralText", item.AsgariDegerKuralText);
        methods.setValue("AsgariDegerKuralKodId", item.AsgariDegerKuralKodId);

        // Özel Parametre Kullanımı
        methods.setValue("HesaplamaBazText", item.HesaplamaBazText);
        methods.setValue("HesaplamaBazKodId", item.HesaplamaBazKodId);

        // Diğer Standart Alanlar
        methods.setValue("Ad", item.Ad);
        methods.setValue("Kod", item.Kod);
        methods.setValue("Aciklama", item.Aciklama);
        methods.setValue("SalvageOrani", item.SalvageOrani);
        methods.setValue("ScrapKatsayisi", item.ScrapKatsayisi);
        methods.setValue("FizikselOmur", item.FizikselOmur);
        methods.setValue("Varsayilan", item.Varsayilan);
      }
    })
    .catch((err) => {
      console.error("Detay hatası:", err);
      message.error("Profil detayları yüklenemedi.");
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
      AmacKodId: methodsValues.AmacKodId || null,
      YontemKodId: methodsValues.YontemKodId || null,
      HurdaDegerYontemKodId: methodsValues.HurdaDegerYontemKodId || null,
      YasHesaplamaKodId: methodsValues.YasHesaplamaKodId || null,
      BaslangicKuralKodId: methodsValues.BaslangicKuralKodId || null,
      AsgariDegerKuralKodId: methodsValues.AsgariDegerKuralKodId || null,
      HesaplamaBazKodId: methodsValues.HesaplamaBazKodId || null,
    };

    AxiosInstance.post("AddUpdateAmortismanProfil", payload)
      .then((res) => {
        // HATA BURADAYDI: res?.data veya direkt res kontrolü yapıyoruz
        // Genelde Axios interceptor'lar veriyi res.data olarak döndürür.
        const responseData = res?.data || res; 

        if (responseData && responseData.has_error) {
          message.error(responseData.status || "Bir hata oluştu.");
        } else if (responseData) {
          message.success(responseData.status || "İşlem başarılı.");
          onRefresh(); 
          onClose();
        }
      })
      .catch((err) => {
        console.error("API Hatası:", err);
        message.error("Bağlantı hatası oluştu.");
      })
      .finally(() => setLoading(false));
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
        {/* ÖNEMLİ: KodIDSelectbox'ın çalışması için FormProvider şart */}
        <FormProvider {...methods}>
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            initialValues={{ Varsayilan: false }}
            style={{ marginTop: '20px' }}
            onValuesChange={() => setIsFormTouched(true)}
          >
            <div style={{ 
    display: 'flex', 
    justifyContent: 'flex-end', 
    alignItems: 'center', 
    marginBottom: '16px',
    padding: '0 4px' 
  }}>
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

            {/* --- FOOTER --- */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginTop: '20px' }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                <Button onClick={handleCancel}>Vazgeç</Button>
                <Button 
                  type="primary" 
                  loading={loading}
                  onClick={() => form.submit()} 
                  style={{ backgroundColor: "#2bc770", borderColor: "#2bc770", color: "#fff" }}
                >
                  {updateData ? "Güncelle" : "Kaydet"}
                </Button>
              </div>
            </div>
          </Form>
        </FormProvider>
      </Spin>
    </Modal>
  );
};

export default Profil;