import React, { useState, useEffect } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Modal, Button, Input, DatePicker, Select, Row, Col, Typography, message, InputNumber } from "antd";
import dayjs from "dayjs";
import AxiosInstance from "../../../../../api/http";
import MakineTablo from "../../../YakitHareketleri/components/MakineTablo";

const { Text, Title } = Typography;

const YakitCikisModal = ({ visible, onClose, onRefresh }) => {
  const [loading, setLoading] = useState(false);
  const [depolar, setDepolar] = useState([]);
  const { 
    control,
    watch, 
    setValue, 
    formState: { errors } // <--- Eksik olan kısım tam olarak burası!
  } = useFormContext();

  const watchMakineId = watch("MakineId");
  const watchMKN_KOD = watch("MKN_KOD");

  const [formData, setFormData] = useState({
    TarihSaat: dayjs(),
    Miktar: 0,
    KaynakDepoId: null,
    MakineId: null,
    BelgeNo: "",
    Aciklama: "",
  });

  useEffect(() => {
    if (visible) {
      fetchDepoListesi();
      setFormData({ TarihSaat: dayjs(), Miktar: 0, KaynakDepoId: null, BelgeNo: "", Aciklama: "" });
      setValue("MakineId", null);
      setValue("MKN_KOD", "");
    }
  }, [visible, setValue]);

  const fetchDepoListesi = async () => {
  try {
    const res = await AxiosInstance.post("GetYakitTankList", { 
      LokasyonIds: [], 
      YakitTipIds: [], 
      Durum: -1 
    });

    let list = [];

    // 1. İhtimal: Axios standart (res.data.data)
    if (res?.data?.data && Array.isArray(res.data.data)) {
      list = res.data.data;
    } 
    // 2. İhtimal: Interceptor kullanılmış (res.data)
    else if (res?.data && Array.isArray(res.data)) {
      list = res.data;
    }
    // 3. İhtimal: Çok sadeleştirilmiş response (res)
    else if (Array.isArray(res)) {
      list = res;
    }

    if (list.length > 0) {
      setDepolar(list.map(item => ({ 
        value: item.TB_DEPO_ID, 
        label: `${item.DEP_KOD} (${item.DEP_TANIM})` 
      })));
    } else {
      console.warn("Liste boş veya yapılamadı:", res);
    }
    
  } catch (err) { 
    message.error("Tank listesi yüklenemedi."); 
    console.error("Hata detayı:", err);
  }
};

  const handleSave = async () => {
    // KONTROL: formData.MakineId yerine watchMakineId kullanıyoruz
    if (formData.Miktar <= 0 || !formData.KaynakDepoId) {
      return message.error("Lütfen eksik alanları doldurunuz.");
    }

    setLoading(true);
    try {
      const payload = {
        ...formData,
        MakineId: watchMakineId, // Hook Form'dan gelen ID'yi alıyoruz
        IslemTipi: "CIKIS",
        HedefDepoId: -1,
        TarihSaat: formData.TarihSaat.format("YYYY-MM-DDTHH:mm:ss")
      };

      await AxiosInstance.post("AddYakitIslemi", payload);
      message.success("Çıkış işlemi kaydedildi.");
      onClose(); 
      if (onRefresh) onRefresh();
    } catch (error) { 
      message.error("Hata oluştu."); 
    } finally { 
      setLoading(false); 
    }
  };

  return (
    <Modal title={<Title level={5}>Yakıt Çıkış</Title>} open={visible} onCancel={onClose}
      footer={[<Button key="b" onClick={onClose}>Vazgeç</Button>, <Button key="s" type="primary" onClick={handleSave} loading={loading}>Kaydet</Button>]}
    >
      <Row gutter={[16, 16]}>
        <Col span={24}><Text strong>Kaynak Tank</Text>
          <Select style={{ width: "100%", marginTop: "5px" }} placeholder="Seçiniz..." value={formData.KaynakDepoId} onChange={(val) => setFormData({...formData, KaynakDepoId: val})} options={depolar} />
        </Col>
        <Col span={24}><Text strong>Makine / Araç</Text>
          <MakineTablo
                    control={control}
                    setValue={setValue}
                    makineFieldName="MKN_KOD"
                    makineIdFieldName="MakineId"
                    errors={errors} // Hata durumunu içeri paslıyoruz
          />
        </Col>
        <Col span={12}><Text strong>Tarih / Saat</Text>
          <DatePicker showTime style={{ width: "100%", marginTop: "5px" }} value={formData.TarihSaat} onChange={(val) => setFormData({...formData, TarihSaat: val})} format="DD.MM.YYYY HH:mm" />
        </Col>
        <Col span={12}><Text strong>Miktar (Litre)</Text>
          <InputNumber style={{ width: "100%", marginTop: "5px" }} value={formData.Miktar} onChange={(val) => setFormData({...formData, Miktar: val})} />
        </Col>
        <Col span={24}><Text strong>Açıklama</Text>
          <Input style={{ marginTop: "5px" }} value={formData.Aciklama} onChange={(e) => setFormData({...formData, Aciklama: e.target.value})} />
        </Col>
      </Row>
    </Modal>
  );
};
export default YakitCikisModal;